//
import { createInertiaApp } from '@inertiajs/react'

createInertiaApp({
    strictMode: true,
    pages: {
        path: './Pages',
        extension: '.jsx',
        lazy: true,
        transform: (name, page) => name.replace('/', '/'),
    },
})