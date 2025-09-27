import Character from "./Character.js";
// --- STATE ---
let backpackGridState = []; 
let draggedItemId = null; 
let beltGridState = []; 
const CELL_SIZE = 40; 
const GAP_SIZE = 1; 
const PACK_COLS = 8; 
const PACK_ROWS = 6;
const BELT_COLS = 6; 
let BELT_ROWS = 1;

let characterState = new Character({
	name: 'Character Name', charClass: 'Class', level: 0, experience: 0, statPts: 0, gold: 0, life: 0, mana: 0, 
	stats: { strength: { base: 10, adjust: 0 }, 
		dexterity: { base: 10, adjust: 0 }, 
		constitution: { base: 10, adjust: 0 }, 
		intelligence: {base: 10, adjust: 0}, 
		wisdom: { base: 10, adjust: 0}, 
		charisma: { base: 10, adjust: 0} },
	skills: {},
	inventory: { backpack: [], belt: [], 
	equipment: {
		head: null, neck: null, body: null, waist: null, hand1: null, hand2: null, offhand1: null, offhand2: null, 
		finger1: null, finger2: null, hands: null, feet: null,
	} },
});  

function getCharacterState() {
    return characterState;
}

function setCharacterState(newState) {
	if (newState instanceof Character) {
		characterState = newState ;
	} else if (newState) {
        Object.assign(characterState, newState);
    }
	renderCharacterToDOM();
}

// --- DOM ELEMENTS ---
const characterDOM = {
	name: null,	class: null, level: null, armor: null, movement: null, statPts: null,
	gold: { total: null, input: null, buttons: null },
	experience: { current: null, required: null, adjust: null, buttons: null,},
	stats: { strength: { total: null, modifier: null }, 
		dexterity: { total: null, modifier: null },  
		constitution: { total: null, modifier: null },  
		intelligence: { total: null, modifier: null },  
		wisdom: { total: null, modifier: null }, 
		charisma: { total: null, modifier: null } },
	resistances: { fire: null, cold: null, lightning: null, poison: null, magic: null },
	life: { current: null, max: null, mod: null, regen: null, fill: null, buttons: null },
	mana: { current: null, max: null, mod: null, regen: null, fill: null, buttons: null },
	primary: { name: null, type: null, damage: null, speed: null, properties: null },
	secondary: { name: null, type: null, damage: null, speed: null, properties: null },
};

