

const fs = require('fs-extra');

const deleteFilePath = (fileNamePath) => {
    if (fileNamePath) {
        fs.unlink(fileNamePath, (err) => {
            if (err) {
                console.error('Error al eliminar el archivo:', err);
            } else {
             //console.log('Archivo eliminado correctamente');
            }
        });
    } else {
        console.log('No se cargó ningún archivo');
    }
}
 

const deleteMultipleFiles = (filePaths) => {
    filePaths.forEach(filePath => {
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error('Error al eliminar el archivo:', err);
            } else {
                //console.log('Archivo eliminado correctamente');
            }
        });
    });
}

module.exports = { deleteFilePath, deleteMultipleFiles};


