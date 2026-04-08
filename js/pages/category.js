import { products } from '../data/products.js';
import { updateCartCount } from '../utils/cart.js';
import { productCard, renderNavbar, renderFooter } from '../utils/render.js';
import { initSearch, initHamburger } from '../utils/helpers.js';

renderNavbar();
renderFooter();
updateCartCount();
initSearch();
initHamburger();

let currentProducts = [...products];
let currentPage = 1;
const itemsPerPage = 9;

const urlParams = new URLSearchParams(window.location.search);
const searchQuery = urlParams.get('q');
const styleFilter = urlParams.get('style');
const tagFilter = urlParams.get('tag');

if (styleFilter) {
    document.getElementById('pageTitle').textContent = styleFilter.charAt(0).toUpperCase() + styleFilter.slice(1);
    document.getElementById('breadcrumbLabel').textContent = styleFilter.charAt(0).toUpperCase() + styleFilter.slice(1);
} else if (searchQuery) {
    document.getElementById('pageTitle').textContent = `"${searchQuery}"`;
    document.getElementById('breadcrumbLabel').textContent = `Search: ${searchQuery}`;
} else {
    document.getElementById('pageTitle').textContent = 'All Products';
}

let filters = {
    category: null,
    style: styleFilter,
    tag: tagFilter,
    minPrice: 50,
    maxPrice: 500,
    search: searchQuery
};

function applyFilters() {
    currentProducts = products.filter(p => {
        if (filters.category && p.category !== filters.category) return false;
        if (filters.style && p.style !== filters.style) return false;
        if (filters.tag && p.tag !== filters.tag) return false;
        if (p.price < filters.minPrice || p.price > filters.maxPrice) return false;
        if (filters.search && !p.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
        return true;
    });
    
    const sortValue = document.getElementById('sortSelect')?.value || 'popular';
    
    if (sortValue === 'price-asc') {
        currentProducts.sort((a, b) => a.price - b.price);
    } else if (sortValue === 'price-desc') {
        currentProducts.sort((a, b) => b.price - a.price);
    }
    
    currentPage = 1;
    renderProducts();
}

function renderProducts() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    
    const start = (currentPage - 1) * itemsPerPage;
    const pageProducts = currentProducts.slice(start, start + itemsPerPage);
    
    if (pageProducts.length === 0) {
        grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;padding:60px;">No products found</p>';
        document.getElementById('catMeta').textContent = '';
        renderPagination();
        return;
    }
    
    grid.innerHTML = pageProducts.map(p => productCard(p)).join('');
    
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', () => {
            window.location.href = `product.html?id=${card.dataset.id}`;
        });
    });
    
    const startNum = start + 1;
    const endNum = Math.min(start + itemsPerPage, currentProducts.length);
    document.getElementById('catMeta').textContent = `Showing ${startNum}–${endNum} of ${currentProducts.length} Products`;
    
    renderPagination();
}

function renderPagination() {
    const container = document.getElementById('paginationNums');
    if (!container) return;
    
    const totalPages = Math.ceil(currentProducts.length / itemsPerPage);
    let html = '';
    
    for (let i = 1; i <= totalPages; i++) {
        html += `<button class="page-num ${i === currentPage ? 'active' : ''}" onclick="gotoPage(${i})">${i}</button>`;
    }
    
    container.innerHTML = html;
}

window.gotoPage = function(page) {
    currentPage = page;
    renderProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.changePage = function(delta) {
    const totalPages = Math.ceil(currentProducts.length / itemsPerPage);
    const newPage = currentPage + delta;
    if (newPage >= 1 && newPage <= totalPages) {
        gotoPage(newPage);
    }
};

window.setCatFilter = function(cat, element) {
    document.querySelectorAll('#catList li').forEach(li => li.classList.remove('active'));
    element.classList.add('active');
    filters.category = cat;
    applyFilters();
};

window.setStyleFilter = function(style, element) {
    document.querySelectorAll('#styleList li').forEach(li => li.classList.remove('active'));
    element.classList.add('active');
    filters.style = style;
    applyFilters();
};

window.updatePriceUI = function() {
    const minSlider = document.getElementById('priceMin');
    const maxSlider = document.getElementById('priceMax');
    
    let min = parseInt(minSlider.value);
    let max = parseInt(maxSlider.value);
    
    if (min > max - 20) {
        minSlider.value = max - 20;
        min = max - 20;
    }
    
    document.getElementById('priceMinLabel').textContent = `$${min}`;
    document.getElementById('priceMaxLabel').textContent = `$${max}`;
    
    filters.minPrice = min;
    filters.maxPrice = max;
};

window.applyFilters = function() {
    applyFilters();
};

window.openSidebar = function() {
    document.getElementById('sidebar').classList.add('open');
};

window.closeSidebar = function() {
    document.getElementById('sidebar').classList.remove('open');
};

updatePriceUI();
applyFilters();