import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";

const Success = () => {

    const navigate = useNavigate();

    const getConnectedUser = async () => {
        const data = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/github/connectedUser`, {
            credentials: "include",
        });
        const response = await data.json();
        if (response.statusCode === 200) {
            localStorage.setItem("session", response.token);
            setTimeout(() => {
                navigate("../home", { replace: true });
            }, 3000);
        } else {
            navigate("../login", { replace: true });
        }
    };

    useEffect(() => {
        getConnectedUser();
    }, []);

  return (
    <div className="success_container">
      <h1 className="text">Login avvenuta con successo</h1>
        <img
            src="https://www.shutterstock.com/image-vector/task-completed-login-successful-registration-260nw-2156580009.jpg"
            alt="Success Page"
            className="image"
        />
        <h2 className="text">Redirect alla Home page in corso...</h2>
    </div>
  );
};

export default Success;
