/**
 * Trait definitions and slot categories for Clash of Species
 * This module contains all trait cards divided by their slot types
 */

// Trait deck definition
const traitDeck = {
    // Traits categorized by slot type
    body: [
        { id: 1, name: '大体型', type: 'body', hot: -1, cold: 3, description: '大体型可以大大增加寒冷环境的适应性，但是会降低炎热环境的适应性' },
        { id: 2, name: '小体型', type: 'body', hot: 2, cold: 0, description: '小体型稍微增加炎热环境的适应性' },
    ],
    fur: [
        { id: 3, name: '厚皮毛', type: 'fur', hot: -2, cold: 3, description: '厚皮毛可以大大增加寒冷环境的适应性，但是会降低炎热环境的适应性' },
        { id: 4, name: '薄皮肤', type: 'fur', hot: 3, cold: -2, description: '薄皮肤可以大大增加炎热环境的适应性，但是会降低寒冷环境的适应性' },
    ],
    blood: [
        { id: 5, name: '温血', type: 'blood', hot: 0, cold: 2, description: '温血可以增加寒冷环境的适应性' },
        { id: 6, name: '冷血', type: 'blood', hot: 3, cold: -1, description: '冷血可以增加炎热环境的适应性，但是会降低寒冷环境的适应性' },
    ],
    // Getter to combine all regular traits for easy random drawing
    get regular() {
        return [...this.body, ...this.fur, ...this.blood];
    },
    special: [
        { id: 101, name: '快速繁衍', effect: 'extraTrait', color: '#4CAF50', description: '每轮可为玩家增加1次性状修改机会' },
        { id: 102, name: '广泛适应', hot: 1, cold: 1, effect: 'adaptability', color: '#2196F3', description: '每个环境的适应性+1' },
    ]
};

// Slot type display names (for UI)
const slotTypeNames = {
    'body': '体型',
    'fur': '皮毛',
    'blood': '血液',
    'special': '特殊'
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
    const randomIndex = Math.floor(Math.random() * traitDeck.special.length);
    return { ...traitDeck.special[randomIndex] };
}

// All variables and functions are now globally available