import { initializeStatsDOM, getCharacterState, setCharacterState } from "./stats.js";
import { initializeInventoryDOM } from "./inventory.js";
import { initializeSkillsDOM } from "./skills.js";
import Character from "./Character.js";
import { classData, itemDatabase } from "./data.js";

const CELL_SIZE = 40;  

const navigation = {
    menu: {
        newCharButton: null, loadModalButton: null, saveButton: null },
	tabs: { stats: null, inventory: null, skills: null },
	pages: { stats: null, inventory: null, skills: null },
    sidebar: {
	itemOpenSidebar: null,
    itemSidebar: null,
    itemCloseSidebar: null
	},
	newModal: { container: null, closeButton: null, newNameInput: null, classSelector: null, create: null },
	loadModal: { container: null, closeButton: null, list: null },
	alertModal: { container: null, message: null, okButton: null },
	stashModal: { window: null, header: null, closeButton: null, list: null, categoryButtons: null },
	tooltip: null,
    }

function initializeNavDOM() {
    navigation.menu.newCharButton = document.getElementById('new-modal-button');
    navigation.menu.loadModalButton = document.getElementById('load-modal-button'); 
    navigation.menu.saveButton= document.getElementById('save-button');
    navigation.tabs.stats= document.getElementById('tab-stats'); 
    navigation.tabs.inventory= document.getElementById('tab-inventory'); 
    navigation.tabs.skills= document.getElementById('tab-skills') ;
    navigation.pages.stats= document.getElementById('stats-page'); 
    navigation.pages.inventory= document.getElementById('inventory-page'); 
    navigation.pages.skills= document.getElementById('skills-page') ;
    navigation.sidebar.itemOpenSidebar= document.getElementById('item-sidebar-open');
    navigation.sidebar.itemSidebar= document.getElementById('item-sidebar');
    navigation.sidebar.itemCloseSidebar= document.getElementById('item-sidebar-close');
    navigation.sidebar.list= document.getElementById('item-list'); 
    navigation.sidebar.categoryButtons= document.getElementById('sidebar-category-buttons');
    navigation.newModal.container= document.getElementById('new-modal'); 
    navigation.newModal.closeButton= document.getElementById('new-modal-close');
    navigation.newModal.newNameInput= document.getElementById('new-character-name');
    navigation.newModal.classSelector= document.getElementById('class-selector');
    navigation.newModal.create= document.getElementById('create-character-button');;
    navigation.loadModal.container= document.getElementById('load-modal'); 
    navigation.loadModal.closeButton= document.getElementById('load-modal-close'); 
    navigation.loadModal.list= document.getElementById('character-list');
    navigation.alertModal.container= document.getElementById('alert-modal'); 
    navigation.alertModal.message= document.getElementById('alert-message'); 
    navigation.alertModal.okButton= document.getElementById('alert-ok-button');
    navigation.stashModal.window= document.getElementById('item-stash-window'); 
    navigation.stashModal.header= document.getElementById('item-stash-header'); 
    navigation.stashModal.closeButton= document.getElementById('close-stash-button'); 
    navigation.tooltip= document.getElementById('item-tooltip');
    // Event Listeners
    navigation.tabs.stats.addEventListener('click', () => switchTab('stats'));
    navigation.tabs.inventory.addEventListener('click', () => switchTab('inventory'));
    navigation.tabs.skills.addEventListener('click', () => switchTab('skills'));
    navigation.menu.saveButton.addEventListener('click', saveCharacter);
    navigation.menu.newCharButton.addEventListener('click', () => { 
        openNewCharacterModal(); 
        navigation.newModal.container.classList.remove('hidden'); 
    });
    //navigation.newModal.classSelector.addEventListener('change', (e) => loadClassBaseStats(e.target.value));
    navigation.newModal.closeButton.addEventListener('click', () => navigation.newModal.container.classList.add('hidden'));
    navigation.newModal.create.addEventListener('click', () => createCharacter());
    navigation.menu.loadModalButton.addEventListener('click', () => { populateLoadModal(); navigation.loadModal.container.classList.remove('hidden'); });
    navigation.loadModal.closeButton.addEventListener('click', () => navigation.loadModal.container.classList.add('hidden'));
    navigation.alertModal.okButton.addEventListener('click', () => navigation.alertModal.container.classList.add('hidden'));
    navigation.sidebar.itemOpenSidebar.addEventListener('click', () => openItemSidebar() );
    navigation.sidebar.itemCloseSidebar.addEventListener('click', () => closeItemSidebar() );
    //navigation.stashModal.closeButton.addEventListener('click', () => { characterDOM.stashModal.window.classList.add('hidden'); });
    /*navigation.stashModal.header.addEventListener('mousedown', e => { 
        isDragging = true; 
        const rect = navigation.stashModal.window.getBoundingClientRect(); 
        offsetX = e.clientX - rect.left; 
        offsetY = e.clientY - rect.top; 
        navigation.stashModal.window.style.transform = 'none'; });*/
}

