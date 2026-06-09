import {
    getListings,
    createListing,
    deleteListing,
    getMyListings,
    searchListings,
} from "../services/marketplace.service.js";
import { isLoggedIn, getUser, requireAuth } from "../utils/auth.js";
import { API_BASE_URL } from "../config/api.js";
import { showToast } from "../utils/toast.js";

// ─── HTML Builders ───────────────────────────────────────────────────────────

function buildConditionBadge(condition) {
    const cls = condition === "New" ? "badge--new" : "badge--used";
    return `<span class="mp-card__badge ${cls}">${condition}</span>`;
}

function buildListingCard(item) {
    return `
    <article class="mp-card" data-id="${item.id}">
      <div class="mp-card__media">
        <img 
  src="${item.image && item.image.startsWith("http")
            ? item.image
            : `${API_BASE_URL}${item.image}`
        }"
  alt="${item.title}"
  class="mp-card__img"
  loading="lazy"
/>
        ${buildConditionBadge(item.condition)}
      </div>
      <div class="mp-card__body">
        <h3 class="mp-card__title">${item.title}</h3>
        <p class="mp-card__desc">${item.description}</p>
        <div class="mp-card__meta">
          <span class="mp-card__seller">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            ${item.username}
          </span>
          <span class="mp-card__price">$${item.price}</span>
        </div>
        <button class="mp-btn mp-btn--contact" data-action="contact" data-chat-user="${item.user_id}">
            Contact Seller
        </button>
      </div>
    </article>
  `;
}

function buildMyListingRow(item) {
    return `
    <div class="mp-mylist__row" data-id="${item.id}">
      <img
  src="${item.image && item.image.startsWith("http")
            ? item.image
            : `${API_BASE_URL}${item.image}`
        }"
  alt="${item.title}"
  class="mp-mylist__img"
/>
      <div class="mp-mylist__info">
        <span class="mp-mylist__title">${item.title}</span>
        <span class="mp-mylist__price">$${item.price}</span>
      </div>
      <button class="mp-btn mp-btn--remove" data-action="remove" data-id="${item.id}">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
        Remove
      </button>
    </div>
  `;
}

function renderListings(listings) {
    const grid = document.getElementById("mp-grid");

    grid.innerHTML = listings.map((item) => buildListingCard(item)).join("");
}

