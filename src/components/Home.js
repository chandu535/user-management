import { useSelector } from "react-redux";

const Home = () => {
  const userDetails = useSelector((state) => state.Signin?.user_details);
  return (
    <div>
      Last Login Time:{" "}
      {userDetails?.last_login_time ? userDetails?.last_login_time : "-"}
    </div>
  );
};

export default Home;
