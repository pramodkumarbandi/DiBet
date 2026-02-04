import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendOtp, verifyOtp, signupUser } from '../../../redux/authSlice';
import { Button, Input, Form, FormGroup, Label, Spinner, FormFeedback } from 'reactstrap';
import { useSkin } from '@hooks/useSkin';
import toast, { Toaster } from 'react-hot-toast';
import logo from '../../../assets/images/logo.png';

const SignupModal = ({ toggle, onSwitchToLogin }) => { 
  const dispatch = useDispatch();
  const { loading, otpSent, otpVerified, user, error } = useSelector(state => state.auth);
  const { skin } = useSkin();

  const [form, setForm] = useState({
    phone: '',
    username: '',
    password: '',
    confirm_password: '',
    otp: '',
    referral: ''
  });

  const [phoneOtpLoading, setPhoneOtpLoading] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
 
  const handleSendOtp = async () => {
    if (!form.phone) {
      toast.error('Enter phone number');
      return;
    }

    if (!isPhoneValid) {
      toast.error('Enter a valid 10-digit phone number');
      return;
    }

    setPhoneOtpLoading(true);
    try {
      await dispatch(sendOtp(form.phone)).unwrap();
      toast.success('OTP sent successfully');
    } catch (err) {
      toast.error(err || 'Failed to send OTP');
    } finally {
      setPhoneOtpLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!form.otp) {
      toast.error('Enter OTP');
      return;
    }

    try {
      await dispatch(
        verifyOtp({ phone: form.phone, otp: form.otp })
      ).unwrap();
      setPhoneVerified(true);
      toast.success('Phone verified successfully');
    } catch (err) {
      toast.error(err || 'OTP verification failed');
    }
  };

 const handleSignup = () => {
    if (!phoneVerified) {
      toast.error('Verify phone OTP first');
      return;
    }

    if (form.password !== form.confirm_password) {
      toast.error('Passwords do not match');
      return;
    }

    dispatch(
      signupUser({
        phone: form.phone,
        username: form.username,
        password: form.password,
        confirm_password: form.confirm_password,
        referral: form.referral
      })
    );

    toast.loading('Creating your account...');
  };

  useEffect(() => {
    if (user) {
      toast.dismiss();
      toast.success('Account created successfully 🎉');
      toggle();
    }
  }, [user]);

  const isPhoneValid = /^\d{10}$/.test(form.phone);

  // Theme-based styles
  const modalStyles = {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    background: skin === 'dark' ? 'rgba(0,0,0,0.85)' : 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999
  };

  const containerStyles = {
    display: 'flex',
    width: '600px',
    borderRadius: '8px',
    overflow: 'hidden',
    background: skin === 'dark' ? '#1e1e2f' : '#fff',
    color: skin === 'dark' ? '#fff' : '#000'
  };

  const leftStyles = {
    flex: 1,
    background: skin === 'dark' ? '#2c2c3c' : '#f5f5f5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const rightStyles = {
    flex: 1,
    padding: '20px',
    position: 'relative'
  };

  const inputStyles = {
    background: skin === 'dark' ? '#2c2c3c' : '#fff',
    color: skin === 'dark' ? '#fff' : '#000',
    borderColor: skin === 'dark' ? '#444' : '#ced4da',
    paddingRight: '90px'
  };

  const buttonStyles = skin === 'dark' 
    ? { backgroundColor: '#4a90e2', borderColor: '#4a90e2' } 
    : {};

  const linkStyles = {
    color: skin === 'dark' ? '#4a90e2' : '#007bff',
    cursor: 'pointer',
    marginTop: '10px',
    display: 'block',
    textAlign: 'center',
    textDecoration: 'underline'
  };

  return (
    <div style={modalStyles}>
      <div style={containerStyles}>

        {/* Left - Logo */}
        <div style={leftStyles}>
          <img src={logo} alt="Logo" style={{ width: '80%', height: 'auto' }} />
        </div>

        {/* Right - Form */}
        <div style={rightStyles}>
          <button
            onClick={toggle}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              border: 'none',
              background: 'transparent',
              fontSize: '20px',
              cursor: 'pointer',
              color: skin === 'dark' ? '#fff' : '#000'
            }}
          >&times;</button>

          <Form className="my-signup-form">
            {/* Phone Input with OTP */}
            <FormGroup>
              <Label className="form-label" for="phone">Phone</Label>
              <div className="position-relative">
                <Input
                  type="text"
                  id="phone"
                  name="phone"
                  placeholder="Enter phone"
                  value={form.phone}
                  invalid={!!form.phone && !isPhoneValid}
                  onChange={handleChange}
                  style={inputStyles}
                />

                {phoneVerified ? (
                  <span style={{
                    color: "green",
                    position: "absolute",
                    top: "50%",
                    right: "10px",
                    transform: "translateY(-50%)",
                    pointerEvents: "none",
                    fontWeight: "bold",
                  }}>
                    &#10003;
                  </span>
                ) : (
                  <span
                    onClick={isPhoneValid && !phoneOtpLoading ? handleSendOtp : undefined}
                    style={{
                      position: "absolute",
                      top: "50%",
                      right: "10px",
                      transform: "translateY(-50%)",
                      cursor: isPhoneValid && !phoneOtpLoading ? "pointer" : "not-allowed",
                      color: isPhoneValid && !phoneOtpLoading ? "orange" : "#6c757d",
                      fontWeight: "500",
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={e => { if (isPhoneValid && !phoneOtpLoading) e.target.style.color = "#ff8000"; }} 
                    onMouseLeave={e => { if (isPhoneValid && !phoneOtpLoading) e.target.style.color = "orange"; }}
                  >
                    {phoneOtpLoading ? <Spinner size="sm" /> : "Get OTP"}
                  </span>
                )}

                <FormFeedback>Enter a valid 10-digit phone number</FormFeedback>
              </div>

              {/* OTP Input */}
{/* OTP Input */}
{otpSent && !phoneVerified && (
  <div className="position-relative mt-1">
    <Input
      type="text"
      id="otp"
      name="otp"
      placeholder="Enter OTP"
      value={form.otp}
      onChange={handleChange}
      autoComplete="one-time-code"
      inputMode="numeric"
      maxLength={6}
      style={{
        ...inputStyles,
        paddingRight: '110px',
      }}
    />

    <span
      onClick={!loading && form.otp?.length === 6 ? handleVerifyOtp : undefined}
      style={{
        position: "absolute",
        top: "50%",
        right: "10px",
        transform: "translateY(-50%)",
        cursor: !loading && form.otp?.length === 6 ? "pointer" : "not-allowed",
        color: !loading && form.otp?.length === 6 ? "green" : "#6c757d",
        fontWeight: "500",
        transition: "color 0.2s",
      }}
      onMouseEnter={e => {
        if (!loading && form.otp?.length === 6)
          e.target.style.color = "#0f9d58";
      }}
      onMouseLeave={e => {
        if (!loading && form.otp?.length === 6)
          e.target.style.color = "green";
      }}
    >
      {loading ? <Spinner size="sm" /> : "Verify OTP"}
    </span>
  </div>
)}


            </FormGroup>

            {/* Username */}
            <FormGroup>
              <Label>Username</Label>
              <Input
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Enter username"
                style={inputStyles}
              />
            </FormGroup>

            {/* Password */}
            <FormGroup>
              <Label>Password</Label>
              <Input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter password"
                style={inputStyles}
              />
            </FormGroup>

            {/* Confirm Password */}
            <FormGroup>
              <Label>Confirm Password</Label>
              <Input
                type="password"
                name="confirm_password"
                value={form.confirm_password}
                onChange={handleChange}
                placeholder="Confirm password"
                style={inputStyles}
              />
            </FormGroup>

            {/* Referral Code */}
            <FormGroup>
              <Label>Referral Code (Optional)</Label>
              <Input
                type="text"
                name="referral"
                value={form.referral}
                onChange={handleChange}
                placeholder="Enter referral code"
                style={inputStyles}
              />
            </FormGroup>

            <Button
              color="primary"
              block
              onClick={handleSignup}
              disabled={loading}
              style={buttonStyles}
            >
              {loading ? <Spinner size="sm" /> : "Register"}
            </Button>

            {/* Sign-in link */}
            <span style={linkStyles} onClick={onSwitchToLogin}>
              Already have an account? Sign In
            </span>

            {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
          </Form>
        </div>
      </div>
    </div>
  );
};

export default SignupModal;
