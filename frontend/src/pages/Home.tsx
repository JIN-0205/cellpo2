import { Link } from "react-router-dom";
import Game from "../components/Game";

const Home = () => {
  return (
    <div>
      <h1 className="mt-6 text-3xl font-extrabold text-center font-MICRO">
        Welcome to Home Page
      </h1>
      <Link
        to="/signIn"
        className="px-2 ml-5 border-2 border-blue-600 rounded-md hover:text-gray-50 hover:bg-blue-600 "
      >
        Sign In
      </Link>
      {/* <Game /> */}
    </div>
  );
};

export default Home;
