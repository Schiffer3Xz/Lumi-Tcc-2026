<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use App\Models\Post;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Show the user's profile settings page.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('profileEdit');
    }

    /**
     * Update the user's profile settings.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        app(\App\Services\Moderation\PublicationModeration::class)->validateProfile($request->safe()->only(['name', 'nickname', 'description']), $request->user());
        $user = $request->user();
        $user->fill($request->safe()->only(['name', 'nickname', 'description', 'email']));

        if ($request->hasFile('profile_photo')) {
            app(\App\Services\Moderation\PublicationModeration::class)->validateImage($request->file('profile_photo'), 'profile_photo');
            if ($user->profile_photo) {
                Storage::disk('public')->delete(str_replace('/storage/', '', parse_url($user->profile_photo, PHP_URL_PATH) ?: $user->profile_photo));
            }
            $user->profile_photo = '/storage/'.$request->file('profile_photo')->store('profile-photos', 'public');
        }

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        return to_route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        DB::transaction(function () use ($user) {
            // Logout rotates the remember token; do it while the user still exists.
            Auth::logout();
            Post::where('fk_user_id', $user->id)->delete();
            $user->delete();
        });

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
