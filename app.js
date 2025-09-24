// --- Estado Global ---
let appState = {
  projects: [],
  currentProjectIndex: null,
  currentTab: 'dashboard',
  modalType: null, // tipo de ítem (chapters, characters, places, objects)
  modalItemIndex: null, // índice del ítem a editar
  mindMapNetwork: null,   // Instancia del mapa mental
  currentImageDataBase64: null, // Almacena la imagen principal (subida o generada)
  currentMapDataBase64: null,   // Almacena la imagen del mapa (subida o generada)
  characterAgeChartInstance: null, // Instancia del gráfico de edades
  characterGenderChartInstance: null, // Instancia del gráfico de géneros
  placeTypeChartInstance: null, // Instancia del gráfico de tipos de lugar
  objectTypeChartInstance: null, // Instancia del gráfico de tipos de objeto
  ratingAnalysisChartInstance: null // Instancia del gráfico de calificaciones
};

// --- Cache DOM ---
const dom = {
  welcomeScreen: document.getElementById('welcomeScreen'),
  projectScreen: document.getElementById('projectScreen'),
  projectsList: document.getElementById('listaProyectos'),
  projectName: document.getElementById('nombreProyecto'),
  tabButtons: document.querySelectorAll('.tab-button'),
  tabsToggle: document.getElementById('tabs-toggle'),
  tabsNav: document.getElementById('tabs-nav'),
  currentTabName: document.getElementById('current-tab-name'),
  tabContents: document.querySelectorAll('.tab-content'),
  btnAddChapter: document.getElementById('btnAddChapter'),
  btnAddCharacter: document.getElementById('btnAddCharacter'),
  btnAddPlace: document.getElementById('btnAddPlace'),
  btnAddObject: document.getElementById('btnAddObject'),
  chaptersList: document.getElementById('chaptersList'),
  charactersList: document.getElementById('charactersList'),
  placesList: document.getElementById('placesList'),
  objectsList: document.getElementById('objectsList'),
  totalChapters: document.getElementById('totalChapters'),
  totalCharacters: document.getElementById('totalCharacters'),
  totalPlaces: document.getElementById('totalPlaces'),
  totalObjects: document.getElementById('totalObjects'),
  totalImages: document.getElementById('totalImages'),
  quickGallery: document.getElementById('quickGallery'),
  projectCoverWrapper: document.getElementById('projectCoverWrapper'),
  inputProjectCover: document.getElementById('inputProjectCover'),
  projectCoverImage: document.getElementById('projectCoverImage'),
  projectCoverPlaceholder: document.getElementById('projectCoverPlaceholder'),
  projectSummary: document.getElementById('projectSummary'),
  btnOpenCoverGenerator: document.getElementById('btnOpenCoverGenerator'),
  coverGeneratorModal: document.getElementById('coverGeneratorModal'),
  coverImageStyle: document.getElementById('coverImageStyle'),
  coverImageService: document.getElementById('coverImageService'),
  coverPreviewInModal: document.getElementById('coverPreviewInModal'),
  btnCancelCoverGeneration: document.getElementById('btnCancelCoverGeneration'),
  btnGenerateProjectCover: document.getElementById('btnGenerateProjectCover'), // Now in modal
  btnGenerateProjectCoverText: document.getElementById('btnGenerateProjectCoverText'),
  projectCoverSpinner: document.getElementById('projectCoverSpinner'),
  genericModal: document.getElementById('genericModal'),
  modalTitle: document.getElementById('modalTitle'),
  genericForm: document.getElementById('genericForm'),
  inputName: document.getElementById('inputName'),
  inputDescription: document.getElementById('inputDescription'),
  inputImage: document.getElementById('inputImage'),
  imagePreview: document.getElementById('imagePreview'),
  imageStyleField: document.getElementById('imageStyleField'),
  imageServiceField: document.getElementById('imageServiceField'),
  inputImageService: document.getElementById('inputImageService'),
  inputImageStyle: document.getElementById('inputImageStyle'),
  btnGenerateImage: document.getElementById('btnGenerateImage'),
  btnGenerateImageText: document.getElementById('btnGenerateImageText'),
  imageSpinner: document.getElementById('imageSpinner'),
  btnDeleteImage: document.getElementById('btnDeleteImage'),
  // Campos del formulario para personajes
  characterFields: document.querySelectorAll('.character-field'),
  inputAge: document.getElementById('inputAge'),
  inputHeight: document.getElementById('inputHeight'),
  inputGender: document.getElementById('inputGender'),
  inputPhysicalDescription: document.getElementById('inputPhysicalDescription'),
  inputBackstory: document.getElementById('inputBackstory'),
  // Campos del formulario para lugares
  placeFields: document.querySelectorAll('.place-field'),
  inputPlaceType: document.getElementById('inputPlaceType'),
  inputAtmosphere: document.getElementById('inputAtmosphere'),
  inputKeyFeatures: document.getElementById('inputKeyFeatures'),
  inputPlaceLore: document.getElementById('inputPlaceLore'),
  inputPlaceMap: document.getElementById('inputPlaceMap'),
  mapPreview: document.getElementById('mapPreview'),
  mapStyleField: document.getElementById('mapStyleField'),
  mapServiceField: document.getElementById('mapServiceField'),
  inputMapService: document.getElementById('inputMapService'),
  inputMapStyle: document.getElementById('inputMapStyle'),
  btnGenerateMap: document.getElementById('btnGenerateMap'),
  btnGenerateMapText: document.getElementById('btnGenerateMapText'),
  mapSpinner: document.getElementById('mapSpinner'),
  btnDeleteMapImage: document.getElementById('btnDeleteMapImage'),
  btnUseMapAsMain: document.getElementById('btnUseMapAsMain'),
  btnUseMainAsMap: document.getElementById('btnUseMainAsMap'),
  // Campos del formulario para objetos
  objectFields: document.querySelectorAll('.object-field'),
  inputObjectType: document.getElementById('inputObjectType'),
  inputObjectOrigin: document.getElementById('inputObjectOrigin'),
  inputObjectPowers: document.getElementById('inputObjectPowers'),
  inputObjectRelevance: document.getElementById('inputObjectRelevance'),
  // Campos del formulario para capítulos
  chapterFields: document.querySelectorAll('.chapter-field'),
  inputOrder: document.getElementById('inputOrder'),
  // Modal de detalles
  detailsModal: document.getElementById('detailsModal'),
  detailsImageContainer: document.getElementById('detailsImageContainer'),
  detailsImage: document.getElementById('detailsImage'),
  detailsTitle: document.getElementById('detailsTitle'),
  detailsDescription: document.getElementById('detailsDescription'),
  detailsDescriptionHeader: document.getElementById('detailsDescriptionHeader'),
  // Campos de detalles para personajes
  characterDetailsInfo: document.getElementById('characterDetailsInfo'),
  detailsAgeContainer: document.getElementById('detailsAgeContainer'),
  detailsAge: document.getElementById('detailsAge'),
  detailsHeightContainer: document.getElementById('detailsHeightContainer'),
  detailsHeight: document.getElementById('detailsHeight'),
  detailsGenderContainer: document.getElementById('detailsGenderContainer'),
  detailsGender: document.getElementById('detailsGender'),
  detailsPhysicalDescriptionContainer: document.getElementById('detailsPhysicalDescriptionContainer'),
  detailsPhysicalDescription: document.getElementById('detailsPhysicalDescription'),
  detailsBackstoryContainer: document.getElementById('detailsBackstoryContainer'),
  detailsBackstory: document.getElementById('detailsBackstory'),
  // Campos de detalles para lugares
  placeDetailsInfo: document.getElementById('placeDetailsInfo'),
  detailsPlaceTypeContainer: document.getElementById('detailsPlaceTypeContainer'),
  detailsPlaceType: document.getElementById('detailsPlaceType'),
  detailsAtmosphereContainer: document.getElementById('detailsAtmosphereContainer'),
  detailsAtmosphere: document.getElementById('detailsAtmosphere'),
  detailsKeyFeaturesContainer: document.getElementById('detailsKeyFeaturesContainer'),
  detailsKeyFeatures: document.getElementById('detailsKeyFeatures'),
  detailsPlaceLoreContainer: document.getElementById('detailsPlaceLoreContainer'),
  detailsPlaceLore: document.getElementById('detailsPlaceLore'),
  // Campos de detalles para objetos
  objectDetailsInfo: document.getElementById('objectDetailsInfo'),
  detailsMapContainer: document.getElementById('detailsMapContainer'),
  detailsMap: document.getElementById('detailsMap'),
  detailsObjectTypeContainer: document.getElementById('detailsObjectTypeContainer'),
  detailsObjectType: document.getElementById('detailsObjectType'),
  detailsObjectOriginContainer: document.getElementById('detailsObjectOriginContainer'),
  detailsObjectOrigin: document.getElementById('detailsObjectOrigin'),
  detailsObjectPowersContainer: document.getElementById('detailsObjectPowersContainer'),
  detailsObjectPowers: document.getElementById('detailsObjectPowers'),
  detailsObjectRelevanceContainer: document.getElementById('detailsObjectRelevanceContainer'),
  detailsObjectRelevance: document.getElementById('detailsObjectRelevance'),
  btnImportar: document.getElementById('btnImportar'),
  btnEditDetails: document.getElementById('btnEditDetails'),
  btnDeleteDetails: document.getElementById('btnDeleteDetails'),
  btnCloseDetails: document.getElementById('btnCloseDetails'),
  btnCancel: document.getElementById('btnCancel'),
  btnSave: document.getElementById('btnSave'),
  btnNuevoProyecto: document.getElementById('btnNuevoProyecto'),
  btnCrearInicial: document.getElementById('btnCrearInicial'),
  btnEditarNombre: document.getElementById('btnEditarNombre'),
  btnEliminarProyecto: document.getElementById('btnEliminarProyecto'),
  // Mapa Mental
  btnPublicarWeb: document.getElementById('btnPublicarWeb'),
  btnVerPublico: document.getElementById('btnVerPublico'),
  mindMapContainer: document.getElementById('mindMapContainer'),
  btnGenerateMindMap: document.getElementById('btnGenerateMindMap'),
  btnLinkNodes: document.getElementById('btnLinkNodes'),
  // Dashboard Features
  // Comments Management
  commentsManagementList: document.getElementById('commentsManagementList'),
  featuredCharactersContainer: document.getElementById('featuredCharactersContainer'),
  featuredPlacesContainer: document.getElementById('featuredPlacesContainer'),
  featuredObjectsContainer: document.getElementById('featuredObjectsContainer'),
  characterAgeChartContainer: document.getElementById('characterAgeChartContainer'),
  characterAgeChart: document.getElementById('characterAgeChart'),
  characterGenderChartContainer: document.getElementById('characterGenderChartContainer'),
  characterGenderChart: document.getElementById('characterGenderChart'),
  placeTypeChartContainer: document.getElementById('placeTypeChartContainer'),
  placeTypeChart: document.getElementById('placeTypeChart'),
  objectTypeChartContainer: document.getElementById('objectTypeChartContainer'),
  objectTypeChart: document.getElementById('objectTypeChart'),
  ratingAnalysisContainer: document.getElementById('ratingAnalysisContainer'),
  ratingAnalysisChart: document.getElementById('ratingAnalysisChart'),
  sidebar: document.getElementById('sidebar'),
  sidebarToggle: document.getElementById('sidebar-toggle'),
};

// --- Gestión de datos (IndexedDB) ---
let db;
async function initDB() {
    db = await idb.openDB('story-creator-db', 2, {
        upgrade(db) {
            if (!db.objectStoreNames.contains('projects')) {
                db.createObjectStore('projects');
            }
            // Añadir los object stores que faltan para consistencia con historia.js
            if (!db.objectStoreNames.contains('ratings')) {
                const store = db.createObjectStore('ratings', { keyPath: 'id', autoIncrement: true });
                // Índice para asegurar que un usuario solo califique un ítem una vez.
                store.createIndex('user_item', ['userEmail', 'itemId'], { unique: true });
            }
            if (!db.objectStoreNames.contains('comments')) {
                const store = db.createObjectStore('comments', { keyPath: 'id', autoIncrement: true });
                store.createIndex('by_project', 'projectId');
                store.createIndex('by_user', 'userEmail');
            }
        },
    });
}

async function saveProjects() {
  if (!db) return;
  try {
    await db.put('projects', appState.projects, 'allProjects');
  } catch (error) {
    console.error("Failed to save projects:", error);
    alert("Error al guardar el proyecto. El almacenamiento podría estar lleno o corrupto. Error: " + error.message);
  }
}
async function loadProjects() {
  await initDB();
  const stored = await db.get('projects', 'allProjects');
  const loadedProjects = stored || [];
  // Asegurar compatibilidad y ordenar datos
  const tx = db.transaction(['projects', 'comments'], 'readwrite');
  const commentsStore = tx.objectStore('comments');
  let needsSave = false;
  
  // FIX: Usar map para crear un nuevo array con los proyectos actualizados.
  // forEach no es ideal para modificar la estructura de los elementos mientras se itera.
  const migrationPromises = loadedProjects.map(async p => {
    if (!p.id) {
      p.id = generateId(); // Asignar ID si no existe
      needsSave = true;
    }
    // --- MIGRACIÓN DE COMENTARIOS ---
    // Mueve los comentarios del formato antiguo (array en el proyecto) al nuevo (tabla 'comments')
    if (p.comments && p.comments.length > 0) {
        console.log(`Migrando ${p.comments.length} comentarios para el proyecto ${p.name}`);
        for (const oldComment of p.comments) {
            await commentsStore.add({
                projectId: p.id,
                userEmail: oldComment.name, // El campo antiguo se llamaba 'name'
                message: oldComment.message,
                timestamp: new Date(oldComment.date).getTime()
            });
        }
        p.comments = []; // Vaciar el array antiguo
        needsSave = true;
    }
    if (!p.mindMap) {
      p.mindMap = { nodes: [], edges: [] };
    }
    if (typeof p.descripcionLarga === 'undefined') {
      p.descripcionLarga = '';
    }
    // Ordenar capítulos por el campo 'order'
    if (p.chapters) {
      p.chapters.sort((a, b) => (a.order || 0) - (b.order || 0));
    }
    return p; // Devolver el proyecto (potencialmente modificado)
  });

  appState.projects = await Promise.all(migrationPromises);
  await tx.done;

  renderProjectsList();
  if (needsSave) {
    await saveProjects(); // Guardar los proyectos si se añadieron nuevos IDs
  }
  if (appState.projects.length > 0) {
    selectProject(0);
  } else {
    showWelcomeScreen();
  }
}

// --- Funciones de ayuda para imágenes ---
const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

const urlToBase64 = async (url) => {
    const response = await fetch(url, { cache: 'no-store' }); // Evitar caché para obtener nuevas imágenes
    const blob = await response.blob();
    return toBase64(blob);
};

/**
 * Añade un event listener seguro para 'click' y 'touchend', evitando la doble ejecución.
 * @param {HTMLElement} element El elemento al que se le añadirá el listener.
 * @param {Function} handler La función que se ejecutará.
 */
function addSafeEventListener(element, handler) {
    if (!element) return;

    // Flag para evitar la doble ejecución en dispositivos táctiles
    let touchHandled = false;

    const touchendHandler = (e) => {
        // Prevenimos el 'click' fantasma que sigue a un 'touchend'
        e.preventDefault();
        handler(e);
        touchHandled = true;
        // Reseteamos el flag después de un breve período
        setTimeout(() => {
            touchHandled = false;
        }, 300);
    };

    const clickHandler = (e) => {
        // Si el evento de 'touchend' ya se disparó, no ejecutamos el de 'click'
        if (touchHandled) return;
        handler(e);
    };

    element.addEventListener('touchend', touchendHandler, { passive: false });
    element.addEventListener('click', clickHandler);
}

