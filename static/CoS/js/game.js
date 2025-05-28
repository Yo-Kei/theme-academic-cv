// All necessary variables and functions are now available globally from traits.js and environments.js

// 游戏核心数据和状态
const gameState = {
    round: 1,
    phase: 0, // 0: 抽牌, 1: 性状分配, 2: 灭绝, 3: 复苏, 4: 弃牌
    subPhase: 0, // 子阶段，用于性状分配阶段：0-玩家分配，1-AI分配
    assignStep: 0, // 0: 选择物种, 1: 选择操作, 2: 选择栏位, 3: 选择手牌(添加/替换时需要), 4: 确认操作
    environmentType: null, // 'hot' 或 'cold'
    environmentSeverity: 0,
    climateState: null, // 当前气候状态卡
    temperatureChange: null, // 当前温度变化卡
    selectedSpecies: null,
    selectedTrait: null,
    actionMode: null, // 'add', 'replace', 'remove'
    selectedSlotType: null, // 选择的栏位类型
    phaseNames: ['抽牌阶段', '性状分配阶段', '灭绝阶段', '复苏阶段', '弃牌阶段'],
    playerTraitAssigned: false, // 标记玩家是否已完成性状分配
    aiTraitAssigned: false, // 标记AI是否已完成性状分配
    actionPoints: 3, // 玩家每轮性状分配阶段的行动点数
    revivalMode: false, // 标记是否处于复苏阶段的物种复制模式
    showingCompatibleTraits: false, // 标记是否正在显示与选定栏位兼容的性状
    selectedCards: [], // 存储弃牌阶段选择的卡牌索引
    pendingTraitAction: null, // 存储待确认的性状操作
    isDiscardMode: false,
    maxSpeciesCount: 3, // 最大物种数量，可由玩家设置
    gameEnded: false, // 标记游戏是否结束
    playerDuplicatedThisRound: false, // 标记玩家本轮是否已完成复制
    selectedSpecialSlotIndex: null // 记录特殊性状栏位的槽位索引
};

// 全局tooltip管理器
const tooltipManager = {
    activeTooltips: new Set(),
    
    show: function(tooltip, targetElement) {
        // 隐藏所有其他tooltip
        this.hideAll();
        
        // 确保tooltip存在于DOM中
        if (!tooltip.parentNode) {
            return;
        }
        
        // 尝试将tooltip移动到body下，避免父容器影响
        if (tooltip.parentNode !== document.body) {
            document.body.appendChild(tooltip);
        }
        
        // 定位并显示tooltip
        positionTooltip(tooltip, targetElement);
        tooltip.style.opacity = '1';
        tooltip.style.visibility = 'visible';
        
        // 记录活跃的tooltip
        this.activeTooltips.add(tooltip);
    },
    
    hide: function(tooltip) {
        if (tooltip && tooltip.parentNode) {
            tooltip.style.opacity = '0';
            tooltip.style.visibility = 'hidden';
        }
        this.activeTooltips.delete(tooltip);
    },
    
    hideAll: function() {
        this.activeTooltips.forEach(tooltip => {
            if (tooltip && tooltip.parentNode) {
                tooltip.style.opacity = '0';
                tooltip.style.visibility = 'hidden';
            }
        });
        this.activeTooltips.clear();
    }
};

// 玩家和AI数据
const player = {
    name: '玩家',
    species: [],
    hand: []
};

const ai = {
    name: 'AI',
    species: [],
    hand: []
};

// 游戏初始化
function initGame(maxSpeciesCount = 3) {
    // 设置最大物种数量
    gameState.maxSpeciesCount = maxSpeciesCount;
    
    // 清空玩家和AI的状态
    player.species = [];
    player.hand = [];
    ai.species = [];
    ai.hand = [];
    
    // 重置游戏状态
    gameState.round = 1;
    gameState.phase = 0;
    gameState.subPhase = 0;
    gameState.assignStep = 0;
    gameState.selectedSpecies = null;
    gameState.selectedTrait = null;
    gameState.selectedSlotType = null;
    gameState.actionMode = null;
    gameState.environmentType = null;
    gameState.environmentSeverity = 0;
    gameState.climateState = null;
    gameState.temperatureChange = null;
    gameState.playerTraitAssigned = false;
    gameState.aiTraitAssigned = false;
    gameState.actionPoints = 3; // 初始化行动点数
    gameState.revivalMode = false;
    gameState.showingCompatibleTraits = false;
    gameState.selectedCards = [];
    gameState.isDiscardMode = false;
    gameState.pendingTraitAction = null;
    gameState.gameEnded = false;
    gameState.playerDuplicatedThisRound = false;
    
    // 确保按钮状态正确
    hideDiscardConfirmButton();
    ensureButtonState();
    
    // 为玩家和AI各创建初始物种（数量为设置的最大值）
    for (let i = 0; i < gameState.maxSpeciesCount; i++) {
        // 创建物种
        const playerSpecies = createSpecies(`玩家物种 ${i+1}`);
        const aiSpecies = createSpecies(`AI物种 ${i+1}`);
        
        // 为每个物种随机分配初始性状
        playerSpecies.traits.body = getRandomTraitByType('body');
        playerSpecies.traits.fur = getRandomTraitByType('fur');
        playerSpecies.traits.blood = getRandomTraitByType('blood');
        
        aiSpecies.traits.body = getRandomTraitByType('body');
        aiSpecies.traits.fur = getRandomTraitByType('fur');
        aiSpecies.traits.blood = getRandomTraitByType('blood');
        
        player.species.push(playerSpecies);
        ai.species.push(aiSpecies);
        
        logMessage(`创建了${playerSpecies.name}，初始特征：${playerSpecies.traits.body.name}、${playerSpecies.traits.fur.name}、${playerSpecies.traits.blood.name}`);
        logMessage(`创建了${aiSpecies.name}，初始特征：${aiSpecies.traits.body.name}、${aiSpecies.traits.fur.name}、${aiSpecies.traits.blood.name}`);
    }
    
    updateUI();
    logMessage(`游戏开始！每位玩家有${gameState.maxSpeciesCount}个初始物种。`);
    
    // 开始第一阶段
    startPhase(0);
}

// 创建物种
function createSpecies(name) {
    return {
        name: name,
        traits: {
            body: null,   // 体型栏位
            fur: null,    // 皮毛栏位
            blood: null,  // 温血/冷血栏位
        },
        specialTraits: [null, null], // 2个特殊性状栏位
        extinct: false
    };
}

// These functions are now imported from traits.js and environments.js modules

// 计算物种的适应性分数
function calculateAdaptability(species, environmentType) {
    let score = 0;
    
    // 计算常规性状对适应性的影响
    for (const traitType in species.traits) {
        const trait = species.traits[traitType];
        if (trait) {
            score += trait[environmentType] || 0;
        }
    }
    
    // 计算特殊性状对适应性的影响
    for (const specialTrait of species.specialTraits) {
        if (specialTrait) {
        // 广泛适应特性
            if (specialTrait.effect === 'adaptability') {
                score += specialTrait[environmentType] || 0;
            }
        }
    }
    
    return score;
}

// 检查物种灭绝
function checkExtinction(species, environmentType, severity) {
    const adaptability = calculateAdaptability(species, environmentType);
    return adaptability < severity;
}

// 更新环境显示
function updateEnvironmentDisplay() {
    const climateCardsDiv = document.getElementById('climate-cards');
    const finalEnvironmentDiv = document.getElementById('final-environment');
    
    // 根据游戏阶段决定显示内容
    if (gameState.phase === 0 || gameState.phase === 1) {
        // 抽卡和分配阶段：显示气候状态和温度变化
        climateCardsDiv.classList.remove('hidden');
        finalEnvironmentDiv.classList.add('hidden');
        
        // 更新气候状态卡
        const climateStateCard = document.getElementById('climate-state-card');
        const climateStateName = document.getElementById('climate-state-name');
        
        if (gameState.climateState) {
            climateStateName.textContent = gameState.climateState.name;
            // 根据气候状态设置样式
            climateStateCard.className = 'climate-card';
            switch (gameState.climateState.name) {
                case '大冰室期':
                    climateStateCard.classList.add('ice-age');
                    break;
                case '冰室期':
                    climateStateCard.classList.add('ice-house');
                    break;
                case '缓和期':
                    climateStateCard.classList.add('moderate');
                    break;
                case '温室期':
                    climateStateCard.classList.add('greenhouse');
                    break;
                case '大温室期':
                    climateStateCard.classList.add('super-greenhouse');
                    break;
            }
        } else {
            climateStateName.textContent = '-';
            climateStateCard.className = 'climate-card';
        }
        
        // 更新温度变化卡
        const temperatureChangeCard = document.getElementById('temperature-change-card');
        const temperatureChangeName = document.getElementById('temperature-change-name');
        
        if (gameState.temperatureChange) {
            temperatureChangeName.textContent = gameState.temperatureChange.name;
            // 根据温度变化设置样式
            temperatureChangeCard.className = 'climate-card';
            if (gameState.temperatureChange.change === 'hot') {
                temperatureChangeCard.classList.add('warming');
            } else {
                temperatureChangeCard.classList.add('cooling');
            }
        } else {
            temperatureChangeName.textContent = '-';
            temperatureChangeCard.className = 'climate-card';
        }
        
    } else {
        // 灭绝、复苏和弃牌阶段：显示最终环境状态
        climateCardsDiv.classList.add('hidden');
        finalEnvironmentDiv.classList.remove('hidden');
        
        // 更新最终环境信息
        if (gameState.environmentType) {
            const envType = environmentTypeNames[gameState.environmentType];
            document.getElementById('environment-type').textContent = envType;
            
            // 为环境类型卡片添加对应的样式
            const envTypeCard = document.getElementById('environment-type-card');
            envTypeCard.className = `climate-card ${gameState.environmentType === 'hot' ? 'warming' : 'cooling'}`;
            
            // 严峻程度显示逻辑：显示实际数值
            document.getElementById('environment-severity').textContent = gameState.environmentSeverity;
            
            // 为严峻程度卡片添加样式
            const severityCard = document.getElementById('environment-severity-card');
            severityCard.className = `climate-card ${gameState.environmentType === 'hot' ? 'super-greenhouse' : 'ice-age'}`;
        } else {
            document.getElementById('environment-type').textContent = '-';
            document.getElementById('environment-severity').textContent = '-';
            document.getElementById('environment-type-card').className = 'climate-card';
            document.getElementById('environment-severity-card').className = 'climate-card';
        }
    }
}

