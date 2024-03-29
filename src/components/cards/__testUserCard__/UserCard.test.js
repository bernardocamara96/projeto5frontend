import { render, screen } from "@testing-library/react";
import UserCard from "../UserCard";

describe("UserCard", () => {
   test("displays the correct username", () => {
      render(
         <UserCard
            username="Test User"
            role="developer"
            isDeleted={false}
            photoURL="test.jpg"
            handleClick={() => {}}
            activeTrigger={false}
            searchTerm=""
         />
      );
      expect(screen.getByText("Test User")).toBeInTheDocument();
   });

   test("displays the correct role", () => {
      render(
         <UserCard
            username="Test User"
            role="developer"
            isDeleted={false}
            photoURL="test.jpg"
            handleClick={() => {}}
            activeTrigger={false}
            searchTerm=""
         />
      );
      expect(screen.getByText("Developer")).toBeInTheDocument();
   });

   test("displays the correct photo", () => {
      render(
         <UserCard
            username="Test User"
            role="developer"
            isDeleted={false}
            photoURL="test.jpg"
            handleClick={() => {}}
            activeTrigger={false}
            searchTerm=""
         />
      );
      expect(screen.getByAltText("userPhoto")).toHaveAttribute("src", "test.jpg");
   });
});
