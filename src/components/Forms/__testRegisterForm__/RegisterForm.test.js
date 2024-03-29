import React from "react";
import { render, fireEvent } from "@testing-library/react";
import RegisterForm from "../RegisterForm";
import { registerUser } from "../../../utilities/services.js";
import * as encryptation from "../../../utilities/encryptation.js";

jest.mock("../../../utilities/services.js");
jest.mock("react-router-dom", () => ({
   ...jest.requireActual("react-router-dom"),
   useNavigate: () => jest.fn(),
}));

describe("RegisterForm", () => {
   it("submits the form with the entered values", () => {
      const { getByLabelText, getByText } = render(<RegisterForm type="productOwnerRegister" />);

      fireEvent.change(getByLabelText("Username"), { target: { value: "testuser" } });
      fireEvent.change(getByLabelText("Password"), { target: { value: "testpass" } });
      fireEvent.change(getByLabelText("Repeat Password"), { target: { value: "testpass" } });
      fireEvent.change(getByLabelText("Phone"), { target: { value: "911222333" } });
      fireEvent.change(getByLabelText("Email"), { target: { value: "test@gmail.com" } });
      fireEvent.change(getByLabelText("First Name"), { target: { value: "Test" } });
      fireEvent.change(getByLabelText("Last Name"), { target: { value: "User" } });
      fireEvent.change(getByLabelText("Photography"), {
         target: {
            value: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/1280px-Image_created_with_a_mobile_phone.png",
         },
      });

      registerUser.mockResolvedValueOnce({ ok: true });

      fireEvent.click(getByText("Registration"));

      expect(registerUser).toHaveBeenCalledWith({
         firstName: "Test",
         lastName: "User",
         password: encryptation.encryptPassword("testpass"),
         phoneNumber: "911222333",
         photoURL:
            "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/1280px-Image_created_with_a_mobile_phone.png",
         email: "test@gmail.com",
         username: "testuser",
         role: "developer",
      });
   });
});
