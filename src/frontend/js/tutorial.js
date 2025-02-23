import { API_BASE_URL } from './config.js';

class Tutorial {
    constructor() {
        this.currentTutorial = this.getTutorialIdFromUrl() || 1;
        this.maxTutorials = 0; // Will be set by loadTutorialCount
        this.loadTutorialCount().then(() => {
            this.setupEventListeners();
            this.loadTutorialContent();
        });

        // Listen for browser navigation events
        window.addEventListener('popstate', (event) => {
            this.currentTutorial = this.getTutorialIdFromUrl() || 1;
            this.loadTutorialContent();
        });
    }

    getTutorialIdFromUrl() {
        const path = window.location.pathname;
        const match = path.match(/\/tutorials\/(\d+)/);
        return match ? parseInt(match[1]) : null;
    }

    setupEventListeners() {
        document.querySelectorAll('.try-btn').forEach(button => {
            button.addEventListener('click', async (e) => {
                const query = e.target.dataset.query;
                await this.tryQuery(query);
            });
        });

        // Add navigation listeners with bounds checking
        document.getElementById('prev-tutorial')?.addEventListener('click', () => {
            if (this.currentTutorial > 1) {
                this.currentTutorial--;
                this.loadTutorialContent();
            }
            this.updateNavigationButtons();
        });

        document.getElementById('next-tutorial')?.addEventListener('click', () => {
            if (this.currentTutorial < this.maxTutorials) {
                this.currentTutorial++;
                this.loadTutorialContent();
            }
            this.updateNavigationButtons();
        });

        this.updateNavigationButtons();
    }

    navigateToTutorial(tutorialId) {
        if (tutorialId < 1 || tutorialId > this.maxTutorials) return;
        
        // Update URL without reload
        const newUrl = `/tutorials/${tutorialId}`;
        window.history.pushState({ tutorialId }, '', newUrl);
        
        this.currentTutorial = tutorialId;
        this.loadTutorialContent();
    }

    async loadTutorialCount() {
        try {
            const response = await fetch(`${API_BASE_URL}/tutorials`);
            if (!response.ok) throw new Error('Failed to fetch tutorials');
            
            const tutorials = await response.json();
            this.maxTutorials = tutorials.length;
            this.updateNavigationButtons();
            this.updateTutorialNumber();
            
            // Validate current tutorial is within bounds
            if (this.currentTutorial > this.maxTutorials) {
                this.currentTutorial = this.maxTutorials;
                this.navigateToTutorial(this.currentTutorial);
            }
        } catch (error) {
            console.error('Error loading tutorial count:', error);
            this.showError('Failed to load tutorials. Please try again.');
        }
    }

    updateNavigationButtons() {
        const prevBtn = document.getElementById('prev-tutorial');
        const nextBtn = document.getElementById('next-tutorial');
        
        if (prevBtn) {
            const isPrevDisabled = this.currentTutorial <= 1;
            prevBtn.classList.toggle('disabled', isPrevDisabled);
            
            if (!isPrevDisabled) {
                prevBtn.onclick = (e) => {
                    e.preventDefault();
                    this.navigateToTutorial(this.currentTutorial - 1);
                };
            }
        }
        
        if (nextBtn) {
            const isNextDisabled = this.currentTutorial >= this.maxTutorials;
            nextBtn.classList.toggle('disabled', isNextDisabled);
            
            if (!isNextDisabled) {
                nextBtn.onclick = (e) => {
                    e.preventDefault();
                    this.navigateToTutorial(this.currentTutorial + 1);
                };
            }
        }

        // Update URL without triggering page reload
        const url = `/tutorials/${this.currentTutorial}`;
        window.history.pushState({ tutorialId: this.currentTutorial }, '', url);
    }

    async navigateToTutorial(tutorialId) {
        if (tutorialId < 1 || tutorialId > this.maxTutorials) return;
        
        this.currentTutorial = tutorialId;
        await this.loadTutorialContent();
        this.updateNavigationButtons();
        this.updateTutorialNumber();
    }

