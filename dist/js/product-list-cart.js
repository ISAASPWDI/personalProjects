export function productList() {
    const $template = document.getElementById('product-list-template');
    const $productList = document.querySelector('.product-list');
    if (!$template || !$productList) {
        console.warn('Product list elements not found. Skipping productList() execution.');
        return;
    }
    async function getDataDesserts() {
        try {
            const res = await fetch('/.netlify/functions/api/getDataDesserts');
            const data = await res.json();
            return data;
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }

    }
    getDataDesserts().then((data) => {
        console.log(data);
    })
    function showDesserts() {
        try {
            getDataDesserts().then((data) => {
                

                const $container = document.createElement('div');
                $container.className = 'row row-cols-1 row-cols-md-3 g-4';

                data.forEach(element => {
                    const $clone = document.importNode($template.content, true);
                    $clone.querySelector('.dessert-container').dataset.numberOfDessert = element.id;


                    $clone.querySelector('.card-img-top').src = element.image.mobile;
                    $clone.querySelector('.product-list-btn').textContent = 'Add to cart';

                    const $btnImg = document.createElement('img');
                    $btnImg.classList.add('product-list-btn-img', 'me-2')
                    $btnImg.src = './assets/images/icon-add-to-cart.svg';
                    $clone.querySelector('.product-list-btn').insertAdjacentElement('afterbegin', $btnImg);



                    $clone.querySelector('.card-subtitle').textContent = element.category;
                    $clone.querySelector('.card-title').textContent = element.name;
                    $clone.querySelector('.card-title').style.color = 'rgb(116, 102, 100)';


                    $clone.querySelector('.card-text').textContent = '$'.concat(element.price.toFixed(2));
                    $clone.querySelector('.card-text').style.color = 'hsl(14, 86%, 42%)';

                    $container.appendChild($clone);
                })
                const $cartSection = document.createElement('div'),
                    $yourCart = document.createElement('div'),
                    $cartContent = document.createElement('div');
                $yourCart.classList.add('your-cart-quantity');
                $yourCart.innerHTML = `<h5 class="cart-content-red-style">Your cart (0)</h5>`
                $cartSection.classList.add('div-card-empty', 'd-flex', 'flex-column', 'cart-content', 'rounded-4');
                $cartContent.innerHTML = `
                <div class="d-flex flex-column align-items-center cart-empty">
                    <img src="./assets/images/illustration-empty-cart.svg" alt="">
                    <p class="cart-content-parr mt-3">Your added items will appear here</p>
                </div>
            `;
                $cartContent.classList.add('d-flex', 'flex-column', 'align-items-center', 'mt-4', 'div-added-desserts');
                $cartSection.appendChild($yourCart)
                $cartSection.appendChild($cartContent);
                $container.appendChild($cartSection);

                $productList.appendChild($container);
            });
        } catch (error) {
            console.error(error);
        }

    }
    showDesserts();

    document.addEventListener('click', handleEvent);

    function handleEvent(e) {
        const target = e.target;
        const productListBtn = target.closest('.product-list-btn');
        switch (true) {
            case target.classList.contains('product-list-btn') || target.classList.contains('product-list-btn-img') || target.classList.contains('parr-quantity'):
                handleClickStyle(productListBtn);
                break;
            case target.classList.contains('inc'):
                handleDessertQuantityInc(productListBtn);
                break;
            case target.classList.contains('dec'):
                handleDessertQuantityDec(productListBtn);
                break;
            default:
                return;
        }
    }
    function handleClickStyle(targetBtn) {
        const $btnStyle = targetBtn;
        $btnStyle.style.color = 'rgb(255,255,255)';
        $btnStyle.style.backgroundColor = 'hsl(14, 86%, 42%)';
        const $imgDessert = targetBtn.closest('.card-img-btn').previousElementSibling;
        $imgDessert.style.border = '.2rem solid hsl(14, 86%, 42%)';
        insertQuantity(0, targetBtn)
    }
    let desserts = {};
    let objTotalPriceOrder = {}
    
    function handleDessertQuantityInc(targetInc) {
        const $targetInc = targetInc.closest('.dessert-container');
        const dessertId = $targetInc.dataset.numberOfDessert;
        if (!desserts[dessertId]) {
            desserts[dessertId] = 0;
            objTotalPriceOrder[dessertId] = 0;
        }

        desserts[dessertId]++;
        updateDessertDisplay($targetInc, desserts[dessertId]);
        getQuantity(targetInc);
        updateTotalOrderPrice();
    }

    function handleDessertQuantityDec(targetDec) {
        
        const $targetDec = targetDec.closest('.dessert-container');
        const dessertId = $targetDec.dataset.numberOfDessert;        

        if (desserts[dessertId]) {
            desserts[dessertId]--;
            updateDessertDisplay($targetDec, desserts[dessertId]);
            getQuantity(targetDec);
            
        }
            //Si no hay ningun postre en el cart, elimina el objeto creado por el id del postre y resetea el botón
            if (desserts[dessertId] === 0) {
                delete desserts[dessertId];
                delete objTotalPriceOrder[dessertId];
                resetButton($targetDec.querySelector('.product-list-btn'), $targetDec.querySelector('.card-img-top'));
            }
            if (Object.keys(desserts).length === 0) {
                showEmptyCart();
            }
            updateTotalOrderPrice();
        }
        //verificamos si hay elementos en nuestro cart
        
    
    
    function updateDessertDisplay(targetElement, quantity) {
        const $btn = targetElement.querySelector('.product-list-btn');
        if (quantity > 0) {
            // handleClickStyle($btn);
            insertQuantity(quantity, $btn);
        } else {
            resetButton($btn, targetElement.querySelector('.card-img-top'));
        }
    }

    function getQuantity(target) {
        const $divCartEmpty = document.querySelector('.cart-empty');
        let $divShowingDesserts = document.querySelector('.div-showing-desserts');

        if (!$divShowingDesserts) {
            $divShowingDesserts = document.createElement('div');
            $divShowingDesserts.classList.add('row', 'container', 'div-showing-desserts');
            const $divAddedDesserts = document.querySelector('.div-added-desserts');
            $divAddedDesserts.appendChild($divShowingDesserts);
        }

        getDataDesserts().then(() => {
            const $findNodeName = target.closest('.card-container');
            const $cardBody = $findNodeName.nextElementSibling;
            const $nameOfDessert = $cardBody.querySelector('.card-title').textContent;
            const $priceOfDessert = $cardBody.querySelector('.card-text').textContent;
            const dessertId = target.closest('.dessert-container').dataset.numberOfDessert;
            const quantity = desserts[dessertId] || 0;

            let price = Number($priceOfDessert.replace('$', ''));
            let totalPrice = price * quantity;
            objTotalPriceOrder[dessertId] = totalPrice;
            $divCartEmpty?.remove();

            updateOrCreateDessertInCart($divShowingDesserts, $nameOfDessert, quantity, price, totalPrice);

            yourCartQuantity();
            updateTotalOrderPrice();
        });
    }
    function updateTotalOrderPrice() {
        const totalOrderPrice = Object.values(objTotalPriceOrder).reduce((sum, price) => sum + price, 0);
        let $updateTotalOrder = document.querySelector('.div-total-order-quantity-style');
        let $divShowingDesserts = document.querySelector('.div-showing-desserts');
        
        if (!$updateTotalOrder && $divShowingDesserts) {
            // If the total order element doesn't exist, create the entire structure
            const totalOrderHtml = `
                <div class="div-total-order">
                    <div class="d-flex justify-content-between mt-3 mb-4 align-items-center">
                        <div class="div-total-order-text">
                            <p class="fs-6 div-total-order-text-style">Order Total</p>
                        </div>
                        <div class="div-total-order-quantity">
                            <p class="fs-4 div-total-order-quantity-style">$0.00</p>
                        </div>
                    </div>
                    <div class="row div-confirm-order mb-4">
                        <div class="d-flex col-md-12 width-confirm justify-content-center">
                            <img src="./assets/images/icon-carbon-neutral.svg" alt="">
                            <p class="carbon-neutral-text">This is a <span class="div-total-order-text-style">carbon-neutral</span> delivery</p>
                        </div>
                    </div>
                    <div class="d-flex justify-content-center">
                        <button type="submit" class="btn btn-outline-dark confirm-order-btn rounded-pill">Confirm Order</button>
                    </div>
                </div>
            `;
            $divShowingDesserts.insertAdjacentHTML('beforeend', totalOrderHtml);
            $updateTotalOrder = document.querySelector('.div-total-order-quantity-style');
        }
        $updateTotalOrder.textContent = `$${totalOrderPrice.toFixed(2)}`;

    }
    
    function updateOrCreateDessertInCart($divShowingDesserts, dessertName, quantity, price, totalPrice) {
        let $existingDessert = $divShowingDesserts.querySelector(`[data-dessert-name="${dessertName}"]`);
        let $totalOrderDiv = $divShowingDesserts.querySelector('.div-total-order');
    
        if ($existingDessert) {
            if (quantity > 0) {
                $existingDessert.querySelector('.dessert-quantity').textContent = `${quantity}x`;
                $existingDessert.querySelector('.dessert-total-price').textContent = `$${totalPrice.toFixed(2)}`;
            } else {
                $existingDessert.remove();
            }
        } else if (quantity > 0) {
            const newDessertHtml = `
                <div class="d-flex justify-content-between align-items-center border-bottom mb-3 col-12 new-dessert" data-dessert-name="${dessertName}" >
                    <div class="detail-dessert">
                        <div class="detail-dessert-name">
                            <p class="d-inline-block dessert-name">${dessertName}</p>
                        </div>
                        <div class="detail-dessert-quantity-and-price">
                            <p class="d-inline-block dessert-quantity me-2">${quantity}x</p>
                            <p class="d-inline-block dessert-price me-2">@$${price.toFixed(2)}</p>
                            <p class="d-inline-block dessert-total-price me-2">$${totalPrice.toFixed(2)}</p>
                        </div>
                    </div>
                    <div class="delete-dessert pb-3">
                        <img src="./assets/images/icon-remove-item.svg" alt="" class="border-delete-cart">
                    </div>
                </div>
            `;
            
            if ($totalOrderDiv) {
                $totalOrderDiv.insertAdjacentHTML('beforebegin', newDessertHtml);
            } else {
                $divShowingDesserts.insertAdjacentHTML('beforeend', newDessertHtml);
            }
        }
        
        updateTotalOrderPrice();
    }
    

    function showEmptyCart() {
        const $divAddedDesserts = document.querySelector('.div-added-desserts');
        const $divShowingDesserts = document.querySelector('.div-showing-desserts');

        //Si existe un contenedor donde se guarda los postres, elimina ese contenedor donde se muestran los postres seleccionados
        if ($divShowingDesserts) {
            $divShowingDesserts.remove();
        }
        //Se crea otro contenedor en el contenedor padre divAddedDesserts para mostrar el cart vacio
        const $divCartEmpty = document.createElement('div');
        $divCartEmpty.classList.add('d-flex', 'flex-column', 'align-items-center', 'cart-empty');
        $divCartEmpty.innerHTML = `
            <img src="./assets/images/illustration-empty-cart.svg" alt="">
            <p class="cart-content-parr mt-3">Your added items will appear here</p>
        `;
        $divAddedDesserts.appendChild($divCartEmpty);
        objTotalPriceOrder = {};
        updateTotalOrderPrice();
    }

    function yourCartQuantity() {
        const $yourCart = document.querySelector('.cart-content-red-style');
        const totalQuantity = Object.values(desserts).reduce((sum, quantity) => sum + quantity, 0);
        $yourCart.textContent = `Your cart (${totalQuantity})`;
    }
    function resetButton($targetDec, $targetDecImg) {


        $targetDec.style.backgroundColor = 'rgb(255,255,255)';
        $targetDec.style.color = 'rgb(0,0,0)';
        $targetDec.innerHTML = `
        <div class="d-flex justify-content-center parr-quantity">
        <img src="./assets/images/icon-add-to-cart.svg" class="product-list-btn-img me-2" alt="">
            <p class="mb-0 parr-quantity">Add to cart</p>
        </div>   
        `;
        $targetDecImg.style.border = 'none';

    }
    const insertQuantity = (quantity, target) => {
        target.innerHTML = `
        <div class="d-flex justify-content-around align-items-center new-quantity-container">
        <img src="./assets/images/icon-decrement-quantity.svg" class="border-add-cart dec rounded-circle alt="">
        <p class="mb-0 parr-quantity">${quantity}</p>
        <img src="./assets/images/icon-increment-quantity.svg" class="border-add-cart inc rounded-circle" alt="">
        </div>
        `;
    }

}

