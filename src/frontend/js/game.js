import { API_BASE_URL } from './config.js';

class Game {
    constructor() {
        this.currentQuestion = null;
        this.score = 0;
        this.level = this.getLevelFromUrl() || 1;
        this.tutorials = {
            1: "Basic SQL Queries: SELECT, INSERT, UPDATE, DELETE",
            2: "Table Operations: CREATE TABLE, ALTER TABLE",
            3: "Joins and Relationships",
            4: "Advanced Queries and Functions"
        };
        this.initialize();
        this.setupGameUI();
    }

    getLevelFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return parseInt(params.get('level')) || 1;
    }

    setupGameUI() {
        const gameArea = document.getElementById('game-area');
        gameArea.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center">
                        <h2 class="card-title">Level ${this.level}</h2>
                        <h2 id="score" class="card-title">Score: ${this.score}</h2>
                    </div>
                    <div class="progress mb-3">
                        <div class="progress-bar" role="progressbar" style="width: 0%"></div>
                    </div>
                    <div id="question-container" class="my-4">
                        <h3 id="question" class="card-text"></h3>
                        <div id="question-hint" class="text-muted small mt-2"></div>
                    </div>
                    <form id="answer-form" class="mt-3">
                        <div class="form-group">
                            <input type="text" 
                                   class="form-control" 
                                   id="answer-input" 
                                   placeholder="Enter your SQL query">
                            <small class="form-text text-muted">
                                <i class="bi bi-lightbulb"></i> Tip: Type your SQL query and press Enter to submit
                            </small>
                        </div>
                        <button type="submit" class="btn btn-primary">
                            <i class="bi bi-check-circle"></i> Submit Answer
                        </button>
                        <button type="button" class="btn btn-secondary" id="hint-btn">
                            <i class="bi bi-question-circle"></i> Get Hint
                        </button>
                    </form>
                    <div id="feedback" class="mt-3"></div>
                </div>
            </div>
        `;
        
        this.setupTutorial();
    }

    setupTutorial() {
        const tutorialContent = document.getElementById('tutorial-content');
        if (tutorialContent && this.currentQuestion) {
            tutorialContent.innerHTML = `
                <div class="tutorial-step">
                    <h5><i class="bi bi-1-circle"></i> ${this.currentQuestion.title}</h5>
                    <p>${this.currentQuestion.description}</p>
                    <div class="introduction mb-3">
                        ${this.currentQuestion.introduction}
                    </div>
                    <div class="examples">
                        <h6>Examples:</h6>
                        ${this.currentQuestion.questions[0].examples.map(example => `
                            <div class="example-item">
                                <p><strong>${example.description}</strong></p>
                                <code class="d-block bg-light p-2">${example.query}</code>
                                <p class="text-muted">${example.explanation}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
    }

    async initialize() {
        try {
            await this.loadQuestion();
            this.setupEventListeners();
        } catch (error) {
            console.error('Failed to initialize game:', error);
            this.showError('Failed to load the game. Please try again.');
        }
    }

    async loadQuestion() {
        try {
            const response = await fetch(`${API_BASE_URL}/questions`);
            if (!response.ok) throw new Error('Failed to fetch question');
            const data = await response.json();
            this.currentQuestion = data;
            this.displayQuestion();
        } catch (error) {
            console.error('Error loading question:', error);
            this.showError('Failed to load question');
        }
    }

    displayQuestion() {
        const questionElement = document.getElementById('question');
        const feedbackElement = document.getElementById('feedback');
        if (questionElement && this.currentQuestion) {
            questionElement.innerHTML = `
                <div class="level-info mb-4">
                    <h2>${this.currentQuestion.title}</h2>
                    <p class="lead">${this.currentQuestion.description}</p>
                    <div class="introduction">
                        ${this.currentQuestion.introduction}
                    </div>
                </div>
                <div class="current-question">
                    <h4>${this.currentQuestion.questions[0].title}</h4>
                    <p>${this.currentQuestion.questions[0].question}</p>
                </div>
            `;
            feedbackElement.innerHTML = '';
        }
    }

    async submitAnswer(answer) {
        try {
            const response = await fetch(`${API_BASE_URL}/check-answer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    questionId: this.currentQuestion.id,
                    answer: answer
                })
            });
            if (!response.ok) throw new Error('Failed to submit answer');
            const result = await response.json();
            this.handleAnswerResult(result);
        } catch (error) {
            console.error('Error submitting answer:', error);
            this.showError('Failed to submit answer');
        }
    }

    handleAnswerResult(result) {
        const feedbackElement = document.getElementById('feedback');
        if (result.correct) {
            this.score += this.level * 10;
            feedbackElement.innerHTML = `
                <div class="alert alert-success">
                    <i class="bi bi-check-circle-fill"></i> Correct! 
                    ${result.explanation || ''}
                </div>
                ${this.formatQueryResult(result.result)}
            `;
        } else {
            feedbackElement.innerHTML = `
                <div class="alert alert-danger">
                    <i class="bi bi-x-circle-fill"></i> Wrong answer. 
                    ${result.error || 'Try again!'}
                </div>`;
        }
        this.updateScore();
        this.updateProgress();
        if (result.correct) {
            setTimeout(() => this.loadQuestion(), 3000);
        }
    }

    formatQueryResult(result) {
        if (!result || !result.rows || !result.rows.length) {
            return '<div class="mt-3">No results returned</div>';
        }

        return `
            <div class="query-result mt-3">
                <h5>Query Result:</h5>
                <div class="table-responsive">
                    <table class="table table-sm table-bordered">
                        <thead class="thead-light">
                            <tr>
                                ${result.fields.map(field => 
                                    `<th>${field}</th>`
                                ).join('')}
                            </tr>
                        </thead>
                        <tbody>
                            ${result.rows.map(row => `
                                <tr>
                                    ${result.fields.map(field => 
                                        `<td>${row[field]}</td>`
                                    ).join('')}
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    updateProgress() {
        const progressBar = document.querySelector('.progress-bar');
        const progress = (this.score / (this.level * 100)) * 100;
        progressBar.style.width = `${Math.min(progress, 100)}%`;
        
        if (progress >= 100) {
            this.level++;
            this.setupTutorial();
        }
    }

    updateScore() {
        const scoreElement = document.getElementById('score');
        if (scoreElement) {
            scoreElement.textContent = `Score: ${this.score}`;
        }
    }

    showError(message) {
        const feedbackElement = document.getElementById('feedback');
        if (feedbackElement) {
            feedbackElement.innerHTML = `
                <div class="alert alert-danger">
                    ${message}
                </div>`;
        }
    }

    setupEventListeners() {
        const answerForm = document.getElementById('answer-form');
        if (answerForm) {
            answerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const answerInput = document.getElementById('answer-input');
                if (answerInput && answerInput.value.trim()) {
                    this.submitAnswer(answerInput.value);
                    answerInput.value = '';
                }
            });
        }
    }
}

// Export the Game class
export default Game;