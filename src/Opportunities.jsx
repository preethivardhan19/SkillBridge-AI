import { useState } from "react";
import "./Opportunities.css";
import API_URL from "./api";

function Opportunities({ onBack }) {
  const savedProfile = (() => {
    try {
      return JSON.parse(
        localStorage.getItem("skillbridge-profile") || "{}"
      );
    } catch {
      return {};
    }
  })();

  const savedSkills = Array.isArray(savedProfile.skills)
    ? savedProfile.skills.join(", ")
    : savedProfile.skills || "";

  const [skills, setSkills] = useState(savedSkills);

  const [role, setRole] = useState(
    savedProfile.preferredRole || savedProfile.role || "Any"
  );

  const [matches, setMatches] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  async function findMatches(e) {
    e.preventDefault();

    const skillList = skills
      .split(",")
      .map(skill => skill.trim())
      .filter(Boolean);

    if (skillList.length === 0) {
      setError("Please enter at least one skill.");
      return;
    }

    setLoading(true);
    setError("");
    setSearched(false);

    try {
      const [matchResponse, recommendationResponse] =
        await Promise.all([
          fetch(`${API_URL}/match`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              skills: skillList,
              preferred_role: role
            })
          }),

          fetch(`${API_URL}/recommend`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              skills: skillList
            })
          })
        ]);

      if (!matchResponse.ok || !recommendationResponse.ok) {
        throw new Error("Unable to generate career results.");
      }

      const matchData = await matchResponse.json();
      const recommendationData =
        await recommendationResponse.json();

      setMatches(matchData.matches || []);
      setRecommendations(
        recommendationData.recommendations || []
      );

      setSearched(true);

    } catch (err) {
      setError(
        "Could not connect to the backend. Please check that your Python server is running and both API endpoints are available."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="opportunities-page">

      <nav className="opportunities-nav">
        <h2>SkillBridge<span>AI</span></h2>
        <button onClick={onBack}>← Back to Home</button>
      </nav>

      <main className="opportunities-container">

        <p className="opportunity-label">
          PERSONALIZED CAREER DISCOVERY
        </p>

        <h1>Find Opportunities That Match You</h1>

        <p className="opportunity-description">
          Enter your skills and preferred role. Discover suitable
          career paths and sample opportunities based on your skills.
        </p>

        <form className="match-form" onSubmit={findMatches}>

          <label>Your Technical Skills</label>

          <textarea
            value={skills}
            onChange={e => setSkills(e.target.value)}
            placeholder="Python, SQL, Machine Learning, Power BI..."
            rows="4"
            required
          />

          <label>Preferred Career Role</label>

          <select
            value={role}
            onChange={e => setRole(e.target.value)}
          >
            <option>Any</option>
            <option>Data Analyst</option>
            <option>Data Scientist</option>
            <option>AI/ML Engineer</option>
            <option>Software Developer</option>
            <option>Cloud Engineer</option>
            <option>Product Manager</option>
          </select>

          <button type="submit" disabled={loading}>
            {loading
              ? "Analyzing Your Skills..."
              : "Find My Opportunities →"}
          </button>

        </form>

        {error && (
          <p className="match-error">{error}</p>
        )}

        {searched && (
          <>

            {/* CAREER RECOMMENDATIONS */}

            <section className="career-recommendations">

              <div className="results-heading">
                <p className="opportunity-label">
                  CAREER INTELLIGENCE
                </p>

                <h2>Recommended Career Paths</h2>

                <p>
                  These careers are ranked according to how closely
                  your current skills match their listed requirements.
                </p>

              </div>

              {recommendations.length === 0 ? (
                <p>
                  No career recommendations available yet.
                </p>
              ) : (

                <div className="recommendation-grid">

                  {recommendations.map((item, index) => (

                    <article
                      className="recommendation-card"
                      key={item.career_role}
                    >

                      <span className="recommendation-rank">
                        #{index + 1} Recommended Career
                      </span>

                      <h3>{item.career_role}</h3>

                      <div className="recommendation-score">
                        <strong>
                          {item.match_percentage}%
                        </strong>

                        <span>Skill coverage</span>
                      </div>

                      <div className="score-track">
                        <div
                          className="score-fill"
                          style={{
                            width: `${item.match_percentage}%`
                          }}
                        />
                      </div>

                      <p className="recommendation-explanation">
                        {item.explanation}
                      </p>

                      <div className="skill-columns">

                        <div>
                          <h4>✓ Your Matching Skills</h4>

                          <p>
                            {item.matched_skills.length
                              ? item.matched_skills.join(", ")
                              : "No matching skills yet"}
                          </p>
                        </div>

                        <div>
                          <h4>＋ Skills to Learn</h4>

                          <p>
                            {item.missing_skills.length
                              ? item.missing_skills.join(", ")
                              : "You cover all listed skills"}
                          </p>
                        </div>

                      </div>

                    </article>

                  ))}

                </div>

              )}

              <p className="recommendation-note">
                These recommendations use rule-based skill comparison.
                Percentages represent coverage of listed skills,
                not job selection probability or verified proficiency.
              </p>

            </section>

            {/* OPPORTUNITY MATCHING */}

            <section className="match-results">

              <div className="results-heading">

                <p className="opportunity-label">
                  YOUR OPPORTUNITY RESULTS
                </p>

                <h2>
                  {matches.length} Opportunities Found
                </h2>

                <p>
                  Ranked by role relevance and skill match.
                </p>

              </div>

              {matches.length === 0 ? (
                <p>
                  No matching sample opportunities found for
                  your current selection.
                </p>
              ) : (

                matches.map(item => (

                  <article
                    className="opportunity-card"
                    key={item.id}
                  >

                    <div className="opportunity-card-top">

                      <div>
                        <span className="job-type">
                          {item.type}
                        </span>

                        <h3>{item.title}</h3>

                        <p>
                          {item.company} · {item.location}
                        </p>
                      </div>

                      <div className="match-score">
                        <strong>
                          {item.match_percentage}%
                        </strong>

                        <span>Skill match</span>
                      </div>

                    </div>

                    <div className="score-track">
                      <div
                        className="score-fill"
                        style={{
                          width: `${item.match_percentage}%`
                        }}
                      />
                    </div>

                    <div className="skill-columns">

                      <div>
                        <h4>✓ Matching skills</h4>

                        <p>
                          {item.matched_skills.length
                            ? item.matched_skills.join(", ")
                            : "No matching skills yet"}
                        </p>
                      </div>

                      <div>
                        <h4>＋ Skills to develop</h4>

                        <p>
                          {item.missing_skills.length
                            ? item.missing_skills.join(", ")
                            : "No missing skills"}
                        </p>
                      </div>

                    </div>

                    {!item.role_match && (
                      <p className="role-note">
                        This opportunity is outside your selected role.
                      </p>
                    )}

                  </article>

                ))

              )}

            </section>

          </>
        )}

        <p className="demo-note">
          Prototype notice: These are sample opportunities for
          demonstration, not verified or live job listings.
          Match percentages are based on skill overlap,
          not hiring probability.
        </p>

      </main>

    </div>
  );
}

export default Opportunities;