# D2RPDAPP
A character management web app for tracking Diablo 2 RPG Character Progression

Users can; create New characters, Save character data, Load saved characters from preset Classes:
- Amazon
- Assassin
- Barbarian
- Druid
- Necromancer
- Paladin
- Sorceress

Users can navigate between following tabs; Stats, Inventory, Skills, Item Directory

Stats Page:

    This is the main page that users will interact with the most.  It displays, tracks and updates all the characters various Stats, Levels and Experience, Damage Resistances, Status Conditions, Armor Class and Movement Rate, Readied Weapons, and Health and Mana Levels.

// TODO : 
 - Implement Belt Item Quick Use Block, 
 - Implement swapping between weapon sets, 
 - Implement Condition Toggles, 
 - Section for Skill/Spells, 
 - Timed Status effects (tracked via Regen), 
 ...

Inventory Page:

    Here the user user and manage their item inventory: Backpack, Belt Holder, Equipped slots, and Gold.

// TODO: 
 - Implement Item Affixs, 
 - Input remaining Item data, 
 - Fix tooltip display when scrolling the window, 
 - ...

Skills Page: 

    Here the User will be able to assign earned skill points to various Skill Trees for unlocking abilities

// TODO: 
 - Map out Skill Trees, 
 - Implement tooltip and Information windows, 
 - Implement Pushbutton Upgrades, 
 - ...

Shop Page:

    Here the User will be able to select and create the standard and magical items (with affixes) as needed to fill out what they find in the World.

// TODO:
 - Move the current Item Stash Modal System to here, 
 - Implement the adding of Affixes and magical properties that stick with the item, from creation to destruction,  
 - Create toggle to identify if created item is found or purchased, 
 - Implement automatic gold exchange for purchased items, 
 - Change Items-List from Modal to Sidebar, 
 - ...

Character and Item Classes contain majority of the logic in order to further separate functional areas (Controlling State).

Data.js:

    Stores constants for characterClass, itemDatabase, affixes 

Character Data to only include Base Stats and Skill Trees
//TODO: 
ItemDatabase (
// TODO: 
- Resize, clear background, save gifs as png) 
- Item Durablity and Repair
- Socketing
