import "./App.css";
import { Provider, useSelector } from "react-redux";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import persistStore from "redux-persist/es/persistStore";
import { PersistGate } from "redux-persist/integration/react";
import SignIn from "./components/SignIn";
import Store from "./Store";
import Cookies from "js-cookie";
import SignUp from "./components/SignUp";
import Navbar from "./components/Navbar";
import Profile from "./components/Profile";
import ForgotPassword from "./components/ForgotPassword";
import Home from "./components/Home";
let persistor = persistStore(Store);

const routes = [
  { path: "/", element: <SignIn /> },
  { path: "/sign-up", element: <SignUp /> },

  {
    path: "/",
    element: (
      <RequireAuth redirectTo="/">
        <>Nav bar</>
      </RequireAuth>
    ),
    children: [
      {
        path: "createform",
        element: <>Create Form</>,
      },
    ],
  },
  { path: "*", element: <>Not Found</> },
  {
    path: "/",
    element: <>Nav bar</>,
    children: [
      { path: "/feed", element: <div>Feed</div> },
      { path: "add-summary", element: <>Add Summary</> },
    ],
  },
];

function App() {
  return (
    <Provider store={Store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route
              path="/"
              element={
                <RequireAuth redirectTo="/">
                  <Navbar />
                </RequireAuth>
              }
            />
            <Route path="/" element={<Navbar />}>
              <Route path="/feed" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  );
}

function RequireAuth({ children, redirectTo }) {
  let isAuthenticated = Cookies.get("token") ? true : false;
  return isAuthenticated ? children : <Navigate to={redirectTo} />;
}
export default App;
