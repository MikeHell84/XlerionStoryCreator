// ==========================
// script.js corregido completo
// ==========================
// Incluye todas las funciones principales y las correcciones de event.stopPropagation

// Estado de la aplicación
const estadoDeLaApp = {
  proyectos: [],
  indiceProyectoActual: -1,
  itemSeleccionadoActual: null,
  capituloSeleccionadoActual: null,
  pestanaActual: 'dashboard'
};

// Referencias a los elementos del DOM
const elementosDelDOM = {
  listaDeProyectos: document.getElementById('projectList'),
  btnNuevoProyecto: document.getElementById('newProjectBtn'),
  tituloProyectoActual: document.getElementById('currentProjectTitle'),

  // Personajes
  listaDePersonajes: document.getElementById('characterList'),
  btnAgregarPersonaje: document.getElementById('addCharacterBtn'),
  modalPersonaje: document.getElementById('characterModal'),
  characterIdInput: document.getElementById('characterId'),
  characterNameInput: document.getElementById('characterName'),
  characterDescriptionInput: document.getElementById('characterDescription'),
  characterImageUrlInput: document.getElementById('characterImageUrl'),
  characterTraitsInput: document.getElementById('characterTraits'),
  characterModalTitle: document.getElementById('characterModalTitle'),

  // Lugares
  listaDeLugares: document.getElementById('placeList'),
  btnAgregarLugar: document.getElementById('addPlaceBtn'),
  modalLugar: document.getElementById('placeModal'),
  placeIdInput: document.getElementById('placeId'),
  placeNameInput: document.getElementById('placeName'),
  placeDescriptionInput: document.getElementById('placeDescription'),
  placeImageUrlInput: document.getElementById('placeImageUrl'),
  placeModalTitle: document.getElementById('placeModalTitle'),

  // Ítems
  listaDeItems: document.getElementById('itemList'),
  btnAgregarItem: document.getElementById('addItemBtn'),
  modalItem: document.getElementById('itemModal'),
  itemIdInput: document.getElementById('itemId'),
  itemNameInput: document.getElementById('itemName'),
  itemDescriptionInput: document.getElementById('itemDescription'),
  itemImageUrlInput: document.getElementById('itemImageUrl'),
  itemModalTitle: document.getElementById('itemModalTitle'),
  vistaPreviaImagenItem: document.getElementById('itemImagePreview'),
  placeholderImagenItem: document.getElementById('itemImagePlaceholder'),

  // Capítulos
  listaDeCapitulos: document.getElementById('chapterList'),
  btnAgregarCapitulo: document.getElementById('addChapterBtn'),
  modalCapitulo: document.getElementById('chapterModal'),
  chapterIdInput: document.getElementById('chapterId'),
  chapterTitleInput: document.getElementById('chapterTitle'),
  chapterSummaryInput: document.getElementById('chapterSummary'),
  chapterContentInput: document.getElementById('chapterContent'),
  chapterModalTitle: document.getElementById('chapterModalTitle'),

  // Modal de detalles
  modalDetalles: document.getElementById('detailsModal'),
  cuerpoModalDetalles: document.getElementById('detailsBody'),

  // Botones de cierre de modal
  btnCerrarModalPersonaje: document.getElementById('closeCharacterModal'),
  btnCerrarModalLugar: document.getElementById('closePlaceModal'),
  btnCerrarModalItem: document.getElementById('closeItemModal'),
  btnCerrarModalCapitulo: document.getElementById('closeChapterModal'),
  btnCerrarModalDetalles: document.getElementById('closeDetailsModal'),
  btnCerrarToast: document.getElementById('closeToast'),

  // Formularios
  formularioPersonaje: document.getElementById('characterForm'),
  formularioLugar: document.getElementById('placeForm'),
  formularioItem: document.getElementById('itemForm'),
  formularioCapitulo: document.getElementById('chapterForm'),

  // Dashboard
  contenedorDashboard: document.getElementById('dashboard-container'),
  contenedorHistorias: document.getElementById('historias-container'),
  contenedorCapitulos: document.getElementById('chapters-container'),
  contenedorPersonajes: document.getElementById('characters-container'),
  contenedorLugares: document.getElementById('places-container'),
  contenedorItems: document.getElementById('items-container'),
  contenedorDetalles: document.getElementById('details-container'),

  // Botones de vista
  btnDashboard: document.getElementById('dashboardBtn'),
  btnHistorias: document.getElementById('storiesBtn'),
  btnCapitulos: document.getElementById('chaptersBtn'),
  btnPersonajes: document.getElementById('charactersBtn'),
  btnLugares: document.getElementById('placesBtn'),
  btnItems: document.getElementById('itemsBtn'),

  // Contenedor principal de la vista
  vistaContenedorPrincipal: document.getElementById('main-content-view'),
  
  // Nodos del mindmap
  mindmapCanvas: document.getElementById('mindmapCanvas'),
  contextMenu: document.getElementById('contextMenu'),
  nodeTypeSelect: document.getElementById('nodeType'),

  // Otras
  menuUsuario: document.getElementById('userMenuBtn'),
  contenedorToast: document.getElementById('toast-notification'),
  mensajeToast: document.getElementById('toast-message'),
  btnExportarMenu: document.getElementById('exportMenuBtn'),
  menuExportar: document.getElementById('exportMenu'),
  exportarComoHTML: document.getElementById('exportHtmlBtn'),
  exportarComoJSON: document.getElementById('exportJsonBtn'),
  importarJSON: document.getElementById('importJsonBtn'),
  inputImportarJSON: document.getElementById('importJsonInput'),
};