// Navigation and Startup Functions
function switchTab(tabName) { 
	Object.keys(navigation.pages).forEach(p => navigation.pages[p].classList.add('hidden')); 
	Object.keys(navigation.tabs).forEach(t => navigation.tabs[t].classList.remove('active')); 
	navigation.pages[tabName].classList.remove('hidden'); 
	navigation.tabs[tabName].classList.add('active'); }

function openItemSidebar() {
  document.getElementById("item-sidebar").style.width = "31%";
  //document.getElementById("main").style.marginRight = "300px"; 
}

function closeItemSidebar() {
  document.getElementById("item-sidebar").style.width = "0";
  //document.getElementById("main").style.marginRight= "0";
}	
		
function openNewCharacterModal() { 
	navigation.newModal.container.classList.remove('hidden'); 
	navigation.newModal.newNameInput.value = ''; 
	navigation.newModal.classSelector.value = 'amazon';
 	navigation.newModal.newNameInput.focus(); }

function createCharacter() { 
	const newName = navigation.newModal.newNameInput.value.trim();
	if (!newName) { customAlert("Please enter a character name."); return; }
	const newClass = navigation.newModal.classSelector.value;
	// Load base stats for the selected class
	const classDataStats = classData[newClass]?.stats || {};
	const stats = {
		strength: { base: classDataStats.strength || 10, adjust: 0 },
		dexterity: { base: classDataStats.dexterity || 10, adjust: 0 },
		constitution: { base: classDataStats.constitution || 10, adjust: 0 },
		intelligence: { base: classDataStats.intelligence || 10, adjust: 0 },
		wisdom: { base: classDataStats.wisdom || 10, adjust: 0 },
		charisma: { base: classDataStats.charisma || 10, adjust: 0 }
	};
	// Create new Character instance
	const newCharacter = new Character({
		name: newName,
		charClass: newClass,
		stats: stats
	});
	// Save to localStorage
	let allChars = JSON.parse(localStorage.getItem('diabloCharacters')) || {};
	allChars[newCharacter.name] = newCharacter;
	localStorage.setItem('diabloCharacters', JSON.stringify(allChars));
	localStorage.setItem('diabloLastCharacter', newCharacter.name);
	navigation.newModal.container.classList.add('hidden');
	console.log("Character created:", `${newCharacter.name} the ${newCharacter.charClass}`);
	setCharacterState(newCharacter);
}
		
function saveCharacter() { 
	const charName = getCharacterState().getName().trim();
	const allChars = JSON.parse(localStorage.getItem('diabloCharacters')) || {}; 
	allChars[charName] = JSON.parse(JSON.stringify(getCharacterState())); 
	localStorage.setItem('diabloCharacters', JSON.stringify(allChars)); 
	localStorage.setItem('diabloLastCharacter', charName); 
	navigation.menu.saveButton.textContent = 'Saved!'; 
	setTimeout(() => { navigation.menu.saveButton.textContent = 'Save'; }, 1500); }
	
