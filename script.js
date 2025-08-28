// --- STATE ---
let backpackGridState = []; let draggedItemId = null;

// --- DOM ELEMENTS ---
const elements = {
	tabs: { 
		stats: document.getElementById('tab-stats'), 
		inventory: document.getElementById('tab-inventory') },
	pages: { 
		stats: document.getElementById('stats-page'), 
		inventory: document.getElementById('inventory-page') },
	saveButton: document.getElementById('save-button'), 
	loadModalButton: document.getElementById('load-modal-button'), 
	newCharButton: document.getElementById('new-char-button'), 
	itemStashButton: document.getElementById('item-stash-button'),
	classSelector: document.getElementById('class-selector'), 
	characterNameInput: document.getElementById('character-name-input'),
	level: document.getElementById('level'),
	experience: { 
		current: document.getElementById('experience-current'), 
		required: document.getElementById('experience-required'), 
		modInput: document.getElementById('exp-mod-input'), 
		plusButton: document.getElementById('exp-plus-button'), 
		minusButton: document.getElementById('exp-minus-button') },
	statPts: document.getElementById('stat-pts'),
	ac: { 
		display: document.getElementById('ac-display'), 
		base: document.getElementById('ac-base') },
	moveRate: document.getElementById('move-rate'),
	stats: { 
		str: document.getElementById('str'), 
		dex: document.getElementById('dex'), 
		con: document.getElementById('con'), 
		int: document.getElementById('int'), 
		wis: document.getElementById('wis'), 
		cha: document.getElementById('cha') },
	mods: { 
		str: document.getElementById('str-mod'), 
		dex: document.getElementById('dex-mod'), 
		con: document.getElementById('con-mod'), 
		int: document.getElementById('int-mod'), 
		wis: document.getElementById('wis-mod'), 
		cha: document.getElementById('cha-mod') },
	life: { 
		current: document.getElementById('life-current'), 
		max: document.getElementById('life-max'),
		mod: document.getElementById('life-mod'),
		regen: document.getElementById('life-regen'),
		fill: document.getElementById('life-orb-fill'),
		plusButton: document.getElementById('life-plus-button'), 
		minusButton: document.getElementById('life-minus-button') },
	mana: { 
		current: document.getElementById('mana-current'), 
		max: document.getElementById('mana-max'),
		mod: document.getElementById('mana-mod'),
		regen: document.getElementById('mana-regen'),				
		fill: document.getElementById('mana-orb-fill'),
		plusButton: document.getElementById('mana-plus-button'), 
		minusButton: document.getElementById('mana-minus-button') },
	weapon1: { 
		name: document.getElementById('weapon1-name'),
		type: document.getElementById('weapon2-type'), 
		damage: document.getElementById('weapon1-damage'), 
		speed: document.getElementById('weapon1-speed'),
		speedLbl: document.getElementById('weapon2-speed-lbl') },
	weapon2: { 
		name: document.getElementById('weapon2-name'),
		type: document.getElementById('weapon2-type'),
		damage: document.getElementById('weapon2-damage'), 
		speed: document.getElementById('weapon2-speed'),
		speedLbl: document.getElementById('weapon2-speed-lbl') },
	/*
	weapon3: { 
		name: document.getElementById('weapon3-name'), 
		damage: document.getElementById('weapon3-damage'), 
		speed: document.getElementById('weapon3-speed') },
	weapon4: { 
		name: document.getElementById('weapon4-name'), 
		damage: document.getElementById('weapon4-damage'), 
		speed: document.getElementById('weapon4-speed') },*/
	gold: { 
		total: document.getElementById('gold-total'), 
		modInput: document.getElementById('gold-mod-input'), 
		plusButton: document.getElementById('gold-plus-button'), 
		minusButton: document.getElementById('gold-minus-button') },
	equipment: { 
		head: document.getElementById('equip-head'), 
		necklace: document.getElementById('equip-necklace'), 
		body: document.getElementById('equip-body'), 
		belt: document.getElementById('equip-belt'), 
		ring1: document.getElementById('equip-ring1'), 
		ring2: document.getElementById('equip-ring2'), 
		hands: document.getElementById('equip-hands'), 
		feet: document.getElementById('equip-feet'), 
		weapon1: document.getElementById('equip-weapon1'), 
		weapon2: document.getElementById('equip-weapon2'), 
		weapon3: document.getElementById('equip-weapon3'), 
		weapon4: document.getElementById('equip-weapon4') },
	inventory: { 
		backpack: document.getElementById('backpack-grid'), 
		ground: document.getElementById('ground-container'), 
		highlighter: document.getElementById('grid-highlighter') },
	loadModal: { 
		container: document.getElementById('load-modal'), 
		closeButton: document.getElementById('close-modal-button'), 
		list: document.getElementById('character-list') },
	alertModal: { 
		container: document.getElementById('alert-modal'), 
		message: document.getElementById('alert-message'), 
		okButton: document.getElementById('alert-ok-button') },
	stashModal: { 
		window: document.getElementById('item-stash-window'), 
		header: document.getElementById('item-stash-header'), 
		closeButton: document.getElementById('close-stash-button'), 
		list: document.getElementById('item-stash-list'), 
		categoryButtons: document.getElementById('stash-category-buttons') },
	tooltip: document.getElementById('item-tooltip'),
};

