const CART_KEY = 'shopco_cart';

export function getCart() {
    const saved = localStorage.getItem(CART_KEY);
    if (saved) {
        return JSON.parse(saved);
    }
    return [];
}

export function saveCart(items) {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function addToCart(product) {
    let cart = getCart();
    
    const existing = cart.find(item => 
        item.id === product.id && 
        item.size === product.size && 
        item.color === product.color
    );
    
    if (existing) {
        existing.quantity = (existing.quantity || 1) + (product.quantity || 1);
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            size: product.size,
            color: product.color,
            quantity: product.quantity || 1
        });
    }
    
    saveCart(cart);
    updateCartCount();
}

export function removeFromCart(index) {
    let cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
    updateCartCount();
}

export function updateQuantity(index, newQuantity) {
    let cart = getCart();
    if (cart[index] && newQuantity >= 1) {
        cart[index].quantity = newQuantity;
        saveCart(cart);
    }
}

export function updateCartCount() {
    const cart = getCart();

 
    const totalItems = cart.length;

    const badge = document.getElementById('cartCount');
    if (badge) {
        badge.textContent = totalItems;
        badge.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

export function getCartTotal() {
    const cart = getCart();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}