// --- Render ---
function showWelcomeScreen() {
  dom.welcomeScreen.classList.remove('hidden');
  dom.projectScreen.classList.add('hidden');
}
function showProjectScreen() {
  dom.welcomeScreen.classList.add('hidden');
  dom.projectScreen.classList.remove('hidden');
}
function renderProjectsList() {
  dom.projectsList.innerHTML = '';
  appState.projects.forEach((p, i) => {
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.textContent = p.name;
    btn.className = `w-full text-left py-2 px-4 rounded-lg ${
      appState.currentProjectIndex === i
        ? 'bg-indigo-600 text-white'
        : 'hover:bg-[#333]'
    }`;
    btn.onclick = () => selectProject(i);
    li.appendChild(btn);
    dom.projectsList.appendChild(li);
  });
}
function renderProjectDetails() {
  const project = appState.projects[appState.currentProjectIndex];
  if (!project) return;
  dom.projectName.textContent = project.name;
  renderList(dom.chaptersList, project.chapters, 'chapters');
  renderList(dom.charactersList, project.characters, 'characters');
  renderList(dom.placesList, project.places, 'places');
  renderList(dom.objectsList, project.objects, 'objects');
  dom.totalChapters.textContent = project.chapters.length;
  dom.projectSummary.value = project.descripcionLarga || '';
  renderProjectCover(project); // <-- Llamada para mostrar la portada
  dom.totalCharacters.textContent = project.characters.length;
  dom.totalPlaces.textContent = project.places.length;
  dom.totalObjects.textContent = project.objects.length;

  // --- Lógica para el Dashboard Mejorado ---
  // Contar imágenes y renderizar galería rápida
  let imageCount = 0;
  const allImageItems = [];
  ['chapters', 'characters', 'places', 'objects'].forEach(type => {
      project[type].forEach((item, index) => {
          if (item.image) {
              imageCount++;
              allImageItems.push({ ...item, originalType: type, originalIndex: index });
          }
      });
  });

  dom.totalImages.textContent = imageCount;

  // Renderizar Galería Rápida
  const recentImages = allImageItems.slice(-8).reverse(); // Últimas 8 imágenes, en orden de más reciente
  dom.quickGallery.innerHTML = '';
  if (recentImages.length === 0) {
      dom.quickGallery.innerHTML = '<p class="text-gray-500 col-span-full text-center">No hay imágenes en el proyecto aún.</p>';
  } else {
      recentImages.forEach(item => {
          const imgCard = document.createElement('div');
          imgCard.className = 'relative group cursor-pointer aspect-square bg-gray-800 rounded-lg overflow-hidden shadow-lg';
          imgCard.onclick = () => showDetails(item.originalType, item.originalIndex);
          imgCard.innerHTML = `
              <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110">
              <div class="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                  <p class="text-white text-xs truncate">${item.name}</p>
              </div>
          `;
          dom.quickGallery.appendChild(imgCard);
      });
  }

  // --- Lógica para Elementos Destacados ---
  const renderFeaturedItems = (container, items, type) => {
      container.innerHTML = '';
      if (items.length === 0) {
          container.innerHTML = `<p class="text-gray-500 col-span-full text-center">No hay ${type} en el proyecto.</p>`;
          return;
      }
      // Seleccionar hasta 6 elementos aleatorios
      const randomItems = [...items]
          .map((item, index) => ({ ...item, originalIndex: index })) // Guardar índice original
          .sort(() => 0.5 - Math.random()) // Mezclar
          .slice(0, 6); // Tomar los primeros 6

      randomItems.forEach(item => {
          const itemCard = document.createElement('div');
          itemCard.className = 'relative group cursor-pointer aspect-square bg-gray-800 rounded-lg overflow-hidden shadow-lg';
          itemCard.onclick = () => showDetails(type, item.originalIndex);
          itemCard.innerHTML = `
              ${item.image ? `<img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110">` : `<div class="w-full h-full flex items-center justify-center text-gray-500"><i class="fas fa-image text-3xl"></i></div>`}
              <div class="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                  <p class="text-white text-xs truncate">${item.name}</p>
              </div>
          `;
          container.appendChild(itemCard);
      });
  };

  renderFeaturedItems(dom.featuredCharactersContainer, project.characters, 'characters');
  renderFeaturedItems(dom.featuredPlacesContainer, project.places, 'places');
  renderFeaturedItems(dom.featuredObjectsContainer, project.objects, 'objects');

  // --- Lógica para Gráfico de Edades ---
  if (project.characters.length === 0) {
      dom.characterAgeChartContainer.classList.add('hidden');
      if (appState.characterAgeChartInstance) {
          appState.characterAgeChartInstance.destroy();
          appState.characterAgeChartInstance = null;
      }
  } else {
      dom.characterAgeChartContainer.classList.remove('hidden');
      
      const ageRanges = { '0-20': 0, '21-40': 0, '41-60': 0, '61+': 0, 'Desconocido': 0 };
      project.characters.forEach(char => {
          const age = parseInt(char.age, 10);
          if (isNaN(age) || !char.age) { ageRanges['Desconocido']++; }
          else if (age <= 20) { ageRanges['0-20']++; }
          else if (age <= 40) { ageRanges['21-40']++; }
          else if (age <= 60) { ageRanges['41-60']++; }
          else { ageRanges['61+']++; }
      });

      if (appState.characterAgeChartInstance) {
          // Actualizar gráfico existente
          appState.characterAgeChartInstance.data.labels = Object.keys(ageRanges);
          appState.characterAgeChartInstance.data.datasets[0].data = Object.values(ageRanges);
          appState.characterAgeChartInstance.update();
      } else {
          // Crear nuevo gráfico
          const ctx = dom.characterAgeChart.getContext('2d');
          appState.characterAgeChartInstance = new Chart(ctx, {
              type: 'doughnut',
              data: {
                  labels: Object.keys(ageRanges),
                  datasets: [{
                      label: 'Distribución de Edad',
                      data: Object.values(ageRanges),
                      backgroundColor: ['rgba(129, 140, 248, 0.7)', 'rgba(74, 222, 128, 0.7)', 'rgba(250, 204, 21, 0.7)', 'rgba(248, 113, 113, 0.7)', 'rgba(156, 163, 175, 0.7)'],
                      borderColor: '#1f2937',
                      borderWidth: 2
                  }]
              },
              options: {
                  responsive: true, maintainAspectRatio: false,
                  plugins: { legend: { position: 'top', labels: { color: '#d1d5db' } } }
              }
          });
      }
  }

  // --- Lógica para Gráfico de Géneros ---
  if (project.characters.length === 0) {
      dom.characterGenderChartContainer.classList.add('hidden');
      if (appState.characterGenderChartInstance) {
          appState.characterGenderChartInstance.destroy();
          appState.characterGenderChartInstance = null;
      }
  } else {
      dom.characterGenderChartContainer.classList.remove('hidden');
      const genderCounts = {
          'femenino': 0, 'masculino': 0, 'androgino': 0, 
          'no-binario': 0, 'otro': 0, 'no-especificado': 0
      };
      const genderLabels = {
          'femenino': 'Femenino', 'masculino': 'Masculino', 'androgino': 'Andrógino',
          'no-binario': 'No Binario', 'otro': 'Otro', 'no-especificado': 'No Especificado'
      };

      project.characters.forEach(char => {
          const gender = char.gender || 'no-especificado';
          if (genderCounts.hasOwnProperty(gender)) {
              genderCounts[gender]++;
          }
      });

      if (appState.characterGenderChartInstance) {
          appState.characterGenderChartInstance.data.datasets[0].data = Object.values(genderCounts);
          appState.characterGenderChartInstance.update();
      } else {
          const ctx = dom.characterGenderChart.getContext('2d');
          appState.characterGenderChartInstance = new Chart(ctx, {
              type: 'pie',
              data: {
                  labels: Object.keys(genderCounts).map(k => genderLabels[k]),
                  datasets: [{
                      label: 'Distribución de Género',
                      data: Object.values(genderCounts),
                      backgroundColor: ['rgba(236, 72, 153, 0.7)', 'rgba(59, 130, 246, 0.7)', 'rgba(139, 92, 246, 0.7)', 'rgba(16, 185, 129, 0.7)', 'rgba(245, 158, 11, 0.7)', 'rgba(107, 114, 128, 0.7)'],
                      borderColor: '#1f2937',
                      borderWidth: 2
                  }]
              },
              options: {
                  responsive: true, maintainAspectRatio: false,
                  plugins: { legend: { position: 'top', labels: { color: '#d1d5db' } } }
              }
          });
      }
  }

  // --- Lógica para Gráfico de Tipos de Lugar ---
  if (project.places.length === 0) {
      dom.placeTypeChartContainer.classList.add('hidden');
      if (appState.placeTypeChartInstance) {
          appState.placeTypeChartInstance.destroy();
          appState.placeTypeChartInstance = null;
      }
  } else {
      dom.placeTypeChartContainer.classList.remove('hidden');
      const placeTypeCounts = {
          'terrenal': 0, 'espacial': 0, 'astral': 0, 'urbano': 0,
          'rural': 0, 'ficticio': 0, 'historico': 0, 'no-especificado': 0
      };
      const placeTypeLabels = {
          'terrenal': 'Terrenal', 'espacial': 'Espacial', 'astral': 'Astral',
          'urbano': 'Urbano', 'rural': 'Rural', 'ficticio': 'Ficticio',
          'historico': 'Histórico', 'no-especificado': 'No Especificado'
      };

      project.places.forEach(place => {
          const type = place.placeType || 'no-especificado';
          if (placeTypeCounts.hasOwnProperty(type)) {
              placeTypeCounts[type]++;
          }
      });

      if (appState.placeTypeChartInstance) {
          appState.placeTypeChartInstance.data.datasets[0].data = Object.values(placeTypeCounts);
          appState.placeTypeChartInstance.update();
      } else {
          const ctx = dom.placeTypeChart.getContext('2d');
          appState.placeTypeChartInstance = new Chart(ctx, {
              type: 'doughnut',
              data: {
                  labels: Object.keys(placeTypeCounts).map(k => placeTypeLabels[k]),
                  datasets: [{
                      label: 'Distribución de Lugares',
                      data: Object.values(placeTypeCounts),
                      backgroundColor: ['rgba(34, 197, 94, 0.7)', 'rgba(14, 165, 233, 0.7)', 'rgba(168, 85, 247, 0.7)', 'rgba(107, 114, 128, 0.7)', 'rgba(132, 204, 22, 0.7)', 'rgba(236, 72, 153, 0.7)', 'rgba(217, 119, 6, 0.7)', 'rgba(209, 213, 219, 0.7)'],
                      borderColor: '#1f2937',
                      borderWidth: 2
                  }]
              },
              options: {
                  responsive: true, maintainAspectRatio: false,
                  plugins: { legend: { position: 'top', labels: { color: '#d1d5db' } } }
              }
          });
      }
  }

  // --- Lógica para Gráfico de Tipos de Objeto ---
  if (project.objects.length === 0) {
      dom.objectTypeChartContainer.classList.add('hidden');
      if (appState.objectTypeChartInstance) {
          appState.objectTypeChartInstance.destroy();
          appState.objectTypeChartInstance = null;
      }
  } else {
      dom.objectTypeChartContainer.classList.remove('hidden');
      const objectTypeCounts = {
          'arma': 0, 'reliquia': 0, 'herramienta': 0, 'consumible': 0,
          'documento': 0, 'otro': 0, 'no-especificado': 0
      };
      const objectTypeLabels = {
          'arma': 'Arma', 'reliquia': 'Reliquia', 'herramienta': 'Herramienta',
          'consumible': 'Consumible', 'documento': 'Documento', 'Vehiculo': 'Vehículo','otro': 'Otro',
          'no-especificado': 'No Especificado'
      };

      project.objects.forEach(obj => {
          const type = obj.objectType || 'no-especificado';
          if (objectTypeCounts.hasOwnProperty(type)) {
              objectTypeCounts[type]++;
          }
      });

      if (appState.objectTypeChartInstance) {
          appState.objectTypeChartInstance.data.datasets[0].data = Object.values(objectTypeCounts);
          appState.objectTypeChartInstance.update();
      } else {
          const ctx = dom.objectTypeChart.getContext('2d');
          appState.objectTypeChartInstance = new Chart(ctx, {
              type: 'pie',
              data: {
                  labels: Object.keys(objectTypeCounts).map(k => objectTypeLabels[k]),
                  datasets: [{
                      label: 'Distribución de Objetos',
                      data: Object.values(objectTypeCounts),
                      backgroundColor: ['rgba(249, 115, 22, 0.7)', 'rgba(234, 179, 8, 0.7)', 'rgba(139, 92, 246, 0.7)', 'rgba(16, 185, 129, 0.7)', 'rgba(59, 130, 246, 0.7)', 'rgba(236, 72, 153, 0.7)', 'rgba(107, 114, 128, 0.7)'],
                      borderColor: '#1f2937',
                      borderWidth: 2
                  }]
              },
              options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top', labels: { color: '#d1d5db' } } } }
          });
      }
  }

  // --- Lógica para Gráfico de Calificaciones ---
  const calculateCategoryAverage = (items) => {
      if (!items || items.length === 0) return { average: 0, count: 0 };
      let totalRating = 0;
      let ratingCount = 0;
      items.forEach(item => {
          if (item.ratings && item.ratings.length > 0) {
              totalRating += item.ratings.reduce((sum, r) => sum + r, 0);
              ratingCount += item.ratings.length;
          }
      });
      return { average: ratingCount > 0 ? totalRating / ratingCount : 0, count: ratingCount };
  };

  const projectRatings = project.ratings || [];
  const projectAvg = projectRatings.length > 0 ? projectRatings.reduce((s, r) => s + r, 0) / projectRatings.length : 0;
  const chaptersAvg = calculateCategoryAverage(project.chapters).average;
  const charactersAvg = calculateCategoryAverage(project.characters).average;
  const placesAvg = calculateCategoryAverage(project.places).average;
  const objectsAvg = calculateCategoryAverage(project.objects).average;

  const ratingData = [projectAvg, chaptersAvg, charactersAvg, placesAvg, objectsAvg];
  const hasRatings = ratingData.some(r => r > 0);

  if (!hasRatings) {
      dom.ratingAnalysisContainer.classList.add('hidden');
      if (appState.ratingAnalysisChartInstance) {
          appState.ratingAnalysisChartInstance.destroy();
          appState.ratingAnalysisChartInstance = null;
      }
  } else {
      dom.ratingAnalysisContainer.classList.remove('hidden');
      const labels = ['Proyecto General', 'Capítulos', 'Personajes', 'Lugares', 'Objetos'];
      
      if (appState.ratingAnalysisChartInstance) {
          appState.ratingAnalysisChartInstance.data.datasets[0].data = ratingData;
          appState.ratingAnalysisChartInstance.update();
      } else {
          const ctx = dom.ratingAnalysisChart.getContext('2d');
          appState.ratingAnalysisChartInstance = new Chart(ctx, {
              type: 'bar',
              data: {
                  labels: labels,
                  datasets: [{
                      label: 'Calificación Promedio (de 1 a 5)',
                      data: ratingData,
                      backgroundColor: ['rgba(239, 68, 68, 0.7)', 'rgba(59, 130, 246, 0.7)', 'rgba(249, 115, 22, 0.7)', 'rgba(34, 197, 94, 0.7)', 'rgba(168, 85, 247, 0.7)'],
                      borderColor: '#1f2937',
                      borderWidth: 2
                  }]
              },
              options: {
                  indexAxis: 'y',
                  responsive: true, maintainAspectRatio: false,
                  scales: {
                      x: { beginAtZero: true, max: 5, ticks: { color: '#d1d5db' }, grid: { color: 'rgba(255, 255, 255, 0.1)' } },
                      y: { ticks: { color: '#d1d5db' }, grid: { display: false } }
                  },
                  plugins: { legend: { display: false } }
              }
          });
      }
  }

  if (appState.currentTab === 'mindmap') {
    initMindMap(project);
  }
}

function renderProjectCover(project) {
  if (project && project.coverImage) {
    dom.projectCoverImage.src = project.coverImage;
    dom.projectCoverImage.classList.remove('hidden');
    dom.projectCoverPlaceholder.classList.add('hidden');
  } else {
    dom.projectCoverImage.src = '';
    dom.projectCoverImage.classList.add('hidden');
    dom.projectCoverPlaceholder.classList.remove('hidden');
  }
}

// --- Portada del Proyecto ---
if (dom.projectCoverWrapper) {
  // Evento para abrir el selector de archivos al hacer clic en el contenedor
  dom.projectCoverWrapper.addEventListener('click', () => {
    dom.inputProjectCover.click();
  });

  // Evento que se dispara cuando el usuario selecciona un archivo
  dom.inputProjectCover.addEventListener('change', async (event) => {
    const file = event.target.files[0];
    const project = appState.projects[appState.currentProjectIndex];

    if (file && project) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const imageData = e.target.result; // Imagen convertida a base64

        // Guardar la imagen en el estado actual del proyecto
        project.coverImage = imageData;
        
        // Guardar todos los proyectos en la base de datos
        await saveProjects();
        
        // Actualizar la interfaz para mostrar la nueva imagen
        renderProjectCover(project);
      };
      // Leer el archivo como una URL de datos (base64)
      reader.readAsDataURL(file);
    }
  });
}

// --- Lógica de Exportación (JSON y PDF) ---

function exportarProyectoJSON() {
    const project = appState.projects[appState.currentProjectIndex];
    if (!project) {
        alert('Por favor, selecciona un proyecto para exportar.');
        return;
    }
    // Se envuelve el proyecto en un array para que sea compatible con la función de importación, que espera una lista de proyectos.
    const dataStr = JSON.stringify([project], null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${project.name.replace(/\s/g, '_')}_proyecto.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

async function renderMindMapToImage(project) {
    if (!project.mindMap || project.mindMap.nodes.length === 0 || typeof vis === 'undefined') {
        return null;
    }

    // --- Lógica de Tamaño Dinámico ---
    const nodeCount = project.mindMap.nodes.length;
    const baseWidth = 1200;
    const baseHeight = 800;
    const pixelsPerNodeWidth = 20;  // Espacio horizontal adicional por nodo
    const pixelsPerNodeHeight = 15; // Espacio vertical adicional por nodo
    const minNodesForScaling = 25;

    let canvasWidth = baseWidth;
    let canvasHeight = baseHeight;

    if (nodeCount > minNodesForScaling) {
        const extraNodes = nodeCount - minNodesForScaling;
        canvasWidth += extraNodes * pixelsPerNodeWidth;
        canvasHeight += extraNodes * pixelsPerNodeHeight;
    }

    // Limitar el tamaño para evitar problemas de rendimiento en el navegador
    canvasWidth = Math.min(canvasWidth, 8000);
    canvasHeight = Math.min(canvasHeight, 6000);

    // Crear un contenedor temporal fuera de la pantalla
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.width = `${canvasWidth}px`;
    tempContainer.style.height = `${canvasHeight}px`;
    document.body.appendChild(tempContainer);

    const nodes = new vis.DataSet(project.mindMap.nodes);
    const edges = new vis.DataSet(project.mindMap.edges);
    const data = { nodes, edges };
    const options = {
        physics: { enabled: false },
        interaction: { zoomView: false, dragView: false },
        nodes: {
            shape: 'box',
            font: { color: '#e2e8f0' }, // Texto claro para fondo oscuro
            // Replicar colores de la app para consistencia
            color: {
                border: '#6366f1',
                background: '#2c3e50'
            }
        },
        edges: {
            color: '#a0aec0', // Color de línea claro
            font: { color: '#e2e8f0', strokeWidth: 0 }
        }
    };

    const tempNetwork = new vis.Network(tempContainer, data, options);

    // Esperar a que la red se dibuje
    return new Promise(resolve => {
        // Usar 'once' para asegurar que se ejecute una sola vez después del primer dibujado
        tempNetwork.once("afterDrawing", (ctx) => {
            // Añadir un fondo oscuro al canvas para que coincida con el tema de la app
            // y solucionar el problema del fondo parcial.
            ctx.save();
            ctx.globalCompositeOperation = 'destination-over';
            ctx.fillStyle = '#000000'; // Fondo negro para la exportación
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.restore();
            const dataURL = ctx.canvas.toDataURL('image/jpeg', 0.9);
            tempNetwork.destroy();
            document.body.removeChild(tempContainer);
            resolve(dataURL);
        });
        tempNetwork.fit(); // Ajustar la vista para que todos los nodos sean visibles
    });
}

async function exportProjectToPDF(proyecto) {
    if (!proyecto) {
        alert('No hay un proyecto seleccionado para exportar.');
        return;
    }
    if (typeof window.jspdf?.jsPDF?.API?.autoTable !== 'function') {
        alert('Las librerías para generar PDF no se han cargado correctamente. Revisa la conexión a internet.');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });

    // --- Constantes y variables de ayuda ---
    const pageHeight = doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let cursorY = margin;
    const tocEntries = [];

    // --- 1. Portada con Título e Imagen ---
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    // La posición del título depende de si hay imagen
    const titleY = proyecto.coverImage ? pageHeight / 2 + 60 : pageHeight / 2 - 20;
    doc.text(proyecto.name, pageWidth / 2, titleY, { align: 'center' });

    if (proyecto.coverImage) {
        try {
            const imgData = proyecto.coverImage;
            const imgProps = doc.getImageProperties(imgData);
            const ratio = imgProps.width / imgProps.height;
            const maxWidth = pageWidth - margin * 4; // Dejar más margen
            const maxHeight = pageHeight / 2.5;
            let w = maxWidth;
            let h = w / ratio;
            if (h > maxHeight) {
                h = maxHeight;
                w = h * ratio;
            }
            const x = (pageWidth - w) / 2;
            const y = pageHeight / 4; // Centrar imagen en la mitad superior
            doc.addImage(imgData, 'JPEG', x, y, w, h);
        } catch (e) {
            console.error("Error al añadir la imagen de portada al PDF:", e);
            // El título ya está renderizado, así que solo se muestra el error en consola.
        }
    }
    // --- Funciones de ayuda para el PDF ---
    function checkPageBreak(neededHeight) {
        if (cursorY + neededHeight > pageHeight - margin) {
            doc.addPage();
            cursorY = margin;
        }
    }

    async function addImage(imgData, x, y, maxWidth, maxHeight) {
        return new Promise((resolve) => {
            const drawPlaceholder = (reason) => {
                // No llamar a checkPageBreak aquí, el invocador es responsable.
                doc.setDrawColor(220);
                doc.rect(x, y, maxWidth, maxHeight);
                doc.setTextColor(150);
                doc.setFontSize(10);
                doc.text(reason, x + maxWidth / 2, y + maxHeight / 2, { align: 'center' });
                resolve(maxHeight + 5); // Devolver altura con padding
            };

            if (!imgData || !imgData.startsWith('data:image')) {
                drawPlaceholder('Sin Imagen');
                return;
            }

            const img = new Image();
            img.src = imgData;
            img.onload = () => {
                try {
                    const imgProps = doc.getImageProperties(imgData);
                    const aspectRatio = imgProps.width / imgProps.height;
                    let finalWidth = maxWidth;
                    let finalHeight = maxHeight;

                    if (maxWidth / maxHeight > aspectRatio) {
                        finalWidth = maxHeight * aspectRatio;
                    } else {
                        finalHeight = maxWidth / aspectRatio;
                    }

                    doc.addImage(imgData, 'JPEG', x, y, finalWidth, finalHeight);
                    resolve(finalHeight + 5); // Devolver altura con padding
                } catch (e) {
                    console.error("Error al añadir imagen al PDF:", e);
                    drawPlaceholder('Error Imagen');
                }
            };
            img.onerror = (err) => {
                console.error("Error al cargar imagen para el PDF:", err);
                drawPlaceholder('Error Imagen');
                resolve(maxHeight + 5);
            };
        });
    }

    // --- Estructura del Documento ---

  // 2. Resumen del Proyecto (en una nueva página)
    doc.addPage();
    cursorY = margin;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.text('2. Resumen del Proyecto', margin, cursorY);
    cursorY += 15;

    tocEntries.push({ title: '2. Resumen del Proyecto', page: doc.internal.getNumberOfPages() });

    // Texto largo del resumen
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);

    const resumenTexto = proyecto.descripcionLarga || 'Descripcion y/o Game Document...';
    const textoDividido = doc.splitTextToSize(resumenTexto, doc.internal.pageSize.width - 2 * margin);

    // Renderizado línea por línea con salto de página
    textoDividido.forEach(linea => {
        const pageHeight = doc.internal.pageSize.height; // recalculado por si acaso
        if (cursorY + 8 > pageHeight - margin) {
            doc.addPage();
            cursorY = margin;
        }
        doc.text(linea, margin, cursorY);
        cursorY += 8;
    });


// Tabla resumen de elementos
doc.autoTable({
    startY: cursorY,
    head: [['Categoría', 'Total de Elementos']],
    body: [
        ['Capítulos', proyecto.chapters.length],
        ['Personajes', proyecto.characters.length],
        ['Lugares', proyecto.places.length],
        ['Objetos', proyecto.objects.length]
    ],
    theme: 'grid',
    headStyles: { fillColor: [99, 102, 241] },
    didDrawPage: (data) => { cursorY = data.cursor.y; }
});

cursorY = doc.autoTable.previous.finalY + 15;
    // 3. Secciones Detalladas
    async function renderSection(title, items, renderItem, sectionNumber) {
        if (!items || items.length === 0) return;        
        // Solo añade una página nueva si no estamos ya al principio de una.
        // Esto evita páginas en blanco entre secciones.
        if (cursorY > margin) {
            doc.addPage();
            cursorY = margin;
        }
        tocEntries.push({ title: `${sectionNumber}. ${title}`, page: doc.internal.getNumberOfPages() });

        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.text(`${sectionNumber}. ${title}`, margin, cursorY);
        cursorY += 10;
        doc.setLineWidth(0.5);
        doc.line(margin, cursorY, pageWidth - margin, cursorY);
        cursorY += 10;

        for (const [index, item] of items.entries()) {
            await renderItem(item, index);
            if (index < items.length - 1) {
                cursorY += 5;
                checkPageBreak(10);
                doc.setDrawColor(220);
                doc.setLineDashPattern([1, 2], 0);
                doc.line(margin, cursorY, pageWidth - margin, cursorY);
                doc.setLineDashPattern([], 0);
                cursorY += 10;
            }
        }
    }

    const simpleItemRenderer = async (item) => {
        // 1. Calcular alturas de todo el contenido para este ítem
        const textX = item.image ? margin + 75 : margin;
        const textWidth = item.image ? pageWidth - margin - textX : pageWidth - (margin * 2);
        
        doc.setFontSize(18);
        const titleHeight = doc.getTextDimensions(item.name, { maxWidth: textWidth }).h;
        
        doc.setFontSize(12);
        const descriptionHeight = item.description ? doc.getTextDimensions(doc.splitTextToSize(item.description, textWidth)).h : 0;

        const PADDING_AFTER_TITLE = 4; // Espacio extra después del título
        const textBlockHeight = titleHeight + PADDING_AFTER_TITLE + descriptionHeight;
        const imageBlockHeight = item.image ? 60 + 5 : 0; // Altura máxima de imagen 60mm + 5mm padding
        
        const neededHeight = Math.max(textBlockHeight, imageBlockHeight);

        // 2. Comprobar si el bloque completo cabe en la página
        checkPageBreak(neededHeight);
        const startY = cursorY;
        let textCursorY = startY;

        // 3. Renderizar imagen
        let imageBottomY = startY;
        if (item.image) {
            const renderedImageHeight = await addImage(item.image, margin, startY, 60, 60);
            imageBottomY = startY + renderedImageHeight;
        }
        
        // 4. Renderizar texto al lado de la imagen
        doc.setFontSize(18); doc.setFont('helvetica', 'bold'); 
        doc.text(item.name, textX, textCursorY, { maxWidth: textWidth, baseline: 'top' });
        textCursorY += titleHeight + PADDING_AFTER_TITLE;

        let textBottomY = textCursorY;
        if (item.description) {
            // Usar autoTable para el cuerpo de la descripción para manejar saltos de página automáticamente
            doc.autoTable({
                body: [[item.description]],
                theme: 'plain',
                styles: { fontSize: 12, fontStyle: 'normal' },
                margin: { left: textX },
                columnStyles: { 0: { cellWidth: textWidth } },
                startY: textCursorY,
                didDrawPage: (data) => { textCursorY = data.cursor.y; }
            });
            textBottomY = doc.autoTable.previous.finalY;
        }
        
        // 5. Actualizar el cursor a la parte inferior del elemento más alto (imagen o bloque de texto)
        cursorY = Math.max(imageBottomY, textBottomY) + 5; // Añadir un padding final
    };

    const characterRenderer = async (item) => {
        // 1. Calcular alturas
        const textX = item.image ? margin + 75 : margin;
        const textWidth = item.image ? pageWidth - margin - textX : pageWidth - (margin * 2);
        
        doc.setFontSize(18);
        let totalTextBlockHeight = doc.getTextDimensions(item.name, { maxWidth: textWidth }).h + 8;

        const details = [];
        if (item.age) details.push(['Edad', item.age]);
        if (item.height) details.push(['Altura', item.height]);
        if (details.length > 0) {
            // La altura de autoTable es difícil de pre-calcular. Hacemos una estimación.
            totalTextBlockHeight += (details.length * 5) + 5;
        }

        const addTitledDescriptionHeight = (title, text) => {
            if (text) {
                doc.setFontSize(14);
                totalTextBlockHeight += doc.getTextDimensions(title, { maxWidth: textWidth }).h + 7;
                doc.setFontSize(12);
                totalTextBlockHeight += doc.getTextDimensions(doc.splitTextToSize(text, textWidth)).h + 5;
            }
        };
        
        addTitledDescriptionHeight('Descripción Física', item.physicalDescription);
        addTitledDescriptionHeight('Personalidad / Descripción General', item.description);
        addTitledDescriptionHeight('Historia / Trasfondo', item.backstory);

        const imageBlockHeight = item.image ? 80 + 5 : 0; // Altura máxima de imagen 80mm
        const neededHeight = Math.max(totalTextBlockHeight, imageBlockHeight);

        // 2. Comprobar salto de página
        checkPageBreak(neededHeight);
        const startY = cursorY;

        // 3. Renderizar imagen
        let imageBottomY = startY;
        if (item.image) {
            const renderedImageHeight = await addImage(item.image, margin, startY, 60, 80);
            imageBottomY = startY + renderedImageHeight;
        }

        // 4. Renderizar texto
        let textCursorY = startY;
        doc.setFontSize(18); doc.setFont('helvetica', 'bold');
        const titleHeight = doc.getTextDimensions(item.name, { maxWidth: textWidth }).h;
        doc.text(item.name, textX, textCursorY, { maxWidth: textWidth, baseline: 'top' });
        textCursorY += titleHeight + 8;

        if (details.length > 0) {
            doc.autoTable({
                body: details,
                theme: 'plain',
                styles: { cellPadding: 1, fontSize: 10 },
                columnStyles: { 0: { fontStyle: 'bold' } },
                margin: { left: textX },
                startY: textCursorY,
                didDrawPage: (data) => { cursorY = data.cursor.y; }
            });
            textCursorY = doc.autoTable.previous.finalY + 5;
        }

        function addTitledDescription(title, text) {
            if (text) {
                // Renderizar el título de la sección
                doc.autoTable({
                    body: [[title]],
                    theme: 'plain',
                    styles: { fontSize: 14, fontStyle: 'bold', cellPadding: { top: 4, bottom: 2 } },
                    margin: { left: textX },
                    columnStyles: { 0: { cellWidth: textWidth } },
                    startY: textCursorY,
                    didDrawPage: (data) => { textCursorY = data.cursor.y; }
                });
                textCursorY = doc.autoTable.previous.finalY;

                // Renderizar el texto de la descripción, autoTable se encarga de los saltos de página
                doc.autoTable({
                    body: [[text]],
                    theme: 'plain',
                    styles: { fontSize: 12, fontStyle: 'normal' },
                    margin: { left: textX },
                    columnStyles: { 0: { cellWidth: textWidth } },
                    startY: textCursorY,
                    didDrawPage: (data) => { textCursorY = data.cursor.y; }
                });
                textCursorY = doc.autoTable.previous.finalY + 5;
            }
        }
        
        addTitledDescription('Descripción Física', item.physicalDescription);
        addTitledDescription('Personalidad / Descripción General', item.description);
        addTitledDescription('Historia / Trasfondo', item.backstory);

        cursorY = Math.max(textCursorY, imageBottomY);
    };

    const placeRenderer = async (item) => {
        const textX = item.image ? margin + 75 : margin;
        const textWidth = item.image ? pageWidth - margin - textX : pageWidth - (margin * 2);
        
        // --- Pre-calculate height ---
        doc.setFontSize(18);
        let totalTextBlockHeight = doc.getTextDimensions(item.name, { maxWidth: textWidth }).h + 8;

        const addTitledDescriptionHeight = (title, text) => {
            if (text) {
                doc.setFontSize(14);
                totalTextBlockHeight += doc.getTextDimensions(title, { maxWidth: textWidth }).h + 7;
                doc.setFontSize(12);
                totalTextBlockHeight += doc.getTextDimensions(doc.splitTextToSize(text, textWidth)).h + 5;
            }
        };
        
        addTitledDescriptionHeight('Descripción General', item.description);
        addTitledDescriptionHeight('Atmósfera / Ambiente', item.atmosphere);
        addTitledDescriptionHeight('Características Clave', item.keyFeatures);
        addTitledDescriptionHeight('Historia / Lore', item.lore);

        const imageBlockHeight = item.image ? 80 + 5 : 0;
        const neededHeight = Math.max(totalTextBlockHeight, imageBlockHeight);

        checkPageBreak(neededHeight);
        const startY = cursorY;

        let imageBottomY = startY;
        if (item.image) {
            const renderedImageHeight = await addImage(item.image, margin, startY, 60, 80);
            imageBottomY = startY + renderedImageHeight;
        }

        let textCursorY = startY;
        doc.setFontSize(18); doc.setFont('helvetica', 'bold');
        const titleHeight = doc.getTextDimensions(item.name, { maxWidth: textWidth }).h;
        doc.text(item.name, textX, textCursorY, { maxWidth: textWidth, baseline: 'top' });
        textCursorY += titleHeight + 8;

        function addTitledDescription(title, text) {
            if (text) {
                doc.autoTable({
                    body: [[title]],
                    theme: 'plain',
                    styles: { fontSize: 14, fontStyle: 'bold', cellPadding: { top: 4, bottom: 2 } },
                    margin: { left: textX },
                    columnStyles: { 0: { cellWidth: textWidth } },
                    startY: textCursorY,
                    didDrawPage: (data) => { textCursorY = data.cursor.y; }
                });
                textCursorY = doc.autoTable.previous.finalY;

                doc.autoTable({
                    body: [[text]],
                    theme: 'plain',
                    styles: { fontSize: 12, fontStyle: 'normal' },
                    margin: { left: textX },
                    columnStyles: { 0: { cellWidth: textWidth } },
                    startY: textCursorY,
                    didDrawPage: (data) => { textCursorY = data.cursor.y; }
                });
                textCursorY = doc.autoTable.previous.finalY + 5;
            }
        }
        
        addTitledDescription('Descripción General', item.description);
        addTitledDescription('Atmósfera / Ambiente', item.atmosphere);
        addTitledDescription('Características Clave', item.keyFeatures);
        addTitledDescription('Historia / Lore', item.lore);

        cursorY = Math.max(textCursorY, imageBottomY) + 5;

        // Renderizar el mapa debajo de todo lo demás
        if (item.mapImage) {
            checkPageBreak(100); // Espacio para título del mapa + mapa
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text('Mapa del Lugar', margin, cursorY);
            cursorY += 8;
            // Usar el ancho completo de la página para el mapa
            const mapWidth = pageWidth - margin * 2;
            const mapHeight = await addImage(item.mapImage, margin, cursorY, mapWidth, 80);
            cursorY += mapHeight;
        }
    };

    const objectRenderer = async (item) => {
        const textX = item.image ? margin + 75 : margin;
        const textWidth = item.image ? pageWidth - margin - textX : pageWidth - (margin * 2);
        
        // --- Pre-calculate height ---
        doc.setFontSize(18);
        let totalTextBlockHeight = doc.getTextDimensions(item.name, { maxWidth: textWidth }).h + 8;

        const details = [];
        if (item.objectType) details.push(['Tipo / Categoría', item.objectType]);
        if (details.length > 0) {
            totalTextBlockHeight += (details.length * 5) + 5;
        }

        const addTitledDescriptionHeight = (title, text) => {
            if (text) {
                doc.setFontSize(14);
                totalTextBlockHeight += doc.getTextDimensions(title, { maxWidth: textWidth }).h + 7;
                doc.setFontSize(12);
                totalTextBlockHeight += doc.getTextDimensions(doc.splitTextToSize(text, textWidth)).h + 5;
            }
        };
        
        addTitledDescriptionHeight('Descripción General', item.description);
        addTitledDescriptionHeight('Origen / Fabricación', item.origin);
        addTitledDescriptionHeight('Poderes / Habilidades', item.powers);
        addTitledDescriptionHeight('Relevancia en la Trama', item.relevance);

        const imageBlockHeight = item.image ? 80 + 5 : 0;
        const neededHeight = Math.max(totalTextBlockHeight, imageBlockHeight);

        checkPageBreak(neededHeight);
        const startY = cursorY;

        let imageBottomY = startY;
        if (item.image) {
            const renderedImageHeight = await addImage(item.image, margin, startY, 60, 80);
            imageBottomY = startY + renderedImageHeight;
        }

        let textCursorY = startY;
        doc.setFontSize(18); doc.setFont('helvetica', 'bold');
        const titleHeight = doc.getTextDimensions(item.name, { maxWidth: textWidth }).h;
        doc.text(item.name, textX, textCursorY, { maxWidth: textWidth, baseline: 'top' });
        textCursorY += titleHeight + 8;

        if (details.length > 0) {
            doc.autoTable({
                body: details,
                theme: 'plain',
                styles: { cellPadding: 1, fontSize: 10 },
                columnStyles: { 0: { fontStyle: 'bold' } },
                margin: { left: textX },
                startY: textCursorY,
                didDrawPage: (data) => { cursorY = data.cursor.y; }
            });
            textCursorY = doc.autoTable.previous.finalY + 5;
        }

        function addTitledDescription(title, text) {
            if (text) {
                // This function is self-contained and handles its own page breaks via autoTable
                doc.autoTable({
                    body: [[title]],
                    theme: 'plain',
                    styles: { fontSize: 14, fontStyle: 'bold', cellPadding: { top: 4, bottom: 2 } },
                    margin: { left: textX },
                    columnStyles: { 0: { cellWidth: textWidth } },
                    startY: textCursorY,
                    didDrawPage: (data) => { textCursorY = data.cursor.y; }
                });
                textCursorY = doc.autoTable.previous.finalY;

                doc.autoTable({
                    body: [[text]],
                    theme: 'plain',
                    styles: { fontSize: 12, fontStyle: 'normal' },
                    margin: { left: textX },
                    columnStyles: { 0: { cellWidth: textWidth } },
                    startY: textCursorY,
                    didDrawPage: (data) => { textCursorY = data.cursor.y; }
                });
                textCursorY = doc.autoTable.previous.finalY + 5;
            }
        }
        
        addTitledDescription('Descripción General', item.description);
        addTitledDescription('Origen / Fabricación', item.origin);
        addTitledDescription('Poderes / Habilidades', item.powers);
        addTitledDescription('Relevancia en la Trama', item.relevance);

        cursorY = Math.max(textCursorY, imageBottomY);
    };

    let nextSectionNumber = 2;

    // --- Sección de Capítulos (con índice propio) ---
    if (proyecto.chapters && proyecto.chapters.length > 0) {
        if (cursorY > margin) doc.addPage();
        cursorY = margin;
        tocEntries.push({ title: `${nextSectionNumber}. Capítulos`, page: doc.internal.getNumberOfPages() });

        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.text(`${nextSectionNumber}. Capítulos`, margin, cursorY);
        cursorY += 10;
        doc.setLineWidth(0.5);
        doc.line(margin, cursorY, pageWidth - margin, cursorY);
        cursorY += 10;

        // Mini-índice de capítulos
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Índice de Capítulos', margin, cursorY);
        cursorY += 8;
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        proyecto.chapters.forEach(chap => {
            checkPageBreak(8);
            doc.text(`- ${chap.name}`, margin + 5, cursorY);
            cursorY += 7;
        });
        cursorY += 10; // Espacio después del índice

        // Renderizar cada capítulo
        for (const [index, item] of proyecto.chapters.entries()) {
            await simpleItemRenderer(item, index);
            if (index < proyecto.chapters.length - 1) {
                cursorY += 5;
                checkPageBreak(10);
                doc.setDrawColor(220);
                doc.setLineDashPattern([1, 2], 0);
                doc.line(margin, cursorY, pageWidth - margin, cursorY);
                doc.setLineDashPattern([], 0);
                cursorY += 10;
            }
        }
        nextSectionNumber++;
    }

    if (proyecto.characters && proyecto.characters.length > 0) {
        await renderSection('Personajes', proyecto.characters, characterRenderer, nextSectionNumber++);
    }
    if (proyecto.places && proyecto.places.length > 0) {
        await renderSection('Lugares', proyecto.places, placeRenderer, nextSectionNumber++);
    }
    if (proyecto.objects && proyecto.objects.length > 0) {
        await renderSection('Objetos', proyecto.objects, objectRenderer, nextSectionNumber++);
    }

    // --- Sección de Gráficos ---
    const hasCharts = appState.characterAgeChartInstance || appState.characterGenderChartInstance || appState.placeTypeChartInstance || appState.objectTypeChartInstance;
    if (hasCharts) {
        if (cursorY > margin) doc.addPage();
        cursorY = margin;
        const chartsSectionTitle = `${nextSectionNumber}. Estadísticas del Proyecto`;
        tocEntries.push({ title: chartsSectionTitle, page: doc.internal.getNumberOfPages() });
        doc.setFontSize(24); doc.setFont('helvetica', 'bold');
        doc.text(chartsSectionTitle, margin, cursorY);
        cursorY += 20;

        const addChartToPdf = (chartInstance, title) => {
            if (chartInstance) {
                const chartImage = chartInstance.toBase64Image('image/jpeg', 1.0);
                const chartHeight = 100; // Altura fija para el gráfico
                checkPageBreak(chartHeight + 20); // Altura para gráfico + título
                doc.setFontSize(16);
                doc.setFont('helvetica', 'bold');
                doc.text(title, pageWidth / 2, cursorY, { align: 'center' });
                cursorY += 10;
                
                const chartWidth = 150; // Ancho fijo
                const chartX = (pageWidth - chartWidth) / 2;

                doc.addImage(chartImage, 'JPEG', chartX, cursorY, chartWidth, chartHeight);
                cursorY += chartHeight + 15;
            }
        };

        addChartToPdf(appState.characterAgeChartInstance, 'Distribución de Edades');
        addChartToPdf(appState.characterGenderChartInstance, 'Distribución de Géneros');
        addChartToPdf(appState.placeTypeChartInstance, 'Distribución de Tipos de Lugar');
        addChartToPdf(appState.objectTypeChartInstance, 'Distribución de Tipos de Objeto');
        nextSectionNumber++;
    }

    // --- Sección del Mapa Mental ---
    const mindMapImage = await renderMindMapToImage(proyecto);
    if (mindMapImage) {
        if (cursorY > margin) doc.addPage();
        cursorY = margin;
        const sectionTitle = `${nextSectionNumber}. Mapa Mental`;
        tocEntries.push({ title: sectionTitle, page: doc.internal.getNumberOfPages() });

        doc.setFontSize(24); doc.setFont('helvetica', 'bold');
        doc.text(sectionTitle, margin, cursorY);
        cursorY += 10;
        doc.setLineWidth(0.5);
        doc.line(margin, cursorY, pageWidth - margin, cursorY);
        cursorY += 10;

        doc.addImage(mindMapImage, 'JPEG', margin, cursorY, pageWidth - margin * 2, 0);
        nextSectionNumber++;
    }
    // 4. Insertar Tabla de Contenidos (TOC)
    doc.insertPage(2);
    doc.setPage(2);
    cursorY = margin; // Reset cursor for TOC page
    doc.setFontSize(24); doc.setFont('helvetica', 'bold');
    doc.text('Índice de Contenidos', margin, cursorY);
    cursorY += 20;
    
    doc.setFontSize(12); doc.setFont('helvetica', 'normal');
    
    tocEntries.forEach(entry => {
        if (entry.page >= 2) entry.page++;

        const title = entry.title;
        const pageNum = entry.page.toString();
        const titleWidth = doc.getStringUnitWidth(title) * doc.internal.getFontSize() / doc.internal.scaleFactor;
        const pageNumWidth = doc.getStringUnitWidth(pageNum) * doc.internal.getFontSize() / doc.internal.scaleFactor;
        const availableWidth = pageWidth - margin * 2 - pageNumWidth;
        
        let dots = '';
        if (titleWidth < availableWidth) {
            const dotWidth = doc.getStringUnitWidth('.') * doc.internal.getFontSize() / doc.internal.scaleFactor;
            const dotCount = Math.floor((availableWidth - titleWidth) / dotWidth) - 3; // -3 for padding
            dots = '.'.repeat(dotCount > 0 ? dotCount : 0);
        }

        doc.text(`${title} ${dots}`, margin, cursorY);
        doc.text(pageNum, pageWidth - margin, cursorY, { align: 'right' });
        cursorY += 10;
    });

    // 5. Añadir Headers y Footers a todas las páginas
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(150);

        if (i > 1) { // No en la portada
            doc.setFontSize(9);
            doc.text(`Página ${i} de ${pageCount}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
            doc.setFontSize(10);
            doc.text(proyecto.name, margin, 10);
            doc.setDrawColor(150);
            doc.line(margin, 12, pageWidth - margin, 12);
        }
    }

    // 6. Guardar el PDF
    doc.save(`${proyecto.name.replace(/\s/g, '_')}_GameDocument.pdf`);
}

async function exportProjectToHTML(proyecto) {
    if (!proyecto) {
        alert('No hay un proyecto seleccionado para exportar.');
        return;
    }

    const styles = `
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f8f9fa; margin: 0; padding: 0; }
        .container { max-width: 900px; margin: 20px auto; padding: 20px 40px; background: #fff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
        h1, h2, h3 { color: #2c3e50; }
        h1 { font-size: 2.8em; text-align: center; border: none; margin-bottom: 20px; color: #6366f1; }
        h2 { font-size: 2em; margin-top: 60px; border-bottom: 2px solid #6366f1; padding-bottom: 10px; }
        h3 { font-size: 1.5em; margin-top: 30px; border-bottom: 1px solid #e0e0e0; padding-bottom: 5px;}
        h4 { font-size: 1.2em; color: #555; margin-top: 20px; margin-bottom: 5px; }
        p, div > div { margin-bottom: 1em; }
        .item { display: flex; flex-wrap: wrap; gap: 25px; margin-bottom: 30px; padding-bottom: 30px; border-bottom: 1px solid #eee; align-items: flex-start; }
        .item-image { width: 200px; height: 200px; object-fit: cover; border-radius: 8px; flex-shrink: 0; border: 1px solid #ddd; }
        .item-content { flex-grow: 1; min-width: 300px; }
        .item-content h3 { margin-top: 0; }
        .character-details { margin-top: 15px; font-size: 0.95em; }
        .character-details strong { display: inline-block; width: 120px; color: #333; font-weight: 600; }
        .toc { list-style: none; padding: 0; column-count: 2; -webkit-column-count: 2; -moz-column-count: 2; margin-bottom: 40px; }
        .toc li { margin-bottom: 8px; }
        .toc li a { text-decoration: none; color: #6366f1; font-weight: 500; }
        .toc li a:hover { text-decoration: underline; }
        .section-break { page-break-before: always; }
        table { width: 100%; border-collapse: collapse; margin: 25px 0; }
        th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
        th { background-color: #6366f1; color: white; }
        @media print {
            body, .container { box-shadow: none; margin: 0; max-width: 100%; border-radius: 0; }
            .section-break { page-break-before: always; }
            h2 { margin-top: 40px; }
        }
    `;

    const mindMapImage = await renderMindMapToImage(proyecto);

    let html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>${proyecto.name}</title><style>${styles}</style></head><body><div class="container">`;

    // Título y Resumen
    html += `<h1>${proyecto.name}</h1>`;
    if (proyecto.descripcionLarga) {
        html += `<p>${proyecto.descripcionLarga.replace(/\n/g, '<br>')}</p>`;
    }

    // Tabla de Resumen
    html += `<h3>Resumen de Elementos</h3>
    <table>
        <thead><tr><th>Categoría</th><th>Total</th></tr></thead>
        <tbody>
            <tr><td>Capítulos</td><td>${proyecto.chapters.length}</td></tr>
            <tr><td>Personajes</td><td>${proyecto.characters.length}</td></tr>
            <tr><td>Lugares</td><td>${proyecto.places.length}</td></tr>
            <tr><td>Objetos</td><td>${proyecto.objects.length}</td></tr>
        </tbody>
    </table>`;

    // Tabla de Contenidos
    html += `<h2>Índice</h2><ul class="toc">`;
    if (proyecto.chapters.length > 0) html += `<li><a href="#toc-chapters">Capítulos</a></li>`;
    if (proyecto.characters.length > 0) html += `<li><a href="#toc-characters">Personajes</a></li>`;
    if (proyecto.places.length > 0) html += `<li><a href="#toc-places">Lugares</a></li>`;
    if (proyecto.objects.length > 0) html += `<li><a href="#toc-objects">Objetos</a></li>`;
    const hasCharts = appState.characterAgeChartInstance || appState.characterGenderChartInstance || appState.placeTypeChartInstance || appState.objectTypeChartInstance;
    if (hasCharts) html += `<li><a href="#toc-charts">Estadísticas</a></li>`;
    if (mindMapImage) html += `<li><a href="#toc-mindmap">Mapa Mental</a></li>`;
    html += `</ul>`;

    // Funciones de renderizado
    const renderSimpleItem = (item) => `
        <div class="item">
            ${item.image ? `<img src="${item.image}" alt="${item.name}" class="item-image">` : ''}
            <div class="item-content">
                <h3>${item.name}</h3>
                <p>${item.description ? item.description.replace(/\n/g, '<br>') : ''}</p>
            </div>
        </div>`;

    const renderCharacterItem = (item) => `
        <div class="item">
            ${item.image ? `<img src="${item.image}" alt="${item.name}" class="item-image">` : ''}
            <div class="item-content">
                <h3>${item.name}</h3>
                ${(item.age || item.height) ? `
                    <div class="character-details">
                        ${item.age ? `<div><strong>Edad:</strong> ${item.age}</div>` : ''}
                        ${item.height ? `<div><strong>Altura:</strong> ${item.height}</div>` : ''}
                    </div>` : ''}
                ${item.description ? `<h4>Personalidad / Descripción General</h4><p>${item.description.replace(/\n/g, '<br>')}</p>` : ''}
                ${item.physicalDescription ? `<h4>Descripción Física</h4><p>${item.physicalDescription.replace(/\n/g, '<br>')}</p>` : ''}
                ${item.backstory ? `<h4>Historia / Trasfondo</h4><p>${item.backstory.replace(/\n/g, '<br>')}</p>` : ''}
            </div>
        </div>`;

    const renderPlaceItem = (item) => `
        <div class="item">
            ${item.image ? `<img src="${item.image}" alt="${item.name}" class="item-image">` : ''}
            <div class="item-content">
                <h3>${item.name}</h3>
                ${item.description ? `<h4>Descripción General</h4><p>${item.description.replace(/\n/g, '<br>')}</p>` : ''}
                ${item.atmosphere ? `<h4>Atmósfera / Ambiente</h4><p>${item.atmosphere.replace(/\n/g, '<br>')}</p>` : ''}
                ${item.keyFeatures ? `<h4>Características Clave</h4><p>${item.keyFeatures.replace(/\n/g, '<br>')}</p>` : ''}
                ${item.lore ? `<h4>Historia / Lore</h4><p>${item.lore.replace(/\n/g, '<br>')}</p>` : ''}
            </div>
        </div>
        ${item.mapImage ? `
        <div class="item-map-container" style="margin-top: 20px;">
            <h4>Mapa del Lugar</h4>
            <img src="${item.mapImage}" alt="Mapa de ${item.name}" style="width: 100%; max-width: 600px; margin-top: 10px; border-radius: 8px; border: 1px solid #ddd;">
        </div>` : ''}`;

    const renderObjectItem = (item) => `
        <div class="item">
            ${item.image ? `<img src="${item.image}" alt="${item.name}" class="item-image">` : ''}
            <div class="item-content">
                <h3>${item.name}</h3>
                ${item.objectType && item.objectType !== 'no-especificado' ? `<div class="character-details"><div><strong>Tipo / Categoría:</strong> ${item.objectType.charAt(0).toUpperCase() + item.objectType.slice(1)}</div></div>` : ''}
                ${item.description ? `<h4>Descripción General</h4><p>${item.description.replace(/\n/g, '<br>')}</p>` : ''}
                ${item.origin ? `<h4>Origen / Fabricación</h4><p>${item.origin.replace(/\n/g, '<br>')}</p>` : ''}
                ${item.powers ? `<h4>Poderes / Habilidades</h4><p>${item.powers.replace(/\n/g, '<br>')}</p>` : ''}
                ${item.relevance ? `<h4>Relevancia en la Trama</h4><p>${item.relevance.replace(/\n/g, '<br>')}</p>` : ''}
            </div>
        </div>`;

    const renderSectionHTML = (title, anchor, items, renderer) => {
        if (!items || items.length === 0) return '';
        let sectionHtml = `<div class="section-break"></div><h2 id="${anchor}">${title}</h2>`;
        items.forEach(item => {
            sectionHtml += renderer(item);
        });
        return sectionHtml;
    };

    // Construir Secciones
    html += renderSectionHTML('Capítulos', 'toc-chapters', proyecto.chapters, renderSimpleItem);
    html += renderSectionHTML('Personajes', 'toc-characters', proyecto.characters, renderCharacterItem);
    html += renderSectionHTML('Lugares', 'toc-places', proyecto.places, renderPlaceItem);
    html += renderSectionHTML('Objetos', 'toc-objects', proyecto.objects, renderObjectItem);

    // --- Sección de Gráficos ---
    if (hasCharts) {
        html += `<div class="section-break"></div><h2 id="toc-charts">Estadísticas del Proyecto</h2>`;
        const addChartToHtml = (chartInstance, title) => {
            if (chartInstance) {
                const chartImage = chartInstance.toBase64Image('image/jpeg', 1.0);
                html += `<h3>${title}</h3>`;
                html += `<div style="text-align: center; padding: 20px 0; max-width: 600px; margin: auto;">
                            <img src="${chartImage}" alt="${title}" style="max-width: 100%; border: 1px solid #ddd; border-radius: 8px;">
                         </div>`;
            }
        };

        addChartToHtml(appState.characterAgeChartInstance, 'Distribución de Edades');
        addChartToHtml(appState.characterGenderChartInstance, 'Distribución de Géneros');
        addChartToHtml(appState.placeTypeChartInstance, 'Distribución de Tipos de Lugar');
        addChartToHtml(appState.objectTypeChartInstance, 'Distribución de Tipos de Objeto');
    }

    // Sección del Mapa Mental
    if (mindMapImage) {
        html += `<div class="section-break"></div><h2 id="toc-mindmap">Mapa Mental</h2>`;
        html += `<div style="text-align: center; padding: 20px 0;">
                    <img src="${mindMapImage}" alt="Mapa Mental del Proyecto" style="max-width: 100%; border: 1px solid #ddd; border-radius: 8px;">
                 </div>`;
    }

    // Cerrar HTML y descargar
    html += `</div></body></html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${proyecto.name.replace(/\s/g, '_')}_documento.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

async function exportProjectToKDP(proyecto) {
    if (!proyecto) {
        alert('No hay un proyecto seleccionado para exportar.');
        return;
    }

    // Estilos optimizados para la conversión de KDP, imitando un formato de libro estándar.
    const styles = `
        body { font-family: "Times New Roman", Times, serif; line-height: 1.6; margin: 2em; }
        h1, h2, h3 { font-family: "Georgia", serif; page-break-after: avoid; }
        h1 { font-size: 2.5em; text-align: center; margin-bottom: 2em; }
        h2 { font-size: 2em; margin-top: 2em; margin-bottom: 1em; page-break-before: always; border-bottom: 1px solid #ccc; padding-bottom: 0.2em;}
        h3 { font-size: 1.5em; margin-top: 1.5em; margin-bottom: 0.5em; }
        p { margin-bottom: 1em; text-align: justify; text-indent: 1.5em; }
        img { max-width: 100%; height: auto; display: block; margin: 1em auto; }
        .cover-image { width: 60%; max-width: 400px; margin-bottom: 2em; page-break-after: always; }
        .toc { list-style: none; padding: 0; margin-bottom: 2em; page-break-after: always; }
        .toc li { margin-bottom: 0.5em; }
        .toc li a { text-decoration: none; color: #0000EE; }
        .item-list-entry { margin-bottom: 1.5em; page-break-inside: avoid; }
        .item-list-entry img { max-width: 150px; float: left; margin-right: 1em; margin-bottom: 0.5em; }
        .clearfix::after { content: ""; clear: both; display: table; }
        /* No indent for first paragraph after a heading */
        h2 + p, h3 + p { text-indent: 0; }
    `;

    let html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>${proyecto.name}</title><style>${styles}</style></head><body>`;

    // 1. Portada
    html += `<div style="text-align: center;">`;
    if (proyecto.coverImage) {
        html += `<img src="${proyecto.coverImage}" alt="Portada" class="cover-image">`;
    }
    html += `<h1>${proyecto.name}</h1>`;
    html += `</div>`;

    // 2. Tabla de Contenidos
    html += `<h2>Índice</h2><ul class="toc">`;
    if (proyecto.chapters.length > 0) {
        proyecto.chapters.forEach(chap => {
            const chapterId = `chapter-${chap.id || generateId()}`;
            html += `<li><a href="#${chapterId}">${chap.order ? `Capítulo ${chap.order}: ` : ''}${chap.name}</a></li>`;
        });
    }
    if (proyecto.characters.length > 0) html += `<li><a href="#appendix-characters">Personajes</a></li>`;
    if (proyecto.places.length > 0) html += `<li><a href="#appendix-places">Lugares</a></li>`;
    if (proyecto.objects.length > 0) html += `<li><a href="#appendix-objects">Objetos</a></li>`;
    html += `</ul>`;

    // 3. Capítulos
    if (proyecto.chapters.length > 0) {
        proyecto.chapters.forEach(chap => {
            const chapterId = `chapter-${chap.id || generateId()}`;
            html += `<h2 id="${chapterId}">${chap.order ? `Capítulo ${chap.order}: ` : ''}${chap.name}</h2>`;
            if (chap.image) {
                html += `<img src="${chap.image}" alt="${chap.name}">`;
            }
            if (chap.description) {
                const paragraphs = chap.description.split('\n').filter(p => p.trim() !== '').map(p => `<p>${p.trim()}</p>`).join('');
                html += paragraphs;
            }
        });
    }

    // 4. Apéndices (Personajes, Lugares, Objetos)
    const renderAppendix = (title, anchor, items) => {
        if (!items || items.length === 0) return '';
        let sectionHtml = `<h2 id="${anchor}">${title}</h2>`;
        items.forEach(item => {
            sectionHtml += `<div class="item-list-entry clearfix">${item.image ? `<img src="${item.image}" alt="${item.name}">` : ''}<h3>${item.name}</h3>${item.description ? `<p>${item.description.replace(/\n/g, '<br>')}</p>` : ''}</div>`;
        });
        return sectionHtml;
    };

    html += renderAppendix('Personajes', 'appendix-characters', proyecto.characters);
    html += renderAppendix('Lugares', 'appendix-places', proyecto.places);
    html += renderAppendix('Objetos', 'appendix-objects', proyecto.objects);

    html += `</body></html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${proyecto.name.replace(/\s/g, '_')}_KDP.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

async function publicarProyectoWeb() {
    // 1. Obtener el proyecto y validar
    const project = appState.projects[appState.currentProjectIndex];
    if (!project) {
        alert('Por favor, selecciona un proyecto para publicar.');
        return;
    }

    const originalButtonText = dom.btnPublicarWeb.innerHTML;
    dom.btnPublicarWeb.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Publicando...';
    dom.btnPublicarWeb.disabled = true;

    try {
        // 2. Obtener comentarios y preparar los datos del proyecto
        const projectComments = await db.getAllFromIndex('comments', 'by_project', project.id);
        const projectToExport = JSON.parse(JSON.stringify(project));
        projectToExport.comments = projectComments.map(c => ({
            userEmail: c.userEmail,
            message: c.message
        }));

        // 3. Generar el contenido de 'data.js' en memoria
        const dataJsContent = `window.allProjectsData = ${JSON.stringify([projectToExport], null, 2)};`;

        // 4. Función para obtener el contenido de los archivos necesarios
        const fetchAsset = async (path) => {
            const response = await fetch(path);
            if (!response.ok) throw new Error(`No se pudo cargar el archivo: ${path}`);
            return response.text();
        };

        // 5. Cargar los assets necesarios
        const historiaHtmlContent = await fetchAsset("historia.html");
        const historiaJsContent = await fetchAsset("historia.js");
        const visNetworkJsContent = await fetchAsset("https://unpkg.com/vis-network/standalone/umd/vis-network.min.js");
        const visNetworkCssContent = await fetchAsset("https://unpkg.com/vis-network/styles/vis-network.min.css");

        // 6. Construir el HTML final en memoria
        let finalHtml = historiaHtmlContent;

        // Reemplazar las referencias a archivos externos con el contenido en línea
        finalHtml = finalHtml.replace('<script type="text/javascript" src="./libs/vis-network.min.js"></script>', `<script>${visNetworkJsContent}</script>`);
        finalHtml = finalHtml.replace('<link href="./libs/vis-network.min.css" rel="stylesheet" type="text/css" />', `<style>${visNetworkCssContent}</style>`);
        finalHtml = finalHtml.replace('<script src="data.js" defer></script>', `<script>${dataJsContent}</script>`);
        finalHtml = finalHtml.replace('<script src="historia.js" defer></script>', `<script>${historiaJsContent}</script>`);
        finalHtml = finalHtml.replace('<script src="https://cdn.jsdelivr.net/npm/idb/build/umd.js"></script>', ''); // Eliminar la librería de DB

        // 7. Crear un Blob y una URL para el HTML generado
        const blob = new Blob([finalHtml], { type: 'text/html' });
        const url = URL.createObjectURL(blob);

        // 8. Abrir la URL en una nueva pestaña
        window.open(url, '_blank');
        // No es necesario revocar la URL inmediatamente, el navegador la gestionará.

    } catch (error) {
        console.error("Error al publicar el proyecto:", error);
        alert(`Ocurrió un error al generar el archivo de publicación: ${error.message}`);
    } finally {
        // Restaurar el botón
        dom.btnPublicarWeb.innerHTML = originalButtonText;
        dom.btnPublicarWeb.disabled = false;
        const exportOptions = document.getElementById('export-options');
        if (exportOptions) {
            exportOptions.classList.add('hidden');
        }
    }
}

if (dom.btnPublicarWeb) {
    dom.btnPublicarWeb.addEventListener('click', (e) => {
        e.preventDefault();
        publicarProyectoWeb();
    });
}

// --- Importar proyectos ---
if (dom.btnImportar) {
  dom.btnImportar.onclick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";

    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async (ev) => {
        try {
          const imported = JSON.parse(ev.target.result);
          if (!Array.isArray(imported)) {
            alert("El archivo no tiene el formato esperado.");
            return;
          }
          // Mezclar con los proyectos existentes
          appState.projects = [...appState.projects, ...imported];
          await saveProjects();
          renderProjectsList();
          if (appState.projects.length > 0) {
            selectProject(0);
          }
          alert("¡Proyectos importados correctamente!");
        } catch (err) {
          alert("Error al leer el archivo: " + err.message);
        }
      };
      reader.readAsText(file);
    };

    input.click();
  };
}




// --- Helpers ---
function renderList(container, items, type) {
  container.innerHTML = '';
  items.forEach((item, i) => {
    const card = document.createElement('div');
    card.className = 'card item-card';
    card.innerHTML = `
      ${
        item.image
          ? `<img src="${item.image}" class="item-image">`
          : `<div class="placeholder-image w-full h-32"><i class="fas fa-image"></i></div>`
      }
      <div class="p-4"><h4 class="font-bold">${item.name}</h4></div>
    `;
    card.onclick = () => showDetails(type, i);
    container.appendChild(card);
  });
}
function selectProject(index) {
  appState.currentProjectIndex = index;
  renderProjectsList();
  showProjectScreen();

  // --- LÓGICA PARA EL BOTÓN DE VISTA PÚBLICA ---
  const project = appState.projects[appState.currentProjectIndex];
  if (project && project.id) {
      dom.btnVerPublico.href = `historia.html?project=${project.id}`;
      dom.btnVerPublico.classList.remove('hidden');
  } else {
      dom.btnVerPublico.classList.add('hidden');
  }

  renderProjectDetails();
}

// --- Crear proyecto ---
async function newProject() {
  const name = prompt('Nombre del proyecto:');
  if (!name) return;
  appState.projects.push({
    id: generateId(),
    name,
    chapters: [],
    characters: [],
    descripcionLarga: '',
    places: [],
    objects: [],    
    mindMap: { nodes: [], edges: [] }
  });
  await saveProjects();
  selectProject(appState.projects.length - 1);
}

// --- Modal genérico ---
function openModal(type, index = null) {
  appState.modalType = type;
  appState.modalItemIndex = index;

  dom.inputName.value = '';
  dom.inputDescription.value = '';
  dom.inputImage.value = '';
  dom.imagePreview.innerHTML = `<i class="fas fa-image text-3xl"></i>`;

  // Limpiar estado de imágenes
  appState.currentImageDataBase64 = null;
  appState.currentMapDataBase64 = null;
  dom.btnDeleteImage.classList.add('hidden');
  dom.btnGenerateImage.classList.add('hidden');


  // Ocultar y limpiar campos de capítulo por defecto
  dom.chapterFields.forEach(field => field.classList.add('hidden'));
  dom.inputOrder.value = '';

  // Ocultar y limpiar campos de personaje por defecto
  dom.characterFields.forEach(field => field.classList.add('hidden'));
  dom.inputAge.value = '';
  dom.inputHeight.value = '';
  dom.inputGender.value = 'no-especificado';
  dom.inputPhysicalDescription.value = '';
  dom.inputBackstory.value = '';

  // Ocultar y limpiar campos de lugar por defecto
  dom.placeFields.forEach(field => field.classList.add('hidden'));
  dom.inputPlaceType.value = 'no-especificado';
  dom.inputAtmosphere.value = '';
  dom.inputKeyFeatures.value = '';
  dom.inputPlaceLore.value = '';
  dom.inputPlaceMap.value = '';
  dom.mapPreview.innerHTML = `<i class="fas fa-map text-3xl"></i>`;
  updateMapPreviewUI(false);

  // Ocultar y limpiar campos de objeto por defecto
  dom.objectFields.forEach(field => field.classList.add('hidden'));
  dom.inputObjectType.value = 'no-especificado';
  dom.inputObjectOrigin.value = '';
  dom.inputObjectPowers.value = '';
  dom.inputObjectRelevance.value = '';

  // NUEVO: Ocultar campos de estilo de imagen por defecto
  if (dom.imageStyleField) dom.imageStyleField.classList.add('hidden');
  if (dom.imageServiceField) dom.imageServiceField.classList.add('hidden'); // NEW
  if (dom.mapStyleField) dom.mapStyleField.classList.add('hidden');
  if (dom.mapServiceField) dom.mapServiceField.classList.add('hidden'); // NEW

  // Mostrar el botón de generar imagen si el tipo es compatible
  if (['chapters', 'characters', 'objects'].includes(type)) {
      dom.btnGenerateImage.classList.remove('hidden');
      if (dom.imageStyleField) dom.imageStyleField.classList.remove('hidden');
      if (dom.imageServiceField) dom.imageServiceField.classList.remove('hidden'); // NEW
  }

  if (index !== null) {
    // Editar
    const item = appState.projects[appState.currentProjectIndex][type][index];
    dom.inputName.value = item.name;
    dom.inputDescription.value = item.description || '';

    if (item.image) {
      appState.currentImageDataBase64 = item.image;
      dom.imagePreview.innerHTML = `<img src="${item.image}" class="w-full h-full object-cover rounded-lg">`;
      dom.btnDeleteImage.classList.remove('hidden');
    }

    // Si es un capítulo, mostrar y rellenar su campo específico
    if (type === 'chapters') {
      dom.chapterFields.forEach(field => field.classList.remove('hidden'));
      dom.inputOrder.value = item.order || 0;
    }

    // Si es un personaje, mostrar y rellenar sus campos específicos
    if (type === 'characters') {
      dom.characterFields.forEach(field => field.classList.remove('hidden'));
      dom.inputAge.value = item.age || '';
      dom.inputHeight.value = item.height || '';
      dom.inputGender.value = item.gender || 'no-especificado';
      dom.inputPhysicalDescription.value = item.physicalDescription || '';
      dom.inputBackstory.value = item.backstory || '';
    }

    // Si es un lugar, mostrar y rellenar sus campos específicos
    if (type === 'places') {
        dom.placeFields.forEach(field => field.classList.remove('hidden'));
        if (dom.mapStyleField) dom.mapStyleField.classList.remove('hidden');
        if (dom.mapServiceField) dom.mapServiceField.classList.remove('hidden'); // NEW
        dom.inputPlaceType.value = item.placeType || 'no-especificado';
        dom.inputAtmosphere.value = item.atmosphere || '';
        dom.inputKeyFeatures.value = item.keyFeatures || '';
        dom.inputPlaceLore.value = item.lore || '';
        if (item.mapImage) {
            appState.currentMapDataBase64 = item.mapImage;
            dom.mapPreview.innerHTML = `<img src="${item.mapImage}" class="w-full h-full object-cover rounded-lg">`;
            updateMapPreviewUI(true);
        }
    }

    // Si es un objeto, mostrar y rellenar sus campos específicos
    if (type === 'objects') {
        dom.objectFields.forEach(field => field.classList.remove('hidden'));
        dom.inputObjectType.value = item.objectType || 'no-especificado';
        dom.inputObjectOrigin.value = item.origin || '';
        dom.inputObjectPowers.value = item.powers || '';
        dom.inputObjectRelevance.value = item.relevance || '';
    }

    dom.modalTitle.textContent = 'Editar ' + type.slice(0, -1);
  } else {
    // Nuevo
    // Si es un capítulo, mostrar su campo y sugerir el siguiente número de orden
    if (type === 'chapters') {
      dom.chapterFields.forEach(field => field.classList.remove('hidden'));
      const project = appState.projects[appState.currentProjectIndex];
      dom.inputOrder.value = project.chapters.length > 0 ? Math.max(...project.chapters.map(c => c.order || 0)) + 1 : 1;
    }

    // Si es un personaje, mostrar sus campos específicos
    if (type === 'characters') {
      dom.characterFields.forEach(field => field.classList.remove('hidden'));
    }
    // Si es un lugar, mostrar sus campos específicos
    if (type === 'places') {
        dom.placeFields.forEach(field => field.classList.remove('hidden'));
        if (dom.mapStyleField) dom.mapStyleField.classList.remove('hidden');
        if (dom.mapServiceField) dom.mapServiceField.classList.remove('hidden');
    }
    // Si es un objeto, mostrar sus campos específicos
    if (type === 'objects') {
        dom.objectFields.forEach(field => field.classList.remove('hidden'));
    }
    dom.modalTitle.textContent = 'Nuevo ' + type.slice(0, -1);
  }

  dom.genericModal.classList.add('show');
}

// Cerrar modal
if (dom.btnCancel) dom.btnCancel.onclick = () => dom.genericModal.classList.remove('show');

// Guardar modal
if (dom.genericForm) {
  dom.genericForm.onsubmit = async (e) => {
    e.preventDefault();
    const project = appState.projects[appState.currentProjectIndex];
    if (!project) return;

    const imageFile = dom.inputImage.files[0];
    const mapFile = dom.inputPlaceMap.files[0];

    let finalImage = appState.currentImageDataBase64;
    if (imageFile) {
        finalImage = await toBase64(imageFile);
    }

    const newItem = {
      name: dom.inputName.value,
      description: dom.inputDescription.value,
      image: finalImage
    };

    // Añadir campo de orden si el tipo es 'chapters'
    if (appState.modalType === 'chapters') {
      newItem.order = parseInt(dom.inputOrder.value, 10) || 0;
    }

    // Añadir campos de personaje si el tipo es 'characters'
    if (appState.modalType === 'characters') {
      newItem.age = dom.inputAge.value;
      newItem.height = dom.inputHeight.value;
      newItem.gender = dom.inputGender.value;
      newItem.physicalDescription = dom.inputPhysicalDescription.value;
      newItem.backstory = dom.inputBackstory.value;
    }

    // Añadir campos de lugar si el tipo es 'places'
    if (appState.modalType === 'places') {
        let finalMapImage = appState.currentMapDataBase64;
        if (mapFile) {
            finalMapImage = await toBase64(mapFile);
        }
        newItem.placeType = dom.inputPlaceType.value;
        newItem.atmosphere = dom.inputAtmosphere.value;
        newItem.keyFeatures = dom.inputKeyFeatures.value;
        newItem.lore = dom.inputPlaceLore.value;
        newItem.mapImage = finalMapImage;
    }

    // Añadir campos de objeto si el tipo es 'objects'
    if (appState.modalType === 'objects') {
        newItem.objectType = dom.inputObjectType.value;
        newItem.origin = dom.inputObjectOrigin.value;
        newItem.powers = dom.inputObjectPowers.value;
        newItem.relevance = dom.inputObjectRelevance.value;
    }

    if (appState.modalItemIndex !== null) {
      // Editar
      project[appState.modalType][appState.modalItemIndex] = newItem;
    } else {
      // Nuevo
      project[appState.modalType].push(newItem);
    }

    // Si se modificaron los capítulos, reordenarlos
    if (appState.modalType === 'chapters') {
      project.chapters.sort((a, b) => (a.order || 0) - (b.order || 0));
    }

    await saveProjects();
    renderProjectDetails();
    dom.genericModal.classList.remove('show');
  };
}

// Preview de mapa
if (dom.inputPlaceMap) {
  dom.inputPlaceMap.onchange = () => {
    const file = dom.inputPlaceMap.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      dom.mapPreview.innerHTML = `<img src="${e.target.result}" class="w-full h-full object-cover rounded-lg">`;
      appState.currentMapDataBase64 = e.target.result;
      updateMapPreviewUI(true);
    };
    reader.readAsDataURL(file);
  };
}