// --- FUNCTIONS ---
function switchTab(tabName) { 
	Object.keys(elements.pages).forEach(p => elements.pages[p].classList.add('hidden')); 
	Object.keys(elements.tabs).forEach(t => elements.tabs[t].classList.remove('active')); 
	elements.pages[tabName].classList.remove('hidden'); 
	elements.tabs[tabName].classList.add('active'); }
	
function customAlert(message) { 
	elements.alertModal.message.textContent = message; 
	elements.alertModal.container.classList.remove('hidden'); }
	
function updateAllDerivedStats() { 
	updateAllModifiers(); 
	updateOrbs(); 
	updateRequiredXP(); 
	updateEquipmentStats(); }
	
function calculateModifier(score) { return Math.floor((score - 10) / 2); }

function updateAllModifiers() { 
	for (const stat in elements.stats) { 
		const score = parseInt(elements.stats[stat].value, 10) || 0; 
		const modifier = calculateModifier(score); 
		elements.mods[stat].textContent = modifier >= 0 ? `+${modifier}` : modifier; } }
		
function updateOrbs() { 
	const lifeCurrent = parseInt(elements.life.current.value) || 0; 
	const lifeOrbCurrent = document.getElementById('life-orb-current');
	const lifeMax = parseInt(elements.life.max.value) || 1; 
	const lifeOrbMax = document.getElementById('life-orb-max');
	elements.life.fill.style.height = `${Math.max(0, Math.min(100, (lifeCurrent / lifeMax) * 100))}%`; 
	lifeOrbCurrent.textContent = lifeCurrent;
	lifeOrbMax.textContent = lifeMax;
	const manaCurrent = parseInt(elements.mana.current.value) || 0;
	const manaOrbCurrent = document.getElementById('mana-orb-current'); 
	const manaMax = parseInt(elements.mana.max.value) || 1;
	const manaOrbMax = document.getElementById('mana-orb-max'); 
	elements.mana.fill.style.height = `${Math.max(0, Math.min(100, (manaCurrent / manaMax) * 100))}%`;
	manaOrbCurrent.textContent = manaCurrent;
	manaOrbMax.textContent = manaMax; }
	
function regen() {
	const currLife = parseInt(elements.life.current.value, 10 ) || 0;
	const maxLife = parseInt(elements.life.max.value, 10 ) || 1;
	const regenLife = parseInt(elements.life.regen.value, 10 ) || 1;
	const currMana = parseInt(elements.mana.current.value, 10 ) || 0;
	const maxMana = parseInt(elements.mana.max.value, 10 ) || 1;
	const regenMana = parseInt(elements.mana.regen.value, 10 ) || 1;
	if ( currLife + regenLife < maxLife ) { elements.life.current.value = currLife + regenLife }
	else if ( currLife < maxLife ) { elements.life.current.value = maxLife }
	if ( currMana + regenMana < maxMana ) { elements.mana.current.value = currMana + regenMana }
	else if ( currMana < maxMana ) { elements.mana.current.value = maxMana }
	updateOrbs();
}

function updateRequiredXP() { 
	const level = parseInt(elements.level.value, 10) || 0; 
	elements.experience.required.textContent = ( level + 1 ) * 1000; }

// Check for level up after adding experience
function checkLevelProgress() {
	const currentLevel = parseInt(elements.level.value, 10) || 0;
	let currentExp = parseInt(elements.experience.current.value, 10) || 0;
	let requiredExp = parseInt(elements.experience.required.textContent, 10) || 0;
	let statPts = parseInt(elements.statPts.value, 10) || 0;

	// Level Up Logic
	if (currentExp >= requiredExp) {
		elements.level.value = currentLevel + 1;
		elements.experience.current.value = currentExp - requiredExp;
		elements.statPts.value = statPts + 1;
		updateRequiredXP();
	}

	// Level Down Logic (e.g., if negative experience is applied)
	if (currentExp < 0) {
		const previousRequiredExp = currentLevel * 1000;
		elements.level.value = Math.max(0, currentLevel - 1);
		if ( currentLevel < 1 ) {
			elements.experience.current.value = 0
		} else {
			elements.experience.current.value = currentExp + previousRequiredExp;
		}
		if ( elements.statPts.value > 0 ) {				
			elements.statPts.value = statPts - 1;
		}
		updateRequiredXP();
	}
}

