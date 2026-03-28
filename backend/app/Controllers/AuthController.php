<?php

namespace App\Controllers;

use App\Models\AuthUserModel;
use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\RESTful\ResourceController;

class AuthController extends ResourceController
{
    protected $format = 'json';
    protected AuthUserModel $userModel;

    public function __construct()
    {
        helper('jwt');
        $this->userModel = new AuthUserModel();
    }

    /**
     * POST /api/auth/register
     */
    public function register(): ResponseInterface
    {
        $rules = [
            'email'      => 'required|valid_email|is_unique[auth_user.email]',
            'first_name' => 'required|min_length[2]|max_length[100]',
            'last_name'  => 'required|min_length[2]|max_length[100]',
            'password'   => 'required|min_length[6]',
        ];

        $data = $this->request->getJSON(true) ?? $this->request->getPost();

        if (!$this->validate($rules, $data)) {
            return $this->respond([
                'status'  => false,
                'message' => 'Validation failed',
                'errors'  => $this->validator->getErrors(),
            ], 422);
        }

        $userId = $this->userModel->insert([
            'email'      => $data['email'],
            'first_name' => $data['first_name'],
            'last_name'  => $data['last_name'],
            'password'   => $data['password'],
        ]);

        if (!$userId) {
            return $this->respond([
                'status'  => false,
                'message' => 'Registration failed',
            ], 500);
        }

        $user  = $this->userModel->find($userId);
        $token = generate_jwt(['user_id' => $userId, 'email' => $user['email']]);

        unset($user['password']);

        return $this->respond([
            'status'  => true,
            'message' => 'Registration successful',
            'token'   => $token,
            'user'    => $user,
        ], 201);
    }

    /**
     * POST /api/auth/login
     */
    public function login(): ResponseInterface
    {
        $data = $this->request->getJSON(true) ?? $this->request->getPost();

        $email    = $data['email']    ?? '';
        $password = $data['password'] ?? '';

        if (empty($email) || empty($password)) {
            return $this->respond([
                'status'  => false,
                'message' => 'Email and password are required',
            ], 422);
        }

        $user = $this->userModel->findByEmail($email);

        if (!$user || !password_verify($password, $user['password'])) {
            return $this->respond([
                'status'  => false,
                'message' => 'Invalid email or password',
            ], 401);
        }

        if (!$user['is_active']) {
            return $this->respond([
                'status'  => false,
                'message' => 'Account is deactivated',
            ], 403);
        }

        $token = generate_jwt(['user_id' => $user['id'], 'email' => $user['email']]);
        unset($user['password']);

        return $this->respond([
            'status'  => true,
            'message' => 'Login successful',
            'token'   => $token,
            'user'    => $user,
        ]);
    }

    /**
     * GET /api/auth/me  (protected)
     */
    public function me(): ResponseInterface
    {
        $payload = $this->request->jwtPayload;
        $user    = $this->userModel->find($payload->user_id);

        if (!$user) {
            return $this->respond(['status' => false, 'message' => 'User not found'], 404);
        }

        unset($user['password']);

        return $this->respond([
            'status' => true,
            'user'   => $user,
        ]);
    }
}
