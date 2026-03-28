<?php

namespace App\Filters;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Exception;

class JWTAuthFilter implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
        $authHeader = $request->getHeaderLine('Authorization');

        if (empty($authHeader) || !str_starts_with($authHeader, 'Bearer ')) {
            return response()->setStatusCode(401)
                ->setJSON(['status' => false, 'message' => 'Missing or invalid Authorization header']);
        }

        $token = substr($authHeader, 7);

        try {
            $secretKey = getenv('JWT_SECRET_KEY') ?: 'default_secret';
            $decoded   = JWT::decode($token, new Key($secretKey, 'HS256'));
            // Attach decoded payload to request for downstream use
            $request->jwtPayload = $decoded;
        } catch (Exception $e) {
            return response()->setStatusCode(401)
                ->setJSON(['status' => false, 'message' => 'Invalid or expired token: ' . $e->getMessage()]);
        }
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        // Nothing after
    }
}