// --- FUNCTIONS ---
function initializeStatsDOM() {
	characterDOM.name = document.getElementById('name');
	characterDOM.class = document.getElementById('class');
	characterDOM.level = document.getElementById('level');
	characterDOM.gold.total = document.getElementById('gold-total');
	characterDOM.gold.input = document.getElementById('gold-input');
	characterDOM.gold.buttons = document.querySelectorAll('.gold-button');
	characterDOM.experience.current = document.getElementById('xp-current');
	characterDOM.experience.required = document.getElementById('xp-required');
	characterDOM.experience.adjust = document.getElementById('xp-adjust');
	characterDOM.experience.buttons = document.querySelectorAll('.xp-button');
	characterDOM.statPts = document.getElementById('stat-pts');
	characterDOM.stats.strength.total = document.getElementById('strength-total');
	characterDOM.stats.strength.modifier = document.getElementById('strength-mod');
	characterDOM.stats.dexterity.total = document.getElementById('dexterity-total');
	characterDOM.stats.dexterity.modifier = document.getElementById('dexterity-mod');
	characterDOM.stats.constitution.total = document.getElementById('constitution-total');
	characterDOM.stats.constitution.modifier = document.getElementById('constitution-mod');
	characterDOM.stats.intelligence.total = document.getElementById('intelligence-total');
	characterDOM.stats.intelligence.modifier = document.getElementById('intelligence-mod');
	characterDOM.stats.wisdom.total = document.getElementById('wisdom-total');
	characterDOM.stats.wisdom.modifier = document.getElementById('wisdom-mod');
	characterDOM.stats.charisma.total = document.getElementById('charisma-total');
	characterDOM.stats.charisma.modifier = document.getElementById('charisma-mod');
	characterDOM.resistances.fire = document.getElementById('res-fire');
	characterDOM.resistances.cold = document.getElementById('res-cold');
	characterDOM.resistances.lightning = document.getElementById('res-lightning');
	characterDOM.resistances.poison = document.getElementById('res-poison');
	characterDOM.resistances.magic = document.getElementById('res-magic');
	characterDOM.armor = document.getElementById('armor');
	characterDOM.movement = document.getElementById('movement');
	characterDOM.life.current = document.getElementById('life-current');
	characterDOM.life.max = document.getElementById('life-max');
	characterDOM.life.mod = document.getElementById('life-mod');
	characterDOM.life.regen = document.getElementById('life-regen');
	characterDOM.life.fill = document.getElementById('life-orb-fill');
	characterDOM.life.buttons = document.querySelectorAll('.life-button');
	characterDOM.mana.current = document.getElementById('mana-current');
	characterDOM.mana.max = document.getElementById('mana-max');
	characterDOM.mana.mod = document.getElementById('mana-mod');
	characterDOM.mana.regen = document.getElementById('mana-regen');
	characterDOM.mana.fill = document.getElementById('mana-orb-fill');
	characterDOM.mana.buttons = document.querySelectorAll('.mana-button');
	characterDOM.primary.name = document.getElementById('primary-name');
	characterDOM.primary.type = document.getElementById('primary-type');
	characterDOM.primary.damage = document.getElementById('primary-damage');
	characterDOM.primary.speed = document.getElementById('primary-speed');
	characterDOM.primary.properties = document.getElementById('primary-properties');
	characterDOM.secondary.name = document.getElementById('secondary-name');
	characterDOM.secondary.type = document.getElementById('secondary-type');
	characterDOM.secondary.damage = document.getElementById('secondary-damage');
	characterDOM.secondary.speed = document.getElementById('secondary-speed');
	characterDOM.secondary.properties = document.getElementById('secondary-properties');
	// Experience Buttons
	characterDOM.experience.buttons.forEach(button => {
		button.addEventListener('click', () => { console.log("Adjusting XP"); calcExperience(button.dataset.operation) }) });
	// Life Buttons 
	characterDOM.life.buttons.forEach(button => {
		button.addEventListener('click', () => calcLife(button.dataset.operation) ) });
	// Mana Buttons 
	characterDOM.mana.buttons.forEach(button => {
		button.addEventListener('click', () => calcMana(button.dataset.operation) ) });
	// Gold Buttons
	characterDOM.gold.buttons.forEach(button => {
		button.addEventListener('click', () => calcGold(button.dataset.operation) ) });
}

function calcExperience ( operation ) {
	let value = parseInt(characterDOM.experience.adjust.value) || 0;
	if ( operation === "add" ) {
		console.log("Adding XP:", value);
		characterState.adjustExperience(value);
	}
	if ( operation === "subtract" ) {
		console.log("Subtracting XP:", value);
		characterState.adjustExperience(-value);
	}
	renderCharacterToDOM(); // Ensure UI updates
}

function calcLife ( operation ) {
	let value = parseInt(characterDOM.life.mod.value) || 0;
	if ( operation === "add" ) {
		console.log("Adding Life:", value);
		characterState.adjustLife(value);
	}
	if ( operation === "subtract" ) {
		console.log("Subtracting Life:", value);
		characterState.adjustLife(-value);
	}
	renderCharacterToDOM(); // Ensure UI updates
}

function calcMana ( operation ) {
	let value = parseInt(characterDOM.mana.mod.value) || 0;
	if ( operation === "add" ) {
		console.log("Adding Mana:", value);
		characterState.adjustMana(value);
	}
	if ( operation === "subtract" ) {
		console.log("Subtracting Mana:", value);
		characterState.adjustMana(-value);
	}
	renderCharacterToDOM(); // Ensure UI updates
}