// 更新UI显示
function updateUI() {
    // 更新回合和阶段信息
    document.getElementById('round-number').textContent = gameState.round;
    document.getElementById('current-phase').textContent = gameState.phaseNames[gameState.phase];
    
    // 更新环境显示
    updateEnvironmentDisplay();
    
    // 更新行动点数显示（仅在性状分配阶段显示）
    const actionPointsDiv = document.getElementById('action-points');
    if (gameState.phase === 1) {
        actionPointsDiv.classList.remove('hidden');
        document.getElementById('action-points-value').textContent = gameState.actionPoints;
    } else {
        actionPointsDiv.classList.add('hidden');
    }
    
    // 更新AI手牌数量
    document.getElementById('ai-hand-count').textContent = `(手牌: ${ai.hand.length}张)`;
    
    // 如果在性状分配阶段，处理子阶段逻辑
    if (gameState.phase === 1) {
        handleTraitAssignmentSubPhases();
    } else {
        // 其他阶段显示正常按钮文本
        document.getElementById('next-phase').textContent = '下一阶段';
        // 确保AI区域可见
        document.getElementById('ai-species-container').style.visibility = 'visible';
    }
    
    // 确保按钮状态正确
    ensureButtonState();
    
    // 更新玩家物种区域
    renderSpecies('player-species-container', player.species);
    
    // 更新AI物种区域
    renderSpecies('ai-species-container', ai.species);
    
    // 更新玩家手牌
    renderHand('player-traits', player.hand);
}

// 渲染物种卡
function renderSpecies(containerId, speciesArray) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    
    for (let i = 0; i < speciesArray.length; i++) {
        const species = speciesArray[i];
        
        const speciesCard = document.createElement('div');
        speciesCard.className = 'species-card';
        speciesCard.dataset.index = i;
        
        // 如果物种已灭绝，添加灭绝样式
        if (species.extinct) {
            speciesCard.classList.add('extinct-species');
        }
        
        if (gameState.selectedSpecies === species) {
            speciesCard.classList.add('selected');
        }
        
        // 物种名称
        const nameElement = document.createElement('h4');
        nameElement.textContent = species.name;
        speciesCard.appendChild(nameElement);
        
        // 特殊性状圆圈 - 在右上角显示
        const specialTraitsContainer = document.createElement('div');
        specialTraitsContainer.className = 'special-traits-container';
        
        for (let j = 0; j < 2; j++) {
            const specialCircle = document.createElement('div');
            specialCircle.className = 'special-trait-circle';
            specialCircle.dataset.slotIndex = j;
            specialCircle.dataset.speciesIndex = i;
            
            const specialTrait = species.specialTraits[j];
            if (specialTrait) {
                // 装有特殊性状 - 填充颜色
                specialCircle.style.backgroundColor = specialTrait.color;
                specialCircle.classList.add('filled');
                
                // 添加悬停提示
                const tooltip = document.createElement('div');
                tooltip.className = 'trait-tooltip';
                
                let tooltipContent = '';
                if (specialTrait.hot !== undefined && specialTrait.cold !== undefined) {
                    tooltipContent += `热: ${specialTrait.hot >= 0 ? '+' : ''}${specialTrait.hot}, 冷: ${specialTrait.cold >= 0 ? '+' : ''}${specialTrait.cold}\n`;
                    tooltipContent += '-----------\n';
                } else {
                    tooltipContent += '(特殊性状)\n-----------\n';
                }
                tooltipContent += specialTrait.description;
                
                tooltip.textContent = tooltipContent;
                specialCircle.appendChild(tooltip);
                
                // 添加鼠标事件来定位悬浮窗
                specialCircle.addEventListener('mouseenter', (e) => {
                    tooltipManager.show(tooltip, e.target);
                });
                
                specialCircle.addEventListener('mouseleave', (e) => {
                    setTimeout(() => {
                        const tooltipRect = tooltip.getBoundingClientRect();
                        const mouseX = e.clientX;
                        const mouseY = e.clientY;
                        
                        if (mouseX < tooltipRect.left - 5 || mouseX > tooltipRect.right + 5 ||
                            mouseY < tooltipRect.top - 5 || mouseY > tooltipRect.bottom + 5) {
                            tooltipManager.hide(tooltip);
                        }
                    }, 50);
                });
                
                tooltip.addEventListener('mouseenter', (e) => {
                    // 保持显示
                });
                
                tooltip.addEventListener('mouseleave', (e) => {
                    tooltipManager.hide(tooltip);
                });
                
                // 为已装有特殊性状的圆圈在替换/移除模式下添加点击事件
                if (containerId === 'player-species-container' && gameState.phase === 1) {
                    if (gameState.assignStep === 1 && gameState.selectedSpecies === species && 
                        (gameState.actionMode === 'replace' || gameState.actionMode === 'remove')) {
                        specialCircle.classList.add('special-trait-blocked');
                        specialCircle.addEventListener('click', (event) => {
                            event.stopPropagation();
                            const actionName = gameState.actionMode === 'replace' ? '替换' : '移除';
                            alert(`特殊性状不能被${actionName}！\n特殊性状一旦装上就是永久的。`);
                            // 不重置状态，保持在选择栏位的步骤
                        });
                    }
                }
            } else {
                // 空栏位 - 空心圆圈
                specialCircle.classList.add('empty');
                
                // 只有在性状分配阶段且可以操作时才能点击
                if (containerId === 'player-species-container' && gameState.phase === 1) {
                    if (gameState.assignStep === 1 && gameState.selectedSpecies === species && gameState.actionMode === 'add') {
                        specialCircle.classList.add('selectable-slot');
                        specialCircle.addEventListener('click', (event) => {
                            event.stopPropagation();
                            selectSpecialSlot(j, species);
                        });
                    }
                }
            }
            
            specialTraitsContainer.appendChild(specialCircle);
        }
        
        speciesCard.appendChild(specialTraitsContainer);
        
        // 渲染每种固定类型的性状栏位
        for (const traitType in species.traits) {
            const slot = document.createElement('div');
            slot.className = 'trait-slot';
            slot.dataset.slotType = traitType;
            slot.dataset.speciesIndex = i;
        
        // 如果是当前选中的栏位类型，添加高亮
            if (gameState.selectedSpecies === species && gameState.selectedSlotType === traitType) {
                slot.classList.add('selected-slot');
        }
        
            const trait = species.traits[traitType];
            if (trait) {
                // 只显示栏位类型和性状名称
                slot.textContent = `${slotTypeNames[traitType]}: ${trait.name}`;
            
            // 添加悬停提示
            const tooltip = document.createElement('div');
            tooltip.className = 'trait-tooltip';
            
                // 格式化提示内容
            let tooltipContent = '';
                if (trait.hot !== undefined && trait.cold !== undefined) {
                    tooltipContent += `热: ${trait.hot >= 0 ? '+' : ''}${trait.hot}, 冷: ${trait.cold >= 0 ? '+' : ''}${trait.cold}\n`;
                tooltipContent += '-----------\n';
            } else {
                tooltipContent += '(特殊性状)\n-----------\n';
            }
                tooltipContent += trait.description;
            
            tooltip.textContent = tooltipContent;
                slot.appendChild(tooltip);
            
            // 添加鼠标事件来定位悬浮窗
                slot.addEventListener('mouseenter', (e) => {
                tooltipManager.show(tooltip, e.target);
            });
            
                slot.addEventListener('mouseleave', (e) => {
                setTimeout(() => {
                    const tooltipRect = tooltip.getBoundingClientRect();
                    const mouseX = e.clientX;
                    const mouseY = e.clientY;
                    
                    if (mouseX < tooltipRect.left - 5 || mouseX > tooltipRect.right + 5 ||
                        mouseY < tooltipRect.top - 5 || mouseY > tooltipRect.bottom + 5) {
                        tooltipManager.hide(tooltip);
                    }
                }, 50);
            });
            
            tooltip.addEventListener('mouseenter', (e) => {
                // 保持显示
            });
            
            tooltip.addEventListener('mouseleave', (e) => {
                tooltipManager.hide(tooltip);
            });
            
                // 添加删除或替换操作的栏位点击事件（只为已有性状的栏位添加）
            if (containerId === 'player-species-container' && gameState.phase === 1) {
                if (gameState.assignStep === 1 && gameState.selectedSpecies === species && 
                    (gameState.actionMode === 'replace' || gameState.actionMode === 'remove')) {
                        // 替换或移除操作 - 如果已有性状且当前选择的物种是该物种，可点击选择这个栏位
                        slot.classList.add('selectable-slot');
                        slot.addEventListener('click', (event) => {
                        event.stopPropagation(); // 阻止事件冒泡
                            selectSlot(traitType, species);
                    });
                }
            }
        } else {
                slot.textContent = `${slotTypeNames[traitType]}: 空栏位`;
            
            // 为空栏位添加点击事件（只能用于添加操作）
            if (containerId === 'player-species-container' && gameState.phase === 1) {
                if (gameState.assignStep === 1 && gameState.selectedSpecies === species && gameState.actionMode === 'add') {
                    // 添加操作 - 如果是空栏位且当前选择的物种是该物种，可点击选择这个栏位
                        slot.classList.add('selectable-slot');
                        slot.addEventListener('click', (event) => {
                        event.stopPropagation(); // 阻止事件冒泡
                            selectSlot(traitType, species);
                    });
                }
            }
        }
        
            speciesCard.appendChild(slot);
        }
        
        // 显示冷、热适应性
        const adaptabilityDisplay = document.createElement('div');
        adaptabilityDisplay.className = 'adaptability-display';
        
        const hotAdaptability = calculateAdaptability(species, 'hot');
        const coldAdaptability = calculateAdaptability(species, 'cold');
        
        const hotSpan = document.createElement('span');
        hotSpan.className = 'adaptability-hot';
        hotSpan.textContent = `热: ${hotAdaptability >= 0 ? '+' : ''}${hotAdaptability}`;
        
        const coldSpan = document.createElement('span');
        coldSpan.className = 'adaptability-cold';
        coldSpan.textContent = `冷: ${coldAdaptability >= 0 ? '+' : ''}${coldAdaptability}`;
        
        adaptabilityDisplay.appendChild(hotSpan);
        adaptabilityDisplay.appendChild(document.createTextNode(' | '));
        adaptabilityDisplay.appendChild(coldSpan);
        
        speciesCard.appendChild(adaptabilityDisplay);
        
        // 为玩家的物种卡添加点击事件
        if (containerId === 'player-species-container') {
            // 在性状分配阶段，当没有正在进行的操作时可以选择物种（但不能选择已灭绝的物种）
            if (gameState.phase === 1 && gameState.actionPoints > 0 && !species.extinct) {
                speciesCard.classList.add('selectable');
                speciesCard.addEventListener('click', (event) => {
                    event.stopPropagation(); // 阻止事件冒泡
                    selectSpecies(species);
                });
            }
            // 在复苏阶段且处于复制模式时，可以选择要复制的物种（但不能选择已灭绝的物种）
            else if (gameState.phase === 3 && gameState.revivalMode && !species.extinct) {
                speciesCard.classList.add('selectable');
                speciesCard.addEventListener('click', (event) => {
                    event.stopPropagation(); // 阻止事件冒泡
                    duplicateSpecies(species);
                });
            }
        }
        
        container.appendChild(speciesCard);
    }
}

