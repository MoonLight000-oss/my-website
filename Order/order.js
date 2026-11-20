const products = window.menuCatalog.products;

const productGrid = document.getElementById("product-grid");
const cartList = document.getElementById("cart-list");
const cartTotal = document.getElementById("cart-total");
const checkoutButton = document.getElementById("checkout-button");
const checkoutFeedback = document.getElementById("checkout-feedback");
const paymentModal = document.getElementById("payment-modal");
const paymentCloseButton = document.getElementById("payment-close");
const paymentForm = document.getElementById("payment-form");
const paymentTotal = document.getElementById("payment-total");
const paymentError = document.getElementById("payment-error");
const paymentMethodInputs = Array.from(document.querySelectorAll('input[name="payment-method"]'));
const cardPaymentFields = document.getElementById("card-payment-fields");
const paymentCardNumber = document.getElementById("payment-card-number");
const paymentCardDate = document.getElementById("payment-card-date");
const paymentCardCode = document.getElementById("payment-card-code");
const orderStatus = document.getElementById("order-status");
const orderNumber = document.getElementById("order-number");
const statusSteps = Array.from(document.querySelectorAll("#status-steps li"));
const statusMessage = document.getElementById("status-message");
const statusIntervalInput = document.getElementById("status-interval-minutes");
const orderStatusLabel = document.getElementById("order-status-label");
const pickupCard = document.getElementById("pickup-card");
const pickupQrImage = document.getElementById("pickup-qr-image");
const pickupError = document.getElementById("pickup-error");
const downloadPickupQr = document.getElementById("download-pickup-qr");
const cancelDemoOrderButton = document.getElementById("cancel-demo-order");

const cart = {};
const orderStatuses = [
    {
        key: "accepted",
        title: "Принят",
        message: "Демозаказ принят. Реальная оплата и передача на кухню не выполнялись."
    },
    {
        key: "preparing",
        title: "Готовим",
        message: "Демонстрация приготовления. Статус изменён локальным таймером."
    },
    {
        key: "ready",
        title: "Готов к выдаче",
        message: "Демозаказ готов к выдаче. Ниже показан пример QR-кода, без серверного подтверждения."
    }
];

let currentStatusIndex = -1;
let orderStatusTimer;
let currentOrder;
let pickupQrDataUrl;
let pickupQrOrderId;

function formatPrice(price) {
    return `${price} ₽`;
}

function renderProducts() {
    const cards = products.map(function (product) {
        const category = window.menuCatalog.categories.find(function (item) { return item.id === product.category; });
        return `
            <article class="product-card" data-product-id="${product.id}" data-category="${product.category}">
                <div class="product-photo"><img src="${product.image}" alt="${product.name}" width="${product.imageWidth}" height="${product.imageHeight}" loading="lazy" decoding="async"></div>
                <div class="product-info">
                    <span class="catalog-card-category">${category.name}</span>
                    <h4>${product.name}</h4>
                    <p class="catalog-card-description">${product.description}</p>
                    <details class="catalog-details"><summary>Подробнее</summary><p>${product.description}</p>${product.nutrition ? `<p>${product.nutrition}</p>` : ""}</details>
                </div>
                <div class="product-bottom catalog-card-footer">
                    <span class="product-price">${product.priceLabel}</span>
                    <button class="add-button" type="button" data-id="${product.id}" ${product.canOrder ? "" : "disabled"} aria-label="${product.canOrder ? "Добавить: " : "Пока недоступно: "}${product.name}">${product.canOrder ? "Добавить" : "Недоступно"}</button>
                </div>
            </article>
        `;
    }).join("");
    productGrid.innerHTML = window.menuCarouselShell("order-menu", cards);
    window.initMenuCarousel(productGrid.querySelector("[data-menu-carousel]"));
}

