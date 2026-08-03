# Menu `/tutorial` — conteúdo planejado

> Rascunho de conteúdo do menu `/tutorial` (`GarnixEssentials/custom-menus/tutorial.yml`).
> Última atualização: **03/08/2026**. Ainda **não implementado** — hoje o arquivo tem só o ícone de Warps no slot 10.

## Princípio

O tutorial **não é índice dos 40 plugins** e **não é lista de passos**. Ele explica **o que cada sistema é e como funciona**, para o jogador entender as regras do servidor — não para ser conduzido pela mão.

O que ele precisa deixar claro acima de tudo é o loop mestre, que está literalmente codificado na estrutura dos arquivos:

```
rank N  →  libera spawner N  →  cabeças de mob N  →  rank N+1
```

## Os 11 ícones

**Linha de cima (6):** cabeças/rankup · mineração · fazenda · pesca · spawners e máquinas · cacto
**Linha de baixo (5):** runas · moedas · limites · warps · regras

Cabe folgado nas 6 linhas do menu. `warps` e `regras` reaproveitam o que já existe (`/warps`, `/regras`).

---

### 1. Cabeças e RankUP

- Existem **20 ranks com nome de mob** e **20 spawners dos mesmos 20 mobs**, na mesma ordem.
- Subir de rank custa **coins + cabeças do mob anterior**. Ex.: o rank Aranha pede `head BAT 10000` — cabeça de Morcego, o rank de baixo (`GarnixRankUP/ranks/aranha.yml`).
- Cabeça **só cai matando o mob no spawner**, e o spawner de cada mob **só é liberado pelo rank daquele mob** (`spawner.buy.<mob>`). É isso que fecha o ciclo.
- Cabeça é **item negociável** — dá para comprar de outro jogador em vez de farmar. Coins não substituem o rank, mas cabeça comprada sim.
- Cada rank dá **bônus permanente de ganho**, e no fim tem o **prestígio**: volta ao rank 1, a escada fica mais cara, os desbloqueios permanentes ficam.

### 2. Mineração

Paga **coins + gemas**. Gemas compram os encantes da picareta — e coins não compram gema.

### 3. Fazenda

Irmã da mina: mesma mecânica, mesma escada de encantes. Paga **coins + sementes**. Sementes compram os encantes da enxada.

### 4. Pesca

A via mais diferente das outras:

- **Vara própria**, comprada por **10.000 coins**, com nível, XP, skin e encantes só dela.
- Fisga sozinha a cada **15 segundos** — é a via que **roda com o jogador parado**, por isso costuma ficar na conta secundária.
- Paga **10 corais por fisgada** + coins.
- Corais compram vara, livros, skins e — o mais importante — **aumento de limite de spawner e máquina**. É a única via que converte em limite jogando.

> O contraste que ensina: mina e fazenda pagam muito e exigem o jogador na frente do PC; pesca paga pouco por fisgada mas nunca para.

### 5. Spawners e Máquinas

Paga **coins + dracmas + cabeças**. Dracmas pagam as trilhas de upgrade do spawner e os livros da espada. É a renda que roda com o jogador AFK.

### 6. Cacto

Via de primeira classe pareada com as outras: cresce por reinvestimento, vende **só em coins**, e a expansão sai do próprio armazém.

### 7. Runas

São **4**, e cada uma vem de um lugar diferente **de propósito** (`GarnixFragments/runas.yml`):

| Runa | Vem de |
|---|---|
| **Sagrada** | bosses |
| **Eterna** | crates e caixas misteriosas |
| **Divina** | eventos de chat |
| **Primal** | eventos presenciais (PvP) |

- Runa **não é moeda do `/saldo`** — é item. Botão direito armazena, shift + direito junta.
- Gasta na **loja de runas**, e quase todo item lá custa **dois tipos ao mesmo tempo** (a Caixa Skins I pede eterna + sagrada). Não dá para comprar nada bom fazendo só uma coisa.
- **Runa não inflaciona.** 500 runas valem o mesmo no dia 3 e no dia 20, enquanto coins multiplicam por ~6,6 todo dia. É por isso que ela compra o que coin nenhum compra.

> É o ponto mais valioso do tutorial inteiro para o jogador que só olha o saldo de coins.

### 8. Todas as moedas

São **8** (`GarnixCurrencies/currencies/`):

| Moeda | Símbolo | Vem de |
|---|---|---|
| **Coins** | `$` | tudo — minerar, colher, pescar, vender no armazém e na loja |
| **Gemas** | `۞` | minerar |
| **Sementes** | `❋` | colher na fazenda |
| **Corais** | `✶` | pescar |
| **Dracmas** | `✆` | matar mobs de spawner |
| **Cash** | `❂` | recompensa diária, vínculo do Discord, eventos e site |
| **S. Limite** | `∞` | máquina de limite, câmbio de corais, cash-shop |
| **M. Limite** | `∞` | mesma coisa, para máquinas |

Vale dizer que **só coins chega a números gigantes** — as outras ficam pequenas a temporada inteira **de propósito**, não é bug. É o que impede quem tem muito coin de comprar tudo.

### 9. Os três limites

- **S. Limite** — quantos spawners podem estar colocados. Começa em **1**.
- **M. Limite** — quantas máquinas. Começa em **1**.
- **Armazém** — capacidade de estoque do terreno, começa em **3.000** (`GarnixWarehouse/config.yml`), sobe com o item *Limite de Armazém*, e o autosell vende sozinho antes de encher.

> A ideia que fecha a seção: **slot vazio não rende, e limite não se compra em volume** — cada slot tem que ter o melhor spawner que o jogador conseguir pagar. É por isso que subir de tier vale mais que ter muitos spawners fracos.

### 10 e 11. Warps e Regras

Reaproveitam `/warps` (já no menu, slot 10) e `/regras` (`GarnixEssentials/custom-commands.yml`).

---

## Fora do tutorial, de propósito

Bosses, Duelos, CoinFlip, Leilão, Eventos, VIP, encantes de classe D/E, armadura e skins por tier.

Nada disso é decisão de iniciante, e cada ícone a mais dilui os que importam. VIP em tutorial também soa como vitrine — e o Celestial grátis do vínculo do Discord já se vende sozinho.

## Dois avisos que a lore precisa dar

Contraintuitivos, e o jogador só descobre errando:

1. **Coins não sobem rank** — evita acumular 3 dias achando que compra o rank.
2. **Cada via tem uma moeda que coins não compram** — evita ignorar gemas/sementes/corais/dracmas até o dia 10.

## Pendências antes de escrever o YAML

- ⚠️ **Runas divina e primal estão sem fonte definida** (`runas.yml` marca as duas). Se não tiverem rota até o lançamento, o ícone sai ou entra sem a tabela de origens — o tutorial não pode prometer o que o servidor não entrega.
- ⚠️ **Rotas de `s.limite`, `m.limite` e cash ainda em definição** no plano da economia (Fases 4b e 7). Se mudarem, a lore do ícone de moedas muda junto. É a única parte do tutorial que não é estável hoje.
- Escrever o `tutorial.yml` no padrão de display/lore/CTA e definir os slots exatos das duas fileiras.
