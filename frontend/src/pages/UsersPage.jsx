import { useState, useEffect } from 'react';
import { getTeachers } from '../api';
import toast from 'react-hot-toast';

export default function UsersPage() {
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');

  useEffect(() => {
    // Teachers endpoint returns joined data including auth_user fields
    getTeachers()
      .then(r => setUsers(r.data.data || []))
      .catch(() => toast.error('Failed to load users'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    return (
      `${u.first_name} ${u.last_name}`.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q)
    );
  });

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Auth Users</h1>
        <p className="page-sub">All registered accounts from the <code style={{ background: 'var(--surface2)', padding: '2px 6px', borderRadius: 4, fontSize: '0.85rem' }}>auth_user</code> table</p>
      </div>

      <div className="table-card">
        <div className="table-toolbar">
          <div className="search-box">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input placeholder="Search users…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>
            {filtered.length} user{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        {loading ? <div className="spinner" /> : (
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Registered</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={5}>
                  <div className="empty-state">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    <p>No users found</p>
                  </div>
                </td></tr>
              ) : filtered.map((u, i) => (
                <tr key={u.user_id || u.id}>
                  <td style={{ color: 'var(--text-dim)', fontSize: '0.82rem' }}>{i + 1}</td>
                  <td>
                    <div className="td-name">
                      <div className="td-avatar">{u.first_name?.[0]}{u.last_name?.[0]}</div>
                      <div className="td-primary">{u.first_name} {u.last_name}</div>
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-dim)' }}>{u.email}</td>
                  <td>
                    <span className={`badge ${u.is_active ? 'badge-active' : 'badge-inactive'}`}>
                      {u.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>
                    {u.user_created_at
                      ? new Date(u.user_created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                      : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
