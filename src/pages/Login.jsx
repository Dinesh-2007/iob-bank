import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('admin');
  const navigate = useNavigate();

  const credentials = {
    admin: { username: 'admin', password: 'admin123' },
    analyst: { username: 'analyst', password: 'analyst123' }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (username === credentials[role].username && password === credentials[role].password) {
      navigate(role === 'admin' ? '/admin' : `/dashboard/${role}`);
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>IOB Bank Login</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
            />
          </div>

          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>

          <button type="submit" className="login-btn">Login</button>

          <div className="form-group">
            <label>Select Role:</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="admin">Admin Dashboard</option>
              <option value="analyst">AML Analyst Dashboard</option>
            </select>
          </div>
        </form>

        <div className="credentials-info">
          <h3>Test Credentials:</h3>
          <p><strong>Admin:</strong> admin / admin123</p>
          <p><strong>Analyst:</strong> analyst / analyst123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
