<?php

use App\Http\Controllers\Admin\AdminCatalogController;
use App\Http\Controllers\Admin\AdminCategoriesController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminLibraryNoticeController;
use App\Http\Controllers\Admin\AdminReadingRuleController;
use App\Http\Controllers\Admin\AdminReportController;
use App\Http\Controllers\Admin\AdminSettingsController;
use App\Http\Controllers\Admin\Catalog\BookController;
use App\Http\Controllers\Admin\Categories\AuthorController;
use App\Http\Controllers\Admin\Categories\AvailabilityController;
use App\Http\Controllers\Admin\Categories\GenreController;
use App\Http\Controllers\BookController as PublicBookController;
use App\Http\Controllers\DirectMessageController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\PostInteractionController;
use App\Http\Controllers\ReaderAccountController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SocialController;
use App\Http\Controllers\User\DashboardController;
use App\Models\ReadingRule;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::post('/api/gemini', [\App\Http\Controllers\ReadingAssistantController::class, 'chat'])
    ->middleware(['auth', 'throttle:10,1'])->name('reading-assistant.chat');

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// ============================================================
// FIRST ACCESS
// ============================================================

Route::middleware(['auth', 'RoleMiddleware'])->group(function () {
    Route::get('admin/first-login', [AdminSettingsController::class, 'firstLogin'])
        ->name('admin.first-login');

    Route::get('admin/verification', [AdminSettingsController::class, 'emailVerification'])
        ->name('admin.email-verification');

    Route::post('admin/verification/resend', [\App\Http\Controllers\Auth\EmailVerificationNotificationController::class, 'store'])
        ->middleware('throttle:6,1')
        ->name('admin.email.resend');

    Route::get('admin/verification/{id}/{hash}', [AdminSettingsController::class, 'verifyEmail'])
        ->middleware(['signed', 'throttle:6,1'])
        ->name('admin.email.verify');

    Route::post('admin/credentials', [AdminSettingsController::class, 'update'])
        ->name('admin.credentials.update');
});

