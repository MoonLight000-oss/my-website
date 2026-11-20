// Shared catalog for the main page and Order. Image paths are relative to this file.
(function () {
    const catalogURL = document.currentScript.src;
    const categories = [
        {
            "id": "shawarma",
            "name": "Шаурма"
        },
        {
            "id": "snacks",
            "name": "Закуски"
        },
        {
            "id": "additional",
            "name": "Дополнительный ассортимент"
        },
        {
            "id": "drinks",
            "name": "Напитки"
        },
        {
            "id": "seasonal",
            "name": "Сезонные напитки"
        }
    ];
    const products = [
        {
            "id": 1,
            "name": "Стандартная шаурма",
            "category": "shawarma",
            "description": "Курица, овощи, фирменный соус и тонкий лаваш.",
            "nutrition": "Вес шаурмы: 400 грамм из них: белок: 40г; жиры: 30г; углеводы: 70г; И всего 710 ккал.",
            "price": 219,
            "image": "img/Стандартная шаурма.png",
            "imageWidth": 1254,
            "imageHeight": 1254
        },
        {
            "id": 2,
            "name": "Сырная шаурма",
            "category": "shawarma",
            "description": "Больше сыра, нежное мясо, свежие овощи и соус.",
            "nutrition": "Вес шаурмы: 400 грамм из них: белок: 52г; жиры: 32г; углеводы: 75г; И всего 780 ккал.",
            "price": 239,
            "image": "img/Сырная шаурма.png",
            "imageWidth": 1254,
            "imageHeight": 1254
        },
        {
            "id": 3,
            "name": "Острая шаурма",
            "category": "shawarma",
            "description": "Пикантный соус, сочная начинка и хрустящие овощи.",
            "nutrition": "Вес шаурмы: 400 грамм из них: белок: 43г; жиры: 23г; углеводы: 69г; И всего 626 ккал.",
            "price": 249,
            "image": "img/Острая шаурма.png",
            "imageWidth": 1254,
            "imageHeight": 1254
        },
        {
            "id": 4,
            "name": "Протеиновая шаурма",
            "category": "shawarma",
            "description": "Шаурма со специальным ПП соусом и добавлением курицы для добора ежедневного белка!",
            "nutrition": "Ведь в ней на 400 грамм: белок: 67г; жиры: 11г; углеводы: 57г; И всего 600 ккал.",
            "price": 349,
            "image": "img/Протеиновая шаурма.png",
            "imageWidth": 1254,
            "imageHeight": 1254
        },
        {
            "id": 5,
            "name": "Двойная шаурма",
            "category": "shawarma",
            "description": "Увеличенная порция мяса, овощей и фирменного соуса.",
            "nutrition": "Вес шаурмы: 500 грамм из них: белок: 76г; жиры: 30г; углеводы: 82г; И всего 860 ккал.",
            "price": 299,
            "image": "img/Двойная шаурма.png",
            "imageWidth": 1254,
            "imageHeight": 1254
        },
        {
            "id": 6,
            "name": "Вегетарианская",
            "category": "shawarma",
            "description": "Овощи, сыр, зелень и легкий соус без мяса.",
            "nutrition": "Вес шаурмы: 400 грамм из них: белок: 13г; жиры: 25г; углеводы: 82г; И всего 620 ккал.",
            "price": 189,
            "image": "img/Вегетарианская шаурма.png",
            "imageWidth": 1254,
            "imageHeight": 1254
        },
        {
            "id": 7,
            "name": "Картофель фри",
            "category": "snacks",
            "description": "Горячий картофель с солью и соусом на выбор.",
            "nutrition": "Вес порции: 110 грамм из них: белок: 4г; жиры: 15г; углеводы: 40г; И всего 320 ккал.",
            "price": 119,
            "image": "img/Фри.png",
            "imageWidth": 1254,
            "imageHeight": 1254
        },
        {
            "id": 8,
            "name": "Наггетсы",
            "category": "snacks",
            "description": "Хрустящая порция куриных наггетсов к заказу.",
            "nutrition": "В количестве 6 штук. Вес порции: 100 грамм из них: белок: 16г; жиры: 16г; углеводы: 16г; И всего 270 ккал.",
            "price": 99,
            "image": "img/Наггетсы.png",
            "imageWidth": 1254,
            "imageHeight": 1254
        },
        {
            "id": 20,
            "name": "Сырники",
            "category": "additional",
            "description": "Порция и окончательная цена уточняются.",
            "nutrition": "",
            "price": null,
            "priceRange": [
                79,
                119
            ],
            "image": "img/menu-expansion/syrniki.webp",
            "imageWidth": 768,
            "imageHeight": 768,
            "sourceRef": "P172"
        },
        {
            "id": 21,
            "name": "Сэндвич с курицей",
            "category": "additional",
            "description": "Порция и окончательная цена уточняются.",
            "nutrition": "",
            "price": null,
            "priceRange": [
                159,
                199
            ],
            "image": "img/menu-expansion/chicken-sandwich.webp",
            "imageWidth": 768,
            "imageHeight": 768,
            "sourceRef": "P172"
        },
        {
            "id": 9,
            "name": "Напиток",
            "category": "drinks",
            "description": "Холодный напиток, который удобно взять с собой. Любой на выбор!",
            "nutrition": "450 мл",
            "price": 89,
            "image": "img/Напиток.png",
            "imageWidth": 1254,
            "imageHeight": 1254
        },
        {
            "id": 15,
            "name": "Вода питьевая",
            "category": "drinks",
            "description": "0,5 л",
            "nutrition": "",
            "price": 59,
            "priceRange": null,
            "image": "img/menu-expansion/drinking-water.webp",
            "imageWidth": 768,
            "imageHeight": 768,
            "sourceRef": "T6R7"
        },
        {
            "id": 10,
            "name": "Добрый Кола",
            "category": "drinks",
            "description": "0,5 л",
            "nutrition": "",
            "price": 109,
            "priceRange": null,
            "image": "img/menu-expansion/dobry-cola.webp",
            "imageWidth": 768,
            "imageHeight": 768,
            "sourceRef": "T6R2"
        },
        {
            "id": 11,
            "name": "Черноголовка Кола",
            "category": "drinks",
            "description": "0,5 л",
            "nutrition": "",
            "price": 99,
            "priceRange": null,
            "image": "img/menu-expansion/chernogolovka-cola.webp",
            "imageWidth": 768,
            "imageHeight": 768,
            "sourceRef": "T6R3"
        },
        {
            "id": 12,
            "name": "Evervess Cola",
            "category": "drinks",
            "description": "0,5 л",
            "nutrition": "",
            "price": 109,
            "priceRange": null,
            "image": "img/menu-expansion/evervess-cola.webp",
            "imageWidth": 768,
            "imageHeight": 768,
            "sourceRef": "T6R4"
        },
        {
            "id": 13,
            "name": "Холодный чай",
            "category": "drinks",
            "description": "0,5 л",
            "nutrition": "",
            "price": 99,
            "priceRange": null,
            "image": "img/menu-expansion/cold-tea.webp",
            "imageWidth": 768,
            "imageHeight": 768,
            "sourceRef": "T6R5"
        },
        {
            "id": 14,
            "name": "Pulpy",
            "category": "drinks",
            "description": "0,45 л",
            "nutrition": "",
            "price": 119,
            "priceRange": null,
            "image": "img/menu-expansion/pulpy.webp",
            "imageWidth": 768,
            "imageHeight": 768,
            "sourceRef": "T6R6"
        },
        {
            "id": 16,
            "name": "Сок",
            "category": "drinks",
            "description": "0,2 л",
            "nutrition": "",
            "price": 79,
            "priceRange": null,
            "image": "img/menu-expansion/juice.webp",
            "imageWidth": 768,
            "imageHeight": 768,
            "sourceRef": "T6R8"
        },
        {
            "id": 17,
            "name": "Чай горячий",
            "category": "drinks",
            "description": "0,3 л",
            "nutrition": "",
            "price": 59,
            "priceRange": null,
            "image": "img/menu-expansion/hot-tea.webp",
            "imageWidth": 768,
            "imageHeight": 768,
            "sourceRef": "T6R9"
        },
        {
            "id": 18,
            "name": "Кофе американо",
            "category": "drinks",
            "description": "0,25 л",
            "nutrition": "",
            "price": 99,
            "priceRange": null,
            "image": "img/menu-expansion/americano.webp",
            "imageWidth": 768,
            "imageHeight": 768,
            "sourceRef": "T6R10"
        },
        {
            "id": 19,
            "name": "Кофе капучино",
            "category": "drinks",
            "description": "0,25 л",
            "nutrition": "",
            "price": 139,
            "priceRange": null,
            "image": "img/menu-expansion/cappuccino.webp",
            "imageWidth": 768,
            "imageHeight": 768,
            "sourceRef": "T6R11"
        },
        {
            "id": 22,
            "name": "Тыквенный кофе",
            "category": "seasonal",
            "description": "Цена, объём и состав уточняются.",
            "nutrition": "",
            "price": null,
            "priceRange": null,
            "image": "img/menu-expansion/pumpkin-coffee.webp",
            "imageWidth": 768,
            "imageHeight": 768,
            "sourceRef": "P76; P138"
        },
        {
            "id": 23,
            "name": "Мохито",
            "category": "seasonal",
            "description": "Цена, объём и состав уточняются.",
            "nutrition": "",
            "price": null,
            "priceRange": null,
            "image": "img/menu-expansion/mojito-v2.webp",
            "imageWidth": 768,
            "imageHeight": 768,
            "sourceRef": "P76; P138"
        }
    ];

    products.forEach(function (product) {
        product.image = new URL(product.image, catalogURL).href;
        product.canOrder = Number.isFinite(product.price) && product.price > 0;
        product.priceLabel = product.canOrder
            ? `${product.price} ₽`
            : product.priceRange
                ? `${product.priceRange[0]}–${product.priceRange[1]} ₽ · оценка`
                : "Цена уточняется";
    });

    window.menuCatalog = { categories: categories, products: products };
}());
