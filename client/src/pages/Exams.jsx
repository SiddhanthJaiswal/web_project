import { useEffect, useState } from "react";
import MainLayout from "../layout/MainLayout";

function Exams() {
  const token = localStorage.getItem("token");
  const [exams, setExams] = useState([]);
  const [form, setForm] = useState({
    title: "",
    subject: "",
    date: "",
    notes: ""
  });

  const fetchExams = async () => {
    if (!token) return;

    try {
      const res = await fetch("http://localhost:5000/api/exams", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) {
        return;
      }
      const data = await res.json();
      setExams(data);
    } catch {
      // silent fail on dashboard page
    }
  };

  useEffect(() => {
    fetchExams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddExam = async () => {
    if (!form.title || !form.date || !token) {
      alert("Title and date are required");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/exams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      if (!res.ok) {
        alert("Create failed");
        return;
      }

      setForm({ title: "", subject: "", date: "", notes: "" });
      fetchExams();
    } catch {
      alert("Server error");
    }
  };

  const deleteExam = async (id) => {
    if (!token) return;

    await fetch(`http://localhost:5000/api/exams/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    fetchExams();
  };

  const formatDate = (value) => {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleDateString(undefined, {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  return (
    <MainLayout>
      <section className="page-section">
        <div className="page-section-header">
          <div>
            <h1 className="page-title">Exams</h1>
            <p className="page-subtitle">
              Add your exams and keep track of what&apos;s coming up.
            </p>
          </div>
          <div className="stat-pill">
            <span className="stat-pill-dot" />
            <span>{exams.length} upcoming exam{exams.length === 1 ? "" : "s"}</span>
          </div>
        </div>

        <div className="card">
          <h2 className="card-title">Add exam</h2>
          <p className="card-meta">Give it a clear name and date.</p>

          <div className="mt-md">
            <input
              className="input"
              name="title"
              placeholder="Exam title (e.g. DBMS Midsem)"
              value={form.title}
              onChange={handleChange}
            />
          </div>

          <div className="field-row mt-sm">
            <input
              className="input"
              name="subject"
              placeholder="Subject (optional)"
              value={form.subject}
              onChange={handleChange}
            />
            <input
              className="input"
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
            />
          </div>

          <div className="mt-sm">
            <textarea
              className="textarea"
              name="notes"
              placeholder="Notes (portion, room no., allowed materials, etc.)"
              value={form.notes}
              onChange={handleChange}
            />
          </div>

          <div className="modal-footer">
            <button className="btn btn-primary" onClick={handleAddExam}>
              Add exam
            </button>
          </div>
        </div>
      </section>

      <section className="page-section mt-md">
        <h2 className="page-title" style={{ fontSize: 18 }}>
          Upcoming exams
        </h2>
        <p className="page-subtitle">
          Sorted by date; past exams disappear automatically.
        </p>

        <div className="checklist-list mt-sm">
          {exams.length === 0 && (
            <p className="page-subtitle">
              No upcoming exams yet. Add your first one above.
            </p>
          )}

          {exams.map((exam) => (
            <div key={exam._id} className="task-card">
              <div className="task-card-main" style={{ flexDirection: "column", alignItems: "flex-start" }}>
                <span className="task-text" style={{ fontWeight: 600 }}>
                  {exam.title}
                </span>
                <span className="page-subtitle">
                  {exam.subject && `${exam.subject} • `} {formatDate(exam.date)}
                </span>
                {exam.notes && (
                  <span className="page-subtitle" style={{ marginTop: 4 }}>
                    {exam.notes}
                  </span>
                )}
              </div>

              <button
                className="btn btn-danger task-delete-btn"
                onClick={() => deleteExam(exam._id)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </section>
    </MainLayout>
  );
}

export default Exams;
