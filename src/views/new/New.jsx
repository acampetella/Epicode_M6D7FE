import { convertToHTML } from "draft-convert";
import { EditorState } from "draft-js";
import React, { useEffect, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./styles.css";
import toast, { Toaster } from "react-hot-toast";
import { RingLoader } from "react-spinners";
import NavBar from "../../components/navbar/BlogNavbar";
import Footer from "../../components/footer/Footer";
import accessKey from "../../utilities/accessKey.js";
import decodeSession from "../../utilities/decodeSession.js";

const NewBlogPost = (props) => {

  const user = decodeSession();
  const authType = user.authType;
  const token = accessKey();

  const getAuthorName = () => {
    if (authType === 'internal') {
      return `${user.firstName} ${user.lastName}`;
    }
    return user.username;
  };

  const authorName = getAuthorName();
  const formDataInitialState = {
    title: "",
    category: "Category1",
    author: {
      name: authorName,
    },
    content: "",
    cover: "",
  };
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [formData, setFormData] = useState(formDataInitialState);
  const [html, setHTML] = useState(null);
  const [file, setFile] = useState(null);
  const [uploadLocation, setUploadLocation] = useState("internal");
  const [sendEmail, setSendEmail] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const sendEmailToggle = () => {
    setSendEmail(!sendEmail);
  };

  const onChangeHandleFile = (event) => {
    setFile(event.target.files[0]);
  };

  const checkPostTitle = async (title) => {
    try {
      const data = await fetch(
        `${process.env.REACT_APP_SERVER_BASE_URL}/blogPosts/byTitle/${title}`, {
          headers: {
            "Auth": token
          }
        });
      const response = await data.json();
      if (response.statusCode === 404) {
        return true;
      }
      return false;
    } catch (error) {
      toast.error("error");
    }
  };

  const fileUpload = async (file, endpoint) => {
    const fileData = new FormData();
    fileData.append("img", file);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: fileData,
        headers: {
          "Auth": token
        }
      });
      return await response.json();
    } catch (error) {
      toast.error("File upload error occured");
    }
  };

  const checkFields = () => {
    if (
      formData.title !== "" &&
      formData.content !== "" &&
      formData.content !== null
    ) {
      return true;
    }
    return false;
  };

  const sendPost = async (event) => {
    event.preventDefault();
    if (checkFields() && file) {
      setIsLoading(true);
      try {
        const titleIsValid = await checkPostTitle(formData.title);
        if (titleIsValid) {
          const uploadedFile = await fileUpload(
            file,
            `${process.env.REACT_APP_SERVER_BASE_URL}/blogPosts/${uploadLocation}/coverUpload`
          );
          const postFormData = {
            ...formData,
            cover: uploadedFile.img,
          };
          const data = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/blogPosts`, {
            method: "POST",
            body: JSON.stringify(postFormData),
            headers: {
              "Content-Type": "application/json",
              "Auth": token
            }
          });
          const response = await data.json();
          if (sendEmail) {
            await sendEmailFunction();
          }
          setIsLoading(false);
          checkStausCode(response.statusCode);
          resetFields();
        } else {
          toast.error("Post duplicato");
        }
      } catch (error) {
        toast.error("Errore nell'invio del post");
      }
      setIsLoading(false);
    } else {
      toast.error(
        "I campi del post devono essere tutti valorizzati. Inoltre è necessario selezionare una cover"
      );
    }
  };

  const resetFields = () => {
    setFormData(formDataInitialState);
    setEditorState(EditorState.createEmpty());
    setHTML(convertToHTML(editorState.getCurrentContent()));
  };

  const checkStausCode = (code) => {
    switch (code) {
      case 201:
        toast.success("Post inviato correttamente");
        break;
      case 400:
        toast.error("Problemi nella validazione del post");
        break;
      case 409:
        toast.error("Post duplicato");
        break;
      case 500:
        toast.error("Problemi interni del server");
        break;
      default:
        toast.error("errore sconosciuto");
    }
  };

  const sendEmailFunction = async () => {
    const emailText = `L'autore ${formData.author.name} ha scritto un nuovo post:
    titolo: ${formData.title}
    categoria: ${formData.category}
    contenuto: ${formData.content}`;

    const content = {
      destination: user.email,
      subject: "Nuovo post",
      message: emailText,
    };

    try {
      const data = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/sendMail`, {
        method: "POST",
        body: JSON.stringify(content),
        headers: {
          "Content-Type": "application/json",
          "Auth": token
        }
      });
      const response = await data.json();
      if (response.statusCode !== 200) {
        throw new Error(response.message);
      }
    } catch (error) {
      toast.error(`Si è verificato il seguente errore: ${error}`);
    }
  };

  useEffect(() => {
    let html = convertToHTML(editorState.getCurrentContent());
    setHTML(html);
  }, [editorState]);

  return (
    <>
      <NavBar />
      <div>
        <Toaster position="top-center" reverseOrder={false} />
      </div>
      {isLoading && <RingLoader color="#36d7b7" size={100} />}
      {!isLoading && (
        <Container className="new-blog-container">
          <Form className="mt-5" encType="multipart/form-data">
            <Form.Group controlId="blog-form" className="mt-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                size="lg"
                placeholder="Title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    title: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="blog-category" className="mt-3">
              <Form.Label>Category</Form.Label>
              <Form.Control
                size="lg"
                as="select"
                value={formData.category}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category: e.target.value,
                  })
                }
              >
                <option>Category1</option>
                <option>Category2</option>
                <option>Category3</option>
                <option>Category4</option>
                <option>Category5</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="blog-content" className="mt-3">
              <Form.Label>Blog Content</Form.Label>
              <Editor
                editorState={editorState}
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                onEditorStateChange={setEditorState}
                value={html}
                onChange={() =>
                  setFormData({
                    ...formData,
                    content: html,
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="upload-file" className="mt-3">
              <Form.Label>Upload cover</Form.Label>
              <Form.Control
                type="file"
                onChange={onChangeHandleFile}
                size="lg"
              />
            </Form.Group>
            <Form.Group controlId="upload-location" className="mt-3">
              <Form.Label>Upload location</Form.Label>
              <Form.Check
                type="radio"
                id="server"
                label="server"
                name="location"
                defaultChecked
                onChange={() => setUploadLocation("internal")}
              />
              <Form.Check
                type="radio"
                id="cloud"
                label="cloud"
                name="location"
                onChange={() => setUploadLocation("cloud")}
              />
            </Form.Group>
            {user.email && <Form.Group controlId="send-email" className="mt-3">
              <Form.Check
                type="checkbox"
                label="send email"
                onChange={sendEmailToggle}
              />
            </Form.Group>}
            <Form.Group className="d-flex mt-3 justify-content-end">
              <Button type="reset" size="lg" variant="outline-dark">
                Reset
              </Button>
              <Button
                type="submit"
                size="lg"
                variant="dark"
                style={{
                  marginLeft: "1em",
                }}
                onClick={sendPost}
              >
                Submit
              </Button>
            </Form.Group>
          </Form>
        </Container>
      )}
    <Footer/>
    </>
  );
};

export default NewBlogPost;
