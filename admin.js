// Hashmi Perfumes - Admin Dashboard Controller

// Default products list matching app.js
const defaultProducts = [
  {
    id: "althair",
    name: "Althair",
    tag: "Warm Oud & Spices",
    price: 1499,
    description: "Our signature luxury attar. Althair blends royal green cardamom and saffron top notes with a heart of warm cinnamon, leading into a magnificent base of precious Cambodian agarwood (Oud) and sweet dark amber. Robust, complex, and deeply spiritual.",
    image: "media/althair.png",
    badge: "Signature",
    notes: {
      top: "Cardamom & Saffron",
      heart: "Warm Cinnamon",
      base: "Cambodian Oud & Amber"
    },
    specs: {
      volume: "6ml Concentrated Oil",
      longevity: "Up to 24 Hours on Skin",
      formulation: "100% Alcohol-Free, Premium Natural Extract"
    }
  },
  {
    id: "royal_oud",
    name: "Royal Oud",
    tag: "Majestic Agarwood",
    price: 1899,
    description: "An intense, premium formulation for connoisseurs of traditional agarwood. Distilled from matured Aquilaria trees, it offers an earthy, smoky leather opening that settles into a smooth, warm balsamic wood aroma. Worn as a symbol of nobility and heritage.",
    image: "media/royal_oud.png",
    badge: "Premium",
    notes: {
      top: "Bergamot & Nutmeg",
      heart: "Earthy Vetiver & Cedar",
      base: "Pure Matured Oud"
    },
    specs: {
      volume: "6ml Concentrated Oil",
      longevity: "Over 24 Hours (Long-lasting sillage)",
      formulation: "100% Pure Concentrated Oud Blend"
    }
  },
  {
    id: "rose_shahi",
    name: "Rose Shahi",
    tag: "Royal Damask Rose",
    price: 1299,
    description: "A beautiful, uplifting floral masterpiece. Rose Shahi features the absolute finest steam-distilled Damask roses from Taif, balanced with a subtle heart of sweet mountain honey, resting on a base of soft white musk and rich sandalwood. Sweet, fresh, and soothing.",
    image: "media/rose_shahi.png",
    badge: "Best Seller",
    notes: {
      top: "Fresh Damask Rose",
      heart: "Wild Mountain Honey",
      base: "Sandalwood & White Musk"
    },
    specs: {
      volume: "6ml Concentrated Oil",
      longevity: "Up to 18 Hours on Skin",
      formulation: "Alcohol-Free Floral Attar Oil"
    }
  },
  {
    id: "majestic_musk",
    name: "Majestic Musk",
    tag: "Velvet White Musk",
    price: 1399,
    description: "A pristine, clean, and calming white musk that envelopes you like soft cashmere. Majestic Musk blends a light powdery iris and jasmine heart with a deep, long-lasting dry down of warm white musk, cedarwood, and light amber. Sophisticated and highly versatile.",
    image: "media/majestic_musk.png",
    badge: "Popular",
    notes: {
      top: "White Lily & Ozone",
      heart: "Iris & Delicate Jasmine",
      base: "Velvet White Musk & Amber"
    },
    specs: {
      volume: "6ml Concentrated Oil",
      longevity: "Up to 20 Hours on Skin",
      formulation: "Clean, Alcohol-Free Musk Essence"
    }
  }
];

let products = [];
let orders = [];

document.addEventListener("DOMContentLoaded", () => {
  loadData();
  renderStats();
  renderOrders();
  renderProducts();
  initTabs();
  initCRUDForm();
  initClearOrders();
});

// Load catalog & orders from LocalStorage
function loadData() {
  // Load Products
  const savedProducts = localStorage.getItem("hashmi_products");
  if (savedProducts) {
    try {
      products = JSON.parse(savedProducts);
    } catch (e) {
      products = defaultProducts;
    }
  } else {
    products = defaultProducts;
    localStorage.setItem("hashmi_products", JSON.stringify(defaultProducts));
  }

  // Load Orders
  const savedOrders = localStorage.getItem("hashmi_orders");
  if (savedOrders) {
    try {
      orders = JSON.parse(savedOrders);
    } catch (e) {
      orders = [];
    }
  } else {
    orders = [];
  }
}

// Calculate and render dashboard stats
function renderStats() {
  const statSales = document.getElementById("stat-total-sales");
  const statOrders = document.getElementById("stat-total-orders");
  const statProductsCount = document.getElementById("stat-product-count");
  const statPending = document.getElementById("stat-pending-orders");

  // Subtotal of delivered or all simulated sales
  const salesVal = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingCount = orders.filter(o => o.status === "Pending").length;

  if (statSales) statSales.innerText = `₹${salesVal}`;
  if (statOrders) statOrders.innerText = orders.length;
  if (statProductsCount) statProductsCount.innerText = products.length;
  if (statPending) statPending.innerText = pendingCount;
}

