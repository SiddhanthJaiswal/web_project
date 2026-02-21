import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import MainLayout from "../layout/MainLayout";

function SubjectDetails() {
  const { id } = useParams(); // subjectId
  const token = localStorage.getItem("token");

  const [modules, setModules] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newModule, setNewModule] = useState({
    title: "",
    description: ""
  });

  /* ============================
     FETCH MODULES FROM BACKEND
  ============================ */

  const fetchModules = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/modules/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await res.json();
      setModules(data);
    } catch (err) {
      console.log("Fetch modules error");
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

  /* ============================
     ADD MODULE
  ============================ */

  const handleAddModule = async () => {
    if (!newModule.title) {
      alert("Module title required");
      return;
    }

    try {
      const res = await fetch(
        "http://localhost:5000/api/modules",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            ...newModule,
            subject: id
          })
        }
      );

      if (!res.ok) {
        alert("Create failed");
        return;
      }

      setShowModal(false);
      setNewModule({ title: "", description: "" });
      fetchModules();

    } catch (err) {
      alert("Server error");
    }
  };

  /* ============================
     TOGGLE COMPLETION
  ============================ */

  const toggleCompletion = async (moduleId) => {
    try {
      await fetch(
        `http://localhost:5000/api/modules/${moduleId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      fetchModules();
    } catch (err) {
      alert("Update failed");
    }
  };

  /* ============================
     DELETE MODULE
  ============================ */

  const deleteModule = async (moduleId) => {
    try {
      await fetch(
        `http://localhost:5000/api/modules/${moduleId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      fetchModules();
    } catch (err) {
      alert("Delete failed");
    }
  };

  /* ============================
     FILE HANDLING (UNCHANGED)
  ============================ */

  const handleFileUpload = async (moduleId, event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(
        `http://localhost:5000/api/files/upload/${moduleId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: formData
        }
      );

      if (!res.ok) {
        alert("Upload failed");
        return;
      }

      fetchModules();
    } catch (err) {
      alert("Upload error");
    }
  };

  const deleteFile = async (fileId) => {
    try {
      await fetch(
        `http://localhost:5000/api/files/${fileId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      fetchModules();
    } catch (err) {
      alert("Delete failed");
    }
  };

  const completionPercent =
    modules.length === 0
      ? 0
      : Math.round(
          (modules.filter((m) => m.completed).length / modules.length) * 100
        );

  return (
    <MainLayout>
      <div style={styles.container}>
        <h1>Subject Modules</h1>

        {/* Progress */}
        <div style={styles.progressSection}>
          <h3>Completion Progress</h3>
          <div style={styles.progressBar}>
            <div
              style={{
                ...styles.progressFill,
                width: `${completionPercent}%`
              }}
            ></div>
          </div>
          <p>{completionPercent}% Completed</p>
        </div>

        <button
          style={styles.addButton}
          onClick={() => setShowModal(true)}
        >
          + Add Module
        </button>

        <div style={styles.moduleGrid}>
          {modules.map((module) => (
            <div key={module._id} style={styles.card}>
              <h3>{module.title}</h3>
              <p>{module.description}</p>

              <div style={styles.moduleFooter}>
                <label>
                  <input
                    type="checkbox"
                    checked={module.completed}
                    onChange={() =>
                      toggleCompletion(module._id)
                    }
                  />
                  Completed
                </label>

                <button
                  style={styles.deleteBtn}
                  onClick={() =>
                    deleteModule(module._id)
                  }
                >
                  Delete
                </button>
              </div>

              {/* FILES */}
              {module.files && module.files.length > 0 && (
                <ul style={styles.fileList}>
                  {module.files.map((file) => (
                    <li key={file._id}>
                      <a
                        href={`http://localhost:5000/${file.filePath}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {file.originalName}
                      </a>

                      <button
                        onClick={() =>
                          deleteFile(file._id)
                        }
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <label style={styles.uploadLabel}>
                Upload File
                <input
                  type="file"
                  hidden
                  onChange={(e) =>
                    handleFileUpload(module._id, e)
                  }
                />
              </label>
            </div>
          ))}
        </div>

        {showModal && (
          <div style={styles.modalOverlay}>
            <div style={styles.modal}>
              <h2>Add Module</h2>

              <input
                placeholder="Module Title"
                value={newModule.title}
                onChange={(e) =>
                  setNewModule({
                    ...newModule,
                    title: e.target.value
                  })
                }
                style={styles.input}
              />

              <textarea
                placeholder="Description"
                value={newModule.description}
                onChange={(e) =>
                  setNewModule({
                    ...newModule,
                    description: e.target.value
                  })
                }
                style={styles.input}
              />

              <div style={styles.modalButtons}>
                <button
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

                <button
                  style={styles.addButton}
                  onClick={handleAddModule}
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

const styles = {
  container: { display: "flex", flexDirection: "column", gap: "25px" },
  progressSection: {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.05)"
  },
  progressBar: {
    height: "10px",
    background: "#e5e7eb",
    borderRadius: "6px",
    marginTop: "10px",
    marginBottom: "10px"
  },
  progressFill: {
    height: "100%",
    background: "#4f46e5",
    borderRadius: "6px"
  },
  addButton: {
    padding: "10px 15px",
    background: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer"
  },
  moduleGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "20px"
  },
  card: {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.05)"
  },
  moduleFooter: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px"
  },
  deleteBtn: {
    background: "#ef4444",
    border: "none",
    color: "white",
    padding: "6px",
    borderRadius: "6px",
    cursor: "pointer"
  },
  fileList: {
    marginTop: "10px"
  },
  uploadLabel: {
    display: "inline-block",
    marginTop: "10px",
    padding: "6px 10px",
    background: "#e0e7ff",
    borderRadius: "6px",
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

export default SubjectDetails;