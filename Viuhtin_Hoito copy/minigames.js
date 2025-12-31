/**
 * VIUHTIN HOITO - Minipelit
 * Interaktiiviset hoitotoimenpiteet
 */

// ============================================
// Mini-game Manager
// ============================================

class MiniGameManager {
    constructor() {
        this.currentGame = null;
        this.overlay = null;
        this.gameContainer = null;
        this.onComplete = null;
        this.createOverlay();
    }

    createOverlay() {
        // Luo overlay-elementti minipeleille
        this.overlay = document.createElement('div');
        this.overlay.className = 'minigame-overlay hidden';
        this.overlay.innerHTML = `
            <div class="minigame-container">
                <div class="minigame-header">
                    <h2 id="minigame-title">Minipeli</h2>
                    <button id="minigame-close" class="minigame-close">✕</button>
                </div>
                <div class="minigame-instructions" id="minigame-instructions"></div>
                <div class="minigame-area" id="minigame-area"></div>
                <div class="minigame-progress">
                    <div class="minigame-progress-bar" id="minigame-progress"></div>
                </div>
                <div class="minigame-score" id="minigame-score"></div>
            </div>
        `;
        document.body.appendChild(this.overlay);

        this.gameContainer = this.overlay.querySelector('#minigame-area');

        // Close button
        this.overlay.querySelector('#minigame-close').addEventListener('click', () => {
            this.closeGame();
        });
    }

    showGame(title, instructions) {
        this.overlay.querySelector('#minigame-title').textContent = title;
        this.overlay.querySelector('#minigame-instructions').textContent = instructions;
        this.overlay.querySelector('#minigame-progress').style.width = '0%';
        this.overlay.querySelector('#minigame-score').textContent = '';
        this.gameContainer.innerHTML = '';
        this.overlay.classList.remove('hidden');
    }

    updateProgress(percent) {
        this.overlay.querySelector('#minigame-progress').style.width = `${percent}%`;
    }

    showScore(text) {
        this.overlay.querySelector('#minigame-score').textContent = text;
    }

    closeGame() {
        this.overlay.classList.add('hidden');
        this.gameContainer.innerHTML = '';
        this.currentGame = null;
    }

    completeGame(success, bonusPoints = 0) {
        if (this.onComplete) {
            this.onComplete(success, bonusPoints);
        }
        setTimeout(() => this.closeGame(), 1500);
    }
}

// Global instance
const miniGameManager = new MiniGameManager();

// ============================================
// Harjaus-minipeli (Brushing)
// ============================================

class BrushingGame {
    constructor(manager) {
        this.manager = manager;
        this.brushStrokes = 0;
        this.requiredStrokes = 15;
        this.lastY = 0;
        this.isDragging = false;
    }

    start(onComplete) {
        this.manager.onComplete = onComplete;
        this.manager.showGame('🪮 Harjaa Viuhtia!', 'Vedä harjaa ylös ja alas turkin päällä');
        this.brushStrokes = 0;

        const area = this.manager.gameContainer;
        area.innerHTML = `
            <div class="brush-game">
                <div class="brush-viuhti">
                    <img src="assets/viuhti_happy.png" alt="Viuhti" class="brush-dog-img">
                    <div class="brush-fur-overlay" id="fur-overlay"></div>
                </div>
                <div class="brush-tool" id="brush-tool">🪮</div>
            </div>
        `;

        const brushTool = area.querySelector('#brush-tool');
        const furOverlay = area.querySelector('#fur-overlay');

        // Mouse/touch events
        const handleStart = (e) => {
            this.isDragging = true;
            const pos = this.getPosition(e);
            this.lastY = pos.y;
            brushTool.style.left = `${pos.x - 30}px`;
            brushTool.style.top = `${pos.y - 30}px`;
        };

        const handleMove = (e) => {
            if (!this.isDragging) return;
            e.preventDefault();

            const pos = this.getPosition(e);
            brushTool.style.left = `${pos.x - 30}px`;
            brushTool.style.top = `${pos.y - 30}px`;

            // Tarkista harjausliike
            const deltaY = Math.abs(pos.y - this.lastY);
            if (deltaY > 20) {
                this.brushStrokes++;
                this.lastY = pos.y;

                // Lisää harjausjälki
                this.addBrushMark(furOverlay, pos.x, pos.y);

                // Päivitä edistyminen
                const progress = Math.min(100, (this.brushStrokes / this.requiredStrokes) * 100);
                this.manager.updateProgress(progress);

                // Tarkista valmistuminen
                if (this.brushStrokes >= this.requiredStrokes) {
                    this.complete();
                }
            }
        };

        const handleEnd = () => {
            this.isDragging = false;
        };

        area.addEventListener('mousedown', handleStart);
        area.addEventListener('mousemove', handleMove);
        area.addEventListener('mouseup', handleEnd);
        area.addEventListener('mouseleave', handleEnd);

        // Touch events
        area.addEventListener('touchstart', handleStart, { passive: false });
        area.addEventListener('touchmove', handleMove, { passive: false });
        area.addEventListener('touchend', handleEnd);
    }