// Render Orders Table
function renderOrders() {
  const tableBody = document.getElementById("orders-table-body");
  if (!tableBody) return;

  if (orders.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; color: var(--text-muted); padding: 3.5rem;">
          No orders logged yet. Place orders via WhatsApp on the storefront to see them here!
        </td>
      </tr>
    `;
    return;
  }

  tableBody.innerHTML = "";
  orders.forEach(order => {
    const row = document.createElement("tr");

    // Dropdown for status editing
    const statuses = ["Pending", "Shipped", "Delivered"];
    let statusOptions = "";
    statuses.forEach(s => {
      const selectedAttr = order.status === s ? "selected" : "";
      statusOptions += `<option value="${s}" ${selectedAttr}>${s}</option>`;
    });

    const statusBadgeClass = order.status.toLowerCase();

    row.innerHTML = `
      <td style="font-weight: 600; color: var(--gold-light);">${order.id}</td>
      <td>${order.date}</td>
      <td>${order.customer}</td>
      <td style="max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${order.items}</td>
      <td style="font-family: 'Cinzel', serif; font-weight: 600;">₹${order.total}</td>
      <td>
        <select class="status-select" data-id="${order.id}">
          ${statusOptions}
        </select>
      </td>
      <td>
        <button class="btn-tbl-action delete delete-order-btn" data-id="${order.id}">Delete</button>
      </td>
    `;

    // Dropdown change listener
    row.querySelector(".status-select").addEventListener("change", (e) => {
      updateOrderStatus(order.id, e.target.value);
    });

    // Delete order listener
    row.querySelector(".delete-order-btn").addEventListener("click", () => {
      deleteOrder(order.id);
    });

    tableBody.appendChild(row);
  });
}

// Render Products Table
function renderProducts() {
  const tableBody = document.getElementById("products-table-body");
  if (!tableBody) return;

  tableBody.innerHTML = "";
  products.forEach(product => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>
        <div style="display: flex; align-items: center;">
          <img src="${product.image}" alt="${product.name}" class="product-tbl-img">
          <div>
            <span style="font-weight: 600; font-size: 0.95rem; display: block; color: var(--gold-light);">${product.name}</span>
            <span style="font-size: 0.7rem; color: var(--text-muted);">${product.specs.volume}</span>
          </div>
        </div>
      </td>
      <td style="color: var(--gold);">${product.tag}</td>
      <td style="font-family: 'Cinzel', serif; font-weight: 600;">₹${product.price}</td>
      <td><span style="font-size: 0.75rem; color: var(--text-muted);">${product.notes.top}</span></td>
      <td><span style="font-size: 0.75rem; color: var(--text-muted);">${product.notes.heart}</span></td>
      <td><span style="font-size: 0.75rem; color: var(--text-muted);">${product.notes.base}</span></td>
      <td>
        <button class="btn-tbl-action edit edit-product-btn" data-id="${product.id}">Edit</button>
        <button class="btn-tbl-action delete delete-product-btn" data-id="${product.id}">Delete</button>
      </td>
    `;

    // Bind edit/delete clicks
    row.querySelector(".edit-product-btn").addEventListener("click", () => {
      openProductForm(product.id);
    });
    row.querySelector(".delete-product-btn").addEventListener("click", () => {
      deleteProduct(product.id);
    });

    tableBody.appendChild(row);
  });
}

// Order management actions
function updateOrderStatus(orderId, newStatus) {
  orders = orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
  localStorage.setItem("hashmi_orders", JSON.stringify(orders));
  renderStats();
  renderOrders();
  showToast(`Order ${orderId} marked as ${newStatus}`);
}

function deleteOrder(orderId) {
  if (confirm(`Are you sure you want to delete order ${orderId} logs?`)) {
    orders = orders.filter(o => o.id !== orderId);
    localStorage.setItem("hashmi_orders", JSON.stringify(orders));
    renderStats();
    renderOrders();
    showToast(`Order ${orderId} deleted.`);
  }
}

function initClearOrders() {
  const clearBtn = document.getElementById("clear-orders-btn");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      if (orders.length === 0) return;
      if (confirm("Are you sure you want to clear ALL order logs? This action is irreversible.")) {
        orders = [];
        localStorage.setItem("hashmi_orders", JSON.stringify(orders));
        renderStats();
        renderOrders();
        showToast("All order history cleared.");
      }
    });
  }
}

