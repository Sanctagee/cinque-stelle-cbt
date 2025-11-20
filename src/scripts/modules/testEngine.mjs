// src/scripts/modules/testEngine.mjs
import { showNotification, getParam } from './utils.mjs';
import { AuthManager } from './auth.mjs';

export class TestEngine {
    constructor() {
        this.authManager = new AuthManager();
        this.currentExam = null;
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.userAnswers = new Map();
        this.startTime = null;
        this.timerInterval = null;
        this.timeRemaining = 60 * 60; // 60 minutes in seconds
        
        this.init();
    }

    async init() {
        const examId = getParam('exam');
        if (!examId) {
            showNotification('No exam specified', 'error');
            window.location.href = 'exams.html';
            return;
        }

        await this.loadExamData(examId);
        this.setupEventListeners();
        this.startTimer();
        this.displayQuestion(0);
        this.updateQuestionPalette();
        
        console.log('Test engine initialized for exam:', examId);
    }

    async loadExamData(examId) {
        // Sample questions from your JAMB document
        this.questions = [
            {
                id: 1,
                question: "The author observes that",
                options: [
                    "war, pestilence and famine were caused by the extravagance of nature",
                    "Nature was heartless and senseless",
                    "there was a time when uncontrolled birth made sense",
                    "It was wise at a time when mankind did not interfere with normal reproduction",
                    "nature was heartless in its reproductive process"
                ],
                correctAnswer: 2, // C
                explanation: "The passage suggests uncontrolled birth made sense when nature decimated population through war, pestilence, and famine.",
                passage: "PASSAGE A",
                difficulty: "medium"
            },
            {
                id: 2,
                question: "Which of these statements does not express the option of the author?",
                options: [
                    "Mankind has started to interfere with the work of nature",
                    "Many people had died in the past through want and disease",
                    "Mankind should not have the maximum number of children possible",
                    "Mankind should take care of its children",
                    "Man's present relationship with nature in matters of birth and death is a happy one."
                ],
                correctAnswer: 4, // E
                explanation: "The author suggests the relationship is problematic, not happy.",
                passage: "PASSAGE A",
                difficulty: "hard"
            },
            {
                id: 3,
                question: "Humane, as used in the passage means",
                options: [
                    "sensible",
                    "wise", 
                    "human",
                    "benevolent",
                    "thorough"
                ],
                correctAnswer: 3, // D
                explanation: "Humane means showing compassion and benevolence.",
                passage: "PASSAGE A",
                difficulty: "easy"
            },
            {
                id: 4,
                question: "'We must consciously try to establish an equilibrium' implies that mankind must",
                options: [
                    "realistically find an equation",
                    "strive not to be wasteful", 
                    "deliberately try to fight nature",
                    "try to fight nature",
                    "purposely find a balance"
                ],
                correctAnswer: 4, // E
                explanation: "Equilibrium means balance between birth and death rates.",
                passage: "PASSAGE A", 
                difficulty: "medium"
            },
            {
                id: 5,
                question: "The main idea of this passage is that",
                options: [
                    "nature is heartless",
                    "man should control the birth rate",
                    "mankind will soon perish of starvation", 
                    "pestilence causes more death than war",
                    "man should change nature's course gradually"
                ],
                correctAnswer: 1, // B
                explanation: "The passage argues for birth control to balance reduced death rates.",
                passage: "PASSAGE A",
                difficulty: "medium"
            }
        ];

        this.currentExam = {
            id: examId,
            title: "JAMB Use of English 1978",
            duration: 60,
            totalQuestions: this.questions.length
        };

        this.updateExamInfo();
    }

    displayQuestion(index) {
        if (index < 0 || index >= this.questions.length) return;
        
        this.currentQuestionIndex = index;
        const question = this.questions[index];
        
        // Update question text
        document.getElementById('question-text').textContent = question.question;
        
        // Update options
        const optionsContainer = document.getElementById('options-container');
        optionsContainer.innerHTML = question.options.map((option, optIndex) => `
            <label class="option-label ${this.userAnswers.get(index) === optIndex ? 'selected' : ''}">
                <input type="radio" name="answer" value="${optIndex}" 
                       ${this.userAnswers.get(index) === optIndex ? 'checked' : ''}>
                <span class="option-text">${String.fromCharCode(65 + optIndex)}. ${option}</span>
            </label>
        `).join('');
        
        // Update navigation buttons
        this.updateNavigationButtons();
        this.updateProgress();
    }

    updateNavigationButtons() {
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const submitBtn = document.getElementById('submit-btn');
        
        prevBtn.disabled = this.currentQuestionIndex === 0;
        
        if (this.currentQuestionIndex === this.questions.length - 1) {
            nextBtn.style.display = 'none';
            submitBtn.style.display = 'block';
        } else {
            nextBtn.style.display = 'block';
            submitBtn.style.display = 'none';
        }
    }

