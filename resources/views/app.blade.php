<html>
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1">
        @vite('resources/js/app.jsx')
        @viteReactRefresh @vite(['resources/js/app.jsx','resources/css/app.css'])
        <x-inertia::head />
    </head>
    <body>
        <x-inertia::app />
    </body>
</html>