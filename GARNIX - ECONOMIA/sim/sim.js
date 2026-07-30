// GARNIX - ECONOMIA / simulador
// sim.js - o motor. Roda no navegador (via index.html) e no Node (node sim.js).
//
// Coins usam BigInt: a partir do T15 os valores passam de Number.MAX_SAFE_INTEGER
// (9,007x10^15), que e exatamente o mesmo cuidado que o C1 pede nos plugins.

'use strict';

const P = (typeof PARAMS !== 'undefined') ? PARAMS : require('./params.js').PARAMS;

// ============================================================ utilitarios

// Divide BigInt por um divisor fracionario sem perder magnitude.
function bigDiv(a, divisor) {
  const escala = 1_000_000n;
  return (a * escala) / BigInt(Math.round(divisor * 1_000_000));
}

function bigMul(a, fator) {
  const escala = 1_000_000n;
  return (a * BigInt(Math.round(fator * 1_000_000))) / escala;
}

// Sufixos IDENTICOS aos do servidor, copiados de
// garnix-core/shared/.../formatter/NumberFormatter.java (SUFFIXES).
// Assim o numero no documento e o numero na tela do jogador sao o mesmo texto.
// Atencao a convencao do plugin: Q = 10^15 (quadrilhao), QQ = 10^18 (quintilhao),
// S = 10^21 (sextilhao) - nosso teto.
const SUFIXOS = [
  [10n ** 63n, 'V'],  [10n ** 60n, 'ND'], [10n ** 57n, 'OD'], [10n ** 54n, 'ST'],
  [10n ** 51n, 'SD'], [10n ** 48n, 'QN'], [10n ** 45n, 'QD'], [10n ** 42n, 'TD'],
  [10n ** 39n, 'DD'], [10n ** 36n, 'UD'], [10n ** 33n, 'D'],  [10n ** 30n, 'N'],
  [10n ** 27n, 'O'],  [10n ** 24n, 'SS'], [10n ** 21n, 'S'],  [10n ** 18n, 'QQ'],
  [10n ** 15n, 'Q'],  [10n ** 12n, 'T'],  [10n ** 9n,  'B'],  [10n ** 6n,  'M'],
  [10n ** 3n,  'K'],
];

function fmt(v) {
  if (typeof v === 'number') {
    if (!isFinite(v)) return '-';
    if (Math.abs(v) < 1000) return (Math.round(v * 100) / 100).toString();
    v = BigInt(Math.round(v));
  }
  const neg = v < 0n;
  if (neg) v = -v;
  for (const [lim, suf] of SUFIXOS) {
    if (v >= lim) {
      const inteiro = v / lim;
      const resto = ((v % lim) * 100n) / lim;
      const s = inteiro.toString() + (resto > 0n ? ',' + resto.toString().padStart(2, '0') : '');
      return (neg ? '-' : '') + s + suf;
    }
  }
  return (neg ? '-' : '') + v.toString();
}

// ============================================================ nucleo do modelo

// renda diaria da casa no tier N = rendaT1 x crescimento^(N-1)
// O crescimento e fracionario (6,61), entao acumulo em escala inteira para
// manter BigInt sem perder precisao nos tiers altos.
function rendaTier(n) {
  const { rendaT1, crescimentoPorDia } = P.temporada;
  const escala = 1_000_000n;
  const g = BigInt(Math.round(crescimentoPorDia * 1_000_000));
  let v = BigInt(rendaT1) * escala;
  for (let i = 1; i < n; i++) v = (v * g) / escala;
  return v / escala;
}

// Unidades da casa: 2 contas AFK x 24h x 1 + 1 conta ativa x Hh x 20
function unidadesCasa(horasAtivas) {
  const { contasAfk, horasAfkPorDia, pesoAtivoPorHora } = P.casa;
  const afk = contasAfk * horasAfkPorDia;
  const ativo = horasAtivas * pesoAtivoPorHora;
  return { afk, ativo, total: afk + ativo };
}

