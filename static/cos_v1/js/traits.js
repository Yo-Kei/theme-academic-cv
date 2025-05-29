/**
 * Trait definitions and slot categories for Clash of Species
 * This module contains all trait cards divided by their slot types
 */

// Trait data structure (language-independent)
const traitData = {
    body: [
        { id: 1, nameKey: 'traits.bigBody', type: 'body', hot: -1, cold: 3, descKey: 'traits.bigBodyDesc' },
        { id: 2, nameKey: 'traits.smallBody', type: 'body', hot: 2, cold: 0, descKey: 'traits.smallBodyDesc' },
    ],
    fur: [
        { id: 3, nameKey: 'traits.thickFur', type: 'fur', hot: -2, cold: 3, descKey: 'traits.thickFurDesc' },
        { id: 4, nameKey: 'traits.thinSkin', type: 'fur', hot: 3, cold: -2, descKey: 'traits.thinSkinDesc' },
    ],
    blood: [
        { id: 5, nameKey: 'traits.warmBlood', type: 'blood', hot: 0, cold: 2, descKey: 'traits.warmBloodDesc' },
        { id: 6, nameKey: 'traits.coldBlood', type: 'blood', hot: 3, cold: -1, descKey: 'traits.coldBloodDesc' },
    ],
    special: [
        { id: 101, nameKey: 'traits.fastBreeding', effect: 'extraTrait', color: '#4CAF50', descKey: 'traits.fastBreedingDesc' },
        { id: 102, nameKey: 'traits.adaptation', hot: 1, cold: 1, effect: 'adaptability', color: '#2196F3', descKey: 'traits.adaptationDesc' },
        { id: 103, nameKey: 'traits.disaster', effect: 'extinctionImmunity', color: '#FF9800', descKey: 'traits.disasterDesc' },
        { id: 104, nameKey: 'traits.disasterUsed', effect: 'extinctionImmunityUsed', color: '#795548', descKey: 'traits.disasterUsedDesc' },
    ]
};

// Dynamic trait deck that adds language properties
const traitDeck = {
    get body() {
        return traitData.body.map(trait => ({
            ...trait,
            name: getText(trait.nameKey),
            description: getText(trait.descKey)
        }));
    },
    get fur() {
        return traitData.fur.map(trait => ({
            ...trait,
            name: getText(trait.nameKey),
            description: getText(trait.descKey)
        }));
    },
    get blood() {
        return traitData.blood.map(trait => ({
            ...trait,
            name: getText(trait.nameKey),
            description: getText(trait.descKey)
        }));
    },
    get special() {
        return traitData.special.map(trait => ({
            ...trait,
            name: getText(trait.nameKey),
            description: getText(trait.descKey)
        }));
    },
    // Getter to combine all regular traits for easy random drawing
    get regular() {
        return [...this.body, ...this.fur, ...this.blood];
    }
};

// Slot type display names (dynamic based on current language)
const slotTypeNames = {
    get body() { return getText('slotTypes.body'); },
    get fur() { return getText('slotTypes.fur'); },
    get blood() { return getText('slotTypes.blood'); },
    get special() { return getText('slotTypes.special'); }
};

// Helper functions for trait operations
function getRandomTraitByType(type) {
    const traits = [...traitDeck[type]];
    if (traits.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * traits.length);
    return { ...traits[randomIndex] };
}

function drawRegularTraits(count) {
    const drawn = [];
    const deckCopy = [...traitDeck.regular];
    
    for (let i = 0; i < count; i++) {
        if (deckCopy.length === 0) break;
        const randomIndex = Math.floor(Math.random() * deckCopy.length);
        drawn.push(deckCopy.splice(randomIndex, 1)[0]);
    }
    
    return drawn;
}

function drawSpecialTrait() {
    // 过滤出可以被抽取的特殊性状（排除已使用的状态）
    const drawableSpecialTraits = traitDeck.special.filter(trait => 
        trait.effect !== 'extinctionImmunityUsed'
    );
    
    if (drawableSpecialTraits.length === 0) {
        // 如果没有可抽取的特殊性状，返回null或默认性状
        return null;
    }
    
    const randomIndex = Math.floor(Math.random() * drawableSpecialTraits.length);
    return { ...drawableSpecialTraits[randomIndex] };
}

// All variables and functions are now globally available