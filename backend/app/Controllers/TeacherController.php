<?php

namespace App\Controllers;

use App\Models\AuthUserModel;
use App\Models\TeacherModel;
use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\RESTful\ResourceController;

class TeacherController extends ResourceController
{
    protected $format = 'json';
    protected AuthUserModel $userModel;
    protected TeacherModel  $teacherModel;

    public function __construct()
    {
        helper('jwt');
        $this->userModel    = new AuthUserModel();
        $this->teacherModel = new TeacherModel();
    }

    /**
     * GET /api/teachers  — list all teachers with user data
     */
    public function index(): ResponseInterface
    {
        $teachers = $this->teacherModel->getAllWithUser();

        return $this->respond([
            'status' => true,
            'data'   => $teachers,
            'count'  => count($teachers),
        ]);
    }

    /**
     * GET /api/teachers/:id
     */
    public function show($id = null): ResponseInterface
    {
        $teacher = $this->teacherModel->getWithUser((int)$id);

        if (!$teacher) {
            return $this->respond(['status' => false, 'message' => 'Teacher not found'], 404);
        }

        return $this->respond(['status' => true, 'data' => $teacher]);
    }

    /**
     * POST /api/teachers  — create auth_user + teacher in one request
     */
    public function create(): ResponseInterface
    {
        $data = $this->request->getJSON(true) ?? $this->request->getPost();

        // Validate user fields
        $userRules = [
            'email'      => 'required|valid_email|is_unique[auth_user.email]',
            'first_name' => 'required|min_length[2]',
            'last_name'  => 'required|min_length[2]',
            'password'   => 'required|min_length[6]',
        ];

        // Validate teacher fields
        $teacherRules = [
            'university_name' => 'required|min_length[2]',
            'gender'          => 'required|in_list[male,female,other]',
            'year_joined'     => 'required|integer|greater_than[1900]',
        ];

        $allRules = array_merge($userRules, $teacherRules);

        if (!$this->validate($allRules, $data)) {
            return $this->respond([
                'status'  => false,
                'message' => 'Validation failed',
                'errors'  => $this->validator->getErrors(),
            ], 422);
        }

        $db = \Config\Database::connect();
        $db->transStart();

        try {
            // Insert auth_user
            $userId = $this->userModel->insert([
                'email'      => $data['email'],
                'first_name' => $data['first_name'],
                'last_name'  => $data['last_name'],
                'password'   => $data['password'],
            ]);

            if (!$userId) {
                throw new \Exception('Failed to create user account');
            }

            // Insert teacher
            $teacherId = $this->teacherModel->insert([
                'user_id'         => $userId,
                'university_name' => $data['university_name'],
                'gender'          => $data['gender'],
                'year_joined'     => $data['year_joined'],
                'department'      => $data['department']    ?? null,
                'phone'           => $data['phone']         ?? null,
                'bio'             => $data['bio']           ?? null,
            ]);

            if (!$teacherId) {
                throw new \Exception('Failed to create teacher profile');
            }

            $db->transComplete();

            if ($db->transStatus() === false) {
                throw new \Exception('Transaction failed');
            }

            $teacher = $this->teacherModel->getWithUser($teacherId);

            return $this->respond([
                'status'  => true,
                'message' => 'Teacher created successfully',
                'data'    => $teacher,
            ], 201);

        } catch (\Exception $e) {
            $db->transRollback();
            return $this->respond([
                'status'  => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * PUT /api/teachers/:id
     */
    public function update($id = null): ResponseInterface
    {
        $teacher = $this->teacherModel->find((int)$id);
        if (!$teacher) {
            return $this->respond(['status' => false, 'message' => 'Teacher not found'], 404);
        }

        $data = $this->request->getJSON(true) ?? $this->request->getRawInput();

        $db = \Config\Database::connect();
        $db->transStart();

        try {
            // Update user fields if provided
            $userFields = array_filter([
                'first_name' => $data['first_name'] ?? null,
                'last_name'  => $data['last_name']  ?? null,
            ]);

            if (!empty($userFields)) {
                $this->userModel->update($teacher['user_id'], $userFields);
            }

            // Update teacher fields
            $teacherFields = array_filter([
                'university_name' => $data['university_name'] ?? null,
                'gender'          => $data['gender']          ?? null,
                'year_joined'     => $data['year_joined']     ?? null,
                'department'      => $data['department']      ?? null,
                'phone'           => $data['phone']           ?? null,
                'bio'             => $data['bio']             ?? null,
            ]);

            if (!empty($teacherFields)) {
                $this->teacherModel->update($id, $teacherFields);
            }

            $db->transComplete();

            $updated = $this->teacherModel->getWithUser((int)$id);

            return $this->respond([
                'status'  => true,
                'message' => 'Teacher updated successfully',
                'data'    => $updated,
            ]);

        } catch (\Exception $e) {
            $db->transRollback();
            return $this->respond(['status' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * DELETE /api/teachers/:id
     */
    public function delete($id = null): ResponseInterface
    {
        $teacher = $this->teacherModel->find((int)$id);
        if (!$teacher) {
            return $this->respond(['status' => false, 'message' => 'Teacher not found'], 404);
        }

        // Deleting auth_user cascades to teachers via FK
        $this->userModel->delete($teacher['user_id']);

        return $this->respond([
            'status'  => true,
            'message' => 'Teacher deleted successfully',
        ]);
    }
}