// CRUD Modal Form Functions
function initCRUDForm() {
  const addBtn = document.getElementById("add-product-btn");
  const modal = document.getElementById("admin-product-modal");
  const closeBtn = document.getElementById("admin-modal-close-btn");
  const cancelBtn = document.getElementById("form-cancel-btn");
  const form = document.getElementById("product-crud-form");

  const openModal = () => {
    modal.classList.add("active");
  };

  const closeModal = () => {
    modal.classList.remove("active");
    form.reset();
    document.getElementById("form-product-id").value = "";
  };

  if (addBtn) {
    addBtn.addEventListener("click", () => {
      document.getElementById("modal-form-title").innerText = "Add New Attar";
      openModal();
    });
  }

  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  if (cancelBtn) cancelBtn.addEventListener("click", closeModal);
  
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
  }

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      saveProductForm(closeModal);
    });
  }
}

function openProductForm(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  document.getElementById("modal-form-title").innerText = "Edit Attar Details";
  document.getElementById("form-product-id").value = product.id;
  
  // Fill inputs
  document.getElementById("form-name").value = product.name;
  document.getElementById("form-price").value = product.price;
  document.getElementById("form-tag").value = product.tag;
  document.getElementById("form-badge").value = product.badge || "";
  document.getElementById("form-desc").value = product.description;
  document.getElementById("form-top-note").value = product.notes.top;
  document.getElementById("form-heart-note").value = product.notes.heart;
  document.getElementById("form-base-note").value = product.notes.base;
  document.getElementById("form-volume").value = product.specs.volume;
  document.getElementById("form-longevity").value = product.specs.longevity;
  document.getElementById("form-image").value = product.image;

  document.getElementById("admin-product-modal").classList.add("active");
}

function saveProductForm(closeModalCallback) {
  const idInput = document.getElementById("form-product-id").value;
  const name = document.getElementById("form-name").value.trim();
  const price = parseInt(document.getElementById("form-price").value);
  const tag = document.getElementById("form-tag").value.trim();
  const badge = document.getElementById("form-badge").value.trim();
  const desc = document.getElementById("form-desc").value.trim();
  const top = document.getElementById("form-top-note").value.trim();
  const heart = document.getElementById("form-heart-note").value.trim();
  const base = document.getElementById("form-base-note").value.trim();
  const volume = document.getElementById("form-volume").value.trim();
  const longevity = document.getElementById("form-longevity").value.trim();
  const image = document.getElementById("form-image").value;

  if (idInput) {
    // EDIT MODE
    products = products.map(p => {
      if (p.id === idInput) {
        return {
          ...p,
          name, price, tag, badge, description: desc,
          notes: { top, heart, base },
          specs: { volume, longevity, formulation: p.specs.formulation },
          image
        };
      }
      return p;
    });
    showToast(`Product "${name}" updated successfully.`);
  } else {
    // ADD MODE
    // Generate clean slug ID from name
    const newId = name.toLowerCase().replace(/[^a-z0-9]+/g, '_') + "_" + Math.floor(100 + Math.random() * 900);
    const newProduct = {
      id: newId,
      name, price, tag, badge, description: desc,
      notes: { top, heart, base },
      specs: { volume, longevity, formulation: "100% Alcohol-Free, Premium Natural Extract" },
      image
    };

    products.push(newProduct);
    showToast(`Product "${name}" added to catalog.`);
  }

  // Save and Render
  localStorage.setItem("hashmi_products", JSON.stringify(products));
  renderStats();
  renderProducts();
  closeModalCallback();
}

function deleteProduct(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  if (confirm(`Are you sure you want to delete "${product.name}" from the boutique catalog?`)) {
    products = products.filter(p => p.id !== productId);
    localStorage.setItem("hashmi_products", JSON.stringify(products));
    renderStats();
    renderProducts();
    showToast(`Product "${product.name}" deleted.`);
  }
}

// Stats & tabs controls toggles
function initTabs() {
  const tabOrders = document.getElementById("tab-orders-btn");
  const tabProducts = document.getElementById("tab-products-btn");
  const contentOrders = document.getElementById("content-orders");
  const contentProducts = document.getElementById("content-products");

  if (tabOrders && tabProducts && contentOrders && contentProducts) {
    tabOrders.addEventListener("click", () => {
      tabOrders.classList.add("active");
      tabProducts.classList.remove("active");
      contentOrders.classList.add("active");
      contentProducts.classList.remove("active");
    });

    tabProducts.addEventListener("click", () => {
      tabProducts.classList.add("active");
      tabOrders.classList.remove("active");
      contentProducts.classList.add("active");
      contentOrders.classList.remove("active");
    });
  }
}

// Toast notification generator
function showToast(message) {
  const wrapper = document.getElementById("toast-wrapper");
  if (!wrapper) return;

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `
    <span class="toast-success-icon">✦</span>
    <span>${message}</span>
  `;

  wrapper.appendChild(toast);

  // Auto remove
  setTimeout(() => {
    toast.classList.add("fade-out");
    toast.addEventListener("animationend", () => {
      toast.remove();
    });
  }, 3500);
}
