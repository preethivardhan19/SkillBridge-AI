import { useState } from "react";
import Profile from "./Profile";
import Opportunities from "./Opportunities";
import SkillRoadmap from "./SkillRoadmap";
import CareerAssistant from "./CareerAssistant";
import Dashboard from "./Dashboard";
import "./App.css";

function App() {
  const [search, setSearch] = useState("");
  const [showDashboard, setShowDashboard] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showMatches, setShowMatches] = useState(false);
  const [showRoadmap, setShowRoadmap] = useState(false);
  const [showAssistant, setShowAssistant] = useState(false);

  if (showDashboard) {
    return (
      <Dashboard
        onBack={() => setShowDashboard(false)}
        onOpenProfile={() => {
          setShowDashboard(false);
          setShowProfile(true);
        }}
        onOpenMatches={() => {
          setShowDashboard(false);
          setShowMatches(true);
        }}
        onOpenRoadmap={() => {
          setShowDashboard(false);
          setShowRoadmap(true);
        }}
        onOpenAssistant={() => {
          setShowDashboard(false);
          setShowAssistant(true);
        }}
      />
    );
  }

  if (showProfile) {
    return <Profile onBack={() => setShowProfile(false)} />;
  }

  if (showMatches) {
    return <Opportunities onBack={() => setShowMatches(false)} />;
  }

  if (showRoadmap) {
    return <SkillRoadmap onBack={() => setShowRoadmap(false)} />;
  }

  if (showAssistant) {
    return <CareerAssistant onBack={() => setShowAssistant(false)} />;
  }

  return (
    <div className="app">

      <nav className="navbar">
        <div className="logo">SkillBridge AI</div>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#opportunities">Opportunities</a>
          <a href="#about">About</a>
        </div>

        <div className="nav-actions">

          <button onClick={() => setShowDashboard(true)}>
            Dashboard
          </button>

          <button onClick={() => setShowProfile(true)}>
            Get Started
          </button>

          <button onClick={() => setShowMatches(true)}>
            Explore Matches
          </button>

          <button onClick={() => setShowRoadmap(true)}>
            Skill Roadmap
          </button>

          <button onClick={() => setShowAssistant(true)}>
            Career Assistant
          </button>

        </div>
      </nav>

      
<section className="hero" id="home">
  <div className="hero-content">

    <div className="hero-badge">
      ✦ AI-POWERED CAREER INTELLIGENCE
    </div>

    <h1>
      Turn Your Skills Into
      <span> Career Opportunities.</span>
    </h1>

    <p>
      Discover your strengths, identify skill gaps, and build
      a personalized career roadmap with SkillBridge AI.
    </p>

    <div className="search-box">
      <input
        type="text"
        placeholder="Search careers or skills..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <button onClick={() => setShowMatches(true)}>
        Explore Careers →
      </button>
    </div>

    <div className="hero-buttons">
      <button
        className="primary-btn"
        onClick={() => setShowProfile(true)}
      >
        Create Your Profile →
      </button>

      <button
        className="secondary-btn"
        onClick={() => setShowDashboard(true)}
      >
        View Dashboard
      </button>
    </div>

    <div className="hero-trust">
      <span>✓ Personalized guidance</span>
      <span>✓ Skill gap analysis</span>
      <span>✓ Career recommendations</span>
    </div>

  </div>

  <div className="hero-visual">

    <div className="visual-orbit orbit-one"></div>
    <div className="visual-orbit orbit-two"></div>

    <div className="ai-core">
      <div className="ai-core-inner">
        <span>✦</span>
        <strong>AI</strong>
        <small>CAREER INTELLIGENCE</small>
      </div>
    </div>

    <div className="floating-card floating-card-top">
      <span>✦</span>
      <div>
        <strong>Career Match</strong>
        <small>Personalized opportunities</small>
      </div>
    </div>

    <div className="floating-card floating-card-bottom">
      <span>↗</span>
      <div>
        <strong>Skill Growth</strong>
        <small>Your learning journey</small>
      </div>
    </div>

    <div className="visual-caption">
      <span className="live-dot"></span>
      Intelligent career discovery
    </div>

  </div>
</section>


      <section className="features" id="opportunities">

        <h2>Explore SkillBridge AI</h2>

        <div className="feature-container">

          <div className="feature-card">
            <h3>Smart Opportunity Matching</h3>
            <p>
              Discover opportunities based on your skills and career interests.
            </p>
            <button onClick={() => setShowMatches(true)}>
              Explore Matches
            </button>
          </div>

          <div className="feature-card">
            <h3>Skill Gap Analysis</h3>
            <p>
              Identify missing skills and understand what you need to learn.
            </p>
            <button onClick={() => setShowRoadmap(true)}>
              View Roadmap
            </button>
          </div>

          <div className="feature-card">
            <h3>AI Career Assistant</h3>
            <p>
              Get guidance on career choices, technical skills, resumes,
              and interview preparation.
            </p>
            <button onClick={() => setShowAssistant(true)}>
              Chat Now
            </button>
          </div>

        </div>
      </section>

      <section className="about" id="about">
        <h2>About SkillBridge AI</h2>
        <p>
          Our goal is to help students connect their skills with career
          opportunities through personalized guidance and learning.
        </p>
      </section>

      <footer>
        <p>© 2026 SkillBridge AI. All Rights Reserved.</p>
      </footer>

    </div>
  );
}

export default App;