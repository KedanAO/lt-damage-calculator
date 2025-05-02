export function applyChanges(stats, changes){
  let rawStats = {};
  let rawMults = {};
  let changedStats = {};

  for (let s in stats) {
    rawStats[s] = stats[s][0] / stats[s][1] * 100;
    rawMults[s] = stats[s][1];
  }

  for (let s in changes) {
    rawStats[s] += changes[s][0]
    rawMults[s] += changes[s][1]
  };
  
  for (let s in rawStats) {
    changedStats[s] = [rawStats[s] * rawMults[s] / 100, rawMults[s]]
  };

  return changedStats;
}

export function calculateDamage(stats, settings, defenses, enemyType) {
  // base
  const attack = stats.attack[0] * settings.aF / 50 * defenses[enemyType].multiplier;
  const strength = stats.strength[0] * (settings.sF / 100) * defenses[enemyType].multiplier;
  const staticDamage = stats.static[0] * defenses[enemyType].multiplier;
  const added = stats[enemyType + 'Added'][0] * defenses[enemyType].multiplier;

  const base = attack + (strength + staticDamage + added - defenses[enemyType].flat);

  // multipliers
  const critical = (stats.critical[0] + 100) / 100;
  const min = stats.minimum[0] <= stats.maximum[0] ? stats.minimum[0] : stats.maximum[0]
  const minmax = (min * settings.minWeight + stats.maximum[0] * (1 - settings.minWeight) + 100) / 100;
  const amp = 1 + stats[enemyType + 'Amp'][0] / 100;

  const multiplier = critical * minmax * amp;

  const resultingDamage = base * multiplier * (settings.fF / 100) * (1 - defenses[enemyType].mitigation);

  return resultingDamage;
};

export function compareDamage(oldDamage, newDamage) {
  return (newDamage - oldDamage) / oldDamage;
};

export function getAverageDamage(normalDamage, bossDamage, weight) {
  return normalDamage * (1-weight) + bossDamage * weight;
};

export function calculateEquivalenceIncrease(stats, settings, defenses, increasePercent) {
  // use the damage formulas to solve for this equation:
  // (newDamageNormal - oldDamageNormal) / oldDamageNormal * (1-bossWeight) + (newDamageBoss - oldDamageBoss) / oldDamageBoss * bossWeight = increasePercent
  // newDamage = stat to be increased's multipliers * increase + old damage, solve for increase
  // work the damage formula backwards to solve for each stat with the other provided stats and the increasePercent
  // due to the large amount of variables, the equations are very long so some auxiliary variables are used
  const strP = stats.strength[1]/100;
  const atkP = stats.attack[1]/100;
  const statP = stats.static[1]/100;
  const nAddP = stats.normalAdded[1]/100;
  const bAddP = stats.bossAdded[1]/100;
  const critP = stats.critical[1]/100;
  const minP = stats.minimum[1]/100;
  const maxP = stats.maximum[1]/100;

  const str = stats.strength[0] / strP;
  const atk = stats.attack[0] / atkP;
  const stat = stats.static[0] / statP;
  const nAdd = stats.normalAdded[0] / nAddP;
  const bAdd = stats.bossAdded[0] / bAddP;
  const crit = stats.critical[0] / critP;
  const min = stats.minimum[0] <= stats.maximum[0] ? stats.minimum[0] / minP : stats.maximum[0] / maxP;
  const max = stats.maximum[0] / maxP;
  const nAmp = stats.normalAmp[0];
  const bAmp = stats.bossAmp[0];

  const sF = settings.sF / 100;
  const aF = settings.aF / 50;
  const tF = settings.fF / 100;
  const minW = settings.minWeight;
  const bossW = settings.bossWeight;
  
  const nDefFlat = defenses.normal.flat;
  const nDefMult = defenses.normal.multiplier;
  const nDefMit = 1 - defenses.normal.mitigation;
  const bDefFlat = defenses.boss.flat;
  const bDefMult = defenses.boss.multiplier;
  const bDefMit = 1 - defenses.boss.mitigation;

  const r = increasePercent;

  const nDmg = calculateDamage(stats, settings, defenses, "normal")
  const bDmg = calculateDamage(stats, settings, defenses, "boss")

  const critCalc = (crit*critP/100+1)
  const minMaxCalc = (min*minP*minW/100+max*maxP*(1-minW)/100+1)
  const nAmpCalc = (nAmp/100+1)
  const bAmpCalc = (bAmp/100+1)

  const nBase = ((str*strP*sF+atk*atkP*aF+stat*statP+nAdd*nAddP)*nDefMult-nDefFlat)*nDefMit*tF
  const bBase = ((str*strP*sF+atk*atkP*aF+stat*statP+bAdd*bAddP)*bDefMult-bDefFlat)*bDefMit*tF
  const nMultis = nDefMult*critCalc*minMaxCalc*nAmpCalc*nDefMit*tF
  const bMultis = bDefMult*critCalc*minMaxCalc*bAmpCalc*bDefMit*tF

  let equivalence = {};

  equivalence.strength = [r/(sF*strP*nMultis/nDmg*(1-bossW)+sF*strP*bMultis/bDmg*bossW), r/(sF*str*nMultis/nDmg*(1-bossW)+sF*str*bMultis/bDmg*bossW) * 100];
  equivalence.attack = [r/(aF*atkP*nMultis/nDmg*(1-bossW)+aF*atkP*bMultis/bDmg*bossW), r/(aF*atk*nMultis/nDmg*(1-bossW)+aF*atk*bMultis/bDmg*bossW) * 100];
  equivalence.static = [r/(statP*nMultis/nDmg*(1-bossW)+statP*bMultis/bDmg*bossW), r/(stat*nMultis/nDmg*(1-bossW)+stat*bMultis/bDmg*bossW) * 100];
  equivalence.critical = [r/(nBase*(critP/100)*minMaxCalc*nAmpCalc/nDmg), r/(nBase*(crit/100)*minMaxCalc*nAmpCalc/nDmg) * 100];
  if (settings.minWeight <= 0) {
    equivalence.minimum = ['-', '-'];
  } else {
    equivalence.minimum = [r/(nBase*critCalc*(minP*minW/100)*nAmpCalc/nDmg), r/(nBase*critCalc*(min*minW/100)*nAmpCalc/nDmg) * 100];
  };
  equivalence.maximum = [r/(nBase*critCalc*(maxP*(1-minW)/100)*nAmpCalc/nDmg), r/(nBase*critCalc*(max*(1-minW)/100)*nAmpCalc/nDmg) * 100];
  if (settings.bossWeight >= 1) {
    equivalence.normalAdded = ['-', '-'];
    equivalence.normalAmp = ['-', '-'];
  } else {
    equivalence.normalAdded = [r/(nAddP*nMultis/nDmg*(1-bossW)), r/(nAdd*nMultis/nDmg*(1-bossW)) * 100];
    equivalence.normalAmp = [r/(nBase*critCalc*minMaxCalc/nDmg)*100*2, 'N/A'];
  }
  if (settings.bossWeight <= 0) {
    equivalence.bossAdded = ['-', '-'];
    equivalence.bossAmp = ['-', '-'];
  } else {
    equivalence.bossAdded = [r/(bAddP*bMultis/bDmg*bossW), r/(bAdd*bMultis/bDmg*bossW) * 100];
    equivalence.bossAmp = [r/(bBase*critCalc*minMaxCalc/bDmg)*100*2, 'N/A']
  }

  return equivalence;
};