// Preview de imagen
if (dom.inputImage) {
  dom.inputImage.onchange = () => {
    const file = dom.inputImage.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      dom.imagePreview.innerHTML = `<img src="${e.target.result}" class="w-full h-full object-cover rounded-lg">`;
      appState.currentImageDataBase64 = e.target.result;
      dom.btnDeleteImage.classList.remove('hidden');
    };
    reader.readAsDataURL(file);
  };
}

// --- Detalles ---
function showDetails(type, index) {
  const project = appState.projects[appState.currentProjectIndex];
  if (!project) return;
  const item = project[type][index];
  if (!item) return;

  // --- Resetear y ocultar todos los campos opcionales primero ---
  dom.characterDetailsInfo.classList.add('hidden');
  dom.detailsAgeContainer.classList.add('hidden');
  dom.detailsHeightContainer.classList.add('hidden');
  dom.detailsGenderContainer.classList.add('hidden');
  dom.detailsPhysicalDescriptionContainer.classList.add('hidden');
  dom.detailsBackstoryContainer.classList.add('hidden');
  dom.detailsImageContainer.classList.add('hidden');

  // Resetear y ocultar campos de lugar
  dom.placeDetailsInfo.classList.add('hidden');
  dom.detailsPlaceTypeContainer.classList.add('hidden');
  dom.detailsAtmosphereContainer.classList.add('hidden');
  dom.detailsKeyFeaturesContainer.classList.add('hidden');
  dom.detailsPlaceLoreContainer.classList.add('hidden');
  
  // Resetear y ocultar mapa del lugar
  dom.detailsMapContainer.classList.add('hidden');

  // Resetear y ocultar campos de objeto
  dom.objectDetailsInfo.classList.add('hidden');
  dom.detailsObjectTypeContainer.classList.add('hidden');
  dom.detailsObjectOriginContainer.classList.add('hidden');
  dom.detailsObjectPowersContainer.classList.add('hidden');
  dom.detailsObjectRelevanceContainer.classList.add('hidden');

  // --- Poblar campos comunes ---
  dom.detailsTitle.textContent = item.name;
  dom.detailsDescription.textContent = item.description || '';
  if (item.image) {
    dom.detailsImage.src = item.image;
    dom.detailsImageContainer.classList.remove('hidden');
  }

  // --- Poblar y mostrar campos específicos de personajes ---
  if (type === 'characters') {
    dom.detailsDescriptionHeader.textContent = 'Personalidad'; // Cambiar título de la descripción
    dom.characterDetailsInfo.classList.remove('hidden');

    if (item.age) {
      dom.detailsAge.textContent = item.age;
      dom.detailsAgeContainer.classList.remove('hidden');
    }
    if (item.height) {
      dom.detailsHeight.textContent = item.height;
      dom.detailsHeightContainer.classList.remove('hidden');
    }
    if (item.gender && item.gender !== 'no-especificado') {
      // Capitalizar la primera letra para mostrarlo
      const genderText = item.gender.charAt(0).toUpperCase() + item.gender.slice(1);
      dom.detailsGender.textContent = genderText;
      dom.detailsGenderContainer.classList.remove('hidden');
    }
    if (item.physicalDescription) {
      dom.detailsPhysicalDescription.textContent = item.physicalDescription;
      dom.detailsPhysicalDescriptionContainer.classList.remove('hidden');
    }
    if (item.backstory) {
      dom.detailsBackstory.textContent = item.backstory;
      dom.detailsBackstoryContainer.classList.remove('hidden');
    }
  } else if (type === 'places') { // Lógica para lugares
    dom.detailsDescriptionHeader.textContent = 'Descripción General';
    dom.placeDetailsInfo.classList.remove('hidden');

    if (item.placeType && item.placeType !== 'no-especificado') {
        const typeText = item.placeType.charAt(0).toUpperCase() + item.placeType.slice(1);
        dom.detailsPlaceType.textContent = typeText;
        dom.detailsPlaceTypeContainer.classList.remove('hidden');
    }

    if (item.atmosphere) {
        dom.detailsAtmosphere.textContent = item.atmosphere;
        dom.detailsAtmosphereContainer.classList.remove('hidden');
    }
    if (item.keyFeatures) {
        dom.detailsKeyFeatures.textContent = item.keyFeatures;
        dom.detailsKeyFeaturesContainer.classList.remove('hidden');
    }
    if (item.lore) {
        dom.detailsPlaceLore.textContent = item.lore;
        dom.detailsPlaceLoreContainer.classList.remove('hidden');
    }
    if (item.mapImage) {
        dom.detailsMap.src = item.mapImage;
        dom.detailsMapContainer.classList.remove('hidden');
    }

  } else if (type === 'objects') { // Lógica para objetos
    dom.detailsDescriptionHeader.textContent = 'Descripción General';
    dom.objectDetailsInfo.classList.remove('hidden');

    if (item.objectType && item.objectType !== 'no-especificado') {
        const typeText = item.objectType.charAt(0).toUpperCase() + item.objectType.slice(1);
        dom.detailsObjectType.textContent = typeText;
        dom.detailsObjectTypeContainer.classList.remove('hidden');
    }
    if (item.origin) {
        dom.detailsObjectOrigin.textContent = item.origin;
        dom.detailsObjectOriginContainer.classList.remove('hidden');
    }
    if (item.powers) {
        dom.detailsObjectPowers.textContent = item.powers;
        dom.detailsObjectPowersContainer.classList.remove('hidden');
    }
    if (item.relevance) {
        dom.detailsObjectRelevance.textContent = item.relevance;
        dom.detailsObjectRelevanceContainer.classList.remove('hidden');
    }
  } else {
    // Para otros tipos, usar el encabezado por defecto
    dom.detailsDescriptionHeader.textContent = 'Descripción General';
  }

  // Mostrar el modal
  dom.detailsModal.classList.add('show');

  // Guardar el contexto
  appState.modalType = type;
  appState.modalItemIndex = index;
}

