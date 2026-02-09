const socket = io();

const productsList = document.getElementById('productsList');
const addProductForm = document.getElementById('addProductForm');

// Handle form submission
addProductForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(addProductForm);
  const productData = {
    title: formData.get('title'),
    description: formData.get('description'),
    code: formData.get('code'),
    price: parseFloat(formData.get('price')),
    stock: parseInt(formData.get('stock')),
    category: formData.get('category')
  };

  try {
    const response = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    });

    if (response.ok) {
      addProductForm.reset();
    } else {
      const error = await response.json();
      alert(`Error: ${error.error}`);
    }
  } catch (error) {
    alert('Error al agregar producto');
  }
});

// Handle delete button clicks
productsList.addEventListener('click', async (e) => {
  if (e.target.classList.contains('delete-btn')) {
    const productId = e.target.dataset.id;

    if (confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        const response = await fetch(`/api/products/${productId}`, {
          method: 'DELETE'
        });

        if (!response.ok) {
          const error = await response.json();
          alert(`Error: ${error.error}`);
        }
      } catch (error) {
        alert('Error al eliminar producto');
      }
    }
  }
});

// Socket event handlers
socket.on('productAdded', (product) => {
  addProductToDOM(product);
});

socket.on('productDeleted', (productId) => {
  removeProductFromDOM(productId);
});

socket.on('products', (products) => {
  renderAllProducts(products);
});

// DOM manipulation functions
function addProductToDOM(product) {
  const noProductsMessage = productsList.querySelector('.no-products');
  if (noProductsMessage) {
    noProductsMessage.remove();
  }

  const productCard = createProductCard(product);
  productsList.insertAdjacentHTML('afterbegin', productCard);
}

function removeProductFromDOM(productId) {
  const productCard = productsList.querySelector(`[data-id="${productId}"]`);
  if (productCard) {
    productCard.remove();
  }

  if (productsList.children.length === 0) {
    productsList.innerHTML = '<p class="no-products">No hay productos disponibles.</p>';
  }
}

function renderAllProducts(products) {
  if (products.length === 0) {
    productsList.innerHTML = '<p class="no-products">No hay productos disponibles.</p>';
    return;
  }

  productsList.innerHTML = products.map(product => createProductCard(product)).join('');
}

function createProductCard(product) {
  return `
    <div class="product-card" data-id="${product.id}">
      <h3>${product.title}</h3>
      <p class="description">${product.description}</p>
      <div class="product-details">
        <p><strong>Código:</strong> ${product.code}</p>
        <p><strong>Precio:</strong> $${product.price}</p>
        <p><strong>Stock:</strong> ${product.stock}</p>
        <p><strong>Categoría:</strong> ${product.category}</p>
      </div>
      <button class="delete-btn" data-id="${product.id}">Eliminar</button>
    </div>
  `;
}
