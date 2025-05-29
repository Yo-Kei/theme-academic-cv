/**
 * Language system for Clash of Species
 * This module contains all text content in different languages
 */

// Current language setting
let currentLanguage = 'zh-CN';

// Language definitions
const languages = {
    'zh-CN': {
        name: '简体中文',
        // Game title and basic UI
        gameTitle: '物种冲突',
        gameTitleEn: 'Clash of Species',
        selectLanguage: '选择语言/Select Language',
        startGame: '开始游戏',
        newGame: '新游戏',
        nextPhase: '下一阶段',
        maxSpecies: '最大物种数量',
        speciesCount: '个物种',
        
        // Player names
        player: '玩家',
        ai: 'AI',
        playerSpecies: '玩家物种',
        playerHand: '玩家手牌',
        handCount: '手牌',
        cardUnit: '张',
        
        // Game phases
        phases: {
            draw: '抽牌阶段',
            assign: '性状分配阶段', 
            extinction: '灭绝阶段',
            revival: '复苏阶段',
            discard: '弃牌阶段'
        },
        
        // Game controls
        round: '回合',
        actionPoints: '行动点数',
        gameLog: '游戏日志',
        gameControl: '游戏控制',
        environment: '环境',
        
        // Environment system
        climateState: '气候状态',
        temperatureChange: '温度变化',
        environmentType: '环境类型',
        severity: '严峻程度',
        climateStates: {
            '大冰室期': '大冰室期',
            '冰室期': '冰室期',
            '缓和期': '缓和期',
            '温室期': '温室期',
            '大温室期': '大温室期'
        },
        temperatureChanges: {
            'hot': '升温',
            'cold': '降温'
        },
        environmentTypes: {
            'hot': '炎热',
            'cold': '寒冷'
        },
        
        // Trait slots
        slotTypes: {
            'body': '体型',
            'fur': '皮毛', 
            'blood': '血液',
            'special': '特殊'
        },
        
        // Adaptability display
        adaptability: {
            'hot': '热',
            'cold': '冷'
        },
        
        // Traits
        traits: {
            bigBody: '大体型',
            bigBodyDesc: '大体型可以大大增加寒冷环境的适应性，但是会降低炎热环境的适应性',
            smallBody: '小体型',
            smallBodyDesc: '小体型稍微增加炎热环境的适应性',
            thickFur: '厚皮毛',
            thickFurDesc: '厚皮毛可以大大增加寒冷环境的适应性，但是会降低炎热环境的适应性',
            thinSkin: '薄皮肤',
            thinSkinDesc: '薄皮肤可以大大增加炎热环境的适应性，但是会降低寒冷环境的适应性',
            warmBlood: '温血',
            warmBloodDesc: '温血可以增加寒冷环境的适应性',
            coldBlood: '冷血',
            coldBloodDesc: '冷血可以增加炎热环境的适应性，但是会降低寒冷环境的适应性',
            fastBreeding: '快速繁衍',
            fastBreedingDesc: '快速繁衍，每轮可为玩家增加1次性状修改机会',
            adaptation: '广泛适应',
            adaptationDesc: '广泛适应，每个环境的适应性+1',
            disaster: '灾难物种',
            disasterDesc: '灾难物种，能免疫一次灭绝',
            disasterUsed: '灾难物种（已使用）',
            disasterUsedDesc: '已触发过灭绝免疫的灾难物种，无额外效果'
        },
        
        // Actions
        actions: {
            selectAction: '选择操作',
            addTrait: '添加性状',
            replaceTrait: '替换性状',
            removeTrait: '移除性状',
            cancel: '取消',
            confirm: '确认',
            confirmAction: '确认操作',
            confirmOperation: '是否确认此操作？',
            duplicateSpecies: '复制物种',
            confirmSkipDuplication: '确认放弃复制',
            skipDuplication: '确定放弃',
            continueDuplication: '继续复制',
            gameEnded: '游戏已结束',
            confirmDiscard: '确认弃牌',
            confirmDiscardCount: '确认弃牌 ({selected}/{needed})'
        },
        
        // Messages
        messages: {
            gameStart: '游戏开始！每位玩家有{count}个初始物种。',
            speciesCreated: '创建了{name}，初始特征：{traits}',
            phaseStart: '开始{phase}',
            playerTurn: '玩家回合',
            aiTurn: 'AI回合',
            extinctionCheck: '正在检查灭绝...',
            speciesExtinct: '{species}因为适应性过低而灭绝！',
            speciesRevived: '复活了物种：{species}',
            gameEnd: '游戏结束！',
            playerWin: '玩家获胜！',
            aiWin: 'AI获胜！',
            draw: '平局！',
            discardCards: '请选择要弃掉的卡牌',
            traitAdded: '为{species}添加了性状：{trait}',
            traitReplaced: '为{species}替换了性状：{trait}',
            traitRemoved: '为{species}移除了性状：{trait}',
            noValidTraits: '没有符合条件的性状卡',
            selectSpecies: '请选择一个物种',
            selectSlot: '请选择栏位类型',
            selectCompatibleTrait: '请选择与栏位兼容的性状',
            actionPointsUsed: '行动点数已用完',
            climateDrawn: '抽取气候状态：{climate}',
            temperatureDrawn: '抽取温度变化：{temperature}',
            environmentResult: '最终环境：{type}，严峻程度：{severity}',
            duplicatedSpecies: '复制了{species}',
            
            // Additional game messages
            drawPhaseStart: '===== 抽牌阶段 =====',
            assignPhaseStart: '===== 性状分配阶段 =====',
            extinctionPhaseStart: '===== 灭绝阶段 =====',
            revivalPhaseStart: '===== 复苏阶段 =====',
            discardPhaseStart: '===== 弃牌阶段 =====',
            actionPointsExhausted: '你的行动点数已用完，无法再进行操作',
            completeCurrentAction: '请完成当前操作或取消后再选择其他物种',
            speciesSelected: '已选择 {species}，请选择要执行的操作',
            cannotCopyExtinct: '无法复制已灭绝的物种',
            selectSlotForRemove: '请选择要移除性状的栏位（注意：特殊性状不能被移除）',
            selectSpeciesFirst: '请先选择物种',
            selectSlotForAdd: '请选择要添加性状的栏位（只能选择空栏位）',
            selectSlotForReplace: '请选择要替换性状的栏位（注意：特殊性状不能被替换）',
            
            // AI messages
            aiNoValidActions: 'AI 没有找到任何可执行的操作，提前结束分配阶段',
            aiActionsUsed: 'AI 使用了 {points} 点行动点数，进行了以下操作:',
            aiActionItem: '- {action}',
            aiNoActions: 'AI 没有进行任何性状分配操作',
            aiAssigning: 'AI正在分配性状...',
            
            // Card drawing messages
            climateCardDrawn: '主持人抽取了气候状态卡: {card}',
            temperatureCardDrawn: '主持人抽取了温度变化卡: {card}',
            playerCardsDrawn: '你抽取了 {count} 张性状卡',
            aiCardsDrawn: 'AI 抽取了 {count} 张性状卡',
            
            // Assignment phase messages
            fastBreedingBonus: '你有 {count} 个物种装备了"快速繁衍"特殊性状，额外获得 {count} 点行动点数',
            playerAssignInstructions: '玩家分配阶段：请按照以下步骤操作:',
            step1: '1. 选择一个物种',
            step2: '2. 选择要执行的操作类型（添加/替换/移除）',
            step3: '3. 选择要操作的栏位',
            step4: '4. 选择要使用的手牌（添加/替换操作需要）',
            actionPointsInfo: '你有 {total} 点行动点数（{species}个存活物种 + {bonus}个特殊性状加成），每次操作消耗1点',
            clickNextPhase: '完成后点击"下一阶段"按钮',
            assignmentComplete: '所有玩家已完成性状分配，结果已展示',
            
            // Extinction phase messages
            extinctsCleared: '已清理灭绝的物种',
            diceResult: '主持人掷骰结果: {result}',
            climateEffect: '气候状态"{climate}"对{environment}环境的影响: {description}',
            finalEnvironment: '最终环境: {type}, 严峻程度: {severity} ({dice} {effect})',
            environmentNeutralized: '环境被气候状态完全抵消，无物种灭绝！',
            disasterTraitActivated: '你的物种 {species} 的"灾难物种"特性触发，免疫了一次灭绝！适应性: {adaptability}',
            speciesExtinctPlayer: '你的物种 {species} 灭绝了！适应性: {adaptability}',
            speciesSurvived: '你的物种 {species} 存活，适应性: {adaptability}',
            aiDisasterTraitActivated: 'AI的物种 {species} 的"灾难物种"特性触发，免疫了一次灭绝！适应性: {adaptability}',
            aiSpeciesExtinct: 'AI的物种 {species} 灭绝了！适应性: {adaptability}',
            aiSpeciesSurvived: 'AI的物种 {species} 存活，适应性: {adaptability}',
            
            // Game end messages
            bothExtinct: '双方都已完全灭绝！游戏结束，平局！',
            playerTotalExtinct: '你已经完全灭绝！游戏结束，AI获胜！',
            aiTotalExtinct: 'AI已经完全灭绝！游戏结束，你获胜！',
            
            // Revival phase messages
            maxSpeciesReached: '你的物种数量达到最大值（{max}个），获得了一张特殊性状牌: {trait}',
            maxSpeciesNoTrait: '你的物种数量达到最大值（{max}个），但没有可用的特殊性状牌',
            canCopySpecies: '你可以复制一个存活的物种。点击"复制物种"按钮开始选择。',
            aiMaxSpeciesReached: 'AI的物种数量达到最大值（{max}个），获得了一张特殊性状牌: {trait}',
            aiMaxSpeciesNoTrait: 'AI的物种数量达到最大值（{max}个），但没有可用的特殊性状牌',
            aiCopiedSpecies: 'AI复制了物种 {original}，创建了新物种 {new}',
            
            // Discard phase messages
            needToDiscard: '你需要弃掉至少 {count} 张性状卡',
            clickToDiscard: '请点击要弃掉的性状卡，然后点击"确认弃牌"按钮',
            aiDiscarded: 'AI 弃掉了 {count} 张性状卡',
            mustDiscardMore: '你必须至少弃掉 {need} 张性状卡，当前只选择了 {selected} 张',
            continueSelecting: '请继续选择要弃掉的性状卡',
            playerDiscarded: '你弃掉了 {count} 张性状卡',
            roundEnd: '回合 {round} 结束',
            
            // Other action messages
            operationCancelled: '已取消当前操作',
            skipCopyDecision: '你选择放弃复制物种的机会',
            cancelNextPhase: '已取消进入下一阶段，你可以继续选择复制物种',
            specialTraitCannotRemove: '特殊性状不能被移除！',
            emptySlotCannotRemove: '该栏位没有性状可移除',
            traitRemovedFrom: '从 {species} 移除了{type}性状: {trait}',
            remainingActionPoints: '剩余行动点数: {points}',
            errorNoSpeciesOrSlot: '错误: 未选择物种或栏位',
            actionPointsEmpty: '你的行动点数已经用完了',
            specialTraitReplaced: '将 {species} 的特殊性状 {old} 替换为 {new}，旧性状已销毁',
            specialTraitAdded: '为 {species} 添加了特殊性状: {trait}',
            traitReplacedSlot: '将 {species} 的{slot}性状 {old} 替换为 {new}，旧性状已销毁',
            traitAddedSlot: '为 {species} 添加了{slot}性状: {trait}',
            operationCancelledAction: '已取消操作',
            selectSpeciesToCopy: '请选择一个要复制的物种',
            copySuccess: '成功复制了 {original}，创建了新物种 {new}',
            selectedSpecialSlot: '已选择特殊性状栏位 {slot}，请从手牌中选择一张特殊性状卡进行添加',
            onlySpecialCardsShown: '仅显示特殊性状卡，其他卡片已暗显',
            selectedSlot: '已选择{slot}栏位，请从手牌中选择一张兼容的性状卡进行{operation}',
            onlyCompatibleShown: '仅显示与{slot}栏位兼容的性状卡，其他卡片已暗显',
            
            // Additional missing keys
            playerSpecies: '玩家物种 {count}',
            aiSpecies: 'AI物种 {count}',
            operationCancelled: '已取消操作',
            aiAddedTrait: '为 {species} 添加{slotType}性状: {trait}',
            aiReplacedTrait: '将 {species} 的{slotType}性状 {oldTrait} 替换为 {newTrait}',
            specialTraitCannotBeModified: '特殊性状不能被{action}！\n特殊性状一旦装上就是永久的。',
            
            // Climate effects
            noClimateEffect: '无气候影响',
            iceEffect: '冰室效应',
            greenhouseEffect: '温室效应',
            
            // Confirmation dialog
            duplicateConfirmText: '你当前有 {current} 个存活物种，可以复制一个物种增加到 {next} 个。\n\n确定要放弃复制物种的机会吗？',
            confirmRemoveText: 'Are you sure to remove {type} trait from {species}: {trait}?',
            confirmAddText: 'Are you sure to add {trait} to {species} {slot} slot?',
            confirmReplaceText: 'Are you sure to replace {species} {slot} trait {oldTrait} with {newTrait}?'
        },
        
        // Environments
        environments: {
            majorIceAge: '大冰室期',
            majorIceAgeDesc: '在灭绝阶段为寒冷环境提供+2剧烈程度',
            iceAge: '冰室期',
            iceAgeDesc: '在灭绝阶段为寒冷环境提供+1剧烈程度',
            moderate: '缓和期',
            moderateDesc: '在灭绝阶段不提供额外剧烈程度',
            greenhouse: '温室期',
            greenhouseDesc: '在灭绝阶段为炎热环境提供+1剧烈程度',
            majorGreenhouse: '大温室期',
            majorGreenhouseDesc: '在灭绝阶段为炎热环境提供+2剧烈程度',
            warming: '升温',
            warmingDesc: '环境趋向炎热',
            cooling: '降温',
            coolingDesc: '环境趋向寒冷'
        },
        
        // UI elements
        ui: {
            emptySlot: '空栏位',
            extinct: '灭绝'
        },
        
        // Debug
        debug: {
            testTooltip: '测试tooltip - 如果你能看到这个，说明tooltip样式正常'
        }
    },
    
    'en-US': {
        name: 'English',
        // Game title and basic UI
        gameTitle: '物种冲突',
        gameTitleEn: 'Clash of Species',
        selectLanguage: '选择语言/Select Language',
        startGame: 'Start Game',
        newGame: 'New Game', 
        nextPhase: 'Next Phase',
        maxSpecies: 'Max Species Count',
        speciesCount: ' Species',
        
        // Player names
        player: 'Player',
        ai: 'AI',
        playerSpecies: 'Player Species',
        playerHand: 'Player Hand',
        handCount: 'Hand',
        cardUnit: ' cards',
        
        // Game phases
        phases: {
            draw: 'Draw Phase',
            assign: 'Trait Assignment Phase',
            extinction: 'Extinction Phase', 
            revival: 'Revival Phase',
            discard: 'Discard Phase'
        },
        
        // Game controls
        round: 'Round',
        actionPoints: 'Action Points',
        gameLog: 'Game Log',
        gameControl: 'Game Control',
        environment: 'Environment',
        
        // Environment system
        climateState: 'Climate State',
        temperatureChange: 'Temperature Change',
        environmentType: 'Environment Type',
        severity: 'Severity',
        climateStates: {
            '大冰室期': 'Major Ice Age',
            '冰室期': 'Ice Age',
            '缓和期': 'Moderate Period',
            '温室期': 'Greenhouse Period',
            '大温室期': 'Major Greenhouse Period'
        },
        temperatureChanges: {
            'hot': 'Warming',
            'cold': 'Cooling'
        },
        environmentTypes: {
            'hot': 'Hot',
            'cold': 'Cold'
        },
        
        // Trait slots
        slotTypes: {
            'body': 'Body Size',
            'fur': 'Fur/Skin',
            'blood': 'Blood Type', 
            'special': 'Special'
        },
        
        // Adaptability display
        adaptability: {
            'hot': 'Hot',
            'cold': 'Cold'
        },
        
        // Traits
        traits: {
            bigBody: 'Large Body',
            bigBodyDesc: 'Large body greatly increases cold environment adaptability, but decreases hot environment adaptability',
            smallBody: 'Small Body',
            smallBodyDesc: 'Small body slightly increases hot environment adaptability',
            thickFur: 'Thick Fur',
            thickFurDesc: 'Thick fur greatly increases cold environment adaptability, but decreases hot environment adaptability',
            thinSkin: 'Thin Skin',
            thinSkinDesc: 'Thin skin greatly increases hot environment adaptability, but decreases cold environment adaptability',
            warmBlood: 'Warm Blood',
            warmBloodDesc: 'Warm blood increases cold environment adaptability',
            coldBlood: 'Cold Blood',
            coldBloodDesc: 'Cold blood increases hot environment adaptability, but decreases cold environment adaptability',
            fastBreeding: 'Fast Breeding',
            fastBreedingDesc: 'Fast breeding, grants player 1 additional trait modification opportunity each round',
            adaptation: 'Wide Adaptation',
            adaptationDesc: 'Wide adaptation, +1 adaptability to each environment',
            disaster: 'Disaster Species',
            disasterDesc: 'Disaster species, immune to one extinction event',
            disasterUsed: 'Disaster Species (Used)',
            disasterUsedDesc: 'Disaster species that has already triggered extinction immunity, no additional effects'
        },
        
        // Actions
        actions: {
            selectAction: 'Select Action',
            addTrait: 'Add Trait',
            replaceTrait: 'Replace Trait',
            removeTrait: 'Remove Trait',
            cancel: 'Cancel',
            confirm: 'Confirm',
            confirmAction: 'Confirm Action',
            confirmOperation: 'Are you sure about this operation?',
            duplicateSpecies: 'Duplicate Species',
            confirmSkipDuplication: 'Confirm Skip Duplication',
            skipDuplication: 'Skip Duplication',
            continueDuplication: 'Continue Duplication',
            gameEnded: 'Game Ended',
            confirmDiscard: 'Confirm Discard',
            confirmDiscardCount: 'Confirm Discard ({selected}/{needed})'
        },
        
        // Messages
        messages: {
            gameStart: 'Game started! Each player has {count} initial species.',
            speciesCreated: 'Created {name} with initial traits: {traits}',
            phaseStart: 'Starting {phase}',
            playerTurn: 'Player Turn',
            aiTurn: 'AI Turn',
            extinctionCheck: 'Checking for extinction...',
            speciesExtinct: '{species} went extinct due to low adaptability!',
            speciesRevived: 'Revived species: {species}',
            gameEnd: 'Game Over!',
            playerWin: 'Player Wins!',
            aiWin: 'AI Wins!',
            draw: 'Draw!',
            discardCards: 'Please select cards to discard',
            traitAdded: 'Added trait {trait} to {species}',
            traitReplaced: 'Replaced trait {trait} for {species}',
            traitRemoved: 'Removed trait {trait} from {species}',
            noValidTraits: 'No compatible trait cards available',
            selectSpecies: 'Please select a species',
            selectSlot: 'Please select slot type',
            selectCompatibleTrait: 'Please select a compatible trait for the slot',
            actionPointsUsed: 'All action points used',
            climateDrawn: 'Drew climate state: {climate}',
            temperatureDrawn: 'Drew temperature change: {temperature}',
            environmentResult: 'Final environment: {type}, Severity: {severity}',
            duplicatedSpecies: 'Duplicated {species}',
            
            // Additional game messages
            drawPhaseStart: '===== Draw Phase =====',
            assignPhaseStart: '===== Trait Assignment Phase =====',
            extinctionPhaseStart: '===== Extinction Phase =====',
            revivalPhaseStart: '===== Revival Phase =====',
            discardPhaseStart: '===== Discard Phase =====',
            actionPointsExhausted: 'Your action points are exhausted, you cannot perform any more actions',
            completeCurrentAction: 'Please complete the current action or cancel and choose another species',
            speciesSelected: 'Selected {species}, please select the action to perform',
            cannotCopyExtinct: 'Cannot duplicate extinct species',
            selectSlotForRemove: 'Please select the slot to remove the trait (note: special traits cannot be removed)',
            selectSpeciesFirst: 'Please select a species first',
            selectSlotForAdd: 'Please select the slot to add the trait (only empty slots can be selected)',
            selectSlotForReplace: 'Please select the slot to replace the trait (note: special traits cannot be replaced)',
            
            // AI messages
            aiNoValidActions: 'AI found no valid actions, ending allocation phase early',
            aiActionsUsed: 'AI used {points} action points and performed the following actions:',
            aiActionItem: '- {action}',
            aiNoActions: 'AI performed no trait allocation actions',
            aiAssigning: 'AI is allocating traits...',
            
            // Card drawing messages
            climateCardDrawn: 'Host drew climate state card: {card}',
            temperatureCardDrawn: 'Host drew temperature change card: {card}',
            playerCardsDrawn: 'You drew {count} trait cards',
            aiCardsDrawn: 'AI drew {count} trait cards',
            
            // Assignment phase messages
            fastBreedingBonus: 'You have {count} species equipped with "Fast Breeding" special trait, extra {count} action points',
            playerAssignInstructions: 'Player allocation phase: Please follow these steps:',
            step1: '1. Select a species',
            step2: '2. Select the action type to perform (add/replace/remove)',
            step3: '3. Select the slot to operate',
            step4: '4. Select the hand card to use (add/replace actions require)',
            actionPointsInfo: 'You have {total} action points ({species} living species + {bonus} special trait bonus), each operation consumes 1 point',
            clickNextPhase: 'Click "Next Phase" button to complete',
            assignmentComplete: 'All players have completed trait allocation, results are displayed',
            
            // Extinction phase messages
            extinctsCleared: 'Extinct species cleared',
            diceResult: 'Host rolled dice result: {result}',
            climateEffect: 'Climate state "{climate}" effect on {environment} environment: {description}',
            finalEnvironment: 'Final environment: {type}, Severity: {severity} ({dice} {effect})',
            environmentNeutralized: 'Environment neutralized by climate state, no species extinct!',
            disasterTraitActivated: 'Your species {species} "Disaster Species" trait activated, immune to one extinction! Adaptability: {adaptability}',
            speciesExtinctPlayer: 'Your species {species} extinct! Adaptability: {adaptability}',
            speciesSurvived: 'Your species {species} survived, Adaptability: {adaptability}',
            aiDisasterTraitActivated: 'AI species {species} "Disaster Species" trait activated, immune to one extinction! Adaptability: {adaptability}',
            aiSpeciesExtinct: 'AI species {species} extinct! Adaptability: {adaptability}',
            aiSpeciesSurvived: 'AI species {species} survived, Adaptability: {adaptability}',
            
            // Game end messages
            bothExtinct: 'Both sides extinct! Game over, draw!',
            playerTotalExtinct: 'You are completely extinct! Game over, AI wins!',
            aiTotalExtinct: 'AI is completely extinct! Game over, you win!',
            
            // Revival phase messages
            maxSpeciesReached: 'Your species count reached maximum ({max} species), received a special trait card: {trait}',
            maxSpeciesNoTrait: 'Your species count reached maximum ({max} species), but no available special trait cards',
            canCopySpecies: 'You can duplicate a living species. Click "Duplicate Species" button to start selection.',
            aiMaxSpeciesReached: 'AI species count reached maximum ({max} species), received a special trait card: {trait}',
            aiMaxSpeciesNoTrait: 'AI species count reached maximum ({max} species), but no available special trait cards',
            aiCopiedSpecies: 'AI duplicated species {original}, created new species {new}',
            
            // Discard phase messages
            needToDiscard: 'You need to discard at least {count} trait cards',
            clickToDiscard: 'Please click the trait card to discard, then click "Confirm Discard" button',
            aiDiscarded: 'AI discarded {count} trait cards',
            mustDiscardMore: 'You must discard at least {need} trait cards, currently selected {selected} cards',
            continueSelecting: 'Please continue selecting trait cards to discard',
            playerDiscarded: 'You discarded {count} trait cards',
            roundEnd: 'Round {round} ended',
            
            // Other action messages
            operationCancelled: 'Current operation cancelled',
            skipCopyDecision: 'You chose to skip the duplicate species opportunity',
            cancelNextPhase: 'Current phase cancellation, you can continue to duplicate species',
            specialTraitCannotRemove: 'Special trait cannot be removed!',
            emptySlotCannotRemove: 'No trait to remove in this slot',
            traitRemovedFrom: 'Removed {type} trait from {species}: {trait}',
            remainingActionPoints: 'Remaining action points: {points}',
            errorNoSpeciesOrSlot: 'Error: No species or slot selected',
            actionPointsEmpty: 'Your action points are exhausted',
            specialTraitReplaced: 'Replaced {species} special trait {old} with {new}, old trait destroyed',
            specialTraitAdded: 'Added special trait to {species}: {trait}',
            traitReplacedSlot: 'Replaced {species} {slot} trait {old} with {new}, old trait destroyed',
            traitAddedSlot: 'Added {slot} trait to {species}: {trait}',
            operationCancelledAction: 'Current operation cancelled',
            selectSpeciesToCopy: 'Please select a species to duplicate',
            copySuccess: 'Successfully duplicated {original}, created new species {new}',
            selectedSpecialSlot: 'Selected special trait slot {slot}, please select a special trait card from your hand to add',
            onlySpecialCardsShown: 'Only show special trait cards, other cards are hidden',
            selectedSlot: 'Selected {slot} slot, please select a compatible trait card from your hand to {operation}',
            onlyCompatibleShown: 'Only show compatible trait cards for {slot} slot, other cards are hidden',
            
            // Additional missing keys
            playerSpecies: 'Player species {count}',
            aiSpecies: 'AI species {count}',
            operationCancelled: 'Current operation cancelled',
            aiAddedTrait: 'Added {slotType} trait to {species}: {trait}',
            aiReplacedTrait: 'Replaced {species} {slotType} trait {oldTrait} with {newTrait}',
            specialTraitCannotBeModified: 'Special traits cannot be {action}!\nSpecial traits are permanent once installed.',
            
            // Climate effects
            noClimateEffect: 'No climate effect',
            iceEffect: 'Ice Age effect',
            greenhouseEffect: 'Greenhouse effect',
            
            // Confirmation dialog
            duplicateConfirmText: 'You currently have {current} living species, you can duplicate a species to {next} species.\n\nAre you sure you want to skip the duplicate species opportunity?',
            confirmRemoveText: 'Are you sure to remove {type} trait from {species}: {trait}?',
            confirmAddText: 'Are you sure to add {trait} to {species} {slot} slot?',
            confirmReplaceText: 'Are you sure to replace {species} {slot} trait {oldTrait} with {newTrait}?'
        },
        
        // Environments
        environments: {
            majorIceAge: 'Major Ice Age',
            majorIceAgeDesc: 'Provides +2 severity in cold environments during extinction phase',
            iceAge: 'Ice Age',
            iceAgeDesc: 'Provides +1 severity in cold environments during extinction phase',
            moderate: 'Moderate Period',
            moderateDesc: 'Does not provide additional severity during extinction phase',
            greenhouse: 'Greenhouse Period',
            greenhouseDesc: 'Provides +1 severity in hot environments during extinction phase',
            majorGreenhouse: 'Major Greenhouse Period',
            majorGreenhouseDesc: 'Provides +2 severity in hot environments during extinction phase',
            warming: 'Warming',
            warmingDesc: 'Environment trending towards hot',
            cooling: 'Cooling',
            coolingDesc: 'Environment trending towards cold'
        },
        
        // UI elements
        ui: {
            emptySlot: 'Empty Slot',
            extinct: 'Extinct'
        },
        
        // Debug
        debug: {
            testTooltip: 'Test tooltip - if you can see this, tooltip style is working'
        }
    }
};

