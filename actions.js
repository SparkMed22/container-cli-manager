// actions.js
import { text, select, log } from '@clack/prompts';
import { readJSON, writeJSON } from './fileUtils.js';
import { NAME_FILE_JSON, THEME_SCHEME } from './config.js';

const width = [5, 25, 35, 8, 20];

export async function actionAdd() {

    const nombre = await text({
        message: '¿Ingrese nombre para el contenedor?',
        placeholder: 'Ej: web-server-01',
        validate: (val) => !val || val.trim() === '' ? '¡El nombre no puede estar vacío!' : undefined,
        theme: THEME_SCHEME
    });

    if (typeof nombre !== 'string') return;

    const descripcion = await text({
        message: '¿Ingrese la descripción para el contenedor?',
        placeholder: 'Ej: Servidor web principal',
        validate: (val) => !val || val.trim() === '' ? '¡La descripción es obligatoria!' : undefined,
        theme: THEME_SCHEME
    });

    if (typeof descripcion !== 'string') return;

    const puertoStr = await text({
        message: 'Ingrese el puerto para el contenedor',
        placeholder: 'Ej: 3000',
        validate: (val) => {
            if (!val || val.trim() === '') return '¡El puerto es obligatorio!';
            const portNum = parseInt(val, 10);
            if (isNaN(portNum) || portNum < 1 || portNum > 65535) {
                return 'Número de puerto inválido (1-65535).';
            }
            return undefined;
        },
        theme: THEME_SCHEME
    });

    if (typeof puertoStr !== 'string') return;


    let data;
    try {
        data = await readJSON(NAME_FILE_JSON);
    } catch (error) {
        log.error(`Error al leer el archivo: ${error.message}`);
        return;
    }

    if (!data.containers) data.containers = [];

    const nuevoContenedor = {
        id: Date.now(),
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        puerto: parseInt(puertoStr, 10),
        creadoEn: new Date().toISOString()
    };

    data.containers.push(nuevoContenedor);

    log.info(`Contenedor "${nuevoContenedor.nombre}" agregado.`);

    try {
        await writeJSON(NAME_FILE_JSON, data);
        log.success('¡Contenedor guardado correctamente!');
    } catch (error) {
        log.error('Error al guardar cambios.');
    }
}

export async function actionUpdate() {
    log.info('>>> Iniciando proceso de actualización...');
    
    const inputId = await text({
        message: `Ingrese los últimos ${width[0]} dígitos del ID del contenedor a actualizar:`,
        placeholder: 'Ej: 43326',
        validate: (val) => {
            if (!val || val.trim() === '') return '¡El ID es obligatorio!';
            if (!/^\d{1,5}$/.test(val.trim())) return `Ingrese solo números (máximo ${width[0]} dígitos).`;
            return undefined;
        },
        theme: THEME_SCHEME
    });

    if (typeof inputId !== 'string') return; 

    const searchSuffix = inputId.trim();

    try {
        const data = await readJSON(NAME_FILE_JSON);

        if (!data.containers || data.containers.length === 0) {
            log.info('No hay contenedores registrados.');
            return;
        }

        const containerIndex = data.containers.findIndex(c => {
            const idStr = String(c.id);
            return idStr.slice(-width[0]) === searchSuffix;
        });

        if (containerIndex === -1) {
            log.error(`No se encontró ningún contenedor con ID que termine en: ${searchSuffix}`);
            return;
        }

        const container = data.containers[containerIndex];
        log.success(`Contenedor encontrado: "${container.nombre}" (ID: ...${container.id})`);

        const fieldToUpdate = await select({
            message: '¿Qué campo desea actualizar?',
            options: [
                { value: 'nombre', label: 'Nombre', hint: container.nombre },
                { value: 'descripcion', label: 'Descripción', hint: container.descripcion },
                { value: 'puerto', label: 'Puerto', hint: String(container.puerto) },
                { value: 'cancel', label: 'Cancelar', hint: 'Volver al menú principal' }
            ],
            theme: THEME_SCHEME
        });

        if (fieldToUpdate === 'cancel' || typeof fieldToUpdate !== 'string') return;

        let newValue = '';

        if (fieldToUpdate === 'nombre') {
            const res = await text({
                message: 'Nuevo nombre:',
                defaultValue: container.nombre,
                placeholder: 'Ej: web-server-new',
                validate: (val) => !val.trim() ? '¡El nombre no puede estar vacío!' : undefined,
                theme: THEME_SCHEME
            });
            if (typeof res !== 'string') return;
            newValue = res.trim();

        } else if (fieldToUpdate === 'descripcion') {
            const res = await text({
                message: 'Nueva descripción:',
                defaultValue: container.descripcion,
                placeholder: 'Ej: Actualizado en 2026',
                theme: THEME_SCHEME
            });
            if (typeof res !== 'string') return;
            newValue = res.trim();

        } else if (fieldToUpdate === 'puerto') {
            const res = await text({
                message: 'Nuevo puerto:',
                defaultValue: String(container.puerto),
                placeholder: 'Ej: 8080',
                validate: (val) => {
                    const portNum = parseInt(val, 10);
                    if (isNaN(portNum) || portNum < 1 || portNum > 65535) {
                        return 'Puerto inválido (1-65535).';
                    }
                    return undefined;
                },
                theme: THEME_SCHEME
            });
            if (typeof res !== 'string') return;
            newValue = parseInt(res, 10);
        }

        container[fieldToUpdate] = newValue;

        await writeJSON(NAME_FILE_JSON, data);
        log.success(`Campo "${fieldToUpdate}" actualizado correctamente.`);

    } catch (error) {
        if (error.code === 'ENOENT') {
            log.error('El archivo no existe.');
        } else {
            log.error(`Error actualizando datos: ${error.message}`);
        }
    }
}

