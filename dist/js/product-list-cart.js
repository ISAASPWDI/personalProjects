export function productList() {
    const $template = document.getElementById('product-list-template');
    const $productList = document.querySelector('.product-list');

    if (!$template || !$productList) {
        console.warn('Product list elements not found. Skipping productList() execution.');
        return;
    }

    const desserts = {};
    const objTotalPriceOrder = {};

    async function fetchData(url) {
        try {
            const res = await fetch(url);
            return await res.json();
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    }

    async function initializeDesserts() {
        try {
            const data = await fetchData('/api/getDataDesserts');
            renderDesserts(data);
        } catch (error) {
            console.error('Failed to initialize desserts:', error);
        }
    }

    function createCartSection() {
        const $cartSection = document.createElement('div');
        $cartSection.classList.add('div-card-empty', 'd-flex', 'flex-column', 'cart-content', 'rounded-4');

        const $yourCart = document.createElement('div');
        $yourCart.classList.add('your-cart-quantity');
        $yourCart.innerHTML = `<h5 class="cart-content-red-style">Your cart (0)</h5>`;

        const $cartContent = document.createElement('div');
        $cartContent.classList.add('d-flex', 'flex-column', 'align-items-center', 'mt-4', 'div-added-desserts');
        $cartContent.innerHTML = `
            <div class="d-flex flex-column align-items-center cart-empty">
                <img src="./assets/images/illustration-empty-cart.svg" alt="">
                <p class="cart-content-parr mt-3">Your added items will appear here</p>
            </div>
        `;

        $cartSection.append($yourCart, $cartContent);
        return $cartSection;
    }

    function renderDesserts(data) {
        const $container = document.createElement('div');
        $container.className = 'row row-cols-1 row-cols-md-3 g-4';

        data.forEach(dessert => {
            const $clone = document.importNode($template.content, true);

            $clone.querySelector('.dessert-container').dataset.numberOfDessert = dessert.id;
            $clone.querySelector('.card-img-top').src = dessert.image.mobile;
            $clone.querySelector('.product-list-btn').textContent = 'Add to cart';

            const $btnImg = document.createElement('img');
            $btnImg.classList.add('product-list-btn-img', 'me-2');
            $btnImg.src = './assets/images/icon-add-to-cart.svg';
            $clone.querySelector('.product-list-btn').prepend($btnImg);

            $clone.querySelector('.card-subtitle').textContent = dessert.category;
            $clone.querySelector('.card-title').textContent = dessert.name;
            $clone.querySelector('.card-title').style.color = 'rgb(116, 102, 100)';

            $clone.querySelector('.card-text').textContent = `$${dessert.price.toFixed(2)}`;
            $clone.querySelector('.card-text').style.color = 'hsl(14, 86%, 42%)';

            $container.appendChild($clone);
        });

        $container.appendChild(createCartSection());
        $productList.appendChild($container);
    }

    function handleCartOperations() {
        document.addEventListener('click', (e) => {
            const target = e.target;
            const productListBtn = target.closest('.product-list-btn');

            if (productListBtn) {
                handleAddToCart(productListBtn);
            } else if (target.classList.contains('inc')) {
                handleDessertQuantityInc(productListBtn);
            } else if (target.classList.contains('dec')) {
                handleDessertQuantityDec(productListBtn);
            }
        });
    }

    function handleAddToCart(button) {
        styleButton(button);
        updateQuantity(0, button);
    }

    function styleButton(button) {
        button.style.color = 'rgb(255,255,255)';
        button.style.backgroundColor = 'hsl(14, 86%, 42%)';

        const $imgDessert = button.closest('.card-img-btn').previousElementSibling;
        $imgDessert.style.border = '.2rem solid hsl(14, 86%, 42%)';
    }

    function updateQuantity(quantity, button) {
        const $divCartEmpty = document.querySelector('.cart-empty');
        let $divShowingDesserts = document.querySelector('.div-showing-desserts');

        if (!$divShowingDesserts) {
            $divShowingDesserts = document.createElement('div');
            $divShowingDesserts.classList.add('row', 'container', 'div-showing-desserts');
            document.querySelector('.div-added-desserts').appendChild($divShowingDesserts);
        }

        // Perform data fetch and update logic
        fetchData('/api/getDataDesserts').then(() => {
            const dessertId = button.closest('.dessert-container').dataset.numberOfDessert;
            const quantity = desserts[dessertId] || 0;

            updateOrCreateDessertInCart($divShowingDesserts, dessertId, quantity);
            updateTotalOrderPrice();
        });

        $divCartEmpty?.remove();
    }

    function updateTotalOrderPrice() {
        const totalOrderPrice = Object.values(objTotalPriceOrder).reduce((sum, price) => sum + price, 0);
        let $updateTotalOrder = document.querySelector('.div-total-order-quantity-style');
        
        if (!$updateTotalOrder) {
            const $divShowingDesserts = document.querySelector('.div-showing-desserts');
            const totalOrderHtml = `
                <div class="div-total-order">
                    <div class="d-flex justify-content-between mt-3 mb-4 align-items-center">
                        <p class="fs-6 div-total-order-text-style">Order Total</p>
                        <p class="fs-4 div-total-order-quantity-style">$0.00</p>
                    </div>
                </div>
            `;
            $divShowingDesserts.insertAdjacentHTML('beforeend', totalOrderHtml);
            $updateTotalOrder = document.querySelector('.div-total-order-quantity-style');
        }

        $updateTotalOrder.textContent = `$${totalOrderPrice.toFixed(2)}`;
    }

    initializeDesserts();
    handleCartOperations();
}
