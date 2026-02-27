import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import MainLayout from "../layout/MainLayout";

function SubjectDetails() {
  const { id } = useParams(); // subjectId
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [modules, setModules] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newModule, setNewModule] = useState({
    title: "",
    description: ""
  });
  const [activeFile, setActiveFile] = useState(null);

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

      // close file view if it belongs to the deleted module
      if (activeFile && activeFile.moduleId === moduleId) {
        setActiveFile(null);
      }

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

    const isPdf =
      file.type === "application/pdf" ||
      (file.name || "").toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      alert("Only PDF files are allowed");
      return;
    }

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

      // close file view if this file is currently open
      if (activeFile && activeFile._id === fileId) {
        setActiveFile(null);
      }

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

  const toggleFileCompletion = async (fileId) => {
    try {
      await fetch(`http://localhost:5000/api/files/${fileId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchModules();
    } catch (err) {
      alert("Update failed");
    }
  };

  const activeFileUrl = activeFile
    ? `http://localhost:5000/${activeFile.filePath.replace(/\\/g, "/")}`
    : null;

  return (
    <MainLayout>
      <section className="page-section">
        <div className="page-section-header">
          <div>
            <button
              className="btn btn-ghost"
              onClick={() => navigate("/subjects")}
              style={{ marginBottom: 8, alignSelf: "flex-start" }}
            >
              ← Back to Subjects
            </button>
            <h1 className="page-title">Subject modules</h1>
            <p className="page-subtitle">
              Break your subject into modules and attach your PDF notes.
            </p>
          </div>
          <div className="stat-pill">
            <span className="stat-pill-dot" />
            <span>{completionPercent}% modules completed</span>
          </div>
        </div>

        <div className="mt-sm">
          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{ width: `${completionPercent}%` }}
            />
          </div>
        </div>

        <div className="modal-footer" style={{ justifyContent: "flex-start" }}>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            + Add module
          </button>
        </div>
      </section>

      <section className="page-section mt-md">
        <h2 className="page-title" style={{ fontSize: 18 }}>
          Modules & notes
        </h2>
        <p className="page-subtitle">
          Each module can have many PDF notes. Track completion per file.
        </p>

        <div className="card-grid mt-sm">
          {modules.map((module) => {
            const files = module.files || [];
            const completedFiles = files.filter((f) => f.completed);
            const filePercent =
              files.length === 0
                ? 0
                : Math.round((completedFiles.length / files.length) * 100);

            return (
              <div key={module._id} className="card">
                <h3 className="card-title">{module.title}</h3>
                <p className="card-meta">{module.description}</p>

                <div className="mt-sm">
                  <label style={{ fontSize: 13 }}>
                    <input
                      type="checkbox"
                      checked={module.completed}
                      onChange={() => toggleCompletion(module._id)}
                    />{" "}
                    Mark module as completed
                  </label>
                </div>

                <div className="mt-sm">
                  <div className="progress-bar">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${filePercent}%` }}
                    />
                  </div>
                  <p className="page-subtitle" style={{ marginTop: 4 }}>
                    {files.length === 0
                      ? "No notes yet"
                      : `${completedFiles.length} of ${files.length} notes completed`}
                  </p>
                </div>

                <div className="checklist-list mt-sm">
                  {files.map((file) => (
                    <div key={file._id} className="task-card">
                      <div
                        className="task-card-main"
                        style={{
                          flexDirection: "column",
                          alignItems: "flex-start",
                          cursor: "pointer"
                        }}
                        onClick={() => setActiveFile(file)}
                      >
                        <span className="task-text" style={{ fontWeight: 600 }}>
                          {file.originalName}
                        </span>
                        <span className="page-subtitle">
                          {file.completed ? "Completed" : "In progress"}
                        </span>
                      </div>

                      <div className="flex items-center gap-sm">
                        <label style={{ fontSize: 12 }}>
                          <input
                            type="checkbox"
                            checked={!!file.completed}
                            onChange={() => toggleFileCompletion(file._id)}
                          />{" "}
                          Done
                        </label>

                        <button
                          className="btn btn-danger task-delete-btn"
                          onClick={() => deleteFile(file._id)}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <label className="uploadLabel mt-sm">
                  <span className="page-subtitle">Upload PDF note</span>
                  <input
                    type="file"
                    accept="application/pdf"
                    hidden
                    onChange={(e) => handleFileUpload(module._id, e)}
                  />
                </label>

                <div className="modal-footer" style={{ marginTop: 8 }}>
                  <button
                    className="btn btn-danger"
                    onClick={() => deleteModule(module._id)}
                  >
                    Delete module
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {activeFileUrl && (
        <section className="page-section mt-md">
          <h2 className="page-title" style={{ fontSize: 18 }}>
            Reading: {activeFile?.originalName}
          </h2>
          <p className="page-subtitle">
            Scroll through your PDF directly inside the app.
          </p>
          <div className="mt-sm" style={{ height: "70vh" }}>
            <iframe
              title={activeFile?.originalName || "PDF viewer"}
              src={activeFileUrl}
              style={{
                width: "100%",
                height: "100%",
                border: "3px solid #111827",
                borderRadius: 12,
                background: "#ffffff"
              }}
            />
          </div>
        </section>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-surface">
            <h2 className="page-title" style={{ fontSize: 18 }}>
              Add module
            </h2>
            <p className="page-subtitle">
              Create a module for a chapter, unit, or topic.
            </p>

            <div className="mt-sm">
              <input
                className="input"
                placeholder="Module title"
                value={newModule.title}
                onChange={(e) =>
                  setNewModule({
                    ...newModule,
                    title: e.target.value
                  })
                }
              />
            </div>

            <div className="mt-sm">
              <textarea
                className="textarea"
                placeholder="Short description"
                value={newModule.description}
                onChange={(e) =>
                  setNewModule({
                    ...newModule,
                    description: e.target.value
                  })
                }
              />
            </div>

            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleAddModule}>
                Add module
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}

export default SubjectDetails;