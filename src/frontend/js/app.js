import { API_BASE_URL } from './config.js';
import Game from './game.js';

document.addEventListener('DOMContentLoaded', () => {
    window.API_BASE_URL = API_BASE_URL; // Make it available globally if needed
    new Game();
});