// main.js
import { intro, outro, select, log } from '@clack/prompts';
import { MENU_OPTIONS, THEME_SCHEME } from './config.js';
import { 
    actionAdd, 
    actionUpdate, 
    actionView, 
    actionDelete, 
    actionExit 
} from './actions.js';

const menuActions = {
    0: actionAdd,
    1: actionUpdate,
    2: actionView,
    3: actionDelete,
    4: actionExit
};

async function run() {
    intro('Bienvenido al CLI Personalizado');

    while (true) {
        const opcion = await select({
            message: 'Elige una acción:',
            options: MENU_OPTIONS,
            theme: THEME_SCHEME
        });

        const accion = menuActions[opcion];

        if (accion) {
            const shouldExit = await accion();
            
            if (shouldExit === true || opcion === 4) {
                outro('¡Saliendo del programa...');
                process.exit(0);
            }
        } else {
            log.error('Opción no válida.');
        }
    }
}

run().catch((err) => {
    log.error(`Error crítico: ${err.message}`);
    process.exit(1);
});