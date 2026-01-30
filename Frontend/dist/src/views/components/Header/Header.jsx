// ** React Imports
import { useEffect, useState } from 'react'
import "../../../@core/scss/react/pages/header.scss";
// ** Reactstrap Imports
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  Button,
  Input,
  Container
} from 'reactstrap'

// ** Hooks
import { useSkin } from '@hooks/useSkin'

// ** Components
import NavbarUser from '../../../@core/layouts/components/navbar/NavbarUser'

// ** Assets
import logo from '../../../assets/images/logo.png'
import SignupModal from '../../pages/authentication/SignupModal';
import LoginModal from '../../pages/authentication/LoginModal';

const Header = () => {
  const { skin, setSkin } = useSkin()
  const [time, setTime] = useState(new Date())
const [showSignup, setShowSignup] = useState(false);
const [showLogin, setShowLogin] = useState(false);

const toggleLogin = () => setShowLogin(prev => !prev);

const toggleSignup = () => setShowSignup(prev => !prev);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const date = time.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })

  return (
    <>
    <Navbar
      expand="md"
      className="app-header navbar-shadow"
      light={skin !== 'dark'}
      dark={skin === 'dark'}
    >
      <Container fluid className="d-flex align-items-center">

        {/* Left - Logo */}
        <NavbarBrand href="/" className="d-flex align-items-center">
          <img src={logo} alt="Logo" className="header-logo" />
        </NavbarBrand>

        {/* Center - Search */}
        <div className="header-search mx-3">
          <Input
            type="text"
            placeholder="Search Events (min 3 letters)..."
          />
        </div>

        {/* Right - Date / Theme / User */}
        <Nav className="ms-auto align-items-center" navbar>

          {/* Date & Time */}
          <NavItem className="me-3 text-end header-datetime">
            <small className="text-muted">{date} (IST)</small>
            <strong className="d-block">{time.toLocaleTimeString()}</strong>
          </NavItem>

          {/* Vuexy Navbar User (Theme Toggle + Notifications + User) */}
          <NavbarUser skin={skin} setSkin={setSkin} />

          {/* Auth Buttons (optional) */}
          <NavItem className="ms-2">
            <Button color="secondary" outline onClick={toggleLogin}>
              Login
            </Button>
          </NavItem>

          <NavItem className="ms-1">
            <Button color="primary" onClick={toggleSignup}>
              Sign Up
            </Button>
          </NavItem>

        </Nav>
      </Container>
    </Navbar>
     {/* Render Modal */}
      {showSignup && <SignupModal toggle={toggleSignup} />}
      {showLogin && <LoginModal toggle={toggleLogin} />}
      </>
  )
}

export default Header
