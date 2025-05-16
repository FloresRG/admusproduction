// app.tsx

import '../css/app.css';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';
import { ModuleRegistry } from 'ag-grid-community';
import axios from 'axios';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// ✅ 1. Leer el token CSRF del <meta> tag y configurar Axios
const csrfToken = document.head.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

if (csrfToken) {
    axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;
    axios.defaults.withCredentials = true;
} else {
    console.warn('⚠️ CSRF token no encontrado en el documento HTML.');
}

// ✅ 2. Inicializar Inertia
createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});

// ✅ 3. Configurar el tema claro/oscuro
initializeTheme();
