import React from "react";
import { Col, Row } from "react-bootstrap";
import BlogItem from "../blog-item/BlogItem";
import toast, { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import ReactPaginate from "react-paginate";
import './style.css';
import { useDispatch, useSelector } from "react-redux";
import { blogSearchTerm } from "../../../reducers/blogSearchReducer";
import { getPostsList, blogListLoading, blogListError } from "../../../reducers/blogListReducer";
import {postsList, blogListPagination, blogListSetCurrentPage } from "../../../reducers/blogListReducer";
import { postsForPage } from "../../../reducers/postsForPageReducer";
import {RingLoader} from 'react-spinners';

const BlogList = (props) => {

  const dispatch = useDispatch();
  const pagination = useSelector(blogListPagination);
  const postsNumForPage = useSelector(postsForPage);
  const searchKey = useSelector(blogSearchTerm);
  const myPosts = useSelector(postsList);
  const isLoading = useSelector(blogListLoading);
  const error = useSelector(blogListError);


  const onClickFn = (event) => {
    if (event.isNext) {
      nextPage();
    } else if (event.isPrevious) {
      previousPage();
    } else {
      if (event.nextSelectedPage === undefined) {
        dispatch(blogListSetCurrentPage(event.selected + 1));
      } else {
        dispatch(blogListSetCurrentPage(event.nextSelectedPage + 1));
      }
    }
  };

  const nextPage = () => {
    if (pagination.currentPage < pagination.totalPages) {
      dispatch(blogListSetCurrentPage(pagination.currentPage + 1))
    }
  };

  const previousPage = () => {
    if (pagination.currentPage > 1) {
      dispatch(blogListSetCurrentPage(pagination.currentPage - 1))
    }
  };

  useEffect(() => {
    dispatch(getPostsList([Number(pagination.currentPage), Number(postsNumForPage), searchKey]));
  }, [dispatch, pagination.currentPage, postsNumForPage]);

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Row>
        {isLoading && !error && <RingLoader color="#36d7b7" size={100}/>}
        {!isLoading && error && toast.error(`Si è verificato il seguente errore: ${error}`)}
        {!isLoading && !error && myPosts &&
          myPosts.map((post) => (
            <Col
            key={post._id}
              md={4}
              style={{
                marginBottom: 50,
              }}
            >
              <BlogItem {...post} />
            </Col>
          ))}
      </Row>
      <ReactPaginate
        breakLabel="..."
        nextLabel="next >"
        pageRangeDisplayed={20}
        pageCount={Number(pagination.totalPages)}
        previousLabel="< previous"
        renderOnZeroPageCount={null}
        onClick={onClickFn}
        activeClassName="activeClassName"
        forcePage={pagination.currentPage - 1}
      />
    </>
  );
};

export default BlogList;
