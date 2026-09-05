/* config-panel.js — Pestaña "Config" del panel de administración.
 * CMS sections: General | Diseño | Inteligencia Artificial | Datos.
 * Usa window.xlerionConfig (definido en app.js). Todo el contenido
 * generado por el usuario se escapa antes de inyectarse (anti-XSS).
 */
(function () {
  'use strict';

  function esc(s) {
    return String(s ?? '')
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function cfg() {
    return window.xlerionConfig;
  }

  function toast(msg, isError) {
    let el = document.getElementById('cfg-toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'cfg-toast';
      el.setAttribute('role', 'status');
      el.style.cssText = 'position:fixed;bottom:16px;left:50%;transform:translateX(-50%);z-index:9999;' +
        'padding:10px 18px;border-radius:10px;font-size:14px;font-weight:600;' +
        'box-shadow:0 4px 12px rgba(0,0,0,.4);display:none;';
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.style.display = 'block';
    el.style.background = isError ? '#7f1d1d' : '#14532d';
    el.style.color = '#fff';
    clearTimeout(el._t);
    el._t = setTimeout(() => { el.style.display = 'none'; }, 3500);
  }

  function colorRow(id, label, value) {
    return '<div class="flex items-center justify-between gap-4 py-2">' +
      '<label for="' + id + '" class="font-medium">' + esc(label) + '</label>' +
      '<input type="color" id="' + id + '" value="' + esc(value) + '" title="' + esc(label) + '">' +
      '</div>';
  }

  function textRow(id, label, value, hint, type) {
    return '<div class="flex flex-col py-2">' +
      '<label for="' + id + '" class="font-medium mb-1">' + esc(label) + '</label>' +
      '<input type="' + (type || 'text') + '" id="' + id + '" value="' + esc(value) + '" class="w-full">' +
      (hint ? '<p class="text-xs text-gray-500 mt-1">' + esc(hint) + '</p>' : '') +
      '</div>';
  }

  function numRow(id, label, value, min, max, hint) {
    return '<div class="flex flex-col py-2">' +
      '<label for="' + id + '" class="font-medium mb-1">' + esc(label) + '</label>' +
      '<input type="number" id="' + id + '" value="' + esc(value) + '" min="' + min + '" max="' + max + '" class="w-full bg-[#242424] border border-gray-600 rounded-lg px-3 py-2">' +
      (hint ? '<p class="text-xs text-gray-500 mt-1">' + esc(hint) + '</p>' : '') +
      '</div>';
  }

  function checkRow(id, label, checked, hint) {
    return '<label class="flex items-start gap-3 py-2 cursor-pointer">' +
      '<input type="checkbox" id="' + id + '"' + (checked ? ' checked' : '') + ' class="mt-1 w-4 h-4 accent-indigo-500">' +
      '<span><span class="font-medium">' + esc(label) + '</span>' +
      (hint ? '<span class="block text-xs text-gray-500">' + esc(hint) + '</span>' : '') + '</span></label>';
  }

  function sectionCard(title, icon, inner) {
    return '<section class="card p-6 mb-6">' +
      '<h4 class="text-xl font-semibold mb-4"><i class="fas ' + icon + ' mr-2 text-indigo-400"></i>' + esc(title) + '</h4>' +
      inner + '</section>';
  }

  function styleEditor(kind, title, hint, list) {
    let rows = '';
    list.forEach((s, i) => {
      rows += '<div class="p-3 bg-gray-900/50 rounded-lg border border-gray-700 space-y-2" data-kind="' + kind + '" data-idx="' + i + '">' +
        '<div class="flex items-center gap-3">' +
          '<input type="checkbox" data-f="enabled"' + (s.enabled !== false ? ' checked' : '') + ' title="Activado" class="w-4 h-4 accent-indigo-500">' +
          '<input type="text" data-f="label" value="' + esc(s.label) + '" title="Etiqueta visible" class="flex-grow">' +
          '<code class="text-xs text-gray-500">' + esc(s.id) + '</code>' +
        '</div>' +
        '<input type="text" data-f="prompt" value="' + esc(s.prompt) + '" title="Prompt en inglés que se envía a la IA" placeholder="Prompt del estilo (en inglés)" class="w-full text-sm">' +
        '</div>';
    });
    return '<div class="mt-4"><h5 class="font-semibold mb-1">' + esc(title) + '</h5>' +
      '<p class="text-xs text-gray-500 mb-3">' + esc(hint) + '</p>' +
      '<div class="space-y-3">' + rows + '</div></div>';
  }

  function collectStyles(kind) {
    const out = [];
    document.querySelectorAll('#configPanel [data-kind="' + kind + '"]').forEach(card => {
      const id = card.querySelector('code').textContent;
      out.push({
        id,
        label: card.querySelector('[data-f="label"]').value.trim() || id,
        prompt: card.querySelector('[data-f="prompt"]').value.trim(),
        enabled: card.querySelector('[data-f="enabled"]').checked
      });
    });
    return out;
  }

  const val = (id) => { const el = document.getElementById(id); return el ? el.value : ''; };
  const checked = (id) => { const el = document.getElementById(id); return el ? el.checked : false; };
  const num = (id, min, max, fb) => {
    const v = parseInt(val(id), 10);
    if (isNaN(v)) return fb;
    return Math.min(max, Math.max(min, v));
  };

  function providerCard(task, taskLabel, p, catalog) {
    const opts = Object.keys(catalog).map(id =>
      '<option value="' + id + '"' + (p.provider === id ? ' selected' : '') + '>' +
      esc(catalog[id].label) + ' — ' + esc(catalog[id].detail) + '</option>').join('');
    return '<div class="p-4 bg-gray-900/50 rounded-lg border border-gray-700 space-y-2" data-prov-task="' + task + '">' +
      '<div class="flex items-center justify-between gap-2 flex-wrap">' +
        '<h5 class="font-semibold">' + esc(taskLabel) + '</h5>' +
        '<button type="button" data-test="' + task + '" class="btn btn-secondary text-xs"><i class="fas fa-vial mr-1"></i>Probar</button>' +
      '</div>' +
      '<div class="flex flex-col"><label class="text-sm text-gray-400 mb-1">Proveedor</label>' +
      '<select id="cfg-prov-' + task + '" data-provsel="' + task + '" class="w-full bg-[#242424] border border-gray-600 rounded-lg px-3 py-2">' + opts + '</select></div>' +
      '<div class="flex flex-col" data-pf="key"><label class="text-sm text-gray-400 mb-1">API key</label>' +
      '<input type="password" id="cfg-key-' + task + '" value="' + esc(p.key) + '" placeholder="Solo si el proveedor la pide" autocomplete="off" class="w-full text-sm"></div>' +
      '<div class="flex flex-col" data-pf="model"><label class="text-sm text-gray-400 mb-1">Modelo</label>' +
      '<input type="text" id="cfg-model-' + task + '" value="' + esc(p.model) + '" placeholder="Ej: stabilityai/stable-diffusion-xl-base-1.0" class="w-full text-sm"></div>' +
      '<div class="flex flex-col" data-pf="endpoint"><label class="text-sm text-gray-400 mb-1">Endpoint personalizado</label>' +
      '<input type="text" id="cfg-endpoint-' + task + '" value="' + esc(p.endpoint) + '" placeholder="https://.../{prompt}" class="w-full text-sm"></div>' +
      '<div class="flex flex-col" data-pf="params"><label class="text-sm text-gray-400 mb-1">Parámetros extra</label>' +
      '<input type="text" id="cfg-params-' + task + '" value="' + esc(p.params) + '" placeholder="GET: width=768&height=768 · POST: &quot;steps&quot;: 30" class="w-full text-sm"></div>' +
      '<p data-testres="' + task + '" class="text-xs text-gray-400 min-h-[1rem]"></p>' +
      '</div>';
  }

  function refreshProviderFields(task) {
    const sel = document.getElementById('cfg-prov-' + task);
    const card = document.querySelector('#configPanel [data-prov-task="' + task + '"]');
    if (!sel || !card || !cfg()) return;
    const def = cfg().providers()[sel.value] || {};
    const show = (name, visible) => {
      const row = card.querySelector('[data-pf="' + name + '"]');
      if (row) row.style.display = visible ? '' : 'none';
    };
    show('key', true); // La API key siempre visible: cada modelo puede necesitar la suya
    show('model', !!def.needsModel);
    show('endpoint', !!def.custom);
    show('params', true);
  }

  function setTestResult(task, ok, msg) {
    const el = document.querySelector('#configPanel [data-testres="' + task + '"]');
    if (!el) return;
    el.textContent = (ok ? '✓ ' : '✗ ') + msg;
    el.className = 'text-xs min-h-[1rem] ' + (ok ? 'text-green-400' : 'text-red-400');
  }

  async function testProvider(task) {
    const btn = document.querySelector('#configPanel [data-test="' + task + '"]');
    if (btn) { btn.disabled = true; }
    setTestResult(task, true, 'Guardando ajustes y probando...');
    try {
      await onSave(true); // silencioso: la prueba usa lo que hay en el formulario
      const st = cfg().getSettings();
      const cfgTask = st.ai.providers[task] || {};
      const res = cfg().resolveProvider(task, cfgTask.provider);
      if (res.def.needsKey && !res.key) throw new Error('Falta la API key para ' + res.def.label + '.');
      if (res.def.custom && !res.endpoint) throw new Error('Falta el endpoint personalizado.');
      const t0 = Date.now();
      const b64 = await cfg().generateTest(cfgTask.provider, task, 'tiny colorful test icon, simple');
      const kb = Math.round((b64.length * 3 / 4) / 1024);
      setTestResult(task, true, 'OK · ' + res.def.label + ' respondió en ' + (Date.now() - t0) + ' ms (' + kb + ' KB).');
    } catch (e) {
      setTestResult(task, false, 'Fallo: ' + (e.message || e));
    } finally {
      if (btn) { btn.disabled = false; }
    }
  }

  function ghStatus(html) {
    const el = document.getElementById('cfg-gh-status');
    if (el) el.innerHTML = html;
  }
  function ghText(msg, ok) {
    ghStatus('<p class="' + (ok ? 'text-green-400' : 'text-red-400') + '">' + esc(msg) + '</p>');
  }

  async function ghCall(action) {
    const st = cfg().getSettings();
    const res = await fetch('deploy.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, repo: st.github.repo, branch: st.github.branch })
    });
    return await res.json();
  }

  function renderGhTokenState(configured) {
    const el = document.getElementById('cfg-gh-token-state');
    if (!el) return;
    if (configured === true) {
      el.textContent = '· token guardado en el servidor';
      el.className = 'text-xs text-green-400';
    } else if (configured === false) {
      el.textContent = '· sin token en el servidor';
      el.className = 'text-xs text-yellow-400';
    } else {
      el.textContent = '· estado desconocido — pulsa Probar conexión';
      el.className = 'text-xs text-gray-500';
    }
  }

  async function ghSaveToken() {
    const input = document.getElementById('cfg-gh-token');
    const token = input ? input.value.trim() : '';
    ghText('Guardando token en el servidor...', true);
    try {
      const res = await fetch('deploy.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save_token', token })
      });
      const r = await res.json();
      if (r.success) {
        if (input) input.value = '';
        renderGhTokenState(r.token_configured);
        toast('Token actualizado en el servidor.');
        ghText('Token actualizado. Ahora pulsa Probar conexión.', true);
      } else {
        ghText('✗ ' + (r.message || 'No se pudo guardar.'), false);
      }
    } catch (e) {
      ghText('✗ Error de red: ' + e.message, false);
    }
  }

  // Si el campo de token trae valor, se guarda primero: así "pegar y probar"
  // funciona sin paso extra. Vacío = se usa el ya guardado en el servidor.
  async function ensureTokenSaved() {
    const input = document.getElementById('cfg-gh-token');
    const token = input ? input.value.trim() : '';
    if (!token) return true;
    try {
      const res = await fetch('deploy.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save_token', token })
      });
      const r = await res.json();
      if (r.success) {
        input.value = '';
        renderGhTokenState(r.token_configured);
        return true;
      }
      ghText('✗ No se pudo guardar el token: ' + (r.message || 'error'), false);
      return false;
    } catch (e) {
      ghText('✗ Error de red al guardar el token: ' + e.message, false);
      return false;
    }
  }

  async function ghTest() {
    if (!(await ensureTokenSaved())) return;
    ghText('Probando conexión...', true);
    try {
      const r = await ghCall('test');
      renderGhTokenState(r.token_configured);
      const host = document.getElementById('cfg-gh-status');
      host.innerHTML = '';
      const line = (txt, ok) => {
        const p = document.createElement('p');
        p.className = ok ? 'text-green-400' : 'text-red-400';
        p.textContent = txt;
        host.appendChild(p);
      };
      if (r.success) {
        line('✓ Conexión OK con ' + (r.repo || ''), true);
        if (r.pages && r.pages.url) line('✓ Pages activo: ' + r.pages.url, true);
        else if (r.pages_note) line('! ' + r.pages_note, false);
      } else {
        line('✗ ' + (r.message || 'Sin conexión'), false);
        (r.setup || []).forEach(step => {
          const li = document.createElement('p');
          li.className = 'text-gray-400 text-xs ml-4';
          li.textContent = '• ' + step;
          host.appendChild(li);
        });
      }
    } catch (e) {
      ghText('✗ Error de red: ' + e.message, false);
    }
  }

  async function ghPublish() {
    if (!confirm('¿Publicar datos y diseño actuales en GitHub Pages?')) return;
    if (!(await ensureTokenSaved())) return;
    ghText('1/2 Publicando datos en el servidor local...', true);
    try {
      await cfg().publishAll(); // data.json + theme.json vía publish.php
    } catch (e) {
      ghText('✗ Falló la publicación local: ' + e.message, false);
      return;
    }
    ghText('2/2 Subiendo a GitHub...', true);
    try {
      const r = await ghCall('publish');
      const host = document.getElementById('cfg-gh-status');
      host.innerHTML = '';
      const p = document.createElement('p');
      if (r.success) {
        p.className = 'text-green-400';
        p.textContent = '✓ ' + (r.message || 'Publicado.');
        host.appendChild(p);
        if (r.commit_url) {
          const a = document.createElement('a');
          a.href = r.commit_url;
          a.target = '_blank';
          a.rel = 'noopener noreferrer';
          a.className = 'text-indigo-400 underline text-xs';
          a.textContent = 'Ver commit en GitHub';
          host.appendChild(a);
        }
        const st = cfg().getSettings();
        st.github.lastDeploy = r.deployed_at || Date.now();
        await cfg().saveSettings();
        renderGhLast();
      } else {
        p.className = 'text-red-400';
        p.textContent = '✗ ' + (r.message || 'Error al publicar.');
        host.appendChild(p);
        (r.setup || []).forEach(step => {
          const li = document.createElement('p');
          li.className = 'text-gray-400 text-xs ml-4';
          li.textContent = '• ' + step;
          host.appendChild(li);
        });
      }
    } catch (e) {
      ghText('✗ Error de red: ' + e.message, false);
    }
  }

  function renderGhLast() {
    const el = document.getElementById('cfg-gh-last');
    if (!el || !cfg()) return;
    const last = cfg().getSettings().github.lastDeploy;
    el.textContent = last
      ? 'Último despliegue: ' + new Date(last * 1000).toLocaleString()
      : 'Aún no se ha desplegado a GitHub desde aquí.';
  }

  async function render() {
    const host = document.getElementById('configPanel');
    if (!host) return;
    if (!cfg()) {
      host.innerHTML = '<p class="text-red-400 text-center py-12">Configuración no disponible (app.js no cargó correctamente).</p>';
      return;
    }
    const s = cfg().getSettings();

    host.innerHTML =
      '<div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">' +
        '<div><h3 class="text-2xl font-bold">Configuración del sitio</h3>' +
        '<p class="text-gray-400 text-sm">Ajustes globales de diseño e inteligencia artificial. Se guardan en este navegador.</p></div>' +
        '<div class="flex flex-wrap gap-2">' +
          '<button id="cfg-save" class="btn btn-primary"><i class="fas fa-save mr-2"></i>Guardar cambios</button>' +
          '<button id="cfg-reset" class="btn btn-secondary" title="Volver a los valores de fábrica"><i class="fas fa-undo mr-2"></i>Restablecer</button>' +
        '</div>' +
      '</div>' +

      sectionCard('General', 'fa-sliders-h',
        textRow('cfg-siteName', 'Nombre del sitio', s.general.siteName, 'Aparece en la barra lateral y en el título de la pestaña.') +
        '<div class="grid grid-cols-1 md:grid-cols-2 gap-4">' +
        numRow('cfg-featured', 'Destacados por categoría', s.general.featuredCount, 1, 12, 'Tarjetas aleatorias en el Dashboard.') +
        numRow('cfg-gallery', 'Imágenes en galería rápida', s.general.galleryCount, 1, 16, 'Últimas imágenes del Dashboard.') +
        '</div>') +

      sectionCard('Diseño y apariencia', 'fa-palette',
        '<div class="grid grid-cols-1 md:grid-cols-2 gap-x-8">' +
        colorRow('cfg-accent', 'Color principal (acento)', s.theme.accent) +
        colorRow('cfg-accentHover', 'Acento al pasar el ratón', s.theme.accentHover) +
        colorRow('cfg-bg', 'Fondo de la app', s.theme.bg) +
        colorRow('cfg-surface', 'Superficie (tarjetas, sidebar)', s.theme.surface) +
        colorRow('cfg-surface2', 'Superficie secundaria (inputs, botones)', s.theme.surface2) +
        colorRow('cfg-text', 'Texto principal', s.theme.text) +
        colorRow('cfg-muted', 'Texto apagado', s.theme.muted) +
        colorRow('cfg-btnText', 'Texto de botones principales', s.theme.btnText) +
        colorRow('cfg-btnSecondaryText', 'Texto de botones secundarios', s.theme.btnSecondaryText) +
        '</div>' +
        '<div class="flex flex-col py-2"><label for="cfg-font" class="font-medium mb-1">Tipografía</label>' +
        '<select id="cfg-font" class="w-full bg-[#242424] border border-gray-600 rounded-lg px-3 py-2">' +
          ['Inter', 'system-ui', 'Georgia, serif', '"Courier New", monospace'].map(f =>
            '<option value="' + esc(f) + '"' + (s.theme.font === f ? ' selected' : '') + '>' + esc(f) + '</option>').join('') +
        '</select></div>' +
        '<button id="cfg-reset-theme" class="btn btn-secondary text-sm mt-2"><i class="fas fa-undo mr-2"></i>Restablecer solo diseño</button>') +

      sectionCard('Inteligencia artificial', 'fa-robot',
        checkRow('cfg-ai-enabled', 'Activar generación con IA', s.ai.enabled, 'Si se desactiva, se ocultan todos los botones de generación.') +
        '<p class="text-xs text-gray-500 mb-3">Elige un proveedor gratuito por tarea. Las API keys solo se guardan en este navegador (IndexedDB) y nunca se publican.</p>' +
        '<div class="space-y-4">' +
          providerCard('cover', 'Portadas del proyecto', s.ai.providers.cover, cfg().providers()) +
          providerCard('image', 'Imágenes de capítulos, personajes y objetos', s.ai.providers.image, cfg().providers()) +
          providerCard('map', 'Mapas de lugares', s.ai.providers.map, cfg().providers()) +
        '</div>' +
        textRow('cfg-ai-suffix', 'Sufijo global de prompt', s.ai.globalSuffix, 'Se añade a todos los prompts. Ej: masterpiece, 8k.') +
        checkRow('cfg-ai-random', 'Variación aleatoria anti-caché', s.ai.randomVariation, 'Añade seed/variation para no repetir imágenes.') +
        '<div class="grid grid-cols-1 md:grid-cols-3 gap-4">' +
        numRow('cfg-ai-coverWords', 'Palabras del resumen (portadas)', s.ai.coverWords, 5, 200) +
        numRow('cfg-ai-itemWords', 'Palabras de descripción (ítems)', s.ai.itemWords, 5, 200) +
        numRow('cfg-ai-mapWords', 'Palabras por campo (mapas)', s.ai.mapWords, 5, 200) +
        '</div>' +
        styleEditor('image', 'Estilos de imagen (personajes, objetos, capítulos)', 'Desactiva los que no uses o edita su prompt. Etiqueta = texto del desplegable.', s.ai.styles.image) +
        styleEditor('cover', 'Estilos de portada', 'Prompts base para el generador de portadas del proyecto.', s.ai.styles.cover) +
        styleEditor('map', 'Estilos de mapa', 'Prompts base para el generador de mapas de lugares.', s.ai.styles.map) +
        '<button id="cfg-reset-ai" class="btn btn-secondary text-sm mt-4"><i class="fas fa-undo mr-2"></i>Restablecer solo IA</button>') +

      sectionCard('Datos y respaldo', 'fa-database',
        '<p id="cfg-storage" class="text-sm text-gray-400 mb-3">Calculando uso de almacenamiento...</p>' +
        '<div class="flex flex-wrap gap-2">' +
          '<button id="cfg-export" class="btn btn-secondary text-sm"><i class="fas fa-download mr-2"></i>Exportar ajustes (JSON)</button>' +
          '<label class="btn btn-secondary text-sm cursor-pointer"><i class="fas fa-upload mr-2"></i>Importar ajustes<input type="file" id="cfg-import" accept="application/json" class="hidden"></label>' +
        '</div>' +
        '<p class="text-xs text-gray-500 mt-3">Los proyectos se siguen respaldando con Exportar a JSON desde la barra lateral.</p>') +

      sectionCard('Publicación en GitHub Pages', 'fa-rocket',
        '<p class="text-sm text-gray-400 mb-3">Publica <code>data.json</code> y <code>theme.json</code> en tu repositorio. GitHub Pages reconstruye la página pública en 1-3 minutos. El token vive solo en el servidor (.env) y nunca se expone al navegador.</p>' +
        '<p class="text-sm text-gray-400 mb-3">El archivo <code>Xlerion-Total-Darkness.html</code> debe existir una vez en el repo (súbelo con git); aquí solo se actualizan los datos y el diseño.</p>' +
        '<div class="grid grid-cols-1 md:grid-cols-2 gap-4">' +
        textRow('cfg-gh-repo', 'Repositorio (propietario/repo)', s.github.repo, 'Ej: miguelxlerion/TotalDarkness') +
        textRow('cfg-gh-branch', 'Rama', s.github.branch, 'Normalmente main o master') +
        '</div>' +
        '<div class="p-4 bg-gray-900/50 rounded-lg border border-gray-700 space-y-2 mb-3">' +
          '<label for="cfg-gh-token" class="font-medium">Token de GitHub <span id="cfg-gh-token-state" class="text-xs text-gray-500"></span></label>' +
          '<div class="flex flex-col md:flex-row gap-2">' +
            '<input type="password" id="cfg-gh-token" placeholder="Pega aquí tu token (solo se guarda en el servidor)" autocomplete="off" class="flex-grow text-sm">' +
            '<button id="cfg-gh-token-save" class="btn btn-secondary text-sm whitespace-nowrap"><i class="fas fa-key mr-2"></i>Guardar token</button>' +
          '</div>' +
          '<p class="text-xs text-gray-500">Token classic con permiso “repo”. Se guarda en el .env del servidor y nunca se muestra ni se publica. Déjalo vacío y guarda para eliminarlo.</p>' +
        '</div>' +
        '<p id="cfg-gh-last" class="text-xs text-gray-500 mb-3"></p>' +
        '<div id="cfg-gh-status" class="text-sm mb-3"></div>' +
        '<div class="flex flex-wrap gap-2">' +
          '<button id="cfg-gh-test" class="btn btn-secondary text-sm"><i class="fas fa-plug mr-2"></i>Probar conexión</button>' +
          '<button id="cfg-gh-publish" class="btn btn-primary text-sm"><i class="fas fa-cloud-upload-alt mr-2"></i>Publicar en GitHub</button>' +
        '</div>');

    // --- Binds ---
    document.getElementById('cfg-save').onclick = () => onSave(false);
    ['cover', 'image', 'map'].forEach(task => {
      const sel = document.getElementById('cfg-prov-' + task);
      if (sel) sel.onchange = () => refreshProviderFields(task);
      refreshProviderFields(task);
    });
    host.querySelectorAll('[data-test]').forEach(btn => {
      btn.onclick = () => testProvider(btn.getAttribute('data-test'));
    });
    document.getElementById('cfg-gh-test').onclick = ghTest;
    document.getElementById('cfg-gh-publish').onclick = ghPublish;
    document.getElementById('cfg-gh-token-save').onclick = ghSaveToken;
    renderGhTokenState(null);
    renderGhLast();
    // Estado real del token al abrir (barato, sin llamar a GitHub)
    fetch('deploy.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'token_status' })
    }).then(r => r.json()).then(r => {
      if (r && typeof r.token_configured === 'boolean') renderGhTokenState(r.token_configured);
    }).catch(() => {});
    document.getElementById('cfg-reset').onclick = async () => {
      if (!confirm('¿Restablecer TODA la configuración a los valores de fábrica?')) return;
      cfg().resetSettings();
      await cfg().saveSettings();
      toast('Configuración restablecida.');
      render();
    };
    document.getElementById('cfg-reset-theme').onclick = async () => {
      const st = cfg().getSettings();
      st.theme = cfg().defaults().theme;
      await cfg().saveSettings();
      toast('Diseño restablecido.');
      render();
    };
    document.getElementById('cfg-reset-ai').onclick = async () => {
      const st = cfg().getSettings();
      st.ai = cfg().defaults().ai;
      await cfg().saveSettings();
      toast('Ajustes de IA restablecidos.');
      render();
    };
    document.getElementById('cfg-export').onclick = () => {
      const blob = new Blob([JSON.stringify(cfg().getSettings(), null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'xlerion-settings.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(a.href);
    };
    document.getElementById('cfg-import').onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = async (ev) => {
        try {
          const obj = JSON.parse(ev.target.result);
          cfg().importSettings(obj);
          await cfg().saveSettings();
          toast('Ajustes importados.');
          render();
        } catch (err) {
          toast('Archivo inválido: ' + err.message, true);
        }
      };
      reader.readAsText(file);
    };

    // Info de almacenamiento (progresivo, puede no estar disponible)
    try {
      if (navigator.storage && navigator.storage.estimate) {
        const est = await navigator.storage.estimate();
        const mb = (b) => (b / 1048576).toFixed(1) + ' MB';
        const el = document.getElementById('cfg-storage');
        if (el) el.textContent = 'Almacenamiento local usado: ' + mb(est.usage || 0) +
          (est.quota ? ' de ' + mb(est.quota) + ' disponibles.' : '.');
      }
    } catch (e) { /* opcional */ }
  }

  async function onSave(silent) {
    const st = cfg().getSettings();
    const catalog = cfg().providers();
    st.general.siteName = val('cfg-siteName').trim().slice(0, 80) || cfg().defaults().general.siteName;
    st.general.featuredCount = num('cfg-featured', 1, 12, 6);
    st.general.galleryCount = num('cfg-gallery', 1, 16, 8);
    ['accent', 'accentHover', 'bg', 'surface', 'surface2', 'text', 'muted', 'btnText', 'btnSecondaryText'].forEach(k => {
      const v = document.getElementById('cfg-' + k).value;
      if (/^#[0-9a-fA-F]{6}$/.test(v)) st.theme[k] = v;
    });
    st.theme.font = val('cfg-font').slice(0, 60) || 'Inter';
    st.ai.enabled = checked('cfg-ai-enabled');
    ['cover', 'image', 'map'].forEach(task => {
      const sel = val('cfg-prov-' + task);
      const p = st.ai.providers[task] || {};
      p.provider = catalog[sel] ? sel : 'pollinations';
      p.key = val('cfg-key-' + task).slice(0, 300);
      p.model = val('cfg-model-' + task).trim().slice(0, 200);
      p.endpoint = val('cfg-endpoint-' + task).trim().slice(0, 500);
      p.params = val('cfg-params-' + task).trim().slice(0, 500);
      st.ai.providers[task] = p;
    });
    st.ai.globalSuffix = val('cfg-ai-suffix').trim().slice(0, 500);
    st.ai.randomVariation = checked('cfg-ai-random');
    st.ai.coverWords = num('cfg-ai-coverWords', 5, 200, 40);
    st.ai.itemWords = num('cfg-ai-itemWords', 5, 200, 15);
    st.ai.mapWords = num('cfg-ai-mapWords', 5, 200, 8);
    st.ai.styles.image = collectStyles('image');
    st.ai.styles.cover = collectStyles('cover');
    st.ai.styles.map = collectStyles('map');
    const repo = val('cfg-gh-repo').trim();
    if (/^[\w.-]+\/[\w.-]+$/.test(repo)) st.github.repo = repo.slice(0, 120);
    const branch = val('cfg-gh-branch').trim();
    if (/^[\w./-]+$/.test(branch)) st.github.branch = branch.slice(0, 80);

    await cfg().saveSettings();
    if (!silent) {
      toast('Configuración guardada y aplicada.');
      render();
    }
  }

  window.xlerionConfigPanel = { render };
})();
