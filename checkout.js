document.addEventListener('DOMContentLoaded', () => {
    loadOrderSummary();

    // Handle Pay button click
    document.getElementById('pay-button').addEventListener('click', handlePayment);
});

// Function to load the order summary from local storage
function loadOrderSummary() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const orderSummary = document.getElementById('order-summary');
    let total = 0;

    orderSummary.innerHTML = cart.length === 0
        ? '<tr><td colspan="4">Your cart is empty</td></tr>'
        : cart.map(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            return `
                <tr>
                    <td>${item.name}</td>
                    <td>${item.quantity}</td>
                    <td>$${item.price}</td>
                    <td>$${itemTotal.toFixed(2)}</td>
                </tr>
            `;
        }).join('');

    // Add total row directly to the table
    if (cart.length > 0) {
        orderSummary.innerHTML += `
            <tr class="total-row">
                <td colspan="3" class="total-label">Total:</td>
                <td class="total-amount">$${total.toFixed(2)}</td>
            </tr>
        `;
    }
}

// Function to handle payment (when "Pay" button is clicked)
function handlePayment(event) {
    event.preventDefault();

    // Get user details from form
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const street = document.getElementById('street').value;
    const city = document.getElementById('city').value;
    const state = document.getElementById('state').value;
    const zip = document.getElementById('zip').value;
    const cardNumber = document.getElementById('card-number').value;
    const expiry = document.getElementById('expiry').value;
    const cvv = document.getElementById('cvv').value;

    // Simple validation (you can add more)
    if (!name || !email || !phone || !street || !city || !state || !zip || !cardNumber || !expiry || !cvv) {
        alert("Please fill in all the fields.");
        return;
    }

    // Simulate payment success
    alert(`Payment successful! Thank you, ${name}. Your order will be delivered by ${getDeliveryDate()}.`);

    // Clear the cart from local storage after payment
    localStorage.removeItem('cart');
    // localStorage.removeItem('favouriteOrder');

    // Redirect to the home page (index.html)
    window.location.href = 'index.html'; // Redirecting to the home page
}

// Function to get delivery date (you can adjust this as needed)
function getDeliveryDate() {
    const today = new Date();
    const deliveryDate = new Date(today.setDate(today.getDate() + 7)); // 7 days from today
    return `${deliveryDate.getMonth() + 1}/${deliveryDate.getDate()}/${deliveryDate.getFullYear()}`;
}