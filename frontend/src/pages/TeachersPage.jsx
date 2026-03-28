import { useState, useEffect } from 'react';
import { getTeachers, createTeacher, updateTeacher, deleteTeacher } from '../api';
import toast from 'react-hot-toast';

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 40 }, (_, i) => CURRENT_YEAR - i);

const emptyForm = {
  first_name: '', last_name: '', email: '', password: '',
  university_name: '', gender: '', year_joined: '', department: '', phone: '', bio: '',
};

export default function TeachersPage() {
  const [teachers, setTeachers] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState('');
  const [modal,    setModal]    = useState(null); // null | 'add' | 'edit'
  const [editing,  setEditing]  = useState(null);
  const [form,     setForm]     = useState(emptyForm);
  const [saving,   setSaving]   = useState(false);

  const load = () => {
    setLoading(true);
    getTeachers()
      .then(r => setTeachers(r.data.data || []))
      .catch(() => toast.error('Failed to load teachers'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const set = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const openAdd = () => { setForm(emptyForm); setEditing(null); setModal('add'); };
  const openEdit = (t) => {
    setEditing(t);
    setForm({
      first_name: t.first_name, last_name: t.last_name,
      university_name: t.university_name, gender: t.gender,
      year_joined: t.year_joined, department: t.department || '',
      phone: t.phone || '', bio: t.bio || '',
      email: '', password: '',
    });
    setModal('edit');
  };
  const closeModal = () => { setModal(null); setEditing(null); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (modal === 'add') {
        await createTeacher(form);
        toast.success('Teacher added!');
      } else {
        await updateTeacher(editing.id, form);
        toast.success('Teacher updated!');
      }
      closeModal();
      load();
    } catch (err) {
      const errors = err.response?.data?.errors;
      if (errors) Object.values(errors).forEach(m => toast.error(m));
      else toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (t) => {
    if (!confirm(`Delete ${t.first_name} ${t.last_name}? This cannot be undone.`)) return;
    try {
      await deleteTeacher(t.id);
      toast.success('Teacher removed');
      load();
    } catch {
      toast.error('Delete failed');
    }
  };

  const filtered = teachers.filter(t => {
    const q = search.toLowerCase();
    return (
      `${t.first_name} ${t.last_name}`.toLowerCase().includes(q) ||
      t.email?.toLowerCase().includes(q) ||
      t.university_name?.toLowerCase().includes(q) ||
      t.department?.toLowerCase().includes(q)
    );
  });

  return (
    <div>
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Teachers</h1>
          <p className="page-sub">{teachers.length} registered educator{teachers.length !== 1 ? 's' : ''}</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Teacher
        </button>
      </div>

      <div className="table-card">
        <div className="table-toolbar">
          <div className="search-box">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input
              placeholder="Search teachers…"
              value={search} onChange={e => setSearch(e.target.value)}
            />
          </div>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>
            {filtered.length} result{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        {loading ? <div className="spinner" /> : (
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Teacher</th>
                  <th>University</th>
                  <th>Department</th>
                  <th>Gender</th>
                  <th>Year Joined</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={7}>
                    <div className="empty-state">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                      <p>{search ? 'No teachers match your search' : 'No teachers yet. Add one!'}</p>
                    </div>
                  </td></tr>
                ) : filtered.map(t => (
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
                    <td><span className={`badge badge-${t.gender}`}>{t.gender}</span></td>
                    <td>{t.year_joined}</td>
                    <td>{t.phone || '—'}</td>
                    <td>
                      <div className="action-cell">
                        <button className="btn btn-sm btn-success" onClick={() => openEdit(t)}>Edit</button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(t)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">{modal === 'add' ? 'Add Teacher' : 'Edit Teacher'}</h2>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>

            <form onSubmit={handleSave}>
              {modal === 'add' && (
                <>
                  <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 }}>Account Info</p>
                  <div className="form-row">
                    <div className="form-group">
                      <label>First Name *</label>
                      <input name="first_name" value={form.first_name} onChange={set} placeholder="Alice" required />
                    </div>
                    <div className="form-group">
                      <label>Last Name *</label>
                      <input name="last_name" value={form.last_name} onChange={set} placeholder="Johnson" required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Email *</label>
                    <input type="email" name="email" value={form.email} onChange={set} placeholder="alice@uni.edu" required />
                  </div>
                  <div className="form-group">
                    <label>Password *</label>
                    <input type="password" name="password" value={form.password} onChange={set} placeholder="Min. 6 chars" required />
                  </div>
                  <div className="divider" style={{ margin: '16px 0' }}>Teacher Details</div>
                </>
              )}

              {modal === 'edit' && (
                <>
                  <div className="form-row">
                    <div className="form-group">
                      <label>First Name</label>
                      <input name="first_name" value={form.first_name} onChange={set} />
                    </div>
                    <div className="form-group">
                      <label>Last Name</label>
                      <input name="last_name" value={form.last_name} onChange={set} />
                    </div>
                  </div>
                </>
              )}

              <div className="form-group">
                <label>University *</label>
                <input name="university_name" value={form.university_name} onChange={set} placeholder="MIT" required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Gender *</label>
                  <select name="gender" value={form.gender} onChange={set} required>
                    <option value="">Select…</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Year Joined *</label>
                  <select name="year_joined" value={form.year_joined} onChange={set} required>
                    <option value="">Select…</option>
                    {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Department</label>
                  <input name="department" value={form.department} onChange={set} placeholder="Computer Science" />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input name="phone" value={form.phone} onChange={set} placeholder="+1 555 0100" />
                </div>
              </div>
              <div className="form-group">
                <label>Bio</label>
                <textarea name="bio" value={form.bio} onChange={set} rows={3} placeholder="Short bio…" style={{ resize: 'vertical' }} />
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? <><div className="spinner spinner-sm" />Saving…</> : 'Save Teacher'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
