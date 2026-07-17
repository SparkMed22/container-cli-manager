import { writeFile, readFile } from 'node:fs/promises';
import { log } from '@clack/prompts';
import { DEFAULT_JSON } from './config.js';


/**
 * Lee un archivo JSON.
 * @param {string} filePath - Ruta del archivo.
 * @param {object} defaultData - Datos por defecto si el archivo no existe.
 * @returns {Promise<object>}
 */
export async function readJSON(filePath) {
    try {
        const raw = await readFile(filePath, 'utf-8');
        return JSON.parse(raw);
    } catch (error) {
        if (error.code === 'ENOENT') {
            log.info(`El archivo ${filePath} no existe. Se usarán datos por defecto.`);
            return DEFAULT_JSON;
        }
        throw error;
    }
}

/**
 * Escribe datos en un archivo JSON.
 * @param {string} filePath - Ruta del archivo.
 * @param {object} data - Datos a guardar.
 * @returns {Promise<void>}
 */
export async function writeJSON(filePath, data) {
    try {
        await writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
        log.success(`Datos guardados en ${filePath}`);
    } catch (error) {
        log.error(`Error al guardar: ${error.message}`);
        throw error;
    }
}