import { addToCart, getCartItems } from "../services/cartService.js";
import { addToWishlist, getWishlistItems } from "../services/wishlistService.js";
import { refreshNavbar } from "../components/navbar.js";
import { requireAuth, isLoggedIn  } from "../utils/auth.js";



export function GameStore() {
    return `
        <section class="gstore-hero-section">
        <div class="gstore-hero-content">
            <p class="jgamerz-title">JGamerz Games Store</p> 
            <h1 class="gstore-title">Explore The World Of Gaming</h1>
            <p class="gstore-subtitle">Browse top-rated digital games across all major platforms.</p>
        </div>
        </section>

<section class="gstore-intro-section">
    <div class="gstore-intro">

    <div class="gstore-intro-container">

        <div class="gstore-video-side">

            <video 
                autoplay 
                muted 
                loop 
                playsinline
                class="gstore-intro-video"
            >
                <source 
                    src="./assets/videos/jgamerz-intro.mp4" 
                    type="video/mp4"
                >
            </video>

        </div>

        <div class="gstore-info-side">

            <img 
                src="./assets/Logo.png"
                class="gstore-logo"
            >

            <h2 class="gstore-info-title">
                Enter The Next Level
            </h2>

            <p class="gstore-info-text">
                Explore immersive worlds, legendary adventures,
                and the future of gaming with JGamerz.
            </p>

        </div>

    </div>

</div>
</section>

<section class="gstore-controls-section">
    <div class="gstore-controls">

    <div class="gstore-search-bar">

    <i class="bi bi-search"></i>

    <input 
        type="text"
        placeholder="Search games..."
    >

    </div>
        <select class="gstore-category">
            <option>All Categories</option>
            <option>Action</option>
            <option>Adventure</option>
            <option>Sports</option>
            <option>Racing</option>
            <option>Horror</option>
            <option>Open World</option>
            <option>Battle Royale</option>
            <option>Survival</option>
            <option>Fighting</option>
        </select>

    </div>
    </section>

    <section class="gstore-games-section">

    <div class="gstore-games-container">

        <!-- CARD 1 -->
        <div class="game-card"  data-game-id="fc26" data-game-price="69.99">

            <img src="./assets/games-store-images/fc26-cover.png" alt="" class="game-cover">

            <div class="game-info">

                <h3 class="game-title">
                    EA SPORTS FC™ 26
                </h3>

                <p class="game-description">
                    Experience the next generation of football with realistic gameplay, 
                    stunning graphics, and intense online competition in EA SPORTS FC™ 26.
                </p>

                <div class="game-meta">

                    <p><span>Release Date:</span> Oct 25, 2024</p>

                    <p><span>Developer:</span> Activision</p>

                    <p><span>Published By:</span> Valve</p>

                </div>

                <div class="game-statistics">

                    <div class="game-rate">
                        ⭐ 4.8
                    </div>

                    <div class="game-review">
                        Very Positive
                    </div>

                </div>

                <div class="game-price">
                    $69.99
                </div>

            </div>

            <div class="game-actions-side">

                <iframe 
                    src="https://www.youtube.com/embed/TSi0iJYSQ24"
                    class="game-trailer">
                </iframe>

                <button class="cart-btn">
                    Add To Cart
                </button>

                <button class="wishlist-btn">
                    Add To Wishlist
                </button>

            </div>

        </div>

        <!-- CARD 2 -->
        <div class="game-card"  data-game-id="reddead2" data-game-price="59.99">

            <img src="./assets/games-store-images/Red Dead Redemption 2.png" alt="" class="game-cover">

            <div class="game-info">

                <h3 class="game-title">
                    Red Dead Redemption 2
                </h3>

                <p class="game-description">
                    Live the outlaw life in a massive open-world western adventure filled with action, survival, and unforgettable storytelling.
                </p>

                <div class="game-meta">

                    <p><span>Release Date:</span> Oct 26, 2018</p>

                    <p><span>Developer:</span> Rockstar Games</p>

                    <p><span>Published By:</span> Rockstar Games</p>

                </div>

                <div class="game-statistics">

                    <div class="game-rate">
                        ⭐ 4.5
                    </div>

                    <div class="game-review">
                        Positive
                    </div>

                </div>

                <div class="game-price">
                    $59.99
                </div>

            </div>

            <div class="game-actions-side">

                <iframe 
                    src="https://www.youtube.com/embed/eaW0tYpxyp0"
                    class="game-trailer">
                </iframe>

                <button class="cart-btn">
                    Add To Cart
                </button>

                <button class="wishlist-btn">
                    Add To Wishlist
                </button>

            </div>

        </div>

        <!-- CARD 3 -->
        <div class="game-card"  data-game-id="gtav" data-game-price="29.99">

            <img src="./assets/games-store-images/gtav.png" alt="" class="game-cover">

            <div class="game-info">

                <h3 class="game-title">
                    Grand Theft Auto V
                </h3>

                <p class="game-description">
                    Explore the chaotic streets of Los Santos in an action-packed open world filled with crime, missions, racing, and endless freedom.
                </p>

                <div class="game-meta">

                    <p><span>Release Date:</span>September 17, 2013</p>

                    <p><span>Developer:</span> Rockstar North </p>

                    <p><span>Published By:</span> Rockstar Games</p>

                </div>

                <div class="game-statistics">

                    <div class="game-rate">
                        ⭐ 4.9 / 5
                    </div>

                    <div class="game-review">
                        Overwhelmingly Positive
                    </div>

                </div>

                <div class="game-price">
                    $29.99
                </div>

            </div>

            <div class="game-actions-side">

                <iframe 
                    src="https://www.youtube.com/embed/QkkoHAzjnUs?si=zyXxMJPStkPZuDWn"
                    class="game-trailer">
                </iframe>

                <button class="cart-btn">
                    Add To Cart
                </button>

                <button class="wishlist-btn">
                    Add To Wishlist
                </button>

            </div>

        </div>

        <!-- CARD 4 -->
        <div class="game-card"  data-game-id="cod6" data-game-price="69.99">

            <img src="./assets/games-store-images/cod_black_ops_6.png" alt="" class="game-cover">

            <div class="game-info">

                <h3 class="game-title">
                   Call of Duty: Black Ops 6
                </h3>

                <p class="game-description">
                    A fast-paced first-person shooter set during the Gulf War era, featuring an intense campaign, competitive multiplayer, and the return of the classic Zombies mode with the new Omnimovement system.
                </p>

                <div class="game-meta">

                    <p><span>Release Date:</span> October 25, 2024</p>

                    <p><span>Developer:</span>Treyarch</p>

                    <p><span>Published By:</span> Activision</p>

                </div>

                <div class="game-statistics">

                    <div class="game-rate">
                        ⭐ 4.5 / 5
                    </div>

                    <div class="game-review">
                        Positive
                    </div>

                </div>

                <div class="game-price">
                    $69.99
                </div>

            </div>

            <div class="game-actions-side">

                <iframe 
                    src="https://www.youtube.com/embed/on1E0EHLyik?si=DEofHpzzKhsmRuAY"
                    class="game-trailer">
                </iframe>

                <button class="cart-btn">
                    Add To Cart
                </button>

                <button class="wishlist-btn">
                    Add To Wishlist
                </button>

            </div>

        </div>

        <!-- CARD 5 -->
        <div class="game-card"  data-game-id="tekken8" data-game-price="49.99">

            <img src="./assets/games-store-images/Tekken8.png" alt="" class="game-cover">

            <div class="game-info">

                <h3 class="game-title">
                    Tekken 8
                </h3>

                <p class="game-description">
                    Master powerful combos in the ultimate fighting arena.
                </p>

                <div class="game-meta">

                    <p><span>Release Date:</span> Jan 26, 2024</p>

                    <p><span>Developer:</span> Bandai Namco</p>

                    <p><span>Published By:</span> Bandai Namco</p>

                </div>

                <div class="game-statistics">

                    <div class="game-rate">
                        ⭐ 4.7
                    </div>

                    <div class="game-review">
                        Very Positive
                    </div>

                </div>

                <div class="game-price">
                    $49.99
                </div>

            </div>

            <div class="game-actions-side">

                <iframe 
                    src="https://www.youtube.com/embed/07FdDRbdurg"
                    class="game-trailer">
                </iframe>

                <button class="cart-btn">
                    Add To Cart
                </button>

                <button class="wishlist-btn">
                    Add To Wishlist
                </button>

            </div>

        </div>

    </div>

</section>



    `;
}
export function initGameStore() {
    const cartItems = getCartItems();
    const wishlistItems = getWishlistItems();

    /* =========================
    CART BUTTONS
 ========================= */

    const cartButtons =
        document.querySelectorAll(
            ".cart-btn"
        );

    cartButtons.forEach((button) => {

        const gameCard =
            button.closest(".game-card");

        const gameId =
            gameCard.dataset.gameId;

        const alreadyInCart =
            cartItems.some(
                item => item.id === gameId
            );

        if (alreadyInCart) {

            button.textContent =
                "Added To Cart";

            button.disabled = true;
        }

        button.addEventListener(
            "click",

            () => {

                if (!isLoggedIn()) {

                    requireAuth("store");

                    return;
                }

                const game = {

                    id: gameId,

                    title:
                        gameCard.querySelector(
                            ".game-title"
                        ).textContent.trim(),

                    image:
                        gameCard.querySelector(
                            ".game-cover"
                        ).src,

                    price:
                        Number(gameCard.dataset.gamePrice)
                };

                addToCart(game);

                button.textContent =
                    "Added To Cart";

                button.disabled = true;

                refreshNavbar();
            }
        );
    });
    
    /* =========================
    WISHLIST BUTTONS
 ========================= */

    const wishlistButtons =
        document.querySelectorAll(
            ".wishlist-btn"
        );

    wishlistButtons.forEach((button) => {

        const gameCard =
            button.closest(".game-card");

        const gameId =
            gameCard.dataset.gameId;

        const alreadyInWishlist =
            wishlistItems.some(
                item => item.id === gameId
            );

        if (alreadyInWishlist) {

            button.textContent =
                "Added To Wishlist";

            button.disabled = true;
        }

        button.addEventListener(
            "click",

            () => {

                if (!isLoggedIn()) {

                    requireAuth("store");

                    return;
                }

                const game = {

                    id: gameId,

                    title:
                        gameCard.querySelector(
                            ".game-title"
                        ).textContent.trim(),

                    image:
                        gameCard.querySelector(
                            ".game-cover"
                        ).src
                };

                addToWishlist(game);

                button.textContent =
                    "Added To Wishlist";

                button.disabled = true;

                refreshNavbar();
            }
        );
    });
/* =========================
   SEARCH GAMES
========================= */

const searchInput =
    document.querySelector(
        ".gstore-search-bar input"
    );

const allGames =
    document.querySelectorAll(
        ".game-card"
    );

searchInput.addEventListener(
    "input",

    (e) => {

        const value =
            e.target.value
            .toLowerCase();

        allGames.forEach((game) => {

            const title =
                game.querySelector(
                    ".game-title"
                )
                .textContent
                .toLowerCase();

            const description =
                game.querySelector(
                    ".game-description"
                )
                .textContent
                .toLowerCase();

            const matches =
                title.includes(value)

                ||

                description.includes(value);

            if (matches) {

                game.style.display =
                    "grid";

            } else {

                game.style.display =
                    "none";
            }
        });
    }
);
/* =========================
   FILTER BY CATEGORY
========================= */

const categorySelect =
    document.querySelector(
        ".gstore-category"
    );

categorySelect.addEventListener(
    "change",

    (e) => {

        const category =
            e.target.value
            .toLowerCase();

        allGames.forEach((game) => {

            const title =
                game.querySelector(
                    ".game-title"
                )
                .textContent
                .toLowerCase();

            const description =
                game.querySelector(
                    ".game-description"
                )
                .textContent
                .toLowerCase();

            let matchesCategory =
                false;

            if (
                category ===
                "all categories"
            ) {

                matchesCategory = true;
            }

            else if (
                category === "sports"
            ) {

                matchesCategory =
                    title.includes("fc")
                    ||
                    description.includes("football");
            }

            else if (
                category === "open world"
            ) {

                matchesCategory =
                    description.includes("open world");
            }

            else if (
                category === "battle royale"
            ) {

                matchesCategory =
                    description.includes("battle royale");
            }

            else if (
                category === "fighting"
            ) {

                matchesCategory =
                    title.includes("tekken")
                    ||
                    description.includes("fighting");
            }

            else if (
                category === "action"
            ) {

                matchesCategory =
                    description.includes("action");
            }

            else if (
                category === "racing"
            ) {

                matchesCategory =
                    description.includes("racing");
            }

            else if (
                category === "adventure"
            ) {

                matchesCategory =
                    description.includes("adventure");
            }

            game.style.display =
                matchesCategory
                ? "grid"
                : "none";
        });
    }
);


}
