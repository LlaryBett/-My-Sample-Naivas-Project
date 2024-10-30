document.addEventListener("DOMContentLoaded", () => {
    loadFeaturedProducts();
    loadPopularDeals();
    loadWeeklyDeals();
    loadTopSellers();

    // Add event listener for the newsletter sign-up button
    document.getElementById('subscribe-button').addEventListener('click', subscribeToNewsletter);
    // Add event listener for the search bar
    document.getElementById('search-bar').addEventListener('input', filterProducts);
    
    // Start the carousel automatic slide change
    setInterval(() => changeSlide(1), 3000); // Change slide every 3 seconds
});

let products = []; // Global variable to store product data
let cart = []; // Global cart array
let currentSlideIndex = 0; // Initialize current slide index
const slides = document.querySelectorAll('.carousel-slide');

// Load product data
function loadFeaturedProducts() {
    products = [
        { id: 1, name: 'Smartphone', price: 299.99, description: 'A high-end smartphone with amazing features.' },
        { id: 2, name: 'Laptop', price: 799.99, description: 'A powerful laptop for work and play.' },
        { id: 3, name: 'Headphones', price: 99.99, description: 'Noise-cancelling headphones for an immersive experience.' },
        { id: 4, name: 'Smartwatch', price: 199.99, description: 'Stay connected with this stylish smartwatch.' },
        { id: 5, name: 'Camera', price: 499.99, description: 'Capture stunning photos with this professional camera.' },
        { id: 6, name: 'Gaming Console', price: 499.99, description: 'Enjoy gaming with the latest console.' },
        { id: 7, name: 'Bluetooth Speaker', price: 79.99, description: 'Portable speaker with excellent sound quality.' },
        { id: 8, name: 'Fitness Tracker', price: 129.99, description: 'Monitor your health with this advanced fitness tracker.' },
    ];

    displayProducts(products, 'product-list'); // Display all products initially
}

// Load popular deals
function loadPopularDeals() {
    const popularDeals = [
        { id: 9, name: 'Smart TV', price: 599.99, description: 'Experience entertainment like never before.' },
        { id: 10, name: 'Gaming Chair', price: 199.99, description: 'Comfortable chair for long gaming sessions.' },
        { id: 11, name: 'Drone', price: 399.99, description: 'Capture stunning aerial shots.' },
    ];

    displayProducts(popularDeals, 'popular-deals-list');
}

// Load weekly deals
function loadWeeklyDeals() {
    const weeklyDeals = [
        { id: 12, name: 'Electric Toothbrush', price: 49.99, description: 'For a brighter smile every day.' },
        { id: 13, name: 'Water Bottle', price: 29.99, description: 'Stay hydrated on the go.' },
        { id: 14, name: 'Portable Charger', price: 39.99, description: 'Never run out of battery again.' },
    ];

    displayProducts(weeklyDeals, 'weekly-deals-list');
}

// Load top sellers
function loadTopSellers() {
    const topSellers = [
        { id: 15, name: 'Wireless Mouse', price: 29.99, description: 'A sleek and stylish mouse.' },
        { id: 16, name: 'USB-C Hub', price: 49.99, description: 'Expand your device connectivity.' },
        { id: 17, name: 'Gaming Headset', price: 89.99, description: 'Immerse yourself in the game.' },
    ];

    displayProducts(topSellers, 'top-sellers-list');
}

// General function to display products in a specific list
function displayProducts(productArray, listId) {
    const productList = document.getElementById(listId);
    productList.innerHTML = ''; // Clear the current list

    productArray.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.className = 'product';
        productDiv.innerHTML = `
            <h3><a href="javascript:void(0);" onclick="openModal(${product.id})">${product.name}</a></h3>
            <p>Price: $${product.price.toFixed(2)}</p>
            <button class="add-to-cart" data-name="${product.name}" data-price="${product.price}">Add to Cart</button>
        `;
        
        // Add event listener to the button
        productDiv.querySelector('.add-to-cart').addEventListener('click', (event) => {
            const name = event.target.getAttribute('data-name');
            const price = parseFloat(event.target.getAttribute('data-price'));
            addToCart(name, price);
        });
        
        productList.appendChild(productDiv);
    });
}

