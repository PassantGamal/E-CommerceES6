import { newArrivals, topSelling, testimonials } from '../data/products.js';
import { cart } from '../utils/cart.js';
import { renderCards, renderTestimonials,
         renderNavbar, renderFooter } from '../utils/render.js';
import { initSearch, initHamburger, initCounters,
         scrollTestimonials, startScroll,
         stopScroll } from '../utils/helpers.js';


renderNavbar();
renderFooter();


renderCards(newArrivals, 'newArrivalsGrid');
renderCards(topSelling, 'topSellingGrid');
renderTestimonials(testimonials);


cart.updateBadge();
initSearch();
initHamburger();
initCounters();

const grid = document.getElementById('testimonialsGrid');
document.getElementById('scrollPrev')?.addEventListener('click', () => scrollTestimonials(-1));
document.getElementById('scrollNext')?.addEventListener('click', () => scrollTestimonials(1));
document.getElementById('scrollPrev')?.addEventListener('mousedown', () => startScroll(-1));
document.getElementById('scrollNext')?.addEventListener('mousedown', () => startScroll(1));
['mouseup', 'mouseleave'].forEach(e => {
  document.getElementById('scrollPrev')?.addEventListener(e, stopScroll);
  document.getElementById('scrollNext')?.addEventListener(e, stopScroll);
});


if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => cart.updateBadge());
} else {
  cart.updateBadge();
}