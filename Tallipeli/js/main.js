/**
 * Tallipeli - Main Entry Point
 * 3D Horse Stable Simulator
 */

import { Game } from './game/Game.js';

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the game
    const game = new Game();
    
    // Start loading
    game.init().then(() => {
        console.log('🐴 Tallipeli initialized successfully!');
    }).catch(error => {
        console.error('Failed to initialize game:', error);
    });
    
    // Expose game instance for debugging
    window.game = game;
});
