import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 40 }, (_, i) => CURRENT_YEAR - i);

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate     = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    first_name: '', last_name: '', email: '', password: '',
    university_name: '', gender: '', year_joined: '', department: '', phone: '',
  });

  const set = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const required = ['first_name','last_name','email','password','university_name','gender','year_joined'];
    if (required.some(k => !form[k])) {
      toast.error('Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created! Welcome 🎉');
      navigate('/dashboard');
    } catch (err) {
      const errors = err.response?.data?.errors;
      if (errors) {
        Object.values(errors).forEach(msg => toast.error(msg));
      } else {
        toast.error(err.response?.data?.message || 'Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-left">
        <div className="auth-branding">
          <div className="auth-brand-logo">
            Join the<br /><span className="highlight">educator</span><br />network.
          </div>
          <p className="auth-brand-sub">
            Create your teacher profile in seconds. Manage your professional information in one place.
          </p>
          <div className="auth-dots"><span/><span/><span/><span/></div>
        </div>
      </div>

      <div className="auth-right" style={{ padding: '40px 60px', overflowY: 'auto' }}>
        <div className="auth-card" style={{ maxWidth: 480 }}>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-sub">Register as a teacher — fills both tables at once</p>

          <form onSubmit={handleSubmit}>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 }}>Account Info</p>
            <div className="form-row">
              <div className="form-group">
                <label>First Name *</label>
                <input name="first_name" placeholder="Alice" value={form.first_name} onChange={set} />
              </div>
              <div className="form-group">
                <label>Last Name *</label>
                <input name="last_name" placeholder="Johnson" value={form.last_name} onChange={set} />
              </div>
            </div>
            <div className="form-group">
              <label>Email Address *</label>
              <input type="email" name="email" placeholder="alice@university.edu" value={form.email} onChange={set} />
            </div>
            <div className="form-group">
              <label>Password *</label>
              <input type="password" name="password" placeholder="Min. 6 characters" value={form.password} onChange={set} />
            </div>

            <div className="divider" style={{ margin: '18px 0' }}>Teacher Details</div>

            <div className="form-group">
              <label>University / Institution *</label>
              <input name="university_name" placeholder="MIT, Stanford…" value={form.university_name} onChange={set} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Gender *</label>
                <select name="gender" value={form.gender} onChange={set}>
                  <option value="">Select…</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Year Joined *</label>
                <select name="year_joined" value={form.year_joined} onChange={set}>
                  <option value="">Select…</option>
                  {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Department</label>
                <input name="department" placeholder="Computer Science" value={form.department} onChange={set} />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input name="phone" placeholder="+1 555 0100" value={form.phone} onChange={set} />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-full" disabled={loading} style={{ marginTop: 8 }}>
              {loading ? <><div className="spinner spinner-sm" />Creating account…</> : 'Create Account'}
            </button>
          </form>

          <p className="auth-link">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