function populateMoveRate() { 
	const select = elements.moveRate; 
	select.innerHTML = ''; 
	for (let i = 5; i <= 60; i += 5) { 
		const option = document.createElement('option'); 
		option.value = i; option.textContent = `${i} FT`; 
		select.appendChild(option); } }
		
function loadClassBaseStats(className) { 
	const d = characterData[className]; 
	if (!d) return; for (const s in d.stats) { elements.stats[s].value = d.stats[s]; } 
	elements.life.current.value = d.life.current; 
	elements.life.max.value = d.life.max;  
	elements.life.regen.value = d.life.regen; 
	elements.mana.current.value = d.mana.current; 
	elements.mana.max.value = d.mana.max; 
	elements.mana.regen.value = d.mana.regen; 
	elements.ac.base.value = d.ac;
	elements.ac.display.value = d.ac;
	elements.moveRate.value = d.moveRate; 
	updateAllDerivedStats(); }

// --- Inventory Functions ---
function initializeBackpackGrid() { 
	backpackGridState = Array(GRID_ROWS).fill(null).map(() => Array(GRID_COLS).fill(null)); 
	elements.inventory.backpack.querySelectorAll('.inventory-grid-cell, .draggable-item').forEach(el => el.remove()); 
	for (let i = 0; i < GRID_ROWS * GRID_COLS; i++) { 
		const cell = document.createElement('div'); 
		cell.className = 'inventory-grid-cell'; 
		elements.inventory.backpack.appendChild(cell); } 
	elements.inventory.backpack.prepend(elements.inventory.highlighter); }
	
function checkCollision(startRow, startCol, w, h, ignoreItemId) { 
	if (startRow < 0 || startCol < 0 || startRow + h > GRID_ROWS || startCol + w > GRID_COLS) return true; 
	for (let r = startRow; r < startRow + h; r++) { 
		for (let c = startCol; c < startCol + w; c++) { 
			if (backpackGridState[r][c] && backpackGridState[r][c] !== ignoreItemId) return true; } } 
	return false; }
	
function placeItemInGrid(item, startRow, startCol) { 
	for (let r = startRow; r < startRow + item.h; r++) { 
		for (let c = startCol; c < startCol + item.w; c++) { 
			backpackGridState[r][c] = item.id; } } }
		
function findEmptySlotInGrid(w, h) { 
	for (let r = 0; r <= GRID_ROWS - h; r++) { 
		for (let c = 0; c <= GRID_COLS - w; c++) { 
			if (!checkCollision(r, c, w, h)) return { r, c }; } } 
	return null; }
	
function removeItemFromGrid(itemId) { 
	for (let r = 0; r < GRID_ROWS; r++) { 
		for (let c = 0; c < GRID_COLS; c++) { 
			if (backpackGridState[r][c] === itemId) backpackGridState[r][c] = null; } } }
			
function renderItemInBackpack(item, row, col) { 
	const itemEl = document.createElement('div'); 
	itemEl.id = item.id; 
	itemEl.className = `draggable-item ${item.color}`;  
	if (item.img) {
		const img = document.createElement('img');						
		img.src = item.img;
		img.alt = item.name;
		img.style.width = '100%';
		img.style.height = '100%';
		img.style.objectFit = 'contain';
		itemEl.appendChild(img);
	} else { itemEl.textContent = item.name; }; 
	itemEl.draggable = true; 
	itemEl.style.top = `${row * (CELL_SIZE + GAP_SIZE) + 2}px`; 
	itemEl.style.left = `${col * (CELL_SIZE + GAP_SIZE) + 2}px`; 
	itemEl.style.width = `${item.w * CELL_SIZE + (item.w - 1) * GAP_SIZE}px`; 
	itemEl.style.height = `${item.h * CELL_SIZE + (item.h - 1) * GAP_SIZE}px`; 
	itemEl.dataset.origin = 'backpack'; 
	itemEl.dataset.itemId = item.id.split('-')[0]; 
	elements.inventory.backpack.appendChild(itemEl); }
	
