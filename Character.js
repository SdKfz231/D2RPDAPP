class Character {
  constructor({
    name = 'Character Name',
    charClass = 'Class',
    level = 0,
    experience = 0,
    statPts = 0,
    gold = 0,
    life = 0,
    mana = 0,
    stats = {
      strength: { base: 10, adjust: 0 },
      dexterity: { base: 10, adjust: 0 },
      constitution: { base: 10, adjust: 0 },
      intelligence: { base: 10, adjust: 0 },
      wisdom: { base: 10, adjust: 0 },
      charisma: { base: 10, adjust: 0 }
    },
    skills = {},
    inventory = {
      backpack: [],
      belt: [],
      equipment: {
        head: null, neck: null, body: null, waist: null,
        hand1: null, hand2: null, offhand1: null, offhand2: null,
        finger1: null, finger2: null, hands: null, feet: null
      }
    }
  } = {}) {
    this.name = name;
    this.charClass = charClass;
    this.level = level;
    this.experience = experience;
    this.statPts = statPts;
    this.gold = gold;
    this.stats = stats;
    this.life = arguments.life !== undefined ? arguments.life : this.getMaxLife();
    this.mana = arguments.mana !== undefined ? arguments.mana : this.getMaxMana();
    this.skills = skills;
    this.inventory = inventory;
  }

  getName() {
    return this.name;
  }

  getClass() {
    return this.charClass;
  }

  getLevel() {
    return this.level;
  }

  getLife() {
    return this.life;
  }

  adjustLife(amount) {
    this.life += amount;
    console.log(`Adjusting life by ${amount} to ${this.life}`);
  }

  getMaxLife() {
    return (this.level + 1) * this.getStatModifier('constitution') + 20;
  }

  getLifeRegen() {
    return 1 + this.getStatModifier('constitution');
  }

  getMana() {
    return this.mana;
  }

  adjustMana(amount) {
    this.mana += amount;
    console.log(`Adjusting mana by ${amount} to ${this.mana}`);
  }

  getMaxMana() {
    return (this.level + 1) * this.getStatModifier('intelligence') + 10;
  }

  getManaRegen() {
    return 1 + this.getStatModifier('intelligence');
  }

  regenerate() {
    this.adjustLife(this.getLifeRegen());
    this.adjustMana(this.getManaRegen());
  }

  getStatTotal(stat) {
    if (this.stats[stat]) {
        return this.stats[stat].base + this.stats[stat].adjust;
    }
    return 0;
  }

  getStatModifier(stat) {
    return Math.floor((this.getStatTotal(stat) - 10) / 2);
  }

  getStatPts() {
    return this.statPts;
  }

  getExperience() {
    return this.experience;
  }

  getRequiredXP() {
    return (this.level) * 1000;
  }

  adjustExperience(amount) {
    this.experience += amount;
    console.log(this.experience);
    this.checkLevelProgress();
  }
  
  checkLevelProgress() {
    if (this.experience >= this.getRequiredXP()) {
        this.experience -= this.getRequiredXP();
        this.level += 1;
        this.statPts += 1;
        this.life = this.getMaxLife(); // Heal to full on level up
        this.mana = this.getMaxMana(); // Restore mana to full on level up
        console.log(`Leveled up to ${this.level}!`);
    }
    if (this.experience < 0) {
        if (this.level === 1) {
            this.experience = 0;
            return;
        } else {
            this.level -= 1;
            this.experience += this.getRequiredXP();
            this.statPts -= 1;
            if (this.life > this.getMaxLife()) this.life = this.getMaxLife();
            if (this.mana > this.getMaxMana()) this.mana = this.getMaxMana();
            console.log(`Leveled down to ${this.level}!`);
        }
    }
  }

  getGold() {
    return this.gold;
  }

  addGold(amount) {
    this.gold += amount;
  }

  spendGold(amount) {
    if (this.gold >= amount) {
      this.gold -= amount;
      return true;
    }
    return false;
  }

  getArmorClass() {
    let armor = this.getStatModifier('dexterity');
    Object.values(this.inventory.equipment).forEach(element => {
        if (element && element.stats && element.stats.ac) {
            armor += element.stats.ac; }
    });
    return armor;
  }

  getMovementDistance() {
    let distance = 20;
    distance += this.getStatModifier('dexterity') * 5;
    Object.values(this.inventory.equipment).forEach(element => {
        if (element && element.properties && element.properties.movement) {
            distance += element.properties.movement;
        }
    });
    return distance;
  }

  getResistance(type) {
    let resistance = 0;
    if (['magic'].includes(type)) {
        resistance = this.getStatModifier('wisdom');
    } else if (['fire', 'cold', 'lightning', 'poison'].includes(type)) {
        resistance = this.getStatModifier('constitution');
    }
    Object.values(this.inventory.equipment).forEach(element => {
        if (element && element.properties && element.properties[type]) {
            resistance += element.properties[type];
        }
    });
    return resistance;
  }

  // Add more methods as needed
}

export default Character;