// Botones detalles
if (dom.btnCloseDetails) {
  dom.btnCloseDetails.onclick = () => {
    dom.detailsModal.classList.remove('show');
  };
}
if (dom.btnEditDetails) {
  dom.btnEditDetails.onclick = () => {
    dom.detailsModal.classList.remove('show');
    openModal(appState.modalType, appState.modalItemIndex);
  };
}
if (dom.btnDeleteDetails) {
  dom.btnDeleteDetails.onclick = async () => {
    if (!confirm(`¿Estás seguro de que quieres eliminar "${appState.projects[appState.currentProjectIndex][appState.modalType][appState.modalItemIndex].name}"?`)) return;

    const project = appState.projects[appState.currentProjectIndex];
    project[appState.modalType].splice(appState.modalItemIndex, 1);
    await saveProjects();
    renderProjectDetails();
    dom.detailsModal.classList.remove('show');
  };
}

if (dom.projectSummary) {
    let saveTimeout;
    dom.projectSummary.oninput = () => {
        const project = appState.projects[appState.currentProjectIndex];
        if (project) {
            project.descripcionLarga = dom.projectSummary.value;
            // Usar un timeout para no guardar en cada pulsación de tecla
            clearTimeout(saveTimeout);
            saveTimeout = setTimeout(() => {
                saveProjects();
            }, 500); // Guardar 500ms después de la última pulsación
        }
    };
}

