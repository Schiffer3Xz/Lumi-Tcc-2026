<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class AdminCatalogController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/catalog/index');
    }
}
