import { API_BASE_URL } from './config.js';

class LevelsManager {
    constructor() {
        this.levels = [];
        this.loadLevels();
    }

    async loadLevels() {
        try {
            // First, fetch all levels data
            const response = await fetch(`${API_BASE_URL}/levels`);
            if (!response.ok) throw new Error('Failed to fetch levels');
            
            const data = await response.json();
            if (!Array.isArray(data)) throw new Error('Invalid levels data format');
            
            this.levels = data;
            this.setupLevels();
            
            // Then load progress separately
            await this.loadLevelProgress();
        } catch (error) {
            console.error('Error loading levels:', error);
            this.showError('Failed to load levels. Please try again.');
        }
    }

    setupLevels() {
        const levelsContainer = document.getElementById('levels-container');
        if (!levelsContainer || !Array.isArray(this.levels)) return;

        levelsContainer.innerHTML = this.levels.map(level => `
            <div class="col-md-6 mb-4">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Level ${level.id}: ${level.name}</h5>
                        <p class="card-text">Topics: ${level.topics ? level.topics.join(', ') : 'None'}</p>
                        <div class="progress mb-3">
                            <div class="progress-bar" role="progressbar" 
                                 data-level="${level.id}" 
                                 style="width: ${level.completed || 0}%">
                            </div>
                        </div>
                        <button class="btn btn-primary start-level" data-level="${level.id}">
                            Start Level
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        this.setupEventListeners();
    }

    showError(message) {
        const container = document.getElementById('levels-container');
        if (container) {
            container.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-danger">
                        <i class="bi bi-exclamation-triangle"></i> ${message}
                    </div>
                </div>
            `;
        }
    }

    setupEventListeners() {
        document.querySelectorAll('.start-level').forEach(button => {
            button.addEventListener('click', (e) => {
                const levelId = e.target.dataset.level;
                this.startLevel(levelId);
            });
        });
    }

    async loadLevelProgress() {
        try {
            const response = await fetch(`${API_BASE_URL}/progress`);
            if (!response.ok) throw new Error('Failed to fetch progress');
            
            const data = await response.json();
            if (data.levels) {
                this.updateLevelProgress(data.levels);
            }
        } catch (error) {
            console.error('Error loading progress:', error);
        }
    }

    updateLevelProgress(progressData) {
        progressData.forEach(levelProgress => {
            const progressBar = document.querySelector(`.progress-bar[data-level="${levelProgress.id}"]`);
            if (progressBar) {
                const percentage = levelProgress.completed || 0;
                progressBar.style.width = `${percentage}%`;
                progressBar.setAttribute('aria-valuenow', percentage);
            }
        });
    }

    startLevel(levelId) {
        window.location.href = `index.html?level=${levelId}`;
    }
}

new LevelsManager();
