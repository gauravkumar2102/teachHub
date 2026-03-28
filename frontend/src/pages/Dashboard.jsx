import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getTeachers } from '../api';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    getTeachers()
      .then(r => setTeachers(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const genderCount = (g) => teachers.filter(t => t.gender === g).length;
  const uniSet = new Set(teachers.map(t => t.university_name));

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-sub">Welcome back, {user?.first_name}! Here's what's happening.</p>
      </div>

      {loading ? (
        <div className="spinner" />
      ) : (
        <>
          <div className="stats-grid">
            <div className="stat-card" style={{'--card-accent': '#6c63ff'}}>
              <div className="stat-label">Total Teachers</div>
              <div className="stat-value">{teachers.length}</div>
              <span className="stat-badge">All time</span>
            </div>
            <div className="stat-card" style={{'--card-accent': '#ff6584'}}>
              <div className="stat-label">Universities</div>
              <div className="stat-value">{uniSet.size}</div>
              <span className="stat-badge">Distinct</span>
            </div>
            <div className="stat-card" style={{'--card-accent': '#43e97b'}}>
              <div className="stat-label">Male</div>
              <div className="stat-value">{genderCount('male')}</div>
              <span className="stat-badge">Gender</span>
            </div>
            <div className="stat-card" style={{'--card-accent': '#f7971e'}}>
              <div className="stat-label">Female</div>
              <div className="stat-value">{genderCount('female')}</div>
              <span className="stat-badge">Gender</span>
            </div>
          </div>

          <div className="table-card">
            <div className="table-toolbar">
              <span style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '1.05rem' }}>
                Recent Teachers
              </span>
              <button className="btn btn-primary btn-sm" onClick={() => navigate('/teachers')}>
                View All
              </button>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>University</th>
                  <th>Department</th>
                  <th>Year Joined</th>
                </tr>
              </thead>
              <tbody>
                {teachers.slice(0, 5).map(t => (
                  <tr key={t.id}>
                    <td>
                      <div className="td-name">
                        <div className="td-avatar">{t.first_name?.[0]}{t.last_name?.[0]}</div>
                        <div>
                          <div className="td-primary">{t.first_name} {t.last_name}</div>
                          <div className="td-secondary">{t.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>{t.university_name}</td>
                    <td>{t.department || '—'}</td>
                    <td>{t.year_joined}</td>
                  </tr>
                ))}
                {teachers.length === 0 && (
                  <tr><td colSpan={4}>
                    <div className="empty-state">
                      <p>No teachers yet. <button className="btn btn-primary btn-sm" onClick={() => navigate('/teachers')}>Add one</button></p>
                    </div>
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
