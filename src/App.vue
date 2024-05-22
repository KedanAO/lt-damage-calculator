<script>
import { applyChanges, calculateDamage, compareDamage, getAverageDamage, calculateEquivalenceIncrease } from './utils/ltdc.js'
import buffs from './utils/buffs.js'

export default {
  data() {
    return {
      // data that is saved utilizing localStorage
      stats: {
        'strength': [2747887, 385],
        'attack': [33467, 388],
        'critical': [4844, 132],
        'minimum': [2990, 120],
        'maximum': [4866, 126],
        'static': [620984, 187],
        'normalAdded': [271050, 103],
        'bossAdded': [395788, 100],
        'normalAmp': [55, 100],
        'bossAmp': [48.6, 100]
      },
      statsA: {
        'strength': ['', ''],
        'attack': ['', ''],
        'critical': ['', ''],
        'minimum': ['', ''],
        'maximum': ['', ''],
        'static': ['', ''],
        'normalAdded': ['', ''],
        'bossAdded': ['', ''],
        'normalAmp': ['', ''],
        'bossAmp': ['', ''],
      },
      statsB: {
        'strength': ['', ''],
        'attack': ['', ''],
        'critical': ['', ''],
        'minimum': ['', ''],
        'maximum': ['', ''],
        'static': ['', ''],
        'normalAdded': ['', ''],
        'bossAdded': ['', ''],
        'normalAmp': ['', ''],
        'bossAmp': ['', ''],
      },
      defenses: {
        'multiplier': 1,
        'flat': 0,
        'mitigation': 0
      },
      settings: {
        'aF': 170,
        'sF': 1.32,
        'minWeight': 0.3,
        'bossWeight': 0.5,
        'target': 'soft'
      },
      buffs,
      selectedBuffs: {
        'Minimal': {
          'single': {
            'Nightmare Relic +4': true,
            'Guild Relic +9': true,
            'Richiring': true,
            'Herald of Fragments': true,
            'Book Buffs': true,
            'Flask of Battle': true,
            'Sweet Mutant Special': true,
            'Starkeeper Title': true,
          },
        },
        'Midterm': {
          'single': {
            'Hero Nostrum I': true,
            'Hero Nostrum II': true,
            'Guild Banana/Juice': true,
          },
        },
        'Maxed': {
          'single': {
            'Sweet Mutant Critical': false,
            'Sweet Mutant Maximum': false,
            'Fatal Perfume': false,
            'Fisherman Blessing': false,
          },
        },
        'Event': {
          'single': {
            'Long Eastland Ice Tea': false,
            'Fun Blessing': false,
            'Special Combat Potion': false,
          },
        },
        'Party': {
          'single': {
            'Popstar Buffs': false,
            'Black Anima Buffs': false,
          },
        },
      },
      
      // names and values that will be displayed
      statNames: {
        'strength': 'Strength/Magic',
        'attack': 'Attack/Intensity',
        'critical': 'Critical Damage',
        'minimum': 'Minimum Damage',
        'maximum': 'Maximum Damage',
        'static': 'Static Damage',
        'normalAdded': 'Normal Added Damage',
        'bossAdded': 'Boss Added Damage',
        'normalAmp': 'Normal Amplification',
        'bossAmp': 'Boss Amplification'
      },
      damage: {
        avg: ['0b000m', '0b000m', '0b000m'],
        normal: ['0b000m', '0b000m', '0b000m'],
        boss: ['0b000m', '0b000m', '0b000m']
      },
      increases: {
        avg: ['-0.1', '0.1'],
        normal: ['0.05', '0.05'],
        boss: ['0.05', '0.05']
      },
      buffedDamage: {
        avg: ['0b000m', '0b000m', '0b000m'],
        normal: ['0b000m', '0b000m', '0b000m'],
        boss: ['0b000m', '0b000m', '0b000m']
      },
      buffedIncreases: {
        avg: ['-0.1', '0.1'],
        normal: ['0.05', '0.05'],
        boss: ['0.05', '0.05']
      },
      equivalencePercent: {
        'strength': ['', ''],
        'attack': ['', ''],
        'critical': ['', ''],
        'minimum': ['', ''],
        'maximum': ['', ''],
        'static': ['', ''],
        'normalAdded': ['', ''],
        'bossAdded': ['', ''],
        'normalAmp': ['', ''],
        'bossAmp': ['', ''],
      },
      equivalenceCritical: {
        'strength': ['', ''],
        'attack': ['', ''],
        'critical': ['', ''],
        'minimum': ['', ''],
        'maximum': ['', ''],
        'static': ['', ''],
        'normalAdded': ['', ''],
        'bossAdded': ['', ''],
        'normalAmp': ['', ''],
        'bossAmp': ['', ''],
      },
      equivalenceValues: {
        'perc': 1,
        'critical': 10
      },

      // other
      displayWindow: {
        'buffs': false,
        'config': false,
        'info': false,
        'equivalence': false
      },
      tooltip: false,
      tooltipPosition: [0,0],
      tooltipText: '',
    }
  },

  methods: {
    // read and save to localStorage
    readData() {
      if (window.localStorage.getItem('ltdcSettings') !== null) {
        this.settings = JSON.parse(window.localStorage.getItem('ltdcSettings'))
      }
      if (window.localStorage.getItem('ltdcStats') !== null) {
        this.stats = JSON.parse(window.localStorage.getItem('ltdcStats'))
      }
      if (window.localStorage.getItem('ltdcStatsA') !== null) {
        this.statsA = JSON.parse(window.localStorage.getItem('ltdcStatsA'))
      }
      if (window.localStorage.getItem('ltdcStatsB') !== null) {
        this.statsB = JSON.parse(window.localStorage.getItem('ltdcStatsB'))
      }
      if (window.localStorage.getItem('ltdcSelectedBuffs') !== null) {
        this.selectedBuffs = JSON.parse(window.localStorage.getItem('ltdcSelectedBuffs'))
      }
    },    
    saveData() {
      window.localStorage.setItem('ltdcStats', JSON.stringify(this.stats))
      window.localStorage.setItem('ltdcStatsA', JSON.stringify(this.statsA))
      window.localStorage.setItem('ltdcStatsB', JSON.stringify(this.statsB))
      window.localStorage.setItem('ltdcSelectedBuffs', JSON.stringify(this.selectedBuffs))
      window.localStorage.setItem('ltdcSettings', JSON.stringify(this.settings))
    },

    // imports
    applyChanges,
    calculateDamage,
    compareDamage,
    getAverageDamage,
    calculateEquivalenceIncrease,

    // formatting values that are displayed
    formatDamage(damage) {
      if (isNaN(damage)) { return '---' }

      const bil = Math.floor(damage/1000000000)
      const mil = ((damage/1000000000 % 1).toFixed(3)*1000).toString().padStart(3,'0')

      return `${bil}b${mil}m`
    },
    formatIncrease(increase) {
      if (isNaN(increase)) { return '---'}

      const signal = increase >= 0 ? '+' : ''

      return `${signal}${(increase*100).toFixed(5)}%`
    },
    formatBuffTooltip(buff) {
      let text = ''

      for(let stat in buff) {
        text += this.statNames[stat] + ' '
        if(buff[stat][1] === 0) {
          text += '+' + buff[stat][0] + ', '
        } else if (buff[stat][0] === 0) {
          text += '+' + buff[stat][1] + '%, '
        } else {
          text += '+' + buff[stat][0] + '/+' + buff[stat][1] + '%, '
        }
      }

      return text.slice(0,-2);
    },
    formatBuffTooltipMulti(buffs) {
      let text = ''

      for(let buff in buffs) {
        text += buff + ': '
        text += this.formatBuffTooltip(buffs[buff])
        text += '\n'
      }

      return text;
    },

    // calculate all damage displayed
    getDamageNumbers(st, stA, stB) {
      let dmg = {
        'normal': ['', '', ''],
        'boss': ['', '', ''],
        'avg': ['', '', '']
      }

      let damageNormal = calculateDamage(st, this.settings, this.defenses, 'normal')
      let damageBoss = calculateDamage(st, this.settings, this.defenses, 'boss')
      let damageAvg = getAverageDamage(damageNormal, damageBoss, this.settings.bossWeight)

      dmg.normal[0] = this.formatDamage(damageNormal)
      dmg.boss[0] = this.formatDamage(damageBoss)
      dmg.avg[0] = this.formatDamage(damageAvg)

      damageNormal = calculateDamage(applyChanges(st, stA), this.settings, this.defenses, 'normal')
      damageBoss = calculateDamage(applyChanges(st, stA), this.settings, this.defenses, 'boss')
      damageAvg = getAverageDamage(damageNormal, damageBoss, this.settings.bossWeight)

      dmg.normal[1] = this.formatDamage(damageNormal)
      dmg.boss[1] = this.formatDamage(damageBoss)
      dmg.avg[1] = this.formatDamage(damageAvg)

      damageNormal = calculateDamage(applyChanges(st, stB), this.settings, this.defenses, 'normal')
      damageBoss = calculateDamage(applyChanges(st, stB), this.settings, this.defenses, 'boss')
      damageAvg = getAverageDamage(damageNormal, damageBoss, this.settings.bossWeight)

      dmg.normal[2] = this.formatDamage(damageNormal)
      dmg.boss[2] = this.formatDamage(damageBoss)
      dmg.avg[2] = this.formatDamage(damageAvg)

      return dmg
    },

    updateDamage() {
      const dmg = this.getDamageNumbers(this.stats, this.statsA, this.statsB)
      this.damage.normal[0] = dmg.normal[0]
      this.damage.normal[1] = dmg.normal[1]
      this.damage.normal[2] = dmg.normal[2]
      this.damage.boss[0] = dmg.boss[0]
      this.damage.boss[1] = dmg.boss[1]
      this.damage.boss[2] = dmg.boss[2]
      this.damage.avg[0] = dmg.avg[0]
      this.damage.avg[1] = dmg.avg[1]
      this.damage.avg[2] = dmg.avg[2]
    },

    // calculate the % increases displayed under changes A and B
    getDamageIncreaseNumbers(st, stA, stB) {
      let inc = {
        avg: ['', ''],
        normal: ['', ''],
        boss: ['', '']
      }

      const damageNormal = calculateDamage(st, this.settings, this.defenses, 'normal')
      const damageBoss = calculateDamage(st, this.settings, this.defenses, 'boss')
      const damageAvg = getAverageDamage(damageNormal, damageBoss, this.settings.bossWeight)
      const damageNormalA = calculateDamage(applyChanges(st, stA), this.settings, this.defenses, 'normal')
      const damageBossA = calculateDamage(applyChanges(st, stA), this.settings, this.defenses, 'boss')
      const damageAvgA = getAverageDamage(damageNormalA, damageBossA, this.settings.bossWeight)
      const damageNormalB = calculateDamage(applyChanges(st, stB), this.settings, this.defenses, 'normal')
      const damageBossB = calculateDamage(applyChanges(st, stB), this.settings, this.defenses, 'boss')
      const damageAvgB = getAverageDamage(damageNormalB, damageBossB, this.settings.bossWeight)

      const increaseNormalA = compareDamage(damageNormal, damageNormalA)
      const increaseBossA = compareDamage(damageBoss, damageBossA)
      const increaseAvgA = compareDamage(damageAvg, damageAvgA)
      const increaseNormalB = compareDamage(damageNormal, damageNormalB)
      const increaseBossB = compareDamage(damageBoss, damageBossB)
      const increaseAvgB = compareDamage(damageAvg, damageAvgB)

      inc.normal[0] = this.formatIncrease(increaseNormalA)
      inc.boss[0] = this.formatIncrease(increaseBossA)
      inc.avg[0] = this.formatIncrease(increaseAvgA)

      inc.normal[1] = this.formatIncrease(increaseNormalB)
      inc.boss[1] = this.formatIncrease(increaseBossB)
      inc.avg[1] = this.formatIncrease(increaseAvgB)

      return inc
    },

    updateIncreases() {
      const inc = this.getDamageIncreaseNumbers(this.stats, this.statsA, this.statsB)
      this.increases.normal[0] = inc.normal[0]
      this.increases.normal[1] = inc.normal[1]
      this.increases.boss[0] = inc.boss[0]
      this.increases.boss[1] = inc.boss[1]
      this.increases.avg[0] = inc.avg[0]
      this.increases.avg[1] = inc.avg[1]
    },

    // get buffed stats from selected buffs
    getBuffStats() {
      let allBuffs = {
        'strength': [0, 0],
        'attack': [0, 0],
        'critical': [0, 0],
        'minimum': [0, 0],
        'maximum': [0, 0],
        'static': [0, 0],
        'normalAdded': [0, 0],
        'bossAdded': [0, 0],
        'normalAmp': [0, 0],
        'bossAmp': [0, 0],
      }
      for (let tier in this.selectedBuffs) {
        for (let type in this.selectedBuffs[tier]) {
          if (type === 'single') {
            for (let buff in this.selectedBuffs[tier][type]) {
              if (this.selectedBuffs[tier][type][buff]) { 
                for (let stat in this.buffs[tier][type][buff]) {
                  allBuffs[stat][0] += this.buffs[tier][type][buff][stat][0]
                  allBuffs[stat][1] += this.buffs[tier][type][buff][stat][1]
                }
              }
            }
          }
          else if (this.selectedBuffs[tier][type] !== 'None') {
            for (let stat in this.buffs[tier][type][this.selectedBuffs[tier][type]]) {
              allBuffs[stat][0] += this.buffs[tier][type][this.selectedBuffs[tier][type]][stat][0]
              allBuffs[stat][1] += this.buffs[tier][type][this.selectedBuffs[tier][type]][stat][1]
            }
          }
        }
      }

      return allBuffs
    },

    // update displayed buffed stats
    updateBuffs() {
      const buffStats = this.getBuffStats()

      const buffedD = applyChanges(this.stats, buffStats)

      const dmg = this.getDamageNumbers(buffedD, this.statsA, this.statsB)
      const inc = this.getDamageIncreaseNumbers(buffedD, this.statsA, this.statsB)

      this.buffedDamage.normal[0] = dmg.normal[0]
      this.buffedDamage.normal[1] = dmg.normal[1]
      this.buffedDamage.normal[2] = dmg.normal[2]
      this.buffedDamage.boss[0] = dmg.boss[0]
      this.buffedDamage.boss[1] = dmg.boss[1]
      this.buffedDamage.boss[2] = dmg.boss[2]
      this.buffedDamage.avg[0] = dmg.avg[0]
      this.buffedDamage.avg[1] = dmg.avg[1]
      this.buffedDamage.avg[2] = dmg.avg[2]

      this.buffedIncreases.normal[0] = inc.normal[0]
      this.buffedIncreases.normal[1] = inc.normal[1]
      this.buffedIncreases.boss[0] = inc.boss[0]
      this.buffedIncreases.boss[1] = inc.boss[1]
      this.buffedIncreases.avg[0] = inc.avg[0]
      this.buffedIncreases.avg[1] = inc.avg[1]
    },

    // toggles buffs on/off for each tier or clears all buffs
    toggleBuffs(tier) {
      // used for alternating
      let swap = true

      // if 'Clear' = remove every buff and set selection buffs to 'None'
      if(tier === 'Clear') {
        for (let ti in this.selectedBuffs) {
          for (let buff in this.selectedBuffs[ti]['single']) {
            this.selectedBuffs[ti]['single'][buff] = false
          }
          for (let buff in this.selectedBuffs[ti]) {
            if (buff !== 'single') {
              this.selectedBuffs[ti][buff] = 'None'
            }
          }
        }
      } else {
        // references state of first buff in the specific tier to determine if they should all be turned on or off
        if (this.selectedBuffs[tier]['single'][Object.keys(this.selectedBuffs[tier]['single'])[0]]) {swap = false}

        for (let buff in this.selectedBuffs[tier]['single']) {
          this.selectedBuffs[tier]['single'][buff] = swap
        }
        // hardcoded "best" choices for every selection buff
        switch (tier) {
          case 'Minimal': 
            this.selectedBuffs[tier]['Food'] = swap ? 'Chicken Soup' : 'None'
            break
          case 'Midterm': 
            this.selectedBuffs[tier]['Syrup'] = swap ? 'Advanced Premium Syrup' : 'None'
            break
          case 'Maxed':
            this.selectedBuffs[tier]['Booster'] = swap ? 'Union Critical Booster' : 'None'
            this.selectedBuffs[tier]['Rep Food'] = swap ? 'Reputation Galbijjim' : 'None'
            break
          case 'Event':
            this.selectedBuffs[tier]['Bungbung'] = swap ? 'Eastland Bungbung Drink' : 'None'
            break
        }
      }
    },

    getEquivalence(incPerc) {
      const buffedStats = applyChanges(this.stats, this.getBuffStats())
      const equivalence = calculateEquivalenceIncrease(buffedStats, this.settings, this.defenses, incPerc / 100)

      return equivalence
    },

    updateEquivalences() {
      const buffedStats = applyChanges(this.stats, this.getBuffStats())
      const critStats = applyChanges(buffedStats, {'critical': [this.equivalenceValues.critical, 0]})
      let critIncrease = compareDamage(
        getAverageDamage(
          calculateDamage(buffedStats, this.settings, this.defenses, 'normal'), 
          calculateDamage(buffedStats, this.settings, this.defenses, 'boss'), 
          this.settings.bossWeight
        ),
        getAverageDamage(
          calculateDamage(critStats, this.settings, this.defenses, 'normal'), 
          calculateDamage(critStats, this.settings, this.defenses, 'boss'), 
          this.settings.bossWeight)
      )
      critIncrease *= 100

      const equivalencePerc = this.getEquivalence(this.equivalenceValues.perc)
      const equivalenceCrit = this.getEquivalence(critIncrease)

      for (let st in this.stats) {
        this.equivalencePercent[st][0] = typeof(equivalencePerc[st][0]) === 'string' ? equivalencePerc[st][0] : equivalencePerc[st][0].toFixed(2)
        this.equivalencePercent[st][1] = typeof(equivalencePerc[st][1]) === 'string' ? equivalencePerc[st][1] : equivalencePerc[st][1].toFixed(2) + '%'
        this.equivalenceCritical[st][0] = typeof(equivalenceCrit[st][0]) === 'string' ? equivalenceCrit[st][0] : equivalenceCrit[st][0].toFixed(2)
        this.equivalenceCritical[st][1] = typeof(equivalenceCrit[st][1]) === 'string' ? equivalenceCrit[st][1] : equivalenceCrit[st][1].toFixed(2) + '%'
      }
    },

    updateDefenses() {
      let newDef = {
        'multiplier': 1,
        'flat': 0,
        'mitigation': 0
      }
      if (this.settings.target === 'durable') {
        newDef.multiplier = 0.6017
        newDef.flat = 500000
        newDef.mitigation = 0.8
      } 
      // add 7k mob/boss...

      this.defenses.multiplier = newDef.multiplier
      this.defenses.flat = newDef.flat
      this.defenses.mitigation = newDef.mitigation

      this.updateAll()
    },
    
    // run all updates
    updateAll() {
      // implement error catching in case saved data is in incorrect format
      this.updateDamage()
      this.updateIncreases()
      this.updateBuffs()
      this.updateEquivalences()
    },

    // for handling tooltip display
    onMouseMove(e) {
      this.tooltipPosition[0] = e.pageX + 15
      this.tooltipPosition[1] = e.pageY
    },

    // display & hide additional windows when their buttons are clicked
    selectDisplayWindow(selection) {
      for (let w in this.displayWindow) {
        if (w === selection && !this.displayWindow[w]) { this.displayWindow[w] = true }
        else { this.displayWindow[w] = false }
      }
    }
  },

  mounted() {
    this.readData()
    this.updateDefenses()
    this.updateAll()
  },

  updated() {
    this.updateAll()
    this.saveData()
  }
}
</script>