// 渲染手牌
function renderHand(containerId, hand) {
    const container = document.getElementById(containerId);
    
    // 检查是否需要重新渲染（比较手牌数量和内容）
    const existingCards = container.querySelectorAll('.trait-card');
    let needsRerender = existingCards.length !== hand.length;
    
    if (!needsRerender) {
        // 检查每张卡的内容是否发生变化
        for (let i = 0; i < hand.length; i++) {
            const existingCard = existingCards[i];
            const trait = hand[i];
            const existingName = existingCard.querySelector('.trait-name')?.textContent;
            if (existingName !== trait.name) {
                needsRerender = true;
                break;
            }
        }
    }
    
    // 如果不需要重新渲染，只更新样式类
    if (!needsRerender) {
        for (let i = 0; i < hand.length; i++) {
            const traitCard = existingCards[i];
            const trait = hand[i];
            
            // 清除所有状态类
            traitCard.className = 'trait-card';
            
            // 1. 处理单个选择 (性状分配时)
            if (gameState.selectedTrait === trait) {
                traitCard.classList.add('selected');
            }
            
            // 2. 处理多选 (弃牌阶段)
            if (gameState.phase === 4 && containerId === 'player-traits' && gameState.isDiscardMode) {
                if (gameState.selectedCards.includes(i)) {
                    traitCard.classList.add('selected-for-discard');
                }
            }
            
            // 3. 处理高亮兼容性状 (性状分配阶段第3步，选择栏位后)
            if (gameState.phase === 1 && gameState.assignStep === 2 && gameState.selectedSlotType) {
                const isCompatible = (gameState.selectedSlotType === trait.type) || 
                                    (gameState.selectedSlotType === 'special' && trait.effect);
                if (!isCompatible) {
                    traitCard.classList.add('incompatible');
                } else {
                    traitCard.classList.add('compatible');
                }
            }
            
            // 重要：即使不重新渲染，也要重新添加点击事件监听器
            // 先移除所有现有的点击事件监听器
            const newTraitCard = traitCard.cloneNode(true);
            traitCard.parentNode.replaceChild(newTraitCard, traitCard);
            
            // 重新添加点击事件监听器
            if (containerId === 'player-traits') {
                // 性状分配阶段第3步，选择栏位后选择手牌
                if (gameState.phase === 1 && gameState.assignStep === 2 && gameState.selectedSlotType) {
                    const isCompatible = (gameState.selectedSlotType === trait.type) || 
                                        (gameState.selectedSlotType === 'special' && trait.effect);
                    if (isCompatible) {
                        newTraitCard.addEventListener('click', (event) => {
                            event.stopPropagation(); // 阻止事件冒泡
                            selectTraitForSlot(trait);
                        });
                    }
                }
                // 正常的性状分配阶段，但不是选择栏位后
                else if (gameState.phase === 1 && gameState.assignStep !== 2) {
                    newTraitCard.addEventListener('click', (event) => {
                        event.stopPropagation(); // 阻止事件冒泡
                        selectTrait(trait);
                    });
                }
                // 弃牌阶段
                else if (gameState.phase === 4 && gameState.isDiscardMode) {
                    newTraitCard.addEventListener('click', (event) => {
                        event.stopPropagation(); // 阻止事件冒泡
                        toggleCardForDiscard(i);
                    });
                }
            }
        }
        return; // 不需要重新渲染，直接返回
    }
    
    // 需要重新渲染时，先强制隐藏当前显示的tooltip
    tooltipManager.hideAll();
    
    // 清空容器并重新创建所有元素
    container.innerHTML = '';
    
    for (let i = 0; i < hand.length; i++) {
        const trait = hand[i];
        const traitCard = document.createElement('div');
        traitCard.className = 'trait-card';
        traitCard.dataset.index = i;
        
        // 1. 处理单个选择 (性状分配时)
        if (gameState.selectedTrait === trait) {
            traitCard.classList.add('selected');
        }
        
        // 2. 处理多选 (弃牌阶段)
        if (gameState.phase === 4 && containerId === 'player-traits' && gameState.isDiscardMode) {
            if (gameState.selectedCards.includes(i)) {
                traitCard.classList.add('selected-for-discard');
            }
        }
        
        // 3. 处理高亮兼容性状 (性状分配阶段第3步，选择栏位后)
        if (gameState.phase === 1 && gameState.assignStep === 2 && gameState.selectedSlotType) {
            // 如果栏位类型和性状类型一致，或者选择的是特殊栏位且这是特殊性状
            const isCompatible = (gameState.selectedSlotType === trait.type) || 
                                (gameState.selectedSlotType === 'special' && trait.effect);
            if (!isCompatible) {
                traitCard.classList.add('incompatible');
            } else {
                traitCard.classList.add('compatible');
            }
        }
        
        // 只显示性状名称
        const traitName = document.createElement('div');
        traitName.className = 'trait-name';
        traitName.textContent = trait.name;
        traitCard.appendChild(traitName);
        
        // 如果是特殊性状，设置背景颜色
        if (trait.effect && trait.color) {
            traitCard.style.backgroundColor = trait.color;
            traitCard.style.color = '#fff'; // 白色文字以便在有色背景上显示
        }
        
        // 添加悬停提示
        const tooltip = document.createElement('div');
        tooltip.className = 'trait-tooltip';
        
        // 格式化提示内容
        let tooltipContent = '';
        if (trait.hot !== undefined && trait.cold !== undefined) {
            tooltipContent += `热: ${trait.hot >= 0 ? '+' : ''}${trait.hot}, 冷: ${trait.cold >= 0 ? '+' : ''}${trait.cold}\n`;
            tooltipContent += '-----------\n';
        } else {
            tooltipContent += '(特殊性状)\n-----------\n';
        }
        tooltipContent += trait.description;
        
        tooltip.textContent = tooltipContent;
        traitCard.appendChild(tooltip);
        
        // 添加鼠标事件来定位悬浮窗
        traitCard.addEventListener('mouseenter', (e) => {
            tooltipManager.show(tooltip, e.target);
        });
        
        traitCard.addEventListener('mouseleave', (e) => {
            // 检查鼠标是否移动到tooltip上
            setTimeout(() => {
                const tooltipRect = tooltip.getBoundingClientRect();
                const mouseX = e.clientX;
                const mouseY = e.clientY;
                
                // 如果鼠标不在tooltip区域内，则隐藏
                if (mouseX < tooltipRect.left - 5 || mouseX > tooltipRect.right + 5 ||
                    mouseY < tooltipRect.top - 5 || mouseY > tooltipRect.bottom + 5) {
                    tooltipManager.hide(tooltip);
                }
            }, 50);
        });
        
        // 为tooltip添加鼠标事件
        tooltip.addEventListener('mouseenter', (e) => {
            // 鼠标进入tooltip时保持显示
        });
        
        tooltip.addEventListener('mouseleave', (e) => {
            tooltipManager.hide(tooltip);
        });
        
        // 根据不同阶段添加不同的点击事件
        if (containerId === 'player-traits') {
            // 性状分配阶段第3步，选择栏位后选择手牌
            if (gameState.phase === 1 && gameState.assignStep === 2 && gameState.selectedSlotType) {
                const isCompatible = (gameState.selectedSlotType === trait.type) || 
                                    (gameState.selectedSlotType === 'special' && trait.effect);
                if (isCompatible) {
                    traitCard.addEventListener('click', (event) => {
                        event.stopPropagation(); // 阻止事件冒泡
                        selectTraitForSlot(trait);
                    });
                }
            }
            // 正常的性状分配阶段，但不是选择栏位后
            else if (gameState.phase === 1 && gameState.assignStep !== 2) {
                traitCard.addEventListener('click', (event) => {
                    event.stopPropagation(); // 阻止事件冒泡
                    selectTrait(trait);
                });
            }
            // 弃牌阶段
            else if (gameState.phase === 4 && gameState.isDiscardMode) {
                traitCard.addEventListener('click', (event) => {
                    event.stopPropagation(); // 阻止事件冒泡
                    toggleCardForDiscard(i);
                });
            }
        }
        
        container.appendChild(traitCard);
    }
}