// Reparticao da renda no tier N para um perfil
function reparticao(n, horasAtivas) {
  const renda = rendaTier(n);
  const u = unidadesCasa(horasAtivas);
  const porUnidade = bigDiv(renda, u.total);
  return {
    renda,
    unidades: u,
    afkPorHora: porUnidade,
    afkPorContaPorDia: porUnidade * BigInt(P.casa.horasAfkPorDia),
    ativoPorHora: porUnidade * BigInt(P.casa.pesoAtivoPorHora),
    passivoPorHora: bigDiv(renda, 24),   // via de spawners roda 24h
    percentAtivo: (u.ativo / u.total) * 100,
  };
}

// Valor-base de uma unidade (bloco / colheita / fisgada), sem multiplicador.
// Ancorado nas duas pontas: T1 = 1 coin, T20 = ativo/h / (teto de blocos x teto de mult).
function valorBaseUnidade(n) {
  const { tiers } = P.temporada;
  const ativoT20 = reparticao(tiers, P.perfis.dedicado.horasAtivas).ativoPorHora;
  const baseT20 = Number(ativoT20) / (P.tetos.minaBlocosHora * P.multiplicadores.teto);
  const razao = Math.pow(baseT20, 1 / (tiers - 1));
  return Math.pow(razao, n - 1);
}

// ============================================================ multiplicadores

// Formula real, confirmada no codigo (EffectRewardHelper.java:90-100):
//   valor = base x fortunate x (1 + Saditivos + permBonusMaior) x frenzy
function orcamentoMultiplicadores() {
  const m = P.multiplicadores;

  const somaAditivos = Object.values(m.aditivos).reduce((a, b) => a + b, 0);

  // permissionBonus(): "The nodes do not stack: the largest one the player holds wins."
  const permEntradas = Object.entries(m.permBonusMaiorVence);
  const permMaior = Math.max(...permEntradas.map(([, v]) => v));
  const permVencedor = permEntradas.find(([, v]) => v === permMaior)[0];
  const permIgnorados = permEntradas.filter(([, v]) => v < permMaior);

  const somaPercent = somaAditivos + permMaior;
  const blocoAditivo = 1 + somaPercent / 100;
  const blocoMult = Object.values(m.mult).reduce((a, b) => a * b, 1);
  const total = blocoAditivo * blocoMult;

  return {
    somaAditivos, permMaior, permVencedor, permIgnorados,
    somaPercent, blocoAditivo, blocoMult, total,
    teto: m.teto,
    dentroDoTeto: total <= m.teto * 1.05,
    // Quanto o fortunate poderia valer para o total bater exatamente no teto
    fortunateIdeal: m.teto / (blocoAditivo * m.mult.frenzyUptimeReal),
    // Quanto seria se o booster multiplicasse em vez de somar (nao e o caso)
    totalSeBoosterMultiplicasse:
      (1 + (somaPercent - m.aditivos.boosterMaximo) / 100) * blocoMult * 3.0,
  };
}

// ============================================================ testes

