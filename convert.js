const fs = require('fs');
const path = require('path');

const sourceFile = 'Total_Darkness_proyecto.json';
const destinationFile = 'data.json';

// Construye las rutas absolutas para los archivos
const sourcePath = path.join(__dirname, sourceFile);
const destinationPath = path.join(__dirname, destinationFile);

// Lee el archivo de origen (Total_Darkness_proyecto.json)
fs.readFile(sourcePath, 'utf8', (err, data) => {
    if (err) {
        console.error(`Error al leer el archivo de origen "${sourceFile}":`, err);
        return;
    }

    try {
        const sourceProject = JSON.parse(data);
        
        // Verifica si el archivo de origen ya es un array de proyectos, si no, lo convierte
        const projectsToPublish = Array.isArray(sourceProject) ? sourceProject : [sourceProject];

        // Escribe el array de proyectos en el archivo de destino (data.json)
        fs.writeFile(destinationPath, JSON.stringify(projectsToPublish, null, 2), 'utf8', (err) => {
            if (err) {
                console.error(`Error al escribir en el archivo de destino "${destinationFile}":`, err);
                return;
            }
            console.log(`✅ ¡La información ha sido copiada de "${sourceFile}" a "${destinationFile}" con éxito!`);
            console.log(`Ahora puedes ver el proyecto en historia.html.`);
        });
    } catch (parseErr) {
        console.error(`Error al parsear el JSON del archivo "${sourceFile}":`, parseErr);
    }
});