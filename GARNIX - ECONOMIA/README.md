# GARNIX — ECONOMIA

Diretório de trabalho da economia da temporada. Todo material de projeto, cálculo e verificação vive aqui.

**Regra:** nenhum valor entra num `.yml` de plugin sem estar derivado de um número deste diretório. Todo YAML editado cita o tier de onde o número saiu.

---

## Índice

| Arquivo | O que é | Status |
|---|---|---|
| [00-PLANO.md](00-PLANO.md) | O plano completo. **Documento vivo** — atualizado a cada decisão | ✅ |
| [01-ECONOMIA.md](01-ECONOMIA.md) | Documento mestre: moedas, eixos, leis de projeto, orçamentos | ✅ |
| [02-TIERS.md](02-TIERS.md) | Tabela T1–T20 expandida, com todos os números derivados | ✅ |
| [03-RANKING-APELOES.md](03-RANKING-APELOES.md) | Ranking de poder de cada vantagem + canal de aquisição | ⏳ |
| [04-PARIDADE-SITE.md](04-PARIDADE-SITE.md) | Cada produto do site ↔ sua rota in-game e custo em horas | ⏳ |
| [05-MULTIPLICADORES.md](05-MULTIPLICADORES.md) | O orçamento de 100× detalhado por via | ⏳ |
| [06-ENCANTES.md](06-ENCANTES.md) | Classes A–E de custo de infra, chances, custos, travas | ⏳ |
| [07-LIVROS.md](07-LIVROS.md) | Os 3 sistemas de livro e as tabelas de loot de cada nível | ⏳ |
| [08-CASH.md](08-CASH.md) | Orçamento de cash: faucets, sinks, faixas de preço | ⏳ |
| [09-VERIFICACAO.md](09-VERIFICACAO.md) | Protocolo de testes V1–V8 + resultados medidos | ✅ |
| [10-ITENS.md](10-ITENS.md) | Os ~212 itens ativáveis: força, rota, preço, tier, raridade | ⏳ |
| [11-CACTO.md](11-CACTO.md) | A via do cacto: reinvestimento, freios, paridade | ⏳ |
| [metrics.csv](metrics.csv) | Metas de cronometragem por tier vs medido in-game | ✅ |
| [sim/](sim/) | Simulador em JavaScript — abre `sim/index.html` no navegador | ✅ |
| [bosses-engatilhados/](bosses-engatilhados/) | Os 3 bosses prontos para lançar como update no meio da temporada | ⏳ |

---

## Por onde começar

**1. Fase 0 — os testes (você, in-game).** Nada de YAML muda antes disso. Três dos oito testes podem mover o teto da temporada. Protocolo completo em [09-VERIFICACAO.md](09-VERIFICACAO.md).

| Teste | O que descobre |
|---|---|
| **V1** | O formatter `SUFFIX` tem sufixo para sextilhão? É hardcoded, não existe tabela em YAML nenhum |
| **V2** | Campos de spawner/crate/shop truncam acima de `Long.MAX` (9,22×10¹⁸)? |
| **V3** | `percent: true` **soma ou multiplica**? Todo o orçamento de multiplicadores pivota nisso |
| **V4** | A chave `gems` dos spawners funciona, sendo que o ID da moeda é `gemas`? |
| **V5** | Cronometrar os 4 tetos de throughput: blocos/min, kills/h, fisgadas/h, colheitas/h |
| **V6** | Prestigiar quebra os spawners já colocados? |
| **V7** | O proc de chave dispara em bloco de AoE ou só manual? |
| **V8** | `cost-increase-percent` é composto ou linear? Decide se prestígio 500 é representável |

**2. Fase 1 — documentos e simulador.** É o que está aqui. O simulador já roda: `sim/index.html` no navegador, ou `node sim/sim.js` no terminal. Estado atual: **MODELO CONSISTENTE**.

Ele já corrigiu três coisas que estavam erradas no papel:

| # | O que ele pegou |
|---|---|
1 | **O crescimento de 10×/dia era impossível.** Dava T1 = 100 coins/dia para a casa inteira, duas ordens abaixo do que um jogador novo produz só minerando à mão. O correto é **8×/dia**, derivado das duas pontas físicas |
2 | **O prestígio estourava o teto de multiplicadores.** O +25% do prestígio 500 levava a pilha a 110× contra o teto de 100×. Correção: `fortunate`/`prosperity` com `increase-multiplier: 0.07` em vez de 0.08 → total fecha em **98,0×** |
3 | **O vale de substituição.** Trocar um spawner maxado do tier N por um nu do tier N+1 no mesmo slot deixa aquele slot **192× pior**. Conclusão nova: **o `s.limite` precisa crescer durante a temporada**, para o jogador *adicionar* em vez de *trocar* |

**3. Fase 2 em diante** — mineração como referência, depois a escada, depois as vias, depois os ~212 itens, depois loot, depois shops. Ordem completa e commits atômicos no [00-PLANO.md](00-PLANO.md).

---

## As leis de projeto

Cinco regras que governam qualquer decisão numérica. Detalhe em [01-ECONOMIA.md](01-ECONOMIA.md).

1. **Dois eixos independentes.** Coins fazem os 20 tiers e chegam a sextilhões. Cabeças fazem rank e prestígio, travadas por tempo. Não se misturam.
2. **Coins não pode ditar o servidor.** Coins compram a entrada; a moeda secundária compra a profundidade.
3. **Nunca pode compensar ficar parado.** Empilhar um spawner vale ~3 tiers. Estar 4 tiers atrás é incompensável.
4. **Número grande e frequente na tela.** Entre poucos eventos grandes e muitos frequentes, escolher muitos. Raridade fica na cauda, não no corpo.
5. **Nenhum item ativável sem rota e sem preço.** Se não deve chegar ao jogador, sai do config.

---

## Regras de trabalho

- ⛔ **Kits nunca são editados por aqui.** Os itens estão em base64 e o dono configura à mão no jogo. O entregável é a especificação (kit → chave → quantidade).
- Mudanças de código aprovadas: **C1** (BigInteger), **C2** (valor por nível no Farm), **C6** (prestígio por nível), **C7** (chave só em bloco manual), **C8** (`max-simultaneous` de bosses). Fontes em `Desktop/garnix/sources` — sincronizar `resources/` junto.
- Arquivos que **nunca** podem ser commitados pela metade: os 20 `GarnixRankUP/ranks/*.yml`; os 20 `GarnixSpawners/spawners/*.yml`; `GarnixMining/levels.yml` + `fortunate.yml` + `gemmed.yml`; `GarnixFarm/farms.yml` + `levels.yml` + `prosperity.yml`; `GarnixFishing/rewards.yml` + `skins.yml`; os 8 `GarnixCurrencies/currencies/*.yml`.
- Rodar o simulador depois de cada fase. Tolerância ±25% na renda/h por tier. Fora disso, a fase não fecha.
