import React, { useState } from "react";
import Alert from "./Alert";
import axios from "../axiosLib";

const SignUp = ({ setAuthType }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [alert, setAlert] = useState({
    showAlert: false,
    type: "",
    message: "",
  });
  const [buttonText, setButtonText] = useState("Submit");

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setButtonText("Loading...");

      const res = await axios.post("/users/signup", formData, {
        withCredentials: true,
      });
      await localStorage.setItem("user", JSON.stringify(res.data.data.user));
      setButtonText("Registered");
      setAlert({
        showAlert: true,
        type: "success",
        message: "Sign Up successful",
      });
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    } catch (err) {
      console.log(err);
      setButtonText("Submit");
      setAlert({
        showAlert: true,
        type: "error",
        message: err.response.data.message,
      });
      setTimeout(() => {
        setAlert({ showAlert: false, type: "", message: "" });
      }, 1500);
    }
  }
  return (
    <div>
      {alert.showAlert && <Alert type={alert.type} message={alert.message} />}

      <div className=" max-w-screen-lg flex flex-col bg-white p-10 rounded-lg w-screen">
        <form className="flex flex-col w-full mb-6" onSubmit={handleSubmit}>
          <label htmlFor="username">Username</label>
          <input
            className="px-4 py-2 border-slate-500 border-2 rounded-md mb-5"
            type="text"
            id="username"
            minLength={3}
            maxLength={12}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            required
          />

          <label htmlFor="email">Email</label>
          <input
            className="px-4 py-2 border-slate-500 border-2 rounded-md mb-5"
            type="email"
            id="email"
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />
          <label htmlFor="password">Password</label>
          <input
            className="px-4 py-2 border-slate-500 border-2 rounded-md mb-5"
            type="password"
            id="password"
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />
          <button
            className="transition ease-out duration-200 rounded-md bg-slate-600 text-white px-4 py-2 hover:bg-slate-700 hover:shadow-lg hover:cursor-pointer"
            type="submit"
          >
            {buttonText}
          </button>
        </form>
        <div className="flex space-x-2">
          <p>Already have an account?</p>
          <button className="text-blue-600 underline" onClick={setAuthType}>
            Log in
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
