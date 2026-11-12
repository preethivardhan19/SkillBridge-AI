
import { useState, useEffect } from "react";
import "./SkillRoadmap.css";
import API_URL from "./api";

const careerSkills = {
  "Data Analyst": [
    "Python", "SQL", "Excel", "Power BI", "Statistics"
  ],
  "Data Scientist": [
    "Python", "SQL", "Statistics", "Machine Learning", "Pandas", "NumPy"
  ],
  "AI/ML Engineer": [
    "Python", "Machine Learning", "Deep Learning", "NLP", "TensorFlow", "FastAPI"
  ],
  "Software Developer": [
    "Python", "Java", "SQL", "Git", "REST API", "Data Structures"
  ],
  "Cloud Engineer": [
    "Python", "Linux", "AWS", "Networking", "Docker", "SQL"
  ],
  "Product Manager": [
    "Communication", "SQL", "Excel", "Problem Solving", "Product Strategy"
  ]
};

const learningResources = {
  "Python": {
    title: "Python Official Tutorial",
    url: "https://docs.python.org/3/tutorial/"
  },
  "SQL": {
    title: "SQLBolt - Interactive SQL Lessons",
    url: "https://sqlbolt.com/"
  },
  "Excel": {
    title: "Microsoft Excel Training",
    url: "https://support.microsoft.com/excel"
  },
  "Power BI": {
    title: "Microsoft Learn - Power BI",
    url: "https://learn.microsoft.com/training/powerplatform/power-bi/"
  },
  "Statistics": {
    title: "Khan Academy - Statistics",
    url: "https://www.khanacademy.org/math/statistics-probability"
  },
  "Machine Learning": {
    title: "Google Machine Learning Crash Course",
    url: "https://developers.google.com/machine-learning/crash-course"
  },
  "Pandas": {
    title: "Pandas Getting Started Tutorials",
    url: "https://pandas.pydata.org/docs/getting_started/intro_tutorials/"
  },
  "NumPy": {
    title: "NumPy Learn",
    url: "https://numpy.org/learn/"
  },
  "Deep Learning": {
    title: "PyTorch Tutorials",
    url: "https://pytorch.org/tutorials/"
  },
  "NLP": {
    title: "Hugging Face NLP Course",
    url: "https://huggingface.co/learn/nlp-course"
  },
  "TensorFlow": {
    title: "TensorFlow Tutorials",
    url: "https://www.tensorflow.org/tutorials"
  },
  "FastAPI": {
    title: "FastAPI Official Tutorial",
    url: "https://fastapi.tiangolo.com/tutorial/"
  },
  "Java": {
    title: "Java Official Learning Resources",
    url: "https://dev.java/learn/"
  },
  "Git": {
    title: "Git Official Documentation",
    url: "https://git-scm.com/doc"
  },
  "REST API": {
    title: "MDN - REST",
    url: "https://developer.mozilla.org/en-US/docs/Glossary/REST"
  },
  "Data Structures": {
    title: "GeeksforGeeks - Data Structures",
    url: "https://www.geeksforgeeks.org/data-structures/"
  },
  "Linux": {
    title: "Linux Journey",
    url: "https://linuxjourney.com/"
  },
  "AWS": {
    title: "AWS Skill Builder",
    url: "https://skillbuilder.aws/"
  },
  "Networking": {
    title: "Cisco Skills for All",
    url: "https://skillsforall.com/"
  },
  "Docker": {
    title: "Docker Getting Started",
    url: "https://docs.docker.com/get-started/"
  },
  "Communication": {
    title: "Toastmasters Resources",
    url: "https://www.toastmasters.org/resources"
  },
  "Problem Solving": {
    title: "Khan Academy - Algorithms",
    url: "https://www.khanacademy.org/computing/computer-science/algorithms"
  },
  "Product Strategy": {
    title: "Atlassian - Product Management",
    url: "https://www.atlassian.com/agile/product-management"
  }
};


