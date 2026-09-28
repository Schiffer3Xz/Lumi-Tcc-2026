<?php

namespace App\Http\Controllers\Admin\Categories;

use App\Http\Controllers\Controller;
use App\Models\Author;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AuthorController extends Controller
{
    public function index()
    {
        $authors = Author::all();

        return Inertia::render('admin/categories/manage', ['resource' => 'authors', 'items' => $authors]);
    }

    public function store(Request $request)
    {
        $dados = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:authors,name'],
        ]);

        Author::create($dados);

        return back();
    }

    public function edit($id)
    {
        $author = Author::findOrFail($id);

        return Inertia::render('admin/categories/edit', ['resource' => 'authors', 'item' => $author]);
    }

    public function update(Request $request, $id)
    {
        Author::where('id', $id)->update([
            'name' => $request->name,
        ]);

        return redirect()->route('admin.authors.index');
    }

    public function destroy($id)
    {
        Author::where('id', $id)->delete();

        return redirect()->route('admin.authors.index');
    }
}
