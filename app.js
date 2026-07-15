// Default products database (will be stored in localStorage)
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

// Initialize products from localStorage or default
let products = [];
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

// Cart State
let cart = [];
let orders = [];

// Quiz State
let quizAnswers = { 1: null, 2: null, 3: null };
let currentQuizStep = 1;

// Mixer State
let mixerSlot1 = "althair";
let mixerSlot2 = "rose_shahi";

// Document Elements
document.addEventListener("DOMContentLoaded", () => {
  initProducts();
  initCart();
  initQuiz();
  initMixer();
  initGeneralUI();
});

// 1. Initialize Products Section
function initProducts() {
  const container = document.getElementById("product-list-container");
  if (!container) return;

  container.innerHTML = ""; // Clear fallback HTML

  products.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card glass-panel";
    
    // Check for badge
    const badgeHTML = product.badge ? `<span class="product-badge">${product.badge}</span>` : "";

    card.innerHTML = `
      <div class="product-image-container">
        ${badgeHTML}
        <img src="${product.image}" alt="${product.name}" class="product-card-img" id="img-trigger-${product.id}">
      </div>
      <div class="product-card-info">
        <span class="product-card-tag">${product.tag}</span>
        <h3 class="product-card-title">${product.name}</h3>
        <p class="product-card-desc">${product.description}</p>
        <div class="product-card-footer">
          <span class="product-card-price">₹${product.price}</span>
          <button class="product-card-btn" id="btn-add-${product.id}" aria-label="Add to Cart">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          </button>
        </div>
      </div>
    `;

    // Click events
    const imageContainer = card.querySelector(".product-image-container");
    imageContainer.addEventListener("click", () => openProductModal(product.id));

    const title = card.querySelector(".product-card-title");
    title.style.cursor = "pointer";
    title.addEventListener("click", () => openProductModal(product.id));

    const addBtn = card.querySelector(".product-card-btn");
    addBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      addToCart(product.id, 1);
    });

    container.appendChild(card);
  });
}

// 2. Cart Functionality
function initCart() {
  const cartToggle = document.getElementById("cart-toggle-btn");
  const cartClose = document.getElementById("cart-close-btn");
  const cartOverlay = document.getElementById("cart-overlay");
  const cartDrawer = document.getElementById("cart-drawer");
  const checkoutBtn = document.getElementById("cart-checkout-btn");

  const toggleCart = () => {
    cartDrawer.classList.toggle("active");
    cartOverlay.classList.toggle("active");
  };

  if (cartToggle) cartToggle.addEventListener("click", toggleCart);
  if (cartClose) cartClose.addEventListener("click", toggleCart);
  if (cartOverlay) cartOverlay.addEventListener("click", toggleCart);

  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      if (cart.length === 0) {
        showToast("Your cart is empty. Add products to order!");
        return;
      }
      sendWhatsAppOrder();
    });
  }

  // Load cart from LocalStorage
  const savedCart = localStorage.getItem("hashmi_cart");
  if (savedCart) {
    try {
      cart = JSON.parse(savedCart);
      updateCartUI();
    } catch (e) {
      cart = [];
    }
  }
}

function addToCart(productId, quantity) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const existingItem = cart.find(item => item.product.id === productId);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ product, quantity });
  }

  saveCart();
  updateCartUI();
  showToast(`Added ${product.name} to cart!`);
}

function updateQuantity(productId, delta) {
  const item = cart.find(item => item.product.id === productId);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    removeFromCart(productId);
    return;
  }

  saveCart();
  updateCartUI();
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.product.id !== productId);
  saveCart();
  updateCartUI();
}

function saveCart() {
  localStorage.setItem("hashmi_cart", JSON.stringify(cart));
}

