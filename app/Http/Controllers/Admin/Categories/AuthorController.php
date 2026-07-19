<?php

namespace App\Http\Controllers\Admin\Categories;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Author;

class AuthorController extends Controller
{
     public function index(){
        $authors = Author::all();

        return view('admin/categories/authors/create', compact('authors'));
    }

    public function store(Request $request){
        $dados = $request->validate([
        'name' => ['required','string','max:255','unique:authors,name',],
        ]);

        Author::create($dados);
        return back();
    }

    public function edit($id){
        $author = Author::findOrFail($id);

        return view('admin/categories/authors/edit', compact('author'));
    }
    

    public function update(Request $request, $id){
        Author::where('id', $id)->update([
            'name' => $request->name,
        ]);

        return redirect('admin/categories/author');
    }

    public function destroy($id){
        Author::where('id', $id)->delete();

        return redirect('admin/categories/author');
    }
}
