<?php

namespace App\Services\Interfaces;

use Illuminate\Http\Request;

interface BaseServiceInteface
{
    public function save(Request $request, ?int $id = null);
    public function paginate(Request $request);
    public function destroy(int $id);
    public function show(int $id);
    public function bulkDestroy(Request $request);
    public function updateStatus(array $post = []);
}
