// src/scripts/modules/utils.mjs
// Modal management system
export function initModal() {
    const modals = document.querySelectorAll('.modal');
    
    modals.forEach(modal => {
        const closeBtn = modal.querySelector('.close-modal');
        
        // Close modal when clicking X
        closeBtn?.addEventListener('click', () => {
            modal.classList.add('hidden');
        });

        // Close modal when clicking outside content
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
            }
        });

        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
                modal.classList.add('hidden');
            }
        });
    });
}

// Notification system
export function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 1.5rem',
        borderRadius: '6px',
        color: 'white',
        fontWeight: '600',
        zIndex: '3000',
        animation: 'slideInRight 0.3s ease-out',
        maxWidth: '300px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    });

    // Type-based styling
    const styles = {
        success: { background: '#28A745' },
        error: { background: '#e53e3e' },
        info: { background: '#1a365d' },
        warning: { background: '#FFD700', color: '#1a365d' }
    };

    Object.assign(notification.style, styles[type] || styles.info);

    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Form validation helper
export function validateForm(formElement) {
    const inputs = formElement.querySelectorAll('input[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            highlightInvalid(input);
        } else {
            removeHighlight(input);
        }
    });

    return isValid;
}

function highlightInvalid(input) {
    input.style.borderColor = '#e53e3e';
    input.style.background = '#fff5f5';
}

function removeHighlight(input) {
    input.style.borderColor = '';
    input.style.background = '';
}

// Debounce function for search
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Get URL parameters
export function getParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Close all modals
export function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.add('hidden');
    });
}