if (dom.btnOpenCoverGenerator) {
    dom.btnOpenCoverGenerator.onclick = () => {
        const project = appState.projects[appState.currentProjectIndex];
        if (!project) return;

        // Cargar la portada actual en la vista previa del modal
        if (project.coverImage) {
            dom.coverPreviewInModal.innerHTML = `<img src="${project.coverImage}" class="w-full h-full object-contain">`;
        } else {
            dom.coverPreviewInModal.innerHTML = `<i class="fas fa-image text-4xl"></i>`;
        }

        dom.coverGeneratorModal.classList.add('show');
    };
}

if (dom.btnCancelCoverGeneration) {
    dom.btnCancelCoverGeneration.onclick = () => {
        dom.coverGeneratorModal.classList.remove('show');
    };
}

if (dom.btnGenerateProjectCover) {
    dom.btnGenerateProjectCover.onclick = async () => {
        const project = appState.projects[appState.currentProjectIndex];
        if (!project) return;

        const summary = dom.projectSummary.value;
        if (!summary || summary.trim().length < 20) {
            alert('Por favor, escribe un resumen del proyecto de al menos 20 caracteres para generar una portada significativa.');
            return;
        }

        const style = dom.coverImageStyle.value;
        const service = dom.coverImageService.value;

        // Definir prompts para cada estilo de portada
        const coverStylePrompts = {
            'default': 'dark fantasy, epic book cover, cinematic digital art, high detail, trending on artstation',
            'futuristic': 'sci-fi book cover, futuristic, cyberpunk, neon lights, advanced technology, cinematic',
            'modern': 'modern thriller book cover, realistic, 4k photo, contemporary, cinematic lighting',
            'vintage': 'vintage book cover, old photo, retro style, sepia tones, film grain',
            'surreal': 'surrealist book cover, abstract, dreamlike, bizarre, imaginative',
            'minimalist': 'minimalist book cover, clean, simple, vector art, plain background',
            'steampunk': 'steampunk book cover, gears, cogs, brass, victorian, intricate machinery',
            'blueprint': 'technical blueprint book cover, schematic, grid lines, clean, architectural plan'
        };
        const selectedStylePrompt = coverStylePrompts[style] || coverStylePrompts['default'];

        dom.btnGenerateProjectCoverText.textContent = 'Generando...';
        dom.projectCoverSpinner.classList.remove('hidden');
        dom.btnGenerateProjectCover.disabled = true;

        try {
            const prompt = `for a story titled "${project.name}", the story is about: ${summary.split(' ').slice(0, 40).join(' ')}, style: ${selectedStylePrompt}, variation ${Math.random()}`;
            let imageUrl;
            if (service === 'stablediffusion') {
                imageUrl = `https://incredibly-fast-image-processing.workers.dev/generate?prompt=${encodeURIComponent(prompt)}`;
            } else {
                imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;
            }
            const base64data = await urlToBase64(imageUrl);

            project.coverImage = base64data;
            await saveProjects();
            renderProjectCover(project);
            dom.coverGeneratorModal.classList.remove('show'); // Cerrar modal al terminar
        } catch (error) {
            console.error("Error al generar la portada:", error);
            alert("Hubo un error al generar la portada. Por favor, revisa la consola para más detalles.");
        } finally {
            dom.btnGenerateProjectCoverText.textContent = 'Generar Nueva Portada';
            dom.projectCoverSpinner.classList.add('hidden');
            dom.btnGenerateProjectCover.disabled = false;
        }
    };
}