    getPosition(e) {
        const rect = this.manager.gameContainer.getBoundingClientRect();
        if (e.touches) {
            return {
                x: e.touches[0].clientX - rect.left,
                y: e.touches[0].clientY - rect.top
            };
        }
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    addBrushMark(container, x, y) {
        const mark = document.createElement('div');
        mark.className = 'brush-mark';
        mark.style.left = `${x}px`;
        mark.style.top = `${y}px`;
        mark.textContent = '✨';
        container.appendChild(mark);

        setTimeout(() => mark.remove(), 1000);
    }

    complete() {
        this.manager.showScore('🌟 Turkki kiiltää! Mahtavaa!');
        this.manager.completeGame(true, 10);
    }
}

// ============================================
// Kynsienleikkuu-minipeli (Nail Trimming) - VISUAALINEN VERSIO
// ============================================

class NailTrimmingGame {
    constructor(manager) {
        this.manager = manager;
        this.nailsClipped = 0;
        this.totalNails = 4; // Neljä kynttä tassussa
        this.nailStates = []; // Pitää kirjaa kynsien tilasta
    }

    start(onComplete) {
        this.manager.onComplete = onComplete;
        this.manager.showGame('✂️ Leikkaa kynnet!', 'Klikkaa jokaista kynttä saksilla leikkaamaan');
        this.nailsClipped = 0;
        this.nailStates = [false, false, false, false]; // Kaikki kynnet leikkaamatta

        const area = this.manager.gameContainer;
        area.innerHTML = `
            <div class="nail-visual-game">
                <div class="paw-display">
                    <!-- Realistinen tassukuva taustalla -->
                    <div class="realistic-paw-container">
                        <img src="assets/paw_realistic.png" alt="Koiran tassu" class="realistic-paw-img">
                        
                        <!-- Kynsi-hotspotit kuvan päällä -->
                        <div class="nail-hotspot nail-hotspot-1" data-nail="0" id="nail-0">
                            <div class="nail-highlight"></div>
                            <div class="nail-cut-indicator">✓</div>
                        </div>
                        <div class="nail-hotspot nail-hotspot-2" data-nail="1" id="nail-1">
                            <div class="nail-highlight"></div>
                            <div class="nail-cut-indicator">✓</div>
                        </div>
                        <div class="nail-hotspot nail-hotspot-3" data-nail="2" id="nail-2">
                            <div class="nail-highlight"></div>
                            <div class="nail-cut-indicator">✓</div>
                        </div>
                        <div class="nail-hotspot nail-hotspot-4" data-nail="3" id="nail-3">
                            <div class="nail-highlight"></div>
                            <div class="nail-cut-indicator">✓</div>
                        </div>
                    </div>
                    
                    <!-- Sakset-kursori -->
                    <div class="scissors-cursor" id="scissors-cursor">✂️</div>
                </div>
                
                <!-- Viuhti reagoi -->
                <div class="nail-viuhti">
                    <img src="assets/viuhti_happy.png" alt="Viuhti" id="nail-game-viuhti">
                    <div class="viuhti-reaction" id="viuhti-reaction"></div>
                </div>
                
                <div class="nail-counter">
                    Leikattu: <span id="nails-cut">0</span> / ${this.totalNails}
                </div>
            </div>
        `;

        this.setupGame(area);
    }

