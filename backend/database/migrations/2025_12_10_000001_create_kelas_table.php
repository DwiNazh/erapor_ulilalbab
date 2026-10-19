<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kelas', function (Blueprint $table) {
            $table->id();
            $table->unsignedTinyInteger('tingkat'); // 1..6
            $table->string('sub', 4)->nullable();   // 'A', 'B', 'C' atau null untuk kelas tanpa sub
            $table->string('label')->nullable();    // optional: "1A" / "2B" friendly label
            $table->timestamps();

            $table->unique(['tingkat', 'sub']); // mencegah duplicate 1A, 1B, dst
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kelas');
    }
};
