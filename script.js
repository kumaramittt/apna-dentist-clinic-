/**
 * APNA DENTIST / CLINIC - PREMIUM INTERACTIVITY & UX SCRIPT
 * Pure Vanilla JavaScript (Zero external runtime dependencies)
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. STICKY NAVBAR & ACTIVE LINK TRACKING
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  const handleScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active Section Indicator
    const scrollPosition = window.scrollY + 200;
    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPosition >= top && scrollPosition < top + height) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // 2. MOBILE DRAWER NAVIGATION
  const hamburger = document.getElementById('hamburgerBtn');
  const mobileDrawer = document.getElementById('mobileNavDrawer');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  const toggleMobileMenu = (open) => {
    const isOpen = open !== undefined ? open : !mobileDrawer.classList.contains('open');
    if (isOpen) {
      hamburger.classList.add('open');
      mobileDrawer.classList.add('open');
      mobileOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    } else {
      hamburger.classList.remove('open');
      mobileDrawer.classList.remove('open');
      mobileOverlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  };

  if (hamburger) {
    hamburger.addEventListener('click', () => toggleMobileMenu());
  }
  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', () => toggleMobileMenu(false));
  }
  mobileNavLinks.forEach((link) => {
    link.addEventListener('click', () => toggleMobileMenu(false));
  });

  // 3. SERVICES CATEGORY FILTER
  const serviceFilterButtons = document.querySelectorAll('.filter-btn');
  const serviceCards = document.querySelectorAll('.service-card');

  serviceFilterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      serviceFilterButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      serviceCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });

  // 4. PHOTO GALLERY FILTER & LIGHTBOX MODAL
  const galleryFilterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');

  if (galleryFilterBtns.length > 0) {
    galleryFilterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        galleryFilterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-gallery-filter');

        galleryItems.forEach((item) => {
          const category = item.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            item.style.display = 'block';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  // Open Lightbox
  galleryItems.forEach((item) => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const title = item.querySelector('.gallery-title')?.textContent || 'Clinic Facility';
      if (img && lightboxModal && lightboxImg) {
        lightboxImg.src = img.src;
        lightboxCaption.textContent = title;
        lightboxModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  const closeLightbox = () => {
    if (lightboxModal) {
      lightboxModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }
  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxModal?.classList.contains('active')) {
      closeLightbox();
    }
  });

  // 5. APPOINTMENT FORM & DYNAMIC WHATSAPP SYNC
  const bookingForm = document.getElementById('appointmentForm');
  const dateInput = document.getElementById('bookingDate');
  const whatsappBookBtn = document.getElementById('whatsappBookBtn');

  // Set minimum date to today
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
  }

  // Generate WhatsApp Message from Form Data
  const composeWhatsAppMessage = () => {
    const name = document.getElementById('patientName')?.value.trim() || 'Patient';
    const phone = document.getElementById('patientPhone')?.value.trim() || 'Not provided';
    const date = document.getElementById('bookingDate')?.value || 'Earliest available';
    const slot = document.getElementById('bookingSlot')?.value || 'Flexible';
    const treatment = document.getElementById('bookingService')?.value || 'General Consultation';
    const notes = document.getElementById('patientNotes')?.value.trim() || 'None';

    const text = `Hello Dr. Apna Clinic,\n\nI would like to book a dental appointment:\n• Patient Name: ${name}\n• Contact Number: ${phone}\n• Treatment: ${treatment}\n• Preferred Date: ${date}\n• Time Slot: ${slot}\n• Symptoms/Notes: ${notes}\n\nPlease confirm availability. Thank you!`;

    return encodeURIComponent(text);
  };

  // WhatsApp Button Click
  if (whatsappBookBtn) {
    whatsappBookBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const encodedMsg = composeWhatsAppMessage();
      const whatsappUrl = `https://wa.me/919876543210?text=${encodedMsg}`;
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      showToast('Opening WhatsApp with your appointment details!');
    });
  }

  // Handle Standard Form Submission
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('patientName')?.value.trim() || 'Valued Patient';
      
      // Simulate successful appointment dispatch
      showToast(`Thank you, ${name}! Your appointment inquiry has been received. Our team will contact you shortly.`);
      bookingForm.reset();
    });
  }

  // 6. FLOATING WHATSAPP CHAT POPUP WIDGET
  const floatingBtn = document.getElementById('floatingWhatsappBtn');
  const chatPopup = document.getElementById('whatsappChatPopup');
  const chatCloseBtn = document.getElementById('closeChatPopup');
  const quickChatOptions = document.querySelectorAll('.quick-chat-opt');

  if (floatingBtn && chatPopup) {
    floatingBtn.addEventListener('click', () => {
      chatPopup.classList.toggle('active');
    });
  }

  if (chatCloseBtn && chatPopup) {
    chatCloseBtn.addEventListener('click', () => {
      chatPopup.classList.remove('active');
    });
  }

  // Quick Chat Option Click
  quickChatOptions.forEach((btn) => {
    btn.addEventListener('click', () => {
      const prompt = btn.getAttribute('data-prompt');
      const url = `https://wa.me/919876543210?text=${encodeURIComponent(prompt)}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    });
  });

  // 7. TOAST NOTIFICATION UTILITY
  const toast = document.getElementById('toastNotice');
  const toastText = document.getElementById('toastMessage');
  let toastTimer;

  function showToast(message) {
    if (!toast || !toastText) return;
    toastText.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  }

  // 8. INTERSECTION OBSERVER SCROLL REVEAL
  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add('active'));
  }

  // 9. BACK TO TOP BUTTON
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 10. CLINIC OPEN/CLOSED STATUS INDICATOR
  const statusIndicator = document.getElementById('clinicLiveStatus');
  if (statusIndicator) {
    const now = new Date();
    const day = now.getDay(); // 0 is Sunday, 1-6 Mon-Sat
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentTimeVal = hours + minutes / 60;

    let isOpen = false;
    let closingTime = '';

    if (day >= 1 && day <= 5) {
      // Mon - Fri: 9:00 AM - 8:30 PM (20.5)
      isOpen = currentTimeVal >= 9 && currentTimeVal < 20.5;
      closingTime = '8:30 PM';
    } else if (day === 6) {
      // Sat: 9:00 AM - 8:00 PM (20.0)
      isOpen = currentTimeVal >= 9 && currentTimeVal < 20.0;
      closingTime = '8:00 PM';
    } else if (day === 0) {
      // Sun: 10:00 AM - 2:00 PM (14.0)
      isOpen = currentTimeVal >= 10 && currentTimeVal < 14.0;
      closingTime = '2:00 PM';
    }

    if (isOpen) {
      statusIndicator.innerHTML = `<span class="pulse-dot"></span> Open Today until ${closingTime}`;
      statusIndicator.style.color = '#22c55e';
    } else {
      statusIndicator.innerHTML = `<span style="width:8px; height:8px; border-radius:50%; background:#94a3b8; display:inline-block;"></span> Closed Now (Emergency On-Call)`;
      statusIndicator.style.color = '#cbd5e1';
    }
  }
});