    setupGame(area) {
        const scissorsCursor = document.getElementById('scissors-cursor');
        const pawDisplay = area.querySelector('.paw-display');

        // Seuraa hiirtä saksilla
        pawDisplay.addEventListener('mousemove', (e) => {
            const rect = pawDisplay.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            scissorsCursor.style.left = `${x}px`;
            scissorsCursor.style.top = `${y}px`;
            scissorsCursor.style.opacity = '1';
        });

        pawDisplay.addEventListener('mouseleave', () => {
            scissorsCursor.style.opacity = '0';
        });

        // Touch support
        pawDisplay.addEventListener('touchmove', (e) => {
            const rect = pawDisplay.getBoundingClientRect();
            const touch = e.touches[0];
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;
            scissorsCursor.style.left = `${x}px`;
            scissorsCursor.style.top = `${y}px`;
            scissorsCursor.style.opacity = '1';
        }, { passive: true });

        // Klikkaa kynsiä
        for (let i = 0; i < this.totalNails; i++) {
            const nail = document.getElementById(`nail-${i}`);

            nail.addEventListener('click', () => this.clipNail(i));
            nail.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.clipNail(i);
            });
        }
    }

    clipNail(index) {
        // Jo leikattu?
        if (this.nailStates[index]) return;

        const nail = document.getElementById(`nail-${index}`);
        const viuhtiImg = document.getElementById('nail-game-viuhti');
        const reaction = document.getElementById('viuhti-reaction');

        // Merkitse leikatuksi
        this.nailStates[index] = true;
        this.nailsClipped++;

        // Animoi kynsileikkaus
        nail.classList.add('clipped');

        // Naksahdus-ääni
        if (typeof gameMusic !== 'undefined') {
            gameMusic.playCleanup();
        }

        // Saksi-animaatio
        const scissors = document.getElementById('scissors-cursor');
        scissors.classList.add('snipping');
        setTimeout(() => scissors.classList.remove('snipping'), 300);

        // Viuhti reagoi
        const reactions = ['Au! 😖', 'Vähän pelottaa...', '*Ynähdys*', 'Kohta valmis?'];
        reaction.textContent = reactions[index] || '😬';
        reaction.classList.add('show');
        setTimeout(() => reaction.classList.remove('show'), 1000);

        // Päivitä laskuri
        document.getElementById('nails-cut').textContent = this.nailsClipped;

        // Päivitä edistyminen
        const progress = (this.nailsClipped / this.totalNails) * 100;
        this.manager.updateProgress(progress);

        // Kaikki leikattu?
        if (this.nailsClipped >= this.totalNails) {
            setTimeout(() => this.complete(), 500);
        }
    }

    complete() {
        const viuhtiImg = document.getElementById('nail-game-viuhti');
        const reaction = document.getElementById('viuhti-reaction');

        reaction.textContent = 'Kiitos! ❤️';
        reaction.classList.add('show');

        this.manager.showScore('🎉 Kaikki kynnet leikattu! Viuhti kiittää!');
        this.manager.completeGame(true, 15);
    }
}


// ============================================
// Peseminen-minipeli (Washing)
// ============================================

class WashingGame {
    constructor(manager) {
        this.manager = manager;
        this.dirtSpots = [];
        this.cleanedSpots = 0;
        this.totalSpots = 8;
    }

    start(onComplete) {
        this.manager.onComplete = onComplete;
        this.manager.showGame('🛁 Pese Viuhti!', 'Hiero kaikki likakohdat puhtaaksi');
        this.cleanedSpots = 0;

        const area = this.manager.gameContainer;
        area.innerHTML = `
            <div class="wash-game">
                <div class="wash-viuhti">
                    <img src="assets/viuhti_dirty.png" alt="Likainen Viuhti" class="wash-dog-img" id="wash-dog">
                    <div class="dirt-spots" id="dirt-spots"></div>
                </div>
                <div class="soap-bubbles" id="bubbles"></div>
            </div>
        `;

        this.generateDirtSpots(area.querySelector('#dirt-spots'));
    }

