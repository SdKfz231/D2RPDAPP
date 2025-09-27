// CONSTANTS
const inventory = {
    equipment: { 
        head: null, 
        neck: null, 
        body: null, 
        waist: null, 
        finger1: null, 
        finger2: null, 
        hands: null, 
        feet: null, 
        hand1: null, 
        hand2: null, 
        offhand1: null, 
        offhand2: null },
    backpack: null, 
    belt: null, 
    highlighter: null ,
	ground: null
};

// INVENTORY FUNCTIONS
function initializeInventoryDOM() {
	inventory.equipment.head = document.getElementById('equip-head');
	inventory.equipment.neck = document.getElementById('equip-neck');
	inventory.equipment.body = document.getElementById('equip-body');
	inventory.equipment.waist = document.getElementById('equip-waist');
	inventory.equipment.finger1 = document.getElementById('equip-finger1');
	inventory.equipment.finger2 = document.getElementById('equip-finger2');
	inventory.equipment.hands = document.getElementById('equip-hands');
	inventory.equipment.feet = document.getElementById('equip-feet');
	inventory.equipment.hand1 = document.getElementById('equip-hand1');
	inventory.equipment.hand2 = document.getElementById('equip-hand2');
	inventory.equipment.offhand1 = document.getElementById('equip-offhand1');
	inventory.equipment.offhand2 = document.getElementById('equip-offhand2');
	inventory.backpack = document.querySelectorAll('backpack-grid');
	inventory.belt = document.querySelectorAll('belt-grid');
	inventory.highlighter = document.querySelectorAll('grid-highlighter');
	inventory.ground = document.getElementById('ground-container');
}

function initializeBackpackGrid() { /*
	backpackGridState = Array(PACK_ROWS).fill(null).map(() => Array(PACK_COLS).fill(null)); 
	elements.inventory.backpack.querySelectorAll('.inventory-grid-cell, .draggable-item').forEach(el => el.remove()); 
	for (let i = 0; i < PACK_ROWS * PACK_COLS; i++) { 
		const cell = document.createElement('div'); 
		cell.className = 'inventory-grid-cell'; 
		elements.inventory.backpack.appendChild(cell); } 
	elements.inventory.backpack.prepend(elements.inventory.highlighter);*/ }
	
function checkCollision(startRow, startCol, w, h, ignoreItemId) { 
	if (startRow < 0 || startCol < 0 || startRow + h > PACK_ROWS || startCol + w > PACK_COLS) return true; 
	for (let r = startRow; r < startRow + h; r++) { 
		for (let c = startCol; c < startCol + w; c++) { 
			if (backpackGridState[r][c] && backpackGridState[r][c] !== ignoreItemId) return true; } } 
	return false; }
	
function placeItemInGrid(item, startRow, startCol) { 
	for (let r = startRow; r < startRow + item.h; r++) { 
		for (let c = startCol; c < startCol + item.w; c++) { 
			backpackGridState[r][c] = item.id; } } }
		
function findEmptySlotInGrid(w, h) { 
	for (let r = 0; r <= PACK_ROWS - h; r++) { 
		for (let c = 0; c <= PACK_COLS - w; c++) { 
			if (!checkCollision(r, c, w, h)) return { r, c }; } } 
	return null; }
	
function removeItemFromGrid(itemId) { 
	for (let r = 0; r < PACK_ROWS; r++) { 
		for (let c = 0; c < PACK_COLS; c++) { 
			if (backpackGridState[r][c] === itemId) backpackGridState[r][c] = null; } } }
			
function renderItemInBackpack(item, row, col) { 
	const itemEl = document.createElement('div'); 
	itemEl.id = item.id;  
	if (item.img) {
		const img = document.createElement('img');						
		img.src = item.img;
		img.alt = item.name;
		img.style.width = '100%';
		img.style.height = '100%';
		img.style.objectFit = 'contain'; 
		itemEl.className = `draggable-item transparent`;
		itemEl.appendChild(img);
	} else { itemEl.textContent = item.name; 
		itemEl.className = `draggable-item ${item.color}`; }; 
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
	if (item.img) {
		const img = document.createElement('img');						
		img.src = item.img;
		img.alt = item.name;
		img.style.width = '100%';
		img.style.height = '100%';
		img.style.objectFit = 'contain';
		itemEl.className = `draggable-item transparent`;
		itemEl.appendChild(img);
	} else { itemEl.textContent = item.name;
		itemEl.className = `draggable-item ${item.color}`; }; 
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

    export { initializeInventoryDOM };