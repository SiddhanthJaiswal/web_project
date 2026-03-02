import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Subjects from "./pages/Subjects";
import Checklist from "./pages/Checklist";
import Exams from "./pages/Exams";
import Goals from "./pages/Goals";
import ImportantLinks from "./pages/ImportantLinks";
import Profile from "./pages/Profile";
import SubjectDetails from "./pages/SubjectDetails";
import Chatbot from "./components/Chatbot";

// 🔐 Private Route Wrapper
function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? (
    <>
      {children}
      <Chatbot />   {/* Chatbot only for logged in users */}
    </>
  ) : (
    <Navigate to="/" />
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Private Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/subjects"
          element={
            <PrivateRoute>
              <Subjects />
            </PrivateRoute>
          }
        />

        <Route
          path="/subjects/:id"
          element={
            <PrivateRoute>
              <SubjectDetails />
            </PrivateRoute>
          }
        />

        <Route
          path="/checklist"
          element={
            <PrivateRoute>
              <Checklist />
            </PrivateRoute>
          }
        />

        <Route
          path="/exams"
          element={
            <PrivateRoute>
              <Exams />
            </PrivateRoute>
          }
        />

        <Route
          path="/goals"
          element={
            <PrivateRoute>
              <Goals />
            </PrivateRoute>
          }
        />

        <Route
          path="/important-links"
          element={
            <PrivateRoute>
              <ImportantLinks />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;