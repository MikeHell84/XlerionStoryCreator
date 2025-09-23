document.addEventListener('DOMContentLoaded', () => {
    const DB_NAME = 'story-creator-db'; // CORREGIDO: Debe coincidir con el nombre en app.js
    const DB_VERSION = 2;
    let db;
    let allProjects = []; // Caché para todos los proyectos
    let currentProject = null; // Proyecto actualmente seleccionado
    let publicMindMapNetwork = null; // Instancia del mapa mental público

    let allComments = []; // Caché para todos los comentarios de los proyectos
    let commentSliderInterval; // Intervalo para el slider de comentarios

    const loadingScreen = document.getElementById('loading');
    const storyContent = document.getElementById('storyContent');
    const projectSelectionScreen = document.getElementById('projectSelectionScreen');
    const publicProjectList = document.getElementById('publicProjectList');
    const backToProjectsBtn = document.getElementById('backToProjectsBtn');
    const detailsModal = document.getElementById('detailsModal');
    const detailsTitle = document.getElementById('detailsTitle');
    const detailsBody = document.getElementById('detailsBody');
    const btnCloseDetails = document.getElementById('btnCloseDetails');

    // --- NUEVO: Selectores para contenido estático ---
    const staticContentModal = document.getElementById('staticContentModal');
    const staticContentTitle = document.getElementById('staticContentTitle');
    const staticContentBody = document.getElementById('staticContentBody');
    const btnCloseStaticContent = document.getElementById('btnCloseStaticContent');


    // --- NUEVO: Selectores y estado para el login ---
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const loginModal = document.getElementById('loginModal');
    const closeLoginModal = document.getElementById('closeLoginModal');
    const loginForm = document.getElementById('loginForm');
    const loginEmailInput = document.getElementById('loginEmailInput');
    const userInfo = document.getElementById('userInfo');
    const userEmailSpan = document.getElementById('userEmail');

    const ratingLoginPrompt = document.getElementById('ratingLoginPrompt');
    const detailsRatingLoginPrompt = document.getElementById('detailsRatingLoginPrompt');
    const commentLoginPrompt = document.getElementById('commentLoginPrompt');
    const commentForm = document.getElementById('commentForm');
    const commenterNameInput = document.getElementById('commenterName');

    const loginLinks = [
        document.getElementById('ratingLoginLink'),
        document.getElementById('detailsRatingLoginLink'),
        document.getElementById('commentLoginLink')
    ];

    let currentUserEmail = null;


    // --- Lógica de la Base de Datos ---

    async function openDB() {
        return idb.openDB(DB_NAME, DB_VERSION, {
            upgrade(db, oldVersion, newVersion, transaction) {
                // Esta función se ejecuta si la base de datos necesita ser creada o actualizada.
                if (!db.objectStoreNames.contains('projects')) {
                    db.createObjectStore('projects');
                }
                if (!db.objectStoreNames.contains('ratings')) {
                    const store = db.createObjectStore('ratings', { keyPath: 'id', autoIncrement: true });
                    // Índice único para asegurar que un usuario solo pueda calificar un ítem una vez.
                    store.createIndex('user_item', ['userEmail', 'itemId'], { unique: true });
                }
                if (!db.objectStoreNames.contains('comments')) {
                    const store = db.createObjectStore('comments', { keyPath: 'id', autoIncrement: true });
                    store.createIndex('by_project', 'projectId');
                    store.createIndex('by_user', 'userEmail');
                }
            }
        });
    }

    async function getAllProjects() {
        if (!db) {
            db = await openDB(); // Usa la nueva función con lógica de actualización
        }
        const projects = await db.get('projects', 'allProjects');
        return projects || [];
    }

    async function saveAllProjects(projects) {
        if (!db) {
            db = await openDB(); // Usa la nueva función con lógica de actualización
        }
        const tx = db.transaction('projects', 'readwrite');
        await tx.store.put(projects, 'allProjects');
        await tx.done;
    }

    // --- Lógica de Renderizado ---

    async function renderProject(project) {
        // Limpiar contenido anterior para evitar duplicados al cambiar de proyecto
        document.getElementById('chaptersList').innerHTML = '';
        document.getElementById('charactersList').innerHTML = '';
        document.getElementById('placesList').innerHTML = '';
        document.getElementById('objectsList').innerHTML = '';

        document.title = project.name;
        // Ocultar slider al ver un proyecto
        document.getElementById('image-slider-container').classList.add('hidden');
        document.getElementById('comment-slider-container').classList.add('hidden');

        document.getElementById('image-slider-container').classList.add('hidden');

        document.getElementById('projectTitle').textContent = project.name;

        const coverImg = document.getElementById('projectCover');
        if (project.coverImage) {
            coverImg.src = project.coverImage;
            coverImg.classList.remove('hidden');
        } else {
            coverImg.classList.add('hidden');
        }

        const summaryContainer = document.getElementById('projectSummaryContainer');
        if (project.descripcionLarga) {
            document.getElementById('projectSummary').textContent = project.descripcionLarga;
            summaryContainer.classList.remove('hidden');
        } else {
            summaryContainer.classList.add('hidden');
        }

        await renderSection(project.chapters, 'chaptersContainer', 'chaptersList', createChapterCard);
        await renderSection(project.characters, 'charactersContainer', 'charactersList', createGenericCard);
        await renderSection(project.places, 'placesContainer', 'placesList', createGenericCard);
        await renderSection(project.objects, 'objectsContainer', 'objectsList', createGenericCard);

        // Renderizar Calificación del Proyecto
        await renderRating(document.getElementById('projectRating'), project, 'project');

        // Renderizar Comentarios
        await renderComments(project);

        // Renderizar Mapa Mental
        const mindMapSection = document.getElementById('mindMapSection');
        if (project.mindMap && project.mindMap.nodes && project.mindMap.nodes.length > 0) {
            mindMapSection.classList.remove('hidden');
            initPublicMindMap(project);
        } else {
            mindMapSection.classList.add('hidden');
        }

        // Ocultar el loader y mostrar el contenido
        loadingScreen.classList.add('hidden');
        storyContent.classList.remove('hidden');
    }

    async function renderSection(items, containerId, listId, cardCreator) {
        if (items && items.length > 0) {
            const container = document.getElementById(containerId);
            const list = document.getElementById(listId);
            list.innerHTML = ''; // Limpiar lista antes de renderizar

            // Para capítulos, ordenar por el campo 'order'
            if (containerId === 'chaptersContainer') {
                items.sort((a, b) => (a.order || 0) - (b.order || 0));
            }

            for (const [index, item] of items.entries()) {
                const type = containerId.replace('Container', '');
                let card;
                if (cardCreator === createGenericCard) {
                    card = cardCreator(item, type);
                } else {
                    card = cardCreator(item);
                }
                // Asignar el click al contenedor principal de la tarjeta de forma segura
                card.addEventListener('click', () => showDetails(type, index));
                list.appendChild(card);

                // Renderizar la calificación dentro de la tarjeta
                const ratingPlaceholder = card.querySelector('.item-rating-placeholder');
                if (ratingPlaceholder) {
                    // Evitar que el click en las estrellas propague al contenedor de la tarjeta
                    ratingPlaceholder.onclick = (e) => e.stopPropagation();
                    await renderRating(ratingPlaceholder, item, type, index);
                }
            }
            container.classList.remove('hidden');
        }
    }

    function createChapterCard(chapter) {
        const card = document.createElement('div');
        card.className = 'content-card rounded-lg overflow-hidden flex flex-col cursor-pointer';

        let description = chapter.description || 'Sin descripción.';
        if (description.length > 100) {
            description = description.substring(0, 100) + '...';
        }

        const imageHTML = chapter.image
            ? `<img src="${chapter.image}" alt="${chapter.name}" class="w-full h-48 object-cover">`
            : `<div class="w-full h-48 bg-gray-700 flex items-center justify-center"><i class="fas fa-book-open text-4xl text-gray-500"></i></div>`;

        card.innerHTML = `
            ${imageHTML}
            <div class="p-4 flex-grow flex flex-col">
                <h4 class="text-lg font-bold text-white mb-2">${chapter.order ? `Capítulo ${chapter.order}: ` : ''}${chapter.name}</h4>
                <p class="text-sm text-gray-400 flex-grow">${description}</p>
                <!-- Contenedor para Calificación -->
                <div class="item-rating-placeholder mt-3"></div>
            </div>
        `;
        return card;
    }

    function createGenericCard(item, type) {
        const card = document.createElement('div');
        card.className = 'content-card rounded-lg overflow-hidden flex flex-col cursor-pointer';

        let description = item.description || 'Sin descripción.';
        if (description.length > 100) {
            description = description.substring(0, 100) + '...';
        }

        const imageHTML = item.image
            ? `<img src="${item.image}" alt="${item.name}" class="w-full h-48 object-cover">`
            : `<div class="w-full h-48 bg-gray-700 flex items-center justify-center"><i class="fas fa-image text-4xl text-gray-500"></i></div>`;

        card.innerHTML = `
            ${imageHTML}
            <div class="p-4 flex-grow flex flex-col">
                <h4 class="text-lg font-bold text-white mb-2">${item.name}</h4>
                <p class="text-sm text-gray-400 flex-grow">${description}</p>
                <!-- Contenedor para Calificación -->
                <div class="item-rating-placeholder mt-3"></div>
            </div>
        `;
        return card;
    }

    function renderProjectList() {
        publicProjectList.innerHTML = '';
        if (allProjects.length === 0) {
            publicProjectList.innerHTML = `<p class="col-span-full text-gray-400 text-lg">No se encontraron proyectos para mostrar.</p>`;
            return;
        }

        initImageSlider(); // Inicializar el slider con las imágenes de todos los proyectos

        allComments = []; // Limpiar comentarios antes de recargarlos

        allProjects.forEach(project => {
            const projectCard = document.createElement('button');
            projectCard.className = 'content-card p-4 rounded-lg text-left hover:bg-gray-700 hover:border-indigo-500 border-2 border-transparent transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 flex items-center gap-4';
            
            const imageHtml = project.coverImage
                ? `<img src="${project.coverImage}" alt="Portada de ${project.name}" class="w-16 h-24 object-cover rounded-md flex-shrink-0">`
                : `<div class="w-16 h-24 bg-gray-800 rounded-md flex-shrink-0 flex items-center justify-center"><i class="fas fa-book text-3xl text-gray-500"></i></div>`;

            projectCard.innerHTML = `
                ${imageHtml}
                <div class="flex-grow min-w-0"> <!-- min-w-0 es para que truncate funcione en un contenedor flex -->
                    <h3 class="text-xl font-bold text-white mb-2 truncate">${project.name}</h3>
                    <p class="text-sm text-gray-400">${project.chapters?.length || 0} capítulos, ${project.characters?.length || 0} personajes</p>
                </div>
            `;
            projectCard.addEventListener('click', () => selectAndRenderProject(project.id));
            publicProjectList.appendChild(projectCard);

            // Recolectar comentarios para el slider
            if (project.comments && project.comments.length > 0) {
                project.comments.forEach(comment => {
                    allComments.push({
                        message: comment.message,
                        author: comment.name,
                        projectName: project.name
                    });
                });
            }
        });
        startCommentSlider(); // Iniciar el slider de comentarios
    }

    function selectAndRenderProject(projectId) {
        const project = allProjects.find(p => p.id === projectId);
        if (project) {
            currentProject = project;
            projectSelectionScreen.classList.add('hidden');
            renderProject(project);
        }
    }

    function showProjectSelection() {
        storyContent.classList.add('hidden');
        projectSelectionScreen.classList.remove('hidden');
        document.title = "Selecciona un Proyecto"; // Resetear título

        // Mostrar slider si tiene contenido
        const imageSliderContainer = document.getElementById('image-slider-container');
        if (imageSliderContainer.querySelector('.slider-image')) {
            imageSliderContainer.classList.remove('hidden');
        }
        const commentSliderContainer = document.getElementById('comment-slider-container');
        if (allComments.length > 0) {
            commentSliderContainer.classList.remove('hidden');
        }
        // Reiniciar y mostrar el slider de comentarios si tiene contenido
        startCommentSlider();
    }

    async function showDetails(type, index) {
        if (!currentProject) return;
        const item = currentProject[type][index];
        if (!item) return;

        detailsTitle.textContent = item.name || item.titulo;
        
        let bodyHtml = '';

        if (item.image) {
            bodyHtml += `<img src="${item.image}" alt="${item.name || item.titulo}" class="w-full h-64 object-cover rounded-lg mb-6">`;
        }

        const createDetailSection = (title, content) => {
            if (!content || content.trim() === '') return '';
            return `
                <div class="mb-6">
                    <h4 class="font-bold text-xl mb-2 text-indigo-400">${title}</h4>
                    <p class="text-gray-300 whitespace-pre-wrap">${content}</p>
                </div>
            `;
        };

        bodyHtml += createDetailSection('Descripción', item.description);

        if (type === 'characters') {
            let detailsList = '';
            if (item.age) detailsList += `<li><strong>Edad:</strong> ${item.age}</li>`;
            if (item.height) detailsList += `<li><strong>Altura:</strong> ${item.height}</li>`;
            if (item.gender && item.gender !== 'no-especificado') detailsList += `<li><strong>Género:</strong> ${item.gender.charAt(0).toUpperCase() + item.gender.slice(1)}</li>`;
            
            if (detailsList) {
                bodyHtml += `<div class="mb-6"><h4 class="font-bold text-xl mb-2 text-indigo-400">Detalles</h4><ul class="list-disc list-inside text-gray-300">${detailsList}</ul></div>`;
            }

            bodyHtml += createDetailSection('Descripción Física', item.physicalDescription);
            bodyHtml += createDetailSection('Historia / Trasfondo', item.backstory);
        } else if (type === 'places') {
            bodyHtml += createDetailSection('Tipo de Lugar', item.placeType && item.placeType !== 'no-especificado' ? item.placeType.charAt(0).toUpperCase() + item.placeType.slice(1) : null);
            bodyHtml += createDetailSection('Atmósfera', item.atmosphere);
            bodyHtml += createDetailSection('Características Clave', item.keyFeatures);
            bodyHtml += createDetailSection('Historia / Lore', item.lore);
            if (item.mapImage) {
                bodyHtml += `
                    <div class="mt-6">
                        <h4 class="font-bold text-xl mb-2 text-indigo-400">Mapa del Lugar</h4>
                        <img src="${item.mapImage}" alt="Mapa de ${item.name}" class="w-full h-auto object-contain rounded-lg border border-gray-700">
                    </div>
                `;
            }
        } else if (type === 'objects') {
            bodyHtml += createDetailSection('Tipo de Objeto', item.objectType && item.objectType !== 'no-especificado' ? item.objectType.charAt(0).toUpperCase() + item.objectType.slice(1) : null);
            bodyHtml += createDetailSection('Origen', item.origin);
            bodyHtml += createDetailSection('Poderes', item.powers);
            bodyHtml += createDetailSection('Relevancia en la Trama', item.relevance);
        }

        detailsBody.innerHTML = bodyHtml;

        // Renderizar la calificación en el pie del modal
        const ratingContent = document.getElementById('detailsRatingContent');
        await renderRating(ratingContent, item, type, index);
        detailsModal.classList.remove('hidden');
    }

    // --- NUEVO: Lógica para el modal de contenido estático ---
    const staticContentData = {
        'about': {
            title: 'Acerca de Xlerion Stories',
            content: `
                <p><strong>Xlerion Story Creator</strong> es una plataforma innovadora diseñada para dar vida a tus mundos e historias interactivas. Nuestra misión es proporcionar a escritores, diseñadores de juegos y creadores de contenido las herramientas necesarias para construir narrativas complejas y compartirlas con el mundo.</p>
                <p>Desde la creación de personajes detallados y lugares evocadores hasta la construcción de tramas intrincadas con nuestro mapa mental, Xlerion te acompaña en cada paso del proceso creativo.</p>
                <p>Este proyecto nació de la pasión por contar historias y la creencia de que todos tienen un universo esperando ser descubierto. ¡Gracias por ser parte de nuestra comunidad!</p>
            `
        },
        'contact': {
            title: 'Contacto',
            content: `
                <p>¿Tienes preguntas, sugerencias o simplemente quieres saludar? ¡Nos encantaría saber de ti! Puedes encontrarnos en nuestras redes sociales:</p>
                <ul>
                    <li><strong>Twitter:</strong> <a href="https://twitter.com/XlerionUltimate" target="_blank" rel="noopener noreferrer">@XlerionUltimate</a></li>
                    <li><strong>LinkedIn:</strong> <a href="https://www.linkedin.com/company/xlerion" target="_blank" rel="noopener noreferrer">Xlerion en LinkedIn</a></li>
                    <li><strong>Patreon:</strong> <a href="https://www.patreon.com/c/xlerion" target="_blank" rel="noopener noreferrer">Apóyanos en Patreon</a></li>
                </ul>
                <p>Para asuntos más formales, puedes contactarnos a través de nuestro correo electrónico: <a href="mailto:contactus@xlerion.com">contactus@xlerion.com</a>.</p>
            `
        },
        'terms': {
            title: 'Términos de Servicio',
            content: `
                <p>Bienvenido a Xlerion Story Creator. Al utilizar nuestros servicios, aceptas los siguientes términos y condiciones:</p>
                <ol>
                    <li><strong>Uso del Servicio:</strong> Te comprometes a utilizar la plataforma de manera responsable y a no subir contenido ilegal, ofensivo o que infrinja derechos de autor.</li>
                    <li><strong>Propiedad del Contenido:</strong> Todo el contenido que creas en la plataforma (proyectos, personajes, historias) es de tu propiedad. Nos otorgas una licencia para mostrarlo en la vista pública si decides hacerlo.</li>
                    <li><strong>Disponibilidad del Servicio:</strong> Nos esforzamos por mantener la plataforma disponible, pero no garantizamos un servicio ininterrumpido. Podemos realizar mantenimientos que afecten temporalmente el acceso.</li>
                    <li><strong>Limitación de Responsabilidad:</strong> No somos responsables por la pérdida de datos. Te recomendamos realizar exportaciones periódicas de tus proyectos como respaldo.</li>
                </ol>
                <p>Nos reservamos el derecho de modificar estos términos en cualquier momento.</p>
            `
        },
        'privacy': {
            title: 'Política de Privacidad',
            content: `
                <p>Tu privacidad es importante para nosotros. Esta política explica qué datos recopilamos y cómo los usamos:</p>
                <ul>
                    <li><strong>Datos de la Cuenta:</strong> Para calificar y comentar, te pedimos una dirección de correo electrónico. Este correo se utiliza únicamente para identificarte y no se comparte con terceros.</li>
                    <li><strong>Datos de los Proyectos:</strong> Tus proyectos se almacenan localmente en tu navegador usando IndexedDB. No tenemos acceso a tus proyectos privados. Solo el contenido que marcas como público es visible para otros.</li>
                    <li><strong>Cookies y Almacenamiento Local:</strong> Usamos el almacenamiento local del navegador para guardar tu sesión (correo electrónico) y tus preferencias. No utilizamos cookies de seguimiento de terceros.</li>
                </ul>
                <p>Al utilizar la plataforma, aceptas la recopilación y el uso de información de acuerdo con esta política.</p>
            `
        }
    };

    function showStaticContentModal(type) {
        const content = staticContentData[type];
        if (!content || !staticContentModal) return;
        staticContentTitle.textContent = content.title;
        staticContentBody.innerHTML = content.content;
        staticContentModal.classList.remove('hidden');
    }

    // --- Lógica del Slider de Imágenes ---
    function initImageSlider() {
        const sliderContainer = document.getElementById('image-slider-container');
        const slider = document.getElementById('image-slider');
        let allImages = [];

        // Recolectar todas las imágenes de todos los proyectos
        allProjects.forEach(project => {
            ['chapters', 'characters', 'places', 'objects'].forEach(type => {
                if (project[type]) {
                    project[type].forEach(item => {
                        if (item.image) {
                            allImages.push(item.image);
                        }
                    });
                }
            });
        });

        if (allImages.length < 2) {
            sliderContainer.classList.add('hidden');
            return;
        }

        // Mezclar las imágenes
        allImages.sort(() => 0.5 - Math.random());
        // Limitar a un número razonable para el slider
        const sliderImages = allImages.slice(0, 10);

        slider.innerHTML = '';
        sliderImages.forEach((imgSrc, index) => {
            const img = document.createElement('img');
            img.src = imgSrc;
            img.className = 'slider-image';
            if (index === 0) {
                img.classList.add('active');
            }
            slider.appendChild(img);
        });

        sliderContainer.classList.remove('hidden');

        let currentSlide = 0;
        setInterval(() => {
            const slides = slider.querySelectorAll('.slider-image');
            if (slides.length === 0) return;
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 5000); // Cambia cada 5 segundos
    }

    // --- Lógica del Slider de Comentarios ---
    /**
     * Muestra un comentario aleatorio en el slider con un efecto de fundido.
     */
    function showRandomComment() {
        if (allComments.length === 0) return;

        const commentSlider = document.getElementById('comment-slider');
        if (!commentSlider) return;

        // Elige un comentario al azar
        const randomIndex = Math.floor(Math.random() * allComments.length);
        const comment = allComments[randomIndex];

        // Crea el nuevo elemento de comentario
        const newSlide = document.createElement('div');
        newSlide.className = 'comment-slide flex flex-col justify-center';
        newSlide.innerHTML = `
            <p class="text-xl italic text-gray-200">"${comment.message}"</p>
            <p class="text-right text-sm text-gray-400 mt-2">- ${comment.author} en <span class="font-semibold text-indigo-400">${comment.projectName}</span></p>
        `;

        // Gestiona la transición de fundido
        const oldSlide = commentSlider.querySelector('.comment-slide.active');
        if (oldSlide) {
            oldSlide.classList.remove('active');
            // Elimina el slide antiguo después de que la transición termine para no acumular elementos
            setTimeout(() => {
                if (oldSlide.parentElement === commentSlider) {
                    commentSlider.removeChild(oldSlide);
                }
            }, 700); // Debe coincidir con la duración de la transición en CSS
        }

        commentSlider.appendChild(newSlide);
        // Forzar un 'reflow' del navegador para que la transición se aplique correctamente al nuevo elemento
        void newSlide.offsetWidth; 
        newSlide.classList.add('active');
    }

    /**
     * Inicializa el slider de comentarios, mostrándolo si hay comentarios disponibles.
     */
    function startCommentSlider() {
        const container = document.getElementById('comment-slider-container');
        if (!container) return;

        if (allComments.length > 0) {
            container.classList.remove('hidden');
            if (commentSliderInterval) clearInterval(commentSliderInterval);
            showRandomComment();
            commentSliderInterval = setInterval(showRandomComment, 7000);
        } else {
            container.classList.add('hidden');
        }
    }

    // --- Lógica de Comentarios ---
    async function renderComments(project) {
        const commentsList = document.getElementById('commentsList');
        commentsList.innerHTML = '';

        const db = await openDB();
        const comments = await db.getAllFromIndex('comments', 'by_project', project.id);

        if (comments.length === 0) {
            commentsList.innerHTML = '<p class="text-gray-500 text-center">Aún no hay comentarios. ¡Sé el primero!</p>';
            return;
        }

        comments.sort((a, b) => b.timestamp - a.timestamp);

        comments.forEach(comment => {
            const commentEl = document.createElement('div');
            commentEl.className = 'bg-gray-800 p-5 rounded-lg';
            const commentDate = new Date(comment.timestamp).toLocaleString('es-CO', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
            commentEl.innerHTML = `
                <div class="flex justify-between items-center mb-2">
                    <p class="font-bold text-indigo-400">${comment.userEmail}</p>
                    <p class="text-xs text-gray-500">${commentDate}</p>
                </div>
                <p class="text-gray-300 whitespace-pre-wrap">${comment.message}</p>
            `;
            commentsList.appendChild(commentEl);
        });
    }

    async function handleCommentSubmit(event) {
        event.preventDefault();
        if (!currentProject || !currentUserEmail) { // Doble chequeo
            showLoginModal();
            return;
        }

        const messageInput = document.getElementById('commentMessage');
        const message = messageInput.value.trim();

        if (!message) { alert('Por favor, escribe un mensaje.'); return; }

        const submitBtn = document.getElementById('submitCommentBtn');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Publicando...';

        try {
            const db = await openDB();

            // --- Lógica para limitar comentarios ---
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Inicio del día de hoy

            const userComments = await db.getAllFromIndex('comments', 'by_user', currentUserEmail);
            
            const commentsTodayCount = userComments.filter(comment => 
                comment.projectId === currentProject.id && new Date(comment.timestamp) >= today
            ).length;

            if (commentsTodayCount >= 3) {
                alert('Has alcanzado el límite de 3 comentarios por día para este proyecto.');
                return; // No se guarda el comentario
            }
            // --- Fin de la lógica de límite ---

            const newComment = {
                projectId: currentProject.id,
                userEmail: currentUserEmail,
                message: message,
                timestamp: Date.now(),
            };

            await db.add('comments', newComment);

            // Recargar y mostrar los comentarios actualizados
            await renderComments(currentProject);
            messageInput.value = '';

        } catch (error) {
            console.error('Error al guardar el comentario:', error);
            alert('No se pudo publicar el comentario.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Publicar Comentario';
        }
    }

    // --- Lógica de Calificación (Rating) ---

    /**
     * Gets the list of rated item IDs for a given project from localStorage.
     * @param {string} projectId
     * @param {number[]} ratings - Array de números (1-5).
     * @returns {{average: number, count: number}}
     */
    function getAverageRating(ratings = []) {
        if (!Array.isArray(ratings) || ratings.length === 0) {
            return { average: 0, count: 0 };
        }
        const sum = ratings.reduce((acc, rating) => acc + rating, 0);
        return {
            average: sum / ratings.length,
            count: ratings.length
        };
    }

    /**
     * Renderiza un componente de calificación de 5 estrellas.
     * @param {HTMLElement} container - El elemento donde se renderizarán las estrellas.
     * @param {object} item - El objeto del proyecto o elemento con una propiedad 'ratings'.
     * @param {string} itemType - 'project', 'chapters', 'characters', etc.
     * @param {number|null} itemIndex - El índice del elemento si no es un proyecto.
     */
    async function renderRating(container, item, itemType, itemIndex = null) {
        if (!container || !item) return;

        // ID único global para el elemento calificable
        const itemId = itemIndex !== null ? `${currentProject.id}-${itemType}-${itemIndex}` : `${currentProject.id}-project`;

        let hasBeenRated = false;
        if (currentUserEmail) {
            const db = await openDB();
            // Comprueba si ya existe una calificación para este usuario y este ítem
            const rating = await db.getFromIndex('ratings', 'user_item', [currentUserEmail, itemId]);
            hasBeenRated = !!rating;
        }

        const { average, count } = getAverageRating(item.ratings || []);
        const roundedAverage = Math.round(average);

        let starsHTML = '';
        for (let i = 1; i <= 5; i++) {
            const isFilled = i <= roundedAverage;
            starsHTML += `<i class="star fas fa-star ${isFilled ? 'filled' : ''}" data-value="${i}"></i>`;
        }
        
        // Las estrellas son interactivas solo si el usuario ha iniciado sesión Y no ha calificado este ítem.
        const isClickable = currentUserEmail && !hasBeenRated;

        container.innerHTML = `
            <div class="rating-stars ${!isClickable ? 'rated' : ''}" data-item-type="${itemType}" data-item-id="${itemId}" ${itemIndex !== null ? `data-item-index="${itemIndex}"` : ''}>
                ${starsHTML}
            </div>
            <span class="rating-average">(${average.toFixed(1)} de ${count} ${count === 1 ? 'voto' : 'votos'})</span>
            ${hasBeenRated ? '<span class="text-xs text-green-400 ml-2">¡Ya calificaste!</span>' : ''}
        `;
    }

    /**
     * Maneja el envío de una nueva calificación.
     * @param {Event} event
     */
    async function handleRatingSubmit(event) {
        const star = event.target.closest('.rating-stars .star');
        if (!star) {
            return;
        }

        if (!currentUserEmail) {
            showLoginModal();
            return;
        }

        const ratingContainer = star.closest('.rating-stars');
        if (!ratingContainer || ratingContainer.classList.contains('rated')) {
            return; // Ya calificado o no clickeable
        }

        const newRating = parseInt(star.dataset.value, 10);
        const itemType = ratingContainer.dataset.itemType;
        const itemId = ratingContainer.dataset.itemId;
        const itemIndex = ratingContainer.dataset.itemIndex ? parseInt(ratingContainer.dataset.itemIndex, 10) : null;

        if (isNaN(newRating) || !itemId) return;

        try {
            const db = await openDB();
            // Esto fallará si el índice único es violado (el usuario ya votó).
            await db.add('ratings', {
                userEmail: currentUserEmail,
                itemId: itemId,
                projectId: currentProject.id,
                rating: newRating,
                timestamp: Date.now()
            });

            // Actualiza también el array de ratings en el objeto del proyecto para el cálculo del promedio.
            let itemToUpdate;
            if (itemType === 'project') {
                itemToUpdate = currentProject;
            } else if (itemIndex !== null && currentProject[itemType]) {
                itemToUpdate = currentProject[itemType][itemIndex];
            }

            if (!itemToUpdate) throw new Error("Elemento a calificar no encontrado.");
            if (!itemToUpdate.ratings) itemToUpdate.ratings = [];
            itemToUpdate.ratings.push(newRating);

            // Guarda el proyecto actualizado en la base de datos principal.
            const projectIndex = allProjects.findIndex(p => p.id === currentProject.id);
            if (projectIndex > -1) {
                allProjects[projectIndex] = currentProject;
            }
            await saveAllProjects(allProjects);

            // Vuelve a renderizar solo este componente de calificación.
            const container = ratingContainer.parentElement;
            await renderRating(container, itemToUpdate, itemType, itemIndex);

        } catch (error) {
            if (error.name === 'ConstraintError') {
                alert('Ya has calificado este elemento.');
            } else {
                console.error("Error al guardar la calificación:", error);
                alert("Hubo un error al guardar tu calificación.");
            }
        }
    }

    function initPublicMindMap(project) {
        const mindMapContainer = document.getElementById('publicMindMapContainer');
        if (!project || !project.mindMap || typeof vis === 'undefined') {
            mindMapContainer.innerHTML = '<p class="p-4 text-gray-500">No hay datos del mapa mental para mostrar.</p>';
            return;
        }

        if (publicMindMapNetwork) {
            publicMindMapNetwork.destroy();
        }

        const nodes = new vis.DataSet(project.mindMap.nodes);
        const edges = new vis.DataSet(project.mindMap.edges);
        const data = { nodes, edges };

        const options = {
            interaction: {
                dragNodes: true,
                dragView: true,
                zoomView: true,
                tooltipDelay: 200,
            },
            physics: { enabled: true, solver: 'barnesHut' },
            nodes: {
                shape: 'box',
                margin: 10,
                font: { color: '#e2e8f0' },
                color: {
                    border: '#6366f1',
                    background: '#2c3e50',
                    highlight: { border: '#a5b4fc', background: '#4f46e5' }
                }
            },
            edges: { color: '#a0aec0', arrows: 'to' }
        };

        publicMindMapNetwork = new vis.Network(mindMapContainer, data, options);

        publicMindMapNetwork.on('click', function(params) {
            if (params.nodes.length > 0) {
                const node = data.nodes.get(params.nodes[0]);
                if (node && node.refId) {
                    const [type, ...nameParts] = node.refId.split('-');
                    const name = nameParts.join('-');
                    const itemIndex = currentProject[type]?.findIndex(item => item.name === name);
                    if (itemIndex !== -1) showDetails(type, itemIndex);
                }
            }
        });
    }

    // --- NUEVO: Lógica de Autenticación (Login) ---

    function showLoginModal() {
        if (loginModal) loginModal.classList.remove('hidden');
    }

    function hideLoginModal() {
        if (loginModal) loginModal.classList.add('hidden');
    }

    function updateUIForLoginState() {
        const isLoggedIn = !!currentUserEmail;

        // Cabecera
        if (loginBtn) loginBtn.classList.toggle('hidden', isLoggedIn);
        if (userInfo) userInfo.classList.toggle('hidden', !isLoggedIn);
        if (isLoggedIn && userEmailSpan) {
            userEmailSpan.textContent = currentUserEmail;
        }

        // Prompts para iniciar sesión
        if (ratingLoginPrompt) ratingLoginPrompt.classList.toggle('hidden', isLoggedIn);
        if (detailsRatingLoginPrompt) detailsRatingLoginPrompt.classList.toggle('hidden', isLoggedIn);
        
        // Formulario de comentarios
        if (commentForm) commentForm.classList.toggle('hidden', !isLoggedIn);
        if (commentLoginPrompt) commentLoginPrompt.classList.toggle('hidden', isLoggedIn);

        if (isLoggedIn && commenterNameInput) {
            commenterNameInput.value = currentUserEmail;
        }
    }

    async function checkLoginState() {
        currentUserEmail = localStorage.getItem('userEmail');
        updateUIForLoginState();
    }

    // --- Inicialización ---

    async function init() {
        try {
            db = await openDB(); // Abrir DB al inicio
            allProjects = await getAllProjects();
            renderProjectList();
            loadingScreen.classList.add('hidden');
            projectSelectionScreen.classList.remove('hidden');
        } catch (error) {
            console.error('Error al cargar los proyectos:', error);
            storyContent.innerHTML = `
                <div class="text-center">
                    <h1 class="text-3xl font-bold text-red-400">Error al Cargar</h1>
                    <p class="mt-4 text-lg">No se pudieron cargar los proyectos desde la base de datos.</p>
                </div>
            `;
            loadingScreen.classList.add('hidden');
            storyContent.classList.remove('hidden');
        }

        // --- Asignación de Eventos Centralizada ---
        backToProjectsBtn.addEventListener('click', showProjectSelection);
        btnCloseDetails.addEventListener('click', () => detailsModal.classList.add('hidden'));
        detailsModal.addEventListener('click', (e) => {
            if (e.target.id === 'detailsModal') {
                detailsModal.classList.add('hidden');
            }
        });

        // Formulario de comentarios
        const commentForm = document.getElementById('commentForm');
        if (commentForm) {
            commentForm.addEventListener('submit', handleCommentSubmit);
        }

        // --- NUEVO: Eventos de Login ---
        if (loginBtn) loginBtn.addEventListener('click', showLoginModal);
        if (closeLoginModal) closeLoginModal.addEventListener('click', hideLoginModal);

        if (loginModal) {
            loginModal.addEventListener('click', (e) => {
                if (e.target === loginModal) {
                    hideLoginModal();
                }
            });
        }

        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const email = loginEmailInput.value;
                if (email) {
                    localStorage.setItem('userEmail', email);
                    await checkLoginState(); // Actualiza la UI
                    hideLoginModal();
                    loginForm.reset();
                    // Recargamos la vista del proyecto para que se actualicen las estrellas
                    if (currentProject) await renderProject(currentProject);
                }
            });
        }

        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                localStorage.removeItem('userEmail');
                // Para simplificar, recargamos la página para que se apliquen todas las restricciones
                window.location.reload();
            });
        }

        loginLinks.forEach(link => {
            if (link) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    showLoginModal();
                });
            }
        });

        // --- NUEVO: Eventos para contenido estático ---
        if (btnCloseStaticContent) {
            btnCloseStaticContent.addEventListener('click', () => staticContentModal.classList.add('hidden'));
        }
        if (staticContentModal) {
            staticContentModal.addEventListener('click', (e) => {
                if (e.target === staticContentModal) {
                    staticContentModal.classList.add('hidden');
                }
            });
        }

        const staticLinks = [
            { id: 'nav-about-link', type: 'about' },
            { id: 'nav-contact-link', type: 'contact' },
            { id: 'footer-about-link', type: 'about' },
            { id: 'footer-contact-link', type: 'contact' },
            { id: 'footer-terms-link', type: 'terms' },
            { id: 'footer-privacy-link', type: 'privacy' }
        ];

        staticLinks.forEach(linkInfo => {
            const el = document.getElementById(linkInfo.id);
            if (el) {
                el.addEventListener('click', (e) => { e.preventDefault(); showStaticContentModal(linkInfo.type); });
            }
        });

        // Delegación de eventos para las calificaciones
        storyContent.addEventListener('click', handleRatingSubmit);
        detailsModal.addEventListener('click', handleRatingSubmit);

        // Links de navegación del Header y Footer
        const projectNavLinks = [
            document.getElementById('logo-link'),
            document.getElementById('nav-projects-link'),
            document.getElementById('footer-logo-link'),
            document.getElementById('footer-projects-link')
        ];

        projectNavLinks.forEach(link => {
            if (link) link.addEventListener('click', (e) => { e.preventDefault(); showProjectSelection(); });
        });

        // Año del footer
        const footerYear = document.getElementById('footer-year');
        if (footerYear) footerYear.textContent = new Date().getFullYear();

        // Comprobar estado de login al cargar
        await checkLoginState();
    }

    init();
});