<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */

// Public routes
$routes->post('api/auth/register', 'AuthController::register');
$routes->post('api/auth/login',    'AuthController::login');

// Protected routes (require JWT)
$routes->group('api', ['filter' => 'jwtauth'], function ($routes) {
    // Teacher CRUD
    $routes->post('teachers',        'TeacherController::create');
    $routes->get('teachers',         'TeacherController::index');
    $routes->get('teachers/(:num)',  'TeacherController::show/$1');
    $routes->put('teachers/(:num)',  'TeacherController::update/$1');
    $routes->delete('teachers/(:num)', 'TeacherController::delete/$1');

    // Auth user data
    $routes->get('auth/me', 'AuthController::me');
});
