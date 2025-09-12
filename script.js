const treeContainer = document.getElementById('treeContainer');
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

    let description = plant.description || 'No description available';
    if (description.length > 60) {
      description = description.slice(0, 60) + '...';
    }

    card.innerHTML = `
      <img src="${plant.image}" alt="${plant.name}" class="w-full h-48 object-cover rounded-t cursor-pointer">
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

    // Add to cart button
    card.querySelector('.add-to-cart').addEventListener('click', () => addToCart(plant));

    // Open modal on name or image click
    card.querySelector('h4').addEventListener('click', () => openModal(plant));
    card.querySelector('img').addEventListener('click', () => openModal(plant));

    treeContainer.appendChild(card);
  });
};

// ------------------ Cart Functions ------------------
const addToCart = (plant) => {
  let exists = cartItems.find(item => item.id === plant.id);
  if (!exists) {
    cartItems.push(plant); // Only one entry per tree
  }
  updateCart();
};

const removeFromCart = (id) => {
  cartItems = cartItems.filter(item => item.id !== id);
  updateCart();
};

const updateCart = () => {
  let itemsContainer = document.getElementById('cart-items');
  if (!itemsContainer) {
    itemsContainer = document.createElement('div');
    itemsContainer.id = 'cart-items';
    cartDiv.appendChild(itemsContainer);
  }

  itemsContainer.innerHTML = '';

  if (cartItems.length === 0) {
    itemsContainer.innerHTML = '<p class="text-gray-500">No items in cart</p>';
    return;
  }

  let totalCost = 0;

  cartItems.forEach(item => {
    totalCost += item.price;

    const div = document.createElement('div');
    div.className = 'cart-item mt-2 border-b border-gray-200 pb-2';

    div.innerHTML = `
      <div class="flex justify-between items-center">
        <span class="font-semibold">${item.name}</span>
        <button class="text-red-500 font-bold hover:text-red-700">X</button>
      </div>
      <div class="text-green-700 font-bold mt-1">$${item.price}</div>
    `;

    div.querySelector('button').addEventListener('click', () => removeFromCart(item.id));
    itemsContainer.appendChild(div);
  });

  const totalDiv = document.createElement('div');
  totalDiv.className = 'text-right font-bold mt-3';
  totalDiv.textContent = `Total: $${totalCost}`;
  itemsContainer.appendChild(totalDiv);
};

// ------------------ Initialize ------------------
document.addEventListener('DOMContentLoaded', () => {
  loadCategories();
  loadAllPlants();
});

// ------------------ Modal Functions ------------------
const treeModal = document.getElementById("treeModal");
const modalImage = document.getElementById("modalImage");
const modalName = document.getElementById("modalName");
const modalDescription = document.getElementById("modalDescription");
const modalCategory = document.getElementById("modalCategory");
const modalPrice = document.getElementById("modalPrice");
const closeModalBtn = document.getElementById("closeModal");

let currentPlant = null;

const openModal = (plant) => {
  currentPlant = plant;
  modalImage.src = plant.image;
  modalName.textContent = plant.name;
  modalDescription.textContent = plant.description || "No description available";
  modalCategory.textContent = plant.category || "Unknown";
  modalPrice.textContent = plant.price || 0;
  treeModal.classList.remove("hidden");
  treeModal.classList.add("flex");
};

const closeModal = () => {
  treeModal.classList.add("hidden");
  treeModal.classList.remove("flex");
};

closeModalBtn.addEventListener("click", closeModal);

treeModal.addEventListener("click", (e) => {
  if (e.target === treeModal) {
    closeModal();
  }
});
