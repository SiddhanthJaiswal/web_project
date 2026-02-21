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
          <h1>Subjects</h1>
          <button
            style={styles.addButton}
            onClick={() => setShowModal(true)}
          >
            + Add Subject
          </button>
        </div>

        <div style={styles.grid}>
          {subjects.map((subject) => (
            <div
              key={subject._id}
              style={styles.card}
            >
              <div
                onClick={() => navigate(`/subjects/${subject._id}`)}
                style={{ cursor: "pointer" }}
              >
                <h3>{subject.name}</h3>
                <p>{subject.description}</p>
                <p><strong>Credits:</strong> {subject.credits}</p>
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
                <button onClick={() => setShowModal(false)}>
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
  container: { display: "flex", flexDirection: "column", gap: "25px" },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },

  addButton: {
    padding: "10px 15px",
    background: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer"
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "20px"
  },

  card: {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between"
  },

  deleteBtn: {
    background: "#ef4444",
    border: "none",
    color: "white",
    padding: "6px",
    borderRadius: "6px",
    marginTop: "10px",
    cursor: "pointer"
  },

  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },

  modal: {
    background: "white",
    padding: "30px",
    borderRadius: "12px",
    width: "400px",
    display: "flex",
    flexDirection: "column",
    gap: "15px"
  },

  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ddd"
  },

  modalButtons: {
    display: "flex",
    justifyContent: "space-between"
  }
};

export default Subjects;