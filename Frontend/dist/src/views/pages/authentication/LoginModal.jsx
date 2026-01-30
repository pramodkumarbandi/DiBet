import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { loginUser } from '../../../redux/authSlice';
import { Button, Input, Form, FormGroup, Label, Spinner } from 'reactstrap';
import { useSkin } from '@hooks/useSkin';
import logo from '../../../assets/images/logo.png';

const LoginModal = ({ toggle, onSwitchToSignup }) => {
  const dispatch = useDispatch();
  const { loading, user, error } = useSelector(state => state.auth);
  const { skin } = useSkin();

  const [loginType, setLoginType] = useState('username');
  const [form, setForm] = useState({
    userId: '',
    password: ''
  });

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = () => {
    if (!form.userId || !form.password) {
      alert('Enter credentials');
      return;
    }

    dispatch(
      loginUser({
        type: loginType,
        userId: form.userId,
        password: form.password
      })
    );
  };

  useEffect(() => {
    if (user) toggle();
  }, [user]);

  /* ================= STYLES ================= */

  const modalStyles = {
    position: 'fixed',
    inset: 0,
    background: skin === 'dark'
      ? 'rgba(0,0,0,0.85)'
      : 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999
  };

  const containerStyles = {
    width: '420px',
    borderRadius: '8px',
    padding: '24px',
    background: skin === 'dark' ? '#0f1e22' : '#fff',
    color: skin === 'dark' ? '#fff' : '#000',
    position: 'relative'
  };

  const inputStyles = {
    background: skin === 'dark' ? '#1c2f35' : '#fff',
    color: skin === 'dark' ? '#fff' : '#000',
    borderColor: skin === 'dark' ? '#2b444b' : '#ced4da'
  };

  const buttonStyles = {
    backgroundColor: '#2f555f',
    border: 'none'
  };

  /* ================= JSX ================= */

  return (
    <div style={modalStyles}>
      <div style={containerStyles}>

        {/* Close */}
        <button
          onClick={toggle}
          style={{
            position: 'absolute',
            top: '10px',
            right: '12px',
            background: 'transparent',
            border: 'none',
            fontSize: '22px',
            color: skin === 'dark' ? '#fff' : '#000',
            cursor: 'pointer'
          }}
        >
          ×
        </button>

        {/* Logo */}
        <div className="text-center mb-2">
          <img src={logo} alt="logo" style={{ height: '50px' }} />
        </div>

        <Form>
          {/* Login With */}
          <FormGroup>
            <Label>Login with</Label>
            <Input
              type="select"
              value={loginType}
              onChange={e => setLoginType(e.target.value)}
              style={inputStyles}
            >
              <option value="username">Username</option>
              <option value="phone">Phone</option>
            </Input>
          </FormGroup>

          {/* User ID */}
          <FormGroup>
            <Label>User ID</Label>
            <Input
              name="userId"
              placeholder={
                loginType === 'phone'
                  ? 'Enter phone number'
                  : 'Enter username'
              }
              value={form.userId}
              onChange={handleChange}
              style={inputStyles}
            />
          </FormGroup>

          {/* Password */}
          <FormGroup>
            <Label>Password</Label>
            <Input
              type="password"
              name="password"
              placeholder="Enter password"
              value={form.password}
              onChange={handleChange}
              style={inputStyles}
            />
          </FormGroup>

          {/* Forgot */}
          <div
            style={{
              fontSize: '14px',
              textDecoration: 'underline',
              cursor: 'pointer',
              marginBottom: '12px'
            }}
          >
            Forgot Password / Username
          </div>

          {/* Login Button */}
          <Button
            block
            onClick={handleLogin}
            disabled={loading}
            style={buttonStyles}
          >
            {loading ? <Spinner size="sm" /> : 'Login'}
          </Button>

          {/* Signup */}
          <div
            className="text-center mt-2"
            style={{ cursor: 'pointer' }}
            onClick={onSwitchToSignup}
          >
            New User? <b>Create an Account</b>
          </div>

          {error && (
            <p className="text-danger text-center mt-1">{error}</p>
          )}
        </Form>
      </div>
    </div>
  );
};

export default LoginModal;