function SkillRoadmap({ onBack }) {


  const [savedProfile] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("skillbridge-profile") || "{}"
      );
    } catch {
      return {};
    }
  });

  const studentEmail = savedProfile.email || "";

  const [role, setRole] = useState(() => {
    const savedRole =
      savedProfile.preferredRole || savedProfile.role;

    return careerSkills[savedRole] ? savedRole : "Data Analyst";
  });

  const [skills, setSkills] = useState(() => {
    if (Array.isArray(savedProfile.skills)) {
      return savedProfile.skills.join(", ");
    }

    if (typeof savedProfile.skills === "string") {
      return savedProfile.skills;
    }

    return "";
  });

  const [analyzed, setAnalyzed] = useState(false);

  const [completedSkills, setCompletedSkills] = useState(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("skillbridge-completed-skills") || "[]"
      );

      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  });

  const [progressLoading, setProgressLoading] = useState(true);
  const [savingSkill, setSavingSkill] = useState("");
  const [progressMessage, setProgressMessage] = useState("");

  // --------------------------------------------------
  // LOAD LEARNING PROGRESS FROM SQLITE
  // --------------------------------------------------

  useEffect(() => {

    async function loadProgress() {

      if (!studentEmail) {
        setProgressLoading(false);
        setProgressMessage(
          "Save your student profile to sync learning progress."
        );
        return;
      }

      try {

        const response = await fetch(
          `${API_URL}/progress/${encodeURIComponent(studentEmail)}`
        );

        if (!response.ok) {
          throw new Error("Unable to retrieve saved learning progress.");
        }

        const data = await response.json();

        const savedSkills = data.completed_skills || [];

        setCompletedSkills(savedSkills);

        localStorage.setItem(
          "skillbridge-completed-skills",
          JSON.stringify(savedSkills)
        );

        setProgressMessage("Learning progress synced successfully.");

      } catch (error) {

        console.error("Progress loading error:", error);

        setProgressMessage(
          "Could not sync with the database. Showing locally saved progress."
        );

      } finally {
        setProgressLoading(false);
      }
    }

    loadProgress();

  }, [studentEmail]);

  // --------------------------------------------------
  // SKILL ANALYSIS
  // --------------------------------------------------

  const studentSkills = skills
    .split(",")
    .map(skill => skill.trim().toLowerCase())
    .filter(Boolean);

  const requiredSkills = careerSkills[role] || [];

  const matched = requiredSkills.filter(skill =>
    studentSkills.includes(skill.toLowerCase())
  );

  const missing = requiredSkills.filter(skill =>
    !studentSkills.includes(skill.toLowerCase())
  );

  const remainingSkills = missing.filter(
    skill => !completedSkills.includes(skill)
  );

  const completedCount = requiredSkills.filter(skill =>
    studentSkills.includes(skill.toLowerCase()) ||
    completedSkills.includes(skill)
  ).length;

  const skillMatchPercentage = requiredSkills.length
    ? Math.round((matched.length / requiredSkills.length) * 100)
    : 0;

  const learningProgress = requiredSkills.length
    ? Math.round((completedCount / requiredSkills.length) * 100)
    : 0;

  // --------------------------------------------------
  // SAVE OR UNDO LEARNING PROGRESS
  // --------------------------------------------------

  async function toggleSkill(skill) {

    if (savingSkill) return;

    const wasCompleted = completedSkills.includes(skill);

    const updatedSkills = wasCompleted
      ? completedSkills.filter(item => item !== skill)
      : [...completedSkills, skill];

    const previousSkills = [...completedSkills];

    // Update the interface immediately.
    setCompletedSkills(updatedSkills);

    localStorage.setItem(
      "skillbridge-completed-skills",
      JSON.stringify(updatedSkills)
    );

    if (!studentEmail) {
      setProgressMessage(
        "Please save your student profile to sync progress with SQLite."
      );
      return;
    }

    setSavingSkill(skill);
    setProgressMessage("");

    try {

      const response = await fetch(`${API_URL}/progress`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: studentEmail,
          skill_name: skill,
          completed: !wasCompleted
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || "Unable to save learning progress."
        );
      }

      setProgressMessage(
        wasCompleted
          ? `${skill} marked as incomplete.`
          : `${skill} saved successfully to SQLite!`
      );

    } catch (error) {

      console.error("Progress saving error:", error);

      // Restore the previous state if database saving fails.
      setCompletedSkills(previousSkills);

      localStorage.setItem(
        "skillbridge-completed-skills",
        JSON.stringify(previousSkills)
      );

      setProgressMessage(error.message);

    } finally {
      setSavingSkill("");
    }
  }

  // --------------------------------------------------
  // USER INTERFACE
  // --------------------------------------------------

  return (
    <div className="roadmap-page">

      <nav className="roadmap-nav">
        <h2>SkillBridge<span>AI</span></h2>
        <button onClick={onBack}>← Back to Home</button>
      </nav>

      <main className="roadmap-container">

        <p className="roadmap-label">CAREER DEVELOPMENT</p>

        <h1>Skill Gap Analysis</h1>

        <p className="roadmap-subtitle">
          Discover your missing skills and build a learning roadmap.
        </p>

        <div className="roadmap-form">

          <label>Preferred Career Role</label>

          <select
            value={role}
            onChange={e => {
              setRole(e.target.value);
              setAnalyzed(false);
            }}
          >
            {Object.keys(careerSkills).map(item => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <label>Your Technical Skills</label>

          <textarea
            value={skills}
            onChange={e => {
              setSkills(e.target.value);
              setAnalyzed(false);
            }}
            placeholder="Example: Python, SQL, Excel"
            rows="4"
          />

          <button
            onClick={() => setAnalyzed(true)}
            disabled={!skills.trim()}
          >
            Analyze My Skills →
          </button>

        </div>

        {progressLoading && (
          <p>Loading your saved learning progress...</p>
        )}

        {progressMessage && (
          <p role="status">
            {progressMessage}
          </p>
        )}

        {analyzed && (
          <section className="roadmap-results">

            <h2>Your Career Readiness</h2>

            <div className="readiness-score">
              {skillMatchPercentage}% Skill Match
            </div>

            <p>
              You currently have {matched.length} out of{" "}
              {requiredSkills.length} required skills.
            </p>

            <div className="progress-tracker">

              <div className="progress-heading">
                <strong>Learning Progress</strong>
                <strong>{learningProgress}%</strong>
              </div>

              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{ width: `${learningProgress}%` }}
                />
              </div>

              <p>
                {completedCount} of {requiredSkills.length} skills completed
              </p>

            </div>

            <h3>Skills You Already Have</h3>

            <div className="skill-list">
              {matched.length > 0 ? (
                matched.map(skill => (
                  <span className="matched-skill" key={skill}>
                    ✓ {skill}
                  </span>
                ))
              ) : (
                <p>No matching skills yet.</p>
              )}
            </div>

            <h3>Skills You Need to Learn</h3>

            <div className="skill-list">
              {remainingSkills.length > 0 ? (
                remainingSkills.map(skill => (
                  <span className="missing-skill" key={skill}>
                    + {skill}
                  </span>
                ))
              ) : (
                <p>Great! You have completed all the required skills.</p>
              )}
            </div>

            <h3>Recommended Learning Roadmap</h3>

            {remainingSkills.length > 0 ? (
              <ol className="learning-roadmap">

                {remainingSkills.map((skill, index) => (
                  <li key={skill}>

                    <strong>
                      Step {index + 1}: {skill}
                    </strong>

                    <p>
                      Learn the fundamentals and practise with a small project.
                    </p>

                    <button
                      className="complete-skill-btn"
                      onClick={() => toggleSkill(skill)}
                      disabled={savingSkill !== ""}
                    >
                      {savingSkill === skill
                        ? "Saving..."
                        : "Mark as Completed"}
                    </button>

                  </li>
                ))}

              </ol>
            ) : (
              <p>You have completed all the learning steps for this role!</p>
            )}

            {completedSkills.some(skill =>
              requiredSkills.includes(skill)
            ) && (
              <>
                <h3>Completed Learning Skills</h3>

                <div className="skill-list">

                  {requiredSkills
                    .filter(skill => completedSkills.includes(skill))
                    .map(skill => (
                      <span className="matched-skill" key={skill}>
                        ✓ {skill}

                        <button
                          className="undo-skill-btn"
                          onClick={() => toggleSkill(skill)}
                          disabled={savingSkill !== ""}
                        >
                          {savingSkill === skill ? "Saving..." : "Undo"}
                        </button>

                      </span>
                    ))}

                </div>
              </>
            )}

            <h3>Recommended Learning Resources</h3>

            <div className="resource-grid">

              {remainingSkills.length > 0 ? (
                remainingSkills.map(skill => {

                  const resource = learningResources[skill];

                  const learningUrl = resource
                    ? resource.url
                    : `https://www.google.com/search?q=${encodeURIComponent(
                        skill + " beginner tutorial"
                      )}`;

                  return (
                    <article className="resource-card" key={skill}>

                      <h4>{skill}</h4>

                      <p>
                        {resource
                          ? resource.title
                          : "Search for beginner learning materials"}
                      </p>

                      <a
                        href={learningUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Start Learning →
                      </a>

                    </article>
                  );
                })
              ) : (
                <p>No additional learning resources needed right now.</p>
              )}

            </div>

          </section>
        )}

      </main>
    </div>
  );
}

export default SkillRoadmap;