function updateCartUI() {
  // Update badge count
  const badge = document.getElementById("cart-badge-count");
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (badge) badge.innerText = totalItems;

  // Render items
  const itemsWrapper = document.getElementById("cart-items-wrapper");
  const subtotalSum = document.getElementById("cart-total-sum");
  if (!itemsWrapper) return;

  if (cart.length === 0) {
    itemsWrapper.innerHTML = `
      <div class="cart-empty-message">
        <div class="cart-empty-icon">🛒</div>
        <h4 class="cart-empty-title">Your Cart is Empty</h4>
        <p style="font-size: 0.8rem; color: var(--text-muted);">Explore the collections to add luxury attars.</p>
      </div>
    `;
    if (subtotalSum) subtotalSum.innerText = "₹0";
    return;
  }

  itemsWrapper.innerHTML = "";
  let subtotal = 0;

  cart.forEach(item => {
    const itemCost = item.product.price * item.quantity;
    subtotal += itemCost;

    const itemElement = document.createElement("div");
    itemElement.className = "cart-item";
    itemElement.innerHTML = `
      <div class="cart-item-img-box">
        <img src="${item.product.image}" alt="${item.product.name}" class="cart-item-img">
      </div>
      <div class="cart-item-details">
        <span class="cart-item-name">${item.product.name}</span>
        <span class="cart-item-meta">6ml oil</span>
        <div class="cart-item-quantity-controls">
          <button class="cart-qty-btn decrease-qty" data-id="${item.product.id}">-</button>
          <span class="cart-item-qty">${item.quantity}</span>
          <button class="cart-qty-btn increase-qty" data-id="${item.product.id}">+</button>
        </div>
      </div>
      <div class="cart-item-actions">
        <span class="cart-item-price">₹${itemCost}</span>
        <button class="cart-item-remove" data-id="${item.product.id}">Remove</button>
      </div>
    `;

    // Bind item events
    itemElement.querySelector(".decrease-qty").addEventListener("click", () => updateQuantity(item.product.id, -1));
    itemElement.querySelector(".increase-qty").addEventListener("click", () => updateQuantity(item.product.id, 1));
    itemElement.querySelector(".cart-item-remove").addEventListener("click", () => removeFromCart(item.product.id));

    itemsWrapper.appendChild(itemElement);
  });

  if (subtotalSum) subtotalSum.innerText = `₹${subtotal}`;
}

// WhatsApp Order Builder
function sendWhatsAppOrder() {
  const customerName = prompt("Please enter your name for delivery logging:") || "Valued Customer";

  let message = `*HASHMI PERFUMES - NEW ORDER*\n`;
  message += `===============================\n`;
  message += `Assalamu Alaikum! I would like to place an order for the following traditional luxury attar(s):\n\n`;

  let subtotal = 0;
  cart.forEach((item, index) => {
    const itemCost = item.product.price * item.quantity;
    subtotal += itemCost;
    message += `${index + 1}. *${item.product.name}* (6ml Oil)\n`;
    message += `   Quantity: ${item.quantity} x ₹${item.product.price} = *₹${itemCost}*\n\n`;
  });

  message += `===============================\n`;
  message += `*Subtotal:* *₹${subtotal}*\n`;
  message += `===============================\n\n`;
  message += `*Delivery Information:*\n`;
  message += `- Name: ${customerName}\n`;
  message += `- Phone: [Please write contact phone]\n`;
  message += `- Delivery Address: [Please write your complete address]\n\n`;
  message += `Sent from Hashmi Perfumes Online Shop.\n`;

  // Log order to localStorage for Admin panel tracking
  const newOrder = {
    id: "HP-" + Math.floor(1000 + Math.random() * 9000),
    date: new Date().toLocaleDateString(),
    customer: customerName,
    items: cart.map(item => `${item.product.name} (x${item.quantity})`).join(", "),
    total: subtotal,
    status: "Pending"
  };

  const savedOrders = localStorage.getItem("hashmi_orders");
  let ordersList = [];
  if (savedOrders) {
    try {
      ordersList = JSON.parse(savedOrders);
    } catch (e) {
      ordersList = [];
    }
  }
  ordersList.unshift(newOrder);
  localStorage.setItem("hashmi_orders", JSON.stringify(ordersList));

  // Main business number: 9701411272
  const phoneNumber = "919701411272";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  
  // Clear cart on successful order trigger
  cart = [];
  saveCart();
  updateCartUI();

  window.open(whatsappUrl, "_blank");
}

