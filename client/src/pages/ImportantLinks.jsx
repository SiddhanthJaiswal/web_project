import { useState } from "react";
import MainLayout from "../layout/MainLayout";

function ImportantLinks() {
  const [links, setLinks] = useState([
    {
      id: 1,
      title: "University Portal",
      url: "https://portal.university.edu",
      category: "Academic"
    },
    {
      id: 2,
      title: "Library Resources",
      url: "https://library.university.edu",
      category: "Academic"
    },
    {
      id: 3,
      title: "Student Email",
      url: "https://mail.university.edu",
      category: "Communication"
    },
    {
      id: 4,
      title: "Course Schedule",
      url: "https://schedule.university.edu",
      category: "Academic"
    },
    {
      id: 5,
      title: "Academic Advisor",
      url: "https://advising.university.edu",
      category: "Support"
    },
    {
      id: 6,
      title: "Transcript Request",
      url: "https://transcripts.university.edu",
      category: "Records"
    }
  ]);

  const [newLink, setNewLink] = useState({
    title: "",
    url: "",
    category: ""
  });

  const [showForm, setShowForm] = useState(false);

  const handleAddLink = () => {
    if (!newLink.title || !newLink.url) {
      alert("Please fill in all fields");
      return;
    }

    const link = {
      id: links.length + 1,
      ...newLink
    };

    setLinks([...links, link]);
    setNewLink({ title: "", url: "", category: "" });
    setShowForm(false);
  };

  const deleteLink = (id) => {
    setLinks(links.filter((link) => link.id !== id));
  };

  const categories = [...new Set(links.map((link) => link.category))];

  return (
    <MainLayout>
      <section className="page-section">
        <div className="page-section-header">
          <div>
            <h1 className="page-title">Important Links</h1>
            <p className="page-subtitle">
              Keep track of all your important academic and support resources.
            </p>
          </div>
          <div className="stat-pill">
            <span className="stat-pill-dot" />
            <span>{links.length} links saved</span>
          </div>
        </div>

        <div className="mt-sm">
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            + Add Link
          </button>
        </div>
      </section>

      {categories.map((category) => (
        <section key={category} className="page-section mt-md">
          <h2 className="page-title" style={{ fontSize: 18 }}>
            {category}
          </h2>

          <div className="checklist-list mt-sm">
            {links
              .filter((link) => link.category === category)
              .map((link) => (
                <div
                  key={link.id}
                  className="task-card"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    backdropFilter: "blur(6px)"
                  }}
                >
                  <div className="task-card-main">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="task-text"
                      style={{
                        color: "#60a5fa",
                        fontWeight: "500",
                        textDecoration: "none",
                        fontSize: "15px",
                        letterSpacing: "0.3px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        transition: "all 0.2s ease"
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.color = "#93c5fd";
                        e.target.style.transform = "translateX(3px)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.color = "#60a5fa";
                        e.target.style.transform = "translateX(0)";
                      }}
                    >
                      🔗 {link.title}
                    </a>
                  </div>
                  <button
                    className="btn btn-danger task-delete-btn"
                    onClick={() => deleteLink(link.id)}
                  >
                    ✕
                  </button>
                </div>
              ))}
          </div>
        </section>
      ))}

      {showForm && (
        <div className="modal-overlay">
          <div className="modal-surface">
            <h2 className="page-title" style={{ fontSize: 18 }}>
              Add New Link
            </h2>
            <p className="page-subtitle">
              Add a useful link to your collection.
            </p>

            <div className="mt-sm">
              <input
                className="input"
                placeholder="Link title (e.g., Library Portal)"
                value={newLink.title}
                onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
              />
            </div>

            <div className="mt-sm">
              <input
                className="input"
                placeholder="URL (e.g., https://example.com)"
                value={newLink.url}
                onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
              />
            </div>

            <div className="mt-sm">
              <input
                className="input"
                placeholder="Category (e.g., Academic, Support)"
                value={newLink.category}
                onChange={(e) =>
                  setNewLink({ ...newLink, category: e.target.value })
                }
              />
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-ghost"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleAddLink}>
                Add Link
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}

export default ImportantLinks;
