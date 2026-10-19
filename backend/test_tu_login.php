<?php

require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$tuUsers = App\Models\User::where('role', 'admintu')->get();
foreach ($tuUsers as $tu) {
    echo "TU user: {$tu->id} - {$tu->name} (NIPY: {$tu->nipy}, role: {$tu->role}, jenjang_id: {$tu->jenjang_id})\n";
}

$tu = $tuUsers->first();
if (!$tu) {
    echo "No admintu found!\n";
    exit;
}

// Check password for $tu
$defaultPwMatches = \Illuminate\Support\Facades\Hash::check('password', $tu->password) ? 'password' : (\Illuminate\Support\Facades\Hash::check('123456', $tu->password) ? '123456' : (\Illuminate\Support\Facades\Hash::check('admin123', $tu->password) ? 'admin123' : 'OTHER'));
echo "Password for {$tu->nipy} matches: {$defaultPwMatches}\n";

$req = Illuminate\Http\Request::create('/api/tu/dashboard', 'GET');
$req->setUserResolver(fn() => $tu);

try {
    $res = app(App\Http\Controllers\Api\Tu\DashboardTuController::class)->index($req);
    echo "Dashboard TU response code: " . $res->getStatusCode() . "\n";
    $data = json_decode($res->getContent(), true);
    echo "Dashboard TU success: " . ($data['success'] ? 'true' : 'false') . "\n";
    if (!$data['success']) {
        echo "Error message: " . ($data['message'] ?? 'none') . "\n";
    }
} catch (\Throwable $e) {
    echo "Dashboard TU EXCEPTION: " . $e->getMessage() . "\n";
    echo $e->getTraceAsString() . "\n";
}
