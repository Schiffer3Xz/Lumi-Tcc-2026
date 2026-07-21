<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminCategoriesController;
use App\Http\Controllers\Admin\AdminSettingsController;
use App\Http\Controllers\Admin\AdminCatalogController;
use App\Http\Controllers\Admin\Categories\GenreController;
use App\Http\Controllers\Admin\Categories\AuthorController;
use App\Http\Controllers\Admin\Categories\AvailabilityController;
use App\Http\Controllers\Admin\Catalog\BookController;


Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

//Rotas de usuario
Route::middleware(['auth', 'redirectPanel'])->group(function () {
    Route::get('dashboard', function () {
        return view ('user/dashboard');})->name('dashboard');
});


Route::middleware(['auth', 'redirectPanel'])->group(function () {

    Route::get('admin/settings/credentials', [AdminSettingsController::class, 'create'])->name('update.credentials');

    Route::post('admin/settings/credentials/update', [AdminSettingsController::class, 'update'])->name('update.settings');

    Route::get('admin/settings/verification', [AdminSettingsController::class, 'emailVerification'])->name('emailVerification');

    Route::get('admin/firstLogin', [AdminSettingsController::class, 'firstLogin'])->name('firstLogin');
});


//Rotas Adm
Route::middleware(['auth', 'redirectPanel', 'verified'])->group(function () {

    // Rota painel do Administrador
    Route::get('admin/dashboard', [AdminDashboardController::class, 'index'])->name('adminPanel');
    // Rota index Categorias
    Route::get('admin/categories', [AdminCategoriesController::class, 'index'])->name('categories');
    //Rota index Acervo
    Route::get('admin/catalog', [AdminCatalogController::class, 'index'])->name('catalog');
    //Rota index Settigns
    Route::get('admin/settings', [AdminSettingsController::class, 'index'])->name('settings');
    
    //Rota index Cadastro de Livro
    Route::get('admin/catalog/book', [BookController::class, 'index'])->name('book');
    Route::get('admin/catalog/book/update', [BookController::class, 'updateView'])->name('update.view');
    Route::post('admin/catalog/book', [BookController::class, 'store'])->name('book.store');
    Route::get('admin/catalog/books', [BookController::class, 'list'])->name('books.list');
    Route::get('admin/catalog/book/edit/{id}', [BookController::class, 'edit'])->name('edit.book');
    Route::put('admin/catalog/book/update/{id}', [BookController::class, 'update'])->name('update.book');
    Route::delete('admin/catalog/book/destroy/{id}', [BookController::class, 'destroy'])->name('destroy.book');

    //Rotas cadastro dos Generos
    Route::get('admin/categories/genre', [GenreController::class, 'index'])->name('genres');
    Route::post('admin/categories/genre', [GenreController::class, 'store'])->name('genres.store');
    Route::get('admin/categories/genres/edit/{id}', [GenreController::class, 'edit'])->name('edit.genres');
    Route::put('admin/categories/genres/update/{id}', [GenreController::class, 'update'])->name('update.genres');
    Route::delete('admin/categories/genres/destroy/{id}', [GenreController::class, 'destroy'])->name('destroy.genres');

    //Rotas cadastro dos Autores
    Route::get('admin/categories/author', [AuthorController::class, 'index'])->name('author');
    Route::post('admin/categories/author', [AuthorController::class, 'store'])->name('author.store');
    Route::get('admin/categories/author/edit/{id}', [AuthorController::class, 'edit'])->name('edit.author');
    Route::put('admin/categories/author/update/{id}', [AuthorController::class, 'update'])->name('update.author');
    Route::delete('admin/categories/author/destroy/{id}', [AuthorController::class, 'destroy'])->name('destroy.author');

    //Rotas cadastro das Disponibilidades
    Route::get('admin/categories/availability', [AvailabilityController::class, 'index'])->name('availability');
    Route::post('admin/categories/availability', [AvailabilityController::class, 'store'])->name('availability.store');
    Route::get('admin/categories/availability/edit/{id}', [AvailabilityController::class, 'edit'])->name('edit.availability');
    Route::put('admin/categories/availability/update/{id}', [AvailabilityController::class, 'update'])->name('update.availability');
    Route::delete('admin/categories/availability/destroy/{id}', [AvailabilityController::class, 'destroy'])->name('destroy.availability');

    //Atualizar credenciais

});





require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
