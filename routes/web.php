<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

/*
|--------------------------------------------------------------------------
| Frontend Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return Inertia::render('home');
})->name('home');

Route::get('/about', function () {
    return Inertia::render('about');
})->name('about');

Route::get('/projects', function () {
    return Inertia::render('projects/index');
})->name('projects');

Route::get('/projects/ongoing', function () {
    return Inertia::render('projects/index', ['defaultTab' => 'ongoing']);
});

Route::get('/projects/completed', function () {
    return Inertia::render('projects/index', ['defaultTab' => 'completed']);
});

Route::get('/projects/upcoming', function () {
    return Inertia::render('projects/index', ['defaultTab' => 'upcoming']);
});

Route::get('/projects/{id}', function ($id) {
    return Inertia::render('projects/[id]', ['id' => $id]);
})->name('projects.show');

Route::get('/services', function () {
    return Inertia::render('services/index');
})->name('services');

Route::get('/services/{slug}', function ($slug) {
    return Inertia::render('services/show', ['slug' => $slug]);
})->name('services.show');

Route::get('/products', function () {
    return Inertia::render('products/index');
})->name('products');

Route::get('/products/{category}', function ($category) {
    return Inertia::render('products/category', ['categorySlug' => $category]);
})->name('products.category');

Route::get('/investment', function () {
    return Inertia::render('investment');
})->name('investment');

Route::get('/media', function () {
    return Inertia::render('media');
})->name('media');

Route::get('/career', function () {
    return Inertia::render('career');
})->name('career');

Route::get('/contact', function () {
    return Inertia::render('contact');
})->name('contact');

Route::get('/land-wanted', function () {
    return Inertia::render('land-wanted');
})->name('land-wanted');

Route::get('/business', function () {
    return Inertia::render('business');
})->name('business');

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/

Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('/login', function () {
        return Inertia::render('admin/login');
    })->name('login');

    Route::get('/', function () {
        return Inertia::render('admin/index');
    })->name('dashboard');

    // Page Editors
    Route::get('/pages/home', function () {
        return Inertia::render('admin/pages/home');
    })->name('pages.home');

    Route::get('/pages/about', function () {
        return Inertia::render('admin/pages/about');
    })->name('pages.about');

    Route::get('/pages/services', function () {
        return Inertia::render('admin/pages/services');
    })->name('pages.services');

    Route::get('/pages/products', function () {
        return Inertia::render('admin/pages/products');
    })->name('pages.products');

    Route::get('/pages/investment', function () {
        return Inertia::render('admin/pages/investment');
    })->name('pages.investment');

    Route::get('/pages/business', function () {
        return Inertia::render('admin/pages/business');
    })->name('pages.business');

    Route::get('/pages/land-wanted', function () {
        return Inertia::render('admin/pages/land-wanted');
    })->name('pages.land-wanted');

    Route::get('/pages/contact', function () {
        return Inertia::render('admin/pages/contact');
    })->name('pages.contact');

    Route::get('/pages/career', function () {
        return Inertia::render('admin/pages/career');
    })->name('pages.career');

    Route::get('/pages/media', function () {
        return Inertia::render('admin/pages/media');
    })->name('pages.media');

    // Projects Management
    Route::get('/projects', function () {
        return Inertia::render('admin/projects/index');
    })->name('projects');

    // Services Management
    Route::get('/services', function () {
        return Inertia::render('admin/services/index');
    })->name('services');

    // Testimonials Management
    Route::get('/testimonials', function () {
        return Inertia::render('admin/testimonials/index');
    })->name('testimonials');

    // News & Articles Management
    Route::get('/news', function () {
        return Inertia::render('admin/news/index');
    })->name('news');

    // Contact Inquiries Management
    Route::get('/inquiries', function () {
        return Inertia::render('admin/inquiries/index');
    })->name('inquiries');

    // Career Applications Management
    Route::get('/applications', function () {
        return Inertia::render('admin/applications/index');
    })->name('applications');

    // Media Library
    Route::get('/media-library', function () {
        return Inertia::render('admin/media-library/index');
    })->name('media-library');

    // Media Management (legacy)
    Route::get('/media', function () {
        return Inertia::render('admin/media/index');
    })->name('media');

    // Leads Management
    Route::get('/leads', function () {
        return Inertia::render('admin/leads/index');
    })->name('leads');

    // Header Settings
    Route::get('/header', function () {
        return Inertia::render('admin/header/index');
    })->name('header');

    // Settings
    Route::get('/settings', function () {
        return Inertia::render('admin/settings/index');
    })->name('settings');
});

/*
|--------------------------------------------------------------------------
| Authenticated User Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
