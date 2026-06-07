import "./style.css";

document.addEventListener("DOMContentLoaded", () => {
  // 1. Navbar Scroll Effect & Active Link Highlighting
  const navbar = document.getElementById("navbar");
  const navLinks = document.querySelectorAll(".nav-links a");
  const sections = document.querySelectorAll("section");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 100) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  const sectionObserverOptions = {
    root: null,
    rootMargin: "-20% 0px -80% 0px",
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        let id = entry.target.getAttribute("id");
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${id}`) {
            link.classList.add("active");
          }
        });
      }
    });
  }, sectionObserverOptions);

  sections.forEach((section) => {
    sectionObserver.observe(section);
  });

  // 2. Mobile Menu Toggle
  const navToggle = document.getElementById("nav-toggle");
  const navLinksContainer = document.getElementById("nav-links");

  navToggle.addEventListener("click", () => {
    navToggle.classList.toggle("active");
    navLinksContainer.classList.toggle("active");
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navToggle.classList.remove("active");
      navLinksContainer.classList.remove("active");
    });
  });

  // 3. Smooth Scroll
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    });
  });

  // 4. Scroll Reveal Animations
  const revealElements = document.querySelectorAll(
    ".reveal, .reveal-left, .reveal-right, .reveal-scale"
  );

  const revealOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        observer.unobserve(entry.target);
      }
    });
  }, revealOptions);

  revealElements.forEach((el) => {
    revealObserver.observe(el);
  });

  // 5. Animated Counters
  const counters = document.querySelectorAll(".stat-number");
  
  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const target = +entry.target.getAttribute("data-target");
        let count = 0;
        const duration = 2000; 
        const startTime = performance.now();

        const updateCounter = (currentTime) => {
          const elapsedTime = currentTime - startTime;
          const progress = Math.min(elapsedTime / duration, 1);
          // easeOutQuart
          const easeProgress = 1 - Math.pow(1 - progress, 4);
          const currentCount = Math.floor(easeProgress * target);

          entry.target.innerText = currentCount + (target > 100 ? "+" : "");

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            entry.target.innerText = target + (target > 100 ? "+" : "");
          }
        };

        requestAnimationFrame(updateCounter);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => counterObserver.observe(counter));

  // 6. Rooms Carousel
  const roomsCarousel = document.getElementById("rooms-carousel");
  const btnPrev = document.querySelector(".carousel-btn-prev");
  const btnNext = document.querySelector(".carousel-btn-next");

  if (roomsCarousel && btnPrev && btnNext) {
    btnNext.addEventListener("click", () => {
      const cardWidth = roomsCarousel.querySelector(".room-card").offsetWidth;
      roomsCarousel.scrollBy({ left: cardWidth + 30, behavior: "smooth" });
    });
    btnPrev.addEventListener("click", () => {
      const cardWidth = roomsCarousel.querySelector(".room-card").offsetWidth;
      roomsCarousel.scrollBy({ left: -(cardWidth + 30), behavior: "smooth" });
    });
  }

  // 7. Food Menu Tabs
  const menuTabs = document.querySelectorAll(".menu-tab");
  const menuItems = document.querySelectorAll(".menu-item");

  menuTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      menuTabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      const category = tab.getAttribute("data-category");

      menuItems.forEach((item) => {
        if (item.getAttribute("data-category") === category) {
          item.style.display = "flex";
        } else {
          item.style.display = "none";
        }
      });
    });
  });

  // 8. Shopping Cart
  let cart = [];
  const addButtons = document.querySelectorAll(".menu-item-add");
  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotalAmount = document.getElementById("cart-total-amount");
  const cartEmpty = document.getElementById("cart-empty");
  const cartTotalWrapper = document.getElementById("cart-total");
  const cartActions = document.getElementById("cart-actions");

  addButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const name = btn.getAttribute("data-name");
      const price = parseFloat(btn.getAttribute("data-price"));
      
      const existingItem = cart.find(item => item.name === name);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({ name, price, quantity: 1 });
      }
      
      updateCartUI();
      showToast(`${name} added to cart`);
    });
  });

  function updateCartUI() {
    cartItemsContainer.innerHTML = "";
    
    if (cart.length === 0) {
      cartEmpty.style.display = "block";
      cartTotalWrapper.style.display = "none";
      cartActions.style.display = "none";
      return;
    }

    cartEmpty.style.display = "none";
    cartTotalWrapper.style.display = "flex";
    cartActions.style.display = "flex";

    let total = 0;
    cart.forEach((item, index) => {
      total += item.price * item.quantity;
      
      const li = document.createElement("li");
      li.className = "cart-item";
      li.innerHTML = `
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-qty">
          <button class="cart-dec" data-index="${index}">-</button>
          <span>${item.quantity}</span>
          <button class="cart-inc" data-index="${index}">+</button>
        </div>
        <div class="cart-item-price">$${item.price * item.quantity}</div>
      `;
      cartItemsContainer.appendChild(li);
    });

    cartTotalAmount.innerText = `$${total}`;

    document.querySelectorAll(".cart-inc").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const idx = e.target.getAttribute("data-index");
        cart[idx].quantity += 1;
        updateCartUI();
      });
    });

    document.querySelectorAll(".cart-dec").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const idx = e.target.getAttribute("data-index");
        if (cart[idx].quantity > 1) {
          cart[idx].quantity -= 1;
        } else {
          cart.splice(idx, 1);
        }
        updateCartUI();
      });
    });
  }

  const btnClearCart = document.getElementById("cart-clear");
  if (btnClearCart) {
    btnClearCart.addEventListener("click", () => {
      cart = [];
      updateCartUI();
      showToast("Cart cleared");
    });
  }

  const btnOrder = document.getElementById("cart-order-btn");
  if (btnOrder) {
    btnOrder.addEventListener("click", () => {
      if (cart.length === 0) return;
      let body = "Hello, I would like to order the following items to my room:\n\n";
      let total = 0;
      cart.forEach(item => {
        body += `- ${item.quantity}x ${item.name} ($${item.price * item.quantity})\n`;
        total += item.price * item.quantity;
      });
      body += `\nTotal: $${total}\n\nRoom Number: [Please enter your room number]`;
      
      const mailto = `mailto:reservation@lemeridien-oran.com?subject=${encodeURIComponent("Room Service Order - Le Méridien Oran")}&body=${encodeURIComponent(body)}`;
      window.location.href = mailto;
      cart = [];
      updateCartUI();
      showToast("Order initiated via email");
    });
  }

  // 9. Gallery Lightbox
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const galleryItems = document.querySelectorAll(".gallery-item img");
  const lightboxClose = document.querySelector(".lightbox-close");
  const lightboxPrev = document.querySelector(".lightbox-prev");
  const lightboxNext = document.querySelector(".lightbox-next");
  
  let currentImageIndex = 0;

  galleryItems.forEach((img, index) => {
    img.parentElement.addEventListener("click", () => {
      currentImageIndex = index;
      openLightbox();
    });
  });

  function openLightbox() {
    lightboxImg.src = galleryItems[currentImageIndex].src;
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.classList.remove("active");
    document.body.style.overflow = "auto";
  }

  if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
  }

  if (lightboxPrev && lightboxNext) {
    lightboxPrev.addEventListener("click", () => {
      currentImageIndex = (currentImageIndex - 1 + galleryItems.length) % galleryItems.length;
      lightboxImg.src = galleryItems[currentImageIndex].src;
    });

    lightboxNext.addEventListener("click", () => {
      currentImageIndex = (currentImageIndex + 1) % galleryItems.length;
      lightboxImg.src = galleryItems[currentImageIndex].src;
    });
  }

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("active")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") lightboxPrev.click();
    if (e.key === "ArrowRight") lightboxNext.click();
  });

  // 10. Contact Form
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("contact-name").value;
      const email = document.getElementById("contact-email").value;
      const phone = document.getElementById("contact-phone").value;
      const subject = document.getElementById("contact-subject").value;
      const message = document.getElementById("contact-message").value;

      const body = `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nMessage:\n${message}`;
      const mailto = `mailto:reservation@lemeridien-oran.com?subject=${encodeURIComponent("Website Inquiry from " + name + ": " + subject)}&body=${encodeURIComponent(body)}`;
      
      window.location.href = mailto;
      contactForm.reset();
      showToast("Message client opened successfully!");
    });
  }

  // 11. Booking Form
  const bookingForm = document.getElementById("booking-form");
  if (bookingForm) {
    bookingForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const checkin = document.getElementById("checkin").value;
      const checkout = document.getElementById("checkout").value;
      const guests = document.getElementById("guests").value;
      const roomType = document.getElementById("room-type").options[document.getElementById("room-type").selectedIndex].text;

      const body = `Hello,\n\nI would like to request a reservation with the following details:\n\nCheck-in: ${checkin}\nCheck-out: ${checkout}\nGuests: ${guests}\nRoom Type: ${roomType}\n\nPlease let me know about availability and rates.\n\nThank you.`;
      const mailto = `mailto:reservation@lemeridien-oran.com?subject=${encodeURIComponent("Reservation Request - Le Méridien Oran")}&body=${encodeURIComponent(body)}`;
      
      window.location.href = mailto;
      bookingForm.reset();
      showToast("Booking request initiated via email");
    });
  }

  // 12. Back to Top Button
  const backToTop = document.getElementById("back-to-top");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 500) {
      backToTop.classList.add("visible");
    } else {
      backToTop.classList.remove("visible");
    }
  });

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // 13. Toast Notification
  function showToast(message, duration = 3000) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.innerText = message;
    toast.classList.add("show");
    
    setTimeout(() => {
      toast.classList.remove("show");
    }, duration);
  }

  // 14. Parallax Effect on Hero
  const heroBg = document.querySelector(".hero-bg");
  if (heroBg) {
    window.addEventListener("scroll", () => {
      const scrollY = window.scrollY;
      if (scrollY < window.innerHeight) {
        requestAnimationFrame(() => {
          heroBg.style.transform = `translateY(${scrollY * 0.3}px)`;
        });
      }
    });
  }

  // 15. Date Constraints
  const checkinInput = document.getElementById("checkin");
  const checkoutInput = document.getElementById("checkout");
  
  if (checkinInput && checkoutInput) {
    const today = new Date().toISOString().split("T")[0];
    checkinInput.setAttribute("min", today);
    checkoutInput.setAttribute("min", today);
    
    checkinInput.addEventListener("change", () => {
      checkoutInput.setAttribute("min", checkinInput.value);
      if (checkoutInput.value && checkoutInput.value < checkinInput.value) {
        checkoutInput.value = checkinInput.value;
      }
    });
  }
});