function renderItemInSlot(item, slotElement) { 
	clearAndLabelSlot(slotElement); 
	const itemEl = document.createElement('div'); 
	itemEl.id = item.id; 
	itemEl.className = `draggable-item ${item.color}`;  
	if (item.img) {
		const img = document.createElement('img');						
		img.src = item.img;
		img.alt = item.name;
		img.style.width = '100%';
		img.style.height = '100%';
		img.style.objectFit = 'contain';
		itemEl.appendChild(img);
	} else { itemEl.textContent = item.name; }; 
	itemEl.draggable = true; 
	itemEl.style.width = '100%'; 
	itemEl.style.height = '100%'; 
	itemEl.dataset.origin = slotElement.id; 
	itemEl.dataset.itemId = item.id.split('-')[0]; 
	slotElement.appendChild(itemEl); }
	
function clearAndLabelSlot(slotElement) { 
	slotElement.innerHTML = ''; 
	const label = document.createElement('span'); 
	label.className = 'equipment-slot-label'; 
	const type = slotElement.dataset.slotType; 
	if (type === 'weapon1' || type === 'weapon3') { label.textContent = 'HAND 1'; } 
	else if (type === 'weapon2' || type === 'weapon4') { label.textContent = 'HAND 2'; } 
	else { label.textContent = type.toUpperCase(); } 
	slotElement.appendChild(label); }
	
function clearInventoryRender() { 
	elements.inventory.backpack.querySelectorAll('.draggable-item').forEach(el => el.remove()); 
	elements.inventory.ground.innerHTML = ''; 
	Object.values(elements.equipment).forEach(slot => clearAndLabelSlot(slot)); }

function populateItemStash(category = 'all') { 
	const list = elements.stashModal.list; 
	list.innerHTML = ''; 
	Object.keys(itemDatabase).forEach(key => { 
		const item = itemDatabase[key]; 
		const show = category === 'all' || item.category === category; 
		if (show) { 
			const itemEl = document.createElement('div'); 
			itemEl.className = `stash-item ${item.color}`; 
			if (item.img) {
				const img = document.createElement('img');						
				img.src = item.img;
				img.alt = item.name;
				img.style.width = '100%';
				img.style.height = '100%';
				img.style.objectFit = 'contain';
				itemEl.appendChild(img);
			} else { itemEl.textContent = item.name; }; 
			itemEl.draggable = true; 
			itemEl.style.width = `${item.w * CELL_SIZE}px`; 
			itemEl.style.height = `${item.h * CELL_SIZE}px`; 
			itemEl.dataset.itemId = key; 
			itemEl.dataset.origin = 'stash'; 
			list.appendChild(itemEl); } }); }

// --- Save/Load ---
function saveCharacter() { 
	const charName = elements.characterNameInput.value.trim(); 
	if (!charName) { customAlert("Please enter a character name."); return; } 
	const backpackItems = []; 
	elements.inventory.backpack.querySelectorAll('.draggable-item').forEach(el => { 
		const top = el.offsetTop - 2; 
		const left = el.offsetLeft - 2; 
		backpackItems.push({ 
			id: el.id, 
			r: Math.round(top / (CELL_SIZE + GAP_SIZE)), 
			c: Math.round(left / (CELL_SIZE + GAP_SIZE)) }); }); 
	const equippedItems = {}; 
	Object.keys(elements.equipment).forEach(slotKey => { 
		const slot = elements.equipment[slotKey]; 
		const itemEl = slot.querySelector('.draggable-item'); 
		equippedItems[slotKey] = itemEl ? itemEl.id : null; }); 
	const sheetData = { 
		characterName: charName, 
		class: elements.classSelector.value, 
		level: elements.level.value, 
		experience: elements.experience.current.value, 
		acBase: elements.ac.base.value, 
		moveRate: elements.moveRate.value, 
		gold: elements.gold.total.textContent, 
		stats: { 
			str: elements.stats.str.value, 
			dex: elements.stats.dex.value, 
			con: elements.stats.con.value, 
			int: elements.stats.int.value, 
			wis: elements.stats.wis.value, 
			cha: elements.stats.cha.value }, 
			life: { current: elements.life.current.value, max: elements.life.max.value, max: elements.life.regen.value }, 
			mana: { current: elements.mana.current.value, max: elements.mana.max.value, max: elements.mana.regen.value }, 
			inventory: { backpack: backpackItems, equipped: equippedItems } }; 
		const allChars = JSON.parse(localStorage.getItem('diabloCharacters')) || {}; 
		allChars[charName] = sheetData; 
		localStorage.setItem('diabloCharacters', JSON.stringify(allChars)); 
		localStorage.setItem('diabloLastCharacter', charName); 
		elements.saveButton.textContent = 'Saved!'; 
		setTimeout(() => { elements.saveButton.textContent = 'Save'; }, 1500); }
		