// S1 - TESTE DE ESTAGNACAO. O mais importante do simulador.
// Para cada tier, "ficar e melhor que subir?" Se sim em qualquer N, a curva esta errada.
function testeEstagnacao() {
  const { tiers, crescimentoPorDia: g } = P.temporada;
  const { mobStack, spawnerStack } = P.empilhamento;
  const empMax = mobStack * spawnerStack;
  const tiersQueOEmpilhamentoVale = Math.log(empMax) / Math.log(g);

  const linhas = [];
  for (let n = 1; n < tiers; n++) {
    const vN = valorBaseUnidade(n);
    const vN1 = valorBaseUnidade(n + 1);

    // Slots sao escassos (s.limite linear + dracmas), entao a comparacao
    // correta e POR SLOT, nao por coin gasto.
    const porSlotFicandoEmpilhado = vN * empMax;
    const porSlotSubindoEmpilhado = vN1 * empMax;
    const porSlotSubindoNu = vN1;

    // Custo de empilhar tudo no tier N vs comprar o spawner do tier N+1
    const c = P.custos;
    const precoSpawnerN = Number(rendaTier(n)) * c.spawnerSobreRenda;
    const custoUpgradesN = precoSpawnerN * (c.upgradeNivel1 + c.upgradeNivel2 + c.upgradeNivel3);
    const precoSpawnerN1 = Number(rendaTier(n + 1)) * c.spawnerSobreRenda;

    linhas.push({
      tier: n,
      valorUnidade: vN,
      porSlotFicandoEmpilhado,
      porSlotSubindoNu,
      porSlotSubindoEmpilhado,
      // um spawner nu do tier N+1 ja bate um empilhado do tier N?
      subirNuBateFicarEmpilhado: porSlotSubindoNu >= porSlotFicandoEmpilhado,
      // subir E empilhar sempre bate ficar e empilhar - isso e o que precisa valer
      subirSempreBate: porSlotSubindoEmpilhado > porSlotFicandoEmpilhado,
      custoEmpilharN: custoUpgradesN,
      custoSpawnerN1: precoSpawnerN1,
      // dias de renda para cada caminho
      diasParaEmpilharN: custoUpgradesN / Number(rendaTier(n)),
      diasParaSubir: precoSpawnerN1 / Number(rendaTier(n)),
    });
  }

  const falhas = linhas.filter(l => !l.subirSempreBate);

  // ARMADILHA DO VALE DE SUBSTITUICAO
  // Se os slots forem escassos e FIXOS, o jogador precisa TROCAR um spawner
  // maxado do tier N por um NU do tier N+1 - e isso e uma PERDA de empMax/g vezes
  // naquele slot, ate ele re-empilhar. Se os slots crescem, ele so ADICIONA e
  // nunca sente o vale.
  const perdaAoTrocar = empMax / g;   // quantas vezes pior fica o slot na troca

  return {
    empilhamentoMaximo: empMax,
    crescimentoPorTier: g,
    tiersQueOEmpilhamentoVale,
    quatroTiersAtrasIncompensavel: Math.pow(g, 4) > empMax,
    perdaAoTrocar,
    // Conclusao de projeto: s.limite PRECISA crescer durante a temporada.
    exigeSlotsCrescentes: perdaAoTrocar > 1,
    linhas,
    falhas,
    aprovado: falhas.length === 0 && Math.pow(g, 4) > empMax,
  };
}

// S2 - TESTE DE BANDA. Onde cada perfil termina.
function testeBanda() {
  const { dias, tiers } = P.temporada;
  const out = {};
  for (const [nome, perfil] of Object.entries(P.perfis)) {
    let acumulado = 0n;
    const serie = [];
    for (let dia = 1; dia <= dias; dia++) {
      // Progresso de tier e por calendario+dedicacao, limitado ao teto de 20
      const tierFrac = Math.min(tiers, 1 + (dia - 1) * perfil.avancoTierPorDia);
      const tier = Math.max(1, tierFrac);
      // interpola a renda entre tiers inteiros
      const baixo = Math.floor(tier), alto = Math.min(tiers, baixo + 1);
      const frac = tier - baixo;
      const rBaixo = Number(rendaTier(baixo));
      const rAlto = Number(rendaTier(alto));
      const rendaDia = rBaixo * Math.pow(rAlto / rBaixo, frac);
      // fatia da casa proporcional as horas do perfil
      const uPerfil = unidadesCasa(perfil.horasAtivas).total;
      const uRef = unidadesCasa(P.perfis.dedicado.horasAtivas).total;
      const rendaAjustada = rendaDia * (uPerfil / uRef);
      acumulado += BigInt(Math.round(rendaAjustada));
      serie.push({ dia, tier: Math.round(tier * 100) / 100, rendaDia: rendaAjustada, acumulado });
    }
    out[nome] = { perfil, serie, final: acumulado };
  }
  return out;
}

