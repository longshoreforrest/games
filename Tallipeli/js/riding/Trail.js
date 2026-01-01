/**
 * Trail - Cross-Country Trail Riding
 * Manages trail exploration and discovery
 */

import * as THREE from 'three';

export class Trail {
    constructor(game) {
        this.game = game;
        this.checkpoints = [];
        this.visitedCheckpoints = new Set();
        this.isActive = false;
        this.discoveries = [];

        // Points of interest on the trail
        this.pointsOfInterest = [
            { name: 'Vanha tammi', x: -40, z: 60, description: 'Satoja vuosia vanha tammi', discovered: false },
            { name: 'Joen ylitys', x: -60, z: 55, description: 'Matala kohta joen yli', discovered: false },
            { name: 'Metsäaukio', x: -80, z: 70, description: 'Kaunis aurinkoinen aukio', discovered: false },
            { name: 'Kallio', x: -100, z: 60, description: 'Korkealta näkee kauas', discovered: false },
            { name: 'Kukkakedokke', x: -90, z: 40, description: 'Villikkukkien täyttämä kenttä', discovered: false },
            { name: 'Lahden ranta', x: -70, z: 30, description: 'Rauhallinen rantapaikka', discovered: false }
        ];
    }

    start(horse) {
        this.horse = horse;
        this.visitedCheckpoints.clear();
        this.isActive = true;

        // Reset discoveries for this ride
        this.pointsOfInterest.forEach(poi => poi.discovered = false);

        // Position horse at trail start
        horse.mesh.position.set(-20, 0, 50);
        horse.mesh.rotation.y = -Math.PI / 2;

        // Show trail UI
        this.showUI();
    }

    showUI() {
        const hud = document.createElement('div');
        hud.id = 'trail-hud';
        hud.innerHTML = `
            <div class="trail-info">
                <h3>🌲 Maastoratsastus</h3>
                <p class="trail-hint">Tutustu luontopolkuun ja löydä mielenkiintoisia paikkoja!</p>
                <div class="discoveries-list" id="discoveries-list">
                    <p class="no-discoveries">Ei löytöjä vielä...</p>
                </div>
                <div class="trail-stats">
                    <span>Löydetty: <strong id="discovery-count">0</strong>/${this.pointsOfInterest.length}</span>
                </div>
            </div>
            <button id="stop-trail" class="stop-btn">Palaa tallille</button>
        `;

        const styles = document.createElement('style');
        styles.id = 'trail-styles';
        styles.textContent = `
            #trail-hud {
                position: fixed;
                top: 80px;
                right: 20px;
                width: 280px;
                background: rgba(26, 26, 46, 0.95);
                border: 1px solid rgba(34, 139, 34, 0.7);
                border-radius: 12px;
                padding: 16px;
                z-index: 200;
                backdrop-filter: blur(10px);
            }
            .trail-info h3 {
                margin: 0 0 8px 0;
                color: #228B22;
            }
            .trail-hint {
                font-size: 0.875rem;
                color: rgba(255, 255, 255, 0.7);
                margin-bottom: 12px;
            }
            .discoveries-list {
                max-height: 200px;
                overflow-y: auto;
                margin-bottom: 12px;
            }
            .no-discoveries {
                font-size: 0.875rem;
                color: rgba(255, 255, 255, 0.5);
                text-align: center;
                font-style: italic;
            }
            .discovery-item {
                background: rgba(34, 139, 34, 0.2);
                border: 1px solid rgba(34, 139, 34, 0.5);
                border-radius: 8px;
                padding: 8px 12px;
                margin-bottom: 8px;
                animation: slideIn 0.3s ease;
            }
            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateX(20px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            .discovery-name {
                font-weight: 600;
                color: #4ade80;
                display: block;
            }
            .discovery-desc {
                font-size: 0.75rem;
                color: rgba(255, 255, 255, 0.7);
            }
            .trail-stats {
                text-align: center;
                padding-top: 8px;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
            }
        `;

        document.head.appendChild(styles);
        document.body.appendChild(hud);

        document.getElementById('stop-trail').addEventListener('click', () => this.stop());
    }

    hideUI() {
        const hud = document.getElementById('trail-hud');
        const styles = document.getElementById('trail-styles');
        if (hud) hud.remove();
        if (styles) styles.remove();
    }

    update(delta) {
        if (!this.isActive) return;

        this.checkDiscoveries();
    }

    checkDiscoveries() {
        const horsePos = this.horse.mesh.position;

        this.pointsOfInterest.forEach((poi, index) => {
            if (poi.discovered) return;

            const distance = Math.sqrt(
                Math.pow(horsePos.x - poi.x, 2) +
                Math.pow(horsePos.z - poi.z, 2)
            );

            if (distance < 8) {
                this.discover(poi, index);
            }
        });
    }

    discover(poi, index) {
        poi.discovered = true;

        // Update UI
        const list = document.getElementById('discoveries-list');
        const noDiscoveries = list.querySelector('.no-discoveries');
        if (noDiscoveries) noDiscoveries.remove();

        const item = document.createElement('div');
        item.className = 'discovery-item';
        item.innerHTML = `
            <span class="discovery-name">🌟 ${poi.name}</span>
            <span class="discovery-desc">${poi.description}</span>
        `;
        list.appendChild(item);

        // Update count
        const discovered = this.pointsOfInterest.filter(p => p.discovered).length;
        document.getElementById('discovery-count').textContent = discovered;

        // Show notification
        this.game.ui.showNotification(`Löysit: ${poi.name}! 🎉`);

        // Bonus for horse happiness
        this.horse.stats.happiness = Math.min(100, this.horse.stats.happiness + 5);

        // Check if all discovered
        if (discovered >= this.pointsOfInterest.length) {
            this.completeTrail();
        }
    }

    completeTrail() {
        this.game.ui.showNotification('Löysit kaikki paikat! Olet todellinen maastontutkija! 🏆🌲');

        // Big bonus for completing the trail
        this.horse.stats.happiness = 100;
        this.horse.stats.energy = Math.min(100, this.horse.stats.energy + 20);
    }

    stop() {
        this.isActive = false;
        this.hideUI();

        const discovered = this.pointsOfInterest.filter(p => p.discovered).length;

        if (discovered > 0) {
            this.game.ui.showNotification(
                `Maastolenkki valmis! Löysit ${discovered}/${this.pointsOfInterest.length} paikkaa.`
            );
        }

        this.game.player.dismountHorse();
        this.horse.moveToStall();
    }
}
