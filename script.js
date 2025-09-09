const treeContainer = document.getElementById('treeContainer');
const cartCount = document.getElementById('cartCount');
const cartTotalSpan = document.getElementById('cartTotal');
const categoryList = document.getElementById('categoryList');
const cartDiv = document.getElementById('cart');

let allPlants = [];
let categories = [];
let cartItems = [];

// ------------------ Load Categories ------------------
const loadCategories = async () => {
  try {
    const res = await fetch('https://openapi.programming-hero.com/api/categories');
    const data = await res.json();
    categories = data.categories;

    categoryList.innerHTML = '';

    // All Plants
    const allLi = document.createElement('li');
    allLi.innerHTML = `<a href="#" class="block px-3 py-2 rounded hover:bg-green-600 hover:text-white transition">All Plants</a>`;
    allLi.addEventListener('click', e => {
      e.preventDefault();
      setActiveCategory(allLi);
      displayPlants(allPlants);
    });
    categoryList.appendChild(allLi);

    // Other categories
    categories.forEach(cat => {
      const li = document.createElement('li');
      li.innerHTML = `<a href="#" class="block px-3 py-2 rounded hover:bg-green-600 hover:text-white transition">${cat.category_name}</a>`;
      li.addEventListener('click', e => {
        e.preventDefault();
        setActiveCategory(li);
        displayPlantsByCategory(cat.category_name);
      });
      categoryList.appendChild(li);
    });

  } catch (err) {
    console.error(err);
    categoryList.innerHTML = '<li>Failed to load categories</li>';
  }
};

// ------------------ Highlight Active Category ------------------
const setActiveCategory = (li) => {
  const links = categoryList.querySelectorAll('li a');
  links.forEach(a => a.classList.remove('bg-green-600', 'text-white'));
  li.querySelector('a').classList.add('bg-green-600', 'text-white');
};

// ------------------ Load All Plants ------------------
const loadAllPlants = async () => {
  treeContainer.innerHTML = 'Loading...';
  try {
    const res = await fetch('https://openapi.programming-hero.com/api/plants');
    const data = await res.json();
    allPlants = data.plants;
    displayPlants(allPlants);
  } catch (err) {
    console.error(err);
    treeContainer.innerHTML = 'Failed to load plants';
  }
};

// ------------------ Display Plants By Category ------------------
const displayPlantsByCategory = (categoryName) => {
  const filtered = allPlants.filter(p => p.category === categoryName);
  if (filtered.length === 0) {
    treeContainer.innerHTML = 'No plants found in this category';
    return;
  }
  displayPlants(filtered);
};

// ------------------ Display Plant Cards ------------------
const displayPlants = (plants) => {
  treeContainer.innerHTML = '';

  plants.forEach(plant => {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-lg shadow flex flex-col';

    // Format description: first 60 chars + ...
    let description = plant.description || 'No description available';
    if (description.length > 60) {
      description = description.slice(0, 60) + '...';
    }

    card.innerHTML = `
      <img src="${plant.image}" alt="${plant.name}" class="w-full h-48 object-cover rounded-t">
      <div class="p-3 flex flex-col">
        <h4 class="font-semibold text-lg cursor-pointer">${plant.name}</h4>
        <p class="text-sm text-gray-600 mt-1">${description}</p>
        <div class="mt-2 flex justify-between items-center text-sm">
          <span class="px-2 py-1 border border-green-600 text-green-600 rounded-full">${plant.category || 'Unknown'}</span>
          <span class="font-bold text-green-700">$${plant.price || 0}</span>
        </div>
        <button class="add-to-cart mt-3 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm font-semibold w-full">Add to Cart</button>
      </div>
    `;

    card.querySelector('.add-to-cart').addEventListener('click', () => addToCart(plant));
    treeContainer.appendChild(card);
  });
};

// ------------------ Cart Functions ------------------
const addToCart = (plant) => {
  let existing = cartItems.find(item => item.id === plant.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cartItems.push({ ...plant, quantity: 1 });
  }

  updateCart();
};

const removeFromCart = (id) => {
  cartItems = cartItems.filter(item => item.id !== id);
  updateCart();
};

const updateCart = () => {
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalCost = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  cartCount.textContent = totalItems;
  cartTotalSpan.textContent = totalCost;

  let itemsContainer = document.getElementById('cart-items');
  if (!itemsContainer) {
    itemsContainer = document.createElement('div');
    itemsContainer.id = 'cart-items';
    cartDiv.insertBefore(itemsContainer, cartDiv.querySelector('button'));
  }

  itemsContainer.innerHTML = '';

  cartItems.forEach(item => {
    const div = document.createElement('div');
    div.className = 'cart-item mt-2 text-left';
    div.innerHTML = `
      <div class="flex justify-between items-center">
        <span class="font-semibold">${item.name} x${item.quantity}</span>
        <button class="text-red-500 font-bold hover:text-red-700">✕</button>
      </div>
      <div class="text-green-700 font-semibold">$${item.price * item.quantity}</div>
    `;
    div.querySelector('button').addEventListener('click', () => removeFromCart(item.id));
    itemsContainer.appendChild(div);
  });
};

// ------------------ Checkout ------------------
const checkout = () => {
  if (cartItems.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  let summary = "🛒 Checkout Summary:\n\n";
  cartItems.forEach(item => {
    summary += `${item.name} x${item.quantity} = $${item.price * item.quantity}\n`;
  });
  summary += `\nTotal: $${cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0)}`;

  alert(summary);

  cartItems = [];
  updateCart();
};

// ------------------ Initialize ------------------
document.addEventListener('DOMContentLoaded', () => {
  loadCategories();
  loadAllPlants();

  // Attach checkout button event
  const checkoutBtn = document.getElementById("checkoutBtn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", checkout);
  }
});
