/**
 * Environment definitions for Clash of Species
 * This module contains all environment types and related functions
 */

// Climate state data (language-independent)
const climateStateData = [
    { id: 1, nameKey: 'environments.majorIceAge', type: 'climate', coldBonus: 2, hotBonus: 0, descKey: 'environments.majorIceAgeDesc' },
    { id: 2, nameKey: 'environments.iceAge', type: 'climate', coldBonus: 1, hotBonus: 0, descKey: 'environments.iceAgeDesc' },
    { id: 3, nameKey: 'environments.moderate', type: 'climate', coldBonus: 0, hotBonus: 0, descKey: 'environments.moderateDesc' },
    { id: 4, nameKey: 'environments.greenhouse', type: 'climate', coldBonus: 0, hotBonus: 1, descKey: 'environments.greenhouseDesc' },
    { id: 5, nameKey: 'environments.majorGreenhouse', type: 'climate', coldBonus: 0, hotBonus: 2, descKey: 'environments.majorGreenhouseDesc' }
];

// Temperature change data (language-independent)
const temperatureChangeData = [
    { id: 1, nameKey: 'environments.warming', type: 'temperature', change: 'hot', descKey: 'environments.warmingDesc' },
    { id: 2, nameKey: 'environments.cooling', type: 'temperature', change: 'cold', descKey: 'environments.coolingDesc' }
];

// Dynamic climate state deck with language support
const climateStateDeck = climateStateData.map(state => ({
    ...state,
    get name() { return getText(state.nameKey); },
    get description() { return getText(state.descKey); }
}));

// Dynamic temperature change deck with language support
const temperatureChangeDeck = temperatureChangeData.map(change => ({
    ...change,
    get name() { return getText(change.nameKey); },
    get description() { return getText(change.descKey); }
}));

// Environment types available in the game (保持向后兼容)
const environmentDeck = ['hot', 'cold'];

// Environment display names (dynamic based on current language)
const environmentTypeNames = {
    get hot() { return getText('environmentTypes.hot'); },
    get cold() { return getText('environmentTypes.cold'); }
};

// 气候状态显示名称 (dynamic based on current language)
const climateStateNames = {
    get '大冰室期'() { return getText('climateStates.大冰室期'); },
    get '冰室期'() { return getText('climateStates.冰室期'); },
    get '缓和期'() { return getText('climateStates.缓和期'); },
    get '温室期'() { return getText('climateStates.温室期'); },
    get '大温室期'() { return getText('climateStates.大温室期'); }
};

// 温度变化显示名称 (dynamic based on current language)
const temperatureChangeNames = {
    get hot() { return getText('temperatureChanges.hot'); },
    get cold() { return getText('temperatureChanges.cold'); }
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