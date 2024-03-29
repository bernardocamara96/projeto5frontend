import "./UserCard.css";
import { useState, useEffect } from "react";

export default function UserCard({ username, role, isDeleted, photoURL, handleClick, activeTrigger, searchTerm }) {
   const [isActive, setIsActive] = useState(false);

   // Function to handle the click on the user card, it will fetch the user data and set the user active so the black border appears
   function handleClickDiv() {
      handleClick(username);
      setTimeout(() => {
         setIsActive(true);
      }, 0.1);
   }

   // Function to set the user as non active, so the black border disappears
   useEffect(
      (event) => {
         setIsActive(false);
      },
      [activeTrigger]
   );

   // Function to determine if the user should be visible or not, when searching by username
   const determineUserVisibility = (searchTerm) => {
      if (searchTerm === "") return true;
      const lowerCaseTitle = username.toLowerCase();

      return lowerCaseTitle.includes(searchTerm) ? true : false;
   };

   const [userVisibility, setUserVisibility] = useState(() => determineUserVisibility(searchTerm));

   //   // Update user visibility whenever searchTerm changes
   useEffect(() => {
      setUserVisibility(determineUserVisibility(searchTerm));
   }, [searchTerm]);
   return (
      <>
         {userVisibility && (
            <li
               className="user-item"
               onClick={handleClickDiv}
               style={{ border: isActive ? "solid black" : "solid transparent" }}
            >
               <div className="banner" style={{ backgroundColor: isDeleted ? "red" : "rgb(0, 60, 255)" }}>
                  <h3>{username}</h3>
               </div>
               <div className="content" id="usercard-content">
                  <img id="userPhoto" src={photoURL} alt="userPhoto" />
                  <div className="user-role">
                     {role === "developer" ? "Developer" : role === "scrumMaster" ? "Scrum Master" : "Product Owner"}
                  </div>
               </div>
            </li>
         )}
      </>
   );
}
