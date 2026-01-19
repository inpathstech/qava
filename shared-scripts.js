// Shared JavaScript for Qava Website Navigation

function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    mobileMenu.classList.toggle('active');
    
    // Prevent body scroll when mobile menu is open
    if (mobileMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

function toggleMobileDropdown() {
    const dropdown = document.getElementById('mobileDropdown');
    const toggle = document.querySelector('.mobile-dropdown-toggle');
    
    dropdown.classList.toggle('active');
    toggle.classList.toggle('active');
}

// Close mobile menu when clicking outside
document.addEventListener('click', function(event) {
    const mobileMenu = document.getElementById('mobileMenu');
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    
    if (mobileMenu.classList.contains('active') && 
        !mobileMenu.contains(event.target) && 
        !hamburgerMenu.contains(event.target)) {
        toggleMobileMenu();
    }
});

// Prevent scroll on mobile when menu is open
document.addEventListener('touchmove', function(e) {
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu.classList.contains('active')) {
        e.preventDefault();
    }
}, { passive: false });

// Handle responsive behavior
window.addEventListener('resize', function() {
    if (window.innerWidth > 1100) {
        const mobileMenu = document.getElementById('mobileMenu');
        if (mobileMenu.classList.contains('active')) {
            toggleMobileMenu();
        }
    }
});

// --- Canonical Listing Image Mapper ---------------------------------------
// Ensure listing images always come from "Project Type Images Oct 2025" based
// on the listing title. This runs once per page load and overwrites any stale
// static HTML image sources. Cache-busting avoids CDN/browser reversion.
document.addEventListener('DOMContentLoaded', function () {
    try {
        const VERSION = '20251030';
        const BASE = './Project Type Images Oct 2025/';

        /**
         * Keyword-to-file rules. The first rule that matches wins. Keep most
         * specific rules first, then generic ones, and finally the fallback.
         */
        const RULES = [
            { keys: [/business plan/i, /\bplan\b/i], file: 'Business Plan.svg' },
            { keys: [/pitch deck/i, /\bdeck\b/i], file: 'Pitch Deck.svg' },
            { keys: [/financial model/i, /\bmodel(?!.*operat)/i], file: 'Financial Model.svg' },
            { keys: [/competitor|competitive/i], file: 'Competitor Analysis.svg' },
            { keys: [/customer segmentation|segment/i], file: 'Customer Segmentation.svg' },
            { keys: [/journey|cx|ux/i], file: 'Customer Journey.svg' },
            { keys: [/industry|market\s+analysis/i], file: 'Industry Analysis.svg' },
            { keys: [/grant/i], file: 'Grant Applications.svg' },
            { keys: [/go-?to-?market|\bgtm\b/i], file: 'Go-To-Market Strategy.svg' },
            { keys: [/\bgrowth\b/i], file: 'Growth Strategy.svg' },
            { keys: [/partnership|alliances?/i], file: 'Partnership Strategy.svg' },
            { keys: [/pricing/i], file: 'Pricing Strategy.svg' },
            // Marketing/e-commerce/brand should map here per requirement
            { keys: [/sales|marketing|brand|e-?commerce/i], file: 'Sales & Marketing Strategy.svg' },
            // Strategy/consulting generic
            { keys: [/\bstrategy\b|consulting/i], file: 'Growth Strategy.svg' },
            // Operations/process
            { keys: [/process|ops|operations/i], file: 'Process Improvement.svg' },
            // Finance
            { keys: [/strategic finance|\bfinance\b|fp&a|fp\s*&\s*a/i], file: 'Strategic Finance.svg' },
            // Product
            { keys: [/\bproduct\b/i], file: 'Product Strategy.svg' },
            // Supply chain / logistics
            { keys: [/supply chain|logistics/i], file: 'Supply Chain Analysis.svg' },
            // Technology and migrations
            { keys: [/technology rationalization|rationali[sz]ation/i], file: 'Technology Rationalization.svg' },
            { keys: [/\bmigration\b/i], file: 'System Migration.svg' },
            { keys: [/digital transformation|platform|engineering/i], file: 'Digital Transformation.svg' },
            // Data/analytics
            { keys: [/data analysis|analytics|business analytics/i], file: 'Data Analysis.svg' },
            { keys: [/data strategy|governance/i], file: 'Data Strategy.svg' },
            { keys: [/tariff|policy impact/i], file: 'Tariff Impact Assessment.svg' },
            { keys: [/vendor|procure/i], file: 'Vendor Strategy.svg' },
            { keys: [/organiz(ation|ational) design/i], file: 'Organizational Design.svg' },
            { keys: [/innovation/i], file: 'Innovation Strategy.svg' },
            // Jobs/Internships generic fallbacks
            { keys: [/internship|\bintern\b/i], file: 'Other.svg' },
            { keys: [/\bjob\b|hiring|\brole\b/i], file: 'Other.svg' },
        ];

        const FALLBACK = 'Other.svg';
        const chooseFile = (title) => {
            for (const r of RULES) {
                if (r.keys.some((rx) => rx.test(title))) return r.file;
            }
            return FALLBACK;
        };

        const apply = () => {
            const cards = document.querySelectorAll('.listing-card');
            if (!cards.length) return;
            cards.forEach((card) => {
                const titleEl = card.querySelector('.listing-title');
                const title = (titleEl ? titleEl.textContent : card.textContent || '').trim();
                const file = chooseFile(title);
                let img = card.querySelector('img.listing-image');
                if (!img) {
                    img = document.createElement('img');
                    img.className = 'listing-image';
                    img.alt = 'Listing image';
                    const slot = card.querySelector('.listing-left, .listing-media, .listing-image-slot') || card;
                    slot.prepend(img);
                }
                const src = `${BASE}${file}?v=${VERSION}`;
                if (img.getAttribute('src') !== src) img.setAttribute('src', src);
            });
        };

        // Initial run
        apply();

        // Re-assert if later scripts mutate the DOM or image src
        const observer = new MutationObserver(() => {
            // Batch via rAF to avoid thrashing
            window.requestAnimationFrame(apply);
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['src']
        });
    } catch (err) {
        // Fail silently to avoid impacting other site scripts
        console.error('[listing-image-mapper] error:', err);
    }
});