    generateDirtSpots(container) {
        const positions = [
            { x: 20, y: 30 }, { x: 70, y: 25 },
            { x: 35, y: 60 }, { x: 65, y: 55 },
            { x: 25, y: 80 }, { x: 75, y: 75 },
            { x: 45, y: 40 }, { x: 55, y: 70 }
        ];

        positions.forEach((pos, i) => {
            const spot = document.createElement('div');
            spot.className = 'dirt-spot';
            spot.style.left = `${pos.x}%`;
            spot.style.top = `${pos.y}%`;
            spot.dataset.clicks = 0;
            spot.dataset.required = 5;
            spot.textContent = '💩';

            spot.addEventListener('click', () => this.scrubSpot(spot));
            spot.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.scrubSpot(spot);
            });

            container.appendChild(spot);
        });
    }

    scrubSpot(spot) {
        if (spot.classList.contains('cleaned')) return;

        let clicks = parseInt(spot.dataset.clicks) + 1;
        spot.dataset.clicks = clicks;

        // Animaatio
        spot.classList.add('scrubbing');
        setTimeout(() => spot.classList.remove('scrubbing'), 200);

        // Lisää kuplia
        this.addBubble(spot);

        // Tarkista puhdistuminen
        const required = parseInt(spot.dataset.required);
        if (clicks >= required) {
            spot.classList.add('cleaned');
            spot.textContent = '✨';
            this.cleanedSpots++;

            const progress = (this.cleanedSpots / this.totalSpots) * 100;
            this.manager.updateProgress(progress);

            if (this.cleanedSpots >= this.totalSpots) {
                this.complete();
            }
        } else {
            // Näytä likaisuus vähenemässä
            const opacity = 1 - (clicks / required) * 0.7;
            spot.style.opacity = opacity;
        }
    }

    addBubble(spot) {
        const bubbles = document.getElementById('bubbles');
        const bubble = document.createElement('div');
        bubble.className = 'soap-bubble';
        bubble.textContent = '🫧';

        const rect = spot.getBoundingClientRect();
        const containerRect = bubbles.getBoundingClientRect();
        bubble.style.left = `${rect.left - containerRect.left + Math.random() * 30}px`;
        bubble.style.top = `${rect.top - containerRect.top}px`;

        bubbles.appendChild(bubble);
        setTimeout(() => bubble.remove(), 1000);
    }

    complete() {
        // Vaihda puhtaaseen kuvaan
        document.getElementById('wash-dog').src = 'assets/viuhti_happy.png';
        this.manager.showScore('🌟 Viuhti on puhdas ja tuoksuu hyvälle!');
        this.manager.completeGame(true, 12);
    }
}

// ============================================
// Ruokkiminen-minipeli (Feeding)
// ============================================

class FeedingGame {
    constructor(manager) {
        this.manager = manager;
        this.foodItems = [];
        this.fedItems = 0;
        this.requiredItems = 5;
    }

    start(onComplete) {
        this.manager.onComplete = onComplete;
        this.manager.showGame('🍖 Ruoki Viuhtia!', 'Raahaa ruoat kuppiin');
        this.fedItems = 0;

        const area = this.manager.gameContainer;
        area.innerHTML = `
            <div class="feed-game">
                <div class="food-items" id="food-items"></div>
                <div class="food-bowl" id="food-bowl">
                    <span class="bowl-emoji">🥣</span>
                    <div class="bowl-contents" id="bowl-contents"></div>
                </div>
                <div class="viuhti-waiting">
                    <img src="assets/viuhti_hungry.png" alt="Nälkäinen Viuhti" id="feed-viuhti">
                </div>
            </div>
        `;

        this.generateFood(area.querySelector('#food-items'));
        this.setupBowl(area.querySelector('#food-bowl'));
    }

    generateFood(container) {
        const foods = ['🍖', '🥩', '🍗', '🦴', '🥕', '🍎', '🧀'];

        for (let i = 0; i < this.requiredItems; i++) {
            const food = document.createElement('div');
            food.className = 'food-item';
            food.textContent = foods[i % foods.length];
            food.draggable = true;
            food.id = `food-${i}`;

            food.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', food.id);
                food.classList.add('dragging');
            });

            food.addEventListener('dragend', () => {
                food.classList.remove('dragging');
            });

            // Touch support
            this.addTouchDrag(food);

