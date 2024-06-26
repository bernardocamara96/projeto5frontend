import "./Column.css";
import ModalTasks from "../somemodals/ModalTasks.jsx";
import { useState } from "react";
import Task from "../cards/task.jsx";
import ModalEditTask from "../somemodals/ModalEditTask.jsx";
import { Droppable } from "react-beautiful-dnd";
import DraggableTask from "../cards/DraggableTask";
import Button from "react-bootstrap/Button";
import translationStore from "../../stores/translationStore";
import languages from "../../translations";
import { IntlProvider, FormattedMessage } from "react-intl";

export default function Column({ title, token, tasks, setFetchTrigger, tasksNumber, searchTerm, id }) {
   const [modalVisibility, setModalVisibility] = useState(false);
   const [modalEditVisibility, setModalEditVisibility] = useState(false);
   const [taskData, setTaskData] = useState({});
   const { locale } = translationStore();

   //function to handle the double click on a task, it will create the modal to edit the task
   const handleTaskDoubleClick = (taskData) => {
      setModalEditVisibility(true);
      setTaskData(taskData);
   };

   const handleTaskClick = (taskData) => {
      setModalEditVisibility(true);
      setTaskData(taskData);
   };

   return (
      <>
         <IntlProvider locale={locale} messages={languages[locale]}>
            <div className="col-todo">
               <div className="header-list">
                  <div className="invisible-counter"></div>
                  <h4 id="col-todo-text">{title}</h4>
                  <div className="count-div-circle">
                     <h3 id="todo-count">{tasksNumber}</h3>
                  </div>
               </div>
               <div className="scrolable-ul-col">
                  <Droppable droppableId={id} key={id} type="COLUMN">
                     {(provided) => (
                        <ul className="ul-tasks" id={title} ref={provided.innerRef} {...provided.droppableProps}>
                           {tasks.map((component, index) => (
                              <DraggableTask
                                 key={component.id}
                                 index={index}
                                 onClick={handleTaskClick}
                                 onDoubleClick={handleTaskDoubleClick}
                                 {...component}
                                 setFetchTrigger={setFetchTrigger}
                                 status={id}
                                 searchTerm={searchTerm}
                              />
                           ))}
                           {provided.placeholder}
                        </ul>
                     )}
                  </Droppable>
               </div>

               {id === "TO DO" && (
                  <>
                     <Button
                        id="add-task-btn"
                        className="btn-add btn-secondary"
                        onClick={() => setModalVisibility(true)}
                     >
                        <i class="fas fa-plus"></i>&nbsp; <FormattedMessage id="add-task" />
                     </Button>
                     {modalVisibility && (
                        <ModalTasks
                           token={token}
                           setModalVisibility={setModalVisibility}
                           setFetchTrigger={setFetchTrigger}
                        />
                     )}
                  </>
               )}
               {modalEditVisibility && (
                  <ModalEditTask
                     setModalVisibility={setModalEditVisibility}
                     token={token}
                     data={taskData}
                     setFetchTrigger={setFetchTrigger}
                  />
               )}
            </div>
         </IntlProvider>
      </>
   );
}
