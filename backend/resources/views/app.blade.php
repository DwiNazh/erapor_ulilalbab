<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Akademik App</title>
    @vite(['src/main.jsx'])  <!-- atau path ke entry React-mu -->
    @viteReactRefresh
</head>
<body>
    <div id="root"></div>
</body>
</html>