function populateLoadModal() { 
	const allChars = JSON.parse(localStorage.getItem('diabloCharacters')) || {}; 
	const charList = navigation.loadModal.list; 
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
		
function loadCharacter(charName) { 
	const allChars = JSON.parse(localStorage.getItem('diabloCharacters')) || {}; 
	const data = allChars[charName]; 
	if (!data) return; 
	localStorage.setItem('diabloLastCharacter', charName); 
	navigation.loadModal.container.classList.add('hidden');
	setCharacterState(new Character(data)); }
	
function deleteCharacter(charName) { 
	const allChars = JSON.parse(localStorage.getItem('diabloCharacters')) || {}; 
	delete allChars[charName]; 
    if (localStorage.getItem('diabloLastCharacter') === charName) {
        setCharacterState(new Character());
    }
	localStorage.setItem('diabloCharacters', JSON.stringify(allChars)); 
	populateLoadModal(); }

function setupSidebar() {
	const itemCategories = ['All', 'Armor', 'Headgear', 'Accoutrements', '1 Handed', '2 Handed', 'Bows', 'Staves', 'Magical', 'Jewelry'];
	itemCategories.forEach(cat => { 
		const btn = document.createElement('button'); 
		btn.className = 'diablo-button !w-auto px-2 text-xs'; 
		btn.textContent = cat; 
		btn.onclick = () => populateItemSidebar(cat.toLowerCase().replace('/','_')); 
		navigation.sidebar.categoryButtons.appendChild(btn); });
    populateItemSidebar('all');
}

function populateItemSidebar(category = 'all') { 
	const list = navigation.sidebar.list; 
	list.innerHTML = ''; 
	Object.keys(itemDatabase).forEach(key => { 
		const item = itemDatabase[key]; 
		const show = category === 'all' || item.category === category; 
		if (show) { 
			const itemEl = document.createElement('div'); 
			if (item.img) {
				const img = document.createElement('img');						
				img.src = item.img;
				img.alt = item.name;
				img.style.width = '100%';
				img.style.height = '100%';
				img.style.objectFit = 'contain'; 
				itemEl.className = `sidebar-item transparent`;
				itemEl.appendChild(img);
			} else { itemEl.textContent = item.name;
				itemEl.className = `sidebar-item ${item.color}`;  }; 
			itemEl.draggable = true; 
			itemEl.style.width = `${item.w * CELL_SIZE}px`; 
			itemEl.style.height = `${item.h * CELL_SIZE}px`; 
			itemEl.dataset.itemId = key; 
			itemEl.dataset.origin = 'sidebar'; 
			list.appendChild(itemEl); } }); }
			
// --- EVENT LISTENERS ---
// Movable Stash & Tooltip Positioner
let isDragging = false, offsetX, offsetY;
	
document.addEventListener('mousemove', e => { 
	if (isDragging) { 
		navigation.stashModal.window.style.left = `${e.clientX - offsetX}px`; 
		navigation.stashModal.window.style.top = `${e.clientY - offsetY}px`; } 
	if (navigation.tooltip && !navigation.tooltip.classList.contains('hidden')) { 
		navigation.tooltip.style.left = `${e.clientX + 15}px`; 
		navigation.tooltip.style.top = `${e.clientY + 15}px`; } });
// Tooltip Listeners
document.addEventListener('mouseover', e => { 
	const target = e.target.closest('.draggable-item, .stash-item'); 
	if (!target || !navigation.tooltip) return; 
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
	navigation.tooltip.innerHTML = statsHtml; 
	navigation.tooltip.classList.remove('hidden'); });
	
document.addEventListener('mouseout', e => { 
	const target = e.target.closest('.draggable-item, .stash-item'); 
	if (target && navigation.tooltip) navigation.tooltip.classList.add('hidden'); });

document.addEventListener('mouseup', () => { isDragging = false; });

// --- INITIALIZATION ---
window.addEventListener('DOMContentLoaded', () => {
    initializeNavDOM();
    setupSidebar();
    initializeStatsDOM();
    initializeInventoryDOM();
    initializeSkillsDOM();
    setCharacterState(new Character());
	const lastChar = localStorage.getItem('diabloLastCharacter');
	if (lastChar) { loadCharacter(lastChar); }
	switchTab('stats');
});
