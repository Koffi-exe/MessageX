import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import Login from "./components/Login";
import NavBar from "./components/NavBar";
import HomePage from "./components/Homepage";
import NotFound from "./components/NotFound";
import Dashboard from "./components/Dashboard";
import Registration from "./components/Registration";
import ProtectedElement from "./components/PrivateEle";
import SearchBar from "./components/SearchBar";
import SecondUserProfile from "./components/SecondUserProfile";
import PrivateChat from "./components/PrivateChat";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <NavBar />
                <HomePage />
              </>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedElement>
                <Dashboard />
              </ProtectedElement>
            }
          />
          <Route
            path="/login"
            element={
              <>
                <NavBar />
                <Login />
              </>
            }
          />
          <Route
            path="/register"
            element={
              <>
                <NavBar />
                <Registration />
              </>
            }
          />
          <Route
            path="/search"
            element={
              <>
                <NavBar />
                <SearchBar />
              </>
            }
          />
          <Route
            path="user-profile/:id/:name/:username"
            element={
              <>
                <NavBar />
                <SecondUserProfile />
              </>
            }
          />
          <Route
            path="/privatemessage/:receiverId/:name"
            element={
              <>
                <NavBar />
                <PrivateChat />
              </>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
        style={{marginTop:"50px"}}
        />
    </>
  );
}

export default App;
