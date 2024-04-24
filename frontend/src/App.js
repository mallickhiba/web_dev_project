import "./App.css";
import { useState } from "react";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import axios from "axios";
import SignUp from "./SignUp";
import Login from "./Login";

function App() {
  const [data, setData] = useState({
    role:"",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phoneNumber: ""
  });

  const [user, setUser] = useState({ loggedIn: false, token: "" });

  const createCard = async (e) => {
    try {
      e.preventDefault();
      const res = await axios({
        url: "http://localhost:5600/bank/createCard",
        method: "post",
        data: { email: data.email },
       x,
      });
      window.alert(res.data.msg);
    } catch (e) {
      window.alert("ERROR");
    }
  };

  return (
    <Router>
      <div className="mera-dabba">
        <nav>
          <ul>
          <li>
              <Link to="/signup">Signup</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
            {user.loggedIn && (
              <li>
                <button onClick={createCard}>Create Card</button>
              </li>
            )}
          </ul>
        </nav>

        <Routes>
          <Route path="/signup" element={<SignUp/>} />
          <Route path="/login" element={<Login setUser={setUser} />} />        
        </Routes>
      </div>
    </Router>
  );
}

export default App;
