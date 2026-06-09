const CART_KEY = "jgamerz_cart";

const GAME_PRICES = {
    fc26: 69.99,
    reddead2: 59.99,
    gtav: 29.99,
    cod6: 69.99,
    tekken8: 49.99,
};

function normalizeCartItem(item) {
    return {
        ...item,
        price: Number(item.price) || GAME_PRICES[item.id] || 0,
    };
}

/* =========================================
   GET CART ITEMS
========================================= */

export function getCartItems() {

    const items = JSON.parse(
        localStorage.getItem(CART_KEY)
    ) || [];

    return items.map(normalizeCartItem);
}

/* =========================================
   SAVE CART ITEMS
========================================= */

function saveCartItems(items) {

    localStorage.setItem(
        CART_KEY,
        JSON.stringify(items)
    );
}

/* =========================================
   ADD TO CART
========================================= */

export function addToCart(game) {

    const cartItems =
        getCartItems();

    // CHECK DUPLICATE

    const exists =
        cartItems.find(
            item => item.id === game.id
        );

    if (exists) return;

    cartItems.push(normalizeCartItem(game));

    saveCartItems(cartItems);
}

/* =========================================
   REMOVE FROM CART
========================================= */

export function removeFromCart(gameId) {

    const cartItems =
        getCartItems();

    const updatedItems =
        cartItems.filter(
            item => item.id !== gameId
        );

    saveCartItems(updatedItems);
}

/* =========================================
   CLEAR CART
========================================= */

export function clearCart() {

    localStorage.removeItem(
        CART_KEY
    );
}

/* =========================================
   GET CART COUNT
========================================= */

export function getCartCount() {

    return getCartItems().length;
}

/* =========================================
   GET CART TOTAL
========================================= */

export function getCartTotal() {

    return getCartItems().reduce(
        (total, item) =>
            total + (Number(item.price) || 0),
        0
    );
}
