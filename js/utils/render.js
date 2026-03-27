import { renderStars } from './helpers.js';
import { cart } from './cart.js';

const badge = (tag) => {
  if (!tag) return '';
  const bg = tag === 'sale' ? '#FF3333' : '#00C12B';
  return `<span class="badge" style="background:${bg}">${tag.toUpperCase()}</span>`;
};

const discountBadge = (price, oldPrice) => {
  if (!oldPrice) return '';
  const pct = Math.round((1 - price / oldPrice) * 100);
  return `<span class="discount-badge">-${pct}%</span>`;
};

export const productCard = (p) => `
  <div class="product-card" data-id="${p.id}" role="button" tabindex="0">
    <div class="card-img-wrap">
      <img src="${p.image}" alt="${p.name}" loading="lazy" />
      ${badge(p.tag)}
    </div>
    <div class="card-info">
      <h3>${p.name}</h3>
      <div class="card-rating">
        ${renderStars(p.rating)}
        <span class="reviews">${p.rating}/5</span>
      </div>
      <div class="card-price">
        <span class="price">$${p.price}</span>
        ${p.oldPrice ? `<span class="old-price">$${p.oldPrice}</span>` : ''}
        ${discountBadge(p.price, p.oldPrice)}
      </div>
    </div>
  </div>`;

export const renderCards = (products, containerId) => {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = products.map(productCard).join('');

  el.querySelectorAll('.product-card').forEach(card => {
    const go = () => location.href = `product.html?id=${card.dataset.id}`;
    card.addEventListener('click', go);
    card.addEventListener('keydown', (e) => { if (e.key === 'Enter') go(); });
  });
};

export const renderStyles = (styles) => {
  const grid = document.getElementById('styleGrid');
  if (!grid) return;

  grid.innerHTML = styles.map(({ name, image }) => `
    <div class="style-card" onclick="location.href='category.html?style=${name.toLowerCase()}'">
      <img src="${image}" alt="${name}" loading="lazy" />
      <span class="style-label">${name}</span>
    </div>
  `).join('');
};

export const renderTestimonials = (data) => {
  const grid = document.getElementById('testimonialsGrid');
  if (!grid) return;

  grid.innerHTML = data.map(({ name, rating, verified, text }) => `
    <div class="testimonial-card">
      <div class="t-stars">${renderStars(rating)}</div>
      <h4>
        ${name}
        ${verified ? '<i class="fas fa-circle-check verified"></i>' : ''}
      </h4>
      <p>"${text}"</p>
    </div>
  `).join('');
};

export const renderReviews = (reviews, containerId = 'reviewsGrid') => {
  const grid = document.getElementById(containerId);
  if (!grid) return;

  grid.innerHTML = reviews.map(({ name, rating, verified, date, text }) => `
    <div class="review-card">
      <div class="review-stars">${renderStars(rating)}</div>
      <div class="review-name">
        ${name}
        ${verified ? '<i class="fas fa-circle-check verified"></i>' : ''}
      </div>
      <div class="review-date">${date}</div>
      <p class="review-text">"${text}"</p>
    </div>
  `).join('');
};

export const renderNavbar = () => {
  const nav = document.getElementById('navbar');
  if (!nav) return;

  nav.innerHTML = `
    <button class="nav-hamburger" id="hamburger" aria-label="Menu">
      <i class="fas fa-bars"></i>
    </button>

    <a class="nav-logo" href="index.html">SHOP.CO</a>

    <ul class="nav-links">
      <li class="has-dropdown">
        Shop <i class="fas fa-chevron-down"></i>
        <ul class="dropdown">
          <li><a href="category.html?cat=men">Men</a></li>
          <li><a href="category.html?cat=women">Women</a></li>
          <li><a href="category.html?cat=kids">Kids</a></li>
        </ul>
      </li>
      <li><a href="category.html?tag=sale">On Sale</a></li>
      <li><a href="category.html?tag=new">New Arrivals</a></li>
      <li><a href="#">Brands</a></li>
    </ul>

    <div class="nav-actions">
      <div class="search-bar">
        <i class="fas fa-search"></i>
        <input class="search-input" type="text" placeholder="Search for products…" />
      </div>
      <a href="cart.html" class="cart-icon" aria-label="Cart">
        <i class="fas fa-shopping-cart"></i>
        <span class="cart-count" id="cartCount">0</span>
      </a>
      <i class="fas fa-user nav-icon" aria-label="Account"></i>
    </div>
  `;
  

  if (typeof cart !== 'undefined' && cart.updateBadge) {
    cart.updateBadge();
  }
};
export const renderFooter = () => {
  const footer = document.getElementById('footer');
  if (!footer) return;

  footer.innerHTML = `
    <div class="footer-top">
      <div class="footer-brand">
        <h3>SHOP.CO</h3>
        <p>We have clothes that suits your style and which you're proud to wear. From women to men.</p>
        <div class="social-icons">
          <a href="#" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
          <a href="#" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
          <a href="#" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
          <a href="#" aria-label="GitHub"><i class="fab fa-github"></i></a>
        </div>
      </div>
      <div class="footer-links">
        <div class="footer-col">
          <h4>COMPANY</h4>
          <a href="#">About</a>
          <a href="#">Features</a>
          <a href="#">Works</a>
          <a href="#">Career</a>
        </div>
        <div class="footer-col">
          <h4>HELP</h4>
          <a href="#">Customer Support</a>
          <a href="#">Delivery Details</a>
          <a href="#">Terms &amp; Conditions</a>
          <a href="#">Privacy Policy</a>
        </div>
        <div class="footer-col">
          <h4>FAQ</h4>
          <a href="#">Account</a>
          <a href="#">Manage Deliveries</a>
          <a href="#">Orders</a>
          <a href="#">Payments</a>
        </div>
        <div class="footer-col">
          <h4>RESOURCES</h4>
          <a href="#">Free eBooks</a>
          <a href="#">Development Tutorial</a>
          <a href="#">How to – Blog</a>
          <a href="#">Youtube Playlist</a>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <p>Shop.co © 2000-2023, All Rights Reserved</p>
      <div class="payment-icons">
        <img src="/images/visa.png" alt="Visa" />
        <img src="/images/mastercard.png" alt="Mastercard" />
        <img src="/images/paypal.png" alt="PayPal" />
        <img src="/images/apple-pay.png" alt="Apple Pay" />
        <img src="/images/google-pay-india.png" alt="Google Pay" />
      </div>
    </div>
  `;
};