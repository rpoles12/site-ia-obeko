# Execução e manutenção

## Pré-requisito

Node.js 22 ou superior. Para o site e as verificações não há pacotes a instalar, variáveis secretas ou serviço de banco de dados.

```bash
git clone https://github.com/rpoless/site-ia-obeko.git
cd site-ia-obeko
node scripts/serve.mjs
```

Abra `http://127.0.0.1:4173`. A consultoria está em `/#ia`. O servidor escuta apenas na interface local; não é um servidor de produção. Para alterar a porta, defina `PORT` no seu terminal. Exemplo no PowerShell:

```powershell
$env:PORT = '4180'
node scripts/serve.mjs
```

O `package.json` oferece os atalhos `npm start`, `npm run check` e `npm run capture`; npm não é necessário para os dois primeiros fluxos. Abrir `index.html` diretamente por `file://` pode impedir o carregamento do ES module. Use HTTP.

## Verificações

```bash
node scripts/check.mjs
```

O script verifica checksums dos sete artefatos originais, sintaxe JavaScript, referências do HTML, links locais dos documentos principais e o handler HTTP do servidor, chamado em processo sem conexão de rede. Ele não substitui o teste de interface ou o acesso HTTP em uma hospedagem. O workflow de CI executa a mesma verificação em push e pull request; não publica o site.

## Capturas e gravação opcionais

É necessária uma instalação de Playwright e seu Chromium. A captura entregue foi executada com Playwright 1.62.1. Para reproduzir sem adicionar dependências permanentes ao projeto:

```bash
npm install --no-save --package-lock=false playwright@1.62.1
npx playwright install chromium
node scripts/capture.mjs
```

O script abre um servidor em porta local disponível, grava desktop, captura seis imagens e cria `docs/media/capture-report.json`. Ele substitui as mídias correspondentes; faça commit ou cópia das anteriores antes de gerar uma nova versão.

Para ambientes com bibliotecas instaladas fora do projeto, `PLAYWRIGHT_MODULE` pode apontar para o módulo Playwright. `BROWSER_EXECUTABLE` permite selecionar um executável Chromium já instalado. O modo `OFFLINE_CAPTURE=1` fornece os arquivos reais ao navegador por interceptação de requisições em `obeko.test`, sem acesso à rede; nesse modo, Google Fonts é substituído por CSS vazio e as fontes de fallback são usadas. O relatório registra a condição.

O GIF é uma prévia reduzida do WebM e não é gerado pelo script de captura. Com FFmpeg disponível:

```bash
ffmpeg -y -i docs/media/demo-desktop.webm -vf "fps=8,scale=960:-1:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=96[p];[s1][p]paletteuse=dither=bayer" -loop 0 docs/media/demo-preview.gif
```

## Alterar conteúdo ou componentes

Os fontes não estão presentes. Não há `src/`, `vite.config`, projeto Tailwind ou script de build para editar e recompilar. A manutenção segura começa por recuperar o projeto de desenvolvimento original.

1. Recuperar fontes, dependências e configuração de build.
2. Separar componentes, dados do catálogo e motor de recomendação nos fontes.
3. Corrigir limitações com testes dos comportamentos relevantes.
4. Gerar uma nova distribuição e atualizar as referências do HTML.
5. Atualizar intencionalmente o inventário de integridade, as mídias e a documentação.

Até lá, mantenha `assets/` como distribuição recebida. Não renomeie imagens ou hashes isoladamente: o bundle resolve as imagens usando `import.meta.url`. O manifesto de integridade detecta mudanças, mas não impede uma atualização deliberada documentada.

## Publicação estática

Para o runtime, envie `index.html` e `assets/` juntos. Não é necessário enviar `node_modules/`, scripts ou `.git/` ao provedor.

No GitHub Pages, é possível escolher publicação por branch, apontando para `main` e a raiz, após os arquivos estarem no GitHub. A raiz foi preservada para esse cenário. O diretório `docs/` contém documentação e mídia, não uma distribuição alternativa do site. Não foi feita publicação ou alteração de configuração remota nesta entrega.

Antes de uso comercial, revise os canais de contato e a base. Para usar Open Graph com imagem em redes sociais, configure `og:image` com a URL pública absoluta da capa após definir o endereço do site. Não há URL de produção presumida na documentação.

## Revisão antes de enviar

```bash
node scripts/check.mjs
git status --short
git diff --stat
git diff -- index.html
```

Revise os arquivos adicionados e faça o commit conforme seu fluxo. O histórico do clone deve ser preservado. Consulte [contribuição](../CONTRIBUTING.md) e [limitações](ARCHITECTURE.md).
