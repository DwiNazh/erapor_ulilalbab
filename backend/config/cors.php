<?php

return [

'paths' => ['api/*', 'sanctum/csrf-cookie', 'superadmin/*','kepsek/*', 'login', 'logout'],
'allowed_methods' => ['*'],
'allowed_origins' => ['http://localhost:5173'], // Sesuaikan dengan port React kamu
'allowed_headers' => ['*'],
'exposed_headers' => [],
'max_age'         => 0,
'supports_credentials' => true,
];