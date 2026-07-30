# 16 — ESPECIFICAÇÃO DAS CHAVES DOS KITS (D4)

⛔ **Este documento é só a tabela. Eu não edito kit nem base64** — você aplica no jogo, editando cada kit. Foi a sua instrução desde o começo do projeto e ela continua valendo.

Desenho escolhido por você: **chave da banda + caixa nos marcos**.

---

## A regra que faz isso funcionar sem config nova

> **O kit do rank N dá a chave da crate da via da banda do tier N.**

O gate de rank **já está no kit** — quem não chegou ao rank não tem o kit. Então a chave herda o gate de graça: não precisa de `release`, permissão nem checagem nova em lugar nenhum. É o encaixe mais barato do plano inteiro.

---

## A tabela

| Kit (rank) | Mob | Banda | Chave | Qtd | Caixa |
|---|---|---|---|---|---|
1 | Coelho | T1 | `mineracao` | 2 | — |
2 | Porco | T2 | `mineracao` | 2 | — |
3 | Ovelha | T3 | `mineracao` | 3 | — |
4 | Vaca | T4 | `mineracao` | 3 | — |
**5** | **Morcego** | **T5** | `mineracao` | **4** | ⭐ **`mineracao-i` ×1** |
6 | Jaguatirica | T6 | `farm` | 4 | — |
7 | Lobo | T7 | `farm` | 5 | — |
8 | Zumbi | T8 | `farm` | 5 | — |
9 | Esqueleto | T9 | `farm` | 6 | — |
**10** | **Aranha** | **T10** | `farm` | **6** | ⭐ **`farm-i` ×1** |
11 | PigZombie | T11 | `pesca` | 7 | — |
12 | Slime | T12 | `pesca` | 7 | — |
13 | Guardian | T13 | `pesca` | 8 | — |
14 | MagmaCube | T14 | `pesca` | 8 | — |
**15** | **Endermite** | **T15** | `pesca` | **9** | ⭐ **`pesca-i` ×1** |
16 | Bruxa | T16 | `bosses` | 9 | — |
17 | Blaze | T17 | `bosses` | 10 | — |
18 | Golem | T18 | `bosses` | 10 | — |
19 | Ghast | T19 | `bosses` | 11 | — |
**20** | **Wither** | **T20** | `bosses` | **12** | ⭐ **`mineracao-ii` ×1** |

**Soma: 131 chaves + 5 caixas por coleta completa.**

### Por que as vias nessa ordem

Não é decoração. Cada bloco de 5 kits entrega a chave da via que o jogador está aprendendo naquele momento da temporada: mineração nos dias 1–5 (a via de referência, onde todo mundo começa), fazenda nos 6–10, pesca nos 11–15, e `bosses` nos 16–20, quando o volume de chave de boss já importa.

A caixa de marco segue a mesma via do bloco — exceto a do rank 20, que é a **`mineracao-ii`**: a caixa premium, a mesma que o site vende. É a recompensa de ter feito a volta inteira.

---

## O volume, conferido

O kit é cumulativo e as 3 contas coletam em paralelo. No endgame:

```
131 chaves × 4 resgates/dia (cooldown 6h) × 3 contas = 1.572 chaves/dia
```

Contra as **~20.700 aberturas/dia** do servidor inteiro ([15-LOOT.md](15-LOOT.md)), o kit é **~7,6%** do volume. É a proporção certa: o kit dá o retorno constante que faz abrir o jogo valer a pena todo dia, sem virar a fonte principal — essa continua sendo o `blessed` da mineração e o `clover` da fazenda, que são **manuais** e portanto exigem jogar.

---

## Caixa em kit: só nos 4 marcos, e é aqui que mora o risco

Você perguntou uma vez se dar caixa no kit era burrice. Não é — mas os dois itens têm papéis diferentes:

| | Chave de crate | Caixa misteriosa |
|---|---|---|
Papel | canal **abundante** — coins pequeno, XP, material | canal **premium** — armadura, skin de topo, livro |
Em kit | ✅ perfeito, é o retorno de cada sessão | ⚠️ só em marco |

**A razão é dura:** a taxa de faucet de livro é o freio da temporada. Livro não tem preço em coins, então se ele cai fácil o multiplicador chega cedo e a curva de tiers desanda. Uma caixa premium saindo de graça a cada 6h arrebenta esse freio.

Com 4 marcos (ranks 5, 10, 15, 20), a caixa vira **evento raro e memorável** em vez de renda. E os kits VIP semanais/mensais podem levar caixa sem problema — são previsíveis, cabem no orçamento e são benefício de quem paga.

---

## ⚠️ Uma coisa a conferir quando você aplicar

O comando é **`/crates givekey <crate> <jogador> <quantidade>`** — o **id da crate vem primeiro**, não o jogador. É diferente da maioria dos outros `give*` do servidor (`/mina giveskin <jogador> <skin>` tem o jogador primeiro), e eu já escrevi essa ordem invertida três vezes neste projeto antes de conferir no código.

O mesmo vale para a caixa: **`/caixas give <caixa> <jogador> <quantidade>`**.

E como **os plugins não validam comando**, um id errado não dá erro nenhum: o kit entrega e o jogador não recebe nada.