// 选择物种
function selectSpecies(species) {
    // 如果当前有确认面板打开，不允许选择物种
    if (gameState.assignStep === 4) {
        return;
    }
    
    // 在性状分配阶段
    if (gameState.phase === 1) {
        if (gameState.actionPoints <= 0) {
            logMessage('你的行动点数已用完，无法再进行操作');
            return;
        }
        
        // 如果当前正在选择栏位或手牌（assignStep > 1），不允许重新选择物种
        if (gameState.assignStep > 1) {
            logMessage('请完成当前操作或取消后再选择其他物种');
            return;
        }
        
        // 如果当前正在编辑但还没有选择栏位，先重置操作
        if (gameState.assignStep === 1) {
            resetTraitSelection();
        }
        
        gameState.selectedSpecies = species;
        gameState.assignStep = 1; // 进入选择操作步骤
        
        logMessage(`已选择 ${species.name}，请选择要执行的操作`);
        
        // 显示操作面板
        document.getElementById('species-action-panel').classList.remove('hidden');
        updateUI();
    }
    // 处理复苏阶段的物种复制
    else if (gameState.phase === 3 && gameState.revivalMode) {
        if (species.extinct) {
            logMessage(`无法复制已灭绝的物种`);
            return;
        }
        
        duplicateSpecies(species);
    }
}

// 选择性状卡
function selectTrait(trait) {
    if (gameState.phase !== 1) return; // 只在性状分配阶段可以选择
    
    gameState.selectedTrait = trait;
    updateUI();
}

// 执行性状操作
function executeTrait(action) {
    // 如果是移除操作，不需要预先选择性状
    if (action === 'remove') {
        gameState.actionMode = 'remove';
        gameState.assignStep = 1; // 设置为选择栏位步骤
        logMessage('请选择要移除性状的栏位（注意：特殊性状不能被移除）');
        document.getElementById('species-action-panel').classList.add('hidden');
        updateUI();
        return;
    }
    
    // 对于添加和替换操作，只需要选择了物种即可
    if (!gameState.selectedSpecies) {
        logMessage('请先选择物种');
        return;
    }
    
    // 检查是否还有行动点数
    if (gameState.actionPoints <= 0) {
        logMessage('你的行动点数已用完，无法再进行操作');
        return;
    }
    
    // 设置操作模式并进入选择栏位步骤
    gameState.actionMode = action;
    gameState.assignStep = 1; // 进入选择栏位步骤
    
    if (action === 'add') {
        logMessage('请选择要添加性状的栏位（只能选择空栏位）');
    } else if (action === 'replace') {
        logMessage('请选择要替换性状的栏位（注意：特殊性状不能被替换）');
    }
    
    // 隐藏操作面板
    document.getElementById('species-action-panel').classList.add('hidden');
    
    updateUI();
}

// AI进行性状分配决策
function aiAssignTraits() {
    if (ai.hand.length === 0 || ai.species.length === 0) return;
    
    // AI行动点数计算：基础点数为存活物种数量，检查是否有"快速繁衍"特殊性状
    const aiAliveSpecies = ai.species.filter(s => !s.extinct);
    let aiActionPoints = aiAliveSpecies.length;
    
    let aiExtraActionPoints = 0;
    for (const species of aiAliveSpecies) {
        for (const specialTrait of species.specialTraits) {
            if (specialTrait && specialTrait.effect === 'extraTrait') {
            aiExtraActionPoints++;
            }
        }
    }
    aiActionPoints += aiExtraActionPoints;
    
    const aiActions = []; // 记录AI的所有操作
    let operationsPerformed = 0; // 已执行的操作数量
    
    // AI按行动点数限制进行操作
    while (operationsPerformed < aiActionPoints && ai.hand.length > 0) {
        let operationPerformed = false;
        
        // 获取存活的物种
        const aliveSpecies = ai.species.filter(s => !s.extinct);
        if (aliveSpecies.length === 0) break;
        
        // 尝试找到可以进行的操作
        let availableOperations = [];
        
        // 遍历手牌，找到所有可能的操作
        for (let i = 0; i < ai.hand.length; i++) {
            const trait = ai.hand[i];
            
            for (const species of aliveSpecies) {
                if (trait.effect) {
                    // 特殊性状
                    for (let j = 0; j < species.specialTraits.length; j++) {
                        if (species.specialTraits[j] === null) {
                        // 可以添加特殊性状
                        availableOperations.push({
                            type: 'add_special',
                            species: species,
                            trait: trait,
                                slotIndex: j,
                                priority: 7
                            });
                            break; // 只添加到第一个空栏位
                        }
                    }
                    
                    // 替换特殊性状（低优先级）
                    for (let j = 0; j < species.specialTraits.length; j++) {
                        if (species.specialTraits[j] !== null) {
                        availableOperations.push({
                            type: 'replace_special',
                            species: species,
                            trait: trait,
                                slotIndex: j,
                                priority: 3
                        });
                        }
                    }
                } else {
                    // 常规性状
                    const traitType = trait.type;
                    if (species.traits[traitType] === null) {
                        // 可以添加常规性状
                        availableOperations.push({
                            type: 'add_regular',
                            species: species,
                            trait: trait,
                            traitIndex: i,
                            slotType: traitType,
                            priority: 3 // 添加操作优先级高
                        });
                    } else {
                        // 检查是否值得替换
                        const existingTrait = species.traits[traitType];
                        let existingScore = 0, newScore = 0;
                        
                        // 在性状分配阶段，根据温度变化趋势来评估性状价值
                        if (gameState.temperatureChange) {
                            const predictedEnvironment = gameState.temperatureChange.change;
                            existingScore = existingTrait[predictedEnvironment] || 0;
                            newScore = trait[predictedEnvironment] || 0;
                        } else {
                            // 如果没有温度变化信息，使用总适应性
                            existingScore = (existingTrait.hot || 0) + (existingTrait.cold || 0);
                            newScore = (trait.hot || 0) + (trait.cold || 0);
                        }
                        
                        if (newScore > existingScore) {
                            // 值得替换
                            availableOperations.push({
                                type: 'replace_regular',
                                species: species,
                                trait: trait,
                                traitIndex: i,
                                slotType: traitType,
                                priority: 2,
                                scoreImprovement: newScore - existingScore
                            });
                        }
                    }
                }
            }
        }
        
        // 如果没有可用操作，直接跳出循环
        if (availableOperations.length === 0) {
            logMessage('AI 没有找到任何可执行的操作，提前结束分配阶段');
            break;
        }
        
        // 按优先级和效果排序操作
        availableOperations.sort((a, b) => {
            if (a.priority !== b.priority) {
                return b.priority - a.priority; // 优先级高的排前面
            }
            if (a.scoreImprovement && b.scoreImprovement) {
                return b.scoreImprovement - a.scoreImprovement; // 改进大的排前面
            }
            return 0;
        });
        
        // 执行第一个可用操作
        const operation = availableOperations[0];
        const { type, species, trait, traitIndex, slotType } = operation;
        
        // 从手牌中移除这张卡
        ai.hand.splice(traitIndex, 1);
        
        switch (type) {
            case 'add_special':
                species.specialTraits[slotIndex] = trait;
                aiActions.push(`为 ${species.name} 添加特殊性状: ${trait.name}`);
                operationPerformed = true;
                break;
                
            case 'replace_special':
                const oldSpecialTrait = species.specialTraits[slotIndex];
                species.specialTraits[slotIndex] = trait;
                aiActions.push(`将 ${species.name} 的特殊性状 ${oldSpecialTrait.name} 替换为 ${trait.name}`);
                operationPerformed = true;
                break;
                
            case 'add_regular':
                species.traits[slotType] = trait;
                const slotTypeName = slotType === 'body' ? '体型' : slotType === 'fur' ? '皮毛' : '血液';
                aiActions.push(`为 ${species.name} 添加${slotTypeName}性状: ${trait.name}`);
                operationPerformed = true;
                break;
                
            case 'replace_regular':
                const oldTrait = species.traits[slotType];
                species.traits[slotType] = trait;
                const slotName = slotType === 'body' ? '体型' : slotType === 'fur' ? '皮毛' : '血液';
                aiActions.push(`将 ${species.name} 的${slotName}性状 ${oldTrait.name} 替换为 ${trait.name}`);
                operationPerformed = true;
                break;
        }
        
        if (operationPerformed) {
            operationsPerformed++;
        }
    }
    
    // 汇总显示AI的操作
    if (aiActions.length > 0) {
        logMessage(`AI 使用了 ${operationsPerformed} 点行动点数，进行了以下操作:`);
        aiActions.forEach(action => {
            logMessage(`- ${action}`);
        });
    } else {
        logMessage('AI 没有进行任何性状分配操作');
    }
}

// 阶段控制
function startPhase(phaseIndex) {
    gameState.phase = phaseIndex;
    
    // 在非复苏阶段隐藏复制物种按钮
    if (phaseIndex !== 3) {
        document.getElementById('duplicate-species').classList.add('hidden');
    }
    
    updateUI();
    
    switch(phaseIndex) {
        case 0: // 抽牌阶段
            drawPhase();
            break;
        case 1: // 性状分配阶段
            traitAssignmentPhase();
            break;
        case 2: // 灭绝阶段
            extinctionPhase();
            break;
        case 3: // 复苏阶段
            revivalPhase();
            break;
        case 4: // 弃牌阶段
            discardPhase();
            break;
    }
}

