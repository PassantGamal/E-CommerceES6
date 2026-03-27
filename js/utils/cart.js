
export const CART_KEY = 'SHOPCO_CART';

export const cart = {
  get() {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch {
      return [];
    }
  },

  save(items) {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
    this.updateBadge();
  },

  add(product) {
    let items = this.get();
   
    const existing = items.find(item => 
      item.id === product.id && 
      item.size === product.size && 
      item.color === product.color
    );

    if (existing) {
      existing.qty += (product.qty || 1);
    } else {
      items.push({ ...product, qty: product.qty || 1 });
    }
    this.save(items);
  },

  updateBadge() {
    const badge = document.getElementById('cartCount');
    if (!badge) return;
    const items = this.get();
    const totalItems = items.length; 
    badge.textContent = totalItems;
    badge.style.display = totalItems > 0 ? 'flex' : 'none';
    badge.classList.toggle('visible', totalItems > 0);
  },

  getTotalPrice() {
    return this.get().reduce((sum, item) => {
      const p = parseFloat(item.price) || 0;
      const q = parseInt(item.qty) || 1;
      return sum + (p * q);
    }, 0);
  }
};