import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import TaskList from "../pages/TaskList";
// import TaskForm from "../pages/TaskForm";
import Error from "../utils/Error";
import Loader from "../utils/Loader";

const App = () => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  const setAuthToken = (token: any) => {
    localStorage.setItem("token", token);
    setToken(token);
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
    setTimeout(() => {
      setLoading(false);
    }, 50);
  }, []);

  return (
    <Router>
      {loading ? (
        <Loader />
      ) : (
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} errorElement={<Error />} />
          <Route
            path="/login"
            element={token ? <Navigate to="/tasks" /> : <Login setToken={setAuthToken} />}
          />
          <Route path="/register" element={token ? <Navigate to="/tasks" /> : <Register />} />
          <Route
            path="/tasks"
            element={token ? <TaskList token={token} /> : <Navigate to="/login" replace />}
          />
          {/* <Route
            path="/add-task"
            element={token ? <TaskForm token={token} /> : <Navigate to="/login" />}
          /> */}
          <Route path="*" element={<Navigate to={token ? "/tasks" : "/login"} replace />} />
        </Routes>
      )}
    </Router>
  );
};

export default App;
