import { products, reviews } from '../data/products.js';
import { addToCart, updateCartCount } from '../utils/cart.js';
import { renderStars, showToast, initSearch, initHamburger } from '../utils/helpers.js';
import { productCard, renderNavbar, renderFooter } from '../utils/render.js';

renderNavbar();
renderFooter();
updateCartCount();
initSearch();
initHamburger();

const urlParams = new URLSearchParams(window.location.search);
const productId = parseInt(urlParams.get('id')) || 1;
const product = products.find(p => p.id === productId);

if (!product) {
    document.querySelector('.page-wrapper').innerHTML = '<div style="text-align:center;padding:100px"><h2>Product not found</h2><a href="category.html" class="btn-primary">Back to Shop</a></div>';
} else {
    let selectedColor = product.colors[0];
    let selectedSize = null;
    let quantity = 1;
    
    document.getElementById('breadcrumbCurrent').textContent = product.name;
    document.getElementById('pTitle').textContent = product.name;
    document.getElementById('pRating').innerHTML = `${renderStars(product.rating)} <span class="reviews">${product.rating}/5 (${product.reviews})</span>`;
    
    const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : null;
    document.getElementById('pPriceArea').innerHTML = `
        <span class="current-price">$${product.price}</span>
        ${product.oldPrice ? `<span class="old-price">$${product.oldPrice}</span>` : ''}
        ${discount ? `<span class="discount-badge">-${discount}%</span>` : ''}
    `;
    
    document.getElementById('pDesc').textContent = product.description;
    document.getElementById('pMainImg').src = product.image;
    
    const thumbList = document.getElementById('thumbList');
    thumbList.innerHTML = product.images.map((img, i) => `
        <img src="${img}" class="thumb-img ${i === 0 ? 'active' : ''}" data-src="${img}">
    `).join('');
    
    document.querySelectorAll('.thumb-img').forEach(thumb => {
        thumb.addEventListener('click', () => {
            document.getElementById('pMainImg').src = thumb.dataset.src;
            document.querySelectorAll('.thumb-img').forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
        });
    });
    
    const colorsContainer = document.getElementById('pColors');
    colorsContainer.innerHTML = product.colors.map((color, i) => `
        <div class="color-dot ${i === 0 ? 'selected' : ''}" style="background:${color}" data-color="${color}"></div>
    `).join('');
    
    document.querySelectorAll('.color-dot').forEach(dot => {
        dot.addEventListener('click', () => {
            document.querySelectorAll('.color-dot').forEach(d => d.classList.remove('selected'));
            dot.classList.add('selected');
            selectedColor = dot.dataset.color;
        });
    });
    
    const sizesContainer = document.getElementById('pSizes');
    sizesContainer.innerHTML = product.sizes.map(size => `
        <button class="size-btn" data-size="${size}">${size}</button>
    `).join('');
    
    document.querySelectorAll('.size-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            selectedSize = btn.dataset.size;
        });
    });
    
    document.getElementById('qtyMinus').addEventListener('click', () => {
        if (quantity > 1) {
            quantity--;
            document.getElementById('pQty').textContent = quantity;
        }
    });
    
    document.getElementById('qtyPlus').addEventListener('click', () => {
        quantity++;
        document.getElementById('pQty').textContent = quantity;
    });
    
    document.getElementById('btnAddToCart').addEventListener('click', () => {
        if (!selectedSize) {
            showToast('Please select a size', 'error');
            return;
        }
        
        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            size: selectedSize,
            color: selectedColor,
            quantity: quantity
        });
        
        showToast(`${product.name} added to cart!`);
    });
    
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(`tab-${btn.dataset.tab}`).classList.add('active');
        });
    });
    
    const reviewsContainer = document.getElementById('reviewsGrid');
    reviewsContainer.innerHTML = reviews.map(r => `
        <div class="review-card">
            <div class="review-stars">${renderStars(r.rating)}</div>
            <div class="review-name">
                ${r.name}
                ${r.verified ? '<i class="fas fa-circle-check verified"></i>' : ''}
            </div>
            <div class="review-date">${r.date}</div>
            <p class="review-text">"${r.text}"</p>
        </div>
    `).join('');
    
    document.getElementById('reviewCount').textContent = `(${reviews.length})`;
    
    const relatedProducts = products.filter(p => p.id !== product.id).slice(0, 4);
    const relatedGrid = document.getElementById('relatedGrid');
    relatedGrid.innerHTML = relatedProducts.map(p => productCard(p)).join('');
    
    document.querySelectorAll('#relatedGrid .product-card').forEach(card => {
        card.addEventListener('click', () => {
            window.location.href = `product.html?id=${card.dataset.id}`;
        });
    });
}