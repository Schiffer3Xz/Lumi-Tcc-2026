<?php

namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;
use App\Models\Book;

use Illuminate\Http\Request;


class AdminCatalogController extends Controller
{
    public function index(){
        return view('admin/catalog/index');
    }
}
