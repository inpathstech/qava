/**
 * Club Room quiet-list landing preview.
 * Places the section between blog thumbnails and match-making showcase,
 * then wires accordion + topic filters.
 */
(function () {
  function finishLandingPreview() {
    window.__qavaCommunityPreviewReady = true;
    if (typeof window.__qavaReveal === 'function') {
      window.__qavaReveal();
    } else {
      document.documentElement.classList.remove('qava-pending');
      document.documentElement.classList.add('qava-enhanced');
    }
  }

  function placeLandingPreview(attempt) {
    var el = document.querySelector('.landing-section[data-landing-preview]');
    if (!el) {
      if (window.__qavaLandingReady || (attempt || 0) > 30) finishLandingPreview();
      else window.requestAnimationFrame(function () { placeLandingPreview((attempt || 0) + 1); });
      return;
    }
    var anchor = document.getElementById('qava-showcase-toggle-wrap')
      || document.getElementById('qava-hero-showcase-box');
    if (anchor && anchor.parentElement) {
      anchor.parentElement.insertBefore(el, anchor);
      el.style.display = '';
      el.removeAttribute('data-landing-preview');
      finishLandingPreview();
      initQuietList(el);
      return;
    }
    if ((attempt || 0) < 90) {
      window.requestAnimationFrame(function () { placeLandingPreview((attempt || 0) + 1); });
    } else {
      el.style.display = '';
      el.removeAttribute('data-landing-preview');
      finishLandingPreview();
      initQuietList(el);
    }
  }

  function initQuietList(root) {
    var list = root.querySelector('#quietList') || root.querySelector('.quiet-list');
    if (!list || list.dataset.quietReady) return;
    list.dataset.quietReady = '1';

    function toggleItem(item) {
      var row = item.querySelector('.quiet-row');
      var open = item.classList.contains('is-open');
      list.querySelectorAll('.quiet-item.is-open').forEach(function (other) {
        other.classList.remove('is-open');
        var r = other.querySelector('.quiet-row');
        if (r) r.setAttribute('aria-expanded', 'false');
      });
      if (!open) {
        item.classList.add('is-open');
        if (row) row.setAttribute('aria-expanded', 'true');
      }
    }

    list.querySelectorAll('.quiet-item').forEach(function (item) {
      var row = item.querySelector('.quiet-row');
      if (!row) return;
      row.addEventListener('click', function (e) {
        if (e.target.closest('.quiet-tag, .quiet-attach-chip, .quiet-actions')) return;
        toggleItem(item);
      });
      row.addEventListener('keydown', function (e) {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        if (e.target.closest('.quiet-tag, .quiet-attach-chip, .quiet-actions')) return;
        e.preventDefault();
        toggleItem(item);
      });
    });

    function allItems() {
      return Array.prototype.slice.call(list.querySelectorAll('.quiet-item'));
    }

    function categoryCounts() {
      var counts = {};
      allItems().forEach(function (item) {
        var cat = item.getAttribute('data-cat');
        counts[cat] = (counts[cat] || 0) + 1;
      });
      return counts;
    }

    var filtersRoot = root.querySelector('#clubFilters') || root.querySelector('.club-filters');

    function syncFilterChipVisibility() {
      if (!filtersRoot) return;
      var counts = categoryCounts();
      filtersRoot.querySelectorAll('.club-filter').forEach(function (btn) {
        var filter = btn.getAttribute('data-filter');
        if (filter === 'all') {
          btn.hidden = false;
          return;
        }
        btn.hidden = (counts[filter] || 0) < 1;
      });
    }

    var activeFilter = 'all';

    function applyFilter(filter) {
      activeFilter = filter || 'all';
      if (filtersRoot) {
        filtersRoot.querySelectorAll('.club-filter').forEach(function (btn) {
          btn.classList.toggle('is-active', btn.getAttribute('data-filter') === activeFilter);
        });
      }
      allItems().forEach(function (item) {
        var show = activeFilter === 'all'
          ? item.getAttribute('data-featured') === 'true'
          : item.getAttribute('data-cat') === activeFilter;
        item.hidden = !show;
        if (!show) {
          item.classList.remove('is-open');
          var row = item.querySelector('.quiet-row');
          if (row) row.setAttribute('aria-expanded', 'false');
        }
      });
    }

    syncFilterChipVisibility();
    applyFilter('all');

    root.querySelectorAll('.club-filter, .quiet-tag[data-filter]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        applyFilter(btn.getAttribute('data-filter') || 'all');
      });
    });

    var cta = root.querySelector('[data-club-cta-last]');
    if (cta) {
      cta.addEventListener('click', function (e) {
        e.preventDefault();
        applyFilter('all');
        var last = root.querySelector('#club-example-last');
        if (!last) return;
        last.hidden = false;
        if (!last.classList.contains('is-open')) toggleItem(last);
        last.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    }
  }

  placeLandingPreview(0);
})();