function addToCart(productId) {
    const product = products.find(function (item) {
        return item.id === productId;
    });

    if (!product || !product.canOrder) {
        return;
    }

    if (!cart[productId]) {
        cart[productId] = {
            product: product,
            quantity: 0
        };
    }

    cart[productId].quantity += 1;
    renderCart();
}

function changeQuantity(productId, difference) {
    if (!cart[productId]) {
        return;
    }

    cart[productId].quantity += difference;

    if (cart[productId].quantity <= 0) {
        delete cart[productId];
    }

    renderCart();
}

function getCartItems() {
    return Object.values(cart);
}

function getTotalPrice() {
    return getCartItems().reduce(function (total, item) {
        return total + item.product.price * item.quantity;
    }, 0);
}

function renderCart() {
    const cartItems = getCartItems();

    if (cartItems.length === 0) {
        cartList.innerHTML = '<p class="empty-cart">Корзина пока пустая.</p>';
        cartTotal.textContent = formatPrice(0);
        return;
    }

    cartList.innerHTML = cartItems.map(function (item) {
        const product = item.product;
        const itemTotal = product.price * item.quantity;

        return `
            <div class="cart-item">
                <h3>${product.name}</h3>
                <div class="cart-row">
                    <div class="cart-controls">
                        <button class="cart-action" type="button" data-action="minus" data-id="${product.id}">-</button>
                        <span>${item.quantity}</span>
                        <button class="cart-action" type="button" data-action="plus" data-id="${product.id}">+</button>
                    </div>
                    <span class="cart-price">${formatPrice(itemTotal)}</span>
                </div>
            </div>
        `;
    }).join("");

    cartTotal.textContent = formatPrice(getTotalPrice());
}

productGrid.addEventListener("click", function (event) {
    const button = event.target.closest(".add-button");

    if (!button) {
        return;
    }

    addToCart(Number(button.dataset.id));
});

cartList.addEventListener("click", function (event) {
    const button = event.target.closest(".cart-action");

    if (!button) {
        return;
    }

    const productId = Number(button.dataset.id);
    const difference = button.dataset.action === "plus" ? 1 : -1;

    changeQuantity(productId, difference);
});

function setCardFieldsVisibility() {
    const selectedMethod = document.querySelector('input[name="payment-method"]:checked').value;
    const needsCardFields = selectedMethod === "card";

    cardPaymentFields.hidden = !needsCardFields;
    [paymentCardNumber, paymentCardDate, paymentCardCode].forEach(function (input) {
        input.required = needsCardFields;
    });
}

function openPaymentModal() {
    if (getCartItems().length === 0) {
        checkoutFeedback.textContent = "Сначала добавьте позиции в корзину.";
        return;
    }

    checkoutFeedback.textContent = "";
    paymentError.textContent = "";
    paymentTotal.textContent = formatPrice(getTotalPrice());
    paymentModal.classList.add("open");
    paymentModal.setAttribute("aria-hidden", "false");
    setCardFieldsVisibility();

    window.setTimeout(function () {
        if (!cardPaymentFields.hidden) {
            paymentCardNumber.focus();
        }
    }, 0);
}

function closePaymentModal() {
    paymentModal.classList.remove("open");
    paymentModal.setAttribute("aria-hidden", "true");
    paymentError.textContent = "";
}

function getStatusIntervalMinutes() {
    const value = Number(statusIntervalInput.value);
    const interval = Number.isFinite(value) ? Math.min(Math.max(value, 1), 120) : 5;

    statusIntervalInput.value = interval;
    return interval;
}

function randomHex(byteCount) {
    if (!window.crypto || typeof window.crypto.getRandomValues !== "function") {
        throw new Error("Web Crypto unavailable");
    }
    return Array.from(window.crypto.getRandomValues(new Uint8Array(byteCount)), function (byte) {
        return byte.toString(16).padStart(2, "0");
    }).join("");
}

