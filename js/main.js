/* ============================================
   Enterprise Security Transformation
   Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all components
  initCodeCopy();
  initTimeline();
  initMobileMenu();
  setActiveNavItem();
  
  // Initialize collapsible sidebar sections
  initCollapsibleSidebar();
});

/* ============================================
   COLLAPSIBLE SIDEBAR SECTIONS
   Click section titles to expand/collapse
   ============================================ */

function initCollapsibleSidebar() {
  const sectionTitles = document.querySelectorAll('.nav-section-title');
  
  // Load saved state from localStorage
  const savedState = JSON.parse(localStorage.getItem('sidebarState') || '{}');
  
  sectionTitles.forEach((title, index) => {
    const section = title.closest('.nav-section');
    const navItems = section.querySelectorAll('.nav-item');
    const sectionKey = `section-${index}`;
    
    // Create wrapper for nav items (for animation)
    const itemsWrapper = document.createElement('div');
    itemsWrapper.className = 'nav-items-wrapper';
    navItems.forEach(item => itemsWrapper.appendChild(item));
    section.appendChild(itemsWrapper);
    
    // Check if this section contains the active page
    const hasActivePage = section.querySelector('.nav-item.active') !== null;
    
    // Determine initial state: expand if has active page, otherwise use saved state
    let isExpanded = hasActivePage;
    if (!hasActivePage && savedState[sectionKey] !== undefined) {
      isExpanded = savedState[sectionKey];
    }
    
    // Set initial state
    if (isExpanded) {
      section.classList.add('expanded');
      itemsWrapper.style.maxHeight = itemsWrapper.scrollHeight + 'px';
    } else {
      section.classList.remove('expanded');
      itemsWrapper.style.maxHeight = '0';
    }
    
    // Add click handler to toggle
    title.addEventListener('click', function() {
      const isCurrentlyExpanded = section.classList.contains('expanded');
      
      if (isCurrentlyExpanded) {
        // Collapse
        section.classList.remove('expanded');
        itemsWrapper.style.maxHeight = '0';
        savedState[sectionKey] = false;
      } else {
        // Expand
        section.classList.add('expanded');
        itemsWrapper.style.maxHeight = itemsWrapper.scrollHeight + 'px';
        savedState[sectionKey] = true;
      }
      
      // Save state
      localStorage.setItem('sidebarState', JSON.stringify(savedState));
    });
    
    // Add chevron icon to title
    const chevron = document.createElement('span');
    chevron.className = 'nav-section-chevron';
    chevron.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>`;
    title.appendChild(chevron);
  });
  
  // Scroll active item into view after sections are set up
  setTimeout(() => {
    const activeItem = document.querySelector('.nav-item.active');
    if (activeItem) {
      activeItem.scrollIntoView({ block: 'center', behavior: 'instant' });
    }
  }, 100);
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
