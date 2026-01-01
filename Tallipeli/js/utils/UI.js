/**
 * UI - User Interface Manager
 * Handles all UI interactions and updates
 */

export class UI {
    constructor(game) {
        this.game = game;
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Wait for DOM to be ready
        document.addEventListener('DOMContentLoaded', () => {
            this.bindMenuButtons();
            this.bindActionButtons();
            this.bindRidingButtons();
            this.bindActivityButtons();
        });

        // Bind immediately if DOM is already ready
        if (document.readyState !== 'loading') {
            this.bindMenuButtons();
            this.bindActionButtons();
            this.bindRidingButtons();
            this.bindActivityButtons();
        }
    }

    bindMenuButtons() {
        // Main menu buttons
        const btnNewGame = document.getElementById('btn-new-game');
        const btnContinue = document.getElementById('btn-continue');
        const btnSettings = document.getElementById('btn-settings');
        const btnHelp = document.getElementById('btn-help');
        const btnPause = document.getElementById('btn-pause');

        if (btnNewGame) {
            btnNewGame.addEventListener('click', () => {
                this.game.startGame();
            });
        }

        if (btnContinue) {
            btnContinue.addEventListener('click', () => {
                this.game.resumeGame();
            });
        }

        if (btnSettings) {
            btnSettings.addEventListener('click', () => {
                this.showSettings();
            });
        }

        if (btnHelp) {
            btnHelp.addEventListener('click', () => {
                this.showHelp();
            });
        }

        if (btnPause) {
            btnPause.addEventListener('click', () => {
                this.game.pauseGame();
            });
        }

        // Close buttons
        const closeStats = document.getElementById('close-stats');
        if (closeStats) {
            closeStats.addEventListener('click', () => {
                this.game.deselectHorse();
            });
        }
    }

