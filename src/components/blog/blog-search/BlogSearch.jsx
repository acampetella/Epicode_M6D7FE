import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { blogSearchTerm, blogSearchSetTerm } from "../../../reducers/blogSearchReducer";
import { getPostsList } from "../../../reducers/blogListReducer";
import { postsForPage } from "../../../reducers/postsForPageReducer";
import { useDispatch, useSelector } from "react-redux";

const BlogSearch = () => {
    const dispatch = useDispatch();
    const postsNumForPage = useSelector(postsForPage);
    const term = useSelector(blogSearchTerm);
    const [change, setChange] = useState(false);

    const search = (event) => {
      event.preventDefault();
      if (term !== '') {
        dispatch(getPostsList([1, postsNumForPage, term]));
      }
    };

    useEffect(() => {
      if (term === '' && change) {
        dispatch(getPostsList([1, postsNumForPage, term]));
      }
    }, [dispatch, term]);

  return (
    <Form className="d-flex mb-3">
      <Form.Group className="mb-3 me-2 w-25" controlId="formBasicText">
        <Form.Control 
            type="text" 
            placeholder="Enter search key"
            onChange={(event) => {
              dispatch(blogSearchSetTerm(event.target.value));
              setChange(true);
            }}
            value={term}
            className="fs-4"
        />
      </Form.Group>
      <Button 
        variant="primary" 
        type="submit" 
        className="mb-3"
        onClick={search}
      >
        Search
      </Button>
    </Form>
  );
};

export default BlogSearch;
