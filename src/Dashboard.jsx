
import { useEffect, useState } from "react";
import "./Dashboard.css";

const API_URL = "http://127.0.0.1:8000";

function Dashboard({
  onBack,
  onOpenProfile,
  onOpenMatches,
  onOpenRoadmap,
  onOpenAssistant
}) {
  const [profile, setProfile] = useState({});
  const [recommendations, setRecommendations] = useState([]);
  const [completedSkills, setCompletedSkills] = useState([]);
  const [totalCareers, setTotalCareers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [progressLoading, setProgressLoading] = useState(true);
  const [error, setError] = useState("");
  const [progressMessage, setProgressMessage] = useState("");

  useEffect(() => {
 async function loadDashboard() {
  let savedProfile = {};

  try {
    savedProfile = JSON.parse(
      localStorage.getItem("skillbridge-profile") || "{}"
    );
        setProfile(savedProfile);

        const skills = Array.isArray(savedProfile.skills)
          ? savedProfile.skills
          : typeof savedProfile.skills === "string"
            ? savedProfile.skills.split(",").map(skill => skill.trim()).filter(Boolean)
            : [];

        // Load career recommendations
        if (skills.length > 0) {
          const response = await fetch(`${API_URL}/recommend`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ skills })
          });

          if (!response.ok) {
            throw new Error("Could not load career recommendations.");
          }

          const data = await response.json();

          setRecommendations(data.recommendations || []);
          setTotalCareers(
            data.total_careers_evaluated ??
            data.totalCareersEvaluated ??
            (data.recommendations || []).length
          );
        } else {
          setRecommendations([]);
          setTotalCareers(0);
        }

      } catch (err) {
        setError(
          "Unable to load dashboard recommendations. Please check your backend connection."
        );
      } finally {
        setLoading(false);
      }

      // Load learning progress from SQLite
      try {
        const email = savedProfile.email;

        if (!email) {
          throw new Error("Student email is not available.");
        }

        const response = await fetch(
          `${API_URL}/progress/${encodeURIComponent(email)}`
        );

        if (!response.ok) {
          throw new Error("Could not load saved learning progress.");
        }

        const data = await response.json();

        const savedCompletedSkills = Array.isArray(data)
          ? data
          : data.completed_skills ||
            data.completedSkills ||
            data.skills ||
            [];

        const normalizedSkills = savedCompletedSkills.map(skill =>
          typeof skill === "string" ? skill : skill.skill_name
        ).filter(Boolean);

        setCompletedSkills(normalizedSkills);

        localStorage.setItem(
          "skillbridge-completed-skills",
          JSON.stringify(normalizedSkills)
        );

        setProgressMessage("Learning progress synced successfully.");

      } catch (err) {
        const cachedSkills = JSON.parse(
          localStorage.getItem("skillbridge-completed-skills") || "[]"
        );

        setCompletedSkills(cachedSkills);
        setProgressMessage(
          "Showing locally saved learning progress. SQLite sync is unavailable."
        );
      } finally {
        setProgressLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const skills = Array.isArray(profile.skills)
    ? profile.skills
    : typeof profile.skills === "string"
      ? profile.skills.split(",").map(skill => skill.trim()).filter(Boolean)
      : [];

  const averageCoverage = recommendations.length
    ? Math.round(
        recommendations.reduce(
          (total, item) => total + item.match_percentage,
          0
        ) / recommendations.length
      )
    : 0;

  return (
    <div className="dashboard-page">

      <nav className="dashboard-nav">
        <h2>SkillBridge<span>AI</span></h2>
        <button onClick={onBack}>← Back to Home</button>
      </nav>

      <main className="dashboard-container">

        <div className="dashboard-heading">
          <div>
            <p className="dashboard-label">STUDENT OVERVIEW</p>
            <h1>
              Welcome{profile.name ? `, ${profile.name}` : " to SkillBridge AI"}!
            </h1>
            <p>
              Track your skills, explore career paths, and plan your next step.
            </p>
          </div>

          <button onClick={onOpenProfile}>
            Edit Profile
          </button>
        </div>

        <section className="dashboard-stats">

          <article className="dashboard-stat-card">
            <span>Technical Skills</span>
            <strong>{skills.length}</strong>
            <p>Skills in your profile</p>
          </article>

          <article className="dashboard-stat-card">
            <span>Careers Analyzed</span>
            <strong>{loading ? "..." : totalCareers}</strong>
            <p>Total career paths evaluated</p>
          </article>

          <article className="dashboard-stat-card">
            <span>Average Skill Coverage</span>
            <strong>{loading ? "..." : `${averageCoverage}%`}</strong>
            <p>Across displayed recommendations</p>
          </article>

        </section>

        {/* LEARNING PROGRESS SECTION */}

        <section className="dashboard-section">

          <div className="dashboard-section-heading">
            <div>
              <p className="dashboard-label">YOUR LEARNING JOURNEY</p>
              <h2>Learning Progress</h2>
            </div>

            <button onClick={onOpenRoadmap}>
              Open Skill Roadmap →
            </button>
          </div>

          <div className="dashboard-stat-card">
            <span>Completed Learning Skills</span>

            <strong>
              {progressLoading ? "..." : completedSkills.length}
            </strong>

            <p>
              Skills successfully saved in your learning progress
            </p>

            {progressMessage && (
              <p className="dashboard-message">
                {progressMessage}
              </p>
            )}

            {!progressLoading && completedSkills.length > 0 ? (
              <div className="dashboard-completed-skills">
                {completedSkills.map(skill => (
                  <span key={skill}>✓ {skill}</span>
                ))}
              </div>
            ) : !progressLoading ? (
              <p>No learning skills completed yet. Start your roadmap!</p>
            ) : null}
          </div>

        </section>

        <section className="dashboard-section">

          <div className="dashboard-section-heading">
            <div>
              <p className="dashboard-label">CAREER INSIGHTS</p>
              <h2>Your Recommended Careers</h2>
            </div>

            <button onClick={onOpenMatches}>
              Explore All Results →
            </button>
          </div>

          {loading ? (
            <p className="dashboard-message">
              Analyzing your skills...
            </p>
          ) : error ? (
            <p className="dashboard-error">{error}</p>
          ) : recommendations.length === 0 ? (
            <div className="dashboard-empty">
              <h3>Start with your skills</h3>
              <p>
                Add technical skills to your profile to receive career recommendations.
              </p>
              <button onClick={onOpenProfile}>
                Complete Your Profile
              </button>
            </div>
          ) : (

            <div className="dashboard-career-grid">

              {recommendations.map((item, index) => (
                <article
                  className="dashboard-career-card"
                  key={item.career_role}
                >
                  <span>#{index + 1} Career Match</span>

                  <h3>{item.career_role}</h3>

                  <strong>{item.match_percentage}%</strong>

                  <div className="dashboard-progress">
                    <div
                      style={{
                        width: `${item.match_percentage}%`
                      }}
                    />
                  </div>

                  <p>
                    {item.matched_skill_count} of{" "}
                    {item.total_required_skills} listed skills matched
                  </p>
                </article>
              ))}

            </div>
          )}

        </section>

        <section className="dashboard-section">
          <p className="dashboard-label">YOUR NEXT STEPS</p>
          <h2>Continue Your Career Journey</h2>

          <div className="dashboard-actions">

            <button onClick={onOpenMatches}>
              <strong>Explore Opportunities</strong>
              <span>Find opportunities matching your skills</span>
            </button>

            <button onClick={onOpenRoadmap}>
              <strong>Build Your Skill Roadmap</strong>
              <span>Discover skills to learn next</span>
            </button>

            <button onClick={onOpenAssistant}>
              <strong>Ask Career Assistant</strong>
              <span>Get career and interview guidance</span>
            </button>

          </div>
        </section>

        <p className="dashboard-disclaimer">
          Career recommendations are based on rule-based skill comparison.
          Skill coverage does not represent verified proficiency or hiring probability.
        </p>

      </main>
    </div>
  );
}

export default Dashboard;
