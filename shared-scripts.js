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
            { keys: [/sales|marketing strategy/i], file: 'Sales & Marketing Strategy.svg' },
            { keys: [/strategic finance/i], file: 'Strategic Finance.svg' },
            { keys: [/operating model/i], file: 'Operating Model Design.svg' },
            { keys: [/process improvement|lean|six sigma/i], file: 'Process Improvement.svg' },
            { keys: [/technology rationalization|rationali[sz]ation/i], file: 'Technology Rationalization.svg' },
            { keys: [/system migration|\bmigration\b/i], file: 'System Migration.svg' },
            { keys: [/vendor|procure/i], file: 'Vendor Strategy.svg' },
            { keys: [/organiz(ation|ational) design/i], file: 'Organizational Design.svg' },
            { keys: [/innovation/i], file: 'Innovation Strategy.svg' },
            { keys: [/digital transformation/i], file: 'Digital Transformation.svg' },
            { keys: [/data analysis|analytics/i], file: 'Data Analysis.svg' },
            { keys: [/data strategy|governance/i], file: 'Data Strategy.svg' },
            { keys: [/tariff|policy impact/i], file: 'Tariff Impact Assessment.svg' },
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

        const cards = document.querySelectorAll('.listing-card');
        if (!cards.length) return;

        cards.forEach((card) => {
            const titleEl = card.querySelector('.listing-title');
            const title = (titleEl ? titleEl.textContent : card.textContent || '').trim();
            const file = chooseFile(title);

            // Reuse existing image or inject a new one in the left/media slot
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
    } catch (err) {
        // Fail silently to avoid impacting other site scripts
        console.error('[listing-image-mapper] error:', err);
    }
});
