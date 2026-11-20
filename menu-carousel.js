(function () {
    window.initMenuCarousel = function (root) {
        const track = root.querySelector(".catalog-track");
        const cards = Array.from(track.children);
        const previous = root.querySelector('[data-direction="-1"]');
        const next = root.querySelector('[data-direction="1"]');
        const filters = Array.from(root.querySelectorAll(".catalog-filter"));
        const status = root.querySelector(".catalog-status");
        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

        function updateArrows() {
            previous.disabled = track.scrollTop <= 1;
            next.disabled = track.scrollHeight - track.clientHeight - track.scrollTop <= 1;
        }

        function visibleCards() {
            return cards.filter(function (card) { return !card.hidden; });
        }

        function rowPositions() {
            const top = track.getBoundingClientRect().top;
            const padding = parseFloat(getComputedStyle(track).paddingTop);
            return Array.from(new Set(visibleCards().map(function (card) {
                return Math.round(card.getBoundingClientRect().top - top + track.scrollTop - padding);
            })));
        }

        function moveTo(index) {
            const rows = rowPositions();
            const top = rows[Math.max(0, Math.min(index, rows.length - 1))];
            if (top === undefined) return;
            track.scrollTo({ top: top, behavior: reducedMotion.matches ? "instant" : "smooth" });
        }

        function move(direction) {
            const rows = rowPositions();
            let nearest = 0;
            rows.forEach(function (top, index) {
                if (Math.abs(top - track.scrollTop) < Math.abs(rows[nearest] - track.scrollTop)) {
                    nearest = index;
                }
            });
            moveTo(nearest + direction);
        }

        previous.addEventListener("click", function () { move(-1); });
        next.addEventListener("click", function () { move(1); });
        track.addEventListener("scroll", updateArrows, { passive: true });
        track.addEventListener("keydown", function (event) {
            if (event.target !== track) return;
            if (!["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End"].includes(event.key)) return;
            event.preventDefault();
            if (event.key === "Home") moveTo(0);
            else if (event.key === "End") moveTo(rowPositions().length - 1);
            else move((event.key === "ArrowUp" || event.key === "PageUp" ? -1 : 1) * (event.key.startsWith("Page") ? 3 : 1));
        });

        filters.forEach(function (filter) {
            filter.addEventListener("click", function () {
                filters.forEach(function (button) {
                    button.setAttribute("aria-pressed", String(button === filter));
                });
                cards.forEach(function (card) {
                    card.hidden = filter.dataset.category !== "all" && card.dataset.category !== filter.dataset.category;
                });
                track.scrollTo({ top: 0, behavior: "instant" });
                status.textContent = `${filter.textContent} · позиций: ${visibleCards().length}`;
                updateArrows();
            });
        });

        new ResizeObserver(updateArrows).observe(track);
        track.addEventListener("toggle", updateArrows, true);
        updateArrows();
    };

    window.menuCarouselShell = function (prefix, cards) {
        return `
            <div class="catalog-carousel" data-menu-carousel>
                <div class="catalog-controls">
                    <div class="catalog-filters" role="group" aria-label="Категории меню">
                        <button class="catalog-filter" type="button" data-category="all" aria-pressed="true" aria-controls="${prefix}-track">Все</button>
                        ${window.menuCatalog.categories.map(function (category) {
                            return `<button class="catalog-filter" type="button" data-category="${category.id}" aria-pressed="false" aria-controls="${prefix}-track">${category.name}</button>`;
                        }).join("")}
                    </div>
                    <div class="catalog-arrows" role="group" aria-label="Прокрутка меню">
                        <button class="catalog-arrow" type="button" data-direction="-1" aria-label="Прокрутить меню вверх" aria-controls="${prefix}-track" disabled>↑</button>
                        <button class="catalog-arrow" type="button" data-direction="1" aria-label="Прокрутить меню вниз" aria-controls="${prefix}-track">↓</button>
                    </div>
                </div>
                <div class="catalog-toolbar">
                    <span class="catalog-status" role="status" aria-live="polite">Все · позиций: ${window.menuCatalog.products.length}</span>
                </div>
                <p class="catalog-hint" id="${prefix}-hint">Листайте меню вниз колёсиком, свайпом или стрелками. С клавиатуры: ↑ ↓, PageUp, PageDown, Home и End.</p>
                <div class="catalog-track" id="${prefix}-track" tabindex="0" role="region" aria-label="Позиции меню" aria-describedby="${prefix}-hint">${cards}</div>
            </div>
        `;
    };
}());
