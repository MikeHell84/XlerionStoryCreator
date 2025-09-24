document.addEventListener('DOMContentLoaded', () => {
    let allProjects = []; // Caché para todos los proyectos
    let currentProject = null; // Proyecto actualmente seleccionado
    let publicMindMapNetwork = null; // Instancia del mapa mental para la vista pública
    let allComments = []; // Caché para todos los comentarios de los proyectos
    let commentSliderInterval; // Intervalo para el slider de comentarios

    const loadingScreen = document.getElementById('loading'); // Pantalla de carga
    const storyContent = document.getElementById('storyContent');
    const projectSelectionScreen = document.getElementById('projectSelectionScreen');
    const publicProjectList = document.getElementById('publicProjectList');
    const backToProjectsBtn = document.getElementById('backToProjectsBtn');
    const detailsModal = document.getElementById('detailsModal');
    const detailsTitle = document.getElementById('detailsTitle');
    const detailsBody = document.getElementById('detailsBody');
    const btnCloseDetails = document.getElementById('btnCloseDetails');
    
    // Selectores para el modal de contenido estático (Acerca de, Contacto, etc.)
    const staticContentModal = document.getElementById('staticContentModal');
    const staticContentTitle = document.getElementById('staticContentTitle');
    const staticContentBody = document.getElementById('staticContentBody');
    const btnCloseStaticContent = document.getElementById('btnCloseStaticContent');
    
    // La lógica de la base de datos (IndexedDB) se elimina.
    // Los datos ahora se cargarán desde un archivo `data.js`.

    // --- Lógica de Renderizado ---

    function renderProject(project) {
        // Limpiar contenido anterior para evitar duplicados al cambiar de proyecto
        document.getElementById('chaptersList').innerHTML = '';
        document.getElementById('charactersList').innerHTML = '';
        document.getElementById('placesList').innerHTML = '';
        document.getElementById('objectsList').innerHTML = '';

        document.title = project.name;
        // Ocultar sliders al ver un proyecto específico
        document.getElementById('image-slider-container').classList.add('hidden');
        document.getElementById('comment-slider-container').classList.add('hidden');

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

        renderSection(project.chapters, 'chaptersContainer', 'chaptersList', createChapterCard);
        renderSection(project.characters, 'charactersContainer', 'charactersList', createGenericCard);
        renderSection(project.places, 'placesContainer', 'placesList', createGenericCard);
        renderSection(project.objects, 'objectsContainer', 'objectsList', createGenericCard);

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

    function renderSection(items, containerId, listId, cardCreator) {
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
                let card; // La variable 'type' será 'chapters', 'characters', etc.
                if (cardCreator === createGenericCard) {
                    card = cardCreator(item, type);
                } else {
                    card = cardCreator(item);
                }
                // Asignar el click al contenedor principal de la tarjeta de forma segura
                card.addEventListener('click', () => showDetails(type, index));
                list.appendChild(card);
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

        allProjects.forEach(project => {
            const projectCard = document.createElement('div');
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
        document.title = "Xlerion's Stories - Proyectos"; // Resetear título

        // Mostrar slider si tiene contenido
        const imageSliderContainer = document.getElementById('image-slider-container');
        if (imageSliderContainer && imageSliderContainer.querySelector('.slider-image')) {
            imageSliderContainer.classList.remove('hidden');
        }
        const commentSliderContainer = document.getElementById('comment-slider-container');
        if (allComments.length > 0) {
            commentSliderContainer.classList.remove('hidden');
        }
        // Reiniciar y mostrar el slider de comentarios si tiene contenido
        startCommentSlider();
    }

    function showDetails(type, index) {
        if (!currentProject) return;
        
        // CORRECCIÓN: El 'type' viene como 'characters', 'places', etc. (plural).
        // El objeto del proyecto usa estas mismas claves en plural.
        const item = currentProject[type]?.[index];

        if (!item) return;
        
        detailsTitle.textContent = item.name || 'Detalle';
        
        let bodyHtml = '';
        bodyHtml += `<div class="prose prose-custom max-w-none">`; // Contenedor para estilos de texto

        if (item.image) {
            bodyHtml += `<img src="${item.image}" alt="${item.name || item.titulo}" class="w-full h-64 object-cover rounded-lg mb-6">`;
        }

        const createDetailSection = (title, content) => {
            if (!content || content.trim() === '') return '';
            return `
                <div class="mb-6">
                    <h4 class="font-bold text-xl mb-2 text-indigo-400">${title}</h4>
                    <div class="text-gray-300 whitespace-pre-wrap">${content.replace(/\n/g, '<br>')}</div>
                </div>
            `;
        };

        bodyHtml += createDetailSection(type === 'chapters' ? 'Resumen' : 'Descripción General', item.description);

        if (type === 'characters') {
            let detailsList = '';
            if (item.age) detailsList += `<li><strong>Edad:</strong> ${item.age}</li>`;
            if (item.height) detailsList += `<li><strong>Altura:</strong> ${item.height}</li>`;
            if (item.gender && item.gender !== 'no-especificado') detailsList += `<li><strong>Género:</strong> ${item.gender.charAt(0).toUpperCase() + item.gender.slice(1)}</li>`;
            
            if (detailsList) {
                bodyHtml += `<div class="mb-6"><h4 class="font-bold text-xl mb-2 text-indigo-400">Detalles</h4><ul class="list-disc list-inside text-gray-300">${detailsList}</ul></div>`;
            }

            bodyHtml += createDetailSection('Descripción Física', item.physicalDescription);
            bodyHtml += createDetailSection('Trasfondo', item.backstory);
        } else if (type === 'places') {
            bodyHtml += createDetailSection('Tipo de Lugar', item.placeType && item.placeType !== 'no-especificado' ? item.placeType.charAt(0).toUpperCase() + item.placeType.slice(1) : null);
            bodyHtml += createDetailSection('Atmósfera / Ambiente', item.atmosphere);
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
            bodyHtml += createDetailSection('Origen / Fabricación', item.origin);
            bodyHtml += createDetailSection('Poderes / Habilidades', item.powers);
            bodyHtml += createDetailSection('Relevancia en la Trama', item.relevance);
        }

        bodyHtml += `</div>`; // Cierre del contenedor prose

        detailsBody.innerHTML = bodyHtml;
        detailsModal.classList.remove('hidden');
    }

    // --- Lógica para el modal de contenido estático (Acerca de, Contacto, etc.) ---

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

    // --- Lógica del Slider de Imágenes en la pantalla de selección ---
    function initImageSlider() {
        const sliderContainer = document.getElementById('image-slider-container');
        const slider = document.getElementById('image-slider');
        let allImages = [];

        // Recolectar todas las imágenes de todos los proyectos
        allProjects.forEach(project => {
            if (project.coverImage) {
                allImages.push(project.coverImage);
            }
            ['chapters', 'characters', 'places', 'objects'].forEach(type => {
                if (project[type]) {
                    project[type].forEach(item => {
                        if (item.image) allImages.push(item.image);
                        // Para lugares, también incluimos la imagen del mapa si existe
                        if (type === 'places' && item.mapImage) allImages.push(item.mapImage);
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
        const sliderImages = allImages.slice(0, 15);

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

    // --- Lógica del Slider de Comentarios en la pantalla de selección ---

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
            <p class="text-right text-sm text-gray-400 mt-2">- ${comment.author || 'Anónimo'} en <span class="font-semibold text-indigo-400">${comment.projectName}</span></p>
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

    // --- Lógica del Mapa Mental Público ---

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

        // Opciones de visualización para el mapa público
        const options = {
            interaction: {
                dragNodes: true,
                dragView: true,
                zoomView: true,
                tooltipDelay: 200,
            },
            physics: { 
                enabled: true, 
                solver: 'barnesHut',
                barnesHut: {
                    gravitationalConstant: -3000,
                    centralGravity: 0.1,
                    springLength: 120,
                }
            },
            nodes: {
                shape: 'box',
                margin: 10,
                font: { 
                    color: '#e2e8f0',
                    highlight: '#FFFFFF' // Texto blanco al seleccionar
                },
                color: {
                    border: '#6366f1',
                    background: '#1F2937',
                    highlight: { 
                        border: '#a5b4fc', 
                        background: '#4f46e5' 
                    },
                    hover: {
                        border: '#818cf8'
                    }
                },
            },
            edges: { 
                color: { color: '#4B5563', highlight: '#60A5FA' },
                arrows: 'to' 
            }
        };

        publicMindMapNetwork = new vis.Network(mindMapContainer, data, options);

        publicMindMapNetwork.on('click', function(params) {
            // Si se hace clic en un nodo, intenta mostrar sus detalles
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

    // --- Inicialización ---
    async function init() {
        // Ocultar el loader y mostrar el contenido principal
        // Se hace al principio para que el usuario vea algo mientras se procesan los datos.
        loadingScreen.classList.add('hidden');
        projectSelectionScreen.classList.remove('hidden');
        try {
            // Los datos ahora se cargan desde la variable global `window.allProjectsData`
            // que es inyectada por la aplicación principal al publicar.
            if (window.allProjectsData) {
                allProjects = window.allProjectsData;

                // Poblar el array de comentarios para el slider
                allComments = [];
                allProjects.forEach(project => {
                    if (project.comments && project.comments.length > 0) {
                        project.comments.forEach(comment => {
                            allComments.push({
                                message: comment.message,
                                author: comment.userEmail,
                                projectName: project.name
                            });
                        });
                    }
                });

                if (allProjects.length > 0) {
                    renderProjectList();
                } else {
                    projectSelectionScreen.innerHTML = `<h2 class="text-2xl text-yellow-400">No se encontraron datos de proyectos.</h2>`;
                }
            } else {
                 projectSelectionScreen.innerHTML = `<h2 class="text-2xl text-yellow-400">No se encontraron datos de proyectos.</h2><p class="text-gray-400 mt-2">Asegúrate de que el archivo 'data.js' exista y contenga los datos exportados desde la aplicación principal.</p>`;
            }

        } catch (error) {
            console.error('Error al cargar los proyectos:', error);
            storyContent.innerHTML = `
                <div class="text-center">
                    <h1 class="text-3xl font-bold text-red-400">Error al Cargar los Datos</h1>
                    <p class="mt-4 text-lg">No se pudieron cargar los proyectos.</p>
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

        // Eventos para el modal de contenido estático
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

        // Asignar eventos a los enlaces del header y footer
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

        // Links de navegación del Header y Footer para volver a la lista de proyectos
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
    }

    init();
});