// Volume de chaves e bosses no endgame
function testeChaves() {
  const c = P.chaves;
  const t = P.tetos;
  const horasAtivas = P.perfis.dedicado.horasAtivas;

  // blessed rola em TODO bloco quebrado - manual E de area (EnchantHandler:180).
  const blocosTotaisDia = t.minaBlocosHora * horasAtivas;
  const blocosManuaisDia = t.minaBlocosManuaisHora * horasAtivas;

  const deKits = c.kitsResgatesPorDia;
  const deMineracao = blocosTotaisDia * c.blessedChanceNivel100;
  const deFarm = t.farmColheitasHora * horasAtivas * c.cloverChanceNivel50 * 0.02; // farm manual e menor
  const outras = 300;
  const total = deKits + deMineracao + deFarm + outras;

  // Quanto seria com a chance de HOJE (9,21%) - mostra por que precisa cair
  const comChanceDeHoje = blocosTotaisDia * 0.0921;

  const faixas = {};
  for (const [k, v] of Object.entries(c.faixas)) faixas[k] = total * v;
  const somaFaixas = Object.values(c.faixas).reduce((a, b) => a + b, 0);

  return {
    deKits, deMineracao, deFarm, outras, total,
    blocosTotaisDia, blocosManuaisDia,
    comChanceDeHoje,
    fatorComChanceDeHoje: comChanceDeHoje / deMineracao,
    faixas, somaFaixas,
    faixasSomamUm: Math.abs(somaFaixas - 1) < 0.01,
    bossesPorDia: total * c.chanceChaveDeBossNaCrate,
    lotesDeBossPorDia: (total * c.chanceChaveDeBossNaCrate) / 25,
    // Aberturas por clique necessarias para nao virar tarefa braçal
    cliquesPorDiaCom500: total / 500,
  };
}

// Orcamento de cash na temporada
function testeCash() {
  const { dias } = P.temporada;
  const c = P.cash;
  const free = c.dailyMembro * dias;
  const freeVinculado = (c.dailyMembro + c.dailyVinculado) * dias;
  const comEventos = freeVinculado + c.eventoDificil * 12;
  const garnix = (c.dailyMembro + c.dailyVinculado + c.dailyVipGarnix) * dias;
  const comMaquina = comEventos + c.maquinaDeCashPorDia * dias * 1;
  return {
    free, freeVinculado, comEventos, comMaquina, garnix,
    alvo: c.alvoFreeTemporada,
    freeDentroDoAlvo: free >= c.alvoFreeTemporada[0] * 0.75 && free <= c.alvoFreeTemporada[1] * 1.25,
    tetoWhale: c.tetoWhale,
  };
}

// Checagem de overflow: o que passa de Long.MAX e depende do C1
function testeOverflow() {
  const LONG_MAX = 9_223_372_036_854_775_807n;
  const { tiers } = P.temporada;
  const c = P.custos;
  const linhas = [];
  for (let n = 1; n <= tiers; n++) {
    const renda = rendaTier(n);
    const spawner = bigMul(renda, c.spawnerSobreRenda);
    const up3 = bigMul(spawner, c.upgradeNivel3);
    let rank = bigMul(renda, P.sinks.rankParteEmCoins);
    const tetoRank = BigInt(c.tetoLongSafe);
    if (rank > tetoRank) rank = tetoRank;
    linhas.push({
      tier: n, renda, spawner, up3, rank,
      spawnerEstoura: spawner > LONG_MAX,
      up3Estoura: up3 > LONG_MAX,
      rankEstoura: rank > LONG_MAX,
    });
  }
  return {
    LONG_MAX,
    linhas,
    primeiroTierQueEstoura: linhas.find(l => l.spawnerEstoura || l.up3Estoura)?.tier ?? null,
    rankNuncaEstoura: linhas.every(l => !l.rankEstoura),
  };
}

