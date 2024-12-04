import { useState } from "react";
import Form from "../components/Form";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const navigate = useNavigate();
  const [frag, setFrag] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const loginForm = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setErrorMessage("");
    const formData = new FormData(e.currentTarget);
    const res = await fetch(`http://localhost:3010/api/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        username: formData.get("username"),
        password: formData.get("password"),
      }),
    });
    console.log(formData.get("username"));
    const data = await res.json();
    if (res.ok) {
      navigate("/play");
    } else {
      setErrorMessage(data.message || "Failed to log in");
      console.error("Error:", data.message);
    }
  };

  const signUpForm = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setErrorMessage("");
    const formData = new FormData(e.currentTarget);

    const res = await fetch(`http://localhost:3010/api/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        username: formData.get("username"),
        password: formData.get("password"),
      }),
    });
    const data = await res.json();
    console.log(data);
  };

  const fragHandle = () => {
    setFrag((prev) => !prev);
    setErrorMessage("");
  };

  return (
    <div>
      <div className=" min-[500px]:mt-16 min-[500px]:w-[400px] w-[90%] bg-gray-200 mx-auto rounded-md mt-2">
        <Form
          onSubmit={frag ? signUpForm : loginForm}
          frag={frag}
          errorMessage={errorMessage}
        />
        {errorMessage && (
          <div className="flex items-center mx-auto text-rose-600 w-[90%]">
            <span> {errorMessage}</span>
          </div>
        )}

        <div className="text-[.8rem] text-center pb-3">
          {frag ? "Have an account?" : "Don't have any account?"}
          <span
            onClick={fragHandle}
            className="font-bold cursor-pointer hover:underline"
          >
            {frag ? " Log In" : " Sing Up"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