// --- Inventory Functions ---	
function updateEquipmentStats() { 
	let gearAcBonus = 0; 
	const weaponSlots = { weapon1: characterDOM.weapon1, weapon2: characterDOM.weapon2 }; 
	Object.keys(weaponSlots).forEach(key => { 
		weaponSlots[key].name.textContent = ''; 
		weaponSlots[key].damage.textContent = ''; 
		weaponSlots[key].speed.textContent = ''; }); 
	Object.keys(characterDOM.equipment).forEach(slotKey => { 
		const slot = characterDOM.equipment[slotKey]; 
		const itemEl = slot.querySelector('.draggable-item'); 
		if (itemEl) { 
			const baseId = itemEl.dataset.itemId; 
			const item = itemDatabase[baseId]; 
			if (item.stats.ac && (slotKey !== 'weapon3' && slotKey !== 'weapon4')) { gearAcBonus += item.stats.ac; } 
			if (slotKey === 'weapon1' || slotKey === 'weapon2' ) { 
				const weaponUI = weaponSlots[slotKey]; 
				weaponUI.name.textContent = item.name; 
				if (item.stats.dmg) {
					weaponUI.type.textContent = "DAMAGE";
					weaponUI.damage.textContent = item.stats.dmg; }
				if (item.stats.ac) { 
					//gearAcBonus += item.stats.ac; 
					weaponUI.type.textContent = "AC";
					weaponUI.damage.textContent = item.stats.ac; }
				if (item.stats.speed) {
					weaponUI.speedLbl.textContent = "SPEED";
					weaponUI.speed.textContent = item.stats.speed; }
				if (!item.stats.speed) {
					weaponUI.speedLbl.textContent = "-";
					weaponUI.speed.textContent = ""; } } } }); 
	const baseAc = parseInt(characterDOM.ac.base.value) || 0; 
	const totalAc = baseAc + gearAcBonus; 
	characterDOM.ac.display.textContent = totalAc; 
	characterDOM.ac.display.title = `${baseAc} (Base) + ${gearAcBonus} (Gear) = ${totalAc}`; }

// Swap weapon Slots
function swapWeapon() {
	const temp1 = characterDOM.equipment['hand1'];
	const temp2 = characterDOM.equipment['offhand1'];
	characterDOM.equipment['hand1'] = characterDOM.equipment['hand2'];
	characterDOM.equipment['offhand1'] = characterDOM.equipment['offhand2'];
	characterDOM.equipment['hand2'] = temp1;
	characterDOM.equipment['offhand2'] = temp2;
	updateEquipmentStats();
}

function renderCharacterToDOM() {
	characterDOM.name.innerHTML = characterState.getName();
	characterDOM.class.innerHTML = characterState.getClass();
	characterDOM.level.textContent = characterState.getLevel();
	characterDOM.gold.total.textContent = characterState.getGold();
	characterDOM.experience.current.textContent = characterState.getExperience() || '0';
	characterDOM.experience.required.textContent = requiredXP || '1000';
	characterDOM.statPts.textContent = characterState.getStatPts() || '0';
	for (const stat in characterState.stats) {
		characterDOM.stats[stat].total.textContent = characterState.getStatTotal(stat);
		characterDOM.stats[stat].modifier.textContent = 
			characterState.getStatModifier(stat) >= 0 ? `+${characterState.getStatModifier(stat)}` : characterState.getStatModifier(stat);
	}
	for (const resist in characterDOM.resistances) {
		characterDOM.resistances[resist].textContent = characterState.getResistance(resist) || '0';
	}
	characterDOM.life.max.textContent = characterState.getMaxLife();
	characterDOM.life.current.textContent = Math.min(characterState.getLife(), characterState.getMaxLife());
	characterDOM.life.fill.style.height = `${(characterState.getLife() / characterState.getMaxLife()) * 100}%`;
	characterDOM.mana.max.textContent = characterState.getMaxMana();
	characterDOM.mana.current.textContent = Math.min(characterState.getMana(), characterState.getMaxMana());
	characterDOM.mana.fill.style.height = `${(characterState.getMana() / characterState.getMaxMana()) * 100}%`;
	//updateOrbs();
	characterDOM.armor.textContent = characterState.getArmorClass();
	characterDOM.movement.textContent = `${characterState.getMovementDistance()} ft.`;
}

// --- HELPER FUNCTIONS ---
const requiredXP = ( characterState.getLevel() + 1 ) * 1000;

// --- EVENT LISTENERS ---


export { initializeStatsDOM, getCharacterState, setCharacterState  };
