import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import Home from './components/home/Home';
// import { AccessToken } from "./common/ApiClient";

function App() {
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const [UserInfo, setUserInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  
  useEffect(() => {
    // Check authentication status on component mount
    checkAuthenticationStatus();
  }, []);

  useEffect(() => {
    // Validate token whenever `token` changes

  }, []);

  const checkAuthenticationStatus = () => {
    const storedToken = localStorage.getItem('token');
    const isAuthenticated = !!storedToken;
    // setToken(storedToken);
    setLoading(false);
  };



  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <Router>
          
      <Container>

        <Row className="justify-content-md-center">
          <Col>
            <div className="App">
              <Routes>
                <Route path="/" element={<Home />} />
              </Routes>
            </div>
          </Col>
        </Row>
      </Container>
    </Router>
  );
}

export default App;
