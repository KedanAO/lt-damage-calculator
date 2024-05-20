const buffs = {
  'Minimal': {
    'single': {
      'Nightmare Relic +4': {'strength':[0,15], 'attack':[0,5]},
      'Guild Relic +9': {'static':[0,10]},
      'Richiring': {'critical':[20,0], 'minimum':[20,0], 'maximum':[20,0]},
      'Herald of Fragments': {'attack':[0,3]},
      'Book Buffs': {'attack':[0,5], 'strength':[0,5], 'critical':[0,5]},
      'Flask of Battle': {'attack':[20,5], 'minimum':[10,0], 'maximum':[10,0], 'strength':[0,15], 'critical':[30,0]},
      'Sweet Mutant Special': {'minimum':[40,0], 'critical':[30,0]},
      'Starkeeper Title': {'critical':[200,0]},
    },
    'Food': {
      'Chicken Soup': {'critical':[25,0]},
      'Fried Eel': {'maximum':[20,0]},
    },
  },
  'Midterm': {
    'single': {
      'Hero Nostrum I': {'maximum':[15,0], 'critical':[20,0], 'strength':[100,0]},
      'Hero Nostrum II': {'attack':[0,10], 'minimum':[15,0]},
      'Guild Banana/Juice': {'critical':[30,0]},
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
      'Fisherman Blessing': {'critical':[50,0]},
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
      'Long Eastland Ice Tea': {'attack':[30,0], 'critical':[20,0]},
      'Fun Blessing': {'maximum':[40,0], 'critical':[60,0]},
      'Special Combat Potion': {'critical':[30,0], 'maximum':[30,0]},
    },
    'Bungbung': {
      'Eastland Bungbung Drink': {'attack':[50,0]},
      'Freios Bungbung Drink': {'maximum':[15,0]},
    },
  },
  'Party': {
    'single': {
      'Popstar Buffs': {'strength':[0,12], 'minimum':[40,0], 'maximum':[75,0], 'critical':[30,0]},
      'Black Anima Buffs': {'attack':[0,10], 'minimum':[0,3], 'maximum':[0,3], 'critical':[0,3]}
    },
  },
}

export default buffs;