// ============================================================ relatorio

function relatorio() {
  const { dias, tiers, crescimentoPorDia } = P.temporada;
  const mult = orcamentoMultiplicadores();
  const estag = testeEstagnacao();
  const banda = testeBanda();
  const chaves = testeChaves();
  const cash = testeCash();
  const over = testeOverflow();

  const tabela = [];
  for (let n = 1; n <= tiers; n++) {
    const r = reparticao(n, P.perfis.dedicado.horasAtivas);
    const c = P.custos;
    const spawner = bigMul(r.renda, c.spawnerSobreRenda);
    let rank = bigMul(r.renda, P.sinks.rankParteEmCoins);
    if (rank > BigInt(c.tetoLongSafe)) rank = BigInt(c.tetoLongSafe);
    tabela.push({
      tier: n, dia: n,
      renda: r.renda,
      ativoHora: r.ativoPorHora,
      afkHora: r.afkPorHora,
      passivoHora: n >= 7 ? r.passivoPorHora : null,
      valorBase: valorBaseUnidade(n),
      spawner, rank,
      sinks: bigMul(r.renda, 0.75),
    });
  }

  return { params: P, dias, tiers, crescimentoPorDia, mult, estag, banda, chaves, cash, over, tabela };
}

// ============================================================ saida no terminal