// Language utility functions
function setLanguage(lang) {
    if (languages[lang]) {
        currentLanguage = lang;
        localStorage.setItem('cos-language', lang);
        return true;
    }
    return false;
}

function getCurrentLanguage() {
    return currentLanguage;
}

function getText(key) {
    const keys = key.split('.');
    let value = languages[currentLanguage];
    
    for (const k of keys) {
        if (value && typeof value === 'object') {
            value = value[k];
        } else {
            return key; // Return key if translation not found
        }
    }
    
    return value || key;
}

function formatMessage(key, params = {}) {
    let message = getText(key);
    for (const [param, value] of Object.entries(params)) {
        message = message.replace(new RegExp(`\\{${param}\\}`, 'g'), value);
    }
    return message;
}

// Initialize language from localStorage
function initLanguage() {
    const savedLang = localStorage.getItem('cos-language');
    if (savedLang && languages[savedLang]) {
        currentLanguage = savedLang;
    }
}

// Update UI text for current language
function updateLanguageUI() {
    // Update HTML title
    document.title = getText('gameTitle') + (getText('gameTitleEn') ? ' - ' + getText('gameTitleEn') : '');
    
    // Update page language attribute
    document.documentElement.lang = currentLanguage;
    
    // This function will be called after UI elements are created
    // to update their text content based on current language
}

// Export functions globally
window.setLanguage = setLanguage;
window.getCurrentLanguage = getCurrentLanguage;
window.getText = getText;
window.formatMessage = formatMessage;
window.initLanguage = initLanguage;
window.updateLanguageUI = updateLanguageUI;
window.languages = languages; 