// --- Lógica para el botón de eliminar imagen del mapa ---
function updateMapPreviewUI(hasImage) {
    const btnDelete = dom.btnDeleteMapImage;
    if (!btnDelete) return;

    if (hasImage) {
        btnDelete.classList.remove('hidden');
        appState.currentMapDataBase64 = dom.mapPreview.querySelector('img')?.src || null;
    } else {
        btnDelete.classList.add('hidden');
        dom.mapPreview.innerHTML = `<i class="fas fa-map text-3xl"></i>`;
        dom.inputPlaceMap.value = ''; // Asegura que el input file se reinicie
    }
}

if (dom.btnDeleteMapImage) {
    dom.btnDeleteMapImage.onclick = () => {
        updateMapPreviewUI(false);
        appState.currentMapDataBase64 = null;
    };
}

// --- Generador de Mapas con IA ---
if (dom.btnGenerateMap) {
    dom.btnGenerateMap.onclick = async () => {
        const name = dom.inputName.value;
        const typeValue = dom.inputPlaceType.value;
        const typeText = dom.inputPlaceType.options[dom.inputPlaceType.selectedIndex].text;
        const atmosphere = dom.inputAtmosphere.value;
        const keyFeatures = dom.inputKeyFeatures.value;
        const description = dom.inputDescription.value;

        if (!name) {
            alert('Por favor, introduce al menos un nombre para el lugar antes de generar un mapa.');
            return;
        }

        dom.btnGenerateMapText.textContent = 'Generando...';
        dom.mapSpinner.classList.remove('hidden');
        dom.btnGenerateMap.disabled = true;

        try {
            const style = dom.inputMapStyle.value;
            const service = dom.inputMapService.value;

            // Construir un prompt detallado y dinámico
            let prompt = `map of ${typeText}, ${name}`;
            if (atmosphere) prompt += `, ${atmosphere.split(' ').slice(0, 5).join(' ')}`;
            if (keyFeatures) prompt += `, features: ${keyFeatures.split(' ').slice(0, 8).join(' ')}`;
            if (description) prompt += `, ${description.split(' ').slice(0, 10).join(' ')}`;

            // Lógica de estilos de mapa
            const mapStylePrompts = {
                'satellite': 'realistic top-down satellite view, high-resolution, no text labels, epic',
                'fantasy': 'fantasy map, hand-drawn style, detailed, cartography, Tolkien style, no text',
                'blueprint': 'blueprint schematic, technical drawing, grid lines, clean, architectural plan',
                'ancient': 'ancient parchment map, old paper texture, compass rose, sea monsters, sepia tones',
                'cyberpunk': 'cyberpunk city map, neon grid, holographic, futuristic, glowing lines'
            };
            const selectedStylePrompt = mapStylePrompts[style] || mapStylePrompts['satellite'];
            prompt += `, ${selectedStylePrompt}`;
            
            // Añadir un elemento aleatorio para evitar obtener la misma imagen
            prompt += ` seed: ${Math.random()}`;

            let imageUrl;
            if (service === 'stablediffusion') { // Corregido el typo 'stablediffusions'
                imageUrl = `https://incredibly-fast-image-processing.workers.dev/generate?prompt=${encodeURIComponent(prompt)}`;
            } else {
                imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;
            }

            // Para poder guardarlo en base64, necesitamos buscar la imagen y convertirla.
            const response = await fetch(imageUrl);
            if (!response.ok) {
                throw new Error(`La API de generación de imágenes devolvió un error: ${response.statusText}`);
            }
            const imageBlob = await response.blob();

            const reader = new FileReader();
            reader.readAsDataURL(imageBlob);
            reader.onloadend = () => {
                const base64data = reader.result;
                appState.currentMapDataBase64 = base64data;
                dom.mapPreview.innerHTML = `<img src="${base64data}" class="w-full h-full object-cover rounded-lg">`;
                updateMapPreviewUI(true);
            };
        } catch (error) {
            console.error('Error al generar el mapa:', error);
            alert(`Hubo un error al generar el mapa: ${error.message}. Por favor, inténtalo de nuevo.`);
            updateMapPreviewUI(false);
        } finally {
            dom.btnGenerateMapText.textContent = 'Generar Mapa con IA';
            dom.mapSpinner.classList.add('hidden');
            dom.btnGenerateMap.disabled = false;
        }
    };
}

