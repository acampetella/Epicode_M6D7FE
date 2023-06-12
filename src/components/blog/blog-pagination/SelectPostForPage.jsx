import React from "react";
import { postsForPageSetValue, postsForPage } from "../../../reducers/postsForPageReducer";
import { blogListSetCurrentPage } from "../../../reducers/blogListReducer";
import { useDispatch, useSelector } from "react-redux";

const SelectPostForPage = () => {

    const dispatch = useDispatch();
    const postsNumForPage = useSelector(postsForPage);

    const selectOnChange = (event) => {
        dispatch(postsForPageSetValue(event.target.value));
        dispatch(blogListSetCurrentPage(1));
    }

  return (
    <>
      <label className="fs-4 me-2 mb-3">Numero di post per pagina:</label>
      <select value={postsNumForPage} onChange={selectOnChange} className="fs-4 mb-3">
        <option value="3">3</option>
        <option value="6">6</option>
        <option value="9">9</option>
        <option value="12">12</option>
        <option value="15">15</option>
      </select>
    </>
  );
};

export default SelectPostForPage;
