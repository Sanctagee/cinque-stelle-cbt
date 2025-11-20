// src/scripts/modules/examEngine.mjs
import { debounce, showNotification } from './utils.mjs';
import { AuthManager } from './auth.mjs';

export class ExamEngine {
    constructor() {
        this.authManager = new AuthManager();
        this.exams = [];
        this.filteredExams = [];
        this.currentFilter = 'all';
        this.searchTerm = '';
        this.init();
    }

    async init() {
        await this.loadExams();
        this.renderExams();
        this.setupEventListeners();
        console.log('Exam engine initialized with', this.exams.length, 'exams');
    }

    async loadExams() {
        try {
            // In a real app, this would fetch from an API
            // For now, we'll use sample data that matches your wireframes
            this.exams = [
                {
                    id: 'waec-math-2024',
                    title: 'WAEC Mathematics 2024',
                    description: 'Complete WAEC Mathematics past questions with detailed solutions',
                    examType: 'waec',
                    subject: 'mathematics',
                    difficulty: 'intermediate',
                    duration: 180,
                    questionCount: 80,
                    popularity: 95,
                    color: '#1a365d'
                },
                {
                    id: 'jamb-math-2024',
                    title: 'JAMB Mathematics 2024',
                    description: 'JAMB Mathematics objective questions practice',
                    examType: 'jamb',
                    subject: 'mathematics',
                    difficulty: 'intermediate',
                    duration: 100,
                    questionCount: 40,
                    popularity: 91,
                    color: '#2d3748'
                },
                {
                    id: 'waec-english-2024',
                    title: 'WAEC English 2024',
                    description: 'WAEC English language comprehensive test',
                    examType: 'waec',
                    subject: 'english',
                    difficulty: 'intermediate',
                    duration: 190,
                    questionCount: 70,
                    popularity: 89,
                    color: '#4a5568'
                },
                {
                    id: 'jamb-english-2024',
                    title: 'JAMB English 2024',
                    description: 'JAMB Use of English comprehensive',
                    examType: 'jamb',
                    subject: 'english',
                    difficulty: 'intermediate',
                    duration: 120,
                    questionCount: 50,
                    popularity: 87,
                    color: '#718096'
                },
                {
                    id: 'neco-math-2024',
                    title: 'NECO Mathematics 2024',
                    description: 'NECO Mathematics theory and objective questions',
                    examType: 'neco',
                    subject: 'mathematics',
                    difficulty: 'intermediate',
                    duration: 160,
                    questionCount: 60,
                    popularity: 85,
                    color: '#a0aec0'
                },
                {
                    id: 'jamb-physics-2024',
                    title: 'JAMB Physics 2024',
                    description: 'JAMB Physics conceptual and calculation questions',
                    examType: 'jamb',
                    subject: 'physics',
                    difficulty: 'advanced',
                    duration: 140,
                    questionCount: 45,
                    popularity: 82,
                    color: '#e53e3e'
                }
            ];
            
            this.filteredExams = [...this.exams];
        } catch (error) {
            console.error('Error loading exams:', error);
            showNotification('Failed to load exams. Please try again.', 'error');
        }
    }

    renderExams() {
        const grid = document.getElementById('exams-grid');
        if (!grid) return;

        if (this.filteredExams.length === 0) {
            grid.innerHTML = '<div class="no-results">No exams found matching your criteria.</div>';
            return;
        }

        grid.innerHTML = this.filteredExams.map(exam => `
            <div class="exam-card" 
                 data-exam-type="${exam.examType}"
                 data-subject="${exam.subject}"
                 data-difficulty="${exam.difficulty}"
                 data-search-terms="${exam.title.toLowerCase()} ${exam.subject} ${exam.examType}">
                <div class="exam-header">
                    <span class="exam-badge exam-badge-${exam.examType}">${exam.examType.toUpperCase()}</span>
                    <span class="difficulty-badge">${exam.difficulty}</span>
                </div>
                
                <h3 class="exam-title">${exam.title}</h3>
                <p class="exam-description">${exam.description}</p>
                
                <div class="exam-meta">
                    <div class="meta-item">
                        <span class="meta-icon">⏱️</span>
                        <span class="meta-text">${this.formatTime(exam.duration)}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-icon">❓</span>
                        <span class="meta-text">${exam.questionCount} questions</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-icon">🔥</span>
                        <span class="meta-text">${exam.popularity}%</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-icon">📚</span>
                        <span class="meta-text">${exam.subject}</span>
                    </div>
                </div>
                
                <div class="exam-actions">
                    <button class="btn btn-primary start-exam" 
                            data-exam-id="${exam.id}"
                            aria-label="Start ${exam.title}">
                        Start Test
                    </button>
                    <button class="btn btn-outline exam-details" 
                            data-exam-id="${exam.id}"
                            aria-label="View details for ${exam.title}">
                        Details
                    </button>
                </div>
            </div>
        `).join('');

        // Add event listeners to the newly created buttons
        this.attachExamEventListeners();
    }

    attachExamEventListeners() {
        // Start exam buttons
        document.querySelectorAll('.start-exam').forEach(button => {
            button.addEventListener('click', (e) => {
                const examId = e.target.dataset.examId;
                this.startExam(examId);
            });
        });

        // Details buttons
        document.querySelectorAll('.exam-details').forEach(button => {
            button.addEventListener('click', (e) => {
                const examId = e.target.dataset.examId;
                this.showExamDetails(examId);
            });
        });
    }

    setupEventListeners() {
        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const filter = e.target.dataset.filter;
                this.applyFilter(filter, e.target);
            });
        });

        // Search input with debouncing
        const searchInput = document.getElementById('exam-search');
        if (searchInput) {
            const debouncedSearch = debounce((term) => {
                this.searchExams(term);
            }, 300);

            searchInput.addEventListener('input', (e) => {
                this.searchTerm = e.target.value.toLowerCase().trim();
                debouncedSearch(this.searchTerm);
            });
        }
    }

    applyFilter(filter, button) {
        // Update active state of filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        button.classList.add('active');

        this.currentFilter = filter;
        this.filterExams();
    }

    filterExams() {
        if (this.currentFilter === 'all') {
            this.filteredExams = [...this.exams];
        } else {
            this.filteredExams = this.exams.filter(exam => 
                exam.examType === this.currentFilter || 
                exam.subject === this.currentFilter
            );
        }

        // Apply search filter if there's a search term
        if (this.searchTerm) {
            this.filteredExams = this.filteredExams.filter(exam =>
                exam.title.toLowerCase().includes(this.searchTerm) ||
                exam.subject.toLowerCase().includes(this.searchTerm) ||
                exam.examType.toLowerCase().includes(this.searchTerm)
            );
        }

        this.renderExams();
    }

    searchExams(term) {
        this.searchTerm = term;
        this.filterExams();
    }

    startExam(examId) {
        if (!this.authManager.isAuthenticated()) {
            showNotification('Please log in to start an exam', 'warning');
            return;
        }

        const exam = this.exams.find(e => e.id === examId);
        if (exam) {
            showNotification(`Starting ${exam.title}...`, 'info');
            // In real app, this would navigate to the test interface
            setTimeout(() => {
                window.location.href = `test-interface.html?exam=${examId}`;
            }, 1000);
        }
    }

    showExamDetails(examId) {
        const exam = this.exams.find(e => e.id === examId);
        if (exam) {
            showNotification(
                `${exam.title}: ${exam.questionCount} questions, ${this.formatTime(exam.duration)} duration`,
                'info'
            );
        }
    }

    formatTime(minutes) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
    }
}

// Initialize exam engine when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ExamEngine();
});