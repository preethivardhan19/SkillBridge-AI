
import { useEffect, useState } from "react";
import "./Profile.css";
import API_URL from "./api";


function Profile({ onBack }) {
  const [form, setForm] = useState(() => {
    try {
      const savedProfile = JSON.parse(
        localStorage.getItem("skillbridge-profile") || "{}"
      );

      return {
        name: savedProfile.name || "",
        email: savedProfile.email || "",
        education: savedProfile.education || "B.Tech Computer Science",
        graduation: savedProfile.graduation || "2026",
        skills: Array.isArray(savedProfile.skills)
          ? savedProfile.skills.join(", ")
          : savedProfile.skills || "",
        preferredRole:
          savedProfile.preferredRole || savedProfile.role || "Any",
        location: savedProfile.location || "Hyderabad"
      };
    } catch {
      return {
        name: "",
        email: "",
        education: "B.Tech Computer Science",
        graduation: "2026",
        skills: "",
        preferredRole: "Any",
        location: "Hyderabad"
      };
    }
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  // Retrieve the profile from SQLite when the page opens.
  useEffect(() => {
    const email = form.email.trim();

    if (!email) return;

    let cancelled = false;

    async function loadProfile() {
      setLoading(true);

      try {
        const response = await fetch(
          `${API_URL}/profile/${encodeURIComponent(email)}`
        );

        if (response.status === 404) {
          return;
        }

        if (!response.ok) {
          throw new Error("Unable to retrieve your profile.");
        }

        const data = await response.json();

        if (cancelled || !data.profile) return;

        const savedProfile = data.profile;

        const updatedForm = {
          name: savedProfile.name || "",
          email: savedProfile.email || email,
          education: savedProfile.education || "B.Tech Computer Science",
          graduation: savedProfile.graduation || "2026",
          skills: Array.isArray(savedProfile.skills)
            ? savedProfile.skills.join(", ")
            : "",
          preferredRole: savedProfile.preferred_role || "Any",
          location: savedProfile.location || "Hyderabad"
        };

        setForm(updatedForm);

        localStorage.setItem(
          "skillbridge-profile",
          JSON.stringify(updatedForm)
        );

      } catch (error) {
        console.error("Profile retrieval error:", error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, []);

  function handleChange(e) {
    setForm((previousForm) => ({
      ...previousForm,
      [e.target.name]: e.target.value
    }));

    setMessage("");
    setMessageType("");
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const profileData = {
      ...form,
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      skills: form.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean)
    };

    if (!profileData.skills.length) {
      setMessage("Please enter at least one technical skill.");
      setMessageType("error");
      return;
    }

    setSaving(true);
    setMessage("");
    setMessageType("");

    try {
      const response = await fetch(`${API_URL}/profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(profileData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Unable to save your profile."
        );
      }

      const savedProfile = {
        ...profileData,
        skills: data.profile.skills
      };

      localStorage.setItem(
        "skillbridge-profile",
        JSON.stringify(savedProfile)
      );

      setForm({
        ...savedProfile,
        skills: savedProfile.skills.join(", ")
      });

      setMessage("Your profile has been saved to the database successfully!");
      setMessageType("success");

    } catch (error) {
      setMessage(
        error.message || "Unable to connect to the backend. Please try again."
      );
      setMessageType("error");

    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="profile-page">
      <nav className="profile-nav">
        <h2>
          SkillBridge<span>AI</span>
        </h2>

        <button onClick={onBack}>← Back to Home</button>
      </nav>

      <div className="profile-container">
        <p className="profile-label">
          YOUR CAREER JOURNEY STARTS HERE
        </p>

        <h1>Create Your Student Profile</h1>

        <p className="profile-subtitle">
          Tell us about yourself so we can discover opportunities
          that match your skills and career goals.
        </p>

        {loading && (
          <p className="profile-status">
            Loading your saved profile...
          </p>
        )}

        <form className="profile-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>

            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label>Education</label>

            <select
              name="education"
              value={form.education}
              onChange={handleChange}
            >
              <option>B.Tech Computer Science</option>
              <option>B.Tech Information Technology</option>
              <option>B.Sc Computer Science</option>
              <option>BCA</option>
              <option>MCA</option>
              <option>Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Graduation Year</label>

            <select
              name="graduation"
              value={form.graduation}
              onChange={handleChange}
            >
              <option>2025</option>
              <option>2026</option>
              <option>2027</option>
              <option>2028</option>
              <option>2029</option>
            </select>
          </div>

          <div className="form-group full-width">
            <label>Technical Skills</label>

            <textarea
              name="skills"
              value={form.skills}
              onChange={handleChange}
              placeholder="Example: Python, SQL, Machine Learning, Power BI..."
              rows="4"
              required
            />

            <small>Separate your skills using commas.</small>
          </div>

          <div className="form-group">
            <label>Preferred Career Role</label>

            <select
              name="preferredRole"
              value={form.preferredRole}
              onChange={handleChange}
            >
              <option value="Any">Any (Automatic Career Matching)</option>
              <option value="Data Analyst">Data Analyst</option>
              <option value="Data Scientist">Data Scientist</option>
              <option value="AI/ML Engineer">AI/ML Engineer</option>
              <option value="Software Developer">Software Developer</option>
              <option value="Cloud Engineer">Cloud Engineer</option>
              <option value="Product Manager">Product Manager</option>
            </select>

            <small>
              Choose Any to let SkillBridge recommend a career based on your skills.
            </small>
          </div>

          <div className="form-group">
            <label>Preferred Work Location</label>

            <select
              name="location"
              value={form.location}
              onChange={handleChange}
            >
              <option>Hyderabad</option>
              <option>Bengaluru</option>
              <option>Chennai</option>
              <option>Visakhapatnam</option>
              <option>Remote</option>
              <option>Any Location</option>
            </select>
          </div>

          <button
            className="save-profile"
            type="submit"
            disabled={saving}
          >
            {saving ? "Saving Profile..." : "Save My Profile →"}
          </button>

          {message && (
            <p
              className={
                messageType === "success"
                  ? "success-message"
                  : "error-message"
              }
            >
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default Profile;
