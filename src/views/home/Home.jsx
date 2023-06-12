import React from "react";
import { Container } from "react-bootstrap";
import BlogList from "../../components/blog/blog-list/BlogList";
import "./styles.css";
import BlogSearch from "../../components/blog/blog-search/BlogSearch";
import NavBar from "../../components/navbar/BlogNavbar";
import Footer from "../../components/footer/Footer";
import SelectPostForPage from "../../components/blog/blog-pagination/SelectPostForPage";

const Home = (props) => {
  return (
    <>
      <NavBar />
      <Container fluid="sm">
        <h1 className="blog-main-title">Welcome to the Epicode Blog!</h1>
        <BlogSearch />
        <SelectPostForPage/>
        <BlogList />
        <Footer/>
      </Container>
    </>
  );
};

export default Home;