// 抽牌阶段
function drawPhase() {
    logMessage('===== 抽牌阶段 =====');
    
    // 每回合开始时重置环境严峻程度
    gameState.environmentSeverity = 0;
    
    // 主持人抽取气候状态卡和温度变化卡
    gameState.climateState = drawClimateState();
    gameState.temperatureChange = drawTemperatureChange();
    
    logMessage(`主持人抽取了气候状态卡: ${gameState.climateState.name}`);
    logMessage(`主持人抽取了温度变化卡: ${gameState.temperatureChange.name}`);
    
    // 玩家抽牌（数量=当前存活物种数）
    const playerAliveSpecies = player.species.filter(s => !s.extinct).length;
    const playerDrawn = drawRegularTraits(playerAliveSpecies);
    player.hand.push(...playerDrawn);
    logMessage(`你抽取了 ${playerDrawn.length} 张性状卡`);
    
    // AI抽牌
    const aiAliveSpecies = ai.species.filter(s => !s.extinct).length;
    const aiDrawn = drawRegularTraits(aiAliveSpecies);
    ai.hand.push(...aiDrawn);
    logMessage(`AI 抽取了 ${aiDrawn.length} 张性状卡`);
    
    updateUI();
}

// 性状分配阶段
function traitAssignmentPhase() {
    logMessage('===== 性状分配阶段 =====');
    
    // 重置性状分配标记
    gameState.playerTraitAssigned = false;
    gameState.aiTraitAssigned = false;
    gameState.subPhase = 0;
    gameState.assignStep = 0;
    gameState.actionMode = null;
    
    // 计算玩家行动点数：基础点数为存活物种数量
    const playerAliveSpecies = player.species.filter(s => !s.extinct);
    gameState.actionPoints = playerAliveSpecies.length;
    
    // 检查玩家是否有"快速繁衍"特殊性状，增加行动点数
    let extraActionPoints = 0;
    for (const species of playerAliveSpecies) {
        for (const specialTrait of species.specialTraits) {
            if (specialTrait && specialTrait.effect === 'extraTrait') {
            extraActionPoints++;
            }
        }
    }
    gameState.actionPoints += extraActionPoints;
    
    if (extraActionPoints > 0) {
        logMessage(`你有 ${extraActionPoints} 个物种装备了"快速繁衍"特殊性状，额外获得 ${extraActionPoints} 点行动点数`);
    }
    
    // 玩家分配阶段
    logMessage('玩家分配阶段：请按照以下步骤操作:');
    logMessage('1. 选择一个物种');
    logMessage('2. 选择要执行的操作类型（添加/替换/移除）');
    logMessage('3. 选择要操作的栏位');
    logMessage('4. 选择要使用的手牌（添加/替换操作需要）');
    logMessage(`你有 ${gameState.actionPoints} 点行动点数（${playerAliveSpecies.length}个存活物种 + ${extraActionPoints}个特殊性状加成），每次操作消耗1点`);
    logMessage('完成后点击"下一阶段"按钮');
    
    // 在性状分配阶段始终显示AI的物种信息
    document.getElementById('ai-species-container').style.visibility = 'visible';
    
    // 在updateUI中处理下一步的逻辑
    updateUI();
}

// 处理性状分配的子阶段
function handleTraitAssignmentSubPhases() {
    switch (gameState.subPhase) {
        case 0: // 玩家分配阶段
            // 这个阶段由玩家手动完成，点击"下一阶段"按钮时设置playerTraitAssigned为true
            document.getElementById('next-phase').textContent = '完成性状分配';
            break;
            
        case 1: // AI分配阶段并直接展示结果
            document.getElementById('next-phase').textContent = '下一阶段';
            if (!gameState.aiTraitAssigned) {
                logMessage('AI正在分配性状...');
                // AI自动进行性状分配
                aiAssignTraits();
                gameState.aiTraitAssigned = true;
                logMessage('所有玩家已完成性状分配，结果已展示');
            }
            break;
    }
}

// 清理已灭绝的物种（在灭绝阶段结束后调用）
function cleanupExtinctSpecies() {
    // 移除玩家的已灭绝物种
    player.species = player.species.filter(species => !species.extinct);
    
    // 移除AI的已灭绝物种
    ai.species = ai.species.filter(species => !species.extinct);
    
    logMessage('已清理灭绝的物种');
}

// 灭绝阶段
function extinctionPhase() {
    logMessage('===== 灭绝阶段 =====');
    
    // 主持人（游戏系统）自动掷骰子决定基础环境严峻程度
    const diceResult = rollDice();
    logMessage(`主持人掷骰结果: ${diceResult}`);
    
    // 根据气候状态和温度变化计算最终环境
    const finalEnvironment = calculateFinalSeverity(diceResult, gameState.climateState, gameState.temperatureChange);
    gameState.environmentType = finalEnvironment.environmentType;
    gameState.environmentSeverity = finalEnvironment.severity;
    
    const envName = environmentTypeNames[gameState.environmentType];
    
    // 计算气候状态的影响
    let climateEffect = 0;
    let climateDescription = '';
    
    if (gameState.environmentType === 'cold') {
        // 降温环境：冰室期加强，温室期减弱
        const iceBonus = gameState.climateState.coldBonus;
        const heatPenalty = gameState.climateState.hotBonus;
        climateEffect = iceBonus - heatPenalty;
        
        if (iceBonus > 0 && heatPenalty > 0) {
            climateDescription = `冰室效应+${iceBonus}，温室效应-${heatPenalty}`;
        } else if (iceBonus > 0) {
            climateDescription = `冰室效应+${iceBonus}`;
        } else if (heatPenalty > 0) {
            climateDescription = `温室效应-${heatPenalty}`;
        } else {
            climateDescription = '无气候影响';
        }
    } else {
        // 升温环境：温室期加强，冰室期减弱
        const heatBonus = gameState.climateState.hotBonus;
        const icePenalty = gameState.climateState.coldBonus;
        climateEffect = heatBonus - icePenalty;
        
        if (heatBonus > 0 && icePenalty > 0) {
            climateDescription = `温室效应+${heatBonus}，冰室效应-${icePenalty}`;
        } else if (heatBonus > 0) {
            climateDescription = `温室效应+${heatBonus}`;
        } else if (icePenalty > 0) {
            climateDescription = `冰室效应-${icePenalty}`;
        } else {
            climateDescription = '无气候影响';
        }
    }
    
    logMessage(`气候状态"${gameState.climateState.name}"对${envName}环境的影响: ${climateDescription}`);
    
    const effectSign = climateEffect >= 0 ? '+' : '';
    logMessage(`最终环境: ${envName}, 严峻程度: ${gameState.environmentSeverity} (${diceResult} ${effectSign}${climateEffect})`);
    
    if (gameState.environmentSeverity === 0) {
        logMessage('环境被气候状态完全抵消，无物种灭绝！');
    }
    
    // 检查玩家物种灭绝
    for (const species of player.species) {
        if (species.extinct) continue;
        
        const extinct = checkExtinction(species, gameState.environmentType, gameState.environmentSeverity);
        if (extinct) {
            species.extinct = true;
            logMessage(`你的物种 ${species.name} 灭绝了！`);
        } else {
            const adaptability = calculateAdaptability(species, gameState.environmentType);
            logMessage(`你的物种 ${species.name} 存活，适应性: ${adaptability}`);
        }
    }
    
    // 检查AI物种灭绝
    for (const species of ai.species) {
        if (species.extinct) continue;
        
        const extinct = checkExtinction(species, gameState.environmentType, gameState.environmentSeverity);
        if (extinct) {
            species.extinct = true;
            logMessage(`AI的物种 ${species.name} 灭绝了！`);
        } else {
            const adaptability = calculateAdaptability(species, gameState.environmentType);
            logMessage(`AI的物种 ${species.name} 存活，适应性: ${adaptability}`);
        }
    }
    
    updateUI();
}

// 复苏阶段
function revivalPhase() {
    logMessage('===== 复苏阶段 =====');
    
    // 清理上一阶段灭绝的物种
    cleanupExtinctSpecies();
    
    // 重置复苏模式标志
    gameState.revivalMode = false;
    gameState.playerDuplicatedThisRound = false; // 重置复制标记
    
    // 检查双方存活物种数量
    const playerAliveSpecies = player.species.filter(s => !s.extinct);
    const aiAliveSpecies = ai.species.filter(s => !s.extinct);
    
    // 检查双方是否都完全灭绝
    if (playerAliveSpecies.length === 0 && aiAliveSpecies.length === 0) {
        logMessage('双方都已完全灭绝！游戏结束，平局！');
        gameState.gameEnded = true;
        ensureButtonState();
        return;
    }
    
    // 检查玩家是否完全灭绝
    if (playerAliveSpecies.length === 0) {
        logMessage('你已经完全灭绝！游戏结束，AI获胜！');
        gameState.gameEnded = true;
        ensureButtonState();
        return;
    }
    
    // 检查AI是否完全灭绝
    if (aiAliveSpecies.length === 0) {
        logMessage('AI已经完全灭绝！游戏结束，你获胜！');
        gameState.gameEnded = true;
        ensureButtonState();
        return;
    }
    
    // 首先检查是否达到最大物种数量，如果是则给予特殊性状牌奖励
    if (playerAliveSpecies.length >= gameState.maxSpeciesCount) {
        const specialTrait = drawSpecialTrait();
        player.hand.push(specialTrait);
        logMessage(`你的物种数量达到最大值（${gameState.maxSpeciesCount}个），获得了一张特殊性状牌: ${specialTrait.name}`);
    } else if (playerAliveSpecies.length > 0) {
        // 玩家物种少于最大值，可复制一个存活物种
        document.getElementById('duplicate-species').classList.remove('hidden');
        logMessage('你可以复制一个存活的物种。点击"复制物种"按钮开始选择。');
        
        // 暂停处理AI，等待玩家完成复制
        updateUI();
        return;
    }
    
    // 处理AI的情况（只有当玩家不需要复制时才执行）
    handleAIRevival(aiAliveSpecies);
    
    updateUI();
}

