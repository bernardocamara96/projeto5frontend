import { Draggable } from "react-beautiful-dnd";
import Task from "./task";
import "./task";
import { useState, useEffect } from "react";

export default function DraggableTask({
   id,
   title,
   username_author,
   category_type,
   description,
   priority,
   startDate,
   endDate,
   onDoubleClick,
   setFetchTrigger,
   status,
   index,
   searchTerm,
}) {
   const [buttonVisibility, setButtonVisibility] = useState("hidden");

   // Function to handle the double click on a task, it will pass the task data to the parent component
   const handleDoubleClick = () => {
      onDoubleClick({ id, title, description, username_author, category_type, priority, startDate, endDate });
   };

   // Function to determine task visibility based on the search term
   const determineTaskVisibility = (searchTerm) => {
      if (searchTerm === "") return true;
      const lowerCaseTitle = title.toLowerCase();
      const lowerCaseDescription = description.toLowerCase();

      return lowerCaseTitle.includes(searchTerm) || lowerCaseDescription.includes(searchTerm) ? true : false;
   };

   const [taskVisibility, setTaskVisibility] = useState(() => determineTaskVisibility(searchTerm));

   // Update task visibility whenever searchTerm changes
   useEffect(() => {
      setTaskVisibility(determineTaskVisibility(searchTerm));
   }, [searchTerm]);
   return (
      <>
         {taskVisibility && (
            <Draggable draggableId={id.toString()} index={index}>
               {(provided) => (
                  <li
                     className="task-item"
                     onDoubleClick={handleDoubleClick}
                     onMouseEnter={() => setButtonVisibility("visible")}
                     onMouseLeave={() => setButtonVisibility("hidden")}
                     ref={provided.innerRef}
                     {...provided.draggableProps}
                     {...provided.dragHandleProps}
                  >
                     <Task
                        id={id}
                        title={title}
                        username_author={username_author}
                        category_type={category_type}
                        description={description}
                        priority={priority}
                        startDate={startDate}
                        endDate={endDate}
                        onDoubleClick={handleDoubleClick}
                        setFetchTrigger={setFetchTrigger}
                        status={status}
                        buttonVisibility={buttonVisibility}
                     />
                  </li>
               )}
            </Draggable>
         )}
      </>
   );
}
