import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [form, setForm]       = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-left">
        <div className="auth-branding">
          <div className="auth-brand-logo">
            Manage your<br /><span className="highlight">educators</span><br />with ease.
          </div>
          <p className="auth-brand-sub">
            A unified platform for managing teacher profiles, authentication, and institutional data all in one place.
          </p>
          <div className="auth-dots">
            <span/><span/><span/><span/>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-sub">Sign in to your account to continue</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email address</label>
              <input
                type="email" name="email" placeholder="you@university.edu"
                value={form.email} onChange={handleChange} autoComplete="email"
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password" name="password" placeholder="••••••••"
                value={form.password} onChange={handleChange} autoComplete="current-password"
              />
            </div>

            <button type="submit" className="btn btn-primary btn-full" disabled={loading} style={{marginTop: 8}}>
              {loading
                ? <><div className="spinner spinner-sm" />Signing in…</>
                : 'Sign In'}
            </button>
          </form>

          <div className="divider">or</div>

          <p className="auth-link">
            Don't have an account? <Link to="/register">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
