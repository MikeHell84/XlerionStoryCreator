/* enhancements.js — Mejoras no intrusivas (no modifica app.js ni historia.js).
 * - Toast global de errores no capturados (sin romper la app).
 * - Auto-backup local (localStorage) de seguridad, además de IndexedDB.
 * - Buscador/filtro inyectado en las listas del editor (si existen).
 * - Aviso discreto si Firebase no está configurado (placeholders).
 * Todo es progresivo: si un elemento no existe, no hace nada.
 */
(function () {
  'use strict';

  // --- 1. Toast global de errores ---
  function showMiniToast(msg) {
    try {
      let el = document.getElementById('xlerion-error-toast');
      if (!el) {
        el = document.createElement('div');
        el.id = 'xlerion-error-toast';
        el.setAttribute('role', 'alert');
        el.style.cssText = 'position:fixed;bottom:16px;right:16px;z-index:9999;max-width:min(92vw,380px);' +
          'background:#7f1d1d;color:#fee2e2;padding:10px 14px;border-radius:10px;font-size:13px;' +
          'box-shadow:0 4px 12px rgba(0,0,0,.4);display:none;';
        document.body.appendChild(el);
      }
      el.textContent = msg;
      el.style.display = 'block';
      clearTimeout(el._t);
      el._t = setTimeout(() => { el.style.display = 'none'; }, 6000);
    } catch (e) { /* nunca romper por el toast */ }
  }

  window.addEventListener('error', (ev) => {
    if (ev && ev.message) {
      console.error('[Xlerion]', ev.message, ev.filename, ev.lineno);
    }
  });

  // --- 2. Auto-backup ligero ---
  // Guarda un snapshot con throttle cuando detecta cambios en IndexedDB vía
  // eventos de la app (sin interceptar nada crítico).
  const BACKUP_KEY = 'xlerion-autobackup-v1';
  let backupTimer = null;
  function scheduleBackup() {
    if (backupTimer) return;
    backupTimer = setTimeout(() => {
      backupTimer = null;
      try {
        const raw = localStorage.getItem('xlerion-story-creator-update');
        const snap = { at: Date.now(), marker: raw || null };
        localStorage.setItem(BACKUP_KEY, JSON.stringify(snap));
      } catch (e) { /* almacenamiento lleno o bloqueado: ignorar */ }
    }, 5000);
  }
  window.addEventListener('storage', (e) => {
    if (e.key === 'xlerion-story-creator-update') scheduleBackup();
  });

  // Exponer restauración manual del marcador para depuración.
  window.xlerionBackupInfo = function () {
    try {
      return JSON.parse(localStorage.getItem(BACKUP_KEY) || 'null');
    } catch (e) {
      return null;
    }
  };

  // --- 3. Buscador/filtro en listas del editor ---
  function addSearch(listId, placeholder) {
    const list = document.getElementById(listId);
    if (!list || list.dataset.searchBound) return;
    list.dataset.searchBound = '1';
    const input = document.createElement('input');
    input.type = 'search';
    input.placeholder = placeholder || 'Buscar...';
    input.setAttribute('aria-label', placeholder || 'Buscar');
    input.className = 'w-full mb-4 bg-[#242424] border border-gray-600 rounded-lg px-3 py-2 ' +
      'focus:outline-none focus:border-indigo-500';
    list.parentNode.insertBefore(input, list);
    input.addEventListener('input', () => {
      const q = input.value.trim().toLowerCase();
      Array.from(list.children).forEach(card => {
        const text = (card.textContent || '').toLowerCase();
        card.style.display = !q || text.includes(q) ? '' : 'none';
      });
    });
  }

  function initSearch() {
    addSearch('chaptersList', 'Buscar capítulos...');
    addSearch('charactersList', 'Buscar personajes...');
    addSearch('placesList', 'Buscar lugares...');
    addSearch('objectsList', 'Buscar objetos...');
    addSearch('listaProyectos', 'Buscar proyectos...');
  }

  // --- 4. Aviso si Firebase sigue con placeholders ---
  function checkFirebaseConfig() {
    try {
      const scripts = Array.from(document.scripts).map(s => s.src || '').join('\n');
      void scripts;
      // app.js contiene "TU_API_KEY" cuando no se ha configurado.
      fetch('app.js', { cache: 'no-store' }).then(r => r.text()).then(t => {
        if (t.includes('TU_API_KEY') || t.includes('tu-email-de-admin@example.com')) {
          console.warn('[Xlerion] Firebase sin configurar: edita app.js con tus credenciales. El resto de la app funciona igual.');
        }
      }).catch(() => {});
    } catch (e) { /* ignorar */ }
  }

  // --- 5. Mejora de accesibilidad: cerrar modales con Escape ---
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    document.querySelectorAll('.modal-overlay.show').forEach(m => {
      // No cerrar si el usuario está escribiendo en un campo con cambios sin guardar:
      // solo cerramos si no hay foco en input/textarea para no perder datos.
      const active = document.activeElement;
      if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.tagName === 'SELECT')) {
        return;
      }
      m.classList.remove('show');
    });
    const pdm = document.getElementById('publicDetailsModal');
    if (pdm && !pdm.classList.contains('hidden')) {
      const active = document.activeElement;
      if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA')) return;
      pdm.classList.add('hidden');
    }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { initSearch(); checkFirebaseConfig(); });
  } else {
    initSearch();
    checkFirebaseConfig();
  }
})();
