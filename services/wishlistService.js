const WISHLIST_KEY =
    "jgamerz_wishlist";

/* =========================================
   GET WISHLIST ITEMS
========================================= */

export function getWishlistItems() {

    return JSON.parse(
        localStorage.getItem(WISHLIST_KEY)
    ) || [];
}

/* =========================================
   SAVE WISHLIST ITEMS
========================================= */

function saveWishlistItems(items) {

    localStorage.setItem(
        WISHLIST_KEY,
        JSON.stringify(items)
    );
}

/* =========================================
   ADD TO WISHLIST
========================================= */

export function addToWishlist(game) {

    const wishlistItems =
        getWishlistItems();

    // CHECK DUPLICATE

    const exists =
        wishlistItems.find(
            item => item.id === game.id
        );

    if (exists) return;

    wishlistItems.push(game);

    saveWishlistItems(wishlistItems);
}

/* =========================================
   REMOVE FROM WISHLIST
========================================= */

export function removeFromWishlist(gameId) {

    const wishlistItems =
        getWishlistItems();

    const updatedItems =
        wishlistItems.filter(
            item => item.id !== gameId
        );

    saveWishlistItems(updatedItems);
}

/* =========================================
   CLEAR WISHLIST
========================================= */

export function clearWishlist() {

    localStorage.removeItem(
        WISHLIST_KEY
    );
}

/* =========================================
   GET WISHLIST COUNT
========================================= */

export function getWishlistCount() {

    return getWishlistItems().length;
}