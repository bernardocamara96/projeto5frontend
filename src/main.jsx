import React from "react";
import ReactDOM from "react-dom/client";
import App from "./pages/App.jsx";
import "./main.css";
import { BrowserRouter as Router } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import Register from "./pages/Register.jsx";
import Scrum from "./pages/Scrum.jsx";
import UsersList from "./pages/UsersList.jsx";
import TaskList from "./pages/TaskList.jsx";
import CategoriesList from "./pages/CategoriesList.jsx";
import OwnUserEdit from "./pages/OwnUserEdit.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
   <Router>
      <Routes>
         <Route index element={<App />} />
         <Route path="/register" element={<Register />} />
         <Route path="/scrum" element={<Scrum />} />
         <Route path="/users" element={<UsersList />} />
         <Route path="/tasks" element={<TaskList />} />
         <Route path="/categories" element={<CategoriesList />} />
         <Route path="/editProfile" element={<OwnUserEdit />} />
      </Routes>
   </Router>
);
