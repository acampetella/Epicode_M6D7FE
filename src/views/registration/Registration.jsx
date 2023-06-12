import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Footer from "../../components/footer/Footer";
import { RingLoader } from "react-spinners";

const Registration = () => {
  const initialState = {
    firstName: "",
    lastName: "",
    email: "",
    birthDate: "",
    avatar: "",
    password: "",
  };

  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialState);
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const onChangeHandleFile = (event) => {
    setFile(event.target.files[0]);
  };

  const handleChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (checkFields()) {
      setIsLoading(true);
      try {
        let postData = { ...formData };
        if (file !== null) {
          const fileUploaded = await fileUpload(
            file,
            `${process.env.REACT_APP_SERVER_BASE_URL}/authors/internal/avatarUpload`
          );
          postData = {
            ...postData,
            avatar: fileUploaded.img,
          };
        }
        const data = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/authors`, {
          method: "POST",
          body: JSON.stringify(postData),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const response = await data.json();
        checkStausCode(response.statusCode);
        setIsLoading(false);
        resetFields();
        goToHome();
      } catch (error) {
        toast.error("Errore nella registrazione dell'utente");
      }
      setIsLoading(false);
    } else {
      toast.error("Devi compilare tutti i campi obbligatori");
    }
  };

  const checkFields = () => {
    if (
      formData.firstName !== "" &&
      formData.lastName !== "" &&
      formData.email !== "" &&
      formData.birthDate !== "" &&
      formData.password !== ""
    ) {
      return true;
    }
    return false;
  };

  const resetFields = () => {
    setFormData(initialState);
  };

  const fileUpload = async (file, endpoint) => {
    const fileData = new FormData();
    fileData.append("img", file);

    try {
      const data = await fetch(endpoint, {
        method: "POST",
        body: fileData,
      });
      const response = await data.json();
      return response;
    } catch (error) {
      toast.error("File upload error occured");
    }
  };

  const checkStausCode = (code) => {
    switch (code) {
      case 201:
        toast.success(
          "Utente registrato. Redirect alla pagina di login in corso..."
        );
        break;
      case 400:
        toast.error("Problemi nella validazione dell'utente");
        break;
      case 409:
        toast.error("Utente già esistente");
        break;
      case 500:
        toast.error("Problemi interni del server");
        break;
      default:
        toast.error("errore sconosciuto");
    }
  };

  const goToHome = () => {
    setTimeout(() => {
      navigate("/", { replace: true });
    }, 3000);
  };

  return (
    <>
      <h1 className="text-center mt-3">Form di registrazione</h1>
      <div>
        <Toaster position="top-center" reverseOrder={false} />
      </div>
      {isLoading && (
        <RingLoader size={100} color="#36d7b7" className="m-auto" />
      )}
      <div className="w-50 m-auto my-5">
        <Form
          className="border p-5"
          encType="multipart/form-data"
          onSubmit={handleSubmit}
        >
          <Form.Group className="mb-3" controlId="formBasicFirstName">
            <Form.Label>Nome*</Form.Label>
            <Form.Control
              name="firstName"
              type="text"
              placeholder="Enter firstname"
              className="w-50"
              value={formData.firstName}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicLastName">
            <Form.Label>Cognome*</Form.Label>
            <Form.Control
              name="lastName"
              type="text"
              placeholder="Enter lastname"
              className="w-50"
              value={formData.lastName}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email*</Form.Label>
            <Form.Control
              name="email"
              type="email"
              placeholder="Enter email"
              className="w-50"
              value={formData.email}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicDate">
            <Form.Label>Data di nascita*</Form.Label>
            <Form.Control
              name="birthDate"
              type="date"
              placeholder="Enter birth date"
              className="w-50"
              value={formData.birthDate}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicAvatar">
            <Form.Label>Seleziona immagine</Form.Label>
            <Form.Control
              name="avatar"
              type="file"
              className="w-50"
              onChange={onChangeHandleFile}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password*</Form.Label>
            <Form.Control
              name="password"
              type="password"
              placeholder="Password"
              className="w-50"
              value={formData.password}
              onChange={handleChange}
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="me-3">
            Submit
          </Button>
          <Link to={"/"}>
            <Button variant="primary">Cancel</Button>
          </Link>
        </Form>
        <Footer />
      </div>
    </>
  );
};

export default Registration;