// 弃牌阶段
function discardPhase() {
    logMessage('===== 弃牌阶段 =====');
    
    // 计算玩家和AI应保留的牌数
    const playerAliveSpecies = player.species.filter(s => !s.extinct).length;
    const aiAliveSpecies = ai.species.filter(s => !s.extinct).length;
    
    // 重置选择的卡牌
    gameState.selectedCards = [];
    
    // 玩家弃牌
    if (player.hand.length > playerAliveSpecies) {
        const needToDiscard = player.hand.length - playerAliveSpecies;
        logMessage(`你需要弃掉至少 ${needToDiscard} 张性状卡`);
        logMessage('请点击要弃掉的性状卡，然后点击"确认弃牌"按钮');
        
        // 显示弃牌确认按钮
        showDiscardConfirmButton();
        
        // 标记进入弃牌选择模式
        gameState.isDiscardMode = true;
        
        // 等待玩家选择要弃掉的牌
        updateUI();
        return; // 暂停函数执行，等待玩家选择
    }
    
    // AI弃牌
    if (ai.hand.length > aiAliveSpecies) {
        // AI自动弃牌
        const discardCount = ai.hand.length - aiAliveSpecies;
        // 随机弃牌
        for (let i = 0; i < discardCount; i++) {
            const randomIndex = Math.floor(Math.random() * ai.hand.length);
            ai.hand.splice(randomIndex, 1);
        }
        logMessage(`AI 弃掉了 ${discardCount} 张性状卡`);
    }
    
    // 如果没有进入选择模式，则直接结束回合
    finishDiscardPhase();
}

// 确认弃牌并结束弃牌阶段
function confirmDiscard() {
    // 检查是否已经选择了足够的牌
    const playerAliveSpecies = player.species.filter(s => !s.extinct).length;
    const needToDiscard = player.hand.length - playerAliveSpecies;
    
    if (gameState.selectedCards.length < needToDiscard) {
        logMessage(`你必须至少弃掉 ${needToDiscard} 张性状卡，当前只选择了 ${gameState.selectedCards.length} 张`);
        logMessage('请继续选择要弃掉的性状卡');
        // 不隐藏按钮，让玩家继续选择
        return;
    }
    
    // 选择足够的牌后，隐藏弃牌确认按钮
    hideDiscardConfirmButton();
    
    // 从大到小排序，以便删除时索引不会变化
    gameState.selectedCards.sort((a, b) => b - a);
    
    // 移除选中的牌
    for (const index of gameState.selectedCards) {
        player.hand.splice(index, 1);
    }
    
    logMessage(`你弃掉了 ${gameState.selectedCards.length} 张性状卡`);
    gameState.selectedCards = [];
    gameState.isDiscardMode = false;
    
    // 处理AI弃牌
    const aiAliveSpecies = ai.species.filter(s => !s.extinct).length;
    
    if (ai.hand.length > aiAliveSpecies) {
        // AI自动弃牌
        const discardCount = ai.hand.length - aiAliveSpecies;
        // 随机弃牌
        for (let i = 0; i < discardCount; i++) {
            const randomIndex = Math.floor(Math.random() * ai.hand.length);
            ai.hand.splice(randomIndex, 1);
        }
        logMessage(`AI 弃掉了 ${discardCount} 张性状卡`);
    }
    
    finishDiscardPhase();
}

// 完成弃牌阶段
function finishDiscardPhase() {
    // 重置弃牌相关状态
    gameState.selectedCards = [];
    gameState.isDiscardMode = false;
    
    // 确保弃牌确认按钮被隐藏，下一阶段按钮被显示
    hideDiscardConfirmButton();
    
    // 回合结束
    logMessage(`回合 ${gameState.round} 结束`);
    gameState.round++;
    
    // 立即确保按钮状态正确
    ensureButtonState();
    
    // 稍微延迟后开始新回合，确保UI状态稳定
    setTimeout(() => {
        updateUI();
        // 自动开始下一回合的抽牌阶段
        startPhase(0);
    }, 50);
}

// 显示弃牌确认按钮
function showDiscardConfirmButton() {
    // 确保下一阶段按钮存在
    const nextPhaseBtn = document.getElementById('next-phase');
    if (!nextPhaseBtn) {
        console.error('下一阶段按钮不存在');
        return;
    }
    
    // 移除可能存在的旧弃牌确认按钮
    const oldConfirmBtn = document.getElementById('confirm-discard');
    if (oldConfirmBtn) {
        oldConfirmBtn.remove();
    }
    
    // 创建新的弃牌确认按钮
    const confirmBtn = document.createElement('button');
    confirmBtn.id = 'confirm-discard';
    confirmBtn.className = 'btn';
    confirmBtn.textContent = '确认弃牌';
    confirmBtn.addEventListener('click', confirmDiscard);
    
    // 添加到控制面板中，在下一阶段按钮之前
    const controlPanel = document.getElementById('control-panel');
    if (controlPanel) {
        controlPanel.insertBefore(confirmBtn, nextPhaseBtn);
        // 隐藏下一阶段按钮
        nextPhaseBtn.style.display = 'none';
    } else {
        console.error('无法找到控制面板');
    }
}

// 隐藏弃牌确认按钮
function hideDiscardConfirmButton() {
    // 移除弃牌确认按钮
    const confirmBtn = document.getElementById('confirm-discard');
    if (confirmBtn) {
        confirmBtn.remove();
    }
    
    // 确保下一阶段按钮可见
    const nextPhaseBtn = document.getElementById('next-phase');
    if (nextPhaseBtn) {
        nextPhaseBtn.style.display = 'inline-block';
        nextPhaseBtn.style.visibility = 'visible';
    } else {
        console.error('下一阶段按钮不存在');
    }
}

// 确保按钮状态正确的函数
function ensureButtonState() {
    const nextPhaseBtn = document.getElementById('next-phase');
    const confirmBtn = document.getElementById('confirm-discard');
    
    // 如果游戏已结束，禁用下一阶段按钮
    if (gameState.gameEnded) {
        if (nextPhaseBtn) {
            nextPhaseBtn.disabled = true;
            nextPhaseBtn.textContent = '游戏已结束';
            nextPhaseBtn.style.opacity = '0.5';
        }
        if (confirmBtn) {
            confirmBtn.remove();
        }
        return;
    }
    
    if (gameState.isDiscardMode) {
        // 弃牌模式：应该显示确认弃牌按钮，隐藏下一阶段按钮
        if (!confirmBtn) {
            showDiscardConfirmButton();
        }
        if (nextPhaseBtn) {
            nextPhaseBtn.style.display = 'none';
        }
        
        // 更新确认弃牌按钮的文本，显示当前选择状态
        if (confirmBtn) {
            const playerAliveSpecies = player.species.filter(s => !s.extinct).length;
            const needToDiscard = player.hand.length - playerAliveSpecies;
            const selected = gameState.selectedCards.length;
            
            if (selected < needToDiscard) {
                confirmBtn.textContent = `确认弃牌 (${selected}/${needToDiscard})`;
                confirmBtn.disabled = false; // 允许点击，但会提示不足
            } else {
                confirmBtn.textContent = `确认弃牌 (${selected}/${needToDiscard})`;
                confirmBtn.disabled = false;
            }
        }
    } else {
        // 正常模式：应该显示下一阶段按钮，移除确认弃牌按钮
        if (confirmBtn) {
            confirmBtn.remove();
        }
        if (nextPhaseBtn) {
            nextPhaseBtn.style.display = 'inline-block';
            nextPhaseBtn.style.visibility = 'visible';
            nextPhaseBtn.disabled = false;
            nextPhaseBtn.style.opacity = '1';
        }
    }
}

// 记录游戏日志
function logMessage(message) {
    const logContainer = document.getElementById('game-log');
    const logEntry = document.createElement('p');
    logEntry.textContent = message;
    logContainer.appendChild(logEntry);
    
    // 滚动父容器 log-container 而不是 game-log
    const scrollContainer = document.getElementById('log-container');
    setTimeout(() => {
        scrollContainer.scrollTo({
            top: scrollContainer.scrollHeight,
            behavior: 'smooth'
        });
    }, 10);
}

