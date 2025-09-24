window.allProjectsData = [
  {
    "id": "proj_1a2b3c",
    "name": "La Sombra del Nexo",
    "coverImage": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
    "descripcionLarga": "En un futuro distópico donde la tecnología y la decadencia social colisionan, un grupo de rebeldes busca derrocar al conglomerado OmniCorp, que controla el flujo de información a través de una red neuronal global conocida como el Nexo. Kael, un ex-ingeniero de OmniCorp, se une a la resistencia tras descubrir los oscuros secretos de la corporación.",
    "chapters": [
      {
        "name": "El Despertar",
        "description": "Kael descubre una anomalía en el Nexo que revela las verdaderas intenciones de OmniCorp. Decide abandonar su vida privilegiada y buscar a la resistencia.",
        "order": 1,
        "image": null
      },
      {
        "name": "Sombras de Neón",
        "description": "Kael navega por los peligrosos suburbios de la ciudad, buscando a los 'Espectros', el legendario grupo de hackers que se opone a OmniCorp.",
        "order": 2,
        "image": null
      }
    ],
    "characters": [
      {
        "name": "Kael",
        "description": "Un brillante pero desilusionado ingeniero que trabajó en el corazón del Nexo. Su conocimiento de la red es la clave para la resistencia.",
        "age": "28",
        "height": "1.80m",
        "gender": "masculino",
        "physicalDescription": "Delgado, con cabello oscuro y ojos que reflejan el constante brillo de los datos. Lleva implantes cibernéticos discretos en sus sienes.",
        "backstory": "Criado en la élite de OmniCorp, Kael creía en la misión de la corporación hasta que sus propias creaciones fueron usadas para oprimir a la población.",
        "image": null
      },
      {
        "name": "Anya",
        "description": "La líder de los 'Espectros'. Una estratega formidable y una luchadora experta, desconfía de Kael al principio.",
        "age": "32",
        "height": "1.75m",
        "gender": "femenino",
        "physicalDescription": "Atlética, con cicatrices de batalla y una mirada intensa. Su brazo izquierdo es una prótesis cibernética avanzada.",
        "backstory": "Anya perdió a su familia en las purgas de OmniCorp y ha dedicado su vida a desmantelar el sistema desde las sombras.",
        "image": null
      }
    ],
    "places": [
      {
        "name": "OmniCorp Tower",
        "description": "El monolítico rascacielos que sirve como sede de OmniCorp. Es una fortaleza de cristal y acero que se alza sobre la ciudad.",
        "placeType": "urbano",
        "atmosphere": "Opresiva, estéril y vigilada constantemente por drones.",
        "keyFeatures": "El núcleo del Nexo se encuentra en su sub-nivel más profundo. Sistemas de seguridad biométricos y patrullas de robots.",
        "lore": "Se dice que la torre fue construida sobre las ruinas de la antigua biblioteca de la ciudad, un símbolo de la supresión del conocimiento libre.",
        "image": null,
        "mapImage": null
      },
      {
        "name": "El Sumidero",
        "description": "Un laberíntico mercado negro en los niveles inferiores de la ciudad, donde los rebeldes y marginados comercian con tecnología prohibida.",
        "placeType": "urbano",
        "atmosphere": "Caótico, ruidoso y bañado por el resplandor de los letreros de neón.",
        "keyFeatures": "Túneles ocultos, talleres clandestinos y una red de informantes.",
        "lore": "El Sumidero es el único lugar de la ciudad fuera del control directo de OmniCorp, un bastión de libertad anárquica.",
        "image": null,
        "mapImage": null
      }
    ],
    "objects": [
      {
        "name": "El Disruptor",
        "description": "Un dispositivo creado por Kael que puede crear 'zonas muertas' temporales en el Nexo, permitiendo comunicaciones seguras y ocultando la actividad rebelde.",
        "objectType": "herramienta",
        "origin": "Diseñado y construido por Kael con piezas robadas de OmniCorp y tecnología del mercado negro.",
        "powers": "Genera un campo de interferencia que anula la vigilancia del Nexo en un radio limitado.",
        "relevance": "Es la principal herramienta táctica de la resistencia para sus operaciones.",
        "image": null
      }
    ],
    "mindMap": {
      "nodes": [
        {
          "id": "node1",
          "label": "OmniCorp controla el Nexo",
          "x": 0,
          "y": 0,
          "group": "places"
        },
        {
          "id": "node2",
          "label": "Kael descubre la verdad",
          "x": 150,
          "y": -100,
          "group": "characters"
        },
        {
          "id": "node3",
          "label": "Anya lidera la resistencia",
          "x": 150,
          "y": 100,
          "group": "characters"
        },
        {
          "id": "node4",
          "label": "Kael se une a los Espectros",
          "x": 300,
          "y": 0,
          "group": "chapters"
        }
      ],
      "edges": [
        {
          "from": "node1",
          "to": "node2",
          "label": "trabaja para"
        },
        {
          "from": "node2",
          "to": "node4",
          "label": "busca unirse"
        },
        {
          "from": "node3",
          "to": "node4",
          "label": "acepta a"
        }
      ]
    },
    "comments": [ // Este campo ahora será poblado correctamente por la exportación
      {
        "userEmail": "lector_fan@email.com",
        "message": "¡Qué gran comienzo! Me encanta la ambientación cyberpunk."
      },
      {
        "userEmail": "critico_literario@email.com",
        "message": "La premisa es interesante, aunque el personaje de Kael podría tener una motivación más profunda."
      }
    ]
  }
];
