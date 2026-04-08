import { newArrivals, topSelling, testimonials } from '../data/products.js';
import { getCart, updateCartCount } from '../utils/cart.js';
import { renderStars } from '../utils/helpers.js';
import { productCard, renderNavbar, renderFooter } from '../utils/render.js';

renderNavbar();
renderFooter();

function renderProducts(products, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = products.map(p => productCard(p)).join('');
    
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', () => {
            window.location.href = `product.html?id=${card.dataset.id}`;
        });
    });
}

function renderTestimonials() {
    const grid = document.getElementById('testimonialsGrid');
    if (!grid) return;
    
    grid.innerHTML = testimonials.map(t => `
        <div class="testimonial-card">
            <div class="t-stars">${renderStars(t.rating)}</div>
            <h4>
                ${t.name}
                ${t.verified ? '<i class="fas fa-circle-check verified"></i>' : ''}
            </h4>
            <p>"${t.text}"</p>
        </div>
    `).join('');
}

function initTestimonialScroll() {
    const grid = document.getElementById('testimonialsGrid');
    const prevBtn = document.getElementById('scrollPrev');
    const nextBtn = document.getElementById('scrollNext');
    
    if (!grid || !prevBtn || !nextBtn) return;
    
    prevBtn.addEventListener('click', () => {
        grid.scrollBy({ left: -350, behavior: 'smooth' });
    });
    
    nextBtn.addEventListener('click', () => {
        grid.scrollBy({ left: 350, behavior: 'smooth' });
    });
}

function initHeroCounters() {
    const counters = document.querySelectorAll('.stat-num');
    const targets = [200, 2000, 30000];
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                counters.forEach((counter, i) => {
                    let current = 0;
                    const step = targets[i] / 50;
                    const timer = setInterval(() => {
                        current += step;
                        if (current >= targets[i]) {
                            counter.textContent = targets[i].toLocaleString() + '+';
                            clearInterval(timer);
                        } else {
                            counter.textContent = Math.floor(current).toLocaleString() + '+';
                        }
                    }, 30);
                });
                observer.disconnect();
            }
        });
    });
    
    observer.observe(counters[0]);
}

renderProducts(newArrivals, 'newArrivalsGrid');
renderProducts(topSelling, 'topSellingGrid');
renderTestimonials();
updateCartCount();
initTestimonialScroll();
initHeroCounters();