import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./components/Login";
import NavBar from "./components/NavBar";
import HomePage from "./components/Homepage";
import NotFound from "./components/NotFound";
import Dashboard from "./components/Dashboard";
import Registration from "./components/Registration";
import ProtectedElement from "./components/PrivateEle";

function App() {
  return (
    <>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedElement>
                <Dashboard />
              </ProtectedElement>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="*" element={<NotFound />} />
          {/* <Route path="/testing" element={<OtpVerification email="bzusj@g,a"/>} /> */}
        </Routes>
      </Router>
    </>
  );
}

export default App;