// 事件监听器设置
document.addEventListener('DOMContentLoaded', function() {
    // 开始游戏按钮
    document.getElementById('start-game').addEventListener('click', function() {
        const maxSpeciesCount = parseInt(document.getElementById('max-species-select').value);
        
        // 隐藏设置面板，显示游戏面板
        document.getElementById('game-settings-panel').classList.add('hidden');
        document.getElementById('game-board').classList.remove('hidden');
        
        // 开始游戏
        initGame(maxSpeciesCount);
    });
    
    // 新游戏按钮 - 返回设置界面
    document.getElementById('new-game').addEventListener('click', function() {
        // 显示设置面板，隐藏游戏面板
        document.getElementById('game-settings-panel').classList.remove('hidden');
        document.getElementById('game-board').classList.add('hidden');
        
        // 清空游戏日志
        document.getElementById('game-log').innerHTML = '';
    });
    
    // 下一阶段按钮
    document.getElementById('next-phase').addEventListener('click', function() {
        // 如果游戏已结束，不响应点击
        if (gameState.gameEnded) {
            return;
        }
        
        // 如果当前是复苏阶段且玩家可以复制但还没有复制
        if (gameState.phase === 3) {
            const playerAliveSpecies = player.species.filter(s => !s.extinct);
            if (playerAliveSpecies.length < gameState.maxSpeciesCount && 
                playerAliveSpecies.length > 0 && 
                !gameState.playerDuplicatedThisRound) {
                
                // 显示自定义确认对话框
                const confirmText = `你当前有 ${playerAliveSpecies.length} 个存活物种，可以复制一个物种增加到 ${playerAliveSpecies.length + 1} 个。\n\n确定要放弃复制物种的机会吗？`;
                document.getElementById('duplication-confirm-text').textContent = confirmText;
                document.getElementById('duplication-confirm-panel').classList.remove('hidden');
                return; // 停止执行，等待用户选择
            }
        }
        
        // 如果当前是性状分配阶段，需要处理子阶段
        if (gameState.phase === 1) {
            if (gameState.subPhase === 0) {
                // 玩家完成性状分配，进入AI分配阶段并直接展示结果
                gameState.playerTraitAssigned = true;
                gameState.subPhase = 1;
                updateUI();
            } else {
                // AI分配阶段结束，进入下一个主阶段
                const nextPhase = (gameState.phase + 1) % 5;
                startPhase(nextPhase);
            }
        } else {
            // 其他阶段直接进入下一阶段
            const nextPhase = (gameState.phase + 1) % 5;
            startPhase(nextPhase);
        }
    });
    
    // 灭绝阶段的掷骰由系统自动完成
    
    // 物种操作按钮
    document.getElementById('add-trait').addEventListener('click', function() {
        executeTrait('add');
    });
    
    document.getElementById('replace-trait').addEventListener('click', function() {
        executeTrait('replace');
    });
    
    document.getElementById('remove-trait').addEventListener('click', function() {
        executeTrait('remove');
    });
    
    document.getElementById('cancel-action').addEventListener('click', function() {
        gameState.selectedSpecies = null;
        gameState.selectedTrait = null;
        document.getElementById('species-action-panel').classList.add('hidden');
        updateUI();
    });
    
    // 确认性状操作按钮
    document.getElementById('confirm-trait-action').addEventListener('click', function() {
        if (gameState.pendingTraitAction) {
            if (gameState.pendingTraitAction.mode === 'remove') {
                confirmRemoveTraitAction();
            } else {
                confirmTraitAction();
            }
        }
    });
    
    // 取消性状操作按钮
    document.getElementById('cancel-trait-action').addEventListener('click', function() {
        cancelTraitAction();
    });
    
    // 添加ESC键取消当前操作的功能
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            if (gameState.phase === 1 && gameState.assignStep > 0) {
                logMessage('已取消当前操作');
                resetTraitSelection();
                updateUI();
            }
        }
    });
    
    // 复制物种按钮
    document.getElementById('duplicate-species').addEventListener('click', function() {
        enterDuplicationMode();
    });
    
    // 确认放弃复制按钮
    document.getElementById('confirm-skip-duplication').addEventListener('click', function() {
        // 隐藏对话框
        document.getElementById('duplication-confirm-panel').classList.add('hidden');
        
        // 玩家确认跳过复制，隐藏复制按钮并处理AI复苏
        document.getElementById('duplicate-species').classList.add('hidden');
        logMessage('你选择放弃复制物种的机会');
        
        // 处理AI的复苏
        const aiAliveSpecies = ai.species.filter(s => !s.extinct);
        handleAIRevival(aiAliveSpecies);
        
        // 进入下一阶段
        const nextPhase = (gameState.phase + 1) % 5;
        startPhase(nextPhase);
    });
    
    // 取消放弃复制按钮
    document.getElementById('cancel-skip-duplication').addEventListener('click', function() {
        // 隐藏对话框
        document.getElementById('duplication-confirm-panel').classList.add('hidden');
        logMessage('已取消进入下一阶段，你可以继续选择复制物种');
    });
    
    // 不再自动开始游戏，等待玩家在设置面板点击开始
});

// 从栏位中直接移除性状
function removeTraitFromSlot(species, slotType) {
    if (!species || gameState.actionMode !== 'remove') return;
    
    // 检查是否还有行动点数
    if (gameState.actionPoints <= 0) {
        logMessage('你的行动点数已用完，无法再进行操作');
        return;
    }
    
    // 检查是否试图移除特殊性状
    if (slotType === 'special') {
        logMessage('特殊性状不能被移除！');
        return;
    }
    
    // 检查是否有性状可以移除
    let traitToRemove = null;
    
    traitToRemove = species.traits[slotType];
    
    if (!traitToRemove) {
        logMessage('该栏位没有性状可移除');
        return;
    }
    
    // 存储待确认的移除操作
    gameState.pendingTraitAction = {
        species: species,
        slotType: slotType,
        traitName: traitToRemove.name,
        mode: 'remove'
    };
    
    // 更新确认文本
    const typeName = slotType === 'body' ? '体型' : 
                    slotType === 'fur' ? '皮毛' : '血液';
    const confirmText = `是否确认从 ${species.name} 移除${typeName}性状: ${traitToRemove.name}？`;
    document.getElementById('confirm-operation-text').textContent = confirmText;
    document.getElementById('confirm-trait-panel').classList.remove('hidden');
    
    // 进入确认步骤
    gameState.assignStep = 4;
    
    updateUI();
}

// 确认移除性状
function confirmRemoveTraitAction() {
    if (!gameState.pendingTraitAction || gameState.pendingTraitAction.mode !== 'remove') return;
    
    const {species, slotType, traitName} = gameState.pendingTraitAction;
    
    // 移除常规性状
    if (species.traits[slotType]) {
        species.traits[slotType] = null;
    }
    
    const typeName = slotType === 'body' ? '体型' : 
                    slotType === 'fur' ? '皮毛' : '血液';
    logMessage(`从 ${species.name} 移除了${typeName}性状: ${traitName}`);
    
    // 消耗一点行动点数
    gameState.actionPoints--;
    logMessage(`剩余行动点数: ${gameState.actionPoints}`);
    
    // 重置选择和操作模式
    resetTraitSelection();
    
    updateUI();
}

// 切换卡牌选择状态（用于弃牌阶段）
function toggleCardForDiscard(index) {
    const cardIndex = gameState.selectedCards.indexOf(index);
    if (cardIndex === -1) {
        // 卡牌未被选中，添加到选中列表
        gameState.selectedCards.push(index);
    } else {
        // 卡牌已被选中，从选中列表移除
        gameState.selectedCards.splice(cardIndex, 1);
    }
    updateUI();
}

// 为指定栏位选择性状（用于性状分配阶段）
function selectTraitForSlot(trait) {
    if (!gameState.selectedSpecies || !gameState.selectedSlotType) {
        logMessage('错误: 未选择物种或栏位');
        return;
    }
    
    const species = gameState.selectedSpecies;
    const slotType = gameState.selectedSlotType;
    
    // 检查行动点数是否足够
    if (gameState.actionPoints <= 0) {
        logMessage('你的行动点数已经用完了');
        return;
    }
    
    const slotTypeName = slotType === 'body' ? '体型' :
                        slotType === 'fur' ? '皮毛' :
                        slotType === 'blood' ? '血液' : '特殊';
    
    // 存储待确认的操作
    gameState.pendingTraitAction = {
        trait: trait,
        species: species,
        slotType: slotType,
        traitIndex: player.hand.findIndex(t => t === trait),
        mode: gameState.actionMode
    };
    
    // 更新确认文本
    let confirmText = '';
    if (gameState.actionMode === 'add') {
        confirmText = `是否确认为 ${species.name} 添加 ${trait.name} 到${slotTypeName}栏位？`;
    } else if (gameState.actionMode === 'replace') {
        const oldTrait = slotType === 'special' ? species.specialTraits[gameState.selectedSpecialSlotIndex] : species.traits[slotType];
        if (oldTrait) {
            confirmText = `是否确认将 ${species.name} 的${slotTypeName}性状 ${oldTrait.name} 替换为 ${trait.name}？`;
        } else {
            confirmText = `是否确认为 ${species.name} 添加 ${trait.name} 到${slotTypeName}栏位？`;
        }
    }
    
    document.getElementById('confirm-operation-text').textContent = confirmText;
    document.getElementById('confirm-trait-panel').classList.remove('hidden');
    
    // 进入确认步骤
    gameState.assignStep = 4;
    
    updateUI();
}

// 确认性状操作
function confirmTraitAction() {
    if (!gameState.pendingTraitAction) return;
    
    const {trait, species, slotType, traitIndex, mode} = gameState.pendingTraitAction;
    
    if (traitIndex === -1) return;
    
    // 从玩家手牌中移除该性状卡
    player.hand.splice(traitIndex, 1);
    
    const slotTypeName = slotType === 'body' ? '体型' :
                        slotType === 'fur' ? '皮毛' :
                        slotType === 'blood' ? '血液' : '特殊';
    
    // 根据操作模式执行不同的操作
    if (mode === 'add' || mode === 'replace') {
        // 如果是替换模式，则不需要检查栏位是否为空
        if (slotType === 'special') {
            // 特殊栏位
            const slotIndex = gameState.selectedSpecialSlotIndex;
            if (species.specialTraits[slotIndex] !== null && mode === 'replace') {
                // 替换特殊栏位的性状，旧性状直接销毁
                const oldTrait = species.specialTraits[slotIndex];
                logMessage(`将 ${species.name} 的特殊性状 ${oldTrait.name} 替换为 ${trait.name}，旧性状已销毁`);
            } else {
                logMessage(`为 ${species.name} 添加了特殊性状: ${trait.name}`);
            }
            species.specialTraits[slotIndex] = trait;
        } else {
            // 常规栏位(body, fur, blood)
            if (species.traits[slotType] !== null && mode === 'replace') {
                // 替换常规栏位的性状，旧性状直接销毁
                const oldTrait = species.traits[slotType];
                logMessage(`将 ${species.name} 的${slotTypeName}性状 ${oldTrait.name} 替换为 ${trait.name}，旧性状已销毁`);
            } else {
                logMessage(`为 ${species.name} 添加了${slotTypeName}性状: ${trait.name}`);
            }
            species.traits[slotType] = trait;
        }
    }
    
    // 消耗一点行动点数
    gameState.actionPoints--;
    logMessage(`剩余行动点数: ${gameState.actionPoints}`);
    
    // 重置状态
    resetTraitSelection();
    
    updateUI();
}