            container.appendChild(food);
        }
    }

    addTouchDrag(element) {
        let startX, startY, initialX, initialY;

        element.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
            const rect = element.getBoundingClientRect();
            initialX = rect.left;
            initialY = rect.top;
            element.classList.add('dragging');
        }, { passive: true });

        element.addEventListener('touchmove', (e) => {
            if (!element.classList.contains('dragging')) return;
            e.preventDefault();

            const touch = e.touches[0];
            const deltaX = touch.clientX - startX;
            const deltaY = touch.clientY - startY;

            element.style.position = 'fixed';
            element.style.left = `${initialX + deltaX}px`;
            element.style.top = `${initialY + deltaY}px`;
            element.style.zIndex = '1000';
        }, { passive: false });

        element.addEventListener('touchend', (e) => {
            element.classList.remove('dragging');

            const touch = e.changedTouches[0];
            const bowl = document.getElementById('food-bowl');
            const bowlRect = bowl.getBoundingClientRect();

            if (touch.clientX >= bowlRect.left && touch.clientX <= bowlRect.right &&
                touch.clientY >= bowlRect.top && touch.clientY <= bowlRect.bottom) {
                this.addToBoowl(element);
            } else {
                element.style.position = '';
                element.style.left = '';
                element.style.top = '';
                element.style.zIndex = '';
            }
        });
    }

    setupBowl(bowl) {
        bowl.addEventListener('dragover', (e) => {
            e.preventDefault();
            bowl.classList.add('drag-over');
        });

        bowl.addEventListener('dragleave', () => {
            bowl.classList.remove('drag-over');
        });

        bowl.addEventListener('drop', (e) => {
            e.preventDefault();
            bowl.classList.remove('drag-over');

            const foodId = e.dataTransfer.getData('text/plain');
            const food = document.getElementById(foodId);
            if (food) {
                this.addToBoowl(food);
            }
        });
    }

    addToBoowl(food) {
        food.classList.add('in-bowl');
        food.style.position = '';
        food.style.left = '';
        food.style.top = '';

        const contents = document.getElementById('bowl-contents');
        contents.appendChild(food);

        this.fedItems++;
        const progress = (this.fedItems / this.requiredItems) * 100;
        this.manager.updateProgress(progress);

        if (this.fedItems >= this.requiredItems) {
            this.complete();
        }
    }

    complete() {
        document.getElementById('feed-viuhti').src = 'assets/viuhti_happy.png';
        this.manager.showScore('🎉 Viuhti on kylläinen ja tyytyväinen!');
        this.manager.completeGame(true, 10);
    }
}

// ============================================
// Leikkiminen-minipeli (Playing)
// ============================================

class PlayingGame {
    constructor(manager) {
        this.manager = manager;
        this.score = 0;
        this.targetScore = 5;
        this.ballActive = false;
        this.gameInterval = null;
    }

    start(onComplete) {
        this.manager.onComplete = onComplete;
        this.manager.showGame('🎾 Leiki Viuhtin kanssa!', 'Klikkaa palloa kun se on lähellä Viuhtia!');
        this.score = 0;

        const area = this.manager.gameContainer;
        area.innerHTML = `
            <div class="play-game">
                <div class="play-field" id="play-field">
                    <div class="play-viuhti">
                        <img src="assets/viuhti_happy.png" alt="Viuhti" id="play-dog">
                    </div>
                    <div class="ball" id="ball">🎾</div>
                </div>
                <div class="play-score">Napattu: <span id="catch-score">0</span>/${this.targetScore}</div>
            </div>
        `;

        this.setupGame(area.querySelector('#play-field'));
    }

    setupGame(field) {
        const ball = document.getElementById('ball');
        const dog = document.getElementById('play-dog');

        // Animoi palloa
        this.animateBall(ball, field);

        ball.addEventListener('click', () => this.catchBall(ball, dog));
        ball.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.catchBall(ball, dog);
        });
    }

    animateBall(ball, field) {
        let x = 50;
        let y = 50;
        let dx = (Math.random() - 0.5) * 8;
        let dy = (Math.random() - 0.5) * 8;

        const animate = () => {
            x += dx;
            y += dy;

            // Bounce off walls
            if (x < 10 || x > 90) dx *= -1;
            if (y < 10 || y > 90) dy *= -1;

            x = Math.max(10, Math.min(90, x));
            y = Math.max(10, Math.min(90, y));

            ball.style.left = `${x}%`;
            ball.style.top = `${y}%`;

            // Tarkista onko lähellä koiraa (keskellä)
            const nearDog = Math.abs(x - 50) < 25 && Math.abs(y - 50) < 25;
            ball.classList.toggle('catchable', nearDog);

            this.gameInterval = requestAnimationFrame(animate);
        };

        animate();
    }

    catchBall(ball, dog) {
        if (!ball.classList.contains('catchable')) {
            ball.classList.add('missed');
            setTimeout(() => ball.classList.remove('missed'), 300);
            return;
        }

        this.score++;
        document.getElementById('catch-score').textContent = this.score;

        const progress = (this.score / this.targetScore) * 100;
        this.manager.updateProgress(progress);

        // Animaatio
        ball.classList.add('caught');
        dog.classList.add('happy-bounce');

        setTimeout(() => {
            ball.classList.remove('caught');
            dog.classList.remove('happy-bounce');
        }, 500);

        if (this.score >= this.targetScore) {
            this.complete();
        }
    }

    complete() {
        if (this.gameInterval) {
            cancelAnimationFrame(this.gameInterval);
        }
        this.manager.showScore('🌟 Viuhti rakasti leikkimistä kanssasi!');
        this.manager.completeGame(true, 15);
    }
}

