class Item {
    constructor({ name: { prefix, base, suffix }, sizeW, sizeH, color, type, quality, durability, category, equipsTo, stats, properties, sockets, socketedItems, img }) {
        this.name.prefix = prefix || '';
        this.name.base = base || 'Item';
        this.name.suffix = suffix || '';
        this.w = sizeW || 1;
        this.h = sizeH || 1;
        this.color = color || 'bg-gray-400';
        this.type = type || 'misc';
        this.quality = quality || 'normal'; // normal, magic, rare, unique, set
        this.durability = durability || 100; // out of 100
        this.category = category || 'misc';
        this.equipsTo = equipsTo || 'none';
        this.stats = stats || {}; // Base Weapons Stats
        this.properties = properties || {}; // Additional Properties from item affixes and socketables
        this.sockets = sockets || 0;
        this.socketedItems = socketedItems || [];
        this.img = img || null;
    }
    get id() {
        return `${this.name.base.toLowerCase().replace(/\s+/g, '_')}-${Math.random().toString(36).substr(2, 9)}`;
    }
    get fullName() {
        return `${this.name.prefix ? this.name.prefix + ' ' : ''}${this.name.base}${this.name.suffix ? ' ' + this.name.suffix : ''}`;
    }



    addSocketedItem(item) {
        if (this.socketedItems.length < this.sockets) {
            this.socketedItems.push(item);
        } else {
            console.warn('No available sockets to add item.');
        }
    }

    removeSocketedItem(itemId) {
        this.socketedItems = this.socketedItems.filter(item => item.id !== itemId);
    }

    geteffectiveProperties() {
        const effectiveProperties = { ...this.properties };
        this.socketedItems.forEach(item => {
            for (const [key, value] of Object.entries(item.properties)) {
                if (effectiveProperties[key]) {
                    effectiveProperties[key] += value;
                } else {
                    effectiveProperties[key] = value;
                }
            }
        });
        return effectiveStats;
    }
}
export default Item;