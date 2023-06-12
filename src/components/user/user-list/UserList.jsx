import React from "react";
import { Col, Row } from "react-bootstrap";
import toast, { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import ReactPaginate from "react-paginate";
import UserItem from "../user-item/UserItem";
import { useDispatch, useSelector } from "react-redux";
import { authorsListPagination, authorsList, authorsListError } from "../../../reducers/authorsListReducer";
import { getAuthorsList, authorsListLoading, authorsListSetCurrentPage } from "../../../reducers/authorsListReducer";
import {RingLoader} from 'react-spinners';

const UserList = (props) => {

  const dispatch = useDispatch();
  const pagination = useSelector(authorsListPagination);
  const authors = useSelector(authorsList);
  const isLoading = useSelector(authorsListLoading);
  const error = useSelector(authorsListError);


  const onClickFn = (event) => {
    if (event.isNext) {
      nextPage();
    } else if (event.isPrevious) {
      previousPage();
    } else {
      if (event.nextSelectedPage === undefined) {
        dispatch(authorsListSetCurrentPage(event.selected + 1));
      } else {
        dispatch(authorsListSetCurrentPage(event.nextSelectedPage + 1));
      }
    }
  };

  const nextPage = () => {
    if (pagination.currentPage < pagination.totalPages) {
      dispatch(authorsListSetCurrentPage(pagination.currentPage + 1))
    }
  };

  const previousPage = () => {
    if (pagination.currentPage > 1) {
      dispatch(authorsListSetCurrentPage(pagination.currentPage - 1))
    }
  };

  useEffect(() => {
    dispatch(getAuthorsList([Number(pagination.currentPage), 3]));
  }, [dispatch, pagination.currentPage]);

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Row>
        {isLoading && !error && <RingLoader color="#36d7b7" size={100}/>}
        {!isLoading && error && toast.error(`Si è verificato il seguente errore: ${error}`)}
        {!isLoading && !error && authors &&
          authors.map((author) => (
            <Col
            key={author._id}
              md={4}
              style={{
                marginBottom: 50,
              }}
            >
              <UserItem {...author} />
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

export default UserList;