function loadCharacter(charName) { 
	const allChars = JSON.parse(localStorage.getItem('diabloCharacters')) || {}; 
	const d = allChars[charName]; 
	if (!d) return; 
	elements.characterNameInput.value = d.characterName || ''; 
	elements.classSelector.value = d.class || 'amazon'; 
	elements.level.value = d.level || 1; 
	elements.experience.current.value = d.experience || 0; 
	elements.ac.base.value = d.acBase || 0; 
	elements.moveRate.value = d.moveRate || 20; 
	elements.gold.total.textContent = d.gold || 0; 
	for(const s in d.stats) { elements.stats[s].value = d.stats[s]; } 
	elements.life.current.value = d.life.current; 
	elements.life.max.value = d.life.max;  
	elements.life.regen.value = d.life.regen; 
	elements.mana.current.value = d.mana.current; 
	elements.mana.max.value = d.mana.max;  
	elements.mana.regen.value = d.mana.regen; 
	initializeBackpackGrid(); 
	clearInventoryRender(); 
	if (d.inventory) { 
		d.inventory.backpack.forEach(itemData => { 
			const baseId = itemData.id.split('-')[0]; 
			const item = { ...itemDatabase[baseId], id: itemData.id }; 
			if(itemDatabase[baseId]) { 
				placeItemInGrid(item, itemData.r, itemData.c); 
				renderItemInBackpack(item, itemData.r, itemData.c); } }); 
		if(d.inventory.equipped) { 
			Object.keys(d.inventory.equipped).forEach(slotKey => { 
				const itemId = d.inventory.equipped[slotKey]; 
				if (itemId && elements.equipment[slotKey]) { 
					const baseId = itemId.split('-')[0]; 
					const item = { ...itemDatabase[baseId], id: itemId }; 
					if(itemDatabase[baseId]) renderItemInSlot(item, elements.equipment[slotKey]); } }); } } 
	localStorage.setItem('diabloLastCharacter', charName); 
	updateAllDerivedStats(); 
	elements.loadModal.container.classList.add('hidden'); }
	
function deleteCharacter(charName) { 
	const allChars = JSON.parse(localStorage.getItem('diabloCharacters')) || {}; 
	delete allChars[charName]; 
	localStorage.setItem('diabloCharacters', JSON.stringify(allChars)); 
	populateLoadModal(); }
	
function populateLoadModal() { 
	const allChars = JSON.parse(localStorage.getItem('diabloCharacters')) || {}; 
	const charList = elements.loadModal.list; 
	charList.innerHTML = ''; 
	const charNames = Object.keys(allChars); 
	if (charNames.length === 0) { 
		charList.innerHTML = '<p class="text-gray-400">No saved characters.</p>'; 
		return; } 
	charNames.forEach(name => { 
		const item = document.createElement('div'); 
		item.className = 'flex justify-between items-center bg-black/20 p-2 rounded'; 
		const nameBtn = document.createElement('button'); 
		nameBtn.textContent = name; 
		nameBtn.className = 'text-lg text-left text-[#c89b3c] hover:text-white flex-grow'; 
		nameBtn.onclick = () => loadCharacter(name); 
		const delBtn = document.createElement('button'); 
		delBtn.textContent = 'Delete'; 
		delBtn.className = 'text-sm text-red-500 hover:text-red-300 ml-4'; 
		delBtn.onclick = () => deleteCharacter(name); 
		item.appendChild(nameBtn); 
		item.appendChild(delBtn); 
		charList.appendChild(item); }); }
		
function newCharacter() { 
	document.querySelector('form')?.reset(); 
	elements.characterNameInput.value = ''; 
	elements.level.value = 0; 
	elements.experience.current.value = 0; 
	elements.classSelector.value = 'amazon'; 
	elements.gold.total.textContent = '0'; 
	initializeBackpackGrid(); 
	clearInventoryRender(); 
	loadClassBaseStats('amazon'); }
	