// 3. Scent Quiz Logic
function initQuiz() {
  const optionButtons = document.querySelectorAll(".quiz-option-btn");
  const nextBtn = document.getElementById("quiz-next-btn");
  const backBtn = document.getElementById("quiz-back-btn");
  const restartBtn = document.getElementById("quiz-restart-btn");
  const addCartBtn = document.getElementById("result-add-cart-btn");

  optionButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const step = parseInt(btn.getAttribute("data-question"));
      const value = btn.getAttribute("data-value");

      // Clear previous selection in this step
      const siblings = document.querySelectorAll(`.quiz-option-btn[data-question="${step}"]`);
      siblings.forEach(s => s.classList.remove("selected"));

      // Set new selection
      btn.classList.add("selected");
      quizAnswers[step] = value;

      // Enable next button
      if (nextBtn) nextBtn.removeAttribute("disabled");
    });
  });

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      if (currentQuizStep < 3) {
        goToQuizStep(currentQuizStep + 1);
      } else {
        showQuizResults();
      }
    });
  }

  if (backBtn) {
    backBtn.addEventListener("click", () => {
      if (currentQuizStep > 1) {
        goToQuizStep(currentQuizStep - 1);
      }
    });
  }

  if (restartBtn) {
    restartBtn.addEventListener("click", () => {
      // Clear state
      quizAnswers = { 1: null, 2: null, 3: null };
      optionButtons.forEach(b => b.classList.remove("selected"));
      
      const resultsPanel = document.getElementById("quiz-results-panel");
      const quizContainer = document.getElementById("quiz-step-1").parentElement;
      
      resultsPanel.classList.remove("active");
      quizContainer.style.display = "flex";
      
      if (backBtn) backBtn.style.display = "inline-block";
      if (nextBtn) {
        nextBtn.style.display = "inline-block";
        nextBtn.setAttribute("disabled", "true");
        nextBtn.innerText = "Next";
      }

      goToQuizStep(1);
    });
  }

  if (addCartBtn) {
    addCartBtn.addEventListener("click", () => {
      const matchedId = addCartBtn.getAttribute("data-matched-id");
      if (matchedId) {
        addToCart(matchedId, 1);
      }
    });
  }
}

function goToQuizStep(step) {
  // Hide current step
  document.getElementById(`quiz-step-${currentQuizStep}`).classList.remove("active");
  
  // Show new step
  document.getElementById(`quiz-step-${step}`).classList.add("active");

  // Progress Indicators
  const progressIndicators = document.querySelectorAll(".quiz-progress-step");
  progressIndicators.forEach((p, idx) => {
    if (idx < step) {
      p.classList.add("active");
    } else {
      p.classList.remove("active");
    }
  });

  currentQuizStep = step;

  // Toggle Back Button Visibility
  const backBtn = document.getElementById("quiz-back-btn");
  if (backBtn) {
    if (currentQuizStep > 1) {
      backBtn.classList.add("visible");
    } else {
      backBtn.classList.remove("visible");
    }
  }

  // Handle Next Button text and state
  const nextBtn = document.getElementById("quiz-next-btn");
  if (nextBtn) {
    nextBtn.innerText = currentQuizStep === 3 ? "Show Match" : "Next";
    
    // Check if step is already answered
    if (quizAnswers[currentQuizStep]) {
      nextBtn.removeAttribute("disabled");
    } else {
      nextBtn.setAttribute("disabled", "true");
    }
  }
}