// ============================================
// Ulkoilu-minipeli (Walking)
// ============================================

class WalkingGame {
    constructor(manager) {
        this.manager = manager;
        this.steps = 0;
        this.targetSteps = 20;
        this.lastClickTime = 0;
    }

    start(onComplete) {
        this.manager.onComplete = onComplete;
        this.manager.showGame('🚶 Ulkoiluta Viuhtia!', 'Klikkaa vuorotellen jalkoja - VASEN, OIKEA, VASEN...');
        this.steps = 0;

        const area = this.manager.gameContainer;
        area.innerHTML = `
            <div class="walk-game">
                <div class="walk-scene">
                    <div class="walk-bg" id="walk-bg"></div>
                    <div class="walk-viuhti" id="walk-viuhti">
                        <img src="assets/viuhti_walking.png" alt="Viuhti kävelyllä">
                    </div>
                </div>
                <div class="walk-controls">
                    <button class="walk-btn left" id="btn-left">👟 VASEN</button>
                    <button class="walk-btn right" id="btn-right">OIKEA 👟</button>
                </div>
                <div class="step-counter">Askeleet: <span id="step-count">0</span>/${this.targetSteps}</div>
            </div>
        `;

        this.setupControls();
        this.nextStep = 'left';
    }

    setupControls() {
        const leftBtn = document.getElementById('btn-left');
        const rightBtn = document.getElementById('btn-right');

        leftBtn.addEventListener('click', () => this.step('left'));
        rightBtn.addEventListener('click', () => this.step('right'));

        // Highlight expected button
        leftBtn.classList.add('expected');
    }

    step(foot) {
        if (foot !== this.nextStep) {
            // Wrong foot!
            const btn = document.getElementById(`btn-${foot}`);
            btn.classList.add('wrong');
            setTimeout(() => btn.classList.remove('wrong'), 300);
            return;
        }

        this.steps++;
        document.getElementById('step-count').textContent = this.steps;

        // Animaatiot
        const viuhti = document.getElementById('walk-viuhti');
        viuhti.classList.add('stepping');
        setTimeout(() => viuhti.classList.remove('stepping'), 200);

        // Liikuta taustaa
        const bg = document.getElementById('walk-bg');
        bg.style.backgroundPosition = `${this.steps * 20}px 0`;

        // Update progress
        const progress = (this.steps / this.targetSteps) * 100;
        this.manager.updateProgress(progress);

        // Switch expected foot
        const leftBtn = document.getElementById('btn-left');
        const rightBtn = document.getElementById('btn-right');

        if (this.nextStep === 'left') {
            this.nextStep = 'right';
            leftBtn.classList.remove('expected');
            rightBtn.classList.add('expected');
        } else {
            this.nextStep = 'left';
            rightBtn.classList.remove('expected');
            leftBtn.classList.add('expected');
        }

        if (this.steps >= this.targetSteps) {
            this.complete();
        }
    }

    complete() {
        this.manager.showScore('🌟 Mahtava lenkki! Viuhti on tyytyväinen!');
        this.manager.completeGame(true, 12);
    }
}

// ============================================
// Export games
// ============================================

const miniGames = {
    brushing: new BrushingGame(miniGameManager),
    nails: new NailTrimmingGame(miniGameManager),
    washing: new WashingGame(miniGameManager),
    feeding: new FeedingGame(miniGameManager),
    playing: new PlayingGame(miniGameManager),
    walking: new WalkingGame(miniGameManager)
};
