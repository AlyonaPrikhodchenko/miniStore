import { ProductService } from './product-service.js';
import { CartService } from './cart-service.js';
import { HTMLService  } from './html-service.js';

let productService;
const cartService = new CartService();
const htmlService = new HTMLService();

const productsContainer = document.getElementById('products');
const cartContainer = document.getElementById('cart');
const filterInput = document.getElementById('filter');

filterInput.addEventListener('input', evt => {
  const value = evt.target.value;
  const filteredProducts = productService.filterBy(value)

  renderProducts(filteredProducts)
})

productsContainer.addEventListener('click', evt => {
  const id = evt.target.dataset.id
    ? evt.target.dataset.id
    : evt.target.closest('li')?.dataset.id

  if (id) {
    cartService.add(productService.getById(+id))
    renderCart()
  }
})

cartContainer.addEventListener('click', evt => {
  const type = evt.target?.dataset.type;
  const id = evt.target?.dataset.id;

  switch (type) {
    case 'clear':
      cartService.clear()
      renderCart()
      break
    case 'remove':
      cartService.remove(id)
      renderCart()
      break
    }
  }
)

function renderProducts(products) {
  productsContainer.innerHTML = htmlService.paintProducts(products);
}

function renderCart() {
  cartContainer.innerHTML = htmlService.paintCart(
    cartService.getInfo()
  );
}

async function startApp() {
  renderCart()

  try {
    const response = await fetch('https://fakestoreapi.com/products');
    const data = await response.json();
  
    productService = new ProductService(data);
  
    renderProducts(productService.products);
  } catch (e) {
    productsContainer.innerHTML = htmlService.paintError(e);
  }
}

startApp()