function showQuizResults() {
  const vibe = quizAnswers[1];
  const intensity = quizAnswers[2];
  const occasion = quizAnswers[3];

  let recommendationId = "althair"; // Default fallback

  // Recommendation engine logic
  if (vibe === "woody") {
    if (intensity === "intense" || occasion === "special") {
      recommendationId = "royal_oud";
    } else {
      recommendationId = "althair";
    }
  } else if (vibe === "floral") {
    recommendationId = "rose_shahi";
  } else if (vibe === "musky") {
    recommendationId = "majestic_musk";
  } else if (vibe === "sweet") {
    recommendationId = "althair"; // Althair has amber sweetness
  }

  const matchedProduct = products.find(p => p.id === recommendationId);
  
  // Display Results
  const quizContainer = document.getElementById("quiz-step-1").parentElement;
  const resultsPanel = document.getElementById("quiz-results-panel");
  const nextBtn = document.getElementById("quiz-next-btn");
  const backBtn = document.getElementById("quiz-back-btn");
  
  // Hide Quiz structure
  quizContainer.style.display = "none";
  if (nextBtn) nextBtn.style.display = "none";
  if (backBtn) backBtn.style.display = "none";

  // Fill in matching details
  document.getElementById("result-match-img").src = matchedProduct.image;
  document.getElementById("result-match-name").innerText = matchedProduct.name;
  document.getElementById("result-match-desc").innerText = matchedProduct.description;

  // Match score visual variance
  let score = 95;
  if (vibe === "woody" && recommendationId === "royal_oud") score = 99;
  if (vibe === "floral" && recommendationId === "rose_shahi") score = 98;
  document.getElementById("result-match-score").innerText = `${score}% Match`;

  // Attach reference to buy button
  const addCartBtn = document.getElementById("result-add-cart-btn");
  if (addCartBtn) addCartBtn.setAttribute("data-matched-id", recommendationId);

  // Show Panel
  resultsPanel.classList.add("active");
}

// 4. Fragrance Layering Mixer ("Attar Alchemist")
function initMixer() {
  const slot1Buttons = document.querySelectorAll('#mixer-slot-1-selects .mixer-select-btn');
  const slot2Buttons = document.querySelectorAll('#mixer-slot-2-selects .mixer-select-btn');
  const buyMixerDuoBtn = document.getElementById("mixer-buy-duo-btn");

  const selectHandler = (buttons, slotNum) => {
    buttons.forEach(btn => {
      btn.addEventListener("click", () => {
        buttons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const productId = btn.getAttribute("data-product");
        if (slotNum === 1) {
          mixerSlot1 = productId;
        } else {
          mixerSlot2 = productId;
        }

        runMixerAnimation();
      });
    });
  };

  selectHandler(slot1Buttons, 1);
  selectHandler(slot2Buttons, 2);

  if (buyMixerDuoBtn) {
    buyMixerDuoBtn.addEventListener("click", () => {
      // Add both products with a 10% discount note, or just add both to the cart
      addToCart(mixerSlot1, 1);
      if (mixerSlot1 !== mixerSlot2) {
        addToCart(mixerSlot2, 1);
        showToast("Layering Duo added to cart! Bundle order ready.");
      }
    });
  }
}

function runMixerAnimation() {
  const crucible = document.getElementById("mixer-blend-crucible");
  if (!crucible) return;

  crucible.classList.add("mixing");
  crucible.innerHTML = `<span class="blend-placeholder-text">Blending...</span>`;

  setTimeout(() => {
    crucible.classList.remove("mixing");
    updateMixerOutput();
  }, 800);
}

