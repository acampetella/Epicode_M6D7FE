import { React } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import App from "./App";
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import blogSearchReducer from "./reducers/blogSearchReducer";
import blogListReducer from "./reducers/blogListReducer";
import postsForPageReducer from "./reducers/postsForPageReducer";
import authorsListReducer from "./reducers/authorsListReducer";

const reducer = combineReducers({
    blogSearchState: blogSearchReducer,
    blogListState: blogListReducer,
    postsForPageState: postsForPageReducer,
    authorsListState: authorsListReducer
});

const store = configureStore({
    reducer
  });
  
const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <Provider store={store}>
      <App />
    </Provider>
    
  );
