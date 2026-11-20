function renderMenu() {
    const container = document.getElementById("menu-categories");
    const cards = window.menuCatalog.products.map(function (product) {
        const category = window.menuCatalog.categories.find(function (item) { return item.id === product.category; });
        return `
            <article class="menu-card" data-product-id="${product.id}" data-category="${product.category}">
                <div class="menu-card-photo"><img src="${product.image}" alt="${product.name}" width="${product.imageWidth}" height="${product.imageHeight}" loading="lazy" decoding="async"></div>
                <div class="menu-card-info">
                    <span class="catalog-card-category">${category.name}</span>
                    <h4>${product.name}</h4>
                    <p class="catalog-card-description">${product.description}</p>
                    <details class="catalog-details"><summary>Подробнее</summary><p>${product.description}</p>${product.nutrition ? `<p>${product.nutrition}</p>` : ""}</details>
                </div>
                <div class="catalog-card-footer">
                    <span class="menu-card-price">${product.priceLabel}</span>
                    ${product.canOrder ? "" : '<p class="menu-card-availability">Пока недоступно для заказа</p>'}
                </div>
            </article>
        `;
    }).join("");
    container.innerHTML = window.menuCarouselShell("main-menu", cards);
    window.initMenuCarousel(container.querySelector("[data-menu-carousel]"));
}

renderMenu();

// Keep the shorter menu alongside the existing sidebar; tall menus can scroll fully.
const mainMenuColumn = document.querySelector(".main");
function updateMenuStickyOffset() {
    mainMenuColumn.style.setProperty("--menu-sticky-top", `${Math.min(24, window.innerHeight - mainMenuColumn.offsetHeight - 24)}px`);
}
new ResizeObserver(updateMenuStickyOffset).observe(mainMenuColumn);
window.addEventListener("resize", updateMenuStickyOffset);
updateMenuStickyOffset();

const openRegisterButton = document.getElementById("open-register");
const registerModal = document.getElementById("register-modal");
const registerCloseButton = document.getElementById("register-close");
const registerForm = document.getElementById("register-form");
const registerError = document.getElementById("register-error");
const emailInput = document.getElementById("user-email");
const passwordInput = document.getElementById("user-password");

function openRegisterModal() {
    registerModal.classList.add("open");
    registerError.textContent = "";
    emailInput.focus();
}

function closeRegisterModal() {
    registerModal.classList.remove("open");
}

function isEmailValid(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

openRegisterButton.addEventListener("click", function (event) {
    event.preventDefault();
    openRegisterModal();
});

registerCloseButton.addEventListener("click", closeRegisterModal);

registerModal.addEventListener("click", function (event) {
    if (event.target === registerModal) {
        closeRegisterModal();
    }
});

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        closeRegisterModal();
    }
});

registerForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!isEmailValid(email)) {
        registerError.textContent = "Введите правильную почту.";
        emailInput.focus();
        return;
    }

    if (password.length === 0) {
        registerError.textContent = "Введите пароль.";
        passwordInput.focus();
        return;
    }

    window.location.href = "Order/order.html";
});

const itemPopover = document.getElementById("item-popover");
const itemPopoverPhoto = document.getElementById("item-popover-photo");
const itemPopoverTitle = document.getElementById("item-popover-title");
const itemPopoverDescription = document.getElementById("item-popover-description");
let activePopoverItem;
let carouselResumeTimer;

function markSelected(items, selectedItem) {
    items.forEach(function (item) {
        item.setAttribute("aria-pressed", item === selectedItem ? "true" : "false");
    });
}

function positionItemPopover(item) {
    if (!itemPopover.classList.contains("is-visible")) {
        return;
    }

    const itemRect = item.getBoundingClientRect();
    const popoverRect = itemPopover.getBoundingClientRect();
    const edge = 14;
    let left = itemRect.right + edge;
    let top = itemRect.top + itemRect.height / 2 - popoverRect.height / 2;

    if (left + popoverRect.width > window.innerWidth - edge) {
        left = itemRect.left - popoverRect.width - edge;
    }

    if (left < edge) {
        left = Math.max(edge, Math.min(
            window.innerWidth - popoverRect.width - edge,
            itemRect.left + itemRect.width / 2 - popoverRect.width / 2
        ));
    }

    top = Math.max(edge, Math.min(top, window.innerHeight - popoverRect.height - edge));
    itemPopover.style.left = `${left}px`;
    itemPopover.style.top = `${top}px`;
}