function updateMixerOutput() {
  const p1 = products.find(p => p.id === mixerSlot1);
  const p2 = products.find(p => p.id === mixerSlot2);
  
  if (!p1 || !p2) return;

  // Update visualizer anchors
  document.getElementById("mixer-img-slot-1").src = p1.image;
  document.getElementById("mixer-lbl-slot-1").innerText = p1.name;

  document.getElementById("mixer-img-slot-2").src = p2.image;
  document.getElementById("mixer-lbl-slot-2").innerText = p2.name;

  // Evaluate Blend Combinations
  let blendName = "";
  let blendProfile = "";
  let blendDesc = "";
  let topNote = "";
  let heartNote = "";
  let baseNote = "";

  const mixKey = [mixerSlot1, mixerSlot2].sort().join("+");

  switch (mixKey) {
    case "althair+rose_shahi":
      blendName = "Royal Rosewood";
      blendProfile = "Rich Woody Floral";
      blendDesc = "The ultimate Eastern classic blend. The deep, warm, and spicy agarwood base of Althair anchors the sweet, blooming Damascus rose heart of Rose Shahi, resulting in a mesmerizing royal trail.";
      topNote = "Cardamom & Fresh Rose";
      heartNote = "Wild Honey & Saffron";
      baseNote = "Cambodian Oud & Sandalwood";
      break;

    case "althair+royal_oud":
      blendName = "Imperial Oud";
      blendProfile = "Intense Spice & Wood";
      blendDesc = "A highly powerful and robust combination designed for true oud lovers. The intense balsamic qualities of Royal Oud are amplified by Althair's cinnamon, cardamom, and dark golden amber.";
      topNote = "Spicy Nutmeg & Cardamom";
      heartNote = "Vetiver & Warm Saffron";
      baseNote = "Double Cambodian Oud";
      break;

    case "althair+majestic_musk":
      blendName = "Mystic Amber";
      blendProfile = "Warm Spicy Musk";
      blendDesc = "A sophisticated, comforting day-to-night scent. Majestic Musk wraps the skin in clean, powdery velvet lily, while Althair layers it with smooth amber, rich spices, and gold saffron.";
      topNote = "Lily, Ozone & Cardamom";
      heartNote = "Jasmine & Saffron";
      baseNote = "Velvet White Musk & Amber";
      break;

    case "rose_shahi+royal_oud":
      blendName = "Shahi Oud Rose";
      blendProfile = "Majestic Woody Floral";
      blendDesc = "The majestic signature blend of Indian royalty. Earthy, dark, and smoky matured Cambodian oud provides a grand, mystical platform for the sweet, lush steam-distilled Taif rose petals.";
      topNote = "Damask Rose & Bergamot";
      heartNote = "Mountain Honey & Cedar";
      baseNote = "Matured Oud & Sandalwood";
      break;

    case "majestic_musk+royal_oud":
      blendName = "Midnight Velvet";
      blendProfile = "Dark Woody Musk";
      blendDesc = "A dark, mysterious fragrance full of contrasts. A pure, clean, powdery white musk top contrasts dramatically with a base of smoky matured agarwood, earthy vetiver, and dark forest woods.";
      topNote = "Ozone & Nutmeg";
      heartNote = "Delicate Jasmine & Vetiver";
      baseNote = "White Musk & Rich Oud";
      break;

    case "majestic_musk+rose_shahi":
      blendName = "Velvet Petals";
      blendProfile = "Soft Powdery Floral";
      blendDesc = "A clean, peaceful, and romantic blend. Sweet, comforting wild mountain honey and fresh Damascus rose blossoms melt into a base of clean, powdery velvet white musk. Extremely calming.";
      topNote = "Fresh Rose & Lily";
      heartNote = "Mountain Honey & Iris";
      baseNote = "White Musk & Sandalwood";
      break;

    default: // Same product layered together
      blendName = `${p1.name} Intense`;
      blendProfile = `Double ${p1.tag}`;
      blendDesc = `Layering ${p1.name} with itself amplifies its concentration. This technique locks the scent molecules, elevating the sillage, depth, and longevity of the perfume oil to the maximum level.`;
      topNote = p1.notes.top;
      heartNote = p1.notes.heart;
      baseNote = p1.notes.base;
  }

  // Update Crucible
  const crucible = document.getElementById("mixer-blend-crucible");
  crucible.innerHTML = `
    <span class="blend-title">${blendName}</span>
    <span class="blend-tag">${blendProfile}</span>
  `;

  // Update Description Card
  document.getElementById("mixer-result-title").innerText = blendName;
  document.getElementById("mixer-result-tag").innerText = blendProfile;
  document.getElementById("mixer-result-desc").innerText = blendDesc;
  document.getElementById("mixer-val-top").innerText = topNote;
  document.getElementById("mixer-val-heart").innerText = heartNote;
  document.getElementById("mixer-val-base").innerText = baseNote;

  // Change buy button text
  const buyMixerDuoBtn = document.getElementById("mixer-buy-duo-btn");
  if (buyMixerDuoBtn) {
    if (mixerSlot1 === mixerSlot2) {
      buyMixerDuoBtn.innerText = `Order Double ${p1.name} (₹${p1.price * 2})`;
    } else {
      const discountedPrice = Math.round((p1.price + p2.price) * 0.9);
      buyMixerDuoBtn.innerText = `Order Layering Duo: ₹${discountedPrice} (Save 10%)`;
    }
  }
}

