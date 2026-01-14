class GameState {
    constructor() {
        this.mode = 'play'; // Start directly in play mode (removed settings)

        // Settings State
        this.prefStep = -1; // -1 = Intro, 0..N = Steps
        this.preferences = {}; // Stores (stepId -> selectedOptionId)

        // Play State
        this.playStep = 0; // 0=intro, 1..5=stages, 6=result
        this.selectedWords = [];
        this.combinedSentence = "";
    }

    // --- TAB SWITCHING ---
    switchTab(tabName) {
        if (tabName === 'settings') {
            this.mode = 'settings';
            this.prefStep = -1; // Reset to Intro so Start button shows
        } else {
            this.mode = 'play';
            // Don't reset play state automatically, or maybe do?
            // Let's keep play state unless explicitly restarted
            if (this.playStep === 0) this.playStep = 0;
        }
    }

    // --- SETTINGS LOGIC ---
    getPrefStage() {
        return GAME_DATA.preferences[this.prefStep];
    }

    selectPreference(optionId) {
        const stage = this.getPrefStage();
        this.preferences[stage.id] = optionId;
    }

    nextPrefStep() {
        if (this.prefStep < GAME_DATA.preferences.length - 1) {
            this.prefStep++;
            return 'continue';
        } else {
            return 'finished';
        }
    }

    resetPreferences() {
        this.prefStep = -1; // Reset to Intro
        this.preferences = {};
    }

    // --- PLAY LOGIC ---
    // Stage configurations: defines which steps are included in each stage
    // New structure: Step 1 = noun, Step 2 = color, Step 3 = shape, Step 4 = verb, Step 5 = background
    stageConfigs = {
        1: [0],              // Stage 1: noun only (1 step)
        2: [0, 1],           // Stage 2: noun + color (2 steps)
        3: [0, 1, 2],        // Stage 3: noun + color + shape (3 steps)
        4: [0, 1, 2, 3],     // Stage 4: noun + color + shape + verb (4 steps)
        5: [0, 1, 2, 3, 4]   // Stage 5: noun + color + shape + verb + background (5 steps)
    };

    currentStage = 1;
    currentStageSteps = [];
    currentStepIndex = 0;

    startGame() {
        this.startGameAtStage(1);
    }

    startGameAtStage(stageNumber) {
        this.currentStage = stageNumber;
        this.currentStageSteps = this.stageConfigs[stageNumber] || [0];
        this.currentStepIndex = 0;
        this.playStep = 1; // Move from intro to first stage
        this.selectedWords = [];
    }

    getGameStage() {
        // Get the current step based on currentStageSteps array
        const stepIndex = this.currentStageSteps[this.currentStepIndex];
        return GAME_DATA.stages[stepIndex];
    }

    selectGameOption(option) {
        // Store selected option at current step index
        this.selectedWords[this.currentStepIndex] = option;
    }

    saveCombinedSentence(text) {
        this.combinedSentence = text;
    }

    nextGameStep() {
        if (!this.selectedWords[this.currentStepIndex]) return false; // Must select

        if (this.currentStepIndex < this.currentStageSteps.length - 1) {
            this.currentStepIndex++;
            this.playStep++;
            return 'continue';
        } else {
            this.playStep = 'result'; // Special state
            return 'finished';
        }
    }

    resetGame() {
        this.playStep = 0; // Back to intro
        this.selectedWords = [];
        this.currentStepIndex = 0;
        this.currentStageSteps = [];
    }

    getGameProgress() {
        if (this.playStep === 'result') return 100;
        // 0 (intro) -> 0%
        if (this.playStep === 0) return 0;
        const totalSteps = this.currentStageSteps.length;
        if (totalSteps === 0) return 0;
        return (this.currentStepIndex / totalSteps) * 100;
    }
}

const game = new GameState();
