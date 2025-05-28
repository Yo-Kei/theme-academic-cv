/**
 * Environment definitions for Clash of Species
 * This module contains all environment types and related functions
 */

// 气候状态卡牌
const climateStateDeck = [
    { id: 1, name: '大冰室期', type: 'climate', coldBonus: 2, hotBonus: 0, description: '在灭绝阶段为寒冷环境提供+2剧烈程度' },
    { id: 2, name: '冰室期', type: 'climate', coldBonus: 1, hotBonus: 0, description: '在灭绝阶段为寒冷环境提供+1剧烈程度' },
    { id: 3, name: '缓和期', type: 'climate', coldBonus: 0, hotBonus: 0, description: '在灭绝阶段不提供额外剧烈程度' },
    { id: 4, name: '温室期', type: 'climate', coldBonus: 0, hotBonus: 1, description: '在灭绝阶段为炎热环境提供+1剧烈程度' },
    { id: 5, name: '大温室期', type: 'climate', coldBonus: 0, hotBonus: 2, description: '在灭绝阶段为炎热环境提供+2剧烈程度' }
];

// 温度变化卡牌
const temperatureChangeDeck = [
    { id: 1, name: '升温', type: 'temperature', change: 'hot', description: '环境趋向炎热' },
    { id: 2, name: '降温', type: 'temperature', change: 'cold', description: '环境趋向寒冷' }
];

// Environment types available in the game (保持向后兼容)
const environmentDeck = ['hot', 'cold'];

// Environment display names (for UI)
const environmentTypeNames = {
    'hot': '炎热',
    'cold': '寒冷'
};

// 气候状态显示名称
const climateStateNames = {
    '大冰室期': '大冰室期',
    '冰室期': '冰室期', 
    '缓和期': '缓和期',
    '温室期': '温室期',
    '大温室期': '大温室期'
};

// 温度变化显示名称
const temperatureChangeNames = {
    'hot': '升温',
    'cold': '降温'
};

// Helper functions for environment operations
function drawEnvironment() {
    const randomIndex = Math.floor(Math.random() * environmentDeck.length);
    return environmentDeck[randomIndex];
}

// 抽取气候状态卡
function drawClimateState() {
    const randomIndex = Math.floor(Math.random() * climateStateDeck.length);
    return { ...climateStateDeck[randomIndex] };
}

// 抽取温度变化卡
function drawTemperatureChange() {
    const randomIndex = Math.floor(Math.random() * temperatureChangeDeck.length);
    return { ...temperatureChangeDeck[randomIndex] };
}

// Function to determine environment severity
function rollDice() {
    return Math.floor(Math.random() * 6) + 1; // 1-6
}

// 计算最终环境严峻程度（考虑气候状态的影响）
function calculateFinalSeverity(diceResult, climateState, temperatureChange) {
    let finalSeverity = diceResult;
    
    // 根据温度变化确定环境类型
    const environmentType = temperatureChange.change;
    
    // 根据气候状态和温度变化的关系调整严峻程度
    if (environmentType === 'cold') {
        // 降温环境：冰室期加强，温室期减弱
        finalSeverity += climateState.coldBonus;  // 冰室期的coldBonus为正值
        finalSeverity -= climateState.hotBonus;   // 温室期的hotBonus为正值，所以要减去
    } else if (environmentType === 'hot') {
        // 升温环境：温室期加强，冰室期减弱  
        finalSeverity += climateState.hotBonus;   // 温室期的hotBonus为正值
        finalSeverity -= climateState.coldBonus;  // 冰室期的coldBonus为正值，所以要减去
    }
    
    return {
        environmentType: environmentType,
        severity: Math.max(0, finalSeverity) // 严峻程度可以为0，表示环境被完全抵消
    };
}

// All variables and functions are now globally available