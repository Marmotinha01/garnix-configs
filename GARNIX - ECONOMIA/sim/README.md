# Simulador de economia

Verifica se o modelo da temporada fecha. Roda de duas formas.

## No navegador (recomendado)

Dá dois cliques em **`index.html`**. Abre com gráficos e tabelas, sem instalar nada.

## No terminal

```
node sim.js
```

Node 18+ (aqui está rodando na v22).

---

## Arquivos

| Arquivo | O que é |
|---|---|
`params.js` | **todos os parâmetros do modelo.** É aqui que você mexe para testar cenários |
`sim.js` | o motor e os testes. Não tem número solto dentro dele |
`index.html` | a interface de navegador |

---

## O que ele testa

| Teste | Pergunta que responde |
|---|---|
**Tabela de tiers** | renda/dia, ativo/h, AFK/h, passivo/h, valor-base, custo de spawner e rank, sinks — para os 20 tiers |
**Orçamento de multiplicadores** | a pilha total cabe no teto de 100×? E quanto daria se o teste V3 revelar que percentuais multiplicam? |
**S1 — Estagnação** | *para cada tier de 1 a 19*, ficar é melhor que subir? **É o teste mais importante** — pega um erro que só apareceria no dia 15 com o servidor cheio |
**S2 — Banda** | onde cada perfil (casual 1h / dedicado 3h / hardcore 8h) termina no dia 20 |
**Volume de chaves** | chaves/dia no endgame, distribuição por faixa, bosses/dia — e quanto seria sem o C7 |
**Cash** | quanto cada tipo de jogador acumula na temporada inteira |
**Overflow** | quais tiers passam de `Long.MAX` e dependem do C1 |

---

## Precisão numérica

Coins usam **`BigInt`**. A partir do T15 os valores passam de `Number.MAX_SAFE_INTEGER` (9,007×10¹⁵) e um `double` começaria a perder precisão silenciosamente — **exatamente o mesmo problema que o C1 resolve do lado dos plugins**. O simulador não podia ter o bug que ele existe para detectar.

O formatter de sufixo do simulador vai até `De` (10³³), então nunca é ele o gargalo de exibição. Se o formatter do servidor parar antes de sextilhão, o teste **V1** acusa.

---

## Coisas que o simulador já encontrou

Registro do que ele pegou e que não estava óbvio no papel:

**1. O crescimento de 10×/dia era impossível.** Com `tier N = dia N`, o T1 dava 100 coins/dia para a casa inteira — duas ordens abaixo do que um jogador novo produz só minerando à mão (~3.000 blocos/h × 1 coin = 9.000 numa sessão de 3h). O crescimento correto é **8×/dia**, derivado das duas pontas físicas.

**2. O prestígio estourava o teto de multiplicadores.** O +25% do prestígio 500 levava a pilha a 110× contra o teto de 100×. Correção: `fortunate`/`prosperity` com `increase-multiplier: 0.07` (7,98× no nível 100) em vez de 0.08. Total fecha em **98,0×**.

**3. A armadilha do vale de substituição.** Trocar um spawner **maxado** do tier N por um **nu** do tier N+1 no mesmo slot deixa aquele slot **192× pior** até ser re-empilhado (`empilhamento 1536 ÷ ganho por tier 8`).

Consequência de projeto que não estava no plano: **o `s.limite` precisa crescer durante a temporada**, para o jogador *adicionar* spawner em vez de *trocar*. Com slots fixos, subir de tier viraria punição — e seria exatamente a estagnação que a Lei 3 existe para evitar.

---

## Cenários que valem rodar

Edite `params.js` e rode de novo:

| Quer saber | Mexa em |
|---|---|
E se o V3 disser que percentuais multiplicam? | já sai calculado no relatório (`totalSeMultiplicativo`) |
E se a mina entregar menos que 1,6×10⁷ blocos/h? | `tetos.minaBlocosHora` — muda o valor-base de todos os tiers |
E se a pesca ficar em 6s em vez de 15s? | `tetos.pescaFisgadasHora` para ~1.260 |
E se o booster máximo fosse 2× em vez de 3×? | `multiplicadores.mult.boosterMaximo` — sobra folga para o `fortunate` |
E se `spawner-stack` fosse 256 em vez de 512? | `empilhamento.spawnerStack` — muda quantos tiers o empilhamento vale |
E se o daily do membro fosse 30 em vez de 20? | `cash.dailyMembro` |
E se o avanço de tier do casual fosse mais lento? | `perfis.casual.avancoTierPorDia` |

---

## O que ele ainda não faz

Fica para quando os YAMLs estiverem preenchidos:

- **Ler os `.yml` reais do repo.** Hoje o modelo é analítico (parte da fórmula mestre). Quando os valores estiverem escritos, o simulador deve lê-los e comparar contra a tabela — é assim que a tolerância de ±25% por fase é verificada de verdade.
- **Simular 50 / 100 / 250 jogadores** (teste S3): liquidez de cabeças na fronteira, colapso de preço de livro no market, concentração de cash.
- **Contagem de prestígios**, que depende do resultado do V8 e da taxa real de cabeças medida no V5.