<template>
  <!-- buttons to bring up additional windows -->
  <div>
    <span><button @click="selectDisplayWindow('info')">Information</button></span>
    <span><button @click="selectDisplayWindow('config')">Config</button></span>
    <span><button @click="selectDisplayWindow('buffs')">Buffs</button></span>
    <span><button @click="selectDisplayWindow('equivalence')">Equivalence Tables</button></span>
  </div>
  <!-- stat blocks displaying stat inputs and damage calculations -->
  <div class="container">
    <!-- default: initial stat input -->
    <div class="stat-block" id="stat-block-default">
      <h2 class="damage-block">Stats</h2>
      <ul>
        <li class="input-container input-header"><span class="input-text">Stat</span><span class="input-full">Value</span><span class="input-perc">%</span></li>
        <li class="input-container" v-for="stat in Object.keys(stats)" :key="stat">
          <span class="input-text">{{ statNames[stat] }}</span>
          <span class="input-full"><input type="text" inputmode="numeric" class="input-full" v-model.number="stats[stat][0]"></span>
          <span class="input-perc"><input type="text" inputmode="numeric" class="input-perc" v-model.number="stats[stat][1]"></span>
        </li>
      </ul>
      <div class="damage-block">
        <h2>Damage</h2>
        <span class="damage-top">{{ damage['avg'][0] }}</span>
        <div class="damage-container">
          <span class="damage-text">Average</span>
        </div>
        <br>
        <div class="damage-container">
          <span class="damage-mid">{{ damage['normal'][0] }}</span>
          <span class="damage-mid">{{ damage['boss'][0] }}</span>
        </div>
        <div class="damage-container">
          <span class="damage-text">Normal</span>
          <span class="damage-text">Boss</span>
        </div>
        <div>
        </div>
      </div>
      <div class="damage-block">
        <h2>Buffed Damage</h2>
        <span class="damage-top">{{ buffedDamage['avg'][0] }}</span>
        <div class="damage-container">
          <span class="damage-text">Average</span>
        </div>
        <br>
        <div class="damage-container">
          <span class="damage-mid">{{ buffedDamage['normal'][0] }}</span>
          <span class="damage-mid">{{ buffedDamage['boss'][0] }}</span>
        </div>
        <div class="damage-container">
          <span class="damage-text">Normal</span>
          <span class="damage-text">Boss</span>
        </div>
        <div>
        </div>
      </div>
    </div>
    <!-- changes A -->
    <div class="stat-block" id="stat-block-1">
      <h2 class="damage-block">Changes A</h2>
      <ul>
        <li class="input-container input-header"><span class="input-text">Stat</span><span class="input-full">Value</span><span class="input-perc">%</span></li>
        <li class="input-container" v-for="stat in Object.keys(stats)" :key="stat">
          <span class="input-text">{{ statNames[stat] }}</span>
          <span class="input-full"><input type="text" inputmode="numeric" class="input-full" v-model.number="statsA[stat][0]"></span>
          <span class="input-perc"><input type="text" inputmode="numeric" class="input-perc" v-model.number="statsA[stat][1]"></span>
        </li>
      </ul>
      <div class="damage-block">
        <h2>Damage Increase</h2>
        <span class="damage-top" :class="{ 'damage-positive': increases['avg'][0][0] === '+', 'damage-negative': increases['avg'][0][0] === '-' }">{{ increases['avg'][0] }}</span>
        <span class="damage-mid">{{ damage['avg'][1] }}</span>
        <div class="damage-container">
          <span class="damage-text">Average</span>
        </div>
        <br>
        <div class="damage-container">
          <span class="damage-mid" :class="{ 'damage-positive': increases['normal'][0][0] === '+', 'damage-negative': increases['normal'][0][0] === '-' }">{{ increases['normal'][0] }}</span>
          <span class="damage-mid" :class="{ 'damage-positive': increases['boss'][0][0] === '+', 'damage-negative': increases['boss'][0][0] === '-' }">{{ increases['boss'][0] }}</span>
        </div>
        <div class="damage-container">
          <span class="damage-text">{{ damage['normal'][1] }}</span>
          <span class="damage-text">{{ damage['boss'][1] }}</span>
        </div>
        <div class="damage-container">
          <span class="damage-text">Normal</span>
          <span class="damage-text">Boss</span>
        </div>
        <div>
        </div>
      </div>
      <div class="damage-block">
        <h2>Buffed Damage Increase</h2>
        <span class="damage-top" :class="{ 'damage-positive': buffedIncreases['avg'][0][0] === '+', 'damage-negative': buffedIncreases['avg'][0][0] === '-' }">{{ buffedIncreases['avg'][0] }}</span>
        <span class="damage-mid">{{ buffedDamage['avg'][1] }}</span>
        <div class="damage-container">
          <span class="damage-text">Average</span>
        </div>
        <br>
        <div class="damage-container">
          <span class="damage-mid" :class="{ 'damage-positive': buffedIncreases['normal'][0][0] === '+', 'damage-negative': buffedIncreases['normal'][0][0] === '-' }">{{ buffedIncreases['normal'][0] }}</span>
          <span class="damage-mid" :class="{ 'damage-positive': buffedIncreases['boss'][0][0] === '+', 'damage-negative': buffedIncreases['boss'][0][0] === '-' }">{{ buffedIncreases['boss'][0] }}</span>
        </div>
        <div class="damage-container">
          <span class="damage-text">{{ buffedDamage['normal'][1] }}</span>
          <span class="damage-text">{{ buffedDamage['boss'][1] }}</span>
        </div>
        <div class="damage-container">
          <span class="damage-text">Normal</span>
          <span class="damage-text">Boss</span>
        </div>
        <div>
        </div>
      </div>
    </div>
    <!-- changes B -->
    <div class="stat-block" id="stat-block-2">
      <h2 class="damage-block">Changes B</h2>
      <ul>
        <li class="input-container input-header"><span class="input-text">Stat</span><span class="input-full">Value</span><span class="input-perc">%</span></li>
        <li class="input-container" v-for="stat in Object.keys(stats)" :key="stat">
          <span class="input-text">{{ statNames[stat] }}</span>
          <span class="input-full"><input type="text" inputmode="numeric" class="input-full" v-model.number="statsB[stat][0]"></span>
          <span class="input-perc"><input type="text" inputmode="numeric" class="input-perc" v-model.number="statsB[stat][1]"></span>
        </li>
      </ul>
      <div class="damage-block">
        <h2>Damage Increase</h2>
        <span class="damage-top" :class="{ 'damage-positive': increases['avg'][1][0] === '+', 'damage-negative': increases['avg'][1][0] === '-' }">{{ increases['avg'][1] }}</span>
        <span class="damage-mid">{{ damage['avg'][2] }}</span>
        <div class="damage-container">
          <span class="damage-text">Average</span>
        </div>
        <br>
        <div class="damage-container">
          <span class="damage-mid" :class="{ 'damage-positive': increases['normal'][1][0] === '+', 'damage-negative': increases['normal'][1][0] === '-' }">{{ increases['normal'][1] }}</span>
          <span class="damage-mid" :class="{ 'damage-positive': increases['boss'][1][0] === '+', 'damage-negative': increases['boss'][1][0] === '-' }">{{ increases['boss'][1] }}</span>
        </div>
        <div class="damage-container">
          <span class="damage-text">{{ damage['normal'][2] }}</span>
          <span class="damage-text">{{ damage['boss'][2] }}</span>
        </div>
        <div class="damage-container">
          <span class="damage-text">Normal</span>
          <span class="damage-text">Boss</span>
        </div>
        <div>
        </div>
      </div>
      <div class="damage-block">
        <h2>Buffed Damage Increase</h2>
        <span class="damage-top" :class="{ 'damage-positive': buffedIncreases['avg'][1][0] === '+', 'damage-negative': buffedIncreases['avg'][1][0] === '-' }">{{ buffedIncreases['avg'][1] }}</span>
        <span class="damage-mid">{{ buffedDamage['avg'][2] }}</span>
        <div class="damage-container">
          <span class="damage-text">Average</span>
        </div>
        <br>
        <div class="damage-container">
          <span class="damage-mid" :class="{ 'damage-positive': buffedIncreases['normal'][1][0] === '+', 'damage-negative': buffedIncreases['normal'][1][0] === '-' }">{{ buffedIncreases['normal'][1] }}</span>
          <span class="damage-mid" :class="{ 'damage-positive': buffedIncreases['boss'][1][0] === '+', 'damage-negative': buffedIncreases['boss'][1][0] === '-' }">{{ buffedIncreases['boss'][1] }}</span>
        </div>
        <div class="damage-container">
          <span class="damage-text">{{ buffedDamage['normal'][2] }}</span>
          <span class="damage-text">{{ buffedDamage['boss'][2] }}</span>
        </div>
        <div class="damage-container">
          <span class="damage-text">Normal</span>
          <span class="damage-text">Boss</span>
        </div>
        <div>
        </div>
      </div>
    </div>
  </div>

  <!-- information block -->
  <div v-if="displayWindow['info']" class="info-block">
    <h2>Damage Formula</h2>
    This calculator aims to use your character's stats in order to determine either your average or exact damage to a specific target in specific conditions.
    <br>
    From research done by players in the past, the general damage formula has been determined to be as follows, when attacking the soft dummy in the fight arena:
    <br><br>
    <!-- base, multipliers, damage basic formulas -->
    <img src="./assets/formula_base_basic.png" alt="">
    <br><br>
    <img src="./assets/formula_multipliers_basic.png" alt="">
    <br><br>
    <img src="./assets/formula_damage_basic.png" alt="">
    <br><br>
    First, there are two main components: the base, concerning stats which are additive, which consists of Attack/Intensity (referred to as simply Attack within this
    explanation), Strength/Magic (similarly, referred to as Strength), Static Damage and Normal/Boss Added Damage (referred to as simply Added Damage), and the multipliers,
    consisting of stats that multiply the base and themselves, those being Critical Damage, Minimum/Maximum Damage and Normal/Boss Amplification.
    <br><br>
    Most of those values are obtained from our visible stats in-game, except for two: <em>Attack Factor</em> and <em>Strength Factor</em>.
    Those two values are skill-scaling factors which are different for every skill within the game, but there are a few standard rules:
    <br>
    - For both of those values and when applicable, increasing skill levels will increase their value by a fixed amount.
    <br>
    - Attack Factor is present in every skill, typically being higher for direct damage skills and it affects how each skill scales with Attack.
    <br>
    - Strength Factor is present only in summon skills, affecting how those skills scale with Strength, Static Damage and Added Damage.
    <br>
    - Bleed (Additional Damage) scale with the Attack Factor but do not scale with skill levels, except on buffs that have levels such as Demigod's Seres' Grace.
    <br>
    For more information on factors, the values of the factors for each class' skills and recommended factors to use within the calculator for each class, please see: (link to factor research)
    <h3>Minimum Weight</h3>
    When actually dealing damage in the game, every hit will roll a random value between your Minimum and Maximum damage and utilize that value for that specific hit.
    For the purposes of this calculator, we utilize a <em>Minimum Weight</em> value within the configurations to determine how much both of those stats influence in the
    average damage:
    <br><br>
    <!-- full multiplier formula -->
    <img src="./assets/formula_multipliers_weighted.png" alt="">
    <br><br>
    To consider maximum damage, set it to 0%. General scenarios, set it to 50%. Considering optimal usage of LL6, set it to 30%.
    <h3>Boss Weight</h3>
    The average damage displayed under each stat block refers to a generic average amount of damage you'd do in your runs, between normal and boss damage. This value is simply
    a weighted average between Normal and Boss damage, set by the Boss Weight within the configurations. In the current endgame meta (7k), it's recommended to set it to 50%.
    Note that this does not mean Normal or Boss are particularly more worthwhile investing than the other - this will differ depending on class, playstyle and personal preferences.
    <h3>Defense</h3>
    When considering mob's defense values, the formula is altered slightly. We do not yet have full knowledge of how those stats function, as it is obscured from us as players
    and can behave in odd manners, but for an approximate understanding of how defense affects your damage, there are three variables to be aware of:
    <br>
    - <strong>Defense Scaling</strong>: This value directly affects your Attack and Strength and acts as a multiplier, with a value between 0% and 100%, reducing those stats. 
    Static Damage and Added Damage ignore this value and are not reduced.
    <br>
    - <strong>Flat Defense</strong>: This is a flat value that is subtracted from your base after adding your other base stats and scales with Strength Factor, thus more strongly affects your summon skills.
    <br>
    - <strong>Damage Mitigation</strong>: This is a final multiplier occuring at the end of the damage calculation, reducing your damage by a set percentage. Similarly to Defense Scaling, Damage Mitigation can go anywhere from 0% to 100%.
    <br><br>
    With those variables in mind, the damage formula when accounting for defense would be:
    <br><br>
    <!-- base, multipliers, damage full formulas -->
    <img src="./assets/formula_base_full.png" alt="">
    <br><br>
    <img src="./assets/formula_multipliers_weighted.png" alt="">
    <br><br>
    <img src="./assets/formula_damage_full.png" alt="">
    <br><br>
    Note that we don't have direct access to how those values change from mob to mob and are collected from testing in-game, so when using this calculator
    to calculate damage versus mobs with defense, please understand that the values are but approximations and might differ from a realistic scenario. 
    <br><br>
    In this context, within configurations there are three options to choose to calculate your damage:
    <br>
    - <strong>Soft Dummy</strong>: The soft dummy in the fight arena. Has zero defense in every aspect. Formula is more accurate for this one.
    <br>
    - <strong>Durable Dummy</strong>: The durable dummies in the fight arena. Has a small amount of defenses, but large mitigation. Will be changed in 7k update.
    <br>
    - <strong>7k Normal Mob</strong>: [WIP] Normal mobs found within the 7000 dungeon in normal mode. These mobs will have defense scaling, damage mitigation and a small amount of flat defense.
    <br>
    - <strong>7k Boss Mob</strong>: [WIP] The boss found within the 7000 dungeon, before any phase changes. The boss will have defense scaling, greater damage mitigation and a large amount of flat defense.
    <br><br>

    Due to the large amount of flat defense on the boss mob, you might notice your summon skills hitting for much less than your direct skills.

  </div>

  <!-- general configs block -->
  <!-- to add: export button, reset stats button -->
  <div v-if="displayWindow['config']" class="container config-block">
    <div class="stat-block">
      <h2 class="damage-block">Settings</h2>
      <li class="input-container">
        <span class="input-text">Strength Factor</span>
        <span><input type="text" inputmode="numeric" class="input-full" v-model.number="settings['sF']"></span>
        <span class="input-perc"></span>
      </li>
      <li class="input-container">
        <span class="input-text">Attack Factor</span>
        <span><input type="text" inputmode="numeric" class="input-full" v-model.number="settings['aF']"></span>
        <span class="input-perc"></span>
      </li>
      <li class="input-container">
        <span class="input-text">Minimum Damage Weight</span>
        <span class="input-full"><input type="range" min="0" max="0.5" step="0.025" class="input-slider" v-model="settings['minWeight']"></span>
        <span class="input-perc" id="minWeightText">{{ (settings['minWeight']*100).toFixed(1) }}%</span>
      </li>
      <li class="input-container">
        <span class="input-text">Boss Weight</span>
        <span class="input-full"><input type="range" min="0" max="1" step="0.025" class="input-slider" v-model="settings['bossWeight']"></span>
        <span class="input-perc" id="bossWeightText">{{ (settings['bossWeight']*100).toFixed(1) }}%</span>
      </li>
      <li class="input-container">
        <span class="input-text">Target</span>
        <span>
          <select v-model="settings['target']" @change="updateDefenses">
            <option value="soft">Soft Dummy</option>
            <option value="durable">Durable Dummy</option>
            <!-- <option value="normal">7k Normal Mob</option>
            <option value="boss">7k Boss</option> -->
          </select>
        </span>
        <span class="input-perc"></span>
      </li>
    </div>
    <div>
      
    </div>
    <div>

    </div>
  </div>
  <!-- buffs window -->
  <div v-if="displayWindow['buffs']" class="buff-block">
    <h2 class='damage-block'>Buffs</h2>
    <div class='buff-buttons'>
      <button @click="toggleBuffs('Minimal')">Toggle Minimal</button>
      <button @click="toggleBuffs('Midterm')">Toggle Midterm</button>
      <button @click="toggleBuffs('Maxed')">Toggle Maxed</button>
      <button @click="toggleBuffs('Event')">Toggle Event</button>
      <button @click="toggleBuffs('Party')">Toggle Party</button>
      <button @click="toggleBuffs('Clear')">Deselect All</button>
    </div>
    <div v-for="tier in Object.keys(buffs)" :key="tier">
      <div class="buff-separator">{{ tier }}</div>
      <div v-for="buffType in Object.keys(buffs[tier])" :key="buffType" class="buff-tier">
        <div v-if="buffType === 'single'" v-for="buff in Object.keys(buffs[tier][buffType])" :key="buff" class="buff-individual">
          <input type="checkbox" :id="buff" :value="buff" v-model="selectedBuffs[tier][buffType][buff]" class="buff" >
          <label :for="buff" 
          @mouseenter="tooltip = true; tooltipText = formatBuffTooltip(buffs[tier][buffType][buff])" 
          @mousemove.self="onMouseMove($event)" @mouseleave="tooltip=false">{{ buff }}</label>
        </div>
        <div v-else class="buff-individual">
          <span 
          @mouseenter="tooltip = true; tooltipText = formatBuffTooltipMulti(buffs[tier][buffType])" 
          @mousemove.self="onMouseMove($event)" @mouseleave="tooltip=false">{{ buffType }}:</span>
          <select v-model="selectedBuffs[tier][buffType]" class="buff">
            <option disabled value=""></option>
            <option>None</option>
            <option v-for="buff in Object.keys(buffs[tier][buffType])" :value="buff">{{ buff }}</option>
          </select>
        </div>
      </div>
    </div>
  </div>
  <!-- equivalence tables -->
  <div v-if="displayWindow['equivalence']" class="equivalence-block">
    <div class="equivalence-container">
      <h2 class='damage-block'>DI Equivalence</h2>
      <div class="input-container">
        <span class="input-text">Damage Increase</span>
        <span><input type="text" inputmode="numeric" class="input-full" v-model.number="equivalenceValues.perc"></span> %
      </div>
      <table class="equivalence-table"> 
        <tr><th>Stat</th><th>Flat needed</th><th>% needed</th></tr>
        <tr v-for="stat in Object.keys(stats)">
          <td>{{ statNames[stat] }}</td><td>{{ equivalencePercent[stat][0] }}</td><td>{{ equivalencePercent[stat][1] }}</td>
        </tr>
      </table>
    </div>
    <div class="equivalence-container">
      <h2 class='damage-block'>Critical Equivalence</h2>
      <div class="input-container">
        <span class="input-text">Critical Damage</span>
        <span><input type="text" inputmode="numeric" class="input-full" v-model.number="equivalenceValues.critical"></span>
      </div>
      <table class="equivalence-table">
        <tr><th>Stat</th><th>Equivalent to</th><th>%</th></tr>
        <tr v-for="stat in Object.keys(stats)">
          <td>{{ statNames[stat] }}</td><td>{{ equivalenceCritical[stat][0] }}</td><td>{{ equivalenceCritical[stat][1] }}</td>
        </tr>
      </table>
    </div>
  </div>

  <!-- tooltip on mouse -->
  <div v-if="tooltip" id="tooltip" :style="{left: tooltipPosition[0] + 'px', top: tooltipPosition[1] + 'px'}">
    {{ tooltipText }}
  </div>
</template>
