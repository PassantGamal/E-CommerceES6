import { products }                               from './data/products.js';
import { cart }                                   from './utils/cart.js';
import { productCard, renderNavbar, renderFooter } from './utils/render.js';
import { initSearch, initHamburger }               from './utils/helpers.js';

renderNavbar();
renderFooter();
cart.updateBadge();
initSearch();
initHamburger();


let filtered  = [...products];
let page      = 1;
const PER     = 9;

const state = { category: null, style: null, minPrice: 50, maxPrice: 500 };


const params = new URLSearchParams(location.search);
const qParam = params.get('q');
const styleP = params.get('style');
const catP   = params.get('cat');
const tagP   = params.get('tag');

if (styleP) {
  state.style = styleP;
  document.querySelectorAll('#styleList li').forEach(li => {
    if (li.textContent.trim().toLowerCase().startsWith(styleP)) li.classList.add('active');
  });
}
if (tagP) {
}

const titleEl = document.getElementById('pageTitle');
const bcLabel = document.getElementById('breadcrumbLabel');
const label   = styleP
  ? styleP.charAt(0).toUpperCase() + styleP.slice(1)
  : catP   ? catP.charAt(0).toUpperCase() + catP.slice(1)
  : qParam ? `"${qParam}"` : 'All Products';

if (titleEl) titleEl.textContent = label;
if (bcLabel) bcLabel.textContent = label;


const render = () => {
  const grid  = document.getElementById('productsGrid');
  const meta  = document.getElementById('catMeta');
  if (!grid) return;

  const start = (page - 1) * PER;
  const slice = filtered.slice(start, start + PER);

  if (!slice.length) {
    grid.innerHTML = `<p style="grid-column:1/-1;text-align:center;padding:60px;color:var(--gray-500)">No products found.</p>`;
    if (meta) meta.textContent = '';
    renderPagination();
    return;
  }

  grid.innerHTML = slice.map(productCard).join('');

  grid.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', () => location.href = `product.html?id=${card.dataset.id}`);
  });

  if (meta) meta.textContent =
    `Showing ${start + 1}–${Math.min(start + PER, filtered.length)} of ${filtered.length} Products`;

  renderPagination();
};


const renderPagination = () => {
  const nums = document.getElementById('paginationNums');
  if (!nums) return;
  const total = Math.ceil(filtered.length / PER);
  let html = '';

  const add = (n, label = n, cls = '') =>
    html += `<button class="page-num ${cls}" onclick="gotoPage(${n})">${label}</button>`;

  if (total <= 7) {
    for (let i = 1; i <= total; i++) add(i, i, i === page ? 'active' : '');
  } else {
    add(1, 1, page === 1 ? 'active' : '');
    if (page > 3) html += `<span style="padding:0 4px">…</span>`;
    for (let i = Math.max(2, page - 1); i <= Math.min(total - 1, page + 1); i++)
      add(i, i, i === page ? 'active' : '');
    if (page < total - 2) html += `<span style="padding:0 4px">…</span>`;
    add(total, total, page === total ? 'active' : '');
  }
  nums.innerHTML = html;
};

window.gotoPage = (n) => {
  page = n;
  render();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.changePage = (delta) => {
  const total = Math.ceil(filtered.length / PER);
  const next  = page + delta;
  if (next >= 1 && next <= total) gotoPage(next);
};


window.setCatFilter = (cat, el) => {
  document.querySelectorAll('#catList li').forEach(li => li.classList.remove('active'));
  el.classList.add('active');
  state.category = cat;
};

window.setStyleFilter = (style, el) => {
  document.querySelectorAll('#styleList li').forEach(li => li.classList.remove('active'));
  el.classList.add('active');
  state.style = style;
};

window.updatePriceUI = () => {
  const minEl = document.getElementById('priceMin');
  const maxEl = document.getElementById('priceMax');
  if (!minEl || !maxEl) return;

  let min = parseInt(minEl.value);
  let max = parseInt(maxEl.value);
  if (min > max - 20) { minEl.value = max - 20; min = max - 20; }

  document.getElementById('priceMinLabel').textContent = `$${min}`;
  document.getElementById('priceMaxLabel').textContent = `$${max}`;

  const fill = document.getElementById('priceFill');
  if (fill) {
    const range = 450;
    const left  = ((min - 50) / range) * 100;
    const width = ((max - min) / range) * 100;
    fill.style.left  = left  + '%';
    fill.style.width = width + '%';
  }

  state.minPrice = min;
  state.maxPrice = max;
};

window.applyFilters = () => {
  const sort = document.getElementById('sortSelect')?.value || 'popular';

  filtered = products.filter(p => {
    const matchCat   = !state.category || p.category === state.category;
    const matchStyle = !state.style    || p.style    === state.style;
    const matchPrice = p.price >= state.minPrice && p.price <= state.maxPrice;
    const matchQ     = !qParam || p.name.toLowerCase().includes(qParam.toLowerCase());
    const matchTag   = !tagP   || p.tag === tagP;
    return matchCat && matchStyle && matchPrice && matchQ && matchTag;
  });

  if (sort === 'price-asc')  filtered.sort((a, b) => a.price - b.price);
  if (sort === 'price-desc') filtered.sort((a, b) => b.price - a.price);

  page = 1;
  render();
};

window.openSidebar  = () => document.getElementById('sidebar').classList.add('open');
window.closeSidebar = () => document.getElementById('sidebar').classList.remove('open');


updatePriceUI();
applyFilters();