// Funciones de utilidad
function mostrarToast(mensaje) {
  elementosDelDOM.mensajeToast.textContent = mensaje;
  elementosDelDOM.contenedorToast.classList.remove('hidden');
  setTimeout(() => {
    elementosDelDOM.contenedorToast.classList.add('hidden');
  }, 3000);
}

function generarID() {
  return 'id-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

function cambiarAVista(vista) {
  const vistas = ['dashboard', 'historias', 'capitulos', 'personajes', 'lugares', 'items', 'detalles'];
  vistas.forEach(v => {
    const contenedor = elementosDelDOM[`contenedor${v.charAt(0).toUpperCase() + v.slice(1)}`];
    if (contenedor) {
      if (v === vista) {
        contenedor.classList.remove('hidden');
      } else {
        contenedor.classList.add('hidden');
      }
    }
  });

  // Manejar el estado activo del menú
  const botones = [elementosDelDOM.btnDashboard, elementosDelDOM.btnHistorias, elementosDelDOM.btnCapitulos, elementosDelDOM.btnPersonajes, elementosDelDOM.btnLugares, elementosDelDOM.btnItems];
  botones.forEach(btn => {
    if (btn) {
      btn.classList.remove('bg-blue-600', 'text-white');
    }
  });
  const botonActivo = elementosDelDOM[`btn${vista.charAt(0).toUpperCase() + vista.slice(1)}`];
  if (botonActivo) {
    botonActivo.classList.add('bg-blue-600', 'text-white');
  }

  estadoDeLaApp.pestanaActual = vista;
}

// ==========================
// Lógica de Capítulos
// ==========================
function agregarCapitulo() {
  estadoDeLaApp.capituloSeleccionadoActual = null;
  elementosDelDOM.chapterIdInput.value = '';
  elementosDelDOM.chapterTitleInput.value = '';
  elementosDelDOM.chapterSummaryInput.value = '';
  elementosDelDOM.chapterContentInput.value = '';
  elementosDelDOM.chapterModalTitle.textContent = 'Agregar Capítulo';
  elementosDelDOM.modalCapitulo.classList.remove('hidden');
}

function guardarCapitulo(e) {
  e.preventDefault();
  const proyecto = estadoDeLaApp.proyectos[estadoDeLaApp.indiceProyectoActual];
  const id = elementosDelDOM.chapterIdInput.value || generarID();
  const titulo = elementosDelDOM.chapterTitleInput.value;
  const resumen = elementosDelDOM.chapterSummaryInput.value;
  const contenido = elementosDelDOM.chapterContentInput.value;

  const nuevoCapitulo = {
    id,
    titulo,
    resumen,
    contenido
  };

  if (estadoDeLaApp.capituloSeleccionadoActual) {
    const index = proyecto.capitulos.findIndex(c => c.id === id);
    if (index !== -1) {
      proyecto.capitulos[index] = nuevoCapitulo;
    }
    mostrarToast('Capítulo actualizado con éxito.');
  } else {
    proyecto.capitulos.push(nuevoCapitulo);
    mostrarToast('Capítulo agregado con éxito.');
  }

  guardarEstado();
  renderizarCapitulos();
  elementosDelDOM.modalCapitulo.classList.add('hidden');
}

// Función corregida: ahora recibe el evento y el ID correctamente desde el HTML del botón de edición.
function editarCapitulo(event, id) {
  if (event) event.stopPropagation();
  const proyecto = estadoDeLaApp.proyectos[estadoDeLaApp.indiceProyectoActual];
  const capitulo = proyecto.capitulos.find(c => c.id === id);
  if (!capitulo) return;

  estadoDeLaApp.capituloSeleccionadoActual = capitulo;
  elementosDelDOM.chapterIdInput.value = capitulo.id;
  elementosDelDOM.chapterTitleInput.value = capitulo.titulo;
  elementosDelDOM.chapterSummaryInput.value = capitulo.resumen;
  elementosDelDOM.chapterContentInput.value = capitulo.contenido;
  elementosDelDOM.chapterModalTitle.textContent = 'Editar Capítulo';
  elementosDelDOM.modalCapitulo.classList.remove('hidden');
}

function eliminarCapitulo(event, id) {
  if (event) event.stopPropagation();
  const proyecto = estadoDeLaApp.proyectos[estadoDeLaApp.indiceProyectoActual];
  proyecto.capitulos = proyecto.capitulos.filter(c => c.id !== id);
  guardarEstado();
  renderizarCapitulos();
  mostrarToast('Capítulo eliminado.');
}

function renderizarCapitulos() {
  const proyecto = estadoDeLaApp.proyectos[estadoDeLaApp.indiceProyectoActual];
  elementosDelDOM.listaDeCapitulos.innerHTML = '';
  if (!proyecto || !proyecto.capitulos || proyecto.capitulos.length === 0) {
    elementosDelDOM.listaDeCapitulos.innerHTML = '<p class="text-gray-400">No hay capítulos agregados.</p>';
    return;
  }
  proyecto.capitulos.forEach(capitulo => {
    const html = `
      <div class="bg-gray-800 p-4 rounded-lg shadow-md flex justify-between items-start mb-4">
        <div onclick="verDetalles(event, '${capitulo.id}', 'capitulo')" class="flex-grow cursor-pointer">
          <h3 class="text-xl font-semibold text-blue-400 mb-2">${capitulo.titulo}</h3>
          <p class="text-gray-400">${capitulo.resumen}</p>
        </div>
        <div class="flex-shrink-0 flex items-center space-x-2 ml-4">
          <button onclick="editarCapitulo(event, '${capitulo.id}')" class="text-gray-400 hover:text-blue-400 transition-colors">
            <i class="fas fa-edit"></i>
          </button>
          <button onclick="eliminarCapitulo(event, '${capitulo.id}')" class="text-gray-400 hover:text-red-400 transition-colors">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      </div>
    `;
    elementosDelDOM.listaDeCapitulos.insertAdjacentHTML('beforeend', html);
  });
}

// ==========================
// Lógica de Personajes
// ==========================
function agregarPersonaje() {
  estadoDeLaApp.itemSeleccionadoActual = null;
  elementosDelDOM.characterIdInput.value = '';
  elementosDelDOM.characterNameInput.value = '';
  elementosDelDOM.characterDescriptionInput.value = '';
  elementosDelDOM.characterImageUrlInput.value = '';
  elementosDelDOM.characterTraitsInput.value = '';
  elementosDelDOM.characterModalTitle.textContent = 'Agregar Personaje';
  elementosDelDOM.modalPersonaje.classList.remove('hidden');
}

function guardarPersonaje(e) {
  e.preventDefault();
  const proyecto = estadoDeLaApp.proyectos[estadoDeLaApp.indiceProyectoActual];
  const id = elementosDelDOM.characterIdInput.value || generarID();
  const nombre = elementosDelDOM.characterNameInput.value;
  const descripcion = elementosDelDOM.characterDescriptionInput.value;
  const imagenUrl = elementosDelDOM.characterImageUrlInput.value;
  const rasgos = elementosDelDOM.characterTraitsInput.value;

  const nuevoPersonaje = {
    id,
    nombre,
    descripcion,
    imagenUrl,
    rasgos
  };

  if (estadoDeLaApp.itemSeleccionadoActual) {
    const index = proyecto.personajes.findIndex(p => p.id === id);
    if (index !== -1) {
      proyecto.personajes[index] = nuevoPersonaje;
    }
    mostrarToast('Personaje actualizado con éxito.');
  } else {
    proyecto.personajes.push(nuevoPersonaje);
    mostrarToast('Personaje agregado con éxito.');
  }

  guardarEstado();
  renderizarPersonajes();
  elementosDelDOM.modalPersonaje.classList.add('hidden');
}

function editarPersonaje(event, id) {
  if (event) event.stopPropagation();
  const proyecto = estadoDeLaApp.proyectos[estadoDeLaApp.indiceProyectoActual];
  const personaje = proyecto.personajes.find(p => p.id === id);
  if (!personaje) return;

  estadoDeLaApp.itemSeleccionadoActual = personaje;
  elementosDelDOM.characterIdInput.value = personaje.id;
  elementosDelDOM.characterNameInput.value = personaje.nombre;
  elementosDelDOM.characterDescriptionInput.value = personaje.descripcion;
  elementosDelDOM.characterImageUrlInput.value = personaje.imagenUrl;
  elementosDelDOM.characterTraitsInput.value = personaje.rasgos;
  elementosDelDOM.characterModalTitle.textContent = 'Editar Personaje';
  elementosDelDOM.modalPersonaje.classList.remove('hidden');
}

function eliminarPersonaje(event, id) {
  if (event) event.stopPropagation();
  const proyecto = estadoDeLaApp.proyectos[estadoDeLaApp.indiceProyectoActual];
  proyecto.personajes = proyecto.personajes.filter(p => p.id !== id);
  guardarEstado();
  renderizarPersonajes();
  mostrarToast('Personaje eliminado.');
}

function renderizarPersonajes() {
  const proyecto = estadoDeLaApp.proyectos[estadoDeLaApp.indiceProyectoActual];
  elementosDelDOM.listaDePersonajes.innerHTML = '';
  if (!proyecto || !proyecto.personajes || proyecto.personajes.length === 0) {
    elementosDelDOM.listaDePersonajes.innerHTML = '<p class="text-gray-400">No hay personajes agregados.</p>';
    return;
  }
  proyecto.personajes.forEach(personaje => {
    const html = `
      <div class="bg-gray-800 p-4 rounded-lg shadow-md flex justify-between items-start mb-4">
        <div onclick="verDetalles(event, '${personaje.id}', 'personaje')" class="flex-grow cursor-pointer">
          <h3 class="text-xl font-semibold text-blue-400 mb-2">${personaje.nombre}</h3>
          <p class="text-gray-400">${personaje.descripcion}</p>
        </div>
        <div class="flex-shrink-0 flex items-center space-x-2 ml-4">
          <button onclick="editarPersonaje(event, '${personaje.id}')" class="text-gray-400 hover:text-blue-400 transition-colors">
            <i class="fas fa-edit"></i>
          </button>
          <button onclick="eliminarPersonaje(event, '${personaje.id}')" class="text-gray-400 hover:text-red-400 transition-colors">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      </div>
    `;
    elementosDelDOM.listaDePersonajes.insertAdjacentHTML('beforeend', html);
  });
}

// ==========================
// Lógica de Lugares
// ==========================
function agregarLugar() {
  estadoDeLaApp.itemSeleccionadoActual = null;
  elementosDelDOM.placeIdInput.value = '';
  elementosDelDOM.placeNameInput.value = '';
  elementosDelDOM.placeDescriptionInput.value = '';
  elementosDelDOM.placeImageUrlInput.value = '';
  elementosDelDOM.placeModalTitle.textContent = 'Agregar Lugar';
  elementosDelDOM.modalLugar.classList.remove('hidden');
}

function guardarLugar(e) {
  e.preventDefault();
  const proyecto = estadoDeLaApp.proyectos[estadoDeLaApp.indiceProyectoActual];
  const id = elementosDelDOM.placeIdInput.value || generarID();
  const nombre = elementosDelDOM.placeNameInput.value;
  const descripcion = elementosDelDOM.placeDescriptionInput.value;
  const imagenUrl = elementosDelDOM.placeImageUrlInput.value;

  const nuevoLugar = {
    id,
    nombre,
    descripcion,
    imagenUrl
  };

  if (estadoDeLaApp.itemSeleccionadoActual) {
    const index = proyecto.lugares.findIndex(l => l.id === id);
    if (index !== -1) {
      proyecto.lugares[index] = nuevoLugar;
    }
    mostrarToast('Lugar actualizado con éxito.');
  } else {
    proyecto.lugares.push(nuevoLugar);
    mostrarToast('Lugar agregado con éxito.');
  }

  guardarEstado();
  renderizarLugares();
  elementosDelDOM.modalLugar.classList.add('hidden');
}

function editarLugar(event, id) {
  if (event) event.stopPropagation();
  const proyecto = estadoDeLaApp.proyectos[estadoDeLaApp.indiceProyectoActual];
  const lugar = proyecto.lugares.find(l => l.id === id);
  if (!lugar) return;

  estadoDeLaApp.itemSeleccionadoActual = lugar;
  elementosDelDOM.placeIdInput.value = lugar.id;
  elementosDelDOM.placeNameInput.value = lugar.nombre;
  elementosDelDOM.placeDescriptionInput.value = lugar.descripcion;
  elementosDelDOM.placeImageUrlInput.value = lugar.imagenUrl;
  elementosDelDOM.placeModalTitle.textContent = 'Editar Lugar';
  elementosDelDOM.modalLugar.classList.remove('hidden');
}

function eliminarLugar(event, id) {
  if (event) event.stopPropagation();
  const proyecto = estadoDeLaApp.proyectos[estadoDeLaApp.indiceProyectoActual];
  proyecto.lugares = proyecto.lugares.filter(l => l.id !== id);
  guardarEstado();
  renderizarLugares();
  mostrarToast('Lugar eliminado.');
}

function renderizarLugares() {
  const proyecto = estadoDeLaApp.proyectos[estadoDeLaApp.indiceProyectoActual];
  elementosDelDOM.listaDeLugares.innerHTML = '';
  if (!proyecto || !proyecto.lugares || proyecto.lugares.length === 0) {
    elementosDelDOM.listaDeLugares.innerHTML = '<p class="text-gray-400">No hay lugares agregados.</p>';
    return;
  }
  proyecto.lugares.forEach(lugar => {
    const html = `
      <div class="bg-gray-800 p-4 rounded-lg shadow-md flex justify-between items-start mb-4">
        <div onclick="verDetalles(event, '${lugar.id}', 'lugar')" class="flex-grow cursor-pointer">
          <h3 class="text-xl font-semibold text-blue-400 mb-2">${lugar.nombre}</h3>
          <p class="text-gray-400">${lugar.descripcion}</p>
        </div>
        <div class="flex-shrink-0 flex items-center space-x-2 ml-4">
          <button onclick="editarLugar(event, '${lugar.id}')" class="text-gray-400 hover:text-blue-400 transition-colors">
            <i class="fas fa-edit"></i>
          </button>
          <button onclick="eliminarLugar(event, '${lugar.id}')" class="text-gray-400 hover:text-red-400 transition-colors">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      </div>
    `;
    elementosDelDOM.listaDeLugares.insertAdjacentHTML('beforeend', html);
  });
}

// ==========================
// Lógica de Items
// ==========================
function agregarItem() {
  estadoDeLaApp.itemSeleccionadoActual = null;
  elementosDelDOM.itemIdInput.value = '';
  elementosDelDOM.itemNameInput.value = '';
  elementosDelDOM.itemDescriptionInput.value = '';
  elementosDelDOM.itemImageUrlInput.value = '';
  elementosDelDOM.itemModalTitle.textContent = 'Agregar Objeto';
  elementosDelDOM.vistaPreviaImagenItem.classList.add('hidden');
  elementosDelDOM.placeholderImagenItem.classList.remove('hidden');
  elementosDelDOM.modalItem.classList.remove('hidden');
}

function guardarItem(e) {
  e.preventDefault();
  const proyecto = estadoDeLaApp.proyectos[estadoDeLaApp.indiceProyectoActual];
  const id = elementosDelDOM.itemIdInput.value || generarID();
  const nombre = elementosDelDOM.itemNameInput.value;
  const descripcion = elementosDelDOM.itemDescriptionInput.value;
  const imagenUrl = elementosDelDOM.itemImageUrlInput.value;

  const nuevoItem = {
    id,
    nombre,
    descripcion,
    imagenUrl
  };

  if (estadoDeLaApp.itemSeleccionadoActual) {
    const index = proyecto.items.findIndex(i => i.id === id);
    if (index !== -1) {
      proyecto.items[index] = nuevoItem;
    }
    mostrarToast('Objeto actualizado con éxito.');
  } else {
    proyecto.items.push(nuevoItem);
    mostrarToast('Objeto agregado con éxito.');
  }

  guardarEstado();
  renderizarItems();
  elementosDelDOM.modalItem.classList.add('hidden');
}

function editarItem(event, id) {
  if (event) event.stopPropagation();
  const proyecto = estadoDeLaApp.proyectos[estadoDeLaApp.indiceProyectoActual];
  const item = proyecto.items.find(i => i.id === id);
  if (!item) return;

  estadoDeLaApp.itemSeleccionadoActual = item;
  elementosDelDOM.itemIdInput.value = item.id;
  elementosDelDOM.itemNameInput.value = item.nombre;
  elementosDelDOM.itemDescriptionInput.value = item.descripcion;
  elementosDelDOM.itemImageUrlInput.value = item.imagenUrl;
  elementosDelDOM.itemModalTitle.textContent = 'Editar Objeto';

  if (item.imagenUrl) {
    elementosDelDOM.vistaPreviaImagenItem.src = item.imagenUrl;
    elementosDelDOM.vistaPreviaImagenItem.classList.remove('hidden');
    elementosDelDOM.placeholderImagenItem.classList.add('hidden');
  } else {
    elementosDelDOM.vistaPreviaImagenItem.classList.add('hidden');
    elementosDelDOM.placeholderImagenItem.classList.remove('hidden');
  }

  elementosDelDOM.modalItem.classList.remove('hidden');
}

function eliminarItem(event, id) {
  if (event) event.stopPropagation();
  const proyecto = estadoDeLaApp.proyectos[estadoDeLaApp.indiceProyectoActual];
  proyecto.items = proyecto.items.filter(i => i.id !== id);
  guardarEstado();
  renderizarItems();
  mostrarToast('Objeto eliminado.');
}

function renderizarItems() {
  const proyecto = estadoDeLaApp.proyectos[estadoDeLaApp.indiceProyectoActual];
  elementosDelDOM.listaDeItems.innerHTML = '';
  if (!proyecto || !proyecto.items || proyecto.items.length === 0) {
    elementosDelDOM.listaDeItems.innerHTML = '<p class="text-gray-400">No hay objetos agregados.</p>';
    return;
  }
  proyecto.items.forEach(item => {
    const html = `
      <div class="bg-gray-800 p-4 rounded-lg shadow-md flex justify-between items-start mb-4">
        <div onclick="verDetalles(event, '${item.id}', 'objeto')" class="flex-grow cursor-pointer">
          <h3 class="text-xl font-semibold text-blue-400 mb-2">${item.nombre}</h3>
          <p class="text-gray-400">${item.descripcion}</p>
        </div>
        <div class="flex-shrink-0 flex items-center space-x-2 ml-4">
          <button onclick="editarItem(event, '${item.id}')" class="text-gray-400 hover:text-blue-400 transition-colors">
            <i class="fas fa-edit"></i>
          </button>
          <button onclick="eliminarItem(event, '${item.id}')" class="text-gray-400 hover:text-red-400 transition-colors">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      </div>
    `;
    elementosDelDOM.listaDeItems.insertAdjacentHTML('beforeend', html);
  });
}

// ==========================
// Ver Detalles
// ==========================
function verDetalles(event, id, tipo) {
  if (event) event.stopPropagation();
  const proyecto = estadoDeLaApp.proyectos[estadoDeLaApp.indiceProyectoActual];
  let item;
  switch (tipo) {
    case 'personaje': item = proyecto.personajes.find(p => p.id === id); break;
    case 'lugar': item = proyecto.lugares.find(l => l.id === id); break;
    case 'objeto': item = proyecto.items.find(i => i.id === id); break;
    case 'capitulo': item = proyecto.capitulos.find(c => c.id === id); break;
  }
  if (!item) return;

  let htmlContenido = '';
  if (item.imagenUrl) htmlContenido += `<img src="${item.imagenUrl}" class="image-preview rounded-md mb-4">`;
  if (item.nombre) htmlContenido += `<h2 class="text-2xl font-bold text-blue-400 mb-2">${item.nombre}</h2>`;
  if (item.titulo) htmlContenido += `<h2 class="text-2xl font-bold text-blue-400 mb-2">${item.titulo}</h2>`;
  if (item.descripcion) htmlContenido += `<p class="text-gray-300 mb-4">${item.descripcion}</p>`;
  if (item.resumen) htmlContenido += `<p class="text-gray-300 mb-4">${item.resumen}</p>`;
  if (item.contenido) htmlContenido += `<div class="prose prose-invert max-w-none text-gray-200">${item.contenido}</div>`;
  if (item.rasgos) htmlContenido += `<p class="text-gray-400 mt-4"><b>Rasgos:</b> ${item.rasgos}</p>`;

  // Añado un botón de edición dinámico dentro del modal de detalles
  // para que el evento se maneje correctamente y no cause el error.
  htmlContenido += `<div class="mt-4">`;
  if (tipo === 'personaje') {
    htmlContenido += `<button onclick="editarPersonaje(event, '${item.id}')" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition-colors"><i class="fas fa-edit"></i> Editar</button>`;
  } else if (tipo === 'lugar') {
    htmlContenido += `<button onclick="editarLugar(event, '${item.id}')" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition-colors"><i class="fas fa-edit"></i> Editar</button>`;
  } else if (tipo === 'objeto') {
    htmlContenido += `<button onclick="editarItem(event, '${item.id}')" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition-colors"><i class="fas fa-edit"></i> Editar</button>`;
  } else if (tipo === 'capitulo') {
    htmlContenido += `<button onclick="editarCapitulo(event, '${item.id}')" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition-colors"><i class="fas fa-edit"></i> Editar</button>`;
  }
  htmlContenido += `</div>`;


  elementosDelDOM.cuerpoModalDetalles.innerHTML = htmlContenido;
  elementosDelDOM.modalDetalles.classList.remove('hidden');
}


// ==========================
// Lógica de Proyectos
// ==========================
function agregarProyecto() {
  const nombre = prompt('Ingresa el nombre del nuevo proyecto:');
  if (nombre) {
    const nuevoProyecto = {
      id: generarID(),
      nombre,
      personajes: [],
      lugares: [],
      items: [],
      capitulos: [],
    };
    estadoDeLaApp.proyectos.push(nuevoProyecto);
    estadoDeLaApp.indiceProyectoActual = estadoDeLaApp.proyectos.length - 1;
    guardarEstado();
    renderizarProyectos();
    mostrarToast('Proyecto creado con éxito.');
  }
}

function cambiarProyecto(index) {
  estadoDeLaApp.indiceProyectoActual = index;
  guardarEstado();
  renderizarProyectos();
  renderizarPersonajes();
  renderizarLugares();
  renderizarItems();
  renderizarCapitulos();
  actualizarTituloProyecto();
  cambiarAVista('dashboard');
}

function eliminarProyecto(index) {
  if (confirm('¿Estás seguro de que quieres eliminar este proyecto?')) {
    estadoDeLaApp.proyectos.splice(index, 1);
    if (estadoDeLaApp.proyectos.length > 0) {
      estadoDeLaApp.indiceProyectoActual = 0;
    } else {
      estadoDeLaApp.indiceProyectoActual = -1;
    }
    guardarEstado();
    renderizarProyectos();
    renderizarPersonajes();
    renderizarLugares();
    renderizarItems();
    renderizarCapitulos();
    actualizarTituloProyecto();
  }
}

function renderizarProyectos() {
  elementosDelDOM.listaDeProyectos.innerHTML = '';
  estadoDeLaApp.proyectos.forEach((proyecto, index) => {
    const claseActiva = index === estadoDeLaApp.indiceProyectoActual ? 'bg-blue-600 text-white' : 'hover:bg-gray-700';
    const html = `
      <div class="project-item flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors ${claseActiva}" onclick="cambiarProyecto(${index})">
        <span class="flex-grow truncate">${proyecto.nombre}</span>
        <button onclick="eliminarProyecto(${index})" class="text-gray-400 hover:text-red-400 ml-2">
          <i class="fas fa-trash-alt"></i>
        </button>
      </div>
    `;
    elementosDelDOM.listaDeProyectos.insertAdjacentHTML('beforeend', html);
  });
}

function actualizarTituloProyecto() {
  if (estadoDeLaApp.indiceProyectoActual !== -1 && estadoDeLaApp.proyectos.length > 0) {
    elementosDelDOM.tituloProyectoActual.textContent = estadoDeLaApp.proyectos[estadoDeLaApp.indiceProyectoActual].nombre;
  } else {
    elementosDelDOM.tituloProyectoActual.textContent = 'Selecciona o crea un proyecto';
  }
}

// ==========================
// Persistencia
// ==========================
function guardarEstado() {
  localStorage.setItem('narrativeDesignerState', JSON.stringify(estadoDeLaApp));
}

function cargarEstado() {
  const estadoGuardado = localStorage.getItem('narrativeDesignerState');
  if (estadoGuardado) {
    Object.assign(estadoDeLaApp, JSON.parse(estadoGuardado));
  }
  if (estadoDeLaApp.proyectos.length === 0) {
    estadoDeLaApp.proyectos.push({
      id: generarID(),
      nombre: 'Mi Primer Proyecto',
      personajes: [],
      lugares: [],
      items: [],
      capitulos: [],
    });
    estadoDeLaApp.indiceProyectoActual = 0;
  }
}

// ==========================
// Event Listeners y Inicialización
// ==========================
document.addEventListener('DOMContentLoaded', () => {
  cargarEstado();
  renderizarProyectos();
  actualizarTituloProyecto();
  if (estadoDeLaApp.proyectos.length > 0) {
    renderizarPersonajes();
    renderizarLugares();
    renderizarItems();
    renderizarCapitulos();
  }
  cambiarAVista(estadoDeLaApp.pestanaActual);

  // Botones de acción
  elementosDelDOM.btnNuevoProyecto.addEventListener('click', agregarProyecto);
  elementosDelDOM.btnAgregarPersonaje.addEventListener('click', agregarPersonaje);
  elementosDelDOM.btnAgregarLugar.addEventListener('click', agregarLugar);
  elementosDelDOM.btnAgregarItem.addEventListener('click', agregarItem);
  elementosDelDOM.btnAgregarCapitulo.addEventListener('click', agregarCapitulo);

  // Cerrar modales
  elementosDelDOM.btnCerrarModalPersonaje?.addEventListener('click', () => {
    elementosDelDOM.modalPersonaje.classList.add('hidden');
  });
  elementosDelDOM.btnCerrarModalLugar?.addEventListener('click', () => {
    elementosDelDOM.modalLugar.classList.add('hidden');
  });
  elementosDelDOM.btnCerrarModalItem?.addEventListener('click', () => {
    elementosDelDOM.modalItem.classList.add('hidden');
  });
  elementosDelDOM.btnCerrarModalCapitulo?.addEventListener('click', () => {
    elementosDelDOM.modalCapitulo.classList.add('hidden');
  });
  elementosDelDOM.btnCerrarModalDetalles?.addEventListener('click', () => {
    elementosDelDOM.modalDetalles.classList.add('hidden');
  });

  // Enviar formularios
  elementosDelDOM.formularioPersonaje?.addEventListener('submit', guardarPersonaje);
  elementosDelDOM.formularioLugar?.addEventListener('submit', guardarLugar);
  elementosDelDOM.formularioItem?.addEventListener('submit', guardarItem);
  elementosDelDOM.formularioCapitulo?.addEventListener('submit', guardarCapitulo);

  // Manejar importación/exportación
  elementosDelDOM.btnExportarMenu?.addEventListener('click', (e) => {
    e.stopPropagation();
    elementosDelDOM.menuExportar.classList.toggle('hidden');
  });

  elementosDelDOM.exportarComoJSON?.addEventListener('click', () => {
    const dataStr = JSON.stringify(estadoDeLaApp.proyectos, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = 'proyectos.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    elementosDelDOM.menuExportar.classList.add('hidden');
  });

  elementosDelDOM.importarJSON?.addEventListener('click', () => {
    elementosDelDOM.inputImportarJSON.click();
  });

  elementosDelDOM.inputImportarJSON?.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const proyectosImportados = JSON.parse(e.target.result);
          if (Array.isArray(proyectosImportados)) {
            estadoDeLaApp.proyectos = proyectosImportados;
            estadoDeLaApp.indiceProyectoActual = 0;
            guardarEstado();
            renderizarProyectos();
            renderizarPersonajes();
            renderizarLugares();
            renderizarItems();
            renderizarCapitulos();
            actualizarTituloProyecto();
            mostrarToast('Proyectos importados con éxito.');
          } else {
            throw new Error('Formato de archivo incorrecto.');
          }
        } catch (error) {
          mostrarToast('Error al importar el archivo: ' + error.message);
        }
      };
      reader.readAsText(file);
    }
  });

  // Cerrar menús al hacer clic fuera
  document.addEventListener('click', (e) => {
    if (!elementosDelDOM.btnExportarMenu.contains(e.target) && !elementosDelDOM.menuExportar.contains(e.target)) {
      elementosDelDOM.menuExportar.classList.add('hidden');
    }
  });

  // Navegación
  elementosDelDOM.btnDashboard?.addEventListener('click', () => cambiarAVista('dashboard'));
  elementosDelDOM.btnHistorias?.addEventListener('click', () => cambiarAVista('historias'));
  elementosDelDOM.btnCapitulos?.addEventListener('click', () => cambiarAVista('capitulos'));
  elementosDelDOM.btnPersonajes?.addEventListener('click', () => cambiarAVista('personajes'));
  elementosDelDOM.btnLugares?.addEventListener('click', () => cambiarAVista('lugares'));
  elementosDelDOM.btnItems?.addEventListener('click', () => cambiarAVista('items'));

  // Manejar el cambio de vista previa de imagen en el formulario de items
  elementosDelDOM.itemImageUrlInput?.addEventListener('input', (e) => {
    const url = e.target.value;
    if (url) {
      elementosDelDOM.vistaPreviaImagenItem.src = url;
      elementosDelDOM.vistaPreviaImagenItem.classList.remove('hidden');
      elementosDelDOM.placeholderImagenItem.classList.add('hidden');
    } else {
      elementosDelDOM.vistaPreviaImagenItem.classList.add('hidden');
      elementosDelDOM.placeholderImagenItem.classList.remove('hidden');
    }
  });

  // Funciones globales para onclick en HTML
  window.cambiarAVista = cambiarAVista;
  window.verDetalles = verDetalles;
  window.editarCapitulo = editarCapitulo;
  window.eliminarCapitulo = eliminarCapitulo;
  window.editarItem = editarItem;
  window.eliminarItem = eliminarItem;
  window.editarLugar = editarLugar;
  window.eliminarLugar = eliminarLugar;
  window.editarPersonaje = editarPersonaje;
  window.eliminarPersonaje = eliminarPersonaje;
  window.cambiarProyecto = cambiarProyecto;
  window.eliminarProyecto = eliminarProyecto;
});