// --- NUEVO: Generador de Imágenes Genérico con IA ---
if (dom.btnGenerateImage) {
    dom.btnGenerateImage.onclick = async () => {
        if (!appState.modalType) return;

        let prompt = '';
        const name = dom.inputName.value;
        const description = dom.inputDescription.value;
        const style = dom.inputImageStyle.value;
        const service = dom.inputImageService.value;

        // Definir prompts para cada estilo
        const stylePrompts = {
            'default': 'dark fantasy, epic digital art',
            'futuristic': 'futuristic, sci-fi, cyberpunk, neon lights, advanced technology, cinematic',
            'modern': 'modern, realistic, 4k photo, contemporary, cinematic lighting',
            'vintage': 'vintage, old photo, retro style, sepia tones, film grain',
            'dynamic': 'dynamic action shot, motion blur, cinematic, intense',
            'surreal': 'surreal, abstract, dreamlike, bizarre, imaginative',
            'blueprint': 'blueprint schematic, technical drawing, grid lines, clean, architectural plan',
            'minimalist': 'minimalist, clean, simple, vector art, plain background',
            'biological': 'biological, organic, cellular structures, microscopic view, anatomical, vibrant, detailed',
            'chemical': 'chemical reaction, abstract, molecular, flowing liquids, vibrant colors, scientific illustration',
            'steampunk': 'steampunk, gears, cogs, brass, victorian, intricate machinery, detailed'
        };
        const selectedStylePrompt = stylePrompts[style] || stylePrompts['default'];

        // Construir el prompt basado en el tipo de ítem
        switch (appState.modalType) {
            case 'chapters':
                prompt = `chapter cover, title "${name}", ${description.split(' ').slice(0, 15).join(' ')}, evocative, mysterious, ${selectedStylePrompt}`;
                break;
            case 'characters':
                const age = dom.inputAge.value;
                const gender = dom.inputGender.value;
                const physical = dom.inputPhysicalDescription.value;
                prompt = `character portrait, ${name}, ${age || 'age not specified'}, ${gender}, physical description: ${physical.split(' ').slice(0, 20).join(' ')}, detailed, concept art, ${selectedStylePrompt}`;
                break;
            case 'objects':
                const objectType = dom.inputObjectType.value;
                const origin = dom.inputObjectOrigin.value;
                prompt = `object illustration, ${name}, type: ${objectType}, origin: ${origin.split(' ').slice(0, 10).join(' ')}, description: ${description.split(' ').slice(0, 15).join(' ')}, detailed, AAA video game item, ${selectedStylePrompt}`;
                break;
            default:
                alert("La generación de imágenes no está soportada para este tipo de elemento.");
                return;
        }

        // Añadir un elemento aleatorio para evitar obtener la misma imagen y evitar caché
        prompt += `, variation ${Math.random().toString(36).substring(7)}`;

        dom.btnGenerateImageText.textContent = 'Generando...';
        dom.imageSpinner.classList.remove('hidden');
        dom.btnGenerateImage.disabled = true;

        try {
            let imageUrl;
            if (service === 'stablediffusion') {
                imageUrl = `https://incredibly-fast-image-processing.workers.dev/generate?prompt=${encodeURIComponent(prompt)}`;
            } else {
                imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;
            }
            const base64data = await urlToBase64(imageUrl);
            appState.currentImageDataBase64 = base64data;
            dom.imagePreview.innerHTML = `<img src="${base64data}" class="w-full h-full object-cover" alt="Vista previa generada">`;
            dom.btnDeleteImage.classList.remove('hidden');
        } catch (error) {
            console.error("Error al generar imagen:", error);
            alert("Hubo un error al generar la imagen. Revisa la consola para más detalles.");
        } finally {
            dom.btnGenerateImageText.textContent = 'Generar Imagen con IA';
            dom.imageSpinner.classList.add('hidden');
            dom.btnGenerateImage.disabled = false;
        }
    };
}

// --- NUEVO: Lógica para eliminar imagen principal ---
if (dom.btnDeleteImage) {
    dom.btnDeleteImage.onclick = () => {
        appState.currentImageDataBase64 = null;
        dom.imagePreview.innerHTML = '<i class="fas fa-image text-3xl"></i>';
        dom.btnDeleteImage.classList.add('hidden');
        dom.inputImage.value = ''; // Limpiar el input de archivo
    };
}

// --- Lógica para intercambiar imágenes en el modal de lugares ---
function copyImage(sourcePreview, destPreview, destType) {
    const sourceImg = sourcePreview.querySelector('img');

    if (sourceImg && sourceImg.src) {
        const imageDataSource = sourceImg.src;
        destPreview.innerHTML = `<img src="${imageDataSource}" class="w-full h-full object-cover rounded-lg">`;

        if (destType === 'main') {
            appState.currentImageDataBase64 = imageDataSource;
            dom.btnDeleteImage.classList.remove('hidden');
        } else if (destType === 'map') {
            appState.currentMapDataBase64 = imageDataSource;
            updateMapPreviewUI(true);
        }
    } else {
        alert('La imagen de origen está vacía. No hay nada que copiar.');
    }
}

if (dom.btnUseMapAsMain) {
    dom.btnUseMapAsMain.onclick = () => copyImage(dom.mapPreview, dom.imagePreview, 'main');
}
if (dom.btnUseMainAsMap) {
    dom.btnUseMainAsMap.onclick = () => copyImage(dom.imagePreview, dom.mapPreview, 'map');
}

// --- Eventos principales ---
if (dom.btnNuevoProyecto) dom.btnNuevoProyecto.onclick = () => newProject();
if (dom.btnCrearInicial) dom.btnCrearInicial.onclick = () => newProject();

if (dom.btnEditarNombre) {
  dom.btnEditarNombre.onclick = async () => {
    const p = appState.projects[appState.currentProjectIndex];
    if (!p) return;
    const name = prompt('Nuevo nombre:', p.name);
    if (!name) return;
    p.name = name;
    await saveProjects();
    renderProjectsList();
    renderProjectDetails();
  };
}

if (dom.btnEliminarProyecto) {
  dom.btnEliminarProyecto.onclick = async () => {
    if (!confirm('¿Eliminar este proyecto?')) return;
    appState.projects.splice(appState.currentProjectIndex, 1);
    await saveProjects();
    renderProjectsList();
    if (appState.projects.length > 0) selectProject(0);
    else showWelcomeScreen();
  };
}

// --- Dashboard ----

// --- Accesos rápidos desde el Dashboard ---
if (dom.totalChapters) addSafeEventListener(dom.totalChapters.parentElement, () => openTab("chapters"));
if (dom.totalCharacters) addSafeEventListener(dom.totalCharacters.parentElement, () => openTab("characters"));
if (dom.totalPlaces) addSafeEventListener(dom.totalPlaces.parentElement, () => openTab("places"));
if (dom.totalObjects) addSafeEventListener(dom.totalObjects.parentElement, () => openTab("objects"));

function createMindMapLegendPanel() {
    const legendContainer = document.createElement('div');
    legendContainer.id = 'mindMapLegendPanel';
    legendContainer.className = 'hidden absolute top-full right-0 mt-2 bg-gray-800 bg-opacity-95 p-4 rounded-lg shadow-lg z-20 text-white text-xs w-48';

    const title = document.createElement('h4');
    title.className = 'font-bold mb-2 text-sm border-b border-gray-600 pb-1';
    title.textContent = 'Leyenda de Nodos';
    legendContainer.appendChild(title);

    const legendItems = {
        'Capítulos': { border: '#60a5fa', background: '#1e40af' },
        'Personajes': { border: '#f87171', background: '#7f1d1d' },
        'Lugares': { border: '#4ade80', background: '#166534' },
        'Objetos': { border: '#fbbf24', background: '#854d0e' }
    };

    for (const [name, colors] of Object.entries(legendItems)) {
        const item = document.createElement('div');
        item.className = 'flex items-center mb-1';
        const colorBox = document.createElement('div');
        colorBox.className = 'w-4 h-4 rounded-sm mr-2 flex-shrink-0';
        colorBox.style.backgroundColor = colors.background;
        colorBox.style.border = `1px solid ${colors.border}`;
        item.appendChild(colorBox);
        const label = document.createElement('span');
        label.textContent = name;
        item.appendChild(label);
        legendContainer.appendChild(item);
    }
    
    return legendContainer;
}

// --- Lógica del Mapa Mental ---
function initMindMap(project) {
  if (!project || typeof vis === 'undefined') {
    dom.mindMapContainer.innerHTML = '<div class="p-8 text-center text-gray-500">La librería del mapa mental no se ha cargado. Revisa tu conexión a internet.</div>';
    return;
  }

  // Destruir instancia anterior para evitar duplicados
  if (appState.mindMapNetwork) {
    appState.mindMapNetwork.destroy();
    appState.mindMapNetwork = null;
  }

  const nodes = new vis.DataSet(project.mindMap.nodes);
  const edges = new vis.DataSet(project.mindMap.edges);

  const data = { nodes, edges };

  const options = {
    locale: 'es',
    interaction: {
      navigationButtons: true,
      keyboard: true
    },
    physics: {
        enabled: true,
        barnesHut: {
            gravitationalConstant: -4000, // Reducido para evitar que los nodos se dispersen demasiado
            centralGravity: 0.3,
            springLength: 120,
            springConstant: 0.04,
            damping: 0.09,
            avoidOverlap: 0.2
        },
        minVelocity: 0.75,
        solver: 'barnesHut'
    },
    manipulation: {
      enabled: true,
      initiallyActive: true,
      addNode: async (nodeData, callback) => {
        nodeData.label = prompt("Nombre del nuevo nodo:", "Nuevo Nodo");
        if (nodeData.label) {
          nodeData.id = new Date().getTime().toString();
          project.mindMap.nodes.push(nodeData);
          await saveProjects();
          callback(nodeData);
        } else {
          callback(null);
        }
      },
      editNode: async (nodeData, callback) => {
        nodeData.label = prompt("Nuevo nombre:", nodeData.label);
        if (nodeData.label !== null) {
          const nodeInState = project.mindMap.nodes.find(n => n.id == nodeData.id);
          if (nodeInState) nodeInState.label = nodeData.label;
          await saveProjects();
          callback(nodeData);
        } else {
          callback(null);
        }
      },
      addEdge: async (edgeData, callback) => {
        if (edgeData.from !== edgeData.to) {
          edgeData.label = prompt("Descripción de la relación (opcional):", "");
          project.mindMap.edges.push(edgeData);
          await saveProjects();
          callback(edgeData);
        } else {
          callback(null);
        }
      },
      deleteNode: async (data, callback) => {
        project.mindMap.nodes = project.mindMap.nodes.filter(n => !data.nodes.includes(String(n.id)));
        project.mindMap.edges = project.mindMap.edges.filter(e => !data.edges.includes(String(e.id)));
        await saveProjects();
        callback(data);
      },
      deleteEdge: async (data, callback) => {
        project.mindMap.edges = project.mindMap.edges.filter(e => !data.edges.includes(String(e.id)));
        await saveProjects();
        callback(data);
      },
    },
    nodes: {
        shape: 'box',
        margin: 10,
        font: {
            color: '#e2e8f0'
        },
        color: {
            border: '#6366f1',
            background: '#2c3e50',
            highlight: {
                border: '#a5b4fc',
                background: '#4f46e5'
            }
        }
    },
    edges: {
        color: '#a0aec0',
        arrows: 'to'
    }
  };

  appState.mindMapNetwork = new vis.Network(dom.mindMapContainer, data, options);

  // --- Creación y gestión de botones y paneles desplegables ---
  const buttonContainer = dom.btnGenerateMindMap.parentNode;
  if (!buttonContainer) return;

  buttonContainer.style.position = 'relative'; // Necesario para los paneles absolutos

  // Limpiar controles dinámicos de ejecuciones anteriores
  document.getElementById('btnTogglePhysicsControls')?.remove();
  document.getElementById('btnToggleMindMapLegend')?.remove();
  document.getElementById('physicsControlsPanel')?.remove();
  document.getElementById('mindMapLegendPanel')?.remove();

  // Homogeneizar estilos de botones
  const buttonBaseClass = 'bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm flex items-center justify-center';
  dom.btnGenerateMindMap.className = buttonBaseClass;
  dom.btnLinkNodes.className = buttonBaseClass;

  // --- Panel y Botón de Leyenda ---
  const legendPanel = createMindMapLegendPanel();
  const legendToggleButton = document.createElement('button');
  legendToggleButton.id = 'btnToggleMindMapLegend';
  legendToggleButton.innerHTML = '<i class="fas fa-palette mr-2"></i> Leyenda';
  legendToggleButton.className = buttonBaseClass;
  buttonContainer.appendChild(legendToggleButton);
  buttonContainer.appendChild(legendPanel);

  // --- Panel y Botón de Física ---
  const physicsPanel = createPhysicsControlsPanel();
  const physicsToggleButton = document.createElement('button');
  physicsToggleButton.id = 'btnTogglePhysicsControls';
  physicsToggleButton.innerHTML = '<i class="fas fa-sliders-h mr-2"></i> Ajustar Física';
  physicsToggleButton.className = buttonBaseClass;
  buttonContainer.appendChild(physicsToggleButton);
  buttonContainer.appendChild(physicsPanel);

  // Asignar eventos a los botones de toggle
  legendToggleButton.onclick = (e) => {
      e.stopPropagation();
      legendPanel.classList.toggle('hidden');
      physicsPanel.classList.add('hidden'); // Ocultar el otro panel
  };

  physicsToggleButton.onclick = (e) => {
      e.stopPropagation();
      physicsPanel.classList.toggle('hidden');
      legendPanel.classList.add('hidden'); // Ocultar el otro panel
  };

  // Evento para mostrar detalles al hacer clic en un nodo
  appState.mindMapNetwork.on('click', function(params) {
    if (params.nodes.length > 0) {
        const nodeId = params.nodes[0];
        const node = data.nodes.get(nodeId);

        if (node && node.refId) {
            const firstHyphenIndex = node.refId.indexOf('-');
            if (firstHyphenIndex > -1) {
                const category = node.refId.substring(0, firstHyphenIndex);
                const name = node.refId.substring(firstHyphenIndex + 1);
                const items = project[category];
                if (items) {
                    const itemIndex = items.findIndex(item => item.name === name);
                    if (itemIndex !== -1) {
                        showDetails(category, itemIndex);
                    }
                }
            }
        }
    }
  });
}

