// src/scripts/modules/dashboard.mjs
import { AuthManager } from './auth.mjs';
import { showNotification } from './utils.mjs';

export class Dashboard {
    constructor() {
        this.authManager = new AuthManager();
        this.userProgress = this.getUserProgress();
        this.init();
    }

    async init() {
        this.updateUserInfo();
        await this.initializeCharts(); // Make this async
        await this.loadMotivationalQuote(); // Add motivational quotes
        this.loadImprovementAreas();
        this.loadRecentActivity();
        this.setupEventListeners();
        
        console.log('Dashboard initialized with progress:', this.userProgress);
    }

    updateUserInfo() {
        const user = this.authManager.getCurrentUser();
        if (user) {
            document.getElementById('student-name').textContent = user.username;
        }

        // Update stats from localStorage
        document.getElementById('tests-completed').textContent = 
            this.userProgress.testsCompleted || 0;
        document.getElementById('average-score').textContent = 
            `${this.userProgress.averageScore || 0}%`;
        document.getElementById('study-time').textContent = 
            this.formatStudyTime(this.userProgress.studyTime || 0);
        document.getElementById('study-streak').textContent = 
            `${this.userProgress.studyStreak || 0} days`;
    }

    async initializeCharts() {
        // Wait for Chart.js to load
        if (typeof Chart === 'undefined') {
            console.log('Chart.js not loaded yet, waiting...');
            setTimeout(() => this.initializeCharts(), 100);
            return;
        }
        
        this.createSubjectChart();
        this.createProgressChart();
    }

    createSubjectChart() {
        const ctx = document.getElementById('subject-chart');
        if (!ctx) {
            console.error('Subject chart canvas not found!');
            return;
        }
        
        const subjectData = {
            labels: ['Mathematics', 'English', 'Physics', 'Chemistry', 'Biology'],
            datasets: [{
                label: 'Average Score',
                data: [75, 82, 68, 90, 60],
                backgroundColor: [
                    '#1a365d',
                    '#2d3748', 
                    '#4a5568',
                    '#718096',
                    '#a0aec0'
                ],
                borderColor: '#FFD700',
                borderWidth: 2
            }]
        };

        new Chart(ctx, {
            type: 'bar',
            data: subjectData,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Performance by Subject'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                }
            }
        });
    }

    createProgressChart() {
        const ctx = document.getElementById('progress-chart');
        if (!ctx) {
            console.error('Progress chart canvas not found!');
            return;
        }
        
        const progressData = {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Current'],
            datasets: [{
                label: 'Average Score',
                data: [45, 60, 68, 75, 82],
                borderColor: '#FFD700',
                backgroundColor: 'rgba(255, 215, 0, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }]
        };

        new Chart(ctx, {
            type: 'line',
            data: progressData,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Progress Trend'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                }
            }
        });
    }

    // FOR MOTIVATIONAL QUOTES
    // In dashboard.mjs - update the loadMotivationalQuote method
    async loadMotivationalQuote() {
        try {
            console.log('Fetching motivational quote...');
            const response = await fetch('https://api.quotable.io/random?tags=education|success|motivational');
            
            if (!response.ok) {
                throw new Error('Quote service unavailable');
            }
            
            const quoteData = await response.json();
            this.displayMotivationalQuote(quoteData);
            
        } catch (error) {
            console.log('Quote service not available, using fallback:', error);
            // Multiple fallback quotes - randomly select one
            const fallbackQuotes = [
                {
                    content: "Education is the most powerful weapon which you can use to change the world.",
                    author: "Nelson Mandela"
                },
                {
                    content: "The beautiful thing about learning is that no one can take it away from you.",
                    author: "B.B. King"
                },
                {
                    content: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
                    author: "Winston Churchill"
                },
                {
                    content: "The expert in anything was once a beginner.",
                    author: "Helen Hayes"
                },
                {
                    content: "Don't let what you cannot do interfere with what you can do.",
                    author: "John Wooden"
                }
            ];
            
            const randomQuote = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
            this.displayMotivationalQuote(randomQuote);
        }
    }

    // TO DISPLAY THE QUOTE
    displayMotivationalQuote(quoteData) {
        const quoteHTML = `
            <div class="quote-widget">
                <h4>💡 Daily Motivation</h4>
                <blockquote>"${quoteData.content}"</blockquote>
                <cite>- ${quoteData.author}</cite>
            </div>
        `;
        
        // Added to dashboard header
        const dashboardHeader = document.querySelector('.dashboard-header');
        if (dashboardHeader) {
            dashboardHeader.insertAdjacentHTML('afterend', quoteHTML);
        }
    }

    loadImprovementAreas() {
        const improvementList = document.getElementById('improvement-list');
        if (!improvementList) return;

        const areas = [
            { subject: 'Physics', topic: 'Quantum Mechanics', score: 45 },
            { subject: 'Mathematics', topic: 'Calculus', score: 55 },
            { subject: 'Chemistry', topic: 'Organic Chemistry', score: 60 }
        ];

        improvementList.innerHTML = areas.map(area => `
            <div class="improvement-item" data-subject="${area.subject}">
                <div class="improvement-info">
                    <strong>${area.subject}</strong>
                    <span>${area.topic}</span>
                </div>
                <div class="improvement-score">
                    <span class="score">${area.score}%</span>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${area.score}%"></div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    loadRecentActivity() {
        const activityList = document.getElementById('activity-list');
        if (!activityList) return;

        const activities = [
            { action: 'Completed', exam: 'JAMB Mathematics 2024', score: 75, time: '2 hours ago' },
            { action: 'Started', exam: 'WAEC English 2024', score: null, time: '1 day ago' },
            { action: 'Completed', exam: 'NECO Physics 2023', score: 68, time: '2 days ago' }
        ];

        activityList.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon">${activity.score ? '✅' : '🟡'}</div>
                <div class="activity-details">
                    <strong>${activity.action} ${activity.exam}</strong>
                    ${activity.score ? `<span class="activity-score">Score: ${activity.score}%</span>` : ''}
                    <span class="activity-time">${activity.time}</span>
                </div>
            </div>
        `).join('');
    }

    setupEventListeners() {
        document.getElementById('practice-weak-areas')?.addEventListener('click', () => {
            showNotification('Starting practice session for weak areas...', 'info');
            setTimeout(() => {
                window.location.href = 'exams.html?filter=weak-areas';
            }, 1000);
        });

        this.initializeScrollAnimations();
    }

    initializeScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        document.querySelectorAll('.stat-card').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });
    }

    getUserProgress() {
        try {
            const progress = localStorage.getItem('userProgress');
            return progress ? JSON.parse(progress) : this.getDefaultProgress();
        } catch (error) {
            console.error('Error loading user progress:', error);
            return this.getDefaultProgress();
        }
    }

    getDefaultProgress() {
        return {
            testsCompleted: 0,
            averageScore: 0,
            studyTime: 0,
            studyStreak: 0,
            lastActive: Date.now()
        };
    }

    formatStudyTime(minutes) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Dashboard();
});