# 03 — RANKING GERAL DE APELÕES

Ranking de poder de cada vantagem do servidor, e o canal de aquisição de cada uma. É este documento que decide **o que vai para o site**.

**Score** = impacto multiplicativo na renda. Não é opinião: sai da fórmula confirmada no código.

Última atualização: **29/07/2026**

---

## O princípio de distribuição

| Score | Regra |
|---|---|
**1–2** | site **+ rota in-game deliberadamente sofrida.** É aqui que mora a receita |
**3** | **nunca no site.** É a recompensa exclusiva do jogador dedicado |
**4–6** | misto — tiers baixos in-game, topo no site |
**7+** | fácil in-game |

E a regra que atravessa tudo: **todo item do site tem rota in-game.** Alguns por caminhos muito mais difíceis, mas nenhum atrás de paywall.

---

## O ranking

| # | Vantagem | Impacto | Onde está | Canal |
|---|---|---|---|---|
**1** | **`spawnerslimite`** (+1 slot) | multiplica a **única via sem teto físico**. Renda = `slots × valor por slot` | `GarnixFishing/shop.yml`, `/spawner givelimite` | Site (faixa C) + coins **e dracmas**. **Tem que crescer na temporada** (vale de substituição) |
**1b** | **Combustível infinito** | zera o sink recorrente de 360 litros/h da melhor máquina, **para sempre**. Movível, ativo em 1 por vez | `GarnixMachines/fuels.yml` (**sem preço**) | Site (C/D) + jackpot da caixa `garnix`. **Mítico — o item mais raro** |
**1c** | **Matadora hit-kill** | converte volume de chave de boss em volume de recompensa. Com ~250–300 bosses/dia é um multiplicador de faucet inteiro | `GarnixBosses/swords.yml` → `hk` | Site (D) + jackpot. **Mítico −** |
**2** | **Booster 3×** | **+200% aditivo**, e ocupa 3 slots simultâneos (1 por tipo) | 7 plugins, **só comando admin** | **3× é o que o site vende.** 2× é o de crate. Durações in-game: 5m a 1h |
**2b** | **`pilhagem` 3** (livro) | **×2,0 multiplicativo** no drop, direto na via sem teto | `GarnixSpawners/sword.yml` | Site (C) + jackpot. **Mítico −** |
**3** | **`fortunate` / `prosperity` nível 100** | **×14,91 multiplicativo** — o maior multiplicador único do jogo | `GarnixMining/enchants/`, `GarnixFarm/enchants/` | **100% in-game (gemas/sementes). NUNCA no site** |
**3b** | **`massacre` 5** (`value: -1`) | dano infinito → throughput de kill → **cabeças**, que são o gate de todo rank e prestígio | `GarnixSpawners/sword.yml` | níveis 1–4 in-game (dracmas) · **nível 5 = jackpot + site** |
**3c** | **`speed` / `double` da vara** | dobram o throughput da via **mais estrangulada** (504 fisgadas/h) | `GarnixFishing/enchants.yml` | níveis 1–3 **acessíveis in-game** (corais) · 4–5 no site |
**4** | **Armadura T-V + skin de topo** | +48% + 65% = **+113% aditivo** | 60 arquivos `armors/`, 3 `skins.yml` | **Armadura: só caixa, NUNCA no site.** Skin: forja + caixa, e as 3 mais raras também direto no site |
**5** | **`permBonus`** (rank ou VIP) | +20% a +35% aditivo — **o maior nó vence, não somam** | `mining.bonus.<N>` via LuckPerms | Rank = grátis, até +20%. VIP = **substitui** por +24% a +35% |
**5b** | **Desconto de VIP** | −3% a −15% no custo. **Exclusivo do pago** — ranks nunca dão desconto | `ranks.yml` de spawners/máquinas, `discounts.yml` | Site. É a proposta de valor real do VIP |
**5c** | **Vaga de visitante** | dono ganha 35% do XP do visitante + taxa até 40%, ×5 vagas | `GarnixMining/config.yml` → `slot-item` | **Mítico −** (jackpot). VIP entrega no máximo **2 das 5** |
**6** | **Autosell do galpão** | **contorna o `initial-limit: 1500`**, o gargalo da via do cacto | `GarnixWarehouse/config.yml` | **Só cash** + drop raro. Reprecificar de 1.000–3.000 para 150–800/nível |
**6b** | **Britadeira** | coluna inteira, 3×3, **10 simultâneas**, sem cooldown. O maior throughput do jogo | `GarnixMining/config.yml` → `drill` | gemas, caro + crate. **Mantida sem nerf** — ver §Teto real |
**6c** | **Bombas** (raio 2–8) | até ~2.145 blocos por arremesso, 5 simultâneas | `GarnixMining/bombs.yml` | gemas + crate. **Mantidas sem nerf** |
**6d** | **Máquinas especiais** | cada uma faz algo que nenhuma outra faz (cash, limite, moeda secundária, combustível, chaves) | a criar | Site + drop raríssimo. **Lendário** |
**7** | **Chaves de crate** | variância, não renda direta | `GarnixCrates` | abundante in-game (~4.800/dia) |
**7b** | **Caixas misteriosas** | invólucro score 7, **conteúdo score 1–4** | `GarnixMysteryBoxes` | Caixa **I** in-game · caixa **II** site + beeem rara · `garnix` no topo |
**7c** | **Robô auto-abridor** | abre chave a cada 4s | `GarnixCrates/robots.yml` | site + jackpot |
**8** | **Kits, homes, linhas de baú, slots de market** | conveniência | `GarnixEssentials`, permissões `.limit.<N>` | ✅ **valores atuais corretos, não mexer.** Exclusivamente VIP, nunca recompensa |
**9** | **Tags, cosméticos, preview, tag de evento** | **zero** impacto econômico | `GarnixVips`, `GarnixChat`, cash-shop | Site à vontade. A **tag de chat dos eventos in-person** é o prêmio mais desejado depois do cash |