function imprimir() {
  const R = relatorio();
  const L = (s = '') => console.log(s);
  const hr = () => L('-'.repeat(78));

  L(); L('GARNIX - SIMULADOR DE ECONOMIA'); hr();
  L(`Temporada: ${R.dias} dias | ${R.tiers} tiers | crescimento ${R.crescimentoPorDia}x/dia`);
  L(`Renda T1: ${fmt(rendaTier(1))}  ->  Renda T${R.tiers}: ${fmt(rendaTier(R.tiers))}`);
  const rep = reparticao(1, P.perfis.dedicado.horasAtivas);
  L(`Casa: ${rep.unidades.afk}u AFK + ${rep.unidades.ativo}u ativo = ${rep.unidades.total}u  (ativo = ${rep.percentAtivo.toFixed(1)}%)`);

  L(); L('TABELA DE TIERS'); hr();
  L('T   dia  renda/dia    ativo/h      AFK/h       passivo/h   valor-base   spawner');
  for (const t of R.tabela) {
    L([
      String(t.tier).padEnd(3),
      String(t.dia).padEnd(4),
      fmt(t.renda).padEnd(12),
      fmt(t.ativoHora).padEnd(12),
      fmt(t.afkHora).padEnd(11),
      (t.passivoHora ? fmt(t.passivoHora) : '-').padEnd(11),
      fmt(t.valorBase).padEnd(12),
      fmt(t.spawner),
    ].join(' '));
  }

  L(); L('ORCAMENTO DE MULTIPLICADORES'); hr();
  L('Formula real (EffectRewardHelper.java:90-100):');
  L('  valor = base x fortunate x (1 + booster% + skin% + armadura% + permBonus%) x frenzy');
  L();
  L(`Aditivos somados: +${R.mult.somaAditivos}%  (booster, skin, armadura)`);
  L(`permBonus: +${R.mult.permMaior}% via "${R.mult.permVencedor}" — O MAIOR NO VENCE, nao somam`);
  if (R.mult.permIgnorados.length) {
    L(`  ignorados por perder para o maior: ${R.mult.permIgnorados.map(([k, v]) => k + ' (+' + v + '%)').join(', ')}`);
  }
  L(`Bloco aditivo: (1 + ${R.mult.somaPercent}/100) = ${R.mult.blocoAditivo.toFixed(2)}x`);
  L(`Multiplicativos (fortunate x frenzy): ${R.mult.blocoMult.toFixed(2)}x`);
  L(`TOTAL: ${R.mult.total.toFixed(1)}x   (teto ${R.mult.teto}x)   ${R.mult.dentroDoTeto ? 'OK' : 'ESTOUROU'}`);
  L();
  L(`Fortunate ideal para bater o teto exato: ${R.mult.fortunateIdeal.toFixed(2)}x`);
  L(`  -> increase-multiplier = ${((R.mult.fortunateIdeal - 1.05) / 99).toFixed(3)}`);
  L(`Se o booster multiplicasse em vez de somar: ${R.mult.totalSeBoosterMultiplicasse.toFixed(0)}x (nao e o caso)`);

  L(); L('S1 - TESTE DE ESTAGNACAO'); hr();
  L(`Empilhamento maximo de um spawner: ${R.estag.empilhamentoMaximo}x  (mob-stack x spawner-stack)`);
  L(`Crescimento de valor por tier: ${R.estag.crescimentoPorTier}x`);
  L(`Empilhar ao maximo vale ${R.estag.tiersQueOEmpilhamentoVale.toFixed(2)} tiers`);
  L(`Estar 4 tiers atras e incompensavel: ${R.estag.quatroTiersAtrasIncompensavel ? 'SIM' : 'NAO - PROBLEMA'}`);
  L(`Subir sempre bate ficar, em todos os 19 tiers: ${R.estag.falhas.length === 0 ? 'SIM' : 'NAO em ' + R.estag.falhas.map(f => 'T' + f.tier).join(', ')}`);
  L(`VEREDITO: ${R.estag.aprovado ? 'APROVADO' : 'REPROVADO'}`);
  L();
  L('  Custo de cada caminho, em dias de renda do tier atual:');
  L('  T    empilhar tudo    subir de tier');
  for (const l of R.estag.linhas.filter(x => x.tier % 4 === 1)) {
    L(`  ${String(l.tier).padEnd(4)} ${l.diasParaEmpilharN.toFixed(2).padEnd(16)} ${l.diasParaSubir.toFixed(2)}`);
  }
  L();
  L('  ARMADILHA DO VALE DE SUBSTITUICAO');
  L(`  Trocar um spawner MAXADO do tier N por um NU do tier N+1 no mesmo slot`);
  L(`  deixa aquele slot ${R.estag.perdaAoTrocar.toFixed(0)}x PIOR ate ser re-empilhado.`);
  L(`  Consequencia: s.limite PRECISA crescer durante a temporada, para o jogador`);
  L(`  ADICIONAR em vez de TROCAR. Com slots fixos, subir de tier vira punicao.`);
  L(`  Exige slots crescentes: ${R.estag.exigeSlotsCrescentes ? 'SIM' : 'nao'}`);

  L(); L('S2 - TESTE DE BANDA'); hr();
  for (const [nome, b] of Object.entries(R.banda)) {
    L(`${nome.padEnd(10)} ${String(b.perfil.horasAtivas).padStart(2)}h/dia  ->  tier final ${b.serie[b.serie.length - 1].tier.toFixed(1).padStart(5)}  |  acumulado ${fmt(b.final)}`);
  }
  L();
  L('  Alvos: casual 1e12-1e15 | dedicado ~1,44e21 | hardcore ate ~1e23');

  L(); L('VOLUME DE CHAVES E BOSSES (endgame, por jogador)'); hr();
  L(`Blocos/dia (manual x AoE ${P.tetos.aoeMultiplicadorMaximo}x): ${fmt(Math.round(R.chaves.blocosTotaisDia))}  (manuais: ${fmt(Math.round(R.chaves.blocosManuaisDia))})`);
  L();
  L(`Kits cumulativos (3 contas): ${Math.round(R.chaves.deKits)}/dia`);
  L(`Mineracao (blessed, todo bloco): ${Math.round(R.chaves.deMineracao)}/dia`);
  L(`Farm (clover):               ${Math.round(R.chaves.deFarm)}/dia`);
  L(`Outras fontes:               ${Math.round(R.chaves.outras)}/dia`);
  L(`TOTAL:                       ${Math.round(R.chaves.total)}/dia`);
  L(`  = ${Math.round(R.chaves.total / 24 / 60)} chaves por minuto, o dia inteiro`);
  L(`  = ${R.chaves.cliquesPorDiaCom500.toFixed(0)} cliques/dia no upgrade de 500 aberturas`);
  L();
  L(`Com a chance de HOJE (blessed 9,21%): ${fmt(Math.round(R.chaves.comChanceDeHoje))}/dia`);
  L(`  ou seja ${Math.round(R.chaves.fatorComChanceDeHoje)}x mais - inviavel. A chance TEM que cair`);
  L(`  Alvo: blessed nivel 100 = ${(P.chaves.blessedChanceNivel100 * 100).toFixed(3)}%  (hoje 9,21%)`);
  L();
  L(`Faixas somam 100%: ${R.chaves.faixasSomamUm ? 'SIM' : 'NAO (' + (R.chaves.somaFaixas * 100).toFixed(1) + '%)'}`);
  L('Distribuicao por faixa (por dia, e o intervalo medio entre ocorrencias):');
  for (const [k, chance] of Object.entries(P.chaves.faixas)) {
    const porDia = R.chaves.total * chance;
    const desc = porDia >= 1
      ? `${Math.round(porDia)}/dia`
      : `1 a cada ${(1 / porDia).toFixed(1)} dias  (1 em ${Math.round(1 / chance).toLocaleString('pt-BR')} aberturas)`;
    L(`  ${k.padEnd(10)} ${desc}`);
  }
  L();
  L(`Bosses/dia: ${Math.round(R.chaves.bossesPorDia)}  em ~${Math.round(R.chaves.lotesDeBossPorDia)} lotes de 25`);

  L(); L('ORCAMENTO DE CASH NA TEMPORADA'); hr();
  L(`free                      ${R.cash.free}`);
  L(`free + vinculado          ${R.cash.freeVinculado}`);
  L(`free + vinculado + eventos ${R.cash.comEventos}`);
  L(`+ maquina de cash          ${R.cash.comMaquina}`);
  L(`garnix (VIP topo)          ${R.cash.garnix}`);
  L(`Alvo do free: ${R.cash.alvo[0]}-${R.cash.alvo[1]}  ${R.cash.freeDentroDoAlvo ? 'OK' : 'FORA'}`);
  L(`Teto de exagero do whale: ${fmt(R.cash.tetoWhale)}`);

  L(); L('OVERFLOW - o que depende do C1'); hr();
  L(`Long.MAX = ${fmt(R.over.LONG_MAX)}`);
  L(`Primeiro tier que estoura: T${R.over.primeiroTierQueEstoura ?? '-'}`);
  L(`A parte em coins do rank nunca estoura: ${R.over.rankNuncaEstoura ? 'SIM (travada em 1e18)' : 'NAO - PROBLEMA'}`);
  for (const l of R.over.linhas.filter(x => x.spawnerEstoura || x.up3Estoura)) {
    L(`  T${String(l.tier).padEnd(3)} spawner ${fmt(l.spawner).padEnd(10)} ${l.spawnerEstoura ? '<- estoura' : ''}  upgrade3 ${fmt(l.up3).padEnd(10)} ${l.up3Estoura ? '<- estoura' : ''}`);
  }

  L(); hr();
  const ok = R.estag.aprovado && R.mult.dentroDoTeto && R.cash.freeDentroDoAlvo && R.over.rankNuncaEstoura;
  L(ok ? 'MODELO CONSISTENTE' : 'HA INCONSISTENCIAS - ver acima');
  L();
}

// ============================================================ exportacao

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    fmt, rendaTier, reparticao, valorBaseUnidade, orcamentoMultiplicadores,
    testeEstagnacao, testeBanda, testeChaves, testeCash, testeOverflow,
    relatorio, imprimir,
  };
  if (require.main === module) imprimir();
}
