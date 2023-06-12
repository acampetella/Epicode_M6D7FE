import React, { useEffect, useState } from "react";
import { Container, Image, Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { Link, useNavigate, useParams } from "react-router-dom";
import BlogAuthor from "../../components/blog/blog-author/BlogAuthor";
import BlogLike from "../../components/likes/BlogLike";
import { useDispatch } from "react-redux";
import { blogListSetCurrentPage } from "../../reducers/blogListReducer";
import "./styles.css";
import toast, { Toaster } from "react-hot-toast";
import { nanoid } from "nanoid";
import { RingLoader } from "react-spinners";
import Footer from "../../components/footer/Footer";
import accessKey from "../../utilities/accessKey.js";
import decodeSession from "../../utilities/decodeSession";

const Blog = (props) => {

  const token = accessKey();
  const user = decodeSession();
  const authType = user.authType;

  const getAuthorName = () => {
    if (authType === 'internal') {
      return `${user.firstName} ${user.lastName}`;
    }
    return user.username;
  };

  const commentName = getAuthorName();
  const commentInitialState = {
    name: commentName,
    commentText: "",
  };
  const [blog, setBlog] = useState({});
  const [comments, setComments] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showNewCommentButton, setShowNewCommentButton] = useState(true);
  const [cancel, setCancel] = useState(false);
  const [newComment, setNewComment] = useState(commentInitialState);
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const setCurrentPage = () => {
    dispatch(blogListSetCurrentPage(1));
  };

  const newCommentButtonToggle = () => {
    setShowNewCommentButton(!showNewCommentButton);
  };

  const saveNewComment = async () => {
    if (checkNewCommentFields()) {
      try {
        const { id } = params;
        const data = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/blogPosts/${id}`, {
          method: "POST",
          body: JSON.stringify(newComment),
          headers: {
            "Content-Type": "application/json",
            "Auth": token
          },
        });
        const response = await data.json();
        if (response.statusCode !== 201) {
          toast.error(
            `Si è verificato il seguente errore: ${response.message}`
          );
        } else {
          toast.success("Salvato nuovo commento");
        }
        setNewComment(commentInitialState);
        newCommentButtonToggle();
      } catch (error) {
        toast.error(`Si è verificato il seguente errore: ${error}`);
      }
    } else {
      toast.error("Devi inserire il testo del commento");
    }
  };

  const checkNewCommentFields = () => {
    if (newComment.name !== "" && newComment.commentText !== "") {
      return true;
    }
    return false;
  };

  const cancelFunction = () => {
    setCancel(true);
    newCommentButtonToggle();
  };

  const getBlog = async () => {
    const { id } = params;
    try {
      const data = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/blogPosts/${id}`, {
        headers: {
          "Auth": token
        }
      });
      const response = await data.json();
      setLoading(false);
      if (response.statusCode === 200) {
        setBlog(response.post);
        if (response.post.comments.length > 0) {
          setComments(response.post.comments);
        }
      } else {
        toast.error(`Si è verificato il seguente errore: ${response.message}`);
        navigate("/404");
      }
    } catch (error) {
      toast.error(`Si è verificato il seguente error: ${error}`);
      navigate("/404");
    }
  };

  useEffect(() => {
    if (showNewCommentButton && !cancel) {
      getBlog();
    }
    setCancel(false);
    setCurrentPage();
  }, [showNewCommentButton]);

  return (
    <>
      {loading && <RingLoader color="#36d7b7" size={100}/>}
      {!loading && blog &&
      <div className="blog-details-root">
        <div>
          <Toaster position="top-center" reverseOrder={false} />
        </div>
        <Container>
          <Image className="blog-details-cover" src={blog.cover} fluid />
          <Link to={'/home'}>
            <Button variant="link" className="fs-4">Back to Home</Button>
          </Link>
          <h1 className="blog-details-title">{blog.title}</h1>
          <div className="blog-details-container">
            <div className="blog-details-author">
              <BlogAuthor {...blog.author} />
            </div>
            <div className="blog-details-info">
              <div>{blog.createdAt}</div>
              <div>{`${blog.readTime.value} ${blog.readTime.unit} read`}</div>
              <div
                style={{
                  marginTop: 20,
                }}
              >
                <BlogLike defaultLikes={[]} onChange={""} />
              </div>
            </div>
          </div>

          <div
            className="fs-3"
            dangerouslySetInnerHTML={{
              __html: blog.content,
            }}
          ></div>

          <div>
            <h3 className="fw-bold">Commenti</h3>
            {!comments && (
              <div className="fs-4">Al momento non ci sono recensioni</div>
            )}
            {comments &&
              comments.map((comment) => {
                return (
                  <div key={nanoid()}>
                    <div>Nome: {comment.name}</div>
                    <div className="fs-4">
                      <p>{comment.commentText}</p>
                    </div>
                  </div>
                );
              })}
          </div>

          {showNewCommentButton && (
            <div>
              <Button
                variant="primary"
                className="my-3"
                onClick={newCommentButtonToggle}
              >
                Nuovo commento
              </Button>
            </div>
          )}

          {!showNewCommentButton && (
            <Form className="my-3">
              <Form.Group className="mb-3" controlId="controlTextarea">
                <Form.Label>Testo della recensione</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  onChange={(event) => {
                    setNewComment({
                      ...newComment,
                      commentText: event.target.value,
                    });
                  }}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="controlButtons">
                <Button
                  variant="primary"
                  className="me-3"
                  onClick={saveNewComment}
                >
                  Salva
                </Button>
                <Button variant="primary" onClick={cancelFunction}>
                  Annulla
                </Button>
              </Form.Group>
            </Form>
          )}
        </Container>
      </div>}
      <Footer/>
    </>
  );
};

export default Blog;
