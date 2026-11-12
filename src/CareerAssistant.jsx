
import { useEffect, useRef, useState } from "react";
import "./CareerAssistant.css";
import API_URL from "./api";

const initialMessage = {
  sender: "assistant",
  text: "Hello! I'm your SkillBridge Career Assistant. Ask me about career choices, technical skills, interviews, or resumes."
};

const suggestedQuestions = [
  "How do I prepare for a Data Analyst interview?",
  "Which skills should I learn for AI/ML?",
  "How can I improve my resume?",
  "Which career matches my skills?"
];

function CareerAssistant({ onBack }) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState(() => {
  try {
    const savedMessages = JSON.parse(
      localStorage.getItem("skillbridge-chat-history") || "null"
    );

    return Array.isArray(savedMessages) && savedMessages.length > 0
      ? savedMessages
      : [initialMessage];
  } catch {
    return [initialMessage];
  }
});
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages, loading]);
  useEffect(() => {
  try {
    localStorage.setItem(
      "skillbridge-chat-history",
      JSON.stringify(messages)
    );
  } catch (error) {
    console.error("Unable to save chat history:", error);
  }
}, [messages]);

  const sendMessage = async (e, selectedQuestion) => {
    e?.preventDefault();

    const userQuestion = (selectedQuestion || question).trim();

    if (!userQuestion || loading) return;

    setMessages((previous) => [
      ...previous,
      { sender: "user", text: userQuestion }
    ]);

    setQuestion("");
    setLoading(true);

    try {
      const savedProfile = JSON.parse(
        localStorage.getItem("skillbridge-profile") || "{}"
      );

      const profileSkills = Array.isArray(savedProfile.skills)
        ? savedProfile.skills
        : typeof savedProfile.skills === "string"
          ? savedProfile.skills.split(",").map((skill) => skill.trim())
          : [];

      const response = await fetch(
        `${API_URL}/assistant`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            question: userQuestion,
            skills: profileSkills,
            preferred_role: savedProfile.preferredRole || "Any"
          })
        }
      );

      if (!response.ok) {
        throw new Error("Assistant request failed.");
      }

      const data = await response.json();

      const showAnalysis =
        /skill|career match|match my|missing|gap|roadmap|learn next|suitable career/i.test(
          userQuestion
        );

      setMessages((previous) => [
        ...previous,
        {
          sender: "assistant",
          text: data.answer || "I couldn't generate a response.",
          analysis:
            showAnalysis &&
            data.career_role &&
            data.career_role !== "Any" &&
            typeof data.skill_match_percentage === "number"
              ? {
                  careerRole: data.career_role,
                  matchPercentage: data.skill_match_percentage,
                  matchedSkills: data.matched_skills || [],
                  missingSkills: data.missing_skills || []
                }
              : null
        }
      ]);
    } catch (error) {
      setMessages((previous) => [
        ...previous,
        {
          sender: "assistant",
          text: "Unable to connect to the assistant. Please check your backend server and try again.",
          isError: true,
          failedQuestion: userQuestion
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    if (loading) return;

    setMessages([initialMessage]);
    setQuestion("");
  };

  return (
    <div className="career-assistant-page">
      <nav className="assistant-nav">
        <h2>SkillBridge AI</h2>
        <button onClick={onBack}>Back to Home</button>
      </nav>

      <main className="assistant-container">
        <div className="assistant-heading">
          <h1>AI Career Assistant</h1>
          <p>
            Your personal guide for skills, careers, and interview preparation.
          </p>
        </div>

        <div className="chat-box">
          <div className="chat-toolbar">
            <h3>Career Chat</h3>

            <button
              className="clear-chat-btn"
              onClick={clearChat}
              disabled={loading || messages.length === 1}
            >
              Clear Chat
            </button>
          </div>

          <div className="chat-messages">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`chat-message ${message.sender}`}
              >
                <span>
                  {message.sender === "user"
                    ? "You"
                    : "Career Assistant"}
                </span>

                <p>{message.text}</p>

                {message.isError && (
                  <button
                    className="retry-button"
                    onClick={() =>
                      sendMessage(null, message.failedQuestion)
                    }
                    disabled={loading}
                  >
                    ↻ Retry
                  </button>
                )}

                {message.analysis && (
                  <div className="skill-analysis-card">
                    <h3>
                      {message.analysis.careerRole} Skill Analysis
                    </h3>

                    <div className="analysis-score">
                      <span>Skill Match</span>
                      <strong>
                        {message.analysis.matchPercentage}%
                      </strong>
                    </div>

                    <div className="progress-track">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.max(
                              0,
                              message.analysis.matchPercentage
                            )
                          )}%`
                        }}
                      />
                    </div>

                    <div className="analysis-skills">
                      <div>
                        <h4>Matched Skills</h4>

                        <div className="skill-tags">
                          {message.analysis.matchedSkills.map((skill) => (
                            <span className="matched-tag" key={skill}>
                              {skill}
                            </span>
                          ))}

                          {message.analysis.matchedSkills.length === 0 && (
                            <span>No matched skills yet.</span>
                          )}
                        </div>
                      </div>

                      <div>
                        <h4>Skills to Learn</h4>

                        <div className="skill-tags">
                          {message.analysis.missingSkills.map((skill) => (
                            <span className="missing-tag" key={skill}>
                              {skill}
                            </span>
                          ))}

                          {message.analysis.missingSkills.length === 0 && (
                            <span>No missing skills.</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <p className="analysis-note">
                      This percentage represents skill coverage against
                      the selected career's skill requirements. It is not
                      a hiring probability.
                    </p>
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="chat-message assistant typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {messages.length === 1 && (
            <div className="suggested-questions">
              <h4>Try asking</h4>

              <div className="suggestion-list">
                {suggestedQuestions.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => sendMessage(null, item)}
                    disabled={loading}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}

          <form
            className="chat-input-area"
            onSubmit={sendMessage}
          >
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask your career-related question..."
              disabled={loading}
            />

            <button
              type="submit"
              disabled={loading || !question.trim()}
            >
              {loading ? "Sending..." : "Send"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default CareerAssistant;
