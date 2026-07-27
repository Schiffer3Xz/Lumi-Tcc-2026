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
use App\Http\Controllers\User\DashboardController;


Route::get('/', function () {return Inertia::render('welcome');})->name('home');

Route::middleware('auth')->group(function (){

        //================================================FLUXO DE PRIMEIRO ACESSO==============================================================

        Route::get('admin/firstLogin', [AdminSettingsController::class, 'firstLogin'])->name('firstLogin');
        Route::get('admin/verification', [AdminSettingsController::class, 'emailVerification'])->name('emailVerification');
        Route::get('admin/credentials', [AdminSettingsController::class, 'create'])->name('update.credentials');
        Route::post('admin/credentials', [AdminSettingsController::class, 'update'])->name('update.settings');

        Route::middleware('redirectPanel')->group(function (){
                //Rotas do Usuario
                Route::get('dashboard', [DashboardController::class, 'list'])->name('dashboard');
        });



    Route::middleware('redirectPanel', 'verified')->group(function() {
        
        //Dashboard
        Route::get('admin/dashboard', [AdminDashboardController::class, 'index'])->name('adminPanel');

//================================================CATEGORIAS===========================================================================
        //Genero
        Route::get('admin/categories', [AdminCategoriesController::class, 'index'])->name('categories');
        Route::get('admin/categories/genre', [GenreController::class, 'index'])->name('genres');
        Route::get('admin/categories/genres/edit/{id}', [GenreController::class, 'edit'])->name('edit.genres');
        Route::post('admin/categories/genre', [GenreController::class, 'store'])->name('genres.store');
        Route::put('admin/categories/genres/update/{id}', [GenreController::class, 'update'])->name('update.genres');
        Route::delete('admin/categories/genres/destroy/{id}', [GenreController::class, 'destroy'])->name('destroy.genres');
        //Autor
        Route::get('admin/categories/author', [AuthorController::class, 'index'])->name('author');
        Route::get('admin/categories/author/edit/{id}', [AuthorController::class, 'edit'])->name('edit.author');
        Route::post('admin/categories/author', [AuthorController::class, 'store'])->name('author.store');
        Route::put('admin/categories/author/update/{id}', [AuthorController::class, 'update'])->name('update.author');
        Route::delete('admin/categories/author/destroy/{id}', [AuthorController::class, 'destroy'])->name('destroy.author');
        //Disponibilidade
        Route::get('admin/categories/availability', [AvailabilityController::class, 'index'])->name('availability');
        Route::get('admin/categories/availability/edit/{id}', [AvailabilityController::class, 'edit'])->name('edit.availability');
        Route::post('admin/categories/availability', [AvailabilityController::class, 'store'])->name('availability.store');
        Route::put('admin/categories/availability/update/{id}', [AvailabilityController::class, 'update'])->name('update.availability');
        Route::delete('admin/categories/availability/destroy/{id}', [AvailabilityController::class, 'destroy'])->name('destroy.availability');



//================================================CATÁLOGO===========================================================================
        //Acervo
        Route::get('admin/catalog', [AdminCatalogController::class, 'index'])->name('catalog');
        Route::get('admin/catalog/book', [BookController::class, 'index'])->name('book');
        Route::get('admin/catalog/book/update', [BookController::class, 'updateView'])->name('update.view');
        Route::get('admin/catalog/books', [BookController::class, 'list'])->name('books.list');
        Route::get('admin/catalog/book/edit/{id}', [BookController::class, 'edit'])->name('edit.book');
        Route::post('admin/catalog/book', [BookController::class, 'store'])->name('book.store');
        Route::put('admin/catalog/book/update/{id}', [BookController::class, 'update'])->name('update.book');
        Route::delete('admin/catalog/book/destroy/{id}', [BookController::class, 'destroy'])->name('destroy.book');


//================================================CONFIGURAÇÕES======================================================================
        Route::get('admin/settings/create', [AdminSettingsController::class, 'adminView'])->name('create.admin.view');
        Route::get('admin/settings/list', [AdminSettingsController::class, 'adminCount'])->name('list.admin');
        Route::get('admin/email', [AdminSettingsController::class, 'editEmail'])->name('email.index');
        Route::get('admin/settings', [AdminSettingsController::class, 'index'])->name('settings');
        Route::get('admin/password', [AdminSettingsController::class, 'editPassword'])->name('password.index');
        Route::post('admin/settings/create', [AdminSettingsController::class, 'createAdmin'])->name('create.admin');
        Route::put('admin/email', [AdminSettingsController::class, 'updateEmail'])->name('email.update');
        Route::put('admin/password', [AdminSettingsController::class, 'updatePassword'])->name('password.update');
        Route::put('admin/settings/credentials/update', [AdminSettingsController::class, 'updateProfile'])->name('update.profile');
    });
});




require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
