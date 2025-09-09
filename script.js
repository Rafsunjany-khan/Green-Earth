const treeContainer = document.getElementById('treeContainer');
const cartCount = document.getElementById('cartCount');
const cartTotalSpan = document.getElementById('cartTotal');
const categoryList = document.getElementById('categoryList');

let cartItems = [];
let allPlants = [];
let categories = [];


// Load Categories
const loadCategories = async () => {
  try {
    const res = await fetch('https://openapi.programming-hero.com/api/categories');
    const data = await res.json();
    categories = data.categories;

    categoryList.innerHTML = '';

    // "All Plants" category
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
        loadPlantsByCategory(cat.category_id);
      });
      categoryList.appendChild(li);
    });

  } catch (err) {
    console.error(err);
    categoryList.innerHTML = '<li>Failed to load categories</li>';
  }
};


// Active category highlight
const setActiveCategory = (li) => {
  const links = categoryList.querySelectorAll('li a');
  links.forEach(a => a.classList.remove('bg-green-600', 'text-white'));
  li.querySelector('a').classList.add('bg-green-600', 'text-white');
};


// Load all plants
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


// Load plants by category
const loadPlantsByCategory = async (id) => {
  treeContainer.innerHTML = 'Loading...';
  try {
    const res = await fetch(`https://openapi.programming-hero.com/api/category/${id}`);
    const data = await res.json();
    const filteredPlants = data.plants;
    displayPlants(filteredPlants);
  } catch (err) {
    console.error(err);
    treeContainer.innerHTML = 'Failed to load plants';
  }
};


// Display plant cards
const displayPlants = async (plants) => {
  treeContainer.innerHTML = '';

  for (let plant of plants) {
    let description = plant.description || 'No description available';
    let categoryName = plant.category || 'Unknown';

    const card = document.createElement('div');
    card.className = 'bg-white rounded-lg shadow flex flex-col';

    card.innerHTML = `
      <img src="${plant.image}" alt="${plant.name}" class="w-full h-48 object-cover rounded-t">
      <div class="p-3 flex-1 flex flex-col justify-between">
        <h4 class="font-semibold text-lg cursor-pointer">${plant.name}</h4>
        <p class="text-sm text-gray-600 mt-1">${description}</p>
        <div class="mt-2 flex justify-between items-center text-sm">
          <span class="px-2 py-1 border border-green-600 text-green-600 rounded-full">${categoryName}</span>
          <span class="font-bold text-green-700">$${plant.price || 0}</span>
        </div>
        <button class="add-to-cart mt-3 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm font-semibold w-full">Add to Cart</button>
      </div>
    `;

    // Add to cart event
    card.querySelector('.add-to-cart').addEventListener('click', () => addToCart(plant));

    treeContainer.appendChild(card);
  }
};

// Cart Functions
const addToCart = (plant) => {
  if (!cartItems.find(item => item.id === plant.id)) {
    cartItems.push({...plant});
  }
  updateCart();
};

const removeFromCart = (id) => {
  cartItems = cartItems.filter(item => item.id !== id);
  updateCart();
};

const updateCart = () => {
  cartCount.textContent = cartItems.length;
  cartTotalSpan.textContent = cartItems.reduce((sum, item) => sum + Number(item.price || 0), 0);

  const cartDiv = document.querySelector('.lg\\:col-span-2.bg-white');
  cartDiv.querySelectorAll('.cart-item').forEach(e => e.remove());

  cartItems.forEach(item => {
    const p = document.createElement('p');
    p.className = 'cart-item flex justify-between mt-2 items-center';
    p.innerHTML = `
      <span>${item.name}</span>
      <button class="text-red-500 font-bold hover:text-red-700">✕</button>
    `;
    p.querySelector('button').addEventListener('click', () => removeFromCart(item.id));
    cartDiv.insertBefore(p, cartDiv.querySelector('button'));
  });
};


// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadCategories();
  loadAllPlants();
});
