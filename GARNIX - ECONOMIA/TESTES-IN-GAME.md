# TESTES IN-GAME — checklist

Deixe este arquivo aberto do lado enquanto testa. **Só o Teste 1 é obrigatório**; os outros são rápidos e fecham pendências que não bloqueiam nada.

Ao fim, me manda os números — não precisa formatar, cru serve.

---

## ⭐ Teste 1 — Taxa de clique · **OBRIGATÓRIO** · 4 minutos

É o **último número que trava a Fase 2**. Ele define o volume de chaves do servidor (~4.800/dia hoje no plano) e o uptime do frenzy.

### Preparação

1. Use uma **conta de teste** (ou a sua, desde que **sem encantes de AoE comprados**).
2. Entre na mina.
3. Se a picareta tiver encantes de AoE, remova: **shift + botão direito** na picareta → menu de gerenciar → desencantar. Deixe **zero** de `explosive`, `colapse`, `snake`, `blaze`, `kraken`, `meteor`, `wither`, `annihilation`, `rupture`, `lighthing`, `demolition`.
   - `fortunate`, `gemmed`, `blessed` e `accelerated` **podem ficar** — nenhum deles quebra bloco extra.

### Medição

4. Olhe o **nome da picareta**: `Picareta [X]`. Esse `X` é o total de blocos que você já quebrou. **Anote o X inicial.**
5. Minere **3 minutos** cronometrados, **no ritmo normal de quem está jogando**. Não force o clique nem segure o botão de forma diferente do normal — o que interessa é o ritmo real de jogo.
6. Pare. **Espere 5 segundos** antes de ler (o display atualiza a cada 5s — `pickaxe-display-seconds: 5`).
7. **Anote o X final.**

### O que me mandar

```
X inicial:  ______
X final:    ______
```

Se quiser conferir na hora: `(final − inicial) ÷ 3 × 60 = blocos por hora`.

| | |
|---|---|
Meta atual do plano | 10.000/h |
Banda humana realista | 18.000–29.000/h |
Teto teórico | 72.000/h (1 bloco por tick) |

⚠️ **Se der 20.000 ou mais**, o volume de chaves do servidor dobra ou triplica e eu recalibro as 5 faixas da crate. É por isso que este número importa.

---

## Teste 2 — Reset da mina · 1 minuto

Confirma as duas premissas do teto de 1,63×10⁷ blocos/hora que eu calculei do `data.yml`.

1. Clique no **ícone de relógio** na hotbar (slot de reset).
2. **A mina voltou 100% cheia?** Ou voltou parcial, com buracos?
3. Tente resetar **de novo imediatamente**. O cooldown de 30 segundos é aplicado?

### O que me mandar

```
Mina volta 100% cheia?     sim / não
Cooldown de 30s aplicado?  sim / não
```

---

## Teste 3 — `gems` vs `gemas` · 2 minutos

Os 20 arquivos de spawner usam a chave **`gems`**, mas o ID da moeda é **`gemas`**. Quero saber se é bug ou alias. Não bloqueia nada — os upgrades vão passar a custar **dracmas** de qualquer forma — mas é bom saber.

1. `/gema` — anote o saldo atual.
2. Coloque um spawner qualquer no seu terreno.
3. Mate uns 20 mobs dele (o drop de gema é 25% de chance).
4. `/gema` de novo.

### O que me mandar

```
Saldo de gema mexeu?  sim / não
```

---

## Teste 4 — Chave em bloco de AoE · 3 minutos

Define se a mudança de código **C7** é necessária. Se o proc de chave conta blocos quebrados por AoE, o volume seria **1.600× maior** que o projetado e a crate inteira perderia sentido.

1. `/gema add <você> 100000000` para ter gemas.
2. Pelo menu `/mina`, compre **`blessed`** num nível alto (uns 50+).
3. Compre também **`explosive`** ou **`colapse`** — qualquer um que quebre área.
4. Minere até um AoE disparar.

### O que observar

Quando o AoE explode e quebra dezenas de blocos de uma vez:

- **Chove chave** (várias de uma vez, proporcional aos blocos)? → o proc conta AoE, **C7 é obrigatório**
- **Vem no máximo uma chave**, como se fosse um bloco só? → já conta só manual, **C7 desnecessário**

### O que me mandar

```
Ao disparar AoE, vieram:  muitas chaves / no maximo uma
```

---

## Teste 5 — Prestígio quebra spawner? · 5 minutos

O mais chato de montar, e o mais importante dos opcionais: se o spawner **já colocado** parar de produzir ao prestigiar, o sistema de prestígio precisa de outro desenho inteiro.

1. Numa **conta de teste** (não na sua principal — isso reseta o rank):
   ```
   /ranks set <conta-teste> wither
   ```
   (`wither` é o rank 20, o último)
2. `/spawner give <tipo> <stack>` e coloque **2 ou 3 spawners de tier alto** no terreno.
3. Confirme que estão produzindo (drops caindo, holograma ativo).
4. `/prestigio` e confirme.
5. **Olhe os spawners que já estavam colocados.**

### O que observar

- Continuam produzindo normalmente? → ✅ o desenho de prestígio do plano funciona
- Pararam / sumiram / deram erro? → ⚠️ preciso redesenhar o prestígio

### O que me mandar

```
Spawners colocados apos prestigiar:  continuam produzindo / pararam
Rank foi resetado para o primeiro?   sim / nao
Prestigio subiu para 1?              sim / nao
```

---

## Resumo do que mandar

Copie isto, preencha e me manda:

```
TESTE 1 (obrigatorio)
  X inicial: ______
  X final:   ______

TESTE 2
  Mina volta 100% cheia?     ___
  Cooldown de 30s aplicado?  ___

TESTE 3
  Saldo de gema mexeu?  ___

TESTE 4
  Ao disparar AoE vieram:  ___

TESTE 5
  Spawners apos prestigiar:  ___
  Rank resetou?              ___
  Prestigio subiu?           ___
```

Se só der para fazer o **Teste 1**, já libera a Fase 2 — os outros quatro eu encaixo depois.
