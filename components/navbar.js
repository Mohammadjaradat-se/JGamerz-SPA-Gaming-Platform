import { getUser, isLoggedIn, logout, requireAuth } from "../utils/auth.js";
import { API_BASE_URL } from "../config/api.js";
const BASE_URL =
    API_BASE_URL.replace("/api", "");
import {
    getCartCount,
    getCartItems,
    getCartTotal,
    clearCart,
    removeFromCart
} from "../services/cartService.js";

import {
    getWishlistCount,
    getWishlistItems,
    removeFromWishlist
} from "../services/wishlistService.js";
import { getChatUnreadCount } from "../utils/chatNotifications.js";
import { initGameStore } from "../pages/store.js";

let unreadListenerInitialized = false;

export function Navbar() {
    const user = getUser();

    const cartCount =
        getCartCount();

    const wishlistCount =
        getWishlistCount();

    const cartItems =
        getCartItems();

    const cartTotal =
        getCartTotal();

    const wishlistItems =
        getWishlistItems();

    const communityUnreadCount =
        getChatUnreadCount();

    let authButtonHTML = "";
    if (isLoggedIn()) {
        authButtonHTML = `
        <button id="logout-btn"
        class="btn btn-login-signup">
            Logout
        </button>
    `;
    } else {
        authButtonHTML = `
        <button onclick="navigate('auth')"
        class="btn btn-login-signup">
            Login / Sign Up
        </button>
    `;
    }
    return `
        <nav class="navbar navbar-expand-lg custom-navbar fixed-top px-4">

        <!-- Logo + Name -->
        <a class="navbar-brand d-flex align-items-center gap-2" href="#"
            onclick="event.preventDefault(); navigate('home')">
            <img src="./assets/Logo.png" height="40">
            <span class="logo-text">JGamerz</span>
        </a>

        <!-- Toggle (mobile) -->
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navContent">
            <span class="navbar-toggler-icon"></span>
        </button>

        <!-- Links -->
        <div class="collapse navbar-collapse justify-content-between" id="navContent">

            <ul class="navbar-nav gap-3">

                <li class="nav-item">
                    <a class="nav-link" href="#"
                        onclick="event.preventDefault(); navigate('home')">
                        Home
                    </a>
                </li>

                <li class="nav-item">
                    <a class="nav-link" href="#"
                        onclick="event.preventDefault(); 
                        if(requireAuth('feed')) navigate('feed')">
                        Feed
                    </a>
                </li>

                <li class="nav-item">
                    <a class="nav-link" href="#"
                        onclick="event.preventDefault(); navigate('store')">
                        Games Store
                    </a>
                </li>

                <li class="nav-item">
                    <a class="nav-link" href="#"
                        onclick="event.preventDefault(); navigate('marketplace')">
                        Marketplace
                    </a>
                </li>

                <li class="nav-item">
                    <a class="nav-link" href="#"
                        onclick="event.preventDefault(); navigate('news')">
                        News
                    </a>
                </li>

                <!-- Dropdown -->
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle community-nav-link ${communityUnreadCount > 0 ? "has-unread" : ""}"
                    href="#"
                        onclick="event.preventDefault(); 
                        if(requireAuth('community')) navigate('community')">                                  
                            Community
                            ${communityUnreadCount > 0
            ? `
                                <span class="community-unread-badge">
                                    ${communityUnreadCount > 99 ? "99+" : communityUnreadCount}
                                </span>
                              `
            : ""
        }
                    </a>

                    <ul class="dropdown-menu dropdown-dark">
                        <li>
                            <a class="dropdown-item" href="#"
                               onclick="event.preventDefault(); 
                             if(requireAuth('profile')) navigate('profile')">
                              Profile
                            </a>
                        </li>
                        <li>
                            <a class="dropdown-item" href="#"
                                onclick="event.preventDefault(); 
                               if(requireAuth('settings')) navigate('settings')">
                                Settings
                            </a>
                        </li>
                    </ul>
                </li>

            </ul>

            <!-- Right side -->
            <div class="d-flex align-items-center gap-3">

                
                <div class="icon-group">

                        <!-- WISHLIST -->

<div class="icon-btn wishlist-wrapper">

    <i class="bi bi-heart"></i>

    ${wishlistCount > 0
            ? `
        <span class="icon-badge">
            ${wishlistCount}
        </span>
    `
            : ""
        }

    <div class="nav-dropdown wishlist-dropdown">

        ${wishlistItems.length > 0

            ? wishlistItems.map(game => `

                <div class="dropdown-item-card">

                    <img
                        src="${game.image}"
                        class="dropdown-game-img"
                    >

                    <div class="dropdown-game-info">

                        <p class="dropdown-game-title">
                            ${game.title}
                        </p>

                        <button
                            class="remove-btn"
                            data-wishlist-remove="${game.id}"
                        >
                            Remove
                        </button>

                    </div>

                </div>

            `).join("")

            : `
                <p class="empty-dropdown">
                    Wishlist is empty
                </p>
            `
        }

    </div>

</div>

<!-- CART -->

<div class="icon-btn cart-wrapper">

    <i class="bi bi-cart"></i>

    ${cartCount > 0
            ? `
        <span class="icon-badge">
            ${cartCount}
        </span>
    `
            : ""
        }

    <div class="nav-dropdown cart-dropdown">

        ${cartItems.length > 0

            ? `
                <div class="cart-total-row">
                    <div>
                        <span>Cart Total</span>
                        <strong>$${cartTotal.toFixed(2)}</strong>
                    </div>
                    <button class="cart-clear-btn" data-cart-clear>
                        Clear
                    </button>
                </div>

                ${cartItems.map(game => `

                <div class="dropdown-item-card">

                    <img
                        src="${game.image}"
                        class="dropdown-game-img"
                    >

                    <div class="dropdown-game-info">

                        <p class="dropdown-game-title">
                            ${game.title}
                        </p>

                        <p class="dropdown-game-price">
                            $${(Number(game.price) || 0).toFixed(2)}
                        </p>

                        <button
                            class="remove-btn"
                            data-cart-remove="${game.id}"
                        >
                            Remove
                        </button>

                    </div>

                </div>

            `).join("")}
            `

            : `
                <p class="empty-dropdown">
                    Cart is empty
                </p>
            `
        }

    </div>

</div>
                    
                     <div class="avatar-btn"
                      onclick="navigate('${isLoggedIn() ? "profile" : "auth"}')">    

                        ${isLoggedIn()
            ? `<img src="${user?.profile_image
                ? `${BASE_URL}${user.profile_image}`
                : "assets/default-avatar.jpg"
            }" class="avatar-img">`
            : `<i class="bi bi-person-fill"></i>`
        }

                    </div>

                </div>

                ${authButtonHTML}

            </div>

        </div>
    </nav>
