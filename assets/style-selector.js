/**
 * Style Selector Component JS
 * Enhances the style-selector section with interactive functionality
 */

// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function () {
  initStyleSelector();
});

function initStyleSelector() {
  const styleCards = document.querySelectorAll('.style-card');
  if (!styleCards.length) return;

  // Initialize card selection functionality
  setupCardSelection(styleCards);

  // Initialize hover effects
  setupHoverEffects(styleCards);

  // Setup button functionality
  setupButtonBehavior(styleCards);

  // Handle URL parameters if present (for pre-selection)
  handleUrlParams(styleCards);
}

/**
 * Sets up card selection when user clicks on a card
 */
function setupCardSelection(cards) {
  cards.forEach(card => {
    card.addEventListener('click', () => {
      // Get current active card before changing
      const previousActive = document.querySelector('.style-card.active');

      // Only proceed if clicking a different card
      if (previousActive !== card) {
        // Remove active state from all cards with a smooth transition
        cards.forEach(c => {
          c.classList.remove('active');
          c.style.transform = '';
        });

        // Add active state to clicked card
        card.classList.add('active');
        card.style.transform = 'translateY(-5px)';
        setTimeout(() => {
          card.style.transform = '';
        }, 300);

        // Trigger custom event for selection
        triggerSelectionEvent(card);
      }
    });
  });
}

/**
 * Sets up hover effects for the cards
 */
function setupHoverEffects(cards) {
  cards.forEach(card => {
    // Mouse enter effect
    card.addEventListener('mouseenter', () => {
      if (!card.classList.contains('active')) {
        card.style.transform = 'translateY(-5px)';
        card.style.boxShadow = '0 10px 15px rgba(0,0,0,0.05)';
      }
    });

    // Mouse leave effect
    card.addEventListener('mouseleave', () => {
      if (!card.classList.contains('active')) {
        card.style.transform = '';
        card.style.boxShadow = '';
      }
    });
  });
}

/**
 * Setup the submit button behavior
 */
function setupButtonBehavior(cards) {
  cards.forEach(card => {
    const button = card.querySelector('.submit-button');

    if (button) {
      // Prevent card selection when clicking the button
      button.addEventListener('click', (e) => {
        // Only prevent if it's a button and not a link
        if (button.tagName === 'BUTTON') {
          e.stopPropagation();

          // Get the selected series name for tracking or other purposes
          const seriesName = card.querySelector('.series-name').textContent;

          // Example: send tracking event or custom logic
          console.log('Selected series:', seriesName);

          // You can add additional logic here, like form submission or redirect
        }
      });
    }
  });
}

/**
 * Trigger a custom event when a card is selected
 */
function triggerSelectionEvent(card) {
  const seriesName = card.querySelector('.series-name').textContent;

  // Create and dispatch a custom event
  const event = new CustomEvent('styleSelected', {
    detail: {
      series: seriesName,
      element: card
    },
    bubbles: true
  });

  card.dispatchEvent(event);
}

/**
 * Handle URL parameters for pre-selecting a card
 * Example URL: ?style=l-series
 */
function handleUrlParams(cards) {
  const urlParams = new URLSearchParams(window.location.search);
  const styleParam = urlParams.get('style');

  if (styleParam) {
    // Convert to lowercase for case-insensitive comparison
    const normalizedParam = styleParam.toLowerCase().replace(/-/g, ' ');

    // Find card that matches the parameter
    let matchFound = false;

    cards.forEach(card => {
      const seriesName = card.querySelector('.series-name').textContent.toLowerCase();

      if (seriesName.includes(normalizedParam)) {
        // Clear any existing active cards
        cards.forEach(c => c.classList.remove('active'));

        // Set this card as active
        card.classList.add('active');
        matchFound = true;
      }
    });

    // If a match was found, scroll to the section
    if (matchFound) {
      const selectorSection = document.querySelector('.style-container');
      if (selectorSection) {
        setTimeout(() => {
          selectorSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
      }
    }
  }
}

/**
 * Add image zoom functionality on hover (optional)
 * Can be enabled by adding the class 'enable-zoom' to the style-container
 */
function initImageZoom() {
  const container = document.querySelector('.style-container.enable-zoom');
  if (!container) return;

  const images = container.querySelectorAll('.chair-image');

  images.forEach(image => {
    // Create magnifying effect
    image.addEventListener('mousemove', function (e) {
      // Get cursor position
      const x = e.clientX - image.getBoundingClientRect().left;
      const y = e.clientY - image.getBoundingClientRect().top;

      // Convert cursor position to percentage
      const xPercent = (x / image.offsetWidth) * 100;
      const yPercent = (y / image.offsetHeight) * 100;

      // Move the background image
      image.style.transformOrigin = `${xPercent}% ${yPercent}%`;
      image.style.transform = 'scale(1.2)';
    });

    // Reset on mouse leave
    image.addEventListener('mouseleave', function () {
      image.style.transformOrigin = 'center center';
      image.style.transform = 'scale(1)';
    });
  });
}

// Check if image zoom should be initialized
document.addEventListener('DOMContentLoaded', function () {
  setTimeout(initImageZoom, 500); // Slight delay to ensure images are loaded
});

// Re-initialize on Shopify section load events (for theme editor)
document.addEventListener('shopify:section:load', function (event) {
  if (event.detail.sectionId.includes('style-selector')) {
    initStyleSelector();
    setTimeout(initImageZoom, 500);
  }
});