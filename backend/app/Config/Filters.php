<?php

namespace Config;

use CodeIgniter\Config\BaseConfig;

class Filters extends BaseConfig
{
    public array $aliases = [
        'csrf'     => \CodeIgniter\Filters\CSRF::class,
        'toolbar'  => \CodeIgniter\Filters\DebugToolbar::class,
        'honeypot' => \CodeIgniter\Filters\Honeypot::class,
        'jwtauth'  => \App\Filters\JWTAuthFilter::class,
        'cors'     => \App\Filters\CorsFilter::class,
    ];

    public array $globals = [
        'before' => [
            'cors',
            // 'csrf',
        ],
        'after'  => [],
    ];

    public array $methods = [];
    public array $filters = [];
}
