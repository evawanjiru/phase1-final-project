// Fetch products from the JSON file
let products = [];
fetch("db.json")
  .then(response => response.json())
  .then(data => {
    products = data.products; // Assign products from JSON
    renderProducts(products); // Render products initially
  })
  .catch(error => console.error("Error fetching products:", error));

// Cart data
let cart = [];

// Function to render products dynamically
function renderProducts(productList) {
  const productContainer = document.getElementById("product-container");
  productContainer.innerHTML = ""; // Clear existing products

  productList.forEach(product => {
    const productCard = `
      <div class="product-card">
        <img src="${product.image_url}" alt="${product.name}" class="product-image">
        <h3>${product.name}</h3>
        <p class="product-description">${product.description}</p>
        <p>Price: $${product.price.toFixed(2)}</p>
        <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
      </div>
    `;
    productContainer.insertAdjacentHTML("beforeend", productCard);
  });

  // Reattach "Add to Cart" listeners for the rendered items
  attachAddToCartListeners();
}

// Attach "Add to Cart" event listeners to buttons
function attachAddToCartListeners() {
  const addToCartButtons = document.querySelectorAll(".add-to-cart");
  addToCartButtons.forEach(button => {
    button.addEventListener("click", () => {
      const productId = parseInt(button.dataset.id);
      addToCart(productId);
    });
  });
}

// Add product to the cart
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (product) {
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    renderCart();
  }
}

// Render cart items
function renderCart() {
  const cartContainer = document.getElementById("cart-container");
  cartContainer.innerHTML = ""; // Clear existing cart items

  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }

  cart.forEach(item => {
    const cartItem = `
      <div class="cart-item">
        <h4>${item.name} (x${item.quantity})</h4>
        <p>Price: $${(item.price * item.quantity).toFixed(2)}</p>
        <button class="remove-item" data-id="${item.id}">Remove</button>
      </div>
    `;
    cartContainer.insertAdjacentHTML("beforeend", cartItem);
  });

  // Reattach "Remove" listeners for the cart items
  attachRemoveItemListeners();

  // Render total price
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalPriceElement = `<p><strong>Total: $${totalPrice.toFixed(2)}</strong></p>`;
  cartContainer.insertAdjacentHTML("beforeend", totalPriceElement);
}

// Attach "Remove" event listeners to buttons
function attachRemoveItemListeners() {
  const removeItemButtons = document.querySelectorAll(".remove-item");
  removeItemButtons.forEach(button => {
    button.addEventListener("click", () => {
      const productId = parseInt(button.dataset.id);
      removeFromCart(productId);
    });
  });
}

// Remove product from the cart
function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  renderCart();
}

// Clear the entire cart
const clearCartButton = document.getElementById("clear-cart");
clearCartButton.addEventListener("click", () => {
  cart = [];
  renderCart();
});

// Search Input and Button
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");

// Event Listener for Search Button
searchButton.addEventListener("click", () => {
  const query = searchInput.value.toLowerCase().trim();
  filterProducts(query);
});

// Event Listener for Enter Key in Search Bar
searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    const query = searchInput.value.toLowerCase().trim();
    filterProducts(query);
  }
});

// Function to Filter Products
function filterProducts(query) {
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(query)
  );

  renderProducts(filteredProducts); // Render only the filtered products
}
