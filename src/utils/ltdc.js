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
  const attack = stats.attack[0] * settings.aF * defenses[enemyType].multiplier;
  const strength = stats.strength[0] * defenses[enemyType].multiplier;
  const staticDamage = stats.static[0] * defenses[enemyType].multiplierB;
  const added = stats[enemyType + 'Added'][0] * defenses[enemyType].multiplierB;

  const base = attack + (strength + staticDamage + added - defenses[enemyType].flat) * settings.sF

  // multipliers
  const critical = (stats.critical[0] + 100) / 100;
  const min = stats.minimum[0] <= stats.maximum[0] ? stats.minimum[0] : stats.maximum[0]
  const minmax = (min * settings.minWeight + stats.maximum[0] * (1 - settings.minWeight) + 120) / 100;
  const amp = 1 + stats[enemyType + 'Amp'][0] / 100;

  const multiplier = critical * minmax * amp;

  const resultingDamage = base * multiplier * (1 - defenses[enemyType].mitigation);

  return resultingDamage;
};

export function compareDamage(oldDamage, newDamage) {
  return (newDamage - oldDamage) / oldDamage;
};

export function getAverageDamage(normalDamage, bossDamage, weight) {
  return normalDamage * (1-weight) + bossDamage * weight;
};

export function calculateEquivalenceIncrease(stats, settings, defenses, increasePercent, mode) {
  // work the damage formula backwards to solve for each stat with the other provided stats and the increasePercent
  // due to the large amount of variables, the equations are very long so each stat gets abbreviated to reduce the size of the assignments
  const a = stats.strength[0];
  const b = stats.attack[0];
  const c = stats.static[0];
  const d = stats.normalAdded[0];
  const e = stats.bossAdded[0];
  const f = stats.critical[0];
  const g = stats.minimum[0] <= stats.maximum[0] ? stats.minimum[0] : stats.maximum[0];
  const h = stats.maximum[0];
  const i = stats.normalAmp[0];
  const j = stats.bossAmp[0];

  const ap = stats.strength[1]/100;
  const bp = stats.attack[1]/100;
  const cp = stats.static[1]/100;
  const dp = stats.normalAdded[1]/100;
  const ep = stats.bossAdded[1]/100;
  const fp = stats.critical[1]/100;
  const gp = stats.minimum[1]/100;
  const hp = stats.maximum[1]/100;

  const k = settings.aF;
  const l = settings.sF;
  const m = settings.minWeight;
  const n = settings.bossWeight;
  
  let o = defenses.boss.flat;
  let p = defenses.boss.multiplier;
  let q = defenses.boss.mitigation;
  if (mode === "Normal"){
    o = defenses.normal.flat;
    p = defenses.normal.multiplier;
    q = defenses.normal.mitigation;
  }

  const r = increasePercent;

  let equivalence = {};

  equivalence.strength = [r*(p*k*b+l*(a*p+c+d*(1-n)+e*n-o))/(l*p*ap), r*(p*k*b+l*(a*p+c+d*(1-n)+e*n-o))/(l*p*a/ap)*100];
  equivalence.attack = [r*(p*k*b+l*(p*a+c+d*(1-n)+e*n-o))/(p*k*bp), r*(p*k*b+l*(p*a+c+d*(1-n)+e*n-o))/(p*k*b/bp)*100];
  equivalence.static = [r*(p*k*b+l*(a*p+c+d*(1-n)+e*n-o))/(l*cp), r*(p*k*b+l*(a*p+c+d*(1-n)+e*n-o))/(l*c/cp)*100];
  equivalence.critical = [r*(f+100)/(fp), r*(f+100)/(f/fp)*100];
  if (settings.minWeight <= 0) {
    equivalence.minimum = ['-', '-'];
  } else {
    equivalence.minimum = [r*(2*g*m+2*h*(1-m)+240)/(2*m*gp), r*(2*g*m+2*h*(1-m)+240)/(2*m*g/gp)*100];
  };
  equivalence.maximum = [r*(2*g*m+2*h*(1-m)+240)/(2*(1-m)*hp), r*(2*g*m+2*h*(1-m)+240)/(2*(1-m)*h/hp)*100];
  if (settings.bossWeight >= 1) {
    equivalence.normalAdded = ['-', '-'];
    equivalence.normalAmp = ['-', '-'];
  } else {
    equivalence.normalAdded = [r*(p*k*b+l*(a*p+c+d-o))/(l*(1-n)*dp), r*(p*k*b+l*(a*p+c+d-o))/(l*(1-n)*d/dp)*100];
    equivalence.normalAmp = [r*100*(1+i/100)/(1-n), 'N/A'];
  }
  if (settings.bossWeight <= 0) {
    equivalence.bossAdded = ['-', '-'];
    equivalence.bossAmp = ['-', '-'];
  } else {
    equivalence.bossAdded = [r*(p*k*b+l*(a*p+c+e-o))/(l*n*ep), r*(p*k*b+l*(a*p+c+e-o))/(l*n*e/ep)*100];
    equivalence.bossAmp = [r*100*(1+j/100)/(n), 'N/A'];
  }

  return equivalence;
};

export function calculateAverageEquivalence(stats, settings, defenses, increasePercent) {
  const equivalenceNormal = calculateEquivalenceIncrease(stats, settings, defenses, increasePercent, "Normal");
  const equivalenceBoss = calculateEquivalenceIncrease(stats, settings, defenses, increasePercent, "Boss");

  const statNames = ['strength', 'attack', 'static', 'normalAdded', 'bossAdded', 'critical', 'minimum', 'maximum', 'normalAmp', 'bossAmp'];
  let equivalence = {};

  for (let st in statNames) {
    equivalence[statNames[st]] = [];
    equivalence[statNames[st]][0] = equivalenceBoss[statNames[st]][0] * settings.bossWeight + equivalenceNormal[statNames[st]][0] * (1 - settings.bossWeight);
    if (statNames[st] !== 'normalAmp' && statNames[st] !== 'bossAmp') {
      equivalence[statNames[st]][1] = equivalenceBoss[statNames[st]][1] * settings.bossWeight + equivalenceNormal[statNames[st]][1] * (1 - settings.bossWeight);
    } else {
      equivalence[statNames[st]][1] = 'N/A';
    }
  }

  return equivalence;
};