`;
}
export function initNavbar() {
    if (!unreadListenerInitialized) {
        window.addEventListener("chat-unread-updated", refreshNavbar);
        unreadListenerInitialized = true;
    }

    const logoutBtn = document.getElementById("logout-btn");

    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            logout();

            navigate("home");

            location.reload();
        });
    }

    /* =========================
   REMOVE CART ITEMS
========================= */

    const cartRemoveButtons =
        document.querySelectorAll(
            "[data-cart-remove]"
        );

    cartRemoveButtons.forEach((button) => {

        button.addEventListener(
            "click",

            () => {

                const gameId =
                    button.dataset.cartRemove;

                removeFromCart(gameId);

                refreshNavbar();
                navigate("store")
            }
        );
    });

    const cartClearBtn =
        document.querySelector("[data-cart-clear]");

    if (cartClearBtn) {
        cartClearBtn.addEventListener(
            "click",
            () => {
                clearCart();
                refreshNavbar();
                navigate("store");
            }
        );
    }

    /* =========================
       REMOVE WISHLIST ITEMS
    ========================= */

    const wishlistRemoveButtons =
        document.querySelectorAll(
            "[data-wishlist-remove]"
        );

    wishlistRemoveButtons.forEach((button) => {

        button.addEventListener(
            "click",

            () => {

                const gameId =
                    button.dataset.wishlistRemove;

                removeFromWishlist(gameId);

                refreshNavbar();
                navigate("store")
            }
        );
    });
}
export function refreshNavbar() {

    const nav =
        document.getElementById(
            "navbar"
        );

    nav.innerHTML = Navbar();

    initNavbar();
}
