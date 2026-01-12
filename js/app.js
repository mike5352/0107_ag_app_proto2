// import { aiHandler } from './api.js'; // Global aiHandler used


class AppController {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
        this.render();
    }

    bindEvents() {
        // Stage Selection Buttons (1-5)
        for (let i = 1; i <= 5; i++) {
            const stageBtn = document.getElementById(`start-stage-${i}`);
            if (stageBtn) {
                stageBtn.addEventListener('click', () => {
                    audioManager.resumeAudioContext();
                    audioManager.playClick();
                    game.startGameAtStage(i);
                    this.render();
                });
            }
        }

        // Close/Home Button
        const closeBtn = document.getElementById('close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                audioManager.resumeAudioContext();
                audioManager.playClick();
                game.resetGame();

                // Clean up previous result state
                const imgEl = document.getElementById('final-image');
                if (imgEl) {
                    delete imgEl.dataset.generated;
                    imgEl.style.visibility = 'hidden';
                    imgEl.style.opacity = '0';
                }

                // Reset sentence display
                const sentenceEl = document.getElementById('result-sentence');
                if (sentenceEl) {
                    sentenceEl.style.display = 'none';
                }

                this.render();
            });
        }

        const restartBtn = document.getElementById('restart-btn');
        if (restartBtn) restartBtn.addEventListener('click', () => {
            game.resetGame();

            // Clean up previous result state
            const imgEl = document.getElementById('final-image');
            if (imgEl) {
                delete imgEl.dataset.generated;
            }

            // Reset loading overlay
            const loadingOverlay = document.getElementById('loading-overlay');
            if (loadingOverlay) {
                loadingOverlay.classList.add('hidden');
            }

            this.render();
        });

        // Save button - Download the generated image
        const saveBtn = document.getElementById('save-btn');
        if (saveBtn) saveBtn.addEventListener('click', async () => {
            audioManager.resumeAudioContext();
            audioManager.playClick();

            const imgEl = document.getElementById('final-image');
            if (!imgEl || !imgEl.src || imgEl.src.includes('placeholder')) {
                console.warn('No image to save');
                return;
            }

            try {
                // Fetch the image and convert to blob
                const response = await fetch(imgEl.src);
                const blob = await response.blob();

                // Create download link
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `ai-image-${Date.now()}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);

                console.log('Image saved successfully');
            } catch (error) {
                console.error('Failed to save image:', error);
            }
        });
    }

    startPreferences() {
        game.resetPreferences();
        game.prefStep = 0;
        this.render();
    }

    switchTab(tabName) {
        game.switchTab(tabName);
        this.render();
    }

    render() {
        // Only render play mode (settings removed)
        this.renderPlay();
    }

    // --- SETTINGS RENDERER ---
    renderSettings() {
        const intro = document.getElementById('pref-intro');
        const stepContainer = document.getElementById('pref-step-container');
        const summary = document.getElementById('pref-summary');

        // Helper to hide all first
        [intro, stepContainer, summary].forEach(el => {
            el.classList.add('hidden');
            el.classList.remove('active');
        });

        if (game.prefStep === -1) {
            intro.classList.remove('hidden');
            intro.classList.add('active');
        } else if (game.prefStep < GAME_DATA.preferences.length) {
            stepContainer.classList.remove('hidden');
            stepContainer.classList.add('active');
            this.renderPrefStep();
        } else {
            this.renderPrefSummary();
            summary.classList.remove('hidden');
            summary.classList.add('active');
        }
    }

    renderPrefStep() {
        const stageData = game.getPrefStage();
        if (!stageData) return;

        document.getElementById('pref-question').innerText = stageData.question;
        const grid = document.getElementById('pref-grid');
        grid.innerHTML = '';
        grid.className = 'grid-container grid-5'; // Ensure 5-col

        stageData.options.forEach(opt => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `<img src="${opt.src}"><h3>${opt.label}</h3>`;
            card.addEventListener('click', () => {
                audioManager.resumeAudioContext();
                audioManager.playClick();
                game.selectPreference(opt.id);
                game.nextPrefStep(); // Now returns status but also increments internal step
                this.render();
            });
            grid.appendChild(card);
        });
    }

    renderPrefSummary() {
        const list = document.getElementById('pref-result-list');
        list.innerHTML = '<h3>선택한 스타일:</h3><ul>';
        for (const [key, val] of Object.entries(game.preferences)) {
            // Find label
            // Needed to look up in data, can be complex. Simpler for now:
            list.innerHTML += `<li>${key}: ${val}</li>`;
        }
        list.innerHTML += '</ul>';
    }


    // --- PLAY RENDERER ---
    async renderPlay() {
        const intro = document.getElementById('game-intro');
        const loop = document.getElementById('game-loop');
        const result = document.getElementById('game-result');

        [intro, loop, result].forEach(el => {
            el.classList.add('hidden');
            el.classList.remove('active');
        });

        if (game.playStep === 0) {
            intro.classList.remove('hidden');
            intro.classList.add('active');
        } else if (game.playStep === 'result') {
            result.classList.remove('hidden');
            result.classList.add('active');

            // AI Generation Trigger
            // If we haven't generated yet (check some flag or src), do it.
            // Using placeholder for instant feedback then loading.
            const imgEl = document.getElementById('final-image');
            const textEl = document.getElementById('result-sentence');

            if (!imgEl.dataset.generated) {
                // No text updates - visual only
                imgEl.src = GAME_DATA.result.src;

                // Show loading overlay
                const loadingOverlay = document.getElementById('loading-overlay');
                loadingOverlay.classList.remove('hidden');

                // Display Selected Choices (Visual Summary)
                const choicesContainer = document.getElementById('result-choices');
                choicesContainer.innerHTML = '';
                game.selectedWords.forEach(word => {
                    const choiceDiv = document.createElement('div');
                    choiceDiv.className = 'summary-card';
                    choiceDiv.innerHTML = `
                        <img src="${word.src}" alt="${word.label}">
                        <span>${word.label}</span>
                    `;
                    choicesContainer.appendChild(choiceDiv);
                });

                // Construct Sentence and Prompt...
                // New structure: noun (0), color (1), shape (2), verb (3), background (4)
                console.log("=== DEBUG: Selected Words ===");
                console.log("Total selected words:", game.selectedWords.length);
                game.selectedWords.forEach((w, i) => {
                    console.log(`Word ${i}:`, {
                        label: w.label,
                        engLabel: w.engLabel,
                        sentenceLabel: w.sentenceLabel,
                        id: w.id
                    });
                });

                // Build Korean sentence for display
                // Order: Step5 (background) + Step4 (verb) + Step3 sentenceLabel (shape) + Step2 (color) + Step1 (noun)
                const words = game.selectedWords;
                let koreanSentenceParts = [];

                // Step 5 - background (index 4)
                if (words[4]) koreanSentenceParts.push(words[4].sentenceLabel || words[4].label);
                // Step 4 - verb (index 3)
                if (words[3]) koreanSentenceParts.push(words[3].sentenceLabel || words[3].label);
                // Step 3 - shape sentenceLabel (index 2)
                if (words[2]) koreanSentenceParts.push(words[2].sentenceLabel || words[2].label);
                // Step 2 - color (index 1)
                if (words[1]) koreanSentenceParts.push(words[1].sentenceLabel || words[1].label);
                // Step 1 - noun (index 0)
                if (words[0]) koreanSentenceParts.push(words[0].label);

                const finalSentence = koreanSentenceParts.join(' ');

                console.log("=== Final Combined Sentence (Korean) ===");
                console.log("Sentence:", finalSentence);

                // Display sentence below image
                const sentenceEl = document.getElementById('result-sentence');
                if (sentenceEl) {
                    sentenceEl.textContent = finalSentence;
                    sentenceEl.style.display = 'block';
                }

                // Save combined sentence
                game.saveCombinedSentence(finalSentence);

                // Build English prompt using engLabel
                // Order: noun (0), color (1), shape (2), verb (3), background (4)
                // English sentence: "a [verb] [shape] [color] [noun] [background]"
                let englishPrompt = "a";

                // Add verb if exists (index 3)
                if (words[3]?.engLabel) englishPrompt += ` ${words[3].engLabel}`;
                // Add shape if exists (index 2)
                if (words[2]?.engLabel) englishPrompt += ` ${words[2].engLabel}`;
                // Add color if exists (index 1)
                if (words[1]?.engLabel) englishPrompt += ` ${words[1].engLabel}`;
                // Add noun (index 0) - always exists
                if (words[0]?.engLabel) englishPrompt += ` ${words[0].engLabel}`;
                // Add background if exists (index 4)
                if (words[4]?.engLabel) englishPrompt += ` ${words[4].engLabel}`;

                console.log("=== English Prompt ===");
                console.log("Prompt:", englishPrompt);

                // 1. Add style suffix
                let prompt = englishPrompt + ", surreal cartoon scene";
                console.log("Final prompt with style:", prompt);

                // No text updates - visual only

                if (prompt) {

                    // 2. Generate Image URL
                    const imageUrl = aiHandler.getPollinationsUrl(prompt);
                    console.log("Image URL:", imageUrl);

                    // Save to Data
                    GAME_DATA.result.src = imageUrl;

                    // Hide image while loading (no frame visible)
                    imgEl.style.opacity = '0';
                    imgEl.style.visibility = 'hidden';

                    // 3. Update DOM - Load image and hide loading overlay when complete
                    imgEl.onload = () => {
                        loadingOverlay.classList.add('hidden');
                        imgEl.style.visibility = 'visible';
                        imgEl.style.opacity = '1';
                        imgEl.dataset.generated = "true";
                    };

                    imgEl.onerror = () => {
                        loadingOverlay.classList.add('hidden');
                        imgEl.style.opacity = '1';
                        console.error("Image failed to load");
                        // No text updates - visual only
                    };

                    imgEl.src = imageUrl;
                } else {
                    console.error("Prompt generation failed (returned null)");
                    loadingOverlay.classList.add('hidden');
                    // No text updates - visual only
                    imgEl.src = 'https://via.placeholder.com/600x400?text=Error:+Check+API+Key';
                }
            }

        } else {
            loop.classList.remove('hidden');
            loop.classList.add('active');
            this.renderGameLoop();
        }
    }

    renderGameLoop() {
        const stageData = game.getGameStage();
        if (!stageData) return;

        document.getElementById('game-instruction').innerText = stageData.question;
        document.getElementById('progress-fill').style.width = game.getGameProgress() + '%';

        // Render previous choices
        const previousChoicesContainer = document.getElementById('previous-choices');
        previousChoicesContainer.innerHTML = '';

        if (game.selectedWords.length > 0) {
            game.selectedWords.forEach((word) => {
                if (word) {
                    const choiceDiv = document.createElement('div');
                    choiceDiv.className = 'summary-card'; // Reuse result screen style
                    choiceDiv.innerHTML = `
                        <img src="${word.src}" alt="${word.label}">
                        <span>${word.label}</span>
                    `;
                    previousChoicesContainer.appendChild(choiceDiv);
                }
            });
        }

        const grid = document.getElementById('game-grid');
        grid.innerHTML = '';

        stageData.choices.forEach(choice => {
            const card = document.createElement('div');
            card.className = 'card';

            // Step 3 (shape)일 때 특별 클래스 추가
            if (stageData.id === 'step3_shape') {
                card.classList.add('card-step3');
            }

            // Step 5 (background)일 때 특별 클래스 추가
            if (stageData.id === 'step5_background') {
                card.classList.add('card-step5');
            }

            // Highlight if selected (though we auto-advance)
            // const isSelected = ...
            card.innerHTML = `
                <img src="${choice.src}">
                <span class="card-label">${choice.label}</span>
            `;
            card.title = choice.label; // Tooltip for accessibility/debugging
            card.addEventListener('click', () => {
                audioManager.resumeAudioContext();
                audioManager.playClick();

                game.selectGameOption(choice);
                card.classList.add('selected');
                setTimeout(() => {
                    audioManager.playSuccess(); // Step complete sound
                    game.nextGameStep();
                    this.render();
                }, 400);
            });

            grid.appendChild(card);
        });
    }
}

const app = new AppController();
