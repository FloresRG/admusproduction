// app.tsx

import { createInertiaApp } from '@inertiajs/react';
import axios from 'axios';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import '../css/app.css';
import { initializeTheme } from './hooks/use-appearance';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// Configurar Axios
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
if (token) {
    axios.defaults.headers.common['X-CSRF-TOKEN'] = token;
    axios.defaults.withCredentials = true;
} else {
    console.warn('⚠️ CSRF token no encontrado en el documento HTML.');
}

// ✅ 2. Inicializar Inertia
createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(
        `./pages/${name}.tsx`, 
        import.meta.glob('./pages/**/*.tsx')),
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
