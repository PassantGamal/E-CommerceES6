import { products, reviews } from '../data/products.js';
import { cart } from '../utils/cart.js';
import { renderStars } from '../utils/helpers.js';
import { productCard, renderNavbar, renderFooter,
         renderReviews } from '../utils/render.js';
import { initSearch, initHamburger, showToast } from '../utils/helpers.js';

renderNavbar();
renderFooter();

setTimeout(() => {
  cart.updateBadge();
}, 100);

initSearch();
initHamburger();


let selectedColor = null;
let selectedSize = null;
let qty = 1;
let currentP = null;


const id = parseInt(new URLSearchParams(location.search).get('id')) || 1;
const p = products.find(x => x.id === id);

if (!p) {
  document.querySelector('.page-wrapper').innerHTML =
    `<div style="text-align:center;padding:100px 20px">
       <h2>Product not found</h2>
       <a href="category.html" class="btn-primary" style="display:inline-flex;margin-top:24px">Back to Shop</a>
     </div>`;
} else {
  currentP = p;
  buildPage(p);
}

function buildPage(p) {

  const bc = document.getElementById('breadcrumbCurrent');
  if (bc) bc.textContent = p.name;


  document.getElementById('pTitle').textContent = p.name;


  document.getElementById('pRating').innerHTML =
    `${renderStars(p.rating)} <span class="reviews">${p.rating}/5 (${p.reviews})</span>`;

 
  const disc = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : null;
  document.getElementById('pPriceArea').innerHTML =
    `<span class="current-price">$${p.price}</span>
     ${p.oldPrice ? `<span class="old-price">$${p.oldPrice}</span>` : ''}
     ${disc ? `<span class="discount-badge">-${disc}%</span>` : ''}`;

  document.getElementById('pDesc').textContent = p.description;

  document.getElementById('pMainImg').src = p.image;


  const thumbList = document.getElementById('thumbList');
  thumbList.innerHTML = p.images.map((img, i) => `
    <img src="${img}" class="thumb-img ${i === 0 ? 'active' : ''}"
         alt="${p.name} ${i + 1}" data-src="${img}" />
  `).join('');
  thumbList.querySelectorAll('.thumb-img').forEach(t => {
    t.addEventListener('click', () => {
      document.getElementById('pMainImg').src = t.dataset.src;
      thumbList.querySelectorAll('.thumb-img').forEach(x => x.classList.remove('active'));
      t.classList.add('active');
    });
  });

 
  const colorsEl = document.getElementById('pColors');
  colorsEl.innerHTML = p.colors.map((c, i) => `
    <div class="color-dot ${i === 0 ? 'selected' : ''}"
         style="background:${c}" data-color="${c}"></div>
  `).join('');
  selectedColor = p.colors[0];
  colorsEl.querySelectorAll('.color-dot').forEach(dot => {
    dot.addEventListener('click', () => {
      colorsEl.querySelectorAll('.color-dot').forEach(d => d.classList.remove('selected'));
      dot.classList.add('selected');
      selectedColor = dot.dataset.color;
    });
  });


  const sizesEl = document.getElementById('pSizes');
  sizesEl.innerHTML = p.sizes.map(s => `
    <button class="size-btn" data-size="${s}">${s}</button>
  `).join('');
  sizesEl.querySelectorAll('.size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      sizesEl.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedSize = btn.dataset.size;
    });
  });

 
  const qtyMinusBtn = document.getElementById('qtyMinus');
  const qtyPlusBtn = document.getElementById('qtyPlus');
  const qtyDisplay = document.getElementById('pQty');
  

  if (qtyMinusBtn) {
    const newMinusBtn = qtyMinusBtn.cloneNode(true);
    qtyMinusBtn.parentNode.replaceChild(newMinusBtn, qtyMinusBtn);
    newMinusBtn.addEventListener('click', () => {
      qty = Math.max(1, qty - 1);
      if (qtyDisplay) qtyDisplay.textContent = qty;
      console.log('Quantity changed to:', qty);
    });
  }
  
  if (qtyPlusBtn) {
    const newPlusBtn = qtyPlusBtn.cloneNode(true);
    qtyPlusBtn.parentNode.replaceChild(newPlusBtn, qtyPlusBtn);
    newPlusBtn.addEventListener('click', () => {
      qty++;
      if (qtyDisplay) qtyDisplay.textContent = qty;
      console.log('Quantity changed to:', qty);
    });
  }


  const addToCartBtn = document.getElementById('btnAddToCart');
  if (addToCartBtn) {
  
    const newAddBtn = addToCartBtn.cloneNode(true);
    addToCartBtn.parentNode.replaceChild(newAddBtn, addToCartBtn);
    

    newAddBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (!selectedSize) { 
        showToast('Please select a size!'); 
        return; 
      }
      if (!selectedColor) { 
        showToast('Please select a color!'); 
        return; 
      }
      
      console.log('Adding to cart:', {
        id: p.id,
        name: p.name,
        size: selectedSize,
        color: selectedColor,
        qty: qty
      });
      
      cart.add({ 
        id: p.id, 
        name: p.name, 
        price: p.price, 
        image: p.image,
        size: selectedSize, 
        color: selectedColor, 
        qty: qty 
      });
      
      showToast(`${p.name} added to cart! 🛒`);
    });
  }


  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(`tab-${btn.dataset.tab}`).classList.add('active');
    });
  });


  renderReviews(reviews, 'reviewsGrid');
  const countEl = document.getElementById('reviewCount');
  if (countEl) countEl.textContent = `(${reviews.length})`;

  const loadMoreBtn = document.getElementById('btnLoadMore');
  if (loadMoreBtn) {
    const newLoadBtn = loadMoreBtn.cloneNode(true);
    loadMoreBtn.parentNode.replaceChild(newLoadBtn, loadMoreBtn);
    newLoadBtn.addEventListener('click', () => {
      showToast('All reviews loaded!');
    });
  }

 
  const related = products.filter(x => x.id !== p.id).slice(0, 4);
  const relGrid = document.getElementById('relatedGrid');
  if (relGrid) {
    relGrid.innerHTML = related.map(productCard).join('');
    relGrid.querySelectorAll('.product-card').forEach(card => {
      card.addEventListener('click', () => {
        location.href = `product.html?id=${card.dataset.id}`;
      });
    });
  }
}