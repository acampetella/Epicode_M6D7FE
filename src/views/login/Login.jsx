import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Container, Row } from "react-bootstrap";
import Footer from "../../components/footer/Footer";
import toast, { Toaster } from "react-hot-toast";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  useEffect(() => {
    const session = localStorage.getItem("session");
    if (session) {
      navigate("../home", { replace: true });
    }
  }, [navigate]);

  const handleChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (checkFields()) {
      try {
        const data = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        const response = await data.json();
        if (response.statusCode === 200) {
          localStorage.setItem("session", response.token);
          navigate("/home");
        } else {
          toast.error(`Si è verificato il seguente errore: ${response.message}`);
        }
      } catch (error) {
        toast.error(`Si è verificato il seguente errore: ${error}`);
      }
    } else {
      toast.error("Devi compilare entrambi i campi username e password");
    }
  };

  const checkFields = () => {
    if (formData.email !== "" && formData.password !== "") {
      return true;
    }
    return false;
  };

  const loginWithGithubHandler = async () => {
    
    window.location.href = `${process.env.REACT_APP_SERVER_BASE_URL}/auth/github`;
  
  }

  return (
    <>
      <div>
        <Toaster position="top-center" reverseOrder={false} />
      </div>
      <div className="my-5 w-50 m-auto">
        <Container className="p-5 border">
          <Row>
            <h1 className="mb-2">LOGIN</h1>
          </Row>
          <Row className="w-50">
            <img
              src="https://www.freeiconspng.com/thumbs/login-icon/user-login-icon-29.png"
              className="w-50"
              alt="Login"
            />
          </Row>
          <Row>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  onChange={handleChange}
                  className="w-50"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Password"
                  onChange={handleChange}
                  className="w-50"
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                Login
              </Button>
              <Button variant="primary" className="ms-3" onClick={loginWithGithubHandler}>
                Login con GitHub
              </Button>
              <Link to={"/registration"}>
                <Button variant="link">Registrati</Button>
              </Link>
            </Form>
          </Row>
        </Container>
        <Footer />
      </div>
    </>
  );
};

export default Login;
