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
import UserProfile from "./pages/UserProfile.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import AccountConfirmation from "./pages/AccountConfirmation.jsx";
import ResetPass from "./pages/ResetPass.jsx";
import ResetPassAfter from "./pages/ResetPassAfter.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
   <Router>
      <Routes>
         <Route index element={<App />} />
         <Route path="/register" element={<Register />} />
         <Route path="/resetPass/" element={<ResetPass />} />
         <Route path="/resetPassAfter/:token" element={<ResetPassAfter />} />
         <Route path="/scrum" element={<Scrum />} />
         <Route path="/confirmEmail/:token" element={<AccountConfirmation />} />
         <Route path="/users" element={<UsersList />} />
         <Route path="/userProfile/:username" element={<UserProfile />} />
         <Route path="/tasks" element={<TaskList />} />
         <Route path="/categories" element={<CategoriesList />} />
         <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
   </Router>
);
