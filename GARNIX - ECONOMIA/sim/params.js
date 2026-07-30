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
  // Calculados dos configs. CONFIRMAR NO TESTE V5 antes de confiar.
  tetos: {
    minaBlocosHora: 16_000_000,      // regiao 59x39x59 / reset-cooldown 30s
    minaBlocosManuaisHora: 10_000,   // o que a mao do jogador quebra
    farmColheitasHora: 4_100_000,    // 22.735 posicoes / regrow 20s
    pescaFisgadasHora: 504,          // intervalo 15s - speed 5, x double 40%
    spawnerKillsHoraPorSlot: 2_700,  // stack cheio / delay 4s
  },

  // ---------------------------------------------------- orcamento de 100x
  // percent: somam entre si. mult: multiplicam. CONFIRMAR NO TESTE V3.
  multiplicadores: {
    percent: {
      armaduraSetTV: 48,      // 4 pecas x 12%
      skinTopo: 65,
      bonusRank20: 20,        // +1% por rank
      bonusVipGarnix: 15,
      prestigio500: 25,       // +0,05% por prestigio
    },
    mult: {
      // increase-multiplier 0.07  ->  1,05 + 99 x 0,07 = 7,98
      // Foi 0.08 (8,97x) ate o simulador acusar que o +25% do prestigio 500
      // levava o total a 110x. 0.07 traz para 98x.
      fortunateNivel100: 7.98,
      frenzyUptimeReal: 1.5,     // nominal 2,0 x ~50% de uptime
      boosterMaximo: 3.0,        // o 3x vendido no site
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
  chaves: {
    kitsResgatesPorDia: 240,      // 20 kits x 4 (6h) x 3 contas, cumulativo
    blessedChancePorBlocoManual: 0.0921,
    cloverChancePorColheitaManual: 0.05,
    chanceChaveDeBossNaCrate: 0.05,
    faixas: {
      recheio: 0.88,
      bom: 0.07,
      raro: 0.05,
      epico: 0.0009,
      jackpot: 0.00006,
    },
  },

  // -------------------------------------------------------------- escala
  escala: {
    jogadoresParaTestar: [50, 100, 250],
  },
};

// Suporte a Node e navegador
if (typeof module !== 'undefined' && module.exports) module.exports = { PARAMS };
