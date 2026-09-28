import { createInertiaApp } from '@inertiajs/react';
import createServer from '@inertiajs/react/server';
import { MotionConfig } from 'framer-motion';
import ReactDOMServer from 'react-dom/server';

createServer((page) =>
    createInertiaApp({
        page,
        render: ReactDOMServer.renderToString,
        resolve: (name) => {
            const pages = import.meta.glob('./pages/**/*.{js,jsx,ts,tsx}', {
                eager: true,
            });
            const path = ['jsx', 'tsx', 'js', 'ts'].map((extension) => `./pages/${name}.${extension}`).find((candidate) => candidate in pages);
            if (!path) throw new Error(`Page not found: ${name}`);
            return pages[path];
        },
        setup: ({ App, props }) => (
            <MotionConfig reducedMotion="user">
                <App {...props} />
            </MotionConfig>
        ),
    }),
);
