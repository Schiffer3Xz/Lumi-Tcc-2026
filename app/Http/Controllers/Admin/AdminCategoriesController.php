<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class AdminCategoriesController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/categories/index');
    }
}