---

## Teto real — por que os "itens sem teto" são seguros

Decisão do dono: britadeira (10 simultâneas), bombas (5), `massacre 5` (`-1`) e matadora `hk` ficam **sem nerf mecânico**, controlados só por preço e raridade.

A análise que faz isso ser seguro: **os quatro estão limitados por oferta a montante, não pelo próprio poder.**

| Item | Poder nominal | Teto real que o limita |
|---|---|---|
Britadeira ×10 | ilimitado | **`reset-cooldown: 30`** — a mina só regenera 135.700 blocos a cada 30s |
Bombas raio 8, ×5 | ilimitado | mesmo teto da mina |
`massacre 5` (`-1`) | dano infinito | **taxa de spawn** (`delay` × `mob-stack`). Matar instantaneamente não cria mob nenhum |
Matadora `hk` | mata qualquer boss | **oferta de chave de boss** (~250–300/dia) |

São itens que **aceleram até o teto**, não que furam o teto. Por isso preço e raridade bastam — e é o que os torna produtos excelentes.

⚠️ **A ressalva:** a curva de tiers passa a depender de **a raridade estar certa**. Esses 4 são os primeiros a conferir no simulador e nos testes de cronometragem.

---

## O que é do site e o que não é

### Vendido no site

| Categoria | Itens |
|---|---|
Premium puro | VIPs (papel + genkey), tags, cosméticos |
Poder de topo | **booster 3×** · **combustível infinito** · **matadora hk** · **`pilhagem` 3** · **`massacre` 5** · máquinas especiais |
Acesso | **caixa II** de mineração/farm/pesca · as **3 skins mais raras** de cada via · chave premium |
Conveniência | `spawnerslimite` extra · autosell do galpão · fly · limites de home/market/leilão/baú |

### Nunca vendido no site

| Item | Por quê |
|---|---|
**`fortunate` / `prosperity`** | ×14,91, o maior multiplicador do jogo. É a recompensa de quem farmou gemas/sementes. Vender isso mataria a razão de jogar |
**Armadura (as 60 peças)** | existe só via caixa. Quem paga compra **chance**, não a peça — a armadura completa é o equipamento de quem jogou |
**Booster de cabeça** | cabeça é o **gate de tempo** do rank e do prestígio. Vender aceleração de cabeça fura o único portão que dinheiro não deveria atravessar |
**Cabeças** | mesma razão. Compráveis entre jogadores (mercado livre), mas não vendidas pelo servidor |
**Níveis 1–3 dos livros de pesca** | a pesca é a via mais fraca; se o básico dela fosse pago, a via inteira ficaria inviável para free |

---

## A regra de paridade

Todo item do site tem rota in-game. A tabela completa de "produto ↔ rota ↔ custo em horas" fica em [04-PARIDADE-SITE.md](04-PARIDADE-SITE.md) (Fase 7, junto com o cash-shop).

O padrão de como a paridade funciona sem ser injusta nem trivial:

| Item | Rota do site | Rota in-game |
|---|---|---|
Combustível infinito | faixa C/D | jackpot da caixa `garnix` — ~0,006% por abertura |
Booster 3× | faixa C, duração longa | jackpot, duração curta (máx. 1h) |
`pilhagem` 3 | faixa C | jackpot |
Caixa II | faixa B | drop beeem raro |
Skin de topo | faixa B/C | forja até a 7ª + caixa para 8–10 |
Armadura T-V | ❌ não vendida | caixa II, faixa Lendária |
`spawnerslimite` | faixa C | corais com câmbio decrescente + dracmas |
VIP | faixa D | `GarnixFragments` → `tag-vip` temporário |

O padrão: **o site vende velocidade e conveniência; o jogo vende as mesmas coisas por sorte ou por tempo.** O que o site nunca vende é o que define o jogador dedicado.