Route::middleware(['RoleMiddleware'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('reading-progress/books', [DashboardController::class, 'readingProgressBooks'])->middleware('auth')->name('reading-progress.books');
    Route::post('reading-progress', [DashboardController::class, 'addReadingProgress'])->middleware('auth')->name('reading-progress.store');
    Route::patch('reading-progress/sync', [DashboardController::class, 'syncReadingProgress'])->middleware('auth')->name('reading-progress.sync');
    Route::patch('reading-progress/{progressId}', [DashboardController::class, 'updateReadingProgress'])->middleware('auth')->name('reading-progress.update');
    Route::delete('reading-progress/{progressId}', [DashboardController::class, 'removeReadingProgress'])->middleware('auth')->name('reading-progress.destroy');

    Route::get('catalogo', [PublicBookController::class, 'catalog'])->name('catalogo');

    Route::middleware('auth')->group(function () {

        // ============================================================
        // USER
        // ============================================================
        Route::get('/social', [SocialController::class, 'index'])->name('list');
        Route::get('historico', [ReaderAccountController::class, 'history'])->name('reading.history');
        Route::get('regras', fn () => Inertia::render('readingRules', [
            'readingRules' => ReadingRule::displayList()->get(),
        ]))->name('reading.rules');
        Route::get('privacidade', [ReaderAccountController::class, 'privacy'])->name('privacy');
        Route::patch('privacidade', [ReaderAccountController::class, 'updatePrivacy'])->name('privacy.update');
        Route::get('notificacoes', [ReaderAccountController::class, 'notifications'])->name('notifications');
        Route::post('notificacoes/lidas', [ReaderAccountController::class, 'readNotifications'])->name('notifications.read');
        Route::post('notificacoes/{id}/abrir', [ReaderAccountController::class, 'openNotification'])->name('notifications.open');

        Route::get('profile', [SocialController::class, 'profile'])->name('profile');

        Route::get('people/{id}', [SocialController::class, 'people'])->name('people');

        Route::post('people/{id}/follow', [SocialController::class, 'follow'])->name('follow.store');
        Route::delete('people/{id}/follow', [SocialController::class, 'unfollow'])->name('follow.destroy');

        Route::get('post', [PostController::class, 'index'])->name('post');
        Route::post('post', [PostController::class, 'store'])->name('posts.store');
        Route::patch('post/{post}', [PostController::class, 'update'])->name('posts.update');
        Route::match(['put', 'delete'], 'post/{post}/like', [PostInteractionController::class, 'like'])->name('posts.like');
        Route::match(['put', 'delete'], 'post/{post}/save', [PostInteractionController::class, 'save'])->name('posts.save');
        Route::post('post/{post}/report', [ReportController::class, 'store'])->middleware('throttle:10,1')->name('posts.report');
        Route::post('post/{post}/comments/{comment}/report', [ReportController::class, 'storeComment'])->middleware('throttle:10,1')->name('posts.comments.report');
        Route::post('post/{post}/comments', [PostInteractionController::class, 'comment'])->name('posts.comments.store');
        Route::delete('post/{post}/comments/{comment}', [PostInteractionController::class, 'deleteComment'])->name('posts.comments.destroy');
        Route::delete('post/{id}', [SocialController::class, 'destroyPost'])->name('posts.destroy');

        Route::get('books/{id}', [PublicBookController::class, 'show'])->name('book.show');
        Route::get('estante', [PublicBookController::class, 'favorites'])->name('shelf');
        Route::match(['post', 'put', 'delete'], 'books/{id}/favorite', [PublicBookController::class, 'toggleFavorite'])->name('book.favorite');
        Route::post('books/{id}/rating', [PublicBookController::class, 'rate'])->name('book.rating');
        Route::delete('books/{bookId}/comments/{ratingId}', [PublicBookController::class, 'deleteComment'])->name('book.comment.destroy');

        Route::post('/chat/send', [DirectMessageController::class, 'start'])->name('chat');
        Route::post('/chat/{conversation}/viewing', [DirectMessageController::class, 'setViewing'])->name('chat.viewing');
        Route::post('/chat/{conversation}/typing', [DirectMessageController::class, 'typing'])->middleware('throttle:90,1')->name('chat.typing');
        Route::post('/chat/groups', [DirectMessageController::class, 'createGroup'])->name('chat.groups.store');
        Route::post('/chat/groups/{conversation}/messages', [DirectMessageController::class, 'sendToGroup'])->name('chat.groups.messages.store');
        Route::delete('/chat/groups/{conversation}', [DirectMessageController::class, 'destroyGroup'])->name('chat.groups.destroy');
        Route::delete('/chat/groups/{conversation}/participants/{user}', [DirectMessageController::class, 'removeParticipant'])->name('chat.groups.participants.destroy');

        // ========================================================
        // ADMINISTRATOR
        // ========================================================

        Route::middleware(['FirstLoginMiddleware'])->group(function () {
            Route::prefix('admin')->name('admin.')->group(function () {
                Route::get('comunicados/livros', [AdminLibraryNoticeController::class, 'books'])->name('library-notices.books');
                Route::resource('comunicados', AdminLibraryNoticeController::class)
                    ->only(['index', 'create', 'store', 'edit', 'update', 'destroy'])
                    ->names('library-notices')->parameters(['comunicados' => 'notice']);
                Route::get('notificacoes', [ReaderAccountController::class, 'notifications'])->name('notifications');
                Route::post('notificacoes/lidas', [ReaderAccountController::class, 'readNotifications'])->name('notifications.read');
                Route::post('notificacoes/{id}/abrir', [ReaderAccountController::class, 'openNotification'])->name('notifications.open');
            });

            Route::get('admin/dashboard', [AdminDashboardController::class, 'index'])
                ->name('admin.dashboard');

            Route::name('admin.')->prefix('admin')->group(function () {
                Route::resource('reading-rules', AdminReadingRuleController::class)
                    ->only(['index', 'store', 'update', 'destroy'])
                    ->parameters(['reading-rules' => 'readingRule']);
            });

            Route::get('admin/reports', [AdminReportController::class, 'index'])->name('admin.reports.index');
            Route::patch('admin/reports/{report}', [AdminReportController::class, 'update'])->name('admin.reports.update');
            Route::delete('admin/reports/{report}/target', [AdminReportController::class, 'removeTarget'])->name('admin.reports.target.destroy');

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

            Route::get('admin/catalog/books/{book}/availability', [BookController::class, 'editAvailability'])
                ->name('admin.books.availability.edit');

            Route::patch('admin/catalog/books/{book}/availability', [BookController::class, 'updateAvailability'])
                ->name('admin.books.availability.update');

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
            Route::post('admin/settings/profile', [AdminSettingsController::class, 'updateProfile'])
                ->name('admin.settings.profile.update');

            Route::get('admin/settings/profile', [AdminSettingsController::class, 'create'])
                ->name('admin.credentials.edit');
        });
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
