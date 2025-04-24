
document.addEventListener('DOMContentLoaded', () => {
    loadComponents();
    loadCart();

    // Handle buttons for adding and applying favourite carts
    document.getElementById('add-favourite').addEventListener('click', saveAsFavourite);
    document.getElementById('apply-favourite').addEventListener('click', applyFavourite);

    // Set the current year in the footer
    document.getElementById('year').textContent = new Date().getFullYear();
});

// Function to create product card dynamically
function createProductCard(item) {
    const card = document.createElement('div');
    card.className = 'item';

    card.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <h3>${item.name}</h3>
        <p>${item.description}</p>
        <div class="price">$${item.price}</div>
        <div class="quantity-wrapper">
            <button class="qty-btn" onclick="changeQuantity('${item.name}', -1)">-</button>
            <input type="number" class="qty-input" id="qty-${item.name}" value="0" min="1">
            <button class="qty-btn" onclick="changeQuantity('${item.name}', 1)">+</button>
        </div>
        <button class="add-to-cart" onclick="addToCartFromCard('${item.name}', ${item.price})">
            Add to Cart
        </button>
    `;
    
    return card;
}

// Update quantity of the selected product
function changeQuantity(name, change) {
    const input = document.getElementById(`qty-${name}`);
    let currentValue = parseInt(input.value) || 0;
    currentValue += change;
    if (currentValue < 1) currentValue = 0;
    input.value = currentValue;
}

// Add item to the cart and update local storage
function addToCartFromCard(name, price) {
    const quantity = Number(document.getElementById(`qty-${name}`).value);
    if (!Number.isInteger(quantity) || quantity <= 0) {
        alert('Please enter a valid numeric quantity');
        return;
    }  //number better than parse int


    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ name, price, quantity });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
    showToast(`${quantity} × ${name} added to cart!`);
}

// Load components from JSON file and display them in categories
function loadComponents() {
    fetch('./components.json')
        .then(response => response.json())
        .then(data => {
            const categories = {
                'Processors': 'processors-container',
                'Graphic_Cards': 'graphics-container',
                'Motherboards': 'motherboards-container',
                'Memory_RAM': 'memory-container',
                'Storage_Devices': 'storage-container'
            };
            
            for (const [category, containerId] of Object.entries(categories)) {
                const container = document.getElementById(containerId);
                data.PC_Components[category].forEach(item => {
                    container.appendChild(createProductCard(item));
                });
            }
        })
        .catch(error => console.error('Error loading components:', error));
}

// Load cart data from local storage and display in the table
function loadCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    let total = 0;

    cartItems.innerHTML = cart.length === 0
        ? '<tr><td colspan="5">Your cart is empty</td></tr>'
        : cart.map((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            return `
                <tr>
                    <td>${item.name}</td>
                    <td>${item.quantity}</td>
                    <td>$${item.price}</td>
                    <td>$${itemTotal}</td>
                    <td>
                        <button onclick="updateQuantity(${index}, -1)">-</button>
                        <button onclick="updateQuantity(${index}, 1)">+</button>
                        <button onclick="removeFromCart(${index})">Remove</button>
                    </td>
                </tr>
            `;
        }).join('');
    
    cartTotal.textContent = total.toFixed(2);
}

// Update cart item quantity
function updateQuantity(index, change) {
    const cart = JSON.parse(localStorage.getItem('cart'));
    const item = cart[index];
    if (item.quantity + change <= 0) {
        removeFromCart(index);
    } else {
        item.quantity += change;
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCart();
    }
}

// Remove item from cart
function removeFromCart(index) {
    const cart = JSON.parse(localStorage.getItem('cart'));
    const removedItem = cart.splice(index, 1)[0].name;
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
}

// Save current cart as a favourite
function saveAsFavourite() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) {
        alert("Your cart is empty! Add items before saving as a favourite.");
        return;
    }

    localStorage.setItem("favouriteOrder", JSON.stringify(cart));
    alert("Your order has been saved as a favourite!");
}

//Apply the saved favourite cart to the current cart 
function applyFavourite() {
    const favouriteOrder = JSON.parse(localStorage.getItem('favouriteOrder')) || [];
    if (favouriteOrder.length === 0) return alert('No favourite order found');

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    favouriteOrder.forEach(favItem => {
        const existingItem = cart.find(item => item.name === favItem.name);
        if (existingItem) {
            existingItem.quantity += favItem.quantity;
        } else {
            cart.push(favItem);
        }
    });

    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
    alert('Favourite items have been added to your existing cart'); 
}

// Redirect to the order page if the cart is not empty
// Function to redirect to checkout page when "Buy Now" button is clicked
function buyNow() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cart.length === 0) {
        alert("Your cart is empty. Add items to your cart first.");
        return;
    }

    // Save cart to local storage before redirecting
    localStorage.setItem('cart', JSON.stringify(cart));

    // Redirect to checkout page
    window.location.href = 'order-summary.html';
}

// Event listener for "Buy Now" button for a button with the id "buy-now"
document.getElementById('buy-now').addEventListener('click', buyNow);


