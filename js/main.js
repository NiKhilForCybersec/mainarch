/* ============================================
   Enterprise Security Transformation
   Main JavaScript
   ============================================ */

// Prevent browser's automatic scroll restoration for the sidebar
if ('scrollRestoration' in history) {
  // We handle scroll restoration ourselves via sessionStorage
  // This prevents conflicts with our sidebar scroll management
}

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all components
  initCodeCopy();
  initTimeline();
  initMobileMenu();
  setActiveNavItem();
  
  // Initialize sidebar scroll LAST (after active item is set)
  initSidebarScroll();
});

/* ============================================
   SIDEBAR SCROLL MANAGEMENT
   Maintains scroll position when navigating
   ============================================ */

function initSidebarScroll() {
  const sidebarNav = document.querySelector('.sidebar-nav');
  if (!sidebarNav) return;
  
  // Step 1: Try to restore saved scroll position
  const savedPosition = sessionStorage.getItem('sidebarScrollPos');
  
  if (savedPosition && parseInt(savedPosition) > 0) {
    // Restore saved position immediately
    sidebarNav.scrollTop = parseInt(savedPosition);
    
    // Also set it after a small delay in case browser resets it
    setTimeout(() => {
      sidebarNav.scrollTop = parseInt(savedPosition);
    }, 50);
  } else {
    // No saved position, scroll active item into view after DOM is ready
    setTimeout(() => {
      scrollToActiveItem();
    }, 50);
  }
  
  // Step 2: Add click handlers to save position before navigation
  const navLinks = document.querySelectorAll('.nav-item');
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      // Save scroll position right before navigating
      sessionStorage.setItem('sidebarScrollPos', sidebarNav.scrollTop.toString());
    });
  });
}

/* Scroll the active item into view */
function scrollToActiveItem() {
  const sidebarNav = document.querySelector('.sidebar-nav');
  const activeItem = document.querySelector('.nav-item.active');
  
  if (!sidebarNav || !activeItem) return;
  
  // Calculate the position of active item relative to the sidebar-nav container
  const sidebarNavRect = sidebarNav.getBoundingClientRect();
  const activeItemRect = activeItem.getBoundingClientRect();
  
  // Calculate current scroll position and where active item is
  const currentScroll = sidebarNav.scrollTop;
  const activeItemTop = activeItemRect.top - sidebarNavRect.top + currentScroll;
  const activeItemHeight = activeItem.offsetHeight;
  const sidebarHeight = sidebarNav.clientHeight;
  
  // Calculate scroll position to center the active item
  const targetScroll = activeItemTop - (sidebarHeight / 2) + (activeItemHeight / 2);
  
  // Apply scroll (clamped to valid range)
  sidebarNav.scrollTop = Math.max(0, targetScroll);
}

/* ============================================
   SET ACTIVE NAV ITEM
   Highlights current page in navigation
   ============================================ */

function setActiveNavItem() {
  const currentPath = window.location.pathname;
  const currentPage = currentPath.split('/').pop() || 'index.html';
  const navItems = document.querySelectorAll('.nav-item');
  
  navItems.forEach(item => {
    const href = item.getAttribute('href');
    if (!href) return;
    
    // Get the filename from the href
    const hrefPage = href.split('/').pop();
    
    // Check if this nav item matches current page
    if (currentPage === hrefPage) {
      item.classList.add('active');
    }
  });
}

/* ============================================
   CODE COPY FUNCTIONALITY
   ============================================ */

function initCodeCopy() {
  const copyButtons = document.querySelectorAll('.code-copy-btn');
  
  copyButtons.forEach(button => {
    button.addEventListener('click', async function() {
      const codeBlock = this.closest('.code-block');
      const code = codeBlock.querySelector('code');
      const text = code.textContent;
      
      try {
        await navigator.clipboard.writeText(text);
        this.textContent = 'Copied!';
        this.classList.add('copied');
        
        setTimeout(() => {
          this.textContent = 'Copy';
          this.classList.remove('copied');
        }, 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
        this.textContent = 'Failed';
        setTimeout(() => {
          this.textContent = 'Copy';
        }, 2000);
      }
    });
  });
}

/* ============================================
   INTERACTIVE TIMELINE
   ============================================ */

function initTimeline() {
  const timelineSegments = document.querySelectorAll('.timeline-segment');
  
  timelineSegments.forEach(segment => {
    segment.addEventListener('mouseenter', function() {
      const track = this.dataset.track;
      document.querySelectorAll(`.timeline-segment[data-track="${track}"]`).forEach(s => {
        s.style.opacity = '1';
      });
    });
    
    segment.addEventListener('mouseleave', function() {
      document.querySelectorAll('.timeline-segment').forEach(s => {
        s.style.opacity = '';
      });
    });
  });
}

/* ============================================
   MOBILE MENU
   ============================================ */

function initMobileMenu() {
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.sidebar-overlay');
  
  if (menuToggle && sidebar) {
    menuToggle.addEventListener('click', function() {
      sidebar.classList.toggle('open');
      if (overlay) {
        overlay.classList.toggle('open');
      }
    });
  }
  
  if (overlay) {
    overlay.addEventListener('click', function() {
      sidebar.classList.remove('open');
      this.classList.remove('open');
    });
  }
}

/* ============================================
   SMOOTH SCROLL FOR ANCHOR LINKS
   ============================================ */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

/* ============================================
   TABLE OF CONTENTS HIGHLIGHT
   ============================================ */

function initTocHighlight() {
  const headings = document.querySelectorAll('h2[id], h3[id]');
  const tocLinks = document.querySelectorAll('.toc-link');
  
  if (headings.length === 0 || tocLinks.length === 0) return;
  
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        tocLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, {
    rootMargin: '-100px 0px -66%'
  });
  
  headings.forEach(heading => observer.observe(heading));
}

/* ============================================
   COLLAPSIBLE SECTIONS
   ============================================ */

function initCollapsible() {
  const collapsibles = document.querySelectorAll('.collapsible-trigger');
  
  collapsibles.forEach(trigger => {
    trigger.addEventListener('click', function() {
      const content = this.nextElementSibling;
      const isOpen = content.classList.contains('open');
      
      content.classList.toggle('open');
      this.classList.toggle('open');
      
      if (isOpen) {
        content.style.maxHeight = null;
      } else {
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });
}

/* ============================================
   UTILITY FUNCTIONS
   ============================================ */

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(new Date(date));
}

/* ============================================
   EXPORT FOR USE IN OTHER SCRIPTS
   ============================================ */

window.SecurityDocs = {
  scrollToActiveItem,
  initCodeCopy,
  initTimeline,
  setActiveNavItem
};
