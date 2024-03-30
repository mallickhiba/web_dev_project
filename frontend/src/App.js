import "./App.css";
import { useState } from "react";
import axios from "axios";

function App() {
  const [data, setData] = useState({
    email: "",
    password: "",
    age: 0,
    firstName: "",
    lastName: "",
    admin: false,
  });
  const [user, setUser] = useState({ loggedIn: false, token: "" });

  const handleForm = (e) =>
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const signupSubmit = async (e) => {
    try {
      e.preventDefault();
      const res = await axios({
        url: "htt://localhost:5600/auth/signUp",
        method: "post",
        data: data,
      });
      window.alert(res.data.msg);
    } catch (e) {
      window.alert("ERROR");
      console.error(e);
    }
  };

  const loginSubmit = async (e) => {
    try {
      e.preventDefault();
      const res = await axios({
        url: "http://localhost:5600/auth/login",
        method: "post",
        data: data,
      });
      window.alert(res.data.msg);
      if (res.data.token) setUser({ loggedIn: true, token: res.data.token });
    } catch (e) {
      window.alert("ERROR");
      console.error(e);
    }
  };

  const createCard = async (e) => {
    try {
      e.preventDefault();
      const res = await axios({
        url: "http://localhost:5600/bank/createCard",
        method: "post",
        data: { email: data.email },
        headers: { Authorization: `Bearer ${user.token}` },
      });
      window.alert(res.data.msg);
    } catch (e) {
      window.alert("ERROR");
    }
  };

  return (
    <div
      className="mera-dabba"
    >
      {user.loggedIn ? (
        <div style={{ margin: 50 }}>
          <form
            onSubmit={createCard}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <h1>Create Card</h1>
            <button type="submit">Submit</button>
          </form>
        </div>
      ) : (
        <>
          <div style={{ margin: 50 }}>
            <form
              onSubmit={signupSubmit}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <h1>Signup</h1>
              <input
                type="text"
                name="firstName"
                value={data.firstName}
                onChange={handleForm}
                style={{ margin: 5 }}
              />
              <input
                type="text"
                name="lastName"
                value={data.lastName}
                onChange={handleForm}
                style={{ margin: 5 }}
              />
              <input
                type="text"
                name="email"
                data={data.email}
                onChange={handleForm}
                style={{ margin: 5 }}
              />
              <input
                type="password"
                name="password"
                value={data.password}
                onChange={handleForm}
                style={{ margin: 5 }}
              />
              <input
                type="number"
                name="age"
                value={data.age}
                onChange={handleForm}
                style={{ margin: 5 }}
              />
              <input
                type="checkbox"
                name="admin"
                value={data.admin}
                onChange={handleForm}
                style={{ margin: 5 }}
              />
              <button type="submit">Submit</button>
            </form>
          </div>
          <div>
            <form
              onSubmit={loginSubmit}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <h1>Login</h1>
              <input
                type="text"
                name="email"
                data={data.email}
                onChange={handleForm}
                style={{ margin: 5 }}
              />
              <input
                type="password"
                name="password"
                value={data.password}
                onChange={handleForm}
                style={{ margin: 5 }}
              />
              <button type="submit">Submit</button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}

export default App;