// 5. Product Quick View Modal
function openProductModal(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const modalBody = document.getElementById("modal-content-body");
  if (!modalBody) return;

  modalBody.innerHTML = `
    <div class="modal-gallery">
      <img src="${product.image}" alt="${product.name}" class="modal-main-img">
    </div>
    <div class="modal-details">
      <span class="modal-perfume-tag">${product.tag}</span>
      <h3 class="modal-perfume-title">${product.name}</h3>
      <div class="modal-perfume-price">₹${product.price}</div>
      <p class="modal-perfume-desc">${product.description}</p>
      
      <div class="modal-perfume-notes-grid">
        <div class="modal-note-box">
          <span class="modal-note-label">Top Note</span>
          <span class="modal-note-value">${product.notes.top}</span>
        </div>
        <div class="modal-note-box">
          <span class="modal-note-label">Heart Note</span>
          <span class="modal-note-value">${product.notes.heart}</span>
        </div>
        <div class="modal-note-box">
          <span class="modal-note-label">Base Note</span>
          <span class="modal-note-value">${product.notes.base}</span>
        </div>
      </div>

      <div class="modal-perfume-specs">
        <div class="modal-spec-row">
          <span class="modal-spec-name">Volume:</span>
          <span class="modal-spec-val">${product.specs.volume}</span>
        </div>
        <div class="modal-spec-row">
          <span class="modal-spec-name">Longevity:</span>
          <span class="modal-spec-val">${product.specs.longevity}</span>
        </div>
        <div class="modal-spec-row">
          <span class="modal-spec-name">Formulation:</span>
          <span class="modal-spec-val">${product.specs.formulation}</span>
        </div>
      </div>

      <div class="modal-action-row">
        <button class="btn-gold" style="flex-grow: 1;" id="modal-add-to-cart-btn">Add to Cart</button>
      </div>
    </div>
  `;

  // Modal Add To Cart Click Handler
  const addToCartBtn = modalBody.querySelector("#modal-add-to-cart-btn");
  if (addToCartBtn) {
    addToCartBtn.addEventListener("click", () => {
      addToCart(product.id, 1);
      closeProductModal();
    });
  }

  // Open Modal
  const modal = document.getElementById("product-modal");
  if (modal) modal.classList.add("active");
}

function closeProductModal() {
  const modal = document.getElementById("product-modal");
  if (modal) modal.classList.remove("active");
}

// 6. UI Helpers (Toasts, Mobile Menu, Scrolling)
function initGeneralUI() {
  const modal = document.getElementById("product-modal");
  const modalClose = document.getElementById("modal-close-btn");

  if (modalClose) modalClose.addEventListener("click", closeProductModal);
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeProductModal();
      }
    });
  }

  // Sticky header class add on scroll
  const header = document.getElementById("main-header");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.style.boxShadow = "0 8px 30px rgba(0, 0, 0, 0.4)";
      header.style.backgroundColor = "rgba(5, 7, 6, 0.95)";
    } else {
      header.style.boxShadow = "none";
      header.style.backgroundColor = "rgba(5, 7, 6, 0.8)";
    }
  });

  // Mobile Menu navigation toggle
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const navMenu = document.getElementById("nav-menu");
  const navLinks = document.querySelectorAll(".nav-links a");

  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener("click", () => {
      navMenu.classList.toggle("active");
      // Change icon
      if (navMenu.classList.contains("active")) {
        mobileMenuBtn.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
      } else {
        mobileMenuBtn.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
      }
    });
  }

  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      if (navMenu && navMenu.classList.contains("active")) {
        navMenu.classList.remove("active");
        mobileMenuBtn.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
      }
    });
  });

  // Highlight active link based on scroll position
  window.addEventListener("scroll", () => {
    let current = "";
    const sections = document.querySelectorAll("section, footer");
    const scrollPos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (scrollPos >= sectionTop - 120) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  });
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
