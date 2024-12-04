interface FormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  frag: boolean;
  errorMessage: string;
}
const Form: React.FC<FormProps> = ({ onSubmit, frag, errorMessage }) => {
  return (
    <div className="">
      <h2 className="w-full pt-3 mt-5 mb-5 text-3xl font-semibold text-center">
        {frag ? "Sign Up" : "Log In"}
      </h2>
      <p className="w-[70%] mx-auto mb-4 text-center">
        Hi, Enter your details.to get {frag ? "sign up" : "log in"} to your
        account
      </p>
      <form action="" className="w-full" onSubmit={onSubmit}>
        <input
          type="text"
          name="username"
          id="username"
          autoComplete="off"
          placeholder="Enter username"
          required
          className={`${
            errorMessage === "User not found" ? "border-rose-500" : ""
          } ${
            errorMessage === "The Username is already used"
              ? "border-rose-500"
              : ""
          } block w-[90%] pl-2 mx-auto border-2 rounded-md mb-3`}
        />
        <input
          type="password"
          name="password"
          id="password"
          autoComplete="off"
          placeholder="Enter password"
          required
          className={`${
            errorMessage === "Passwords do not match" ? "border-rose-500" : ""
          } block w-[90%] pl-2 mx-auto border-2 rounded-md mb-3`}
        />
        <button
          type="submit"
          className="bg-blue-400 text-white w-[90%] mx-auto block rounded-md mb-3"
        >
          {frag ? "Sing Up" : "Log In"}
        </button>
      </form>
    </div>
  );
};

export default Form;
