
import React from "react";
import { Button, Container, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { blogListSetCurrentPage } from "../../reducers/blogListReducer";
import { postsForPage, postsForPageSetValue } from "../../reducers/postsForPageReducer";
import { useNavigate } from "react-router-dom";
import session from "../../utilities/decodeSession";
import "./styles.css";
const NavBar = (props) => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const postsNumForPage = useSelector(postsForPage);
  const user = session();

  const onClickFunction = () => {
    dispatch(blogListSetCurrentPage(1));
    dispatch(postsForPageSetValue(postsNumForPage));
  };

  const onClickUsersList = () => {
    dispatch(blogListSetCurrentPage(1));
    dispatch(postsForPageSetValue(postsNumForPage));
    navigate("/users", {replace:true});
  };

  const logout = () => {
    localStorage.clear();
    navigate("/", {replace:true});
  }

  return (
    <Navbar expand="lg" className="blog-navbar" fixed="top">
      <Container className="justify-content-between">
        <div>
          <Navbar.Brand as={Link} to="/home">
            <img className="blog-navbar-brand" alt="logo" src="logo.svg" />
          </Navbar.Brand>
          <Button className="text-black" variant="link" onClick={logout}>Logout</Button>
          { user.role==='admin' && <Button 
            className="text-black" 
            variant="link" 
            onClick={onClickUsersList}
          >
            Lista utenti
          </Button>}
        </div>
        <Button
          as={Link}
          to="/new"
          className="blog-navbar-add-button bg-dark"
          size="lg"
          onClick={onClickFunction}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-plus-lg"
            viewBox="0 0 16 16"
          >
            <path d="M8 0a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2H9v6a1 1 0 1 1-2 0V9H1a1 1 0 0 1 0-2h6V1a1 1 0 0 1 1-1z" />
          </svg>
          Post Article
        </Button>
      </Container>
    </Navbar>
  );
};

export default NavBar;
