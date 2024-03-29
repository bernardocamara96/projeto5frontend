import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Task from "../task";
import { updateTaskStatus } from "../../../utilities/services";

jest.mock("../../../utilities/services", () => ({
   updateTaskStatus: jest.fn(),
}));

describe("Task", () => {
   test("displays the correct title", () => {
      render(
         <Task
            id="1"
            title="Test Title"
            username_author="Test User"
            category_type="Test Category"
            description="Test Description"
            priority={1}
            buttonVisibility="visible"
            setFetchTrigger={() => {}}
            status="TO DO"
            type="draggable"
         />
      );
      expect(screen.getByText("Test Title")).toBeInTheDocument();
   });

   test("displays the correct username", () => {
      render(
         <Task
            id={10}
            title="Test Title"
            username_author="Test User"
            category_type="Test Category"
            description="Test Description"
            priority={1}
            buttonVisibility="visible"
            setFetchTrigger={() => {}}
            status="TO DO"
            type="draggable"
         />
      );
      expect(screen.getByText("Test User")).toBeInTheDocument();
   });
   test("handleNextButton changes task status", async () => {
      // Mock setFetchTrigger to update the tasks in the columns
      const setFetchTrigger = jest.fn();

      // Render the Task component
      const props = {
         id: 10,
         title: "Test Task",
         username_author: "Test User",
         category_type: "Test Category",
         description: "Test Description",
         priority: 1,
         buttonVisibility: "visible",
         setFetchTrigger,
         status: "TO DO",
         type: "draggable",
      };

      const { getByText } = render(<Task {...props} />);

      updateTaskStatus.mockReturnValue(Promise.resolve({ ok: true }));

      // Find the next button and click it
      const nextButton = getByText(">");
      fireEvent.click(nextButton);

      expect(updateTaskStatus).toHaveBeenCalledWith(expect.anything(), props.id, 200);
   });
});
