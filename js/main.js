/* ============================================
   Enterprise Security Transformation
   Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all components
  initSidebar();
  initCodeCopy();
  initTimeline();
  initMobileMenu();
  setActiveNavItem();
  initSidebarScroll(); // New: Handle sidebar scroll position
});

/* Sidebar Navigation */
function initSidebar() {
  const navItems = document.querySelectorAll('.nav-item');
  
  navItems.forEach(item => {
    item.addEventListener('click', function(e) {
      // Save sidebar scroll position before navigating
      saveSidebarScrollPosition();
      
      // Remove active class from all items
      navItems.forEach(nav => nav.classList.remove('active'));
      // Add active class to clicked item
      this.classList.add('active');
    });
  });
}

/* Sidebar Scroll Position Management */
function initSidebarScroll() {
  const sidebar = document.querySelector('.sidebar-nav');
  if (!sidebar) return;
  
  // Try to restore saved scroll position first
  const savedPosition = sessionStorage.getItem('sidebarScrollPosition');
  
  if (savedPosition !== null) {
    // Restore saved position
    sidebar.scrollTop = parseInt(savedPosition, 10);
    // Clear after restoring so it doesn't interfere with manual scrolling
    // We'll save again when user clicks a link
  } else {
    // No saved position, scroll to active item
    scrollToActiveNavItem();
  }
  
  // Also scroll to active item after a short delay to ensure DOM is ready
  setTimeout(() => {
    const activeItem = document.querySelector('.nav-item.active');
    if (activeItem) {
      // Check if active item is visible in the sidebar
      const sidebarRect = sidebar.getBoundingClientRect();
      const activeRect = activeItem.getBoundingClientRect();
      
      // If active item is not visible, scroll to it
      if (activeRect.top < sidebarRect.top || activeRect.bottom > sidebarRect.bottom) {
        scrollToActiveNavItem();
      }
    }
  }, 100);
}

/* Save sidebar scroll position */
function saveSidebarScrollPosition() {
  const sidebar = document.querySelector('.sidebar-nav');
  if (sidebar) {
    sessionStorage.setItem('sidebarScrollPosition', sidebar.scrollTop.toString());
  }
}

/* Scroll sidebar to show the active navigation item */
function scrollToActiveNavItem() {
  const sidebar = document.querySelector('.sidebar-nav');
  const activeItem = document.querySelector('.nav-item.active');
  
  if (!sidebar || !activeItem) return;
  
  // Get the section title for the active item (for context)
  const activeSection = activeItem.closest('.nav-section');
  const sectionTitle = activeSection?.querySelector('.nav-section-title');
  
  // Calculate position to scroll to
  // We want to show the section title if possible, or at least the active item
  const targetElement = sectionTitle || activeItem;
  
  // Get the offset of the target relative to the sidebar
  const sidebarRect = sidebar.getBoundingClientRect();
  const targetRect = targetElement.getBoundingClientRect();
  const activeRect = activeItem.getBoundingClientRect();
  
  // Calculate scroll position to center the active item (or at least show it)
  const targetOffset = targetElement.offsetTop;
  const sidebarHeight = sidebar.clientHeight;
  
  // Scroll to show the section title at the top, with active item visible
  const scrollTo = Math.max(0, targetOffset - 20); // 20px padding from top
  
  // Smooth scroll to position
  sidebar.scrollTo({
    top: scrollTo,
    behavior: 'smooth'
  });
}

/* Set Active Nav Item Based on Current Page */
function setActiveNavItem() {
  const currentPath = window.location.pathname;
  const navItems = document.querySelectorAll('.nav-item');
  
  navItems.forEach(item => {
    const href = item.getAttribute('href');
    if (href && currentPath.endsWith(href.replace('./', ''))) {
      item.classList.add('active');
    } else if (href && currentPath.includes(href.replace('./', '').replace('index.html', ''))) {
      // For section index pages
      if (href.includes('index.html')) {
        item.classList.add('active');
      }
    }
  });
  
  // Special case for root index
  if (currentPath === '/' || currentPath.endsWith('/index.html') || currentPath.endsWith('security-transformation/')) {
    const homeLink = document.querySelector('.nav-item[href="index.html"], .nav-item[href="./index.html"]');
    if (homeLink) {
      homeLink.classList.add('active');
    }
  }
}

/* Code Copy Functionality */
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

/* Interactive Timeline */
function initTimeline() {
  const timelineSegments = document.querySelectorAll('.timeline-segment');
  
  timelineSegments.forEach(segment => {
    segment.addEventListener('mouseenter', function() {
      // Highlight related segments
      const track = this.dataset.track;
      document.querySelectorAll(`.timeline-segment[data-track="${track}"]`).forEach(s => {
        s.style.opacity = '1';
      });
    });
    
    segment.addEventListener('mouseleave', function() {
      // Reset opacity
      document.querySelectorAll('.timeline-segment').forEach(s => {
        s.style.opacity = '';
      });
    });
  });
}

/* Mobile Menu */
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

/* Smooth Scroll for Anchor Links */
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

/* Table of Contents Highlight on Scroll */
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

/* Collapsible Sections */
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

/* Search Functionality (if implemented) */
function initSearch() {
  const searchInput = document.querySelector('.search-input');
  const searchResults = document.querySelector('.search-results');
  
  if (!searchInput) return;
  
  searchInput.addEventListener('input', debounce(function(e) {
    const query = e.target.value.toLowerCase().trim();
    
    if (query.length < 2) {
      searchResults.innerHTML = '';
      return;
    }
    
    // Search implementation would go here
    // This is a placeholder for client-side search
  }, 300));
}

/* Utility: Debounce */
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

/* Utility: Format Date */
function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(new Date(date));
}

/* Export for use in other scripts */
window.SecurityDocs = {
  initSidebar,
  initCodeCopy,
  initTimeline,
  setActiveNavItem
};
