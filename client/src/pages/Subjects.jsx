import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layout/MainLayout";

function Subjects() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [subjects, setSubjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newSubject, setNewSubject] = useState({
    name: "",
    credits: "",
    description: ""
  });

  /* ============================
     FETCH SUBJECTS FROM BACKEND
  ============================ */

  const fetchSubjects = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/subjects", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      setSubjects(data);
    } catch (err) {
      console.log("Fetch subjects error");
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  /* ============================
     ADD SUBJECT
  ============================ */

  const handleAddSubject = async () => {
    if (!newSubject.name) {
      alert("Subject name required");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/subjects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newSubject)
      });

      if (!res.ok) {
        alert("Create failed");
        return;
      }

      setShowModal(false);
      setNewSubject({ name: "", credits: "", description: "" });
      fetchSubjects();
    } catch (err) {
      alert("Server error");
    }
  };

  /* ============================
     DELETE SUBJECT
  ============================ */

  const deleteSubject = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/subjects/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      fetchSubjects();
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <MainLayout>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Subjects</h1>

          <button
            style={styles.addButton}
            onClick={() => setShowModal(true)}
          >
            + Add Subject
          </button>
        </div>

        <div style={styles.grid}>
          {subjects.map((subject) => (
            <div key={subject._id} style={styles.card}>
              <div
                onClick={() => navigate(`/subjects/${subject._id}`)}
                style={{ cursor: "pointer" }}
              >
                <h3 style={styles.subjectTitle}>{subject.name}</h3>

                <p style={styles.description}>
                  {subject.description || "No description"}
                </p>

                <p style={styles.credits}>
                  <strong>Credits:</strong> {subject.credits || 0}
                </p>
              </div>

              <button
                style={styles.deleteBtn}
                onClick={() => deleteSubject(subject._id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>

        {showModal && (
          <div style={styles.modalOverlay}>
            <div style={styles.modal}>
              <h2>Add New Subject</h2>

              <input
                placeholder="Subject Name"
                value={newSubject.name}
                onChange={(e) =>
                  setNewSubject({
                    ...newSubject,
                    name: e.target.value
                  })
                }
                style={styles.input}
              />

              <input
                type="number"
                placeholder="Credits"
                value={newSubject.credits}
                onChange={(e) =>
                  setNewSubject({
                    ...newSubject,
                    credits: e.target.value
                  })
                }
                style={styles.input}
              />

              <textarea
                placeholder="Description"
                value={newSubject.description}
                onChange={(e) =>
                  setNewSubject({
                    ...newSubject,
                    description: e.target.value
                  })
                }
                style={styles.input}
              />

              <div style={styles.modalButtons}>
                <button
                  style={styles.cancelBtn}
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

                <button
                  style={styles.addButton}
                  onClick={handleAddSubject}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

/* ============================
   STYLES
============================ */

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "30px",
    padding: "10px",
    fontFamily: "Inter, system-ui, sans-serif",
    color: "#374151"
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },

  title: {
    fontSize: "26px",
    fontWeight: "600",
    color: "#1f2937"
  },

  addButton: {
    padding: "10px 18px",
    background: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "22px"
  },

  card: {
    background: "#ffffff",
    padding: "22px",
    borderRadius: "14px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    border: "1px solid #f1f5f9"
  },

  subjectTitle: {
    fontSize: "18px",
    fontWeight: "600",
    marginBottom: "6px",
    color: "#111827"
  },

  description: {
    fontSize: "14px",
    color: "#6b7280",
    marginBottom: "8px",
    lineHeight: "1.4"
  },

  credits: {
    fontSize: "13px",
    color: "#4b5563"
  },

  deleteBtn: {
    background: "#ef4444",
    border: "none",
    color: "white",
    padding: "7px",
    borderRadius: "6px",
    marginTop: "12px",
    cursor: "pointer",
    fontSize: "13px"
  },

  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.35)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },

  modal: {
    background: "#ffffff",
    padding: "30px",
    borderRadius: "14px",
    width: "420px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.15)"
  },

  input: {
    padding: "11px",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    fontSize: "14px",
    outline: "none"
  },

  modalButtons: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px"
  },

  cancelBtn: {
    padding: "10px 15px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    background: "#f3f4f6",
    cursor: "pointer"
  }
};

export default Subjects;