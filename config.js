
export const THEME_SCHEME = {
    text: '#24292F',
    success: '#1A7F37',
    error: '#CF222E',
    warning: '#BF8700',
    info: '#0969DA',
    selection: '#218BFF',
    cursor: '#0969DA',
    dim: '#6E7781',
    active: '#0969DA',
    inactive: '#8C959F',
    border: '#D0D7DE',
    label: '#8250DF',
};

process.loadEnvFile();
export const NAME_FILE_JSON = process.env.JSON_FILE_PATH || 'file.json';
export const DEFAULT_JSON = { containers: [] };

export const MENU_OPTIONS = [
    { value: 0, label: 'Agregar', hint: 'Nuevo contenedor' },
    { value: 1, label: 'Actualizar', hint: 'Editar existente' },
    { value: 2, label: 'Ver', hint: 'Lista completa' },
    { value: 3, label: 'Borrar', hint: 'Eliminar registro' },
    { value: 4, label: 'Salir', hint: 'Cerrar sesión' }
];