import assert from 'node:assert/strict';
import { mkdir, rename, writeFile, readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import { createServer, root } from './serve.mjs';

// Playwright é opcional; a aplicação e o check não dependem dele.
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const media = path.join(root, 'docs/media');
await mkdir(path.join(media, 'screenshots'), { recursive: true });
await mkdir(path.join(root, '.capture-tmp'), { recursive: true });
const server = await createServer(0);
const offline = process.env.OFFLINE_CAPTURE === '1';
const base = offline ? 'http://obeko.test' : `http://127.0.0.1:${server.address().port}`;
let browser;
const report = { capturedAt: new Date().toISOString(), viewport: { width: 1440, height: 900 }, checks: [], pageErrors: [], failedRequests: [], notes: ['Capturas da versão compilada original, sem respostas simuladas.'] };
async function configureOffline(context) {
  if (!offline) return;
  await context.route('**/*', async route => {
    const url = new URL(route.request().url());
    if (url.hostname !== 'obeko.test') {
      await route.fulfill({ status: 200, contentType: 'text/css', body: '' });
      return;
    }
    const name = decodeURIComponent(url.pathname);
    const file = path.resolve(root, `.${name === '/' ? '/index.html' : name}`);
    const relative = path.relative(root, file);
    if (relative.startsWith('..') || path.isAbsolute(relative)) { await route.abort(); return; }
    const type = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg' }[path.extname(file)] || 'application/octet-stream';
    await route.fulfill({ status: 200, contentType: type, body: await readFile(file) });
  });
}
if (offline) report.notes.push('Ambiente sem rede/loopback: navegador recebeu os arquivos reais por interceptação local, no domínio de teste obeko.test; Google Fonts indisponível, fontes de fallback do CSS utilizadas.');
try {
  browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_EXECUTABLE ? { executablePath: process.env.BROWSER_EXECUTABLE } : {}) });
  const context = await browser.newContext({ viewport: report.viewport, deviceScaleFactor: 1, locale: 'pt-BR', recordVideo: { dir: path.join(root, '.capture-tmp'), size: report.viewport } });
  await configureOffline(context);
  const page = await context.newPage();
  page.on('pageerror', error => report.pageErrors.push(error.message));
  page.on('requestfailed', request => report.failedRequests.push({ url: request.url(), failure: request.failure()?.errorText }));
  const shot = name => page.screenshot({ path: path.join(media, 'screenshots', name) });
  const pause = () => page.waitForTimeout(1600); // Tempo de leitura na gravação.
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.getByRole('heading', { level: 1 }).waitFor();
  await page.evaluate(() => window.scrollTo(0, 0));
  await pause();
  await shot('01-home-desktop.png');
  report.checks.push('Página institucional e assets carregados em 1440 × 900.');
  await page.getByRole('button', { name: 'Catálogo', exact: true }).click();
  await page.getByRole('heading', { name: 'Perfumes por marca.' }).waitFor();
  assert.equal(await page.getByRole('article').filter({ has: page.locator('h4') }).count(), 52);
  await pause();
  await shot('02-catalog-desktop.png');
  report.checks.push('Catálogo aberto com 52 cards e agrupamento por marca.');
  await page.getByRole('button', { name: 'Fechar', exact: true }).click();
  await page.getByRole('button', { name: 'IA', exact: true }).click();
  await page.getByPlaceholder('Descreva o perfume ideal...').waitFor();
  await page.evaluate(() => window.scrollTo(0, 0));
  await pause();
  await shot('03-consultation-desktop.png');
  const input = page.getByPlaceholder('Descreva o perfume ideal...');
  await input.fill('Quero algo fresco para usar no trabalho.');
  await pause();
  await page.getByRole('button', { name: 'Enviar', exact: true }).click();
  await page.getByText('Diagnóstico preliminar', { exact: true }).waitFor();
  await pause();
  report.checks.push('Primeira mensagem produz diagnóstico preliminar e perguntas de refinamento.');
  await input.fill('Prefiro algo discreto, limpo e fresco para o trabalho durante o dia em clima quente.');
  await pause();
  await page.getByRole('button', { name: 'Enviar', exact: true }).click();
  await page.getByRole('heading', { name: 'As melhores opções para o seu perfil.' }).waitFor();
  await page.evaluate(() => window.scrollTo(0, 0));
  await pause();
  await shot('04-recommendations-desktop.png');
  const resultCards = page.getByRole('article').filter({ has: page.locator('h4') });
  assert.equal(await resultCards.count(), 3);
  report.recommendations = await resultCards.locator('h4').allTextContents();
  report.checks.push('Segunda mensagem produz diagnóstico final e três recomendações reais.');
  await page.getByRole('button', { name: 'Institucional', exact: true }).click();
  await page.getByRole('heading', { level: 1 }).waitFor();
  await pause();
  const video = page.video();
  await context.close();
  await rename(await video.path(), path.join(media, 'demo-desktop.webm'));
  const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, locale: 'pt-BR' });
  await configureOffline(mobile);
  const mp = await mobile.newPage();
  mp.on('pageerror', error => report.pageErrors.push(error.message));
  await mp.goto(base, { waitUntil: 'networkidle' });
  await mp.evaluate(() => document.fonts.ready);
  await mp.screenshot({ path: path.join(media, 'screenshots/05-home-mobile.png') });
  await mp.getByRole('button', { name: 'IA', exact: true }).click();
  await mp.getByPlaceholder('Descreva o perfume ideal...').waitFor();
  await mp.evaluate(() => window.scrollTo(0, 0));
  await mp.waitForTimeout(600);
  await mp.screenshot({ path: path.join(media, 'screenshots/06-consultation-mobile.png') });
  report.mobile = await mp.evaluate(() => ({ viewportWidth: window.innerWidth, documentWidth: document.documentElement.scrollWidth }));
  report.checks.push('Institucional e consultoria capturados em viewport móvel de 390 × 844.');
  await mobile.close();
  assert.equal(report.pageErrors.length, 0, report.pageErrors.join('\n'));
  await writeFile(path.join(media, 'capture-report.json'), JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify(report, null, 2));
} finally {
  if (browser) await browser.close();
  await new Promise(resolve => server.close(resolve));
}
