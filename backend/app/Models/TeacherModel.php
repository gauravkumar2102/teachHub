<?php

namespace App\Models;

use CodeIgniter\Model;

class TeacherModel extends Model
{
    protected $table            = 'teachers';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';

    protected $allowedFields = [
        'user_id', 'university_name', 'gender', 'year_joined',
        'department', 'phone', 'profile_image', 'bio',
    ];

    protected $useTimestamps = true;
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';

    protected $validationRules = [
        'user_id'         => 'required|integer',
        'university_name' => 'required|min_length[2]|max_length[255]',
        'gender'          => 'required|in_list[male,female,other]',
        'year_joined'     => 'required|integer|greater_than[1900]',
    ];

    /**
     * Get all teachers joined with auth_user data
     */
    public function getAllWithUser(): array
    {
        return $this->db->table('teachers t')
            ->select('t.*, u.email, u.first_name, u.last_name, u.is_active, u.created_at as user_created_at')
            ->join('auth_user u', 'u.id = t.user_id')
            ->get()
            ->getResultArray();
    }

    /**
     * Get single teacher with user data
     */
    public function getWithUser(int $id): ?array
    {
        return $this->db->table('teachers t')
            ->select('t.*, u.email, u.first_name, u.last_name, u.is_active')
            ->join('auth_user u', 'u.id = t.user_id')
            ->where('t.id', $id)
            ->get()
            ->getRowArray();
    }
}
