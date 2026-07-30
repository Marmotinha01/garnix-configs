// GARNIX - ECONOMIA / simulador
// params.js - todos os parametros do modelo num lugar so.
//
// Mexa aqui para testar cenarios. Nada de numero solto dentro do sim.js.

const PARAMS = {

  // ---------------------------------------------------------------- temporada
  temporada: {
    dias: 20,
    tiers: 20,
    crescimentoPorDia: 8,     // derivado das duas pontas fisicas - ver 02-TIERS.md
    rendaT1: 10000,           // teto fisico de um jogador novo no dia 1
  },

  // ------------------------------------------------- modelo de 3 contas por IP
  // O captcha nao afeta o ganho AFK - ele existe so no ato de comprar,
  // para impedir macro, e quem compra e a conta principal.
  casa: {
    contasAfk: 2,
    horasAfkPorDia: 24,
    pesoAtivoPorHora: 20,     // 1h ativa = 20h de AFK
  },

  perfis: {
    casual:    { horasAtivas: 1, avancoTierPorDia: 0.65 },
    dedicado:  { horasAtivas: 3, avancoTierPorDia: 1.00 },
    hardcore:  { horasAtivas: 8, avancoTierPorDia: 1.35 },
  },

  // ------------------------------------------------ tetos de throughput fisico
  tetos: {
    // ✅ MEDIDO IN-GAME (V5-A): 3.500 blocos em 3 minutos = 19,4 blocos/s.
    //    Nao e taxa de clique - com Efficiency 1000 (PickaxeItem.java:114) a
    //    quebra e instantanea e o jogador SEGURA E ARRASTA, dando ~1 bloco/tick.
    //    Um jogador rapido chega a 4.000/3min = 80.000/h.
    minaBlocosManuaisHora: 70_000,

    // Tamanho da mina, de GarnixMining/data.yml
    //    region: mina:-29:26:10:29:64:68 -> 59 x 39 x 59
    minaBlocosCheia: 135_759,

    // ⚠️ O TETO DA MINA NAO EXISTE NA PRATICA.
    //    O reset-cooldown de 30s daria 16.291.080 blocos/h, MAS a mina nao
    //    guarda estado: sair e voltar reseta. Confirmado in-game, e nao sera
    //    mudado no codigo. Logo o throughput nao tem teto fisico - ele e uma
    //    DECISAO DE PROJETO, definida pelo multiplicador da arvore de AoE.
    //
    //    Alvo escolhido: AoE maximo de ~100x sobre o manual.
    //    70.000 x 100 = 7.000.000 blocos/h no endgame.
    //    Isso equivale a limpar ~51 minas/hora (uma a cada 70s), ou seja usa
    //    ~43% da capacidade de reset - deixa folga e nao exige o truque de
    //    sair e voltar. Com 233x se usaria 100% do cooldown, sem margem.
    aoeMultiplicadorMaximo: 100,
    minaBlocosHora: 7_000_000,

    farmColheitasHora: 4_100_000,    // 22.735 posicoes / regrow 20s
    pescaFisgadasHora: 504,          // intervalo 15s - speed 5, x double 40%
    spawnerKillsHoraPorSlot: 2_700,  // stack cheio / delay 4s
  },

  // ---------------------------------------------------- orcamento de 100x
  // V3 RESOLVIDO no codigo. Formula real, de EffectRewardHelper.java:90-100:
  //
  //   valor = base x fortunate x (1 + booster% + skin% + armadura% + permBonus%) x frenzy
  //
  // - fortunate (enchantMultiplier): MULTIPLICA
  // - frenzy: MULTIPLICA
  // - booster, skin, armadura, permBonus: TODOS SOMAM dentro do (1 + soma)
  //   O booster entra como (multiplicador - 1.0), ou seja um 3x contribui +200%.
  // - permBonus (nos `mining.bonus.<N>`) NAO EMPILHA: o maior no que o jogador
  //   tem vence. Rank e VIP competem pelo mesmo no, nao se somam.
  multiplicadores: {
    // Somam entre si dentro do (1 + soma)
    aditivos: {
      boosterMaximo: 200,      // booster 3x = (3.0 - 1.0) = +200%
      skinTopo: 65,
      armaduraSetTV: 48,       // 4 pecas x 12%
    },
    // O maior destes vence — nao somam. Ver permissionBonus().
    permBonusMaiorVence: {
      bonusRank20: 20,         // +1% por rank, para quem nao tem VIP
      bonusVipGarnix: 35,      // precisa ser MAIOR que o do rank para o VIP valer algo
      prestigio500: 25,
    },
    // Multiplicam
    mult: {
      // increase-multiplier 0.14  ->  1,05 + 99 x 0,14 = 14,91
      // Subiu de 0,07 para 0,14 porque o booster deixou de ser x3
      // multiplicativo e passou a ser +200% aditivo, o que liberou orcamento.
      fortunateNivel100: 14.91,
      frenzyUptimeReal: 1.5,   // nominal 2,0 x ~50% de uptime
    },
    teto: 100,
  },

  // ------------------------------------------------------- empilhamento
  // E o numero que sustenta a lei "nunca compensa ficar parado".
  empilhamento: {
    mobStack: 3,
    spawnerStack: 512,
  },

  // ----------------------------------------------------- orcamento de sinks
  // Fracao da renda diaria do tier que cada sink absorve.
  sinks: {
    spawnerECompraEUpgrades: 0.35,
    maquinas: 0.15,
    limites: 0.10,
    combustivel: 0.08,
    consumiveis: 0.05,
    rankParteEmCoins: 0.02,
  },

  // Multiplicadores de custo em cima do preco do spawner
  custos: {
    spawnerSobreRenda: 0.5,       // spawner N custa 0,5 x renda(N)
    upgradeNivel1: 0.2,           // x preco do spawner
    upgradeNivel2: 1.0,
    upgradeNivel3: 4.0,
    tetoLongSafe: 1e18,           // nada escrito acima disso sem o C1
  },

  // ------------------------------------------------------------------- cash
  cash: {
    dailyMembro: 20,
    dailyVinculado: 8,
    dailyVipCelestial: 40,
    dailyVipGarnix: 120,
    maquinaDeCashPorDia: 5,       // 3-8, limite de 1 por conta
    eventoDificil: 25,            // 10-40, subconjunto dificil
    alvoFreeTemporada: [300, 500],
    tetoWhale: 500_000,
  },

  // ------------------------------------------------------------- chaves
  // ✅ CONFIRMADO NO CODIGO (EnchantHandler.java:180):
  //    "Each block broken by area enchants gets its own Blessed roll"
  //    Ou seja blessed rola em TODO bloco, manual E de area, na chance cheia.
  //    E tasks.blessed-flush-seconds: 30 agrupa as entregas em lotes - foi por
  //    isso que a medicao viu 17 "ativacoes" contendo 65 chaves.
  //
  //    Reconciliacao da medicao in-game: 13 procs de explosivo x 26 blocos de
  //    area = 338, mais ~368 manuais = 706 blocos x 9,21% = 65 chaves. Exato.
  //
  //    CONSEQUENCIA: o C7 (chave so em bloco manual) fica DESNECESSARIO.
  //    O volume e controlado pela CHANCE do blessed, que e config - lever melhor
  //    que mudanca de codigo, e preserva a sensacao de "o AoE choveu chave".
  chaves: {
    kitsResgatesPorDia: 240,      // 20 kits x 4 (6h) x 3 contas, cumulativo

    // blessed rola em todo bloco (manual + area). Hoje 9,21% no nivel 100, o
    // que sobre 2,1e7 blocos/dia daria 1,9 MILHAO de chaves/dia - inviavel.
    // Alvo: ~20.000 chaves/dia so da mineracao -> 20.000 / 2,1e7 = 0,095%
    blessedChanceNivel100: 0.00095,
    cloverChanceNivel50: 0.0008,     // mesma logica no farm

    // 275 bosses/dia sobre ~25.000 chaves/dia = 1,1%
    chanceChaveDeBossNaCrate: 0.011,

    // Recalibradas para ~25.000 aberturas/dia (era ~4.800)
    faixas: {
      recheio: 0.879,
      bom: 0.10,
      raro: 0.02,
      epico: 0.001,
      jackpot: 0.00001,   // 1 a cada ~4 dias
    },
  },

  // -------------------------------------------------------------- escala
  escala: {
    jogadoresParaTestar: [50, 100, 250],
  },
};

// Suporte a Node e navegador
if (typeof module !== 'undefined' && module.exports) module.exports = { PARAMS };
