<?php

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

if (!function_exists('generate_jwt')) {
    function generate_jwt(array $payload): string
    {
        $secretKey      = getenv('JWT_SECRET_KEY') ?: 'default_secret';
        $expireMinutes  = (int)(getenv('JWT_EXPIRE_MINUTES') ?: 1440);

        $payload['iat'] = time();
        $payload['exp'] = time() + ($expireMinutes * 60);

        return JWT::encode($payload, $secretKey, 'HS256');
    }
}

if (!function_exists('decode_jwt')) {
    function decode_jwt(string $token): ?object
    {
        try {
            $secretKey = getenv('JWT_SECRET_KEY') ?: 'default_secret';
            return JWT::decode($token, new Key($secretKey, 'HS256'));
        } catch (\Exception $e) {
            return null;
        }
    }
}
