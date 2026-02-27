import { useState, useEffect } from "react";
import MainLayout from "../layout/MainLayout";

function Profile() {
  const token = localStorage.getItem("token");
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      alert("Not authenticated");
      return;
    }
    fetchProfile();
  }, [token]);

  const fetchProfile = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setProfile(data);
      // format subjects array as comma-separated string for display
      setForm({
        ...data,
        subjects: Array.isArray(data.subjects) ? data.subjects.join(", ") : (data.subjects || "")
      });
      setLoading(false);
    } catch (err) {
      console.error("Profile fetch error:", err);
      setLoading(false);
      alert("Failed to load profile");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const dataToSend = {
        ...form,
        currentCGPA: form.currentCGPA ? parseFloat(form.currentCGPA) : undefined,
        currentCredits: form.currentCredits ? parseInt(form.currentCredits) : undefined,
        subjects: form.subjects
          ? form.subjects.split(",").map(s => s.trim()).filter(s => s)
          : []
      };

      const res = await fetch("http://localhost:5000/api/auth/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(dataToSend)
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const updated = await res.json();
      setProfile(updated);
      setForm({
        ...updated,
        subjects: Array.isArray(updated.subjects) ? updated.subjects.join(", ") : (updated.subjects || "")
      });
      setEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Profile update error:", err);
      alert("Error updating profile");
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <section className="page-section">
          <p>Loading profile...</p>
        </section>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <section className="page-section">
        <div className="page-section-header">
          <div>
            <h1 className="page-title">My Profile</h1>
            <p className="page-subtitle">
              Manage your account information and preferences.
            </p>
          </div>
          <div className="stat-pill">
            <span className="stat-pill-dot" />
            <span>{profile?.semester ? `Semester ${profile.semester}` : "No semester"}</span>
          </div>
        </div>

        <div className="mt-md">
          {!editing ? (
            <div>
              <div className="profile-info-grid">
                <div className="profile-info-card">
                  <p className="page-subtitle">Full Name</p>
                  <p style={{ fontSize: 16, fontWeight: 600, marginTop: 4 }}>{profile?.name}</p>
                </div>

                <div className="profile-info-card">
                  <p className="page-subtitle">Email</p>
                  <p style={{ fontSize: 16, fontWeight: 600, marginTop: 4 }}>{profile?.email}</p>
                </div>

                <div className="profile-info-card">
                  <p className="page-subtitle">Phone</p>
                  <p style={{ fontSize: 16, fontWeight: 600, marginTop: 4 }}>
                    {profile?.phone || "Not provided"}
                  </p>
                </div>

                <div className="profile-info-card">
                  <p className="page-subtitle">Semester</p>
                  <p style={{ fontSize: 16, fontWeight: 600, marginTop: 4 }}>{profile?.semester}</p>
                </div>

                <div className="profile-info-card">
                  <p className="page-subtitle">Current CGPA</p>
                  <p style={{ fontSize: 16, fontWeight: 600, marginTop: 4 }}>
                    {profile?.currentCGPA ?? "Not provided"}
                  </p>
                </div>

                <div className="profile-info-card">
                  <p className="page-subtitle">Current Credits</p>
                  <p style={{ fontSize: 16, fontWeight: 600, marginTop: 4 }}>
                    {profile?.currentCredits ?? "Not provided"}
                  </p>
                </div>
              </div>

              <div className="profile-info-card mt-md">
                <p className="page-subtitle">Subjects</p>
                <p style={{ fontSize: 16, fontWeight: 600, marginTop: 4 }}>
                  {profile?.subjects?.length > 0 ? profile.subjects.join(", ") : "No subjects added"}
                </p>
              </div>

              <div className="modal-footer" style={{ justifyContent: "flex-start", marginTop: 20 }}>
                <button className="btn btn-primary" onClick={() => setEditing(true)}>
                  Edit Profile
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="form-grid">
                <div>
                  <label className="form-label">Full Name</label>
                  <input
                    className="input"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="form-label">Email</label>
                  <input
                    className="input"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="form-label">Phone</label>
                  <input
                    className="input"
                    name="phone"
                    type="tel"
                    value={form.phone || ""}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="form-label">Semester</label>
                  <input
                    className="input"
                    name="semester"
                    type="number"
                    value={form.semester}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="form-label">Current CGPA</label>
                  <input
                    className="input"
                    name="currentCGPA"
                    type="number"
                    step="0.01"
                    min="0"
                    max="4"
                    value={form.currentCGPA || ""}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="form-label">Current Credits</label>
                  <input
                    className="input"
                    name="currentCredits"
                    type="number"
                    value={form.currentCredits || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="mt-sm">
                <label className="form-label">Subjects (comma-separated)</label>
                <textarea
                  className="textarea"
                  name="subjects"
                  value={
                    form.subjects
                      ? typeof form.subjects === "string"
                        ? form.subjects
                        : form.subjects.join(", ")
                      : ""
                  }
                  onChange={handleChange}
                  style={{ minHeight: 100 }}
                />
              </div>

              <div className="modal-footer mt-md">
                <button
                  className="btn btn-ghost"
                  onClick={() => {
                    setForm({
                      ...profile,
                      subjects: Array.isArray(profile.subjects) ? profile.subjects.join(", ") : (profile.subjects || "")
                    });
                    setEditing(false);
                  }}
                >
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleSave}>
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
}

export default Profile;
