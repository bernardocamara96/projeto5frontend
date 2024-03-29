export default function ModalContent({
   categories,
   taskTitle,
   taskDescription,
   taskPriority,
   taskStartDate,
   taskEndDate,
   category_type,
   username_author,
   setTaskTitle,
   setTaskDescription,
   setTaskPriority,
   setTaskStartDate,
   setTaskEndDate,
   setCategory_type,
   inputDisabled,
   modalType,
}) {
   return (
      <>
         {modalType === "create" ? null : (
            <div className="row-author">
               <label className="input-label" id="label-author" htmlFor="author">
                  Author
               </label>
               <input
                  type="text"
                  name="author"
                  id="author_modal"
                  value={username_author === "deletedTasks" ? "Deleted user" : username_author}
                  disabled
                  style={{ color: username_author === "deletedTasks" && "rgb(210, 0, 0)" }}
               />
            </div>
         )}

         <div className="row-title">
            <label className="input-label" id="label-title" htmlFor="title">
               Title
            </label>
            <input
               type="text"
               name="title"
               id="title"
               placeholder="Insert Title"
               minLength="3"
               maxLength="20"
               value={taskTitle}
               onChange={(e) => setTaskTitle(e.target.value)}
               disabled={inputDisabled}
            />

            <label className="input-label" id="label-category" htmlFor="category-type">
               Category
            </label>
            <select
               name="category-type"
               id="category-type"
               value={category_type}
               onChange={(e) => setCategory_type(e.target.value)}
               disabled={inputDisabled}
            >
               {categories.map((category) => (
                  <option key={category.id} value={category.type}>
                     {category.type}
                  </option>
               ))}
            </select>
         </div>
         <div className="row-description">
            <label className="input-label" id="label-description" htmlFor="description">
               Description
            </label>
            <textarea
               name="description"
               id="description"
               placeholder="Insert Task Description"
               maxLength="400"
               value={taskDescription}
               onChange={(e) => setTaskDescription(e.target.value)}
               disabled={inputDisabled}
            ></textarea>
         </div>

         <div id="dates">
            <div className="row-date-start">
               <label className="input-label" id="label-date-start" htmlFor="date-start">
                  Start Date
               </label>
               <input
                  type="date"
                  name="date-start"
                  id="date-start"
                  value={taskStartDate === null ? "" : taskStartDate}
                  onChange={(e) => setTaskStartDate(e.target.value)}
                  disabled={inputDisabled}
               />
            </div>
            <div className="row-date-end">
               <label className="input-label" id="label-date-end" htmlFor="date-end">
                  End Date
               </label>
               <input
                  type="date"
                  name="date-end"
                  id="date-end"
                  value={taskEndDate === null ? "" : taskEndDate}
                  onChange={(e) => setTaskEndDate(e.target.value)}
                  disabled={inputDisabled}
               />
            </div>
         </div>
         <div className="row-priority">
            <label className="input-label" htmlFor="priority">
               Priority
            </label>
            <select
               name="priority"
               id="priority"
               value={taskPriority}
               onChange={(e) => setTaskPriority(e.target.value)}
               disabled={inputDisabled}
            >
               <option value="1">Low</option>
               <option value="2">Medium</option>
               <option value="3">High</option>
            </select>
         </div>
      </>
   );
}
