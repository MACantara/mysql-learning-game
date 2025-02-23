import { API_BASE_URL } from './config.js';

class TutorialsList {
    constructor() {
        this.tutorials = [];
        this.loadTutorials();
    }

    async loadTutorials() {
        try {
            const response = await fetch(`${API_BASE_URL}/tutorials`);
            if (!response.ok) throw new Error('Failed to fetch tutorials');
            
            const tutorials = await response.json();
            this.tutorials = tutorials;
            this.displayTutorials();
        } catch (error) {
            console.error('Error loading tutorials:', error);
            this.showError('Failed to load tutorials. Please try again.');
        }
    }

    displayTutorials() {
        const container = document.getElementById('tutorials-container');
        if (!container) return;

        container.innerHTML = this.tutorials.map(tutorial => `
            <div class="col-md-6 mb-4">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">
                            <i class="bi bi-book"></i> ${tutorial.title}
                        </h5>
                        <p class="card-text">${tutorial.description}</p>
                        <a href="/tutorials/${tutorial.id}" class="btn btn-primary">
                            <i class="bi bi-play-fill"></i> Start Tutorial
                        </a>
                    </div>
                </div>
            </div>
        `).join('');
    }

    showError(message) {
        const container = document.getElementById('tutorials-container');
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
}

new TutorialsList();
