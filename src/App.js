import "./App.css"
import React from "react";
import Home from "./views/home/Home";
import Blog from "./views/blog/Blog";
import NewBlogPost from "./views/new/New";
import Login from "./views/login/Login";
import Success from "./views/success/Success";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Registration from "./views/registration/Registration";
import Users from "./views/users/Users";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" exact element={<Login />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/home" element={<Home />} />
        <Route path="/blog/:id" element={<Blog />} />
        <Route path="/new" element={<NewBlogPost />} />
        <Route path="/success" element={<Success />} />
        <Route path="/users" element={<Users />} />
      </Routes>
    </Router>
  );
}

export default App;