export function MarketPlace() {
    return `
    <section class="mp-page">
 
      <!-- Scanline overlay -->
      <div class="mp-scanlines" aria-hidden="true"></div>
 
      <!-- ── Hero ────────────────────────────────────── -->
      <header class="mp-hero">
        <div class="mp-hero__glow" aria-hidden="true"></div>
        <div class="mp-hero__content">
          <p class="mp-hero__eyebrow">JGamerz Platform</p>
          <h1 class="mp-hero__title">
            <span class="mp-hero__title-line">The</span>
            <span class="mp-hero__title-accent">Marketplace</span>
          </h1>
          <p class="mp-hero__subtitle">
            Trade gear, skins &amp; digital assets with the JGamerz community.
            Safe deals. Real gamers. Instant connections.
          </p>
          <div class="mp-hero__stats">
            <div class="mp-hero__stat"><span class="mp-hero__stat-val">12,400+</span><span class="mp-hero__stat-label">Active Listings</span></div>
            <div class="mp-hero__divider" aria-hidden="true"></div>
            <div class="mp-hero__stat"><span class="mp-hero__stat-val">98%</span><span class="mp-hero__stat-label">Trusted Sellers</span></div>
            <div class="mp-hero__divider" aria-hidden="true"></div>
            <div class="mp-hero__stat"><span class="mp-hero__stat-val">$4.2M</span><span class="mp-hero__stat-label">Traded Monthly</span></div>
          </div>
        </div>
      </header>
 
      <!-- ── Controls ─────────────────────────────────── -->
      <div class="mp-controls">
        <div class="mp-search">
          <svg class="mp-search__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            id="mp-search-input"
            class="mp-search__input"
            type="text"
            placeholder="Search items, skins, gear…"
            autocomplete="off"
          />
        </div>
        <div class="mp-controls__actions">
          <button id="mp-btn-mylistings" class="mp-btn mp-btn--secondary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            My Listings
          </button>
          <button id="mp-btn-addlisting" class="mp-btn mp-btn--primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Listing
          </button>
        </div>
      </div>
 
      <!-- ── Listings Grid ─────────────────────────────── -->
      <div id="mp-grid" class="mp-grid">
       
      </div>
 
      <!-- ── My Listings Modal ──────────────────────────── -->
      <div id="mp-modal-mine" class="mp-modal" aria-hidden="true" role="dialog" aria-modal="true" aria-labelledby="mp-modal-mine-title">
        <div class="mp-modal__backdrop" data-close="mine"></div>
        <div class="mp-modal__panel">
          <div class="mp-modal__header">
            <h2 id="mp-modal-mine-title" class="mp-modal__title">My Listings</h2>
            <button class="mp-modal__close" data-close="mine" aria-label="Close modal">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div id="mp-mylist-body" class="mp-mylist"></div>
          <p id="mp-mylist-empty" class="mp-mylist__empty" style="display:none;">You have no active listings.</p>
        </div>
      </div>

      <!-- ADD LISTING MODAL -->

<div
    id="mp-modal-add"
    class="mp-modal"
>

    <div
        class="mp-modal__backdrop"
        data-close="add"
    ></div>

    <div class="mp-modal__panel">

        <div class="mp-modal__header">

            <h2 class="mp-modal__title">
                Add Listing
            </h2>

            <button
                class="mp-modal__close"
                data-close="add"
            >
                ✕
            </button>

        </div>

        <div
            id="mp-upload-zone"
            class="mp-upload"
        >

            <input
                type="file"
                id="mp-file-input"
                class="mp-upload__file-input"
                accept="image/*"
            >

            <div
                id="mp-upload-placeholder"
                class="mp-upload__placeholder"
            >
                Upload Item Image
            </div>

            <img
                id="mp-preview-img"
                class="mp-upload__preview"
                style="display:none;"
            >

        </div>

        <form class="mp-form" id="mp-add-listing-form" autocomplete="off" novalidate>

            <div class="mp-field">

                <label class="mp-field__label">
                    Title
                </label>

                <input
                    id="mp-field-title"
                    type="text"
                    class="mp-field__input"
                >

            </div>

            <div class="mp-field">

                <label class="mp-field__label">
                    Description
                </label>

                <textarea
                    id="mp-field-desc"
                    class="mp-field__input mp-field__textarea"
                ></textarea>

            </div>

            <div class="mp-form__row">

                <div class="mp-field">

                    <label class="mp-field__label">
                        Price
                    </label>

                    <input
                        id="mp-field-price"
                        type="number"
                        class="mp-field__input"
                    >

                </div>

                <div class="mp-field">

                    <label class="mp-field__label">
                        Condition
                    </label>

                    <select
                        id="mp-field-condition"
                        class="mp-field__input"
                    >
                        <option>New</option>
                        <option>Used</option>
                    </select>

                </div>

            </div>

            <p
                id="mp-form-error"
                class="mp-form__error"
                style="display:none;"
            ></p>

            <button
                id="mp-btn-submit"
                class="mp-btn mp-btn--primary mp-btn--full"
                type="submit"
            >
                Post Listing
            </button>

        </form>

    </div>

</div>
 
    </section>
  `;
}
export async function initMarketPlace() {
    let listings = [];

    try {
        listings = await getListings();

        console.log(listings);

        renderListings(listings);
    } catch (error) {
        console.log("INITIAL LOAD FAILED:", error);
    }

    const $ = (sel) => document.querySelector(sel);
    const grid = () => $("#mp-grid");
    const emptyState = () => $("#mp-empty");

    function openModal(which) {
        const modal = $(`#mp-modal-${which}`);
        modal.setAttribute("aria-hidden", "false");
        modal.classList.add("mp-modal--open");
        document.body.style.overflow = "hidden";
    }

    function closeModal(which) {
        const modal = $(`#mp-modal-${which}`);
        modal.setAttribute("aria-hidden", "true");
        modal.classList.remove("mp-modal--open");
        document.body.style.overflow = "";
    }

    function renderGrid(items) {
        grid().innerHTML = items.map(buildListingCard).join("");
    }
    function showError(msg) {
        const el = $("#mp-form-error");
        el.textContent = msg;
        el.style.display = "block";
    }

    function clearError() {
        const el = $("#mp-form-error");
        el.textContent = "";
        el.style.display = "none";
    }

    function resetAddForm() {
        $("#mp-field-title").value = "";
        $("#mp-field-desc").value = "";
        $("#mp-field-price").value = "";
        $("#mp-field-condition").value = "New";
        $("#mp-preview-img").style.display = "none";
        $("#mp-preview-img").src = "";
        $("#mp-file-input").value = "";
        $("#mp-upload-placeholder").style.display = "flex";
        clearError();
    }

    function showMarketplaceAlert(message) {

        const oldAlert =
            document.querySelector(
                ".mp-custom-alert"
            );

        if (oldAlert) {
            oldAlert.remove();
        }

        const alert =
            document.createElement("div");

        alert.className =
            "mp-custom-alert";

        alert.innerHTML = `
        <div class="mp-custom-alert__icon">
            ⚠
        </div>

        <p class="mp-custom-alert__text">
            ${message}
        </p>
    `;

        document.body.appendChild(alert);

        setTimeout(() => {
            alert.classList.add("show");
        }, 10);

        setTimeout(() => {

            alert.classList.remove("show");

            setTimeout(() => {
                alert.remove();
            }, 300);

        }, 2500);
    }

    // ── Search ───────────────────────────────────────────────────────────────
    $("#mp-search-input").addEventListener(
        "input",

        async (e) => {

            const query = e.target.value.trim();

            try {

                // إذا فاضي رجع كل العناصر
                if (!query) {

                    listings = await getListings();

                    renderListings(listings);

                    return;
                }

                // ابحث
                const results =
                    await searchListings(query);

                renderListings(results);

            } catch (error) {

                console.log(
                    "SEARCH FAILED:",
                    error
                );
            }
        },
    );


    // ── Open / Close Modals ──────────────────────────────────────────────────

    $("#mp-btn-addlisting").addEventListener("click", () => {
        if (!isLoggedIn()) {
            return requireAuth("marketplace");
        }

        resetAddForm();

        openModal("add");
    });

    // ─────────────────────────────────────────────
    // MY LISTINGS
    // ─────────────────────────────────────────────

    $("#mp-btn-mylistings").addEventListener(
        "click",

        async () => {
            if (!isLoggedIn()) {
                navigate("auth");

                return;
            }

            let mine = [];

            try {
                mine = await getMyListings();
            } catch (error) {
                console.log("MY LISTINGS FETCH FAILED:", error);

                return showToast("Failed to load listings");
            }

            const body = $("#mp-mylist-body");

            const empty = $("#mp-mylist-empty");

            if (mine.length === 0) {
                body.innerHTML = "";

                empty.style.display = "block";
            } else {
                body.innerHTML = mine.map(buildMyListingRow).join("");

                empty.style.display = "none";
            }

            openModal("mine");
        },
    );

    // Close buttons & backdrops
    document.addEventListener("click", (e) => {
        const closeTarget = e.target.closest("[data-close]");
        if (closeTarget) {
            closeModal(closeTarget.dataset.close);
        }
    });

    // ESC key
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeModal("add");
            closeModal("mine");
        }
    });

    // ── Image Preview ─────────────────────────────────────────────────────────

    const uploadZone = $("#mp-upload-zone");
    const fileInput = $("#mp-file-input");
    const previewImg = $("#mp-preview-img");
    const placeholder = $("#mp-upload-placeholder");

    uploadZone.addEventListener("click", (e) => {
        if (!e.target.closest("img")) fileInput.click();
    });

    uploadZone.addEventListener("dragover", (e) => {
        e.preventDefault();
        uploadZone.classList.add("mp-upload--drag");
    });
    uploadZone.addEventListener("dragleave", () =>
        uploadZone.classList.remove("mp-upload--drag"),
    );
    uploadZone.addEventListener("drop", (e) => {
        e.preventDefault();
        uploadZone.classList.remove("mp-upload--drag");
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith("image/")) applyPreview(file);
    });

    fileInput.addEventListener("change", () => {
        const file = fileInput.files[0];
        if (file) applyPreview(file);
    });

    function applyPreview(file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
            previewImg.src = ev.target.result;
            previewImg.style.display = "block";
            placeholder.style.display = "none";
        };
        reader.readAsDataURL(file);
    }

    // ── Submit New Listing ────────────────────────────────────────────────────

    $("#mp-add-listing-form").addEventListener(
        "submit",

        async (event) => {
            event.preventDefault();
            event.stopPropagation();
            clearError();

            try {
                const user = getUser();

                if (!user) {
                    navigate("auth");

                    return;
                }

                const title = $("#mp-field-title").value.trim();

                const desc = $("#mp-field-desc").value.trim();

                const price = $("#mp-field-price").value;

                const condition = $("#mp-field-condition").value;

                const image = $("#mp-file-input").files[0];

                // Validation
                if (!title) {
                    return showError("Please enter title");
                }

                if (!desc) {
                    return showError("Please enter description");
                }

                if (!price) {
                    return showError("Please enter price");
                }

                // CREATE FORMDATA
                const formData = new FormData();

                formData.append("title", title);

                formData.append("description", desc);

                formData.append("price", price);

                formData.append("condition", condition);

                // image optional
                if (image) {
                    formData.append("image", image);
                }

                // SEND TO API
                const createdListing = await createListing(formData);
                const scrollY = window.scrollY;
                const listingForGrid = {
                    ...createdListing,
                    username: createdListing.username || user.username,
                };

                listings = [
                    listingForGrid,
                    ...listings.filter((item) => item.id !== listingForGrid.id),
                ];

                renderListings(listings);

                showToast("Listing created successfully");

                // حاول تحدث الليستينغز
                closeModal("add");

                resetAddForm();
                window.scrollTo({ top: scrollY });
            } catch (error) {
                console.error("CREATE LISTING ERROR:", error);

                showError("Failed to create listing");
            }
        },
    );
    // ── Contact Seller (delegated) ────────────────────────────────────────────
    document.addEventListener("click", (e) => {

        const btn =
            e.target.closest('[data-action="contact"]');

        if (!btn) return;

        if (!isLoggedIn()) {
            return requireAuth("community");
        }

        const currentUser =
            getUser();

        const sellerId =
            Number(btn.dataset.chatUser);

        // منع مراسلة نفسك
        if (currentUser?.id === sellerId) {

            showMarketplaceAlert(
                "You can't message yourself"
            );

            return;
        }

        localStorage.setItem(
            "openChatUser",
            sellerId
        );

        navigate("community");
    });

    // ── Remove Listing (My Listings modal, delegated) ─────────────────────────
    // ─────────────────────────────────────────────
    // REMOVE LISTING
    // ─────────────────────────────────────────────

    $("#mp-mylist-body").addEventListener("click", async (e) => {
        const btn = e.target.closest('[data-action="remove"]');

        if (!btn) return;

        // حماية
        if (!isLoggedIn()) {
            return requireAuth("marketplace");
        }

        const id = parseInt(btn.dataset.id);

        const currentUser = getUser();

        // تأكد هذا الـ listing تبع المستخدم الحالي
        const mine = await getMyListings();

        const listing = mine.find((l) => l.id === id);

        if (!listing) {
            return showToast("Listing not found.");
        }

        // حماية صلاحيات
        if (listing.user_id !== currentUser?.id) {
            return showToast("Unauthorized action.");
        }
        const modal =
            document.querySelector(
                ".delete-modal"
            );

        modal.querySelector("h3").textContent =
            "Delete Item";

        modal.querySelector("p").textContent =
            "Are you sure you want to delete this item?";

        const cancelBtn =
            document.querySelector(
                "#cancelDelete"
            );

        const confirmBtn =
            document.querySelector(
                "#confirmDeleteBtn"
            );

        modal.classList.remove(
            "hidden"
        );

        const confirmed =
            await new Promise((resolve) => {

                confirmBtn.onclick = () => {

                    modal.classList.add(
                        "hidden"
                    );

                    resolve(true);
                };

                cancelBtn.onclick = () => {

                    modal.classList.add(
                        "hidden"
                    );

                    resolve(false);
                };
            });

        if (!confirmed) return;

        const listingCard =
            btn.closest(".mp-mylist__row");

        // حذف من الـ API
        const success = await deleteListing(id);

        if (!success) {
            showToast("Failed to delete listing.");
            return;
        }

        listingCard.remove();

        try {
            listings = await getListings();

            renderListings(listings);

        } catch (error) {

            console.log(
                "REFRESH AFTER DELETE FAILED:",
                error
            );
        }

        // تحديث my listings
        const updatedMine =
            mine.filter(
                (l) => l.id !== id
            );

        const body =
            $("#mp-mylist-body");

        const empty =
            $("#mp-mylist-empty");

        if (updatedMine.length === 0) {

            body.innerHTML = "";

            empty.style.display = "block";

        } else {

            body.innerHTML =
                updatedMine
                    .map(buildMyListingRow)
                    .join("");

            empty.style.display = "none";
        }
    });
}
