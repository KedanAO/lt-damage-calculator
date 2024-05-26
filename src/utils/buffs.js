const buffs = {
  'Minimal': {
    'single': {
      'Richiring': {'critical':[20,0], 'minimum':[20,0], 'maximum':[20,0]},
      'Herald of Fragments': {'attack':[0,3]},
      'Book Buffs': {'attack':[0,5], 'strength':[0,5], 'critical':[0,5]},
      'Flask of Battle': {'attack':[20,5], 'minimum':[10,0], 'maximum':[10,0], 'strength':[0,15], 'critical':[30,0]},
      'Sweet Mutant Special': {'minimum':[40,0], 'critical':[30,0]},
      'Starkeeper Critical Damage Booster': {'critical':[25,0]},
      'Starkeeper Title': {'critical':[200,0]},
    },
    'Food': {
      'Chicken Soup': {'critical':[25,0]},
      'Fried Eel': {'maximum':[20,0]},
    },
    'Relic': {
      'Orb +0': {'strength':[0,10]},
      'Orb +1': {'strength':[0,11]},
      'Orb +2': {'strength':[0,12]},
      'Orb +3': {'strength':[0,13]},
      'Orb +4': {'strength':[0,14]},
      'Orb +5': {'strength':[0,15]},
      'Nightmare +0': {'strength':[0,15], 'attack':[0,1]},
      'Nightmare +1': {'strength':[0,15], 'attack':[0,2]},
      'Nightmare +2': {'strength':[0,15], 'attack':[0,3]},
      'Nightmare +3': {'strength':[0,15], 'attack':[0,4]},
      'Nightmare +4': {'strength':[0,15], 'attack':[0,5]},
    },
    'Guild Relic': {
      '+0': {'static':[0,1]},
      '+1': {'static':[0,2]},
      '+2': {'static':[0,3]},
      '+3': {'static':[0,4]},
      '+4': {'static':[0,5]},
      '+5': {'static':[0,6]},
      '+6': {'static':[0,7]},
      '+7': {'static':[0,8]},
      '+8': {'static':[0,9]},
      '+9': {'static':[0,10]},
    },
  },
  'Midterm': {
    'single': {
      'Hero Nostrum I': {'maximum':[15,0], 'critical':[20,0], 'strength':[100,0]},
      'Hero Nostrum II': {'attack':[0,10], 'minimum':[15,0]},
      'Guild Banana/Juice': {'critical':[30,0]},
      'Alvis Helper Potion': {'strength':[0,3]},
    },
    'Syrup': {
      'Premium Syrup': {'critical':[40,0], 'minimum':[30,0], 'maximum':[30,0], 'strength':[0,3], 'attack':[0,3]},
      'Advanced Premium Syrup': {'critical':[60,0], 'minimum':[50,0], 'maximum':[50,0], 'strength':[0,5], 'attack':[0,5]},
    },
  },
  'Maxed': {
    'single': {
      'Sweet Mutant Critical': {'critical':[40,0]},
      'Sweet Mutant Maximum': {'maximum':[40,0]},
      'Fatal Perfume': {'critical':[30,0]},
      'Long Eastland Ice Tea': {'attack':[30,0], 'critical':[20,0]},
      'Fisherman Blessing': {'critical':[50,0]},
      'Strength/Magic Holy Water': {'strength':[0,10]},
      'Dual Critical Damage I Holy Water': {'critical':[40,0]},
      'Dual Critical Damage II Holy Water': {'critical':[40,0]},
      'Attack/Elemental Intensity Holy Water': {'attack':[0,10]},
      'Excellent Luck': {'critical':[20,0]},
    },
    'Booster': {
      'Union Critical Booster': {'critical':[120,0]},
      'Union Damage Booster': {'minimum':[70,0], 'maximum':[70,0]},
    },
    'Rep Food': {
      'Reputation Abalone Champon': {'attack':[0,5]},
      'Reputation Galbijjim': {'static':[0,10]},
    },
  },
  'Event': {
    'single': {
      'Fun Blessing': {'maximum':[40,0], 'critical':[60,0]},
      'Special Combat Potion': {'critical':[30,0], 'maximum':[30,0]},
      'Summer Festival Utility Potion': {'strength':[0,10]},
      'Space Food': {'attack':[0,5]},
      'Winter Rations': {'strength':[0,3],'critical':[30,0]},
      'Valentine Chocolate': {'strength':[0,10]}
    },
    'Bungbung': {
      'Eastland Bungbung Drink': {'attack':[50,0]},
      'Freios Bungbung Drink': {'maximum':[15,0]},
    },
    'Summer Combat': {
      'Maximum': {'maximum':[50,0]},
      'Critical': {'critical':[50,0]},
    },
    'Attendance Drink': {
      'Minimum': {'minimum':[30,0]},
      'Maximum': {'maximum':[30,0]},
      'Basic': {'strength':[0,5]},
      'Critical': {'critical':[30,0]},
      'Attack/Intensity': {'attack':[0,5]},
    },
  },
  'Party': {
    'single': {
      'Popstar Buffs': {'strength':[0,12], 'minimum':[40,0], 'maximum':[75,0], 'critical':[30,0]},
      'Black Anima Buffs': {'attack':[0,10], 'minimum':[0,3], 'maximum':[0,3], 'critical':[0,3]},
      'Couple':{'strength':[0,10]}
    },
  },
  'Skillbooks': {
    'Attendance': {
      "King's Attendance": {'strength':[0,10], 'maximum':[10,0]},
      'I Am An Artisan': {'strength':[0,10], 'minimum':[20,0], 'maximum':[20,0]},
    },
    'single': {
      'Guild Blessing': {'maximum':[10,0], 'critical':[10,0]},
      'Quiz Master': {'critical':[5,0], 'maximum':[5,0]},
      "Hunter's Power": {'strength':[0,2], 'maximum':[10,0], 'critical':[10,0]},
      'Shadow Effect': {'attack':[30,0]},
      "Attacker's Skill": {'attack':[30,5]},
    }
  }
}

export default buffs;