function createPhysicsControlsPanel() {
    const project = appState.projects[appState.currentProjectIndex];
    if (!project || !appState.mindMapNetwork) return null;

    const controlsContainer = document.createElement('div');
    controlsContainer.id = 'physicsControlsPanel';
    controlsContainer.className = 'hidden absolute top-full right-0 mt-2 bg-gray-800 bg-opacity-95 p-4 rounded-lg shadow-lg z-20 text-white text-xs w-64';

    const title = document.createElement('h4');
    title.className = 'font-bold mb-2 text-sm border-b border-gray-600 pb-1';
    title.textContent = 'Ajustes de Física';
    controlsContainer.appendChild(title);

    const physicsOptions = appState.mindMapNetwork.options.physics || {};
    const barnesHutOptions = physicsOptions.barnesHut || {
        // Provide default values as a fallback, matching those in initMindMap
        gravitationalConstant: -4000,
        centralGravity: 0.3,
        springLength: 120,
        springConstant: 0.04,
        damping: 0.09,
        avoidOverlap: 0.2
    };

    const createControlRow = (label, key, value, step, min, max) => {
        const row = document.createElement('div');
        row.className = 'flex justify-between items-center mb-1';
 
        const labelEl = document.createElement('label');
        labelEl.textContent = label;
        labelEl.className = 'flex-1';
        row.appendChild(labelEl);
 
        const valueContainer = document.createElement('div');
        valueContainer.className = 'flex items-center gap-2';
 
        let intervalId = null;
 
        const startChangingValue = (change) => {
            if (intervalId) return; // Evitar múltiples intervalos
            updatePhysics(key, change, min, max); // Cambio inmediato al hacer clic
            intervalId = setInterval(() => {
                updatePhysics(key, change, min, max);
            }, 100); // Repetir cada 100ms
        };
 
        const stopChangingValue = () => {
            clearInterval(intervalId);
            intervalId = null;
        };
 
        const minusBtn = document.createElement('button');
        minusBtn.textContent = '-';
        minusBtn.className = 'bg-indigo-500 hover:bg-indigo-600 rounded-full w-5 h-5 flex items-center justify-center font-mono select-none';
        minusBtn.addEventListener('mousedown', () => startChangingValue(-step));
        minusBtn.addEventListener('mouseup', stopChangingValue);
        minusBtn.addEventListener('mouseleave', stopChangingValue);
        minusBtn.addEventListener('touchstart', (e) => { e.preventDefault(); startChangingValue(-step); });
        minusBtn.addEventListener('touchend', stopChangingValue);
        minusBtn.addEventListener('touchcancel', stopChangingValue);
        valueContainer.appendChild(minusBtn);
 
        const valueSpan = document.createElement('span');
        valueSpan.id = `physics-value-${key}`;
        valueSpan.textContent = value.toFixed(2);
        valueSpan.className = 'w-10 text-center font-mono';
        valueContainer.appendChild(valueSpan);
 
        const plusBtn = document.createElement('button');
        plusBtn.textContent = '+';
        plusBtn.className = 'bg-indigo-500 hover:bg-indigo-600 rounded-full w-5 h-5 flex items-center justify-center font-mono select-none';
        plusBtn.addEventListener('mousedown', () => startChangingValue(step));
        plusBtn.addEventListener('mouseup', stopChangingValue);
        plusBtn.addEventListener('mouseleave', stopChangingValue);
        plusBtn.addEventListener('touchstart', (e) => { e.preventDefault(); startChangingValue(step); });
        plusBtn.addEventListener('touchend', stopChangingValue);
        plusBtn.addEventListener('touchcancel', stopChangingValue);
        valueContainer.appendChild(plusBtn);
 
        row.appendChild(valueContainer);
        controlsContainer.appendChild(row);
    };

    createControlRow('Gravedad', 'gravitationalConstant', barnesHutOptions.gravitationalConstant, 250, -100000, 0);
    createControlRow('Grav. Central', 'centralGravity', barnesHutOptions.centralGravity, 0.02, 0, 5);
    createControlRow('Long. Muelle', 'springLength', barnesHutOptions.springLength, 5, 10, 1200);
    createControlRow('Const. Muelle', 'springConstant', barnesHutOptions.springConstant, 0.005, 0.01, 2);
    createControlRow('Amortiguación', 'damping', barnesHutOptions.damping, 0.005, 0, 1);
    createControlRow('Solapamiento', 'avoidOverlap', barnesHutOptions.avoidOverlap, 0.02, 0, 5);

    const reenableButton = document.createElement('button');
    reenableButton.textContent = 'Re-estabilizar Nodos';
    reenableButton.className = 'w-full bg-green-600 hover:bg-green-700 text-white text-xs py-1 mt-2 rounded';
    addSafeEventListener(reenableButton, () => {
        if (appState.mindMapNetwork) {
            appState.mindMapNetwork.setOptions({ physics: { enabled: true } });
        }
    });
    controlsContainer.appendChild(reenableButton);

    return controlsContainer;
}

function updatePhysics(key, change, min, max) {
    if (!appState.mindMapNetwork) return;

    // Corrected: vis.js Network object uses the .options property, not a getOptions() method.
    // We read the current value from the live options.
    const currentOptions = appState.mindMapNetwork.options;
    const currentPhysicsOptions = currentOptions.physics || {};
    const currentBarnesHutOptions = currentPhysicsOptions.barnesHut || {};

    // Get current value, or a default if it's not defined
    let currentValue = currentBarnesHutOptions[key];
    if (typeof currentValue !== 'number') {
        const defaultOptions = {
            gravitationalConstant: -4000,
            centralGravity: 0.3,
            springLength: 120,
            springConstant: 0.04,
            damping: 0.09,
            avoidOverlap: 0.2
        };
        currentValue = defaultOptions[key] || 0;
    }

    let newValue = currentValue + change;

    // Clamp the value within min/max
    if (min !== undefined) newValue = Math.max(min, newValue);
    if (max !== undefined) newValue = Math.min(max, newValue);

    // FIX: Se crea un nuevo objeto con todas las opciones actuales de barnesHut y se actualiza solo la clave específica.
    // Esto evita que setOptions sobrescriba las demás configuraciones de física, ya que realiza una combinación superficial.
    const newBarnesHutOptions = { ...currentBarnesHutOptions, [key]: newValue };
    appState.mindMapNetwork.setOptions({ physics: { enabled: true, barnesHut: newBarnesHutOptions } });

    // Update the displayed value
    const valueSpan = document.getElementById(`physics-value-${key}`);
    if (valueSpan) {
        valueSpan.textContent = newValue.toFixed(2);
    }
}

async function generateMindMapFromContent() {
    const project = appState.projects[appState.currentProjectIndex];
    if (!project || !appState.mindMapNetwork) return;

    const nodes = appState.mindMapNetwork.body.data.nodes;
    const existingRefs = new Set(project.mindMap.nodes.map(n => n.refId).filter(Boolean));

    const addNodesForCategory = (category, items, color) => {
        items.forEach(item => {
            const refId = `${category}-${item.name}`;
            if (!existingRefs.has(refId)) {
                nodes.add({ label: item.name, group: category, refId, color });
                existingRefs.add(refId);
            }
        });
    };

    addNodesForCategory('chapters', project.chapters, { border: '#60a5fa', background: '#1e40af' });
    addNodesForCategory('characters', project.characters, { border: '#f87171', background: '#7f1d1d' });
    addNodesForCategory('places', project.places, { border: '#4ade80', background: '#166534' });
    addNodesForCategory('objects', project.objects, { border: '#fbbf24', background: '#854d0e' });

    project.mindMap.nodes = nodes.get(); // Actualizar el estado con los nodos del DataSet
    await saveProjects();
}

if (dom.sidebar && dom.sidebarToggle) {
  const toggleSidebar = (e) => {
    // Detiene la propagación para evitar que el listener del documento se active inmediatamente
    e.stopPropagation();
    dom.sidebar.classList.toggle('-translate-x-full');
  };

  dom.sidebarToggle.addEventListener('click', toggleSidebar);
  dom.sidebarToggle.addEventListener('touchend', (e) => {
    e.preventDefault(); // Previene el "ghost click" y el zoom no deseado
    toggleSidebar(e);
  });

  // Cierra el sidebar si se hace clic fuera de él en vista móvil
  const closeSidebarOnClickOutside = (e) => {
    const isClickInsideSidebar = dom.sidebar.contains(e.target);
    const isClickOnToggle = dom.sidebarToggle.contains(e.target);

    // Si el sidebar está abierto y el clic fue fuera de él y del botón de toggle
    if (!dom.sidebar.classList.contains('-translate-x-full') && !isClickInsideSidebar && !isClickOnToggle) {
      // Solo cierra si el botón de toggle es visible (estamos en móvil)
      if (getComputedStyle(dom.sidebarToggle).display !== 'none') {
        dom.sidebar.classList.add('-translate-x-full');
      }
    }
  };
  document.addEventListener('click', closeSidebarOnClickOutside);
  document.addEventListener('touchend', closeSidebarOnClickOutside);
}

// --- Botones Añadir ---
if (dom.btnAddChapter) dom.btnAddChapter.onclick = () => openModal('chapters');
if (dom.btnAddCharacter) dom.btnAddCharacter.onclick = () => openModal('characters');
if (dom.btnAddPlace) dom.btnAddPlace.onclick = () => openModal('places');
if (dom.btnAddObject) dom.btnAddObject.onclick = () => openModal('objects');

// --- Lógica de Pestañas Unificada ---
function openTab(tabName) {
    if (!tabName) return;

    // 1. Actualizar estado de los botones
    dom.tabButtons.forEach(b => b.classList.toggle('active', b.dataset.tab === tabName));

    // 2. Mostrar el contenido de la pestaña correcta
    dom.tabContents.forEach(c => c.classList.toggle('active', c.id === `tab-${tabName}`));

    // 3. Actualizar estado global
    appState.currentTab = tabName;

    // 4. Lógica especial para el mapa mental
    if (tabName === 'mindmap') {
        const project = appState.projects[appState.currentProjectIndex];
        initMindMap(project);
    }

    // 6. Lógica para la gestión de comentarios
    if (tabName === 'comments') {
        renderCommentsManagement();
    }

    // 5. Actualizar UI del dropdown móvil
    if (dom.tabsToggle && dom.currentTabName && dom.tabsNav) {
        const activeButton = document.querySelector(`.tab-button[data-tab="${tabName}"]`);
        if (activeButton) {
            dom.currentTabName.textContent = activeButton.textContent.trim();
        }
        // Ocultar el dropdown si estamos en vista móvil
        if (getComputedStyle(dom.tabsToggle).display !== 'none') {
            dom.tabsNav.classList.add('hidden');
        }
    }
}

async function renderCommentsManagement() {
    const container = dom.commentsManagementList;
    if (!container) return;

    container.innerHTML = '';

    // 1. Obtener todos los comentarios de la base de datos
    const allComments = await db.getAll('comments');

    // Crear un mapa para buscar nombres de proyectos eficientemente
    const projectNames = new Map(appState.projects.map(p => [p.id, p.name]));

    // Ordenar por fecha, los más nuevos primero
    allComments.sort((a, b) => b.timestamp - a.timestamp);

    if (allComments.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center py-8">No hay comentarios en ningún proyecto.</p>';
        return;
    }

    // 2. Renderizar cada comentario
    allComments.forEach(comment => {
        const commentCard = document.createElement('div');
        commentCard.className = 'bg-[#242424] p-4 rounded-lg border border-gray-700 flex flex-col md:flex-row justify-between items-start gap-4';
        const commentDate = new Date(comment.timestamp).toLocaleString('es-CO', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        const projectName = projectNames.get(comment.projectId) || 'Proyecto Desconocido';

        commentCard.innerHTML = `
            <div class="flex-grow">
                <p class="text-gray-300 whitespace-pre-wrap">"${comment.message}"</p>
                <p class="text-sm text-gray-500 mt-2">
                    Por <strong class="text-indigo-400">${comment.userEmail}</strong> en el proyecto 
                    <strong class="text-green-400">${projectName}</strong>
                    <span class="ml-2">(${commentDate})</span>
                </p>
            </div>
            <div class="flex-shrink-0 flex gap-2 mt-2 md:mt-0">
                <button class="delete-comment-btn bg-red-800 hover:bg-red-700 text-white text-xs py-1 px-3 rounded-md" data-comment-id="${comment.id}">
                    <i class="fas fa-trash-alt mr-1"></i> Eliminar
                </button>
            </div>
        `;
        container.appendChild(commentCard);
    });

    // 3. Añadir event listeners para los botones de eliminar (usando el ID del comentario)
    container.querySelectorAll('.delete-comment-btn').forEach(btn => {
        btn.onclick = async (e) => {
            const commentId = parseInt(e.currentTarget.dataset.commentId, 10);
            
            if (confirm('¿Estás seguro de que quieres eliminar este comentario permanentemente?')) {
                await db.delete('comments', commentId);
                renderCommentsManagement(); // Re-renderizar la lista
            }
        };
    });
}

// --- Asignación de Eventos ---

// 1. Asignar evento a todos los botones de pestaña
dom.tabButtons.forEach(btn => {
    const tabName = btn.dataset.tab;
    const handleEvent = (e) => { e.stopPropagation(); openTab(tabName); };
    btn.addEventListener('click', handleEvent);
    btn.addEventListener('touchend', (e) => { e.preventDefault(); handleEvent(e); });
});

// 2. Lógica para el dropdown móvil (solo abrir/cerrar)
if (dom.tabsToggle && dom.tabsNav) {
    const toggleTabsNav = (e) => { e.stopPropagation(); dom.tabsNav.classList.toggle('hidden'); };
    dom.tabsToggle.addEventListener('click', toggleTabsNav);
    dom.tabsToggle.addEventListener('touchend', (e) => { e.preventDefault(); toggleTabsNav(e); });

    // 3. Cerrar el dropdown si se hace clic/toca fuera de él
    const closeOnClickOutside = (e) => {
        if (!dom.tabsNav.contains(e.target) && !dom.tabsToggle.contains(e.target)) {
            dom.tabsNav.classList.add('hidden');
        }
    };
    document.addEventListener('click', closeOnClickOutside);
    document.addEventListener('touchend', closeOnClickOutside);
}

// --- MANEJO DE EVENTOS DEL MENÚ DE EXPORTACIÓN ---
if (dom.btnGenerateMindMap) dom.btnGenerateMindMap.onclick = generateMindMapFromContent;
if (dom.btnLinkNodes) {
    dom.btnLinkNodes.onclick = () => {
        if (appState.mindMapNetwork) {
            appState.mindMapNetwork.addEdgeMode();
        }
    };
}
const btnToggleExport = document.getElementById('btnToggleExport');
const exportOptions = document.getElementById('export-options');
const btnExportarJSON = document.getElementById('btnExportarJSON');
const btnExportarPDF = document.getElementById('btnExportarPDF');
const btnExportarHTML = document.getElementById('btnExportarHTML');
const btnExportarKDP = document.getElementById('btnExportarKDP');

if (btnToggleExport) {
    btnToggleExport.addEventListener('click', (e) => {
        e.stopPropagation();
        if (exportOptions) exportOptions.classList.toggle('hidden');
    });
}

document.addEventListener('click', (e) => {
    const container = document.getElementById('export-menu-container');
    if (container && !container.contains(e.target) && exportOptions) {
        exportOptions.classList.add('hidden');
    }
});

if (btnExportarJSON) {
    btnExportarJSON.addEventListener('click', (e) => {
        e.preventDefault();
        exportarProyectoJSON();
        if (exportOptions) exportOptions.classList.add('hidden');
    });
}

if (btnExportarPDF) {
    btnExportarPDF.addEventListener('click', async (e) => {
        e.preventDefault();
        const project = appState.projects[appState.currentProjectIndex];
        if (project) {
            const originalText = btnExportarPDF.innerHTML;
            btnExportarPDF.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Generando...';
            await exportProjectToPDF(project);
            btnExportarPDF.innerHTML = originalText;
        } else {
            alert('Por favor, selecciona un proyecto para exportar a PDF.');
        }
        if (exportOptions) exportOptions.classList.add('hidden');
    });
}

if (btnExportarHTML) {
    btnExportarHTML.addEventListener('click', async (e) => {
        e.preventDefault();
        const project = appState.projects[appState.currentProjectIndex];
        if (project) {
            await exportProjectToHTML(project);
        } else {
            alert('Por favor, selecciona un proyecto para exportar a HTML.');
        }
        if (exportOptions) exportOptions.classList.add('hidden');
    });
}

if (btnExportarKDP) {
    btnExportarKDP.addEventListener('click', async (e) => {
        e.preventDefault();
        const project = appState.projects[appState.currentProjectIndex];
        if (project) {
            await exportProjectToKDP(project);
        } else {
            alert('Por favor, selecciona un proyecto para exportar para KDP.');
        }
        if (exportOptions) exportOptions.classList.add('hidden');
    });
}

// --- Iniciar ---
loadProjects();

// --- Listener de Redimensionamiento Global ---
// Se asegura de que el mapa mental se reajuste si la ventana cambia de tamaño.
window.addEventListener('resize', () => {
    // Solo actuar si el mapa mental está visible
    if (appState.mindMapNetwork && appState.currentTab === 'mindmap') {
        // Usar un pequeño timeout para permitir que el layout se asiente antes de redibujar
        setTimeout(() => {
            // Volver a comprobar por si el usuario cambió de pestaña rápidamente
            if (appState.mindMapNetwork) appState.mindMapNetwork.fit();
        }, 200);
    }
});