function createDemoOrder() {
    return {
        id: randomHex(16),
        pickupToken: randomHex(32),
        status: "accepted",
        createdAt: Date.now(),
        total: getTotalPrice(),
        items: getCartItems().map(function (item) {
            return { id: item.product.id, name: item.product.name, price: item.product.price, quantity: item.quantity };
        })
    };
}

function clearPickupQr() {
    pickupQrDataUrl = undefined;
    pickupQrOrderId = undefined;
    pickupQrImage.removeAttribute("src");
    pickupQrImage.hidden = true;
    downloadPickupQr.disabled = true;
    pickupError.textContent = "";
    pickupCard.hidden = true;
}

function renderPickupQr() {
    if (!currentOrder || currentOrder.status !== "ready" || !currentOrder.pickupToken) {
        clearPickupQr();
        return;
    }

    pickupCard.hidden = false;
    if (pickupQrOrderId === currentOrder.id && pickupQrDataUrl) return;

    try {
        // This prefix is deliberately incompatible with a future live pickup token.
        const payload = `SHAURMA-DEMO:1:${currentOrder.id}:${currentOrder.pickupToken}`;
        const qr = qrcodegen.QrCode.encodeText(payload, qrcodegen.QrCode.Ecc.MEDIUM);
        const quietZone = 4;
        const scale = 12;
        const size = (qr.size + quietZone * 2) * scale;
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const context = canvas.getContext("2d");
        if (!context) throw new Error("Canvas unavailable");
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, size, size);
        context.fillStyle = "#000000";
        for (let y = 0; y < qr.size; y += 1) {
            for (let x = 0; x < qr.size; x += 1) {
                if (qr.getModule(x, y)) {
                    context.fillRect((x + quietZone) * scale, (y + quietZone) * scale, scale, scale);
                }
            }
        }

        pickupQrDataUrl = canvas.toDataURL("image/png");
        pickupQrOrderId = currentOrder.id;
        pickupQrImage.src = pickupQrDataUrl;
        pickupQrImage.width = size;
        pickupQrImage.height = size;
        pickupQrImage.style.setProperty("--qr-display-size", `${(qr.size + quietZone * 2) * 4}px`);
        pickupQrImage.alt = `Демонстрационный QR-код заказа № ${currentOrder.id}`;
        pickupQrImage.hidden = false;
        pickupError.textContent = "";
        downloadPickupQr.disabled = false;
    } catch (error) {
        clearPickupQr();
        pickupCard.hidden = false;
        pickupError.textContent = "Не удалось создать QR-код. Демо-статус заказа сохранён; скачивание недоступно.";
    }
}

function renderOrderStatus() {
    if (!currentOrder) return;
    const cancelled = currentOrder.status === "cancelled";
    const status = cancelled
        ? { title: "Отменён", message: "Демозаказ отменён в этом браузере. Сервер и сотрудник не уведомлялись." }
        : orderStatuses[currentStatusIndex];

    statusSteps.forEach(function (step, index) {
        step.classList.toggle("is-complete", !cancelled && index < currentStatusIndex);
        step.classList.toggle("is-current", !cancelled && index === currentStatusIndex);
        if (!cancelled && index === currentStatusIndex) step.setAttribute("aria-current", "step");
        else step.removeAttribute("aria-current");
    });

    statusMessage.textContent = status.message;
    orderStatusLabel.textContent = status.title;
    statusIntervalInput.disabled = cancelled || currentOrder.status === "ready";
    cancelDemoOrderButton.disabled = cancelled;
    renderPickupQr();
}

function startOrderStatusTimer() {
    window.clearInterval(orderStatusTimer);

    if (!currentOrder || currentOrder.status === "cancelled" || currentStatusIndex >= orderStatuses.length - 1) {
        return;
    }

    const intervalMilliseconds = getStatusIntervalMinutes() * 60 * 1000;
    const trackedOrder = currentOrder;

    const timer = window.setInterval(function () {
        if (currentOrder !== trackedOrder || trackedOrder.status === "cancelled" || currentStatusIndex >= orderStatuses.length - 1) {
            window.clearInterval(timer);
            return;
        }

        currentStatusIndex += 1;
        trackedOrder.status = orderStatuses[currentStatusIndex].key;
        renderOrderStatus();

        if (currentStatusIndex >= orderStatuses.length - 1) {
            window.clearInterval(timer);
        }
    }, intervalMilliseconds);
    orderStatusTimer = timer;
}

function showPaidOrder() {
    if (getCartItems().length === 0) {
        paymentError.textContent = "Сначала добавьте позиции в корзину.";
        return;
    }

    let nextOrder;
    try {
        nextOrder = createDemoOrder();
    } catch (error) {
        paymentError.textContent = "Не удалось создать демозаказ: безопасная генерация идентификатора недоступна. Корзина сохранена.";
        return;
    }
    window.clearInterval(orderStatusTimer);
    clearPickupQr();
    currentOrder = nextOrder;

    Object.keys(cart).forEach(function (productId) {
        delete cart[productId];
    });

    renderCart();
    closePaymentModal();
    paymentForm.reset();
    setCardFieldsVisibility();

    currentStatusIndex = 0;
    orderNumber.textContent = `№ ${currentOrder.id}`;
    orderStatus.hidden = false;
    renderOrderStatus();
    startOrderStatusTimer();
    checkoutFeedback.textContent = `Демозаказ на ${formatPrice(currentOrder.total)} создан. Реальный платёж не выполнялся. Статус ниже.`;
}

downloadPickupQr.addEventListener("click", function () {
    if (!currentOrder || currentOrder.status !== "ready" || !pickupQrDataUrl || pickupQrOrderId !== currentOrder.id) return;
    const link = document.createElement("a");
    link.href = pickupQrDataUrl;
    link.download = `demo-order-${currentOrder.id}-qr.png`;
    document.body.appendChild(link);
    link.click();
    link.remove();
});

cancelDemoOrderButton.addEventListener("click", function () {
    if (!currentOrder || currentOrder.status === "cancelled") return;
    window.clearInterval(orderStatusTimer);
    currentOrder.status = "cancelled";
    currentOrder.pickupToken = null;
    renderOrderStatus();
});

function validateCardPayment() {
    const cardNumber = paymentCardNumber.value.replace(/\s/g, "");
    const date = paymentCardDate.value.trim();
    const code = paymentCardCode.value.trim();

    if (!/^\d{12,19}$/.test(cardNumber)) {
        return "Введите номер карты: от 12 до 19 цифр.";
    }

    if (!/^\d{2}\/?\d{2}$/.test(date)) {
        return "Введите срок действия в формате ММ/ГГ.";
    }

    if (!/^\d{3,4}$/.test(code)) {
        return "Введите код из 3 или 4 цифр.";
    }

    return "";
}

checkoutButton.addEventListener("click", openPaymentModal);

paymentCloseButton.addEventListener("click", closePaymentModal);

paymentModal.addEventListener("click", function (event) {
    if (event.target === paymentModal) {
        closePaymentModal();
    }
});

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && paymentModal.classList.contains("open")) {
        closePaymentModal();
    }
});

paymentMethodInputs.forEach(function (input) {
    input.addEventListener("change", function () {
        paymentError.textContent = "";
        setCardFieldsVisibility();
    });
});

paymentForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const selectedMethod = document.querySelector('input[name="payment-method"]:checked').value;
    const validationError = selectedMethod === "card" ? validateCardPayment() : "";

    if (validationError) {
        paymentError.textContent = validationError;
        return;
    }

    showPaidOrder();
});

statusIntervalInput.addEventListener("change", function () {
    getStatusIntervalMinutes();

    if (!orderStatus.hidden && currentStatusIndex < orderStatuses.length - 1) {
        startOrderStatusTimer();
    }
});

renderProducts();
renderCart();