// 取消性状操作
function cancelTraitAction() {
    if (gameState.pendingTraitAction) {
        logMessage('已取消操作');
        // 不消耗行动点，重置状态
        resetTraitSelection();
        updateUI();
    }
}

// 重置性状选择状态
function resetTraitSelection() {
    gameState.selectedSpecies = null;
    gameState.selectedTrait = null;
    gameState.selectedSlotType = null;
    gameState.selectedSpecialSlotIndex = null;
    gameState.actionMode = null;
    gameState.assignStep = 0;
    gameState.showingCompatibleTraits = false;
    gameState.pendingTraitAction = null;
    
    // 隐藏操作面板
    document.getElementById('species-action-panel').classList.add('hidden');
    document.getElementById('confirm-trait-panel').classList.add('hidden');
}

// 进入物种复制模式
function enterDuplicationMode() {
    gameState.revivalMode = true;
    document.getElementById('duplicate-species').classList.add('hidden');
    document.getElementById('next-phase').classList.add('hidden'); // 暂时隐藏下一阶段按钮
    
    // 添加提示信息到UI
    const container = document.getElementById('player-species-container');
    const instructionEl = document.createElement('div');
    instructionEl.id = 'duplication-instruction';
    instructionEl.className = 'instruction-message';
    instructionEl.textContent = '请选择一个要复制的存活物种';
    container.insertAdjacentElement('beforebegin', instructionEl);
    
    logMessage('请选择一个要复制的物种');
    updateUI();
}

// 复制物种
function duplicateSpecies(species) {
    if (!gameState.revivalMode) return;
    
    // 创建新的物种
    const newSpecies = createSpecies(`玩家物种 ${player.species.length + 1}`);
    
    // 复制所有性状
    for (const traitType in species.traits) {
        if (species.traits[traitType]) {
            // 深拷贝以避免引用相同的对象
            newSpecies.traits[traitType] = { ...species.traits[traitType] };
        }
    }
    
    // 复制特殊性状（如果有）
    if (species.specialTraits.some(trait => trait)) {
        newSpecies.specialTraits = { ...species.specialTraits };
    }
    
    // 添加到玩家物种列表
    player.species.push(newSpecies);
    
    logMessage(`成功复制了 ${species.name}，创建了新物种 ${newSpecies.name}`);
    gameState.revivalMode = false;
    gameState.playerDuplicatedThisRound = true; // 标记玩家已完成复制
    
    // 恢复UI元素
    document.getElementById('next-phase').classList.remove('hidden');
    document.getElementById('duplicate-species').classList.add('hidden');
    const instructionEl = document.getElementById('duplication-instruction');
    if (instructionEl) {
        instructionEl.remove();
    }
    
    // 玩家复制完成后，现在处理AI的复苏
    const aiAliveSpecies = ai.species.filter(s => !s.extinct);
    handleAIRevival(aiAliveSpecies);
    
    updateUI();
}

// 选择特殊性状栏位
function selectSpecialSlot(slotIndex, species) {
    if (gameState.phase !== 1 || gameState.assignStep !== 1) return;
    
    // 设置选中的栏位类型为特殊，并记录槽位索引
    gameState.selectedSlotType = 'special';
    gameState.selectedSpecialSlotIndex = slotIndex;
    
    if (gameState.actionMode === 'add') {
        // 进入下一步：选择要添加的特殊性状卡
        gameState.assignStep = 2;
        
        // 显示兼容性状的提示
        gameState.showingCompatibleTraits = true;
        
        logMessage(`已选择特殊性状栏位 ${slotIndex + 1}，请从手牌中选择一张特殊性状卡进行添加`);
        logMessage(`仅显示特殊性状卡，其他卡片已暗显`);
    }
    
    updateUI();
}

// 选择性状栏位
function selectSlot(slotType, species) {
    if (gameState.phase !== 1 || gameState.assignStep !== 1) return;
    
    // 设置选中的栏位类型
    gameState.selectedSlotType = slotType;
    
    // 检查操作类型和栏位状态
    if (gameState.actionMode === 'remove') {
        // 移除性状操作直接执行
        removeTraitFromSlot(species, slotType);
    } else if (gameState.actionMode === 'add' || gameState.actionMode === 'replace') {
        // 进入下一步：选择要添加/替换的性状卡
        gameState.assignStep = 2;
        
        // 显示兼容性状的提示
        gameState.showingCompatibleTraits = true;
        
        // 根据栏位类型，显示不同的提示
        const slotTypeName = slotType === 'body' ? '体型' :
                            slotType === 'fur' ? '皮毛' :
                            slotType === 'blood' ? '血液' : '特殊';
        
        const operationName = gameState.actionMode === 'add' ? '添加到' : '替换';
        logMessage(`已选择${slotTypeName}栏位，请从手牌中选择一张兼容的性状卡进行${operationName}`);
        logMessage(`仅显示与${slotTypeName}栏位兼容的性状卡，其他卡片已暗显`);
    }
    
    updateUI();
}

// 处理AI的复苏逻辑
function handleAIRevival(aiAliveSpecies) {
    // 对AI进行复苏处理
    if (aiAliveSpecies.length >= gameState.maxSpeciesCount) {
        const specialTrait = drawSpecialTrait();
        ai.hand.push(specialTrait);
        logMessage(`AI的物种数量达到最大值（${gameState.maxSpeciesCount}个），获得了一张特殊性状牌: ${specialTrait.name}`);
    } else if (aiAliveSpecies.length > 0) {
        // AI物种少于最大值，自动复制一个存活物种
        const randomSpecies = aiAliveSpecies[Math.floor(Math.random() * aiAliveSpecies.length)];
        
        // 创建新物种并复制性状
        const newSpecies = createSpecies(`AI物种 ${ai.species.length + 1}`);
        
        // 复制所有性状
        for (const traitType in randomSpecies.traits) {
            if (randomSpecies.traits[traitType]) {
                newSpecies.traits[traitType] = { ...randomSpecies.traits[traitType] };
            }
        }
        
        // 复制特殊性状（如果有）
        if (randomSpecies.specialTraits.some(trait => trait)) {
            newSpecies.specialTraits = { ...randomSpecies.specialTraits };
        }
        
        ai.species.push(newSpecies);
        logMessage(`AI复制了物种 ${randomSpecies.name}，创建了新物种 ${newSpecies.name}`);
    }
}

// 智能定位悬浮窗，避免超出屏幕边界
function positionTooltip(tooltip, targetElement) {
    const targetRect = targetElement.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // 先设置基本样式以获取tooltip尺寸
    tooltip.style.position = 'fixed';
    tooltip.style.left = '0px';
    tooltip.style.top = '0px';
    tooltip.style.transform = 'none';
    tooltip.style.opacity = '0';
    tooltip.style.visibility = 'visible';
    
    const tooltipRect = tooltip.getBoundingClientRect();
    const tooltipWidth = tooltipRect.width;
    const tooltipHeight = tooltipRect.height;
    
    // 计算最佳位置
    let left = targetRect.left + targetRect.width / 2 - tooltipWidth / 2;
    let top = targetRect.bottom + 10;
    let arrowPosition = 'top';
    
    // 检查右边界
    if (left + tooltipWidth > viewportWidth - 10) {
        left = viewportWidth - tooltipWidth - 10;
    }
    
    // 检查左边界
    if (left < 10) {
        left = 10;
    }
    
    // 检查下边界 - 如果tooltip会超出屏幕底部，显示在目标上方
    if (top + tooltipHeight > viewportHeight - 10) {
        top = targetRect.top - tooltipHeight - 10;
        arrowPosition = 'bottom';
        
        // 如果上方也放不下，尝试左右两侧
        if (top < 10) {
            // 尝试右侧
            left = targetRect.right + 10;
            top = targetRect.top + targetRect.height / 2 - tooltipHeight / 2;
            arrowPosition = 'left';
            
            // 如果右侧超出边界，尝试左侧
            if (left + tooltipWidth > viewportWidth - 10) {
                left = targetRect.left - tooltipWidth - 10;
                arrowPosition = 'right';
                
                // 如果左侧也超出，就放在屏幕内最佳位置
                if (left < 10) {
                    left = 10;
                    top = Math.max(10, Math.min(viewportHeight - tooltipHeight - 10, targetRect.top));
                    arrowPosition = 'top';
                }
            }
        }
    }
    
    // 应用最终位置
    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
    tooltip.style.transform = 'none';
    tooltip.style.zIndex = '999999';
    
    // 设置箭头位置
    tooltip.style.setProperty('--arrow-position', arrowPosition);
}

// 测试tooltip显示的函数
function testTooltip() {
    const testTooltip = document.createElement('div');
    testTooltip.className = 'trait-tooltip';
    testTooltip.textContent = '测试tooltip - 如果你能看到这个，说明tooltip样式正常';
    testTooltip.style.position = 'fixed';
    testTooltip.style.left = '50%';
    testTooltip.style.top = '50%';
    testTooltip.style.transform = 'translate(-50%, -50%)';
    testTooltip.style.opacity = '1';
    testTooltip.style.visibility = 'visible';
    testTooltip.style.zIndex = '999999';
    testTooltip.style.backgroundColor = 'red'; // 使用红色背景更容易看到
    
    document.body.appendChild(testTooltip);
    
    console.log('Test tooltip created at center of screen');
    console.log('Test tooltip rect:', testTooltip.getBoundingClientRect());
    
    // 5秒后移除测试tooltip
    setTimeout(() => {
        document.body.removeChild(testTooltip);
        console.log('Test tooltip removed');
    }, 5000);
}

// 在游戏开始时调用测试函数
window.testTooltip = testTooltip;