    updateTutorialNumber() {
        const tutorialNumber = document.getElementById('tutorial-number');
        if (tutorialNumber) {
            tutorialNumber.textContent = `Tutorial ${this.currentTutorial} of ${this.maxTutorials}`;
        }
    }

    async loadTutorialContent() {
        try {
            const response = await fetch(`${API_BASE_URL}/tutorials/${this.currentTutorial}`);
            if (!response.ok) {
                throw new Error(`Tutorial ${this.currentTutorial} not found`);
            }
            const tutorial = await response.json();
            this.displayTutorial(tutorial);
        } catch (error) {
            console.error('Error loading tutorial:', error);
            this.showError(`Failed to load tutorial ${this.currentTutorial}`);
            this.currentTutorial = Math.min(this.currentTutorial, this.maxTutorials);
        }
    }

    async tryQuery(query) {
        try {
            const response = await fetch(`${API_BASE_URL}/try-query`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: query.trim() })
            });

            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.error || 'Failed to execute query');
            }

            this.showQueryResult(result);
        } catch (error) {
            console.error('Error executing query:', error);
            this.showError(error.message || 'Failed to execute query. Please check your syntax.');
        }
    }

    displayTutorial(tutorial) {
        const content = document.getElementById('tutorial-content');
        if (!content || !tutorial) return;

        content.innerHTML = `
            <h4>${tutorial.title || 'Tutorial Not Available'}</h4>
            <p>${tutorial.description || ''}</p>
            <div class="examples mt-4">
                ${Array.isArray(tutorial.examples) ? tutorial.examples.map(example => `
                    <div class="example-card card mb-3">
                        <div class="card-body">
                            <h5 class="card-title">${example.description}</h5>
                            <pre class="bg-light p-2"><code>${example.query}</code></pre>
                            <p class="text-muted">${example.explanation}</p>
                            <button class="btn btn-primary try-btn" data-query="${example.query}">
                                <i class="bi bi-play-fill"></i> Try It
                            </button>
                        </div>
                    </div>
                `).join('') : '<p>No examples available for this tutorial.</p>'}
            </div>
        `;
        this.setupEventListeners();
        this.updateTutorialNumber();
        this.updateNavigationButtons();
    }

    showQueryResult(result) {
        const resultArea = document.getElementById('query-result');
        if (!resultArea) return;

        if (!result.success) {
            resultArea.innerHTML = `
                <div class="alert alert-danger">
                    <i class="bi bi-exclamation-triangle"></i> ${result.error}
                    ${result.hint ? `<br><small>${result.hint}</small>` : ''}
                </div>
            `;
            return;
        }

        resultArea.innerHTML = `
            <div class="card mt-3">
                <div class="card-header ${result.success ? 'bg-success' : 'bg-danger'} text-white">
                    <i class="bi bi-check-circle"></i> Query Result
                    ${result.result.rowCount ? `(${result.result.rowCount} rows)` : ''}
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        ${this.formatQueryResult(result)}
                    </div>
                </div>
            </div>
        `;
    }

    formatQueryResult(result) {
        if (!result.result?.rows?.length) {
            return '<p>No results returned</p>';
        }

        return `
            <table class="table table-sm">
                <thead>
                    <tr>
                        ${result.result.fields.map(field => 
                            `<th>${field}</th>`
                        ).join('')}
                    </tr>
                </thead>
                <tbody>
                    ${result.result.rows.map(row => `
                        <tr>
                            ${result.result.fields.map(field => 
                                `<td>${row[field]}</td>`
                            ).join('')}
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    showError(message) {
        const errorArea = document.getElementById('error-message');
        if (errorArea) {
            errorArea.innerHTML = `
                <div class="alert alert-danger">
                    <i class="bi bi-exclamation-triangle"></i> ${message}
                </div>
            `;
        }
    }
}

// Initialize the tutorial
new Tutorial();
