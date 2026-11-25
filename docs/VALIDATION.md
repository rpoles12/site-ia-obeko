# Validação da entrega

Data de referência: **24 de novembro de 2026**, America/Sao_Paulo. O relatório de captura usa timestamp UTC, portanto pode indicar 25 de novembro.

## Escopo executado

| Verificação | Evidência / resultado |
| --- | --- |
| Integridade da distribuição | Sete arquivos de assets preservados byte a byte, com SHA-256 em `original-assets.json` |
| Sintaxe do bundle | `node --check` no JavaScript recebido |
| Referências | Assets do HTML e links locais da documentação conferidos por `scripts/check.mjs` |
| Handler do servidor local | Chamadas em processo: HTML/JS, HEAD, bloqueio de caminho reservado/traversal, arquivo inexistente e método não suportado |
| Institucional desktop | Screenshot em 1440 × 900 |
| Catálogo | Modal com 52 cards, agrupados por marca |
| Primeira interação | Diagnóstico preliminar e perguntas de refinamento |
| Segunda interação | Diagnóstico final e três recomendações |
| Mobile | Screenshots em 390 × 844; largura do documento observada: 390 px |
| Erros de execução no roteiro | Nenhum evento `pageerror` no Chromium |

O relatório bruto está em [capture-report.json](media/capture-report.json). As mídias estão descritas em [MEDIA.md](MEDIA.md).

## Roteiro real executado

1. Abrir o institucional.
2. Abrir o catálogo e conferir a quantidade de cards.
3. Fechar o catálogo e entrar em IA.
4. Enviar: “Quero algo fresco para usar no trabalho.”
5. Aguardar o diagnóstico preliminar.
6. Enviar: “Prefiro algo discreto, limpo e fresco para o trabalho durante o dia em clima quente.”
7. Conferir diagnóstico final e três sugestões.
8. Voltar ao institucional e abrir as duas telas em viewport móvel.

Recomendações observadas, na ordem:

- Chrome Eau de Toilette — Azzaro.
- Montblanc Legend Spirit — Montblanc.
- Acqua di Giò Eau de Toilette — Giorgio Armani.

As sugestões são saídas reais do motor embutido. Não houve mock de consulta, alteração de catálogo ou substituição de mensagens.

## Condições e limites

O navegador usado foi Chromium headless, via Playwright 1.62.1. O ambiente bloqueou a navegação HTTP por loopback. Para capturar, o navegador recebeu os arquivos reais diretamente do disco, por interceptação de requisições no domínio de teste `obeko.test`. Isso mantém HTML, CSS, JS, imagens e lógica originais sem uma dependência de rede.

O Google Fonts não pôde ser carregado nessa captura; as imagens e o vídeo usam as fontes alternativas do CSS. Não foram alteradas as fontes declaradas na aplicação. O relatório identifica o modo offline, e a reprodução em ambiente com rede pode apresentar diferenças tipográficas.

O teste móvel é uma emulação de viewport, não um teste em aparelho físico. Não foram verificados Safari, Firefox, leitores de tela, todos os objetivos da consulta, robustez semântica do ranking ou operação de contatos externos. Não foram medidos Core Web Vitals, conversão ou satisfação de usuários.

O funcionamento completo em hospedagem pública não foi verificado, pois não houve deploy. As limitações do código recebido estão em [ARCHITECTURE.md](ARCHITECTURE.md).
