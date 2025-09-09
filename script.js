const categoryApi = 'https://openapi.programming-hero.com/api/categories';

const loadCategories = async () => {
  try {
    const res = await fetch(categoryApi);
    const data = await res.json();

    console.log("API Response:", data);


    const categories = data.categories;

    const categoryList = document.getElementById('categoryList');
    categoryList.innerHTML = '';

    categories.forEach(category => {
      const li = document.createElement('li');
      li.innerHTML = `<a href="#" class="hover:underline">${category.category_name}</a>`;
      categoryList.appendChild(li);
    });

  } catch (error) {
    console.error('Error loading categories:', error);
    document.getElementById('categoryList').innerHTML = '<li>Failed to load categories</li>';
  }
};

document.addEventListener('DOMContentLoaded', loadCategories);
