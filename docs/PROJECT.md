# Visão do projeto

## Resumo

O BEKO Scent AI combina um site institucional de perfumaria com uma consultoria olfativa conversacional. O usuário conhece a loja, consulta perfumes por marca e descreve o que procura. A interface traduz essa descrição em diagnóstico e sugestões do catálogo local.

## Problema e solução

O usuário nem sempre conhece famílias ou notas olfativas, mas consegue descrever uma situação ou impressão: um perfume fresco para trabalhar, algo marcante para a noite ou um presente para alguém elegante. O app aceita esse vocabulário e conduz duas interações antes de recomendar.

O benefício proposto é reduzir o esforço de explorar a base e conectar o atendimento à identidade da loja. Não foram fornecidas pesquisas com usuários, métricas de conversão ou evidências de impacto comercial; não são alegadas nesta documentação.

## Jornadas disponíveis

| Jornada | Entrada | Resultado |
| --- | --- | --- |
| Conhecer a marca | Institucional, Sobre, Produtos, Contato | Contexto da perfumaria e links de atendimento |
| Consultar produtos | Botão Catálogo | Modal com perfumes por marca e dados olfativos |
| Escolher para si | “Consultar IA agora” ou objetivo “Para mim” | Diagnóstico, perguntas e três sugestões |
| Escolher presente | Objetivo “É um presente” | Perguntas sobre destinatário e preferência |

## Escopo implementado

Frontend estático com React, CSS compilado, imagens da marca e catálogo embutido. A consultoria funciona localmente: o termo “IA” integra a apresentação do produto, enquanto a implementação entregue usa regras de texto e ranking. Não há backend ou provedor de modelo.

O texto institucional cita fundação em 1995, atuação regional e Tatuí. Essas são informações presentes no app, sem validação externa nesta entrega. Telefone, perfis sociais e endereço precisam de revisão antes de um uso comercial.

## Direção visual

| Elemento | Referência |
| --- | --- |
| Cor principal | `#113345` — azul petróleo |
| Acento | `#237995` — azul da marca |
| Fundo | `#f6f1e4` — off-white quente |
| Títulos | Cormorant Garamond |
| Texto e controles | Manrope |
| Composição | Hierarquia editorial, cards arredondados, transparências e sombras suaves |
| Grafismos | Monograma original e ilustração linear de frascos |

## Entrega de organização

- Preservação dos sete arquivos originais de assets, com inventário e SHA-256.
- Entrada HTML com favicon, tema e metadados sociais básicos.
- Documentação de produto, arquitetura, operação e limitações.
- README com capa gerada, imagens reais e gravação do fluxo.
- Ferramentas locais sem dependências para servir e verificar o repositório.
- Convenções de edição, arquivos ignorados, CI e modelos de issue/PR.

O clone recebido continha somente a distribuição compilada. Nenhum diretório `src/` foi inventado, e o trabalho não pretende reconstruir os fontes ausentes.

Consulte [arquitetura](ARCHITECTURE.md), [desenvolvimento](DEVELOPMENT.md) e [validação](VALIDATION.md).
