import { renderStars } from './helpers.js';

export function productCard(p) {
    const discountBadge = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : null;
    
    return `
        <div class="product-card" data-id="${p.id}">
            <div class="card-img-wrap">
                <img src="${p.image}" alt="${p.name}" loading="lazy" />
                ${p.tag ? `<span class="badge" style="background:${p.tag === 'sale' ? '#FF3333' : '#00C12B'}">${p.tag.toUpperCase()}</span>` : ''}
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
                    ${discountBadge ? `<span class="discount-badge">-${discountBadge}%</span>` : ''}
                </div>
            </div>
        </div>
    `;
}

export function renderNavbar() {
    const nav = document.getElementById('navbar');
    if (!nav) return;
    
    nav.innerHTML = `
        <button class="nav-hamburger" id="hamburger">
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
            <a href="cart.html" class="cart-icon">
                <i class="fas fa-shopping-cart"></i>
                <span class="cart-count" id="cartCount">0</span>
            </a>
            <i class="fas fa-user nav-icon"></i>
        </div>
    `;
}

export function renderFooter() {
    const footer = document.getElementById('footer');
    if (!footer) return;
    
    footer.innerHTML = `
        <div class="footer-top">
            <div class="footer-brand">
                <h3>SHOP.CO</h3>
                <p>We have clothes that suits your style and which you're proud to wear.</p>
                <div class="social-icons">
                    <a href="#"><i class="fab fa-twitter"></i></a>
                    <a href="#"><i class="fab fa-facebook-f"></i></a>
                    <a href="#"><i class="fab fa-instagram"></i></a>
                    <a href="#"><i class="fab fa-github"></i></a>
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
                    <a href="#">Terms & Conditions</a>
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
}