export async function actionView() {
    try {
        const data = await readJSON(NAME_FILE_JSON);

        if (!data.containers || data.containers.length === 0) {
            log.info('No hay contenedores registrados.');
            return;
        }

        const headers = ['ID', 'Nombre', 'Descripción', 'Puerto', 'Creado'];

        const formatRow = (row, w) => {
            return row.map((cell, i) =>
                String(cell).padEnd(w[i]).slice(0, w[i])
            ).join(' | ');
        };

        log.info('');
        console.log(formatRow(headers, width).toUpperCase());
        console.log('-'.repeat(width.reduce((a, b) => a + b + 3, 0)));

        data.containers.forEach(c => {
            const row = [
                String(c.id).slice(-width[0]),
                c.nombre,
                c.descripcion,
                c.puerto,
                new Date(c.creadoEn).toLocaleDateString()
            ];
            console.log(formatRow(row, width));
        });

        log.info('');

    } catch (error) {
        if (error.code === 'ENOENT') {
            log.error('El archivo no existe.');
        } else {
            log.error(`Error leyendo JSON: ${error.message}`);
        }
    }
}

export async function actionDelete() {
    log.warning('>>> Iniciando proceso de borrado...');

    

    const inputId = await text({
        message: `Ingrese los últimos ${width[0]} dígitos del ID del contenedor:`,
        placeholder: 'Ej: 43326',
        validate: (val) => {
            if (!val || val.trim() === '') return '¡El ID es obligatorio!';
            if (!/^\d{1,5}$/.test(val.trim())) return `Ingrese solo números (máximo ${width[0]} dígitos).`;
            return undefined;
        },
        theme: THEME_SCHEME
    });

    if (typeof inputId !== 'string') return;

    const searchSuffix = inputId.trim();

    try {
        const data = await readJSON(NAME_FILE_JSON);

        if (!data.containers || data.containers.length === 0) {
            log.info('No hay contenedores registrados.');
            return;
        }

        const containerIndex = data.containers.findIndex(c => {
            const idStr = String(c.id);
            const suffix = idStr.slice(-width[0]); 
            return suffix === searchSuffix;
        });

        if (containerIndex === -1) {
            log.error(`No se encontró ningún contenedor con ID que termine en: ${searchSuffix}`);
            return;
        }

        const containerToDelete = data.containers[containerIndex];

        const confirm = await select({
            message: `¿Estás seguro de eliminar "${containerToDelete.nombre}"?`,
            options: [
                { value: 'yes', label: 'Sí, eliminar' },
                { value: 'no', label: 'Cancelar' }
            ],
            theme: THEME_SCHEME,
            initialValue: 'no'
        });

        if (confirm !== 'yes') {
            log.info('Operación cancelada.');
            return;
        }

        data.containers = data.containers.filter((_, index) => index !== containerIndex);

        await writeJSON(NAME_FILE_JSON, data);
        
        log.success(`Contenedor "${containerToDelete.nombre}" eliminado correctamente.`);

    } catch (error) {
        if (error.code === 'ENOENT') {
            log.error('El archivo no existe.');
        } else {
            log.error(`Error al procesar la eliminación: ${error.message}`);
        }
    }
}
export async function actionExit() {
    return true;
}