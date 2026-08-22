<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\Book;

use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminCategoriesController;
use App\Http\Controllers\Admin\AdminSettingsController;
use App\Http\Controllers\Admin\AdminCatalogController;
use App\Http\Controllers\SocialController;

use App\Http\Controllers\Admin\Categories\GenreController;
use App\Http\Controllers\Admin\Categories\AuthorController;
use App\Http\Controllers\Admin\Categories\AvailabilityController;

use App\Http\Controllers\Admin\Catalog\BookController;
use App\Http\Controllers\User\DashboardController;


Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// ============================================================
// FIRST ACCESS
// ============================================================


Route::middleware('auth')->group(function () {
    Route::get('admin/first-login', [AdminSettingsController::class, 'firstLogin'])
        ->name('admin.first-login');

    Route::get('admin/verification', [AdminSettingsController::class, 'emailVerification'])
        ->name('admin.email-verification');

    Route::post('admin/credentials', [AdminSettingsController::class, 'update'])
        ->name('admin.credentials.update');
});


Route::middleware(['RoleMiddleware'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');


    Route::get('catalogo', function () {
        $books = Book::with(['author', 'genre', 'availability'])
            ->get()
            ->map(function ($book) {
                return [
                    'id' => $book->id,
                    'title' => $book->title,
                    'description' => $book->description,
                    'rating' => $book->rating ?? 0,
                    'cover_url' => $book->cover_url ? asset('storage/' . $book->cover_url) : null,
                    'author' => $book->author,
                    'genre' => $book->genre,
                    'availability' => $book->availability,
                ];
            });

        return Inertia::render('catalogo', [
            'books' => $books,
        ]);
    })->name('catalogo');



    Route::middleware('auth')->group(function () {


        // ============================================================
        // USER
        // ============================================================
        Route::get('/social', [SocialController::class, 'index'])->name('list');
        
        Route::get('profile', [SocialController::class, 'profile'])->name('profile');

        Route::get('people/{id}', [SocialController::class, 'people'])->name('people');



        // ========================================================
        // ADMINISTRATOR
        // ========================================================


        Route::middleware(['FirstLoginMiddleware', 'verified'])->group(function () {

            Route::get('admin/dashboard', [AdminDashboardController::class, 'index'])
                ->name('admin.dashboard');


            // ========================================================
            // CATEGORIES
            // ========================================================

            // Categories
            Route::get('admin/categories', [AdminCategoriesController::class, 'index'])
                ->name('admin.categories.index');


            // Genres
            Route::get('admin/categories/genres', [GenreController::class, 'index'])
                ->name('admin.genres.index');

            Route::get('admin/categories/genres/{id}/edit', [GenreController::class, 'edit'])
                ->name('admin.genres.edit');

            Route::post('admin/categories/genres', [GenreController::class, 'store'])
                ->name('admin.genres.store');

            Route::put('admin/categories/genres/{id}', [GenreController::class, 'update'])
                ->name('admin.genres.update');

            Route::delete('admin/categories/genres/{id}', [GenreController::class, 'destroy'])
                ->name('admin.genres.destroy');


            // Authors
            Route::get('admin/categories/authors', [AuthorController::class, 'index'])
                ->name('admin.authors.index');

            Route::get('admin/categories/authors/{id}/edit', [AuthorController::class, 'edit'])
                ->name('admin.authors.edit');

            Route::post('admin/categories/authors', [AuthorController::class, 'store'])
                ->name('admin.authors.store');

            Route::put('admin/categories/authors/{id}', [AuthorController::class, 'update'])
                ->name('admin.authors.update');

            Route::delete('admin/categories/authors/{id}', [AuthorController::class, 'destroy'])
                ->name('admin.authors.destroy');


            // Availability
            Route::get('admin/categories/availability', [AvailabilityController::class, 'index'])
                ->name('admin.availability.index');

            Route::get('admin/categories/availability/{id}/edit', [AvailabilityController::class, 'edit'])
                ->name('admin.availability.edit');

            Route::post('admin/categories/availability', [AvailabilityController::class, 'store'])
                ->name('admin.availability.store');

            Route::put('admin/categories/availability/{id}', [AvailabilityController::class, 'update'])
                ->name('admin.availability.update');

            Route::delete('admin/categories/availability/{id}', [AvailabilityController::class, 'destroy'])
                ->name('admin.availability.destroy');


            // ========================================================
            // CATALOG
            // ========================================================

            // Catalog
            Route::get('admin/catalog', [AdminCatalogController::class, 'index'])
                ->name('admin.catalog.index');


            // Books
            Route::get('admin/catalog/books', [BookController::class, 'index'])
                ->name('admin.books.index');

            Route::get('admin/catalog/books/create', [BookController::class, 'updateView'])
                ->name('admin.books.create');

            Route::get('admin/catalog/books/list', [BookController::class, 'list'])
                ->name('admin.books.list');

            Route::get('admin/catalog/books/{id}/edit', [BookController::class, 'edit'])
                ->name('admin.books.edit');

            Route::post('admin/catalog/books', [BookController::class, 'store'])
                ->name('admin.books.store');

            Route::put('admin/catalog/books/{id}', [BookController::class, 'update'])
                ->name('admin.books.update');

            Route::delete('admin/catalog/books/{id}', [BookController::class, 'destroy'])
                ->name('admin.books.destroy');


            // ========================================================
            // SETTINGS
            // ========================================================

            Route::get('admin/settings', [AdminSettingsController::class, 'index'])
                ->name('admin.settings.index');

            // Admin management
            Route::get('admin/settings/admins/create', [AdminSettingsController::class, 'adminView'])
                ->name('admin.admins.create');

            Route::get('admin/settings/admins', [AdminSettingsController::class, 'adminCount'])
                ->name('admin.admins.index');

            Route::post('admin/settings/admins', [AdminSettingsController::class, 'createAdmin'])
                ->name('admin.admins.store');


            // Email
            Route::get('admin/settings/email', [AdminSettingsController::class, 'editEmail'])
                ->name('admin.settings.email.edit');

            Route::put('admin/settings/email', [AdminSettingsController::class, 'updateEmail'])
                ->name('admin.settings.email.update');


            // Password
            Route::get('admin/settings/password', [AdminSettingsController::class, 'editPassword'])
                ->name('admin.settings.password.edit');

            Route::put('admin/settings/password', [AdminSettingsController::class, 'updatePassword'])
                ->name('admin.settings.password.update');


            // Profile
            Route::put('admin/settings/profile', [AdminSettingsController::class, 'updateProfile'])
                ->name('admin.settings.profile.update');

            Route::get('admin/settings/profile', [AdminSettingsController::class, 'create'])
                ->name('admin.credentials.edit');
        });
    });
});


require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';