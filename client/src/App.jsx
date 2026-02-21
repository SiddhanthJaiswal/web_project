import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Subjects from "./pages/Subjects";
import Checklist from "./pages/Checklist";
import Exams from "./pages/Exams";
import Goals from "./pages/Goals";
import SubjectDetails from "./pages/SubjectDetails";
import { Navigate } from "react-router-dom";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" />;
}
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/subjects/:id" element={<SubjectDetails />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/subjects" element={<Subjects />} />
        <Route path="/checklist" element={<Checklist />} />
        <Route path="/exams" element={<Exams />} />
        <Route path="/goals" element={<Goals />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