function updateEquipmentStats() { 
	let gearAcBonus = 0; 
	const weaponSlots = { weapon1: elements.weapon1, weapon2: elements.weapon2 }; 
	Object.keys(weaponSlots).forEach(key => { 
		weaponSlots[key].name.textContent = ''; 
		weaponSlots[key].damage.textContent = ''; 
		weaponSlots[key].speed.textContent = ''; }); 
	Object.keys(elements.equipment).forEach(slotKey => { 
		const slot = elements.equipment[slotKey]; 
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
	const baseAc = parseInt(elements.ac.base.value) || 0; 
	const totalAc = baseAc + gearAcBonus; 
	elements.ac.display.textContent = totalAc; 
	elements.ac.display.title = `${baseAc} (Base) + ${gearAcBonus} (Gear) = ${totalAc}`; }

// Swap weapon Slots
function swapWeapon() {
	updateEquipmentStats();
}

// --- EVENT LISTENERS ---
document.addEventListener('dragstart', e => { 
	const target = e.target.closest('.draggable-item, .stash-item'); 
	if (target.classList.contains('draggable-item') || target.classList.contains('ground-item') || target.classList.contains('stash-item')) { 
		const baseId = target.dataset.itemId; 
		if (!baseId) return; 
		const isStash = target.dataset.origin === 'stash'; 
		const instanceId = isStash ? `${baseId}-${Date.now()}` : target.id; 
		draggedItemId = baseId; 
		target.classList.add('dragging'); 
		e.dataTransfer.setData('text/plain', baseId); 
		e.dataTransfer.setData('instanceId', instanceId); 
		e.dataTransfer.setData('origin', target.dataset.origin); } });
		
document.addEventListener('dragend', e => { 
	const target = e.target; 
	if (target && (target.classList.contains('draggable-item') || target.classList.contains('ground-item') || target.classList.contains('stash-item'))) { target.classList.remove('dragging'); } draggedItemId = null; 
	elements.inventory.highlighter.classList.add('hidden'); });

// Backpack Drag Events
elements.inventory.backpack.addEventListener('dragover', e => { 
	e.preventDefault(); 
	if (!draggedItemId) return; 
	const item = itemDatabase[draggedItemId]; 
	if (!item) return; 
	const rect = elements.inventory.backpack.getBoundingClientRect(); 
	const x = e.clientX - rect.left; 
	const y = e.clientY - rect.top; 
	const col = Math.floor(x / (CELL_SIZE + GAP_SIZE)); 
	const row = Math.floor(y / (CELL_SIZE + GAP_SIZE)); 
	const instanceId = e.dataTransfer.getData('instanceId'); 
	const origin = e.dataTransfer.getData('origin'); 
	const isValid = !checkCollision(row, col, item.w, item.h, origin === 'backpack' ? instanceId : null); 
	elements.inventory.highlighter.style.top = `${row * (CELL_SIZE + GAP_SIZE) + 2}px`; 
	elements.inventory.highlighter.style.left = `${col * (CELL_SIZE + GAP_SIZE) + 2}px`; 
	elements.inventory.highlighter.style.width = `${item.w * CELL_SIZE + (item.w - 1) * GAP_SIZE}px`; 
	elements.inventory.highlighter.style.height = `${item.h * CELL_SIZE + (item.h - 1) * GAP_SIZE}px`; 
	elements.inventory.highlighter.className = isValid ? 'highlight-valid' : 'highlight-invalid'; });
	
elements.inventory.backpack.addEventListener('dragleave', e => { elements.inventory.highlighter.classList.add('hidden'); });

elements.inventory.backpack.addEventListener('drop', e => { 
	e.preventDefault(); 
	elements.inventory.highlighter.classList.add('hidden'); 
	const itemId = e.dataTransfer.getData('text/plain'); 
	const instanceId = e.dataTransfer.getData('instanceId'); 
	const origin = e.dataTransfer.getData('origin'); 
	const item = { ...itemDatabase[itemId], id: instanceId }; 
	if (!itemDatabase[itemId]) return; 
	const rect = elements.inventory.backpack.getBoundingClientRect(); 
	const x = e.clientX - rect.left; 
	const y = e.clientY - rect.top; 
	const col = Math.floor(x / (CELL_SIZE + GAP_SIZE)); 
	const row = Math.floor(y / (CELL_SIZE + GAP_SIZE)); 
	if (!checkCollision(row, col, item.w, item.h, origin === 'backpack' ? instanceId : null)) { 
		if (origin !== 'ground' && origin !== 'stash') removeItemFromGrid(instanceId); 
		document.getElementById(instanceId)?.remove(); 
		placeItemInGrid(item, row, col); 
		renderItemInBackpack(item, row, col); 
		updateEquipmentStats(); } });

// Ground Drag Events
elements.inventory.ground.addEventListener('dragover', e => e.preventDefault());

elements.inventory.ground.addEventListener('drop', e => { 
	e.preventDefault(); 
	const instanceId = e.dataTransfer.getData('instanceId'); 
	const origin = e.dataTransfer.getData('origin'); 
	if (origin !== 'ground') { document.getElementById(instanceId)?.remove(); 
	if (origin === 'backpack') removeItemFromGrid(instanceId); 
	updateEquipmentStats(); } });

// Equipment Slot Drag Events
Object.values(elements.equipment).forEach(slot => {
	slot.addEventListener('dragover', e => { e.preventDefault(); 
	if (!draggedItemId) return; 
	const item = itemDatabase[draggedItemId]; 
	if (!item) return; 
	const slotType = slot.dataset.slotType; 
	if (item.type === slotType || (item.type === 'ring' && slotType === 'ring') || (item.type === 'weapon' && slotType === 'offhand')) { slot.classList.add('drag-over-valid'); } 
	else { slot.classList.add('drag-over-invalid'); } });
	slot.addEventListener('dragleave', e => { slot.classList.remove('drag-over-valid', 'drag-over-invalid'); });
	slot.addEventListener('drop', e => { 
		e.preventDefault(); 
		slot.classList.remove('drag-over-valid', 'drag-over-invalid'); 
		const itemId = e.dataTransfer.getData('text/plain'); 
		const instanceId = e.dataTransfer.getData('instanceId'); 
		const origin = e.dataTransfer.getData('origin'); 
		const item = { ...itemDatabase[itemId], id: instanceId }; 
		if (!itemDatabase[itemId]) return; 
		const slotType = slot.dataset.slotType; 
		if (item.type !== slotType && !(item.type === 'ring' && slotType === 'ring') && !(item.type === 'weapon' && slotType === 'offhand')) return; 
		const currentlyEquipped = slot.querySelector('.draggable-item'); 
		if (currentlyEquipped) { 
			const equippedItem = { ...itemDatabase[currentlyEquipped.dataset.itemId], id: currentlyEquipped.id }; 
			const emptySlot = findEmptySlotInGrid(equippedItem.w, equippedItem.h); 
			if (emptySlot) { 
				placeItemInGrid(equippedItem, emptySlot.r, emptySlot.c); 
				renderItemInBackpack(equippedItem, emptySlot.r, emptySlot.c); } 
			else { 
				customAlert("No space in backpack to swap item!"); 
				renderItemInSlot(item, slot); 
				return; } } 
		document.getElementById(instanceId)?.remove(); 
		if (origin === 'backpack') removeItemFromGrid(instanceId); 
		renderItemInSlot(item, slot); 
		updateEquipmentStats(); });
});

// Other Listeners
elements.tabs.stats.addEventListener('click', () => switchTab('stats'));
elements.tabs.inventory.addEventListener('click', () => switchTab('inventory'));
elements.saveButton.addEventListener('click', saveCharacter);
elements.newCharButton.addEventListener('click', newCharacter);
elements.classSelector.addEventListener('change', (e) => loadClassBaseStats(e.target.value));
elements.loadModalButton.addEventListener('click', () => { populateLoadModal(); elements.loadModal.container.classList.remove('hidden'); });
elements.loadModal.closeButton.addEventListener('click', () => elements.loadModal.container.classList.add('hidden'));
elements.alertModal.okButton.addEventListener('click', () => elements.alertModal.container.classList.add('hidden'));
<!-- Experience Buttons-->
elements.experience.plusButton.addEventListener('click', () => { 
	const cur = parseInt(elements.experience.current.value) || 0; 
	const mod = parseInt(elements.experience.modInput.value) || 0; 
	elements.experience.current.value = cur + mod; 
	checkLevelProgress() });
elements.experience.minusButton.addEventListener('click', () => { 
	const cur = parseInt(elements.experience.current.value) || 0; 
	const mod = parseInt(elements.experience.modInput.value) || 0; 
	elements.experience.current.value = cur - mod;
	checkLevelProgress() });
<!-- Life Buttons -->
elements.life.plusButton.addEventListener('click', () => {
	const cur = parseInt(elements.life.current.value, 10) || 0;
	const mod = parseInt(elements.life.mod.value, 10) || 1;
	const max = parseInt(elements.life.max.value, 10) || 0;
	newCur = cur + mod;
	if ( newCur < max ) { elements.life.current.value = newCur; }
	else { elements.life.current.value = max; }
	updateOrbs() });
elements.life.minusButton.addEventListener('click', () => {
	const cur = parseInt(elements.life.current.value, 10) || 0;
	const mod = parseInt(elements.life.mod.value, 10) || 1;
	newLife = cur - mod;
	if ( newLife > 0 ) { elements.life.current.value = newLife; }	
	else { elements.life.current.value = 0; }
	updateOrbs() });
<!-- Mana Buttons -->
elements.mana.plusButton.addEventListener('click', () => {
	const cur = parseInt(elements.mana.current.value, 10) || 0;
	const mod = parseInt(elements.mana.mod.value, 10) || 1;
	const max = parseInt(elements.mana.max.value, 10) || 0;
	newMana = cur + mod;
	if ( newMana < max ) elements.mana.current.value = newMana;
	else elements.mana.current.value = max;
	updateOrbs() });
elements.mana.minusButton.addEventListener('click', () => {
	const cur = parseInt(elements.mana.current.value, 10) || 0;
	const mod = parseInt(elements.mana.mod.value, 10) || 1;
	newMana = cur - mod;
	if ( newMana > 0 ) elements.mana.current.value = newMana;	
	else elements.mana.current.value = 0;
	updateOrbs() });
elements.gold.plusButton.addEventListener('click', () => { 
	const cur = parseInt(elements.gold.total.textContent) || 0; 
	const mod = parseInt(elements.gold.modInput.value) || 0; 
	elements.gold.total.textContent = cur + mod; });
elements.gold.minusButton.addEventListener('click', () => { 
	const cur = parseInt(elements.gold.total.textContent) || 0; 
	const mod = parseInt(elements.gold.modInput.value) || 0; 
	elements.gold.total.textContent = Math.max(0, cur - mod); });
elements.itemStashButton.addEventListener('click', () => { elements.stashModal.window.classList.toggle('hidden'); });
elements.stashModal.closeButton.addEventListener('click', () => { elements.stashModal.window.classList.add('hidden'); });
document.querySelectorAll('input').forEach(el => { el.addEventListener('input', updateAllDerivedStats); });

// Tooltip Listeners
document.addEventListener('mouseover', e => { 
	const target = e.target.closest('.draggable-item, .stash-item'); 
	if (!target || !elements.tooltip) return; 
	const baseId = target.dataset.itemId; 
	const item = itemDatabase[baseId]; 
	if (!item) return; 
	let statsHtml = `<h3 class="text-lg text-[#c89b3c] font-bold">${item.name}</h3>`; 
	if(item.stats) { 
		Object.keys(item.stats).forEach(key => { 
			if(typeof item.stats[key] === 'object') { 
				statsHtml += `<div><span class="text-gray-400">${key.toUpperCase()}:</span></div>`; 
				Object.keys(item.stats[key]).forEach(subKey => { 
					statsHtml += `<div class="pl-2"><span class="text-gray-500">${subKey}:</span> ${item.stats[key][subKey]}</div>`; }); } 
			else { statsHtml += `<div><span class="text-gray-400">${key.toUpperCase()}:</span> ${item.stats[key]}</div>`; } }); } 
	elements.tooltip.innerHTML = statsHtml; 
	elements.tooltip.classList.remove('hidden'); });
	
document.addEventListener('mouseout', e => { 
	const target = e.target.closest('.draggable-item, .stash-item'); 
	if (target && elements.tooltip) elements.tooltip.classList.add('hidden'); });

// Movable Stash & Tooltip Positioner
let isDragging = false, offsetX, offsetY;
elements.stashModal.header.addEventListener('mousedown', e => { 
	isDragging = true; 
	const rect = elements.stashModal.window.getBoundingClientRect(); 
	offsetX = e.clientX - rect.left; 
	offsetY = e.clientY - rect.top; 
	elements.stashModal.window.style.transform = 'none'; });
	
document.addEventListener('mousemove', e => { 
	if (isDragging) { 
		elements.stashModal.window.style.left = `${e.clientX - offsetX}px`; 
		elements.stashModal.window.style.top = `${e.clientY - offsetY}px`; } 
	if (elements.tooltip && !elements.tooltip.classList.contains('hidden')) { 
		elements.tooltip.style.left = `${e.pageX + 15}px`; 
		elements.tooltip.style.top = `${e.pageY + 15}px`; } });
		
document.addEventListener('mouseup', () => { isDragging = false; });

// --- INITIALIZATION ---
window.addEventListener('DOMContentLoaded', () => {
	populateMoveRate();
	const categories = ['All', 'Helms', 'Armor', 'Shields', 'Swords', 'Axes', 'Bows', 'Claws', 'Maces/Clubs', 'Polearms', 'Staves/Wands', 'Potions', 'Gems', 'Boots', 'Gloves', 'Belts', 'Jewelry', 'Charms'];
	categories.forEach(cat => { 
		const btn = document.createElement('button'); 
		btn.className = 'diablo-button !w-auto px-2 text-xs'; 
		btn.textContent = cat; 
		btn.onclick = () => populateItemStash(cat.toLowerCase().replace('/','_')); 
		elements.stashModal.categoryButtons.appendChild(btn); });				
	populateItemStash();
	const lastChar = localStorage.getItem('diabloLastCharacter');
	if (lastChar) { loadCharacter(lastChar); } else { newCharacter(); }
	switchTab('stats');
});