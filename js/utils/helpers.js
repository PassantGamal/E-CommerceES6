export function renderStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= Math.floor(rating)) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i <= rating) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    return stars;
}

export function showToast(message, type = 'success') {
    const oldToast = document.querySelector('.toast');
    if (oldToast) oldToast.remove();
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    
    if (type === 'error') {
        toast.style.background = '#ff3333';
    }
    
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 10);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

export function initSearch() {
    const searchInputs = document.querySelectorAll('.search-input');
    
    searchInputs.forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = input.value.trim();
                if (query) {
                    window.location.href = `category.html?q=${encodeURIComponent(query)}`;
                }
            }
        });
    });
}

export function initHamburger() {
    const btn = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (!btn || !navLinks) return;
    
    const overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    document.body.appendChild(overlay);
    
    function closeMenu() {
        navLinks.classList.remove('open');
        overlay.classList.remove('open');
        btn.innerHTML = '<i class="fas fa-bars"></i>';
    }
    
    btn.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('open');
        overlay.classList.toggle('open', isOpen);
        btn.innerHTML = isOpen ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });
    
    overlay.addEventListener('click', closeMenu);
}