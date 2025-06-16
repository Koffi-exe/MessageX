import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./components/Login";
import NavBar from "./components/NavBar";
import HomePage from "./components/Homepage";
import NotFound from "./components/NotFound";
import Dashboard from "./components/Dashboard";
import Registration from "./components/Registration";
import ProtectedElement from "./components/PrivateEle";
import SearchBar from "./components/SearchBar";
import SecondUserProfile from "./components/SecondUserProfile";
import FriendRequests from "./components/FriendRequests";

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
            path="user-profile/:id"
            element={
              <>
                <NavBar />
                <SecondUserProfile />
              </>
            }
          />
          <Route path="*" element={<NotFound />} />
          <Route
            path="/testing"
            element={
              <>
                <NavBar />
                <FriendRequests />
              </>
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
