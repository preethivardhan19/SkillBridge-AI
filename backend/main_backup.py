
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field


# --------------------------------------------------
# APPLICATION CONFIGURATION
# --------------------------------------------------

app = FastAPI(
    title="SkillBridge AI",
    description="Career guidance and opportunity matching platform",
    version="1.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------
# CAREER SKILL DATABASE
# --------------------------------------------------

CAREER_SKILLS = {
    "Data Analyst": [
        "python",
        "sql",
        "excel",
        "power bi",
        "statistics"
    ],
    "Data Scientist": [
        "python",
        "sql",
        "statistics",
        "machine learning",
        "pandas",
        "numpy"
    ],
    "AI/ML Engineer": [
        "python",
        "machine learning",
        "deep learning",
        "nlp",
        "tensorflow",
        "fastapi"
    ],
    "Software Developer": [
        "python",
        "java",
        "sql",
        "git",
        "rest api",
        "data structures"
    ],
    "Cloud Engineer": [
        "python",
        "linux",
        "aws",
        "networking",
        "docker",
        "sql"
    ],
    "Product Manager": [
        "communication",
        "sql",
        "excel",
        "problem solving",
        "product strategy"
    ]
}


# --------------------------------------------------
# SAMPLE OPPORTUNITY DATABASE
# Demonstration records, not live job listings.
# --------------------------------------------------

opportunities = [
    {
        "id": 1,
        "title": "Data Analyst Intern",
        "company": "SkillBridge Demo",
        "role": "Data Analyst",
        "type": "Internship",
        "location": "Remote",
        "skills": ["python", "sql", "excel", "power bi", "statistics"]
    },
    {
        "id": 2,
        "title": "Junior Machine Learning Intern",
        "company": "SkillBridge Demo",
        "role": "AI/ML Engineer",
        "type": "Internship",
        "location": "Bengaluru",
        "skills": ["python", "machine learning", "pandas", "numpy", "statistics"]
    },
    {
        "id": 3,
        "title": "Python Developer Trainee",
        "company": "SkillBridge Demo",
        "role": "Software Developer",
        "type": "Full-time",
        "location": "Hyderabad",
        "skills": ["python", "fastapi", "sql", "git", "rest api"]
    },
    {
        "id": 4,
        "title": "Business Intelligence Intern",
        "company": "SkillBridge Demo",
        "role": "Data Analyst",
        "type": "Internship",
        "location": "Chennai",
        "skills": ["sql", "excel", "power bi", "tableau", "data visualization"]
    },
    {
        "id": 5,
        "title": "AI Engineer Intern",
        "company": "SkillBridge Demo",
        "role": "AI/ML Engineer",
        "type": "Internship",
        "location": "Remote",
        "skills": ["python", "machine learning", "deep learning", "nlp", "fastapi"]
    }
]


# --------------------------------------------------
# SKILL AND ROLE NORMALIZATION
# --------------------------------------------------

ALIASES = {
    "ml": "machine learning",
    "powerbi": "power bi",
    "rest apis": "rest api",
    "js": "javascript",
    "py": "python"
}


def normalize_skill(skill: str) -> str:
    cleaned = skill.strip().casefold()
    return ALIASES.get(cleaned, cleaned)


def normalize_role(role: str) -> str:
    cleaned = role.strip().casefold()

    for available_role in CAREER_SKILLS:
        if cleaned == available_role.casefold():
            return available_role

    return "Any" if cleaned == "any" else role.strip()


def detect_role(question: str, preferred_role: str) -> str:
    question = question.casefold()

    role_keywords = {
        "Data Analyst": ["data analyst", "data analytics"],
        "Data Scientist": ["data scientist", "data science"],
        "AI/ML Engineer": [
            "ai/ml",
            "ai engineer",
            "machine learning",
            "ml engineer"
        ],
        "Software Developer": [
            "software developer",
            "software engineer",
            "python developer"
        ],
        "Cloud Engineer": ["cloud engineer", "cloud computing"],
        "Product Manager": ["product manager", "product management"]
    }

    for role, keywords in role_keywords.items():
        if any(keyword in question for keyword in keywords):
            return role

    return normalize_role(preferred_role)


# --------------------------------------------------
# REQUEST MODELS
# --------------------------------------------------

class MatchRequest(BaseModel):
    skills: list[str] = Field(min_length=1, max_length=50)
    preferred_role: str = "Any"


class CareerQuestion(BaseModel):
    question: str = Field(min_length=1, max_length=1000)
    skills: list[str] = Field(default_factory=list, max_length=50)
    preferred_role: str = "Any"

class RecommendationRequest(BaseModel):
    skills: list[str] = Field(default_factory=list, max_length=50)


# --------------------------------------------------
# HEALTH AND HOME ENDPOINTS
# --------------------------------------------------

@app.get("/")
def home():
    return {
        "message": "Welcome to SkillBridge AI Backend!",
        "status": "Running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "application": "SkillBridge AI",
        "version": "1.1.0"
    }

# --------------------------------------------------
# INTELLIGENT CAREER RECOMMENDATION ENGINE
# --------------------------------------------------

@app.post("/recommend")
def recommend_careers(request: RecommendationRequest):

    # Normalize and remove duplicate student skills
    student_skills = {
        normalize_skill(skill)
        for skill in request.skills
        if skill.strip()
    }

    if not student_skills:
        return {
            "message": "Please add your technical skills to get career recommendations.",
            "total_careers_evaluated": len(CAREER_SKILLS),
            "recommendations": []
        }

    recommendations = []

    # Compare student skills against every career
    for role, required_skills in CAREER_SKILLS.items():

        matched_skills = [
            skill for skill in required_skills
            if skill in student_skills
        ]

        missing_skills = [
            skill for skill in required_skills
            if skill not in student_skills
        ]

        total_required = len(required_skills)
        matched_count = len(matched_skills)

        match_percentage = round(
            (matched_count / total_required) * 100
        ) if total_required else 0

        if matched_count == 0:
            explanation = (
                f"Your current skills do not yet match the listed "
                f"requirements for {role}."
            )
        elif not missing_skills:
            explanation = (
                f"You currently cover all {total_required} "
                f"skills listed for {role}."
            )
        else:
            explanation = (
                f"You match {matched_count} out of "
                f"{total_required} listed skills for {role}. "
                f"Learning {', '.join(missing_skills)} "
                f"could improve your skill coverage."
            )

        recommendations.append({
            "career_role": role,
            "match_percentage": match_percentage,
            "matched_skill_count": matched_count,
            "total_required_skills": total_required,
            "matched_skills": matched_skills,
            "missing_skills": missing_skills,
            "explanation": explanation
        })

    # Rank careers by match percentage.
    # Python's stable sorting preserves database order for ties.
    recommendations.sort(
        key=lambda item: item["match_percentage"],
        reverse=True
    )

    # Return the three highest-ranked careers
    top_recommendations = recommendations[:3]

    return {
        "message": "Career recommendations generated successfully.",
        "total_careers_evaluated": len(recommendations),
        "student_skills": sorted(student_skills),
        "recommendations": top_recommendations
    }



# --------------------------------------------------
# OPPORTUNITY MATCHING API
# --------------------------------------------------

@app.post("/match")
def match_opportunities(request: MatchRequest):

    student_skills = {
        normalize_skill(skill)
        for skill in request.skills
        if skill.strip()
    }

    if not student_skills:
        return {
            "student_skills": [],
            "total_opportunities": 0,
            "matches": []
        }

    preferred_role = normalize_role(request.preferred_role)

    results = []

    for opportunity in opportunities:

        required_skills = set(opportunity["skills"])

        matched_skills = sorted(student_skills & required_skills)
        missing_skills = sorted(required_skills - student_skills)

        score = round(
            len(matched_skills) / len(required_skills) * 100
        )

        role_match = (
            preferred_role == "Any"
            or preferred_role.casefold() == opportunity["role"].casefold()
        )

        results.append({
            **opportunity,
            "match_percentage": score,
            "matched_skills": matched_skills,
            "missing_skills": missing_skills,
            "role_match": role_match
        })

    results.sort(
        key=lambda item: (
            item["role_match"],
            item["match_percentage"]
        ),
        reverse=True
    )

    return {
        "student_skills": sorted(student_skills),
        "total_opportunities": len(results),
        "matches": results
    }


# --------------------------------------------------
# PERSONALIZED CAREER ASSISTANT
# --------------------------------------------------


@app.post("/assistant")
def career_assistant(request: CareerQuestion):
    question = request.question.strip()
    normalized_question = question.lower()

    student_skills = [
        normalize_skill(skill)
        for skill in request.skills
        if skill.strip()
    ]

    preferred_role = normalize_role(request.preferred_role)

    # Use the preferred role when available.
    # Otherwise, detect the most suitable role from student skills.
    if preferred_role in CAREER_SKILLS:
        target_role = preferred_role
    else:
        role_scores = {}

        for role, required_skills in CAREER_SKILLS.items():
            matched = set(student_skills).intersection(
                set(required_skills)
            )
            role_scores[role] = len(matched)

        target_role = max(
            role_scores,
            key=role_scores.get
        ) if role_scores and max(role_scores.values()) > 0 else "Any"

    required_skills = CAREER_SKILLS.get(target_role, [])

    matched_skills = [
        skill for skill in required_skills
        if skill in student_skills
    ]

    missing_skills = [
        skill for skill in required_skills
        if skill not in student_skills
    ]

    match_percentage = (
        round(len(matched_skills) / len(required_skills) * 100)
        if required_skills else 0
    )

    if target_role == "Any":
        answer = (
            "I couldn't identify a suitable career from your current skills. "
            "Please add more technical skills to your Student Profile, "
            "such as Python, SQL, Excel, or Machine Learning."
        )

    elif any(word in normalized_question for word in [
        "which career", "career match", "suitable career",
        "match my skills", "career matches"
    ]):
        answer = (
            f"Based on your current skills, {target_role} "
            f"appears to be a suitable career direction. "
            f"You currently match {match_percentage}% of its "
            f"listed technical skills. Focus on learning the missing skills "
            f"to strengthen your profile."
        )

    elif any(word in normalized_question for word in [
        "missing", "skill gap", "gap analysis"
    ]):
        answer = (
            f"Your current skill match for {target_role} is "
            f"{match_percentage}%. Review the missing skills "
            f"and work on them one by one."
        )

    elif any(word in normalized_question for word in [
        "which skills", "what skills", "learn next",
        "skills should", "learn for"
    ]):
        answer = (
            f"For {target_role}, focus on these skills: "
            + ", ".join(required_skills)
            + ". Your remaining skills to learn are: "
            + (
                ", ".join(missing_skills)
                if missing_skills else "None"
            )
        )

    elif any(word in normalized_question for word in [
        "roadmap", "learning plan", "study plan", "how to start"
    ]):
        answer = (
            f"Your learning roadmap for {target_role} should start "
            f"with your missing skills: "
            + (
                ", ".join(missing_skills)
                if missing_skills else "You already cover all listed skills."
            )
        )

    elif "interview" in normalized_question:
        answer = (
            f"For a {target_role} interview, prepare your fundamentals, "
            "practice technical questions, revise SQL and Python where "
            "relevant, and be ready to explain your projects."
        )

    elif "resume" in normalized_question:
        answer = (
            f"For a {target_role} resume, highlight your relevant skills, "
            "projects, internship experience, measurable outcomes, "
            "and technical tools."
        )

    else:
        answer = (
            f"I can help you explore your {target_role} career path. "
            f"Your current skill match is {match_percentage}%. "
            "Ask me about missing skills, interview preparation, "
            "or your learning roadmap."
        )

    return {
        "answer": answer,
        "career_role": target_role,
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "skill_match_percentage": match_percentage
    }