function showItemPopover(item, thumbnailSelector) {
    const thumbnail = item.querySelector(thumbnailSelector);

    itemPopoverPhoto.innerHTML = thumbnail ? thumbnail.innerHTML : "";
    itemPopoverTitle.textContent = item.dataset.title;
    itemPopoverDescription.textContent = item.dataset.description;
    itemPopover.classList.add("is-visible");
    itemPopover.setAttribute("aria-hidden", "false");
    activePopoverItem = item;

    window.requestAnimationFrame(function () {
        positionItemPopover(item);
    });
}

function hideItemPopover() {
    itemPopover.classList.remove("is-visible");
    itemPopover.setAttribute("aria-hidden", "true");
    activePopoverItem = undefined;
}

window.addEventListener("resize", function () {
    if (activePopoverItem) {
        positionItemPopover(activePopoverItem);
    }
});

window.addEventListener("scroll", function () {
    if (activePopoverItem) {
        positionItemPopover(activePopoverItem);
    }
}, true);

const serviceItems = Array.from(document.querySelectorAll(".service-item"));
let serviceCarouselTimer;

function startServiceCarousel() {
    if (serviceCarouselTimer || serviceItems.length === 0) {
        return;
    }

    serviceCarouselTimer = window.setInterval(function () {
        serviceItems.forEach(function (item) {
            item.dataset.slot = String((Number(item.dataset.slot) + 1) % serviceItems.length);
        });
    }, 3800);
}

function pauseServiceCarousel() {
    window.clearInterval(serviceCarouselTimer);
    serviceCarouselTimer = undefined;
}

function resumeServiceCarouselLater() {
    window.clearTimeout(carouselResumeTimer);
    carouselResumeTimer = window.setTimeout(startServiceCarousel, 5000);
}

serviceItems.forEach(function (item) {
    item.addEventListener("mouseenter", function () {
        pauseServiceCarousel();
        showItemPopover(item, ".service-thumb");
        markSelected(serviceItems, item);
    });

    item.addEventListener("mouseleave", function () {
        hideItemPopover();
        startServiceCarousel();
    });

    item.addEventListener("focus", function () {
        pauseServiceCarousel();
        showItemPopover(item, ".service-thumb");
        markSelected(serviceItems, item);
    });

    item.addEventListener("blur", function () {
        hideItemPopover();
        startServiceCarousel();
    });

    item.addEventListener("click", function (event) {
        event.stopPropagation();
        pauseServiceCarousel();
        showItemPopover(item, ".service-thumb");
        markSelected(serviceItems, item);
        resumeServiceCarouselLater();
    });
});

const flowerItems = Array.from(document.querySelectorAll(".promo-petal, .promo-center"));
const promotionList = document.getElementById("promotion-list");

// The compact flower keeps its shape; the list offers full-size text and tap targets.
flowerItems.forEach(function (item) {
    const option = item.cloneNode(true);
    option.className = "promotion-option";
    option.querySelector(".offer-label").textContent = item.dataset.title;
    promotionList.appendChild(option);
});
document.getElementById("promotion-details").hidden = false;

const promotionItems = flowerItems.concat(Array.from(promotionList.children));

promotionItems.forEach(function (item) {
    item.addEventListener("mouseenter", function () {
        showItemPopover(item, ".promo-thumb");
        markSelected(promotionItems, item);
    });

    item.addEventListener("mouseleave", hideItemPopover);

    item.addEventListener("focus", function () {
        showItemPopover(item, ".promo-thumb");
        markSelected(promotionItems, item);
    });

    item.addEventListener("blur", hideItemPopover);

    item.addEventListener("click", function (event) {
        event.stopPropagation();
        showItemPopover(item, ".promo-thumb");
        markSelected(promotionItems, item);
    });
});

document.addEventListener("click", function (event) {
    if (!event.target.closest(".service-item, .promo-petal, .promo-center, .promotion-option")) {
        hideItemPopover();
    }
});

startServiceCarousel();