// Filter products based on the search input
function filterProducts() {
    const searchBar = document.getElementById('search-bar').value.toLowerCase();
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchBar)
    );

    displayProducts(filteredProducts, 'product-list'); // Display filtered products
}

// Open modal to show product details
function openModal(id) {
    const product = products.find(p => p.id === id);
    if (product) {
        document.getElementById('modal-product-name').innerText = product.name;
        document.getElementById('modal-product-price').innerText = `Price: $${product.price.toFixed(2)}`;
        document.getElementById('modal-product-description').innerText = product.description;

        document.getElementById('product-modal').style.display = "block"; // Show the modal
    }
}

// Close the modal
function closeModal() {
    document.getElementById('product-modal').style.display = "none"; // Hide the modal
}

// Close the modal when clicking outside of it
window.onclick = function(event) {
    const modal = document.getElementById('product-modal');
    if (event.target === modal) {
        closeModal();
    }
}

// Add a product to the cart
function addToCart(productName, productPrice) {
    const existingProduct = cart.find(item => item.name === productName);
    
    if (existingProduct) {
        existingProduct.quantity += 1; // Increase quantity if already in cart
    } else {
        cart.push({ name: productName, price: productPrice, quantity: 1 }); // Add new product to cart
    }
    
    updateCartCount();
    alert(`${productName} has been added to your cart for $${productPrice}.`);
}

// Update the cart count display
function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    cartCountElement.textContent = cart.reduce((total, item) => total + item.quantity, 0);
}

// Function to handle newsletter subscription
function subscribeToNewsletter() {
    const emailInput = document.getElementById('newsletter-email');
    const email = emailInput.value.trim();

    // Simple email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === "") {
        alert('Please enter your email address.'); // Alert for empty input
    } else if (emailPattern.test(email)) {
        alert(`Thank you for subscribing to our newsletter, ${email}!`);
        emailInput.value = ''; // Clear the input after subscription
    } else {
        alert('Please enter a valid email address.'); // Alert for invalid email format
    }
}

// Carousel functionality
function showSlide(index) {
    const indicators = document.querySelectorAll('.carousel-indicator');

    // Loop to ensure the index is within bounds
    if (index >= slides.length) {
        currentSlideIndex = 0;
    } else if (index < 0) {
        currentSlideIndex = slides.length - 1;
    } else {
        currentSlideIndex = index;
    }

    slides.forEach((slide, i) => {
        slide.classList.remove('active');
        if (i === currentSlideIndex) {
            slide.classList.add('active');
        }
    });

    indicators.forEach((indicator, i) => {
        indicator.classList.toggle('active', i === currentSlideIndex);
    });
}

// Change slide function
function changeSlide(direction) {
    showSlide(currentSlideIndex + direction);
}

// Automatically change slide every 3 seconds
setInterval(() => changeSlide(1), 3000); // Change slide every 3 seconds

// Function to set a specific slide (called by indicators)
function currentSlide(index) {
    showSlide(index - 1); // Adjust for zero-based index
}

// Initialize the carousel
showSlide(currentSlideIndex);

// Function to scroll the deals section left or right
function scrollWeeklyDeals(direction) {
    const container = document.querySelector('.weekly-deals-list');
    const scrollAmount = direction * container.clientWidth; // Scroll by the width of the container
    container.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
    });
}

// Function to scroll the popular deals section left or right
function scrollPopularDeals(direction) {
    const container = document.querySelector('.popular-deals-list');
    const scrollAmount = direction * container.clientWidth; // Scroll by the width of the container
    container.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
    });
}