    updateProgress() {
        const progressFill = document.getElementById('progress-fill');
        const questionCounter = document.getElementById('question-counter');
        const answeredCount = document.getElementById('answered-count');
        
        const progress = ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
        progressFill.style.width = `${progress}%`;
        
        questionCounter.textContent = `Question ${this.currentQuestionIndex + 1} of ${this.questions.length}`;
        answeredCount.textContent = this.userAnswers.size;
    }

    updateQuestionPalette() {
        const paletteGrid = document.getElementById('palette-grid');
        paletteGrid.innerHTML = this.questions.map((_, index) => `
            <button class="palette-btn ${this.userAnswers.has(index) ? 'answered' : ''} ${index === this.currentQuestionIndex ? 'current' : ''}"
                    data-question-index="${index}">
                ${index + 1}
            </button>
        `).join('');
    }

    setupEventListeners() {
        // Option selection
        document.addEventListener('change', (e) => {
            if (e.target.name === 'answer') {
                const selectedOption = parseInt(e.target.value);
                this.userAnswers.set(this.currentQuestionIndex, selectedOption);
                
                // Update visual feedback
                document.querySelectorAll('.option-label').forEach(label => {
                    label.classList.remove('selected');
                });
                e.target.closest('.option-label').classList.add('selected');
                
                this.updateQuestionPalette();
                this.updateProgress();
            }
        });

        // Navigation buttons
        document.getElementById('prev-btn').addEventListener('click', () => {
            this.displayQuestion(this.currentQuestionIndex - 1);
        });

        document.getElementById('next-btn').addEventListener('click', () => {
            this.displayQuestion(this.currentQuestionIndex + 1);
        });

        // Question palette navigation
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('palette-btn')) {
                const index = parseInt(e.target.dataset.questionIndex);
                this.displayQuestion(index);
            }
        });

        // Submit exam
        document.getElementById('submit-btn').addEventListener('click', () => {
            this.submitExam();
        });

        // Results modal buttons
        document.getElementById('review-answers')?.addEventListener('click', () => {
            // Implement review functionality
            showNotification('Review feature coming soon!', 'info');
        });

        document.getElementById('back-to-exams')?.addEventListener('click', () => {
            window.location.href = 'exams.html';
        });
    }

    startTimer() {
        this.startTime = Date.now();
        this.updateTimerDisplay();
        
        this.timerInterval = setInterval(() => {
            this.timeRemaining--;
            this.updateTimerDisplay();
            
            if (this.timeRemaining <= 0) {
                this.submitExam();
            }
        }, 1000);
    }

    updateTimerDisplay() {
        const minutes = Math.floor(this.timeRemaining / 60);
        const seconds = this.timeRemaining % 60;
        document.getElementById('timer-display').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
        // Color warning when time is running low
        if (this.timeRemaining < 300) { // 5 minutes
            document.getElementById('timer-display').style.color = '#e53e3e';
        }
    }

    submitExam() {
        clearInterval(this.timerInterval);
        
        const score = this.calculateScore();
        this.showResults(score);
        this.saveProgress(score);
    }

    calculateScore() {
        let correct = 0;
        this.questions.forEach((question, index) => {
            if (this.userAnswers.get(index) === question.correctAnswer) {
                correct++;
            }
        });
        
        return {
            correct,
            total: this.questions.length,
            percentage: Math.round((correct / this.questions.length) * 100),
            timeSpent: Math.round((Date.now() - this.startTime) / 1000)
        };
    }

    showResults(score) {
        document.getElementById('score-percentage').textContent = `${score.percentage}%`;
        document.getElementById('correct-answers').textContent = `${score.correct}/${score.total}`;
        document.getElementById('time-spent').textContent = 
            `${Math.floor(score.timeSpent / 60)}:${(score.timeSpent % 60).toString().padStart(2, '0')}`;
        
        document.getElementById('results-modal').classList.remove('hidden');
    }

    saveProgress(score) {
        const userProgress = JSON.parse(localStorage.getItem('userProgress') || '{}');
        
        userProgress.testsCompleted = (userProgress.testsCompleted || 0) + 1;
        userProgress.averageScore = userProgress.averageScore ? 
            Math.round((userProgress.averageScore + score.percentage) / 2) : score.percentage;
        userProgress.studyTime = (userProgress.studyTime || 0) + score.timeSpent;
        userProgress.lastActive = Date.now();
        
        localStorage.setItem('userProgress', JSON.stringify(userProgress));
    }

    updateExamInfo() {
        document.getElementById('exam-title').textContent = this.currentExam.title;
        document.getElementById('total-questions').textContent = this.currentExam.totalQuestions;
        document.getElementById('time-allowed').textContent = `${this.currentExam.duration} minutes`;
    }
}

// Initialize test engine when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TestEngine();
});