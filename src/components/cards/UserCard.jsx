import "./UserCard.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function UserCard({
   username,
   role,
   isDeleted,
   photoURL,
   isConfirmed,
   handleClick,
   activeTrigger,
   searchTerm,
}) {
   const [isActive, setIsActive] = useState(false);
   const navigate = useNavigate();

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
               style={{ border: isActive && "solid black" }}
               onDoubleClick={() => navigate(`/userProfile/${username}`, { replace: true })}
            >
               <div
                  className="banner"
                  style={{
                     backgroundColor: isDeleted
                        ? "rgba(255,0,0,0.781)"
                        : !isConfirmed
                        ? "rgba(255, 255, 0, 0.789)"
                        : "rgba(0, 60, 255, 0.7)",
                  }}
               >
                  {role === "developer" ? (
                     <h3>Developer</h3>
                  ) : role === "scrumMaster" ? (
                     <h3>Scrum Master</h3>
                  ) : (
                     <h3>Product Owner</h3>
                  )}
               </div>

               <div
                  className={`content  ${
                     isDeleted ? "isDeleted-class" : isConfirmed ? "isConfirmed-class" : "isNotConfirmed-class"
                  }`}
                  id="usercard-content"
               >
                  <img id="userPhoto" src={photoURL} alt="userPhoto" />
                  <div className="user-role">{username}</div>
               </div>
            </li>
         )}
      </>
   );
}
