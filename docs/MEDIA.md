# Mídias do portfólio

## Inventário

| Arquivo | Finalidade |
| --- | --- |
| [cover.png](media/cover.png) | Capa editorial gerada com a identidade do projeto |
| [demo-desktop.webm](media/demo-desktop.webm) | Gravação da navegação e da consulta real em desktop |
| [demo-preview.gif](media/demo-preview.gif) | Prévia animada para renderização no README do GitHub |
| [01-home-desktop.png](media/screenshots/01-home-desktop.png) | Institucional, 1440 × 900 |
| [02-catalog-desktop.png](media/screenshots/02-catalog-desktop.png) | Catálogo por marca, 1440 × 900 |
| [03-consultation-desktop.png](media/screenshots/03-consultation-desktop.png) | Consultoria inicial, 1440 × 900 |
| [04-recommendations-desktop.png](media/screenshots/04-recommendations-desktop.png) | Três sugestões reais, 1440 × 900 |
| [05-home-mobile.png](media/screenshots/05-home-mobile.png) | Institucional, 390 × 844 |
| [06-consultation-mobile.png](media/screenshots/06-consultation-mobile.png) | Consultoria, 390 × 844 |
| [capture-report.json](media/capture-report.json) | Roteiro, condições, recomendações e erros observados |

## Origem das imagens

Screenshots e gravação são capturas do app recebido, executado no navegador. As respostas são do motor real. O GIF é uma conversão reduzida do vídeo, sem criação de telas fictícias.

A capa foi gerada para esta apresentação a partir da paleta, monograma e ilustração de frascos do projeto. É uma composição editorial, separada das evidências de interface. Não substitui os assets originais da marca.

As capturas desta entrega usam fontes de fallback porque o ambiente de revisão não teve acesso ao Google Fonts. A condição está registrada em [VALIDATION.md](VALIDATION.md).

## Roteiro da gravação

Institucional → catálogo → consultoria → mensagem sobre perfume fresco para trabalho → diagnóstico preliminar → refinamento sobre discrição, calor e uso diurno → três sugestões → retorno ao institucional.

O vídeo não contém áudio. Pausas curtas foram incluídas para leitura dos estados. O GIF reduz resolução, quadros e cores para manter o README leve; o WebM preserva a captura em 1440 × 900.

## Reproduzir

Use `node scripts/capture.mjs` com Playwright instalado. [Instruções e parâmetros](DEVELOPMENT.md). Atualize as mídias após uma mudança significativa de interface e confira visualmente os arquivos antes de substituir os anteriores.