    bindActionButtons() {
        const actionButtons = document.querySelectorAll('.action-btn');

        actionButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.dataset.action;
                this.handleAction(action);
            });
        });
    }

    bindRidingButtons() {
        const ridingButtons = document.querySelectorAll('.riding-btn');
        const ridingBack = document.getElementById('riding-back');

        ridingButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const ridingType = btn.dataset.riding;
                this.startRiding(ridingType);
            });
        });

        if (ridingBack) {
            ridingBack.addEventListener('click', () => {
                this.hideRidingMenu();
                this.showActionMenu();
            });
        }
    }

    bindActivityButtons() {
        const closeActivity = document.getElementById('close-activity');

        if (closeActivity) {
            closeActivity.addEventListener('click', () => {
                this.game.endActivity();
            });
        }
    }

    handleAction(action) {
        if (!this.game.selectedHorse) return;

        switch (action) {
            case 'brush':
                this.game.startActivity('brush');
                break;
            case 'feed':
                this.game.startActivity('feed');
                break;
            case 'wash':
                this.game.startActivity('wash');
                break;
            case 'shoe':
                this.game.startActivity('shoe');
                break;
            case 'clean':
                this.game.startActivity('clean');
                break;
            case 'paddock':
                this.sendToPaddock();
                break;
            case 'swim':
                this.game.startActivity('swim');
                break;
            case 'ride':
                this.showRidingMenu();
                break;
            case 'halter':
                this.toggleHalter();
                break;
            case 'blanket':
                this.toggleBlanket();
                break;
        }
    }

    sendToPaddock() {
        const horse = this.game.selectedHorse;
        if (!horse) return;

        if (horse.location === 'paddock') {
            // Bringing horse back from paddock needs halter too
            if (!horse.hasHalter) {
                this.showNotification(`Laita ensin riimu ${horse.name}lle taluttaaksesi sen takaisin!`);
                return;
            }
            horse.moveToStall();
            this.showNotification(`${horse.name} palasi karsinaansa.`);
        } else {
            // Check if horse has halter
            if (!horse.hasHalter) {
                this.showNotification(`Laita ensin riimu ${horse.name}lle voidaksesi taluttaa sen!`);
                return;
            }
            horse.moveToPaddock();
            this.showNotification(`${horse.name} meni tarhaan. 🌿`);
        }

        this.hideActionMenu();
    }

    toggleHalter() {
        const horse = this.game.selectedHorse;
        if (!horse) return;

        if (horse.hasHalter) {
            horse.takeOffHalter();
            this.showNotification(`Riimu otettiin pois ${horse.name}lta.`);
        } else {
            horse.putOnHalter();
            this.showNotification(`Riimu laitettiin ${horse.name}lle! 🐴`);
        }

        this.updateHorseStatsDisplay();
    }

    toggleBlanket() {
        const horse = this.game.selectedHorse;
        if (!horse) return;

        if (horse.hasBlanket) {
            horse.takeOffBlanket();
            this.showNotification(`Loimi otettiin pois ${horse.name}lta.`);
        } else {
            // Random blanket color for now
            const colors = [0x4169E1, 0x228B22, 0x8B0000, 0x9932CC];
            const color = colors[Math.floor(Math.random() * colors.length)];
            horse.putOnBlanket(color);
            this.showNotification(`Loimi laitettiin ${horse.name}lle! 🧥`);
        }

        this.updateHorseStatsDisplay();
    }


    startRiding(type) {
        const horse = this.game.selectedHorse;
        if (!horse) return;

        this.hideRidingMenu();
        this.hideActionMenu();
        this.hideHorseStats();

        // Mount the horse
        this.game.player.mountHorse(horse);

        // Set riding mode based on type
        horse.ridingMode = type;

        this.showNotification(`Ratsastat nyt: ${this.getRidingTypeName(type)}`);

        // Move to appropriate arena if needed
        // Each arena has different floor level
        switch (type) {
            case 'jumping':
                // Jumping arena floor is at y=0.05, horse needs to be higher
                horse.baseY = 0.2;
                horse.mesh.position.set(80, 0.2, -25);
                horse.mesh.rotation.y = 0;
                break;
            case 'dressage':
                horse.baseY = 0.15;
                horse.mesh.position.set(80, 0.15, -70);
                horse.mesh.rotation.y = 0;
                break;
            case 'western':
                horse.baseY = 0.15;
                horse.mesh.position.set(80, 0.15, 60);
                horse.mesh.rotation.y = Math.PI;
                break;
            case 'trail':
                horse.baseY = 0.2;
                horse.mesh.position.set(-20, 0.2, 50);
                horse.mesh.rotation.y = -Math.PI / 2;
                break;
        }
        horse.position.copy(horse.mesh.position);
    }



    getRidingTypeName(type) {
        const names = {
            jumping: 'Esteratsastus',
            dressage: 'Kouluratsastus',
            western: 'Lännenratsastus',
            trail: 'Maastoratsastus'
        };
        return names[type] || type;
    }

    showHorseStats(horse) {
        const panel = document.getElementById('horse-stats-panel');
        if (!panel) return;

        panel.classList.remove('hidden');
        this.updateHorseStats(horse);
    }

    hideHorseStats() {
        const panel = document.getElementById('horse-stats-panel');
        if (panel) {
            panel.classList.add('hidden');
        }
    }

    updateHorseStats(horse) {
        if (!horse) return;

        const stats = horse.getStatsForUI();

        document.getElementById('horse-name').textContent = stats.name;
        document.getElementById('stat-hunger').style.width = stats.hunger + '%';
        document.getElementById('stat-thirst').style.width = stats.thirst + '%';
        document.getElementById('stat-cleanliness').style.width = stats.cleanliness + '%';
        document.getElementById('stat-happiness').style.width = stats.happiness + '%';
        document.getElementById('stat-energy').style.width = stats.energy + '%';
        document.getElementById('stat-hooves').style.width = stats.hooves + '%';

        // Color code stats
        const statElements = ['hunger', 'thirst', 'cleanliness', 'happiness', 'energy', 'hooves'];
        statElements.forEach(stat => {
            const el = document.getElementById(`stat-${stat}`);
            if (el) {
                const value = stats[stat];
                if (value < 20) {
                    el.style.background = 'linear-gradient(90deg, #f87171 0%, #ef4444 100%)';
                } else if (value < 50) {
                    el.style.background = 'linear-gradient(90deg, #fbbf24 0%, #f59e0b 100%)';
                } else {
                    el.style.background = 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)';
                }
            }
        });
    }

    showActionMenu() {
        const menu = document.getElementById('action-menu');
        if (menu) {
            menu.classList.remove('hidden');
        }
    }

    hideActionMenu() {
        const menu = document.getElementById('action-menu');
        if (menu) {
            menu.classList.add('hidden');
        }
    }

    showRidingMenu() {
        const menu = document.getElementById('riding-menu');
        const actionMenu = document.getElementById('action-menu');

        if (actionMenu) actionMenu.classList.add('hidden');
        if (menu) menu.classList.remove('hidden');
    }

    hideRidingMenu() {
        const menu = document.getElementById('riding-menu');
        if (menu) {
            menu.classList.add('hidden');
        }
    }

    showActivity(type, horse) {
        const overlay = document.getElementById('activity-overlay');
        const title = document.getElementById('activity-title');
        const container = document.getElementById('activity-container');
        const progressFill = document.getElementById('activity-progress-fill');

        if (!overlay || !container) return;

        overlay.classList.remove('hidden');
        progressFill.style.width = '0%';

        // Set title and content based on activity type
        switch (type) {
            case 'brush':
                title.textContent = `Harjaa ${horse.name}`;
                container.innerHTML = this.getBrushingContent();
                this.setupBrushingActivity(horse);
                break;
            case 'feed':
                title.textContent = `Ruoki ${horse.name}`;
                container.innerHTML = this.getFeedingContent();
                this.setupFeedingActivity(horse);
                break;
            case 'wash':
                title.textContent = `Pese ${horse.name}`;
                container.innerHTML = this.getWashingContent();
                this.setupWashingActivity(horse);
                break;
            case 'shoe':
                title.textContent = `Kengitä ${horse.name}`;
                container.innerHTML = this.getShoeingContent();
                this.setupShoeingActivity(horse);
                break;
            case 'clean':
                title.textContent = 'Siivoa karsina';
                container.innerHTML = this.getCleaningContent();
                this.setupCleaningActivity(horse);
                break;
            case 'swim':
                title.textContent = `Uita ${horse.name}`;
                container.innerHTML = this.getSwimmingContent();
                this.setupSwimmingActivity(horse);
                break;
        }
    }

    hideActivity() {
        const overlay = document.getElementById('activity-overlay');
        if (overlay) {
            overlay.classList.add('hidden');
        }
    }

    getBrushingContent() {
        return `
            <div class="brushing-activity">
                <p class="activity-instruction">Vedä hiirtä hevosen yli harjataksesi sitä!</p>
                <div class="brushing-area" id="brushing-area">
                    <div class="horse-silhouette-big"></div>
                </div>
                <div class="brush-tools">
                    <button class="brush-tool active" data-brush="soft">
                        <span>🪥</span> Pehmeä harja
                    </button>
                    <button class="brush-tool" data-brush="hard">
                        <span>🧹</span> Kova harja
                    </button>
                    <button class="brush-tool" data-brush="comb">
                        <span>🪮</span> Harja
                    </button>
                </div>
            </div>
        `;
    }

    setupBrushingActivity(horse) {
        const brushingArea = document.getElementById('brushing-area');
        if (!brushingArea) return;

        let progress = 0;
        let isDrawing = false;

        // Add dirt spots
        for (let i = 0; i < 15; i++) {
            const spot = document.createElement('div');
            spot.className = 'dirt-spot';
            spot.style.left = (Math.random() * 80 + 10) + '%';
            spot.style.top = (Math.random() * 80 + 10) + '%';
            spot.style.transform = `scale(${0.5 + Math.random() * 1})`;
            brushingArea.appendChild(spot);
        }

        const updateProgress = (amount) => {
            progress = Math.min(100, progress + amount);
            document.getElementById('activity-progress-fill').style.width = progress + '%';
            horse.brush(amount);

            if (progress >= 100) {
                this.showNotification('Harjaus valmis! ' + horse.name + ' näyttää puhtaalta.');
                setTimeout(() => this.game.endActivity(), 1000);
            }
        };

        brushingArea.addEventListener('mousedown', () => { isDrawing = true; });
        brushingArea.addEventListener('mouseup', () => { isDrawing = false; });
        brushingArea.addEventListener('mouseleave', () => { isDrawing = false; });

        brushingArea.addEventListener('mousemove', (e) => {
            if (!isDrawing) return;

            const rect = brushingArea.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Check if over dirt spots
            const spots = brushingArea.querySelectorAll('.dirt-spot:not(.cleaned)');
            spots.forEach(spot => {
                const spotRect = spot.getBoundingClientRect();
                const spotX = spotRect.left - rect.left + spotRect.width / 2;
                const spotY = spotRect.top - rect.top + spotRect.height / 2;

                const distance = Math.sqrt(Math.pow(x - spotX, 2) + Math.pow(y - spotY, 2));
                if (distance < 30) {
                    spot.classList.add('cleaned');
                    updateProgress(7);
                }
            });
        });

        // Brush tool selection
        document.querySelectorAll('.brush-tool').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.brush-tool').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }

    getFeedingContent() {
        return `
            <div class="feeding-activity">
                <p class="activity-instruction">Valitse ruoka antaaksesi hevoselle!</p>
                <div class="feeding-options">
                    <button class="feed-item" data-food="hay">
                        <span class="feed-icon">🌾</span>
                        <span class="feed-name">Heinä</span>
                        <span class="feed-effect">+30 Nälkä, +10 Energia</span>
                    </button>
                    <button class="feed-item" data-food="oats">
                        <span class="feed-icon">🥣</span>
                        <span class="feed-name">Kaura</span>
                        <span class="feed-effect">+20 Nälkä, +25 Energia</span>
                    </button>
                    <button class="feed-item" data-food="carrot">
                        <span class="feed-icon">🥕</span>
                        <span class="feed-name">Porkkana</span>
                        <span class="feed-effect">+10 Nälkä, +15 Onnellisuus</span>
                    </button>
                    <button class="feed-item" data-food="water">
                        <span class="feed-icon">💧</span>
                        <span class="feed-name">Vesi</span>
                        <span class="feed-effect">+40 Jano</span>
                    </button>
                </div>
            </div>
        `;
    }

    setupFeedingActivity(horse) {
        const feedItems = document.querySelectorAll('.feed-item');

        feedItems.forEach(item => {
            item.addEventListener('click', () => {
                const food = item.dataset.food;
                horse.feed(food);

                // Animate the item
                item.style.transform = 'scale(1.1)';
                item.style.background = 'rgba(74, 222, 128, 0.3)';

                setTimeout(() => {
                    item.style.transform = '';
                    item.style.background = '';
                }, 300);

                // Update progress
                const progressFill = document.getElementById('activity-progress-fill');
                const currentWidth = parseFloat(progressFill.style.width) || 0;
                progressFill.style.width = Math.min(100, currentWidth + 25) + '%';

                this.showNotification(`Annoit ${this.getFoodName(food)} hevoselle ${horse.name}!`);

                if (currentWidth + 25 >= 100) {
                    setTimeout(() => this.game.endActivity(), 1000);
                }
            });
        });
    }

    getFoodName(food) {
        const names = { hay: 'heinää', oats: 'kauraa', carrot: 'porkkanaa', water: 'vettä' };
        return names[food] || food;
    }

    getWashingContent() {
        return `
            <div class="washing-activity">
                <div class="wash-status">
                    <span class="status-icon">🚿</span>
                    <span class="status-text" id="wash-status-text">Ota vesiletku!</span>
                </div>
                
                <div class="washing-game-area">
                    <!-- Hose pickup area -->
                    <div class="hose-area" id="hose-area">
                        <div class="hose-item" id="hose-item">
                            <div class="hose-nozzle">🔫</div>
                            <div class="hose-label">Vesiletku</div>
                        </div>
                    </div>
                    
                    <!-- Horse washing area -->
                    <div class="horse-washing-zone" id="horse-washing-zone">
                        <div class="horse-body-parts">
                            <div class="body-part head" data-part="head" data-dirty="true">
                                <span class="part-icon">🐴</span>
                                <span class="dirt-overlay"></span>
                            </div>
                            <div class="body-part neck" data-part="neck" data-dirty="true">
                                <span class="part-icon">📍</span>
                                <span class="dirt-overlay"></span>
                            </div>
                            <div class="body-part body" data-part="body" data-dirty="true">
                                <span class="part-icon">🟤</span>
                                <span class="dirt-overlay"></span>
                            </div>
                            <div class="body-part back" data-part="back" data-dirty="true">
                                <span class="part-icon">🔶</span>
                                <span class="dirt-overlay"></span>
                            </div>
                            <div class="body-part legs" data-part="legs" data-dirty="true">
                                <span class="part-icon">🦵</span>
                                <span class="dirt-overlay"></span>
                            </div>
                            <div class="body-part tail" data-part="tail" data-dirty="true">
                                <span class="part-icon">🎋</span>
                                <span class="dirt-overlay"></span>
                            </div>
                        </div>
                        <div class="water-spray-container" id="water-spray-container"></div>
                    </div>
                    
                    <!-- Tools -->
                    <div class="wash-tools-panel">
                        <div class="tool-btn active" data-tool="water" id="tool-water">
                            <span>💧</span> Vesi
                        </div>
                        <div class="tool-btn locked" data-tool="shampoo" id="tool-shampoo">
                            <span>🧴</span> Shampoo
                        </div>
                    </div>
                </div>
                
                <!-- Wash progress per body part -->
                <div class="body-progress-display" id="body-progress-display">
                    <div class="part-progress" data-for="head"><span>Pää</span><div class="bar"><div class="fill"></div></div></div>
                    <div class="part-progress" data-for="neck"><span>Kaula</span><div class="bar"><div class="fill"></div></div></div>
                    <div class="part-progress" data-for="body"><span>Vartalo</span><div class="bar"><div class="fill"></div></div></div>
                    <div class="part-progress" data-for="back"><span>Selkä</span><div class="bar"><div class="fill"></div></div></div>
                    <div class="part-progress" data-for="legs"><span>Jalat</span><div class="bar"><div class="fill"></div></div></div>
                    <div class="part-progress" data-for="tail"><span>Häntä</span><div class="bar"><div class="fill"></div></div></div>
                </div>
            </div>
            <style>
                .wash-status {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.75rem 1rem;
                    background: rgba(30, 144, 255, 0.2);
                    border: 1px solid rgba(30, 144, 255, 0.4);
                    border-radius: 8px;
                    margin-bottom: 1rem;
                }
                .washing-game-area {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                .hose-area {
                    display: flex;
                    justify-content: center;
                    padding: 1rem;
                }
                .hose-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 1.5rem 2rem;
                    background: linear-gradient(135deg, #1e90ff 0%, #00bfff 100%);
                    border: 3px solid #0077cc;
                    border-radius: 16px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    animation: hose-glow 2s ease infinite;
                }
                .hose-item:hover {
                    transform: scale(1.1);
                    box-shadow: 0 8px 25px rgba(30, 144, 255, 0.5);
                }
                .hose-item.grabbed {
                    background: rgba(30, 144, 255, 0.3);
                    border-style: dashed;
                    transform: none;
                    cursor: default;
                }
                .hose-nozzle {
                    font-size: 3rem;
                    transform: rotate(-45deg);
                }
                .hose-label {
                    font-weight: 700;
                    color: white;
                    text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
                }
                @keyframes hose-glow {
                    0%, 100% { box-shadow: 0 0 10px rgba(30, 144, 255, 0.3); }
                    50% { box-shadow: 0 0 25px rgba(30, 144, 255, 0.6); }
                }
                .horse-washing-zone {
                    position: relative;
                    background: linear-gradient(180deg, #87ceeb 0%, #e0f7fa 100%);
                    border-radius: 12px;
                    padding: 2rem;
                    min-height: 200px;
                    cursor: crosshair;
                    overflow: hidden;
                }
                .horse-body-parts {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                    gap: 0.75rem;
                }
                .body-part {
                    position: relative;
                    width: 70px;
                    height: 70px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(139, 69, 19, 0.6);
                    border: 3px solid #8B4513;
                    border-radius: 12px;
                    font-size: 2rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                .body-part[data-dirty="true"] {
                    background: rgba(101, 67, 33, 0.8);
                }
                .body-part[data-dirty="true"]::after {
                    content: '💩';
                    position: absolute;
                    font-size: 1rem;
                    top: 0;
                    right: 0;
                }
                .body-part[data-dirty="false"] {
                    background: rgba(74, 222, 128, 0.3);
                    border-color: #22c55e;
                }
                .body-part[data-dirty="false"]::after {
                    content: '✨';
                    position: absolute;
                    font-size: 1rem;
                    top: 0;
                    right: 0;
                }
                .body-part:hover {
                    transform: scale(1.1);
                }
                .water-spray-container {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    overflow: hidden;
                }
                .water-particle {
                    position: absolute;
                    width: 8px;
                    height: 8px;
                    background: radial-gradient(circle, #87ceeb 0%, #1e90ff 100%);
                    border-radius: 50%;
                    pointer-events: none;
                    animation: water-drop 0.6s ease-out forwards;
                }
                @keyframes water-drop {
                    0% {
                        transform: scale(1);
                        opacity: 1;
                    }
                    100% {
                        transform: scale(0.2) translateY(40px);
                        opacity: 0;
                    }
                }
                .water-stream {
                    position: fixed;
                    width: 4px;
                    background: linear-gradient(90deg, #1e90ff, #00bfff);
                    border-radius: 2px;
                    pointer-events: none;
                    transform-origin: top center;
                    z-index: 1000;
                }
                .hose-cursor {
                    position: fixed;
                    width: 50px;
                    height: 50px;
                    font-size: 2rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    pointer-events: none;
                    z-index: 1001;
                    transform: translate(-50%, -50%) rotate(-45deg);
                }
                .wash-tools-panel {
                    display: flex;
                    gap: 1rem;
                    justify-content: center;
                }
                .tool-btn {
                    padding: 0.75rem 1.5rem;
                    background: rgba(30, 144, 255, 0.3);
                    border: 2px solid #1e90ff;
                    border-radius: 10px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-weight: 600;
                }
                .tool-btn.active {
                    background: rgba(30, 144, 255, 0.6);
                    border-color: #0077cc;
                    box-shadow: 0 0 10px rgba(30, 144, 255, 0.4);
                }
                .tool-btn.locked {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
                .body-progress-display {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 0.5rem;
                    margin-top: 1rem;
                }
                .part-progress {
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                }
                .part-progress span {
                    font-size: 0.75rem;
                    font-weight: 600;
                }
                .part-progress .bar {
                    height: 8px;
                    background: rgba(0,0,0,0.2);
                    border-radius: 4px;
                    overflow: hidden;
                }
                .part-progress .fill {
                    height: 100%;
                    width: 0%;
                    background: linear-gradient(90deg, #1e90ff 0%, #00bfff 100%);
                    transition: width 0.3s ease;
                }
            </style>
        `;
    }

    setupWashingActivity(horse) {
        const washingZone = document.getElementById('horse-washing-zone');
        const hoseItem = document.getElementById('hose-item');
        if (!washingZone || !hoseItem) return;

        // State
        let hasHose = false;
        let currentTool = 'water';
        let isSpraying = false;
        let hoseCursor = null;
        let waterStream = null;

        // Body part wash progress
        const bodyParts = {
            head: { progress: 0, element: document.querySelector('.body-part.head') },
            neck: { progress: 0, element: document.querySelector('.body-part.neck') },
            body: { progress: 0, element: document.querySelector('.body-part.body') },
            back: { progress: 0, element: document.querySelector('.body-part.back') },
            legs: { progress: 0, element: document.querySelector('.body-part.legs') },
            tail: { progress: 0, element: document.querySelector('.body-part.tail') }
        };

        const updateStatus = (text) => {
            document.getElementById('wash-status-text').textContent = text;
        };

        const updatePartProgress = (partName, amount) => {
            const part = bodyParts[partName];
            if (!part) return;

            part.progress = Math.min(100, part.progress + amount);

            // Update progress bar
            const progressBar = document.querySelector(`.part-progress[data-for="${partName}"] .fill`);
            if (progressBar) {
                progressBar.style.width = part.progress + '%';
            }

            // Mark as clean when done
            if (part.progress >= 100 && part.element) {
                part.element.dataset.dirty = 'false';
            }

            // Update overall progress
            const totalProgress = Object.values(bodyParts).reduce((sum, p) => sum + p.progress, 0) / 6;
            document.getElementById('activity-progress-fill').style.width = totalProgress + '%';
            horse.wash(amount / 6);

            // Check completion
            if (totalProgress >= 100) {
                this.showNotification(`${horse.name} on nyt puhtaanapuhdas! 🛁✨`);
                setTimeout(() => this.game.endActivity(), 1500);
            }
        };

        const createWaterParticles = (x, y) => {
            const container = document.getElementById('water-spray-container');
            if (!container) return;

            for (let i = 0; i < 5; i++) {
                const particle = document.createElement('div');
                particle.className = 'water-particle';
                const offsetX = (Math.random() - 0.5) * 30;
                const offsetY = (Math.random() - 0.5) * 30;
                particle.style.left = (x + offsetX) + 'px';
                particle.style.top = (y + offsetY) + 'px';

                if (currentTool === 'shampoo') {
                    particle.style.background = 'radial-gradient(circle, #fff 0%, #ffd700 100%)';
                }

                container.appendChild(particle);
                setTimeout(() => particle.remove(), 600);
            }
        };

        // Pick up hose
        hoseItem.addEventListener('click', () => {
            if (hasHose) return;

            hasHose = true;
            hoseItem.classList.add('grabbed');
            updateStatus('Suihkuta vettä hevosen päälle! Pidä hiirtä pohjassa.');

            // Create hose cursor
            hoseCursor = document.createElement('div');
            hoseCursor.className = 'hose-cursor';
            hoseCursor.innerHTML = '🔫';
            document.body.appendChild(hoseCursor);

            // Unlock shampoo
            document.getElementById('tool-shampoo').classList.remove('locked');
        });

        // Mouse move - update hose cursor position
        const updateCursor = (x, y) => {
            if (!hasHose || !hoseCursor) return;
            hoseCursor.style.left = x + 'px';
            hoseCursor.style.top = y + 'px';
        };

        document.addEventListener('mousemove', (e) => updateCursor(e.clientX, e.clientY));
        document.addEventListener('touchmove', (e) => {
            const touch = e.touches[0];
            updateCursor(touch.clientX, touch.clientY);
        }, { passive: false });

        // Spray on body parts
        document.querySelectorAll('.body-part').forEach(partElement => {
            let sprayInterval = null;

            const startSpray = (e) => {
                if (e.cancelable) e.preventDefault();

                if (!hasHose) {
                    this.showNotification('Ota ensin vesiletku!');
                    return;
                }

                isSpraying = true;
                const partName = partElement.dataset.part;

                // Spray continuously while holding
                const spray = () => {
                    if (!isSpraying) return;

                    // If touch, update position based on touch, else center of element
                    // For particles it's enough to just spawn them
                    // But in original code it used element center relative to washingZone
                    // Let's keep it simple: spawn particles 

                    // Simple hack: get coords from latest event if possible, or element center
                    const rect = partElement.getBoundingClientRect();
                    const zoneRect = washingZone.getBoundingClientRect();

                    // We need screen coordinates for particles usually if they are fixed, 
                    // or relative if container is relative. 
                    // The particle container is water-spray-container inside washing-game-container (which is relative)
                    // Let's rely on CSS logic being consistent

                    // Original code:
                    // const x = rect.left - zoneRect.left + rect.width / 2;
                    // const y = rect.top - zoneRect.top + rect.height / 2;
                    // createWaterParticles(x, y); 

                    // Wait, createWaterParticles appends to #water-spray-container which is absolute overlay
                    // The CSS for container was: position: absolute; top:0; left:0; width:100%; height:100%;
                    // And water-particle is absolute.
                    // So we likely need coordinates relative to the container.

                    // Using mouse clientX/Y directly for particles would be better if we track cursor?
                    // But original code uses element center, which implies "spraying this part" visual

                    // Let's accept original logic:
                    /* 
                    const x = rect.left - zoneRect.left + rect.width / 2;
                    const y = rect.top - zoneRect.top + rect.height / 2;
                    */

                    // BUT createWaterParticles gets x,y and puts them in style.left/top
                    // If container matches washingZone size/pos, then rect.left - zoneRect.left is correct relative X.

                    // Let's assume original logic works and replicate it
                    const x = rect.left - zoneRect.left + rect.width / 2;
                    const y = rect.top - zoneRect.top + rect.height / 2;

                    createWaterParticles(x, y);

                    const amount = currentTool === 'shampoo' ? 3 : 2;
                    updatePartProgress(partName, amount);
                };

                spray();
                sprayInterval = setInterval(spray, 100);
            };

            const stopSpray = () => {
                isSpraying = false;
                if (sprayInterval) {
                    clearInterval(sprayInterval);
                    sprayInterval = null;
                }
            };

            partElement.addEventListener('mousedown', startSpray);
            partElement.addEventListener('touchstart', startSpray, { passive: false });

            partElement.addEventListener('mouseup', stopSpray);
            partElement.addEventListener('touchend', stopSpray);
            partElement.addEventListener('mouseleave', stopSpray);
            // touchcancel handles if touch goes off screen etc
            partElement.addEventListener('touchcancel', stopSpray);

        });


        // Tool selection
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (btn.classList.contains('locked')) return;

                document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentTool = btn.dataset.tool;

                if (currentTool === 'shampoo') {
                    updateStatus('Shampoota! Hiero joka paikka puhtaaksi! 🧴');
                } else {
                    updateStatus('Huuhtele vedellä! 💧');
                }
            });
        });

        // Cleanup on activity end
        this.cleanupCurrentActivity = () => {
            if (hoseCursor) hoseCursor.remove();
        };
    }


    getShoeingContent() {
        return `
            <div class="shoeing-activity">
                <p class="activity-instruction">Klikkaa kavioita kengittääksesi hevosen!</p>
                <div class="hooves-container">
                    <div class="hoof" data-hoof="fl">
                        <span class="hoof-label">Vasen etu</span>
                        <div class="hoof-icon">🦶</div>
                        <div class="shoe-status">❌</div>
                    </div>
                    <div class="hoof" data-hoof="fr">
                        <span class="hoof-label">Oikea etu</span>
                        <div class="hoof-icon">🦶</div>
                        <div class="shoe-status">❌</div>
                    </div>
                    <div class="hoof" data-hoof="bl">
                        <span class="hoof-label">Vasen taka</span>
                        <div class="hoof-icon">🦶</div>
                        <div class="shoe-status">❌</div>
                    </div>
                    <div class="hoof" data-hoof="br">
                        <span class="hoof-label">Oikea taka</span>
                        <div class="hoof-icon">🦶</div>
                        <div class="shoe-status">❌</div>
                    </div>
                </div>
            </div>
            <style>
                .shoeing-activity {
                    text-align: center;
                }
                .hooves-container {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 1rem;
                    max-width: 400px;
                    margin: 1rem auto;
                }
                .hoof {
                    background: rgba(255, 255, 255, 0.1);
                    border: 2px solid rgba(255, 255, 255, 0.2);
                    border-radius: 12px;
                    padding: 1.5rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                .hoof:hover {
                    background: rgba(139, 69, 19, 0.3);
                    border-color: #DAA520;
                    transform: scale(1.05);
                }
                .hoof.done {
                    background: rgba(74, 222, 128, 0.2);
                    border-color: #4ade80;
                }
                .hoof-label {
                    display: block;
                    font-size: 0.875rem;
                    color: rgba(255, 255, 255, 0.7);
                    margin-bottom: 0.5rem;
                }
                .hoof-icon {
                    font-size: 2rem;
                    margin-bottom: 0.5rem;
                }
                .shoe-status {
                    font-size: 1.5rem;
                }
            </style>
        `;
    }

    setupShoeingActivity(horse) {
        const hooves = document.querySelectorAll('.hoof');
        let completed = 0;

        hooves.forEach(hoof => {
            hoof.addEventListener('click', () => {
                if (hoof.classList.contains('done')) return;

                hoof.classList.add('done');
                hoof.querySelector('.shoe-status').textContent = '✅';
                completed++;

                const progress = (completed / 4) * 100;
                document.getElementById('activity-progress-fill').style.width = progress + '%';

                if (completed >= 4) {
                    horse.shoe();
                    this.showNotification(`${horse.name} on nyt kengitetty!`);
                    setTimeout(() => this.game.endActivity(), 1000);
                }
            });
        });
    }

    getCleaningContent() {
        return `
            <div class="cleaning-activity">
                <div class="cleaning-status" id="cleaning-status">
                    <span class="status-icon">🧹</span>
                    <span class="status-text" id="status-text">Hae ensin talikko!</span>
                </div>
                
                <div class="cleaning-game-area">
                    <!-- Tool storage area -->
                    <div class="tool-storage" id="tool-storage">
                        <div class="tool-item" id="tool-pitchfork" data-tool="pitchfork">
                            <span class="tool-icon">🔱</span>
                            <span class="tool-name">Talikko</span>
                        </div>
                        <div class="tool-item locked" id="tool-wheelbarrow" data-tool="wheelbarrow">
                            <span class="tool-icon">🛒</span>
                            <span class="tool-name">Kottikärryt</span>
                        </div>
                    </div>
                    
                    <!-- Stall area -->
                    <div class="stall-cleaning-area" id="stall-area">
                        <div class="stall-header">
                            <span>🐴 Karsina</span>
                            <span class="manure-count" id="manure-count">Lantaa: 0/8</span>
                        </div>
                        <div class="stall-floor" id="stall-floor">
                            <!-- Manure piles added dynamically -->
                        </div>
                    </div>
                    
                    <!-- Wheelbarrow area -->
                    <div class="wheelbarrow-area hidden" id="wheelbarrow-area">
                        <div class="wheelbarrow-container" id="wheelbarrow-container">
                            <span class="wheelbarrow-icon">🛒</span>
                            <div class="wheelbarrow-fill" id="wheelbarrow-fill"></div>
                            <span class="wheelbarrow-count" id="wheelbarrow-count">0/8</span>
                        </div>
                        <button class="take-to-compost" id="take-to-compost" disabled>
                            Vie lantalaan 🏠
                        </button>
                    </div>
                    
                    <!-- Compost/manure pit -->
                    <div class="compost-area hidden" id="compost-area">
                        <div class="compost-pit">
                            <span class="compost-icon">🏔️</span>
                            <span class="compost-label">Lantala</span>
                        </div>
                        <button class="dump-button" id="dump-button">
                            Tyhjennä kärryt! 💩
                        </button>
                    </div>
                </div>
            </div>
            <style>
                .cleaning-activity {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                .cleaning-status {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.75rem 1rem;
                    background: rgba(218, 165, 32, 0.2);
                    border: 1px solid rgba(218, 165, 32, 0.4);
                    border-radius: 8px;
                }
                .status-icon {
                    font-size: 1.5rem;
                }
                .status-text {
                    font-weight: 600;
                }
                .cleaning-game-area {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                .tool-storage {
                    display: flex;
                    gap: 1rem;
                    justify-content: center;
                }
                .tool-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 1rem 1.5rem;
                    background: rgba(139, 69, 19, 0.3);
                    border: 2px solid #8B4513;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                .tool-item:hover:not(.locked):not(.selected) {
                    transform: translateY(-4px);
                    border-color: #DAA520;
                    box-shadow: 0 4px 12px rgba(218, 165, 32, 0.3);
                }
                .tool-item.selected {
                    background: rgba(74, 222, 128, 0.3);
                    border-color: #4ade80;
                    transform: scale(1.05);
                }
                .tool-item.locked {
                    opacity: 0.4;
                    cursor: not-allowed;
                }
                .tool-icon {
                    font-size: 2rem;
                    margin-bottom: 0.25rem;
                }
                .tool-name {
                    font-size: 0.875rem;
                    font-weight: 500;
                }
                .stall-cleaning-area {
                    background: linear-gradient(135deg, #F5DEB3 0%, #DEB887 100%);
                    border-radius: 12px;
                    padding: 0.75rem;
                    border: 2px solid #8B4513;
                }
                .stall-header {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 0.5rem;
                    font-weight: 600;
                    color: #5D4037;
                }
                .stall-floor {
                    position: relative;
                    height: 180px;
                    background: linear-gradient(180deg, #E8D4A8 0%, #D4C4A0 100%);
                    border-radius: 8px;
                    border: 1px solid rgba(139, 69, 19, 0.3);
                }
                .manure-pile {
                    position: absolute;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    user-select: none;
                }
                .manure-pile:hover {
                    transform: scale(1.15);
                    filter: brightness(1.1);
                }
                .manure-pile.collected {
                    animation: collectManure 0.5s ease forwards;
                }
                @keyframes collectManure {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.3) translateY(-20px); }
                    100% { transform: scale(0); opacity: 0; }
                }
                .wheelbarrow-area {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 1rem;
                    background: rgba(100, 100, 100, 0.2);
                    border-radius: 12px;
                    border: 2px dashed rgba(255,255,255,0.3);
                }
                .wheelbarrow-container {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.75rem;
                    background: rgba(139, 69, 19, 0.4);
                    border-radius: 8px;
                }
                .wheelbarrow-icon {
                    font-size: 2.5rem;
                }
                .wheelbarrow-fill {
                    flex: 1;
                    height: 24px;
                    background: rgba(0,0,0,0.2);
                    border-radius: 4px;
                    overflow: hidden;
                }
                .wheelbarrow-fill::after {
                    content: '';
                    display: block;
                    height: 100%;
                    width: var(--fill-percent, 0%);
                    background: linear-gradient(90deg, #5D4037 0%, #795548 100%);
                    transition: width 0.3s ease;
                }
                .wheelbarrow-count {
                    font-weight: 700;
                    min-width: 40px;
                }
                .take-to-compost {
                    padding: 0.75rem 1.25rem;
                    background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
                    border: none;
                    border-radius: 8px;
                    color: white;
                    font-family: inherit;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                .take-to-compost:disabled {
                    opacity: 0.4;
                    cursor: not-allowed;
                }
                .take-to-compost:not(:disabled):hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(74, 222, 128, 0.4);
                }
                .compost-area {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 1rem;
                    padding: 1.5rem;
                    background: linear-gradient(135deg, #5D4037 0%, #795548 100%);
                    border-radius: 12px;
                }
                .compost-pit {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                .compost-icon {
                    font-size: 4rem;
                }
                .compost-label {
                    font-weight: 700;
                    font-size: 1.25rem;
                    margin-top: 0.5rem;
                }
                .dump-button {
                    padding: 1rem 2rem;
                    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
                    border: none;
                    border-radius: 12px;
                    color: white;
                    font-family: inherit;
                    font-size: 1.125rem;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    animation: pulse 2s ease infinite;
                }
                .dump-button:hover {
                    transform: scale(1.05);
                    box-shadow: 0 6px 20px rgba(245, 158, 11, 0.5);
                }
                @keyframes pulse {
                    0%, 100% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.4); }
                    50% { box-shadow: 0 0 0 10px rgba(245, 158, 11, 0); }
                }
                .hidden {
                    display: none !important;
                }
            </style>
        `;
    }

    setupCleaningActivity(horse) {
        const stallFloor = document.getElementById('stall-floor');
        if (!stallFloor) return;

        // Game state
        let state = 'get-pitchfork'; // get-pitchfork, collect-manure, take-to-compost, dumping
        let hasPitchfork = false;
        let hasWheelbarrow = false;
        let collectedManure = 0;
        const totalManure = 8;

        // ===== 3D SCENE SETUP =====
        const stallIndex = horse.stallIndex || 0;
        const stallPosition = this.game.stable.getStallPosition(stallIndex);
        const cameraSetup = this.game.stable.getStallCameraPosition(stallIndex);

        // Store original camera position for restoration
        const originalCameraPos = this.game.camera.position.clone();
        const originalTarget = this.game.orbitControls.target.clone();

        // Move camera to view the stall
        this.game.camera.position.copy(cameraSetup.position);
        this.game.camera.lookAt(cameraSetup.target);
        this.game.orbitControls.target.copy(cameraSetup.target);
        this.game.orbitControls.enabled = false;

        // Create 3D manure piles in the stall
        const manurePiles3D = this.game.stable.createManurePiles(stallIndex, totalManure);

        // Create wheelbarrow in scene
        const wheelbarrow3D = this.game.stable.createWheelbarrow(stallIndex);
        wheelbarrow3D.visible = false; // Will be shown when player gets it

        // Create pitchfork for player to hold
        const pitchfork3D = this.game.stable.createPitchforkItem();

        // Enter cleaning mode with player visible in stall
        this.game.player.enterCleaningMode(stallPosition, null); // Pitchfork added when selected

        const updateStatus = (icon, text) => {
            document.getElementById('status-text').textContent = text;
            document.querySelector('.status-icon').textContent = icon;
        };

        const updateProgress = () => {
            const progress = state === 'dumping' ? 100 : (collectedManure / totalManure) * 80;
            document.getElementById('activity-progress-fill').style.width = progress + '%';
        };

        // Cleanup function - called when activity ends
        const cleanup3D = () => {
            // Remove 3D manure piles
            manurePiles3D.forEach(pile => {
                if (pile.parent) pile.parent.remove(pile);
            });
            // Remove wheelbarrow
            if (wheelbarrow3D.parent) wheelbarrow3D.parent.remove(wheelbarrow3D);
            // Exit cleaning mode
            this.game.player.exitCleaningMode();
            // Restore camera
            this.game.camera.position.copy(originalCameraPos);
            this.game.orbitControls.target.copy(originalTarget);
            this.game.orbitControls.enabled = true;
        };

        // Store cleanup for endActivity
        this.cleanupCurrentActivity = cleanup3D;

        // Add manure piles to UI stall floor (2D indicators)
        const manurePilesUI = [];
        for (let i = 0; i < totalManure; i++) {
            const pile = document.createElement('div');
            pile.className = 'manure-pile';
            pile.innerHTML = '💩';
            pile.style.fontSize = (1.5 + Math.random() * 1) + 'rem';
            pile.style.left = (10 + Math.random() * 75) + '%';
            pile.style.top = (10 + Math.random() * 70) + '%';

            pile.addEventListener('click', () => {
                if (state !== 'collect-manure' || !hasPitchfork) {
                    this.showNotification('Hae ensin talikko!');
                    return;
                }
                if (pile.classList.contains('collected')) return;

                pile.classList.add('collected');

                // Remove corresponding 3D pile
                if (manurePiles3D[i] && manurePiles3D[i].parent) {
                    this.game.stable.removeManurePile(manurePiles3D[i]);
                }

                collectedManure++;

                // Update wheelbarrow
                document.getElementById('wheelbarrow-count').textContent = `${collectedManure}/${totalManure}`;
                document.getElementById('wheelbarrow-fill').style.setProperty('--fill-percent', `${(collectedManure / totalManure) * 100}%`);
                document.getElementById('manure-count').textContent = `Kerätty: ${collectedManure}/${totalManure}`;

                updateProgress();

                if (collectedManure >= totalManure) {
                    state = 'take-to-compost';
                    updateStatus('✅', 'Kaikki lanta kerätty! Vie kärryt lantalaan.');
                    document.getElementById('take-to-compost').disabled = false;
                } else {
                    updateStatus('🔱', `Kerää talikon avulla lanta karsinasta! (${collectedManure}/${totalManure})`);
                }
            });

            manurePilesUI.push(pile);
            stallFloor.appendChild(pile);
        }

        // Tool selection - Pitchfork
        document.getElementById('tool-pitchfork').addEventListener('click', () => {
            if (hasPitchfork) return;

            hasPitchfork = true;
            document.getElementById('tool-pitchfork').classList.add('selected');
            document.getElementById('tool-wheelbarrow').classList.remove('locked');

            // Give pitchfork to player in 3D
            if (this.game.player.mesh) {
                pitchfork3D.position.set(0.35, 0.3, 0.2);
                pitchfork3D.rotation.set(0.3, 0, -0.2);
                this.game.player.mesh.add(pitchfork3D);
                this.game.player.heldItem = pitchfork3D;
            }

            updateStatus('🔱', 'Hyvä! Hae nyt kottikärryt.');
            state = 'get-wheelbarrow';
        });


        // Tool selection - Wheelbarrow
        document.getElementById('tool-wheelbarrow').addEventListener('click', () => {
            if (!hasPitchfork) {
                this.showNotification('Hae ensin talikko!');
                return;
            }
            if (hasWheelbarrow) return;

            hasWheelbarrow = true;
            document.getElementById('tool-wheelbarrow').classList.add('selected');
            document.getElementById('wheelbarrow-area').classList.remove('hidden');

            // Show 3D wheelbarrow
            wheelbarrow3D.visible = true;

            state = 'collect-manure';
            updateStatus('🔱', `Kerää talikon avulla lanta karsinasta! (0/${totalManure})`);
            document.getElementById('manure-count').textContent = `Kerätty: 0/${totalManure}`;
        });


        // Take to compost button
        document.getElementById('take-to-compost').addEventListener('click', () => {
            if (collectedManure < totalManure) return;

            // Hide stall, show compost
            document.getElementById('tool-storage').classList.add('hidden');
            document.querySelector('.stall-cleaning-area').classList.add('hidden');
            document.getElementById('wheelbarrow-area').classList.add('hidden');
            document.getElementById('compost-area').classList.remove('hidden');

            updateStatus('🛒', 'Tyhjennä kärryt lantalaan!');
        });

        // Dump button
        document.getElementById('dump-button').addEventListener('click', () => {
            state = 'dumping';
            updateProgress();

            // Animation for dumping
            document.getElementById('dump-button').textContent = 'Tyhjennetään... 💨';
            document.getElementById('dump-button').disabled = true;

            setTimeout(() => {
                this.game.stable.cleanStall(horse.stallIndex);
                updateStatus('🎉', 'Karsina on nyt puhdas!');
                this.showNotification(`${horse.name}n karsina on siivottu!`);

                setTimeout(() => this.game.endActivity(), 1500);
            }, 1500);
        });
    }


    getSwimmingContent() {
        return `
            <div class="swimming-activity">
                <p class="activity-instruction">Hevonen nauttii uimisesta!</p>
                <div class="swimming-area">
                    <div class="water-surface"></div>
                    <div class="swimming-horse">🐴</div>
                </div>
                <button class="swim-done-btn" id="swim-done">Lopeta uinti</button>
            </div>
            <style>
                .swimming-area {
                    position: relative;
                    width: 100%;
                    height: 200px;
                    background: linear-gradient(180deg, #87CEEB 0%, #1E90FF 50%, #0066CC 100%);
                    border-radius: 12px;
                    overflow: hidden;
                }
                .water-surface {
                    position: absolute;
                    top: 50%;
                    left: 0;
                    right: 0;
                    height: 4px;
                    background: rgba(255, 255, 255, 0.5);
                    animation: wave 2s ease-in-out infinite;
                }
                @keyframes wave {
                    0%, 100% { transform: translateY(0) scaleY(1); }
                    50% { transform: translateY(-5px) scaleY(1.5); }
                }
                .swimming-horse {
                    position: absolute;
                    top: 45%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    font-size: 4rem;
                    animation: swim 3s ease-in-out infinite;
                }
                @keyframes swim {
                    0%, 100% { transform: translate(-50%, -50%) rotate(-5deg); }
                    50% { transform: translate(-50%, -45%) rotate(5deg); }
                }
                .swim-done-btn {
                    display: block;
                    width: 100%;
                    margin-top: 1rem;
                    padding: 1rem;
                    font-family: inherit;
                    font-size: 1rem;
                    font-weight: 600;
                    background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
                    border: none;
                    border-radius: 8px;
                    color: white;
                    cursor: pointer;
                    transition: transform 0.2s ease;
                }
                .swim-done-btn:hover {
                    transform: translateY(-2px);
                }
            </style>
        `;
    }

    setupSwimmingActivity(horse) {
        horse.startSwimming();

        // Auto-progress the activity
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += 2;
            document.getElementById('activity-progress-fill').style.width = progress + '%';

            if (progress >= 100) {
                clearInterval(progressInterval);
            }
        }, 200);

        const doneBtn = document.getElementById('swim-done');
        if (doneBtn) {
            doneBtn.addEventListener('click', () => {
                clearInterval(progressInterval);
                horse.stopSwimming();
                this.showNotification(`${horse.name} nautti uinnista ja on nyt virkistynyt!`);
                this.game.endActivity();
            });
        }
    }

    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <span class="notification-icon">🐴</span>
            <span class="notification-text">${message}</span>
        `;

        // Add styles if not already in document
        if (!document.getElementById('notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 80px;
                    left: 50%;
                    transform: translateX(-50%) translateY(-20px);
                    background: rgba(26, 26, 46, 0.95);
                    border: 1px solid rgba(218, 165, 32, 0.5);
                    border-radius: 12px;
                    padding: 12px 24px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    z-index: 1000;
                    animation: slideDown 0.3s ease forwards;
                    backdrop-filter: blur(10px);
                }
                .notification-icon {
                    font-size: 1.5rem;
                }
                .notification-text {
                    font-size: 1rem;
                    color: #fff;
                }
                @keyframes slideDown {
                    to {
                        transform: translateX(-50%) translateY(0);
                        opacity: 1;
                    }
                }
                @keyframes slideUp {
                    to {
                        transform: translateX(-50%) translateY(-20px);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(styles);
        }

        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideUp 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    showSettings() {
        // Settings modal (simplified for now)
        this.showNotification('Asetukset tulossa pian!');
    }

    showHelp() {
        const overlay = document.getElementById('activity-overlay');
        const title = document.getElementById('activity-title');
        const container = document.getElementById('activity-container');

        if (!overlay || !container) return;

        overlay.classList.remove('hidden');
        title.textContent = 'Ohjeet';

        container.innerHTML = `
            <div class="help-content">
                <h3>🎮 Ohjaus</h3>
                <ul>
                    <li><strong>WASD / Nuolinäppäimet</strong> - Liiku</li>
                    <li><strong>Hiiri</strong> - Käännä kameraa</li>
                    <li><strong>E</strong> - Interaktio</li>
                    <li><strong>ESC</strong> - Valikko/Tauko</li>
                    <li><strong>Välilyönti</strong> - Hyppää (ratsastaessa)</li>
                </ul>
                
                <h3>🐴 Hevosten hoito</h3>
                <ul>
                    <li><strong>Harjaus</strong> - Pitää hevosen puhtaana</li>
                    <li><strong>Ruokinta</strong> - Täyttää nälän ja antaa energiaa</li>
                    <li><strong>Pesu</strong> - Puhdistaa hevosen perusteellisesti</li>
                    <li><strong>Kengitys</strong> - Huolehtii kavioiden kunnosta</li>
                    <li><strong>Siivous</strong> - Puhdistaa karsinan</li>
                </ul>
                
                <h3>🏇 Ratsastus</h3>
                <ul>
                    <li><strong>Esteratsastus</strong> - Hyppää esteiden yli kentällä</li>
                    <li><strong>Kouluratsastus</strong> - Suorita liikkeitä kouluradalla</li>
                    <li><strong>Lännenratsastus</strong> - Western-tyylinen ratsastus</li>
                    <li><strong>Maastoratsastus</strong> - Tutustu luontopolkuihin</li>
                </ul>
            </div>
            <style>
                .help-content {
                    text-align: left;
                }
                .help-content h3 {
                    margin: 1rem 0 0.5rem;
                    color: #DAA520;
                }
                .help-content ul {
                    list-style: none;
                    padding: 0;
                }
                .help-content li {
                    padding: 0.25rem 0;
                    color: rgba(255, 255, 255, 0.8);
                }
                .help-content strong {
                    color: #fff;
                }
            </style>
        `;

        // Hide progress bar for help
        document.querySelector('.activity-progress').style.display = 'none';
    }

    updateMinimap() {
        const canvas = document.getElementById('minimap-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        // Clear
        ctx.fillStyle = '#4a7c23';
        ctx.fillRect(0, 0, width, height);

        // Scale factor (world coords to minimap coords)
        const scale = width / 200;
        const offsetX = width / 2;
        const offsetY = height / 2;

        // Draw stable
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(offsetX - 10 * scale, offsetY - 6 * scale, 20 * scale, 12 * scale);

        // Draw paddock
        ctx.strokeStyle = '#654321';
        ctx.lineWidth = 2;
        ctx.strokeRect(offsetX + 25 * scale, offsetY - 15 * scale, 30 * scale, 30 * scale);

        // Draw water
        ctx.fillStyle = '#1E90FF';
        ctx.beginPath();
        ctx.arc(offsetX - 50 * scale, offsetY + 30 * scale, 15 * scale, 0, Math.PI * 2);
        ctx.fill();

        // Draw arenas
        ctx.fillStyle = '#D2691E';
        ctx.fillRect(offsetX + 60 * scale, offsetY - 30 * scale, 40 * scale, 60 * scale);

        // Draw horses
        ctx.fillStyle = '#000';
        this.game.horses.forEach(horse => {
            if (horse.mesh) {
                const x = offsetX + horse.position.x * scale;
                const y = offsetY + horse.position.z * scale;
                ctx.beginPath();
                ctx.arc(x, y, 3, 0, Math.PI * 2);
                ctx.fill();
            }
        });

        // Draw player
        if (this.game.player) {
            ctx.fillStyle = '#FF0000';
            const x = offsetX + this.game.player.position.x * scale;
            const y = offsetY + this.game.player.position.z * scale;
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}
