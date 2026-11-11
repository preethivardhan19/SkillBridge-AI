
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator

from database import (
    initialize_database,
    save_student_profile,
    get_student_profile,
    save_learning_progress,
    get_learning_progress
)


# --------------------------------------------------
# APPLICATION CONFIGURATION
# --------------------------------------------------

APP_VERSION = "1.2.0"

app = FastAPI(
    title="SkillBridge AI",
    description="Career guidance and opportunity matching platform",
    version=APP_VERSION
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup_event():
    initialize_database()


# --------------------------------------------------
# CAREER SKILL DATABASE
# --------------------------------------------------

CAREER_SKILLS = {
    "Data Analyst": [
        "python", "sql", "excel", "power bi", "statistics"
    ],
    "Data Scientist": [
        "python", "sql", "statistics",
        "machine learning", "pandas", "numpy"
    ],
    "AI/ML Engineer": [
        "python", "machine learning", "deep learning",
        "nlp", "tensorflow", "fastapi"
    ],
    "Software Developer": [
        "python", "java", "sql", "git",
        "rest api", "data structures"
    ],
    "Cloud Engineer": [
        "python", "linux", "aws",
        "networking", "docker", "sql"
    ],
    "Product Manager": [
        "communication", "sql", "excel",
        "problem solving", "product strategy"
    ]
}


# --------------------------------------------------
# DEMONSTRATION OPPORTUNITY DATABASE
# These are sample records, not live job listings.
# --------------------------------------------------

OPPORTUNITIES = [
    {
        "id": 1,
        "title": "Data Analyst Intern",
        "company": "SkillBridge Demo",
        "role": "Data Analyst",
        "type": "Internship",
        "location": "Remote",
        "skills": [
            "python", "sql", "excel", "power bi", "statistics"
        ]
    },
    {
        "id": 2,
        "title": "Junior Machine Learning Intern",
        "company": "SkillBridge Demo",
        "role": "AI/ML Engineer",
        "type": "Internship",
        "location": "Bengaluru",
        "skills": [
            "python", "machine learning",
            "pandas", "numpy", "statistics"
        ]
    },
    {
        "id": 3,
        "title": "Python Developer Trainee",
        "company": "SkillBridge Demo",
        "role": "Software Developer",
        "type": "Full-time",
        "location": "Hyderabad",
        "skills": [
            "python", "fastapi", "sql", "git", "rest api"
        ]
    },
    {
        "id": 4,
        "title": "Business Intelligence Intern",
        "company": "SkillBridge Demo",
        "role": "Data Analyst",
        "type": "Internship",
        "location": "Chennai",
        "skills": [
            "sql", "excel", "power bi",
            "tableau", "data visualization"
        ]
    },
    {
        "id": 5,
        "title": "AI Engineer Intern",
        "company": "SkillBridge Demo",
        "role": "AI/ML Engineer",
        "type": "Internship",
        "location": "Remote",
        "skills": [
            "python", "machine learning",
            "deep learning", "nlp", "fastapi"
        ]
    }
]


# --------------------------------------------------
# SKILL NORMALIZATION
# --------------------------------------------------

ALIASES = {
    "ml": "machine learning",
    "powerbi": "power bi",
    "rest apis": "rest api",
    "js": "javascript",
    "py": "python"
}


def normalize_skill(skill: str) -> str:
    cleaned = " ".join(skill.split()).casefold()
    return ALIASES.get(cleaned, cleaned)


def normalize_skills(skills: list[str]) -> set[str]:
    return {
        normalize_skill(skill)
        for skill in skills
        if skill.strip()
    }


# --------------------------------------------------
# ROLE NORMALIZATION AND DETECTION
# --------------------------------------------------

def normalize_role(role: str) -> str:
    cleaned = role.strip().casefold()

    if cleaned in ("", "any"):
        return "Any"

    for available_role in CAREER_SKILLS:
        if cleaned == available_role.casefold():
            return available_role

    return "Any"


def detect_role(question: str, preferred_role: str) -> str:

    question = question.casefold()

    role_keywords = {
        "Data Analyst": [
            "data analyst", "data analytics"
        ],
        "Data Scientist": [
            "data scientist", "data science"
        ],
        "AI/ML Engineer": [
            "ai/ml", "ai engineer",
            "machine learning", "ml engineer"
        ],
        "Software Developer": [
            "software developer",
            "software engineer",
            "python developer"
        ],
        "Cloud Engineer": [
            "cloud engineer", "cloud computing"
        ],
        "Product Manager": [
            "product manager", "product management"
        ]
    }

    for role, keywords in role_keywords.items():
        if any(keyword in question for keyword in keywords):
            return role

    return normalize_role(preferred_role)


def find_best_role(student_skills: set[str]) -> str:

    if not student_skills:
        return "Any"

    role_scores = {}

    for role, required_skills in CAREER_SKILLS.items():
        role_scores[role] = len(
            student_skills.intersection(required_skills)
        )

    best_role = max(role_scores, key=role_scores.get)

    if role_scores[best_role] == 0:
        return "Any"

    return best_role


# --------------------------------------------------
# REQUEST VALIDATION MODELS
# --------------------------------------------------

class MatchRequest(BaseModel):
    skills: list[str] = Field(min_length=1, max_length=50)
    preferred_role: str = Field(default="Any", max_length=80)

    @field_validator("skills")
    @classmethod
    def validate_skills(cls, values):
        cleaned = []

        for skill in values:
            skill = " ".join(skill.split())

            if len(skill) > 60:
                raise ValueError(
                    "Each skill must be 60 characters or fewer."
                )

            if skill:
                cleaned.append(skill)

        return cleaned

    @field_validator("preferred_role")
    @classmethod
    def clean_preferred_role(cls, value):
        return value.strip() or "Any"


class CareerQuestion(BaseModel):
    question: str = Field(min_length=1, max_length=1000)
    skills: list[str] = Field(default_factory=list, max_length=50)
    preferred_role: str = Field(default="Any", max_length=80)

    @field_validator("question")
    @classmethod
    def validate_question(cls, value):
        value = value.strip()

        if not value:
            raise ValueError("Question cannot be empty.")

        return value

    @field_validator("skills")
    @classmethod
    def validate_skills(cls, values):
        cleaned = []

        for skill in values:
            skill = " ".join(skill.split())

            if len(skill) > 60:
                raise ValueError(
                    "Each skill must be 60 characters or fewer."
                )

            if skill:
                cleaned.append(skill)

        return cleaned

    @field_validator("preferred_role")
    @classmethod
    def clean_preferred_role(cls, value):
        return value.strip() or "Any"


class RecommendationRequest(BaseModel):
    skills: list[str] = Field(default_factory=list, max_length=50)

    @field_validator("skills")
    @classmethod
    def validate_skills(cls, values):
        cleaned = []

        for skill in values:
            skill = " ".join(skill.split())

            if len(skill) > 60:
                raise ValueError(
                    "Each skill must be 60 characters or fewer."
                )

            if skill:
                cleaned.append(skill)

        return cleaned


# --------------------------------------------------
# STUDENT PROFILE MODEL
# --------------------------------------------------

class StudentProfile(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    email: str = Field(min_length=3, max_length=150)
    education: str = Field(default="", max_length=150)
    graduation: str = Field(default="", max_length=20)
    skills: list[str] = Field(default_factory=list, max_length=50)
    preferredRole: str = Field(default="Any", max_length=80)
    location: str = Field(default="", max_length=100)


# --------------------------------------------------
# LEARNING PROGRESS MODEL
# --------------------------------------------------

class LearningProgressRequest(BaseModel):
    email: str = Field(min_length=3, max_length=150)
    skill_name: str = Field(min_length=1, max_length=60)
    completed: bool = True


# --------------------------------------------------
# HEALTH AND HOME ENDPOINTS
# --------------------------------------------------

@app.get("/")
def home():
    return {
        "message": "Welcome to SkillBridge AI Backend!",
        "status": "Running",
        "version": APP_VERSION
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "application": "SkillBridge AI",
        "version": APP_VERSION
    }


# --------------------------------------------------
# STUDENT PROFILE DATABASE API
# --------------------------------------------------

@app.post("/profile")
def create_or_update_profile(profile: StudentProfile):

    profile_data = profile.model_dump()

    profile_data["name"] = profile_data["name"].strip()
    profile_data["email"] = profile_data["email"].strip().casefold()
    profile_data["skills"] = list(
        normalize_skills(profile_data["skills"])
    )

    if not profile_data["name"] or not profile_data["email"]:
        raise HTTPException(
            status_code=400,
            detail="Name and email are required."
        )

    save_student_profile(profile_data)

    return {
        "message": "Student profile saved successfully.",
        "profile": profile_data
    }


@app.get("/profile/{email}")
def read_student_profile(email: str):

    profile = get_student_profile(email.strip().casefold())

    if profile is None:
        raise HTTPException(
            status_code=404,
            detail="Student profile not found."
        )

    return {
        "message": "Student profile retrieved successfully.",
        "profile": profile
    }


# --------------------------------------------------
# CAREER RECOMMENDATION ENGINE
# --------------------------------------------------

@app.post("/recommend")
def recommend_careers(request: RecommendationRequest):

    student_skills = normalize_skills(request.skills)

    if not student_skills:
        return {
            "message": (
                "Please add your technical skills to get "
                "career recommendations."
            ),
            "total_careers_evaluated": len(CAREER_SKILLS),
            "student_skills": [],
            "recommendations": []
        }

    recommendations = []

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
            matched_count / total_required * 100
        )

        if not matched_skills:
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
                f"You match {matched_count} out of {total_required} "
                f"listed skills for {role}. Learning "
                f"{', '.join(missing_skills)} could improve "
                f"your skill coverage."
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

    recommendations.sort(
        key=lambda item: item["match_percentage"],
        reverse=True
    )

    return {
        "message": "Career recommendations generated successfully.",
        "total_careers_evaluated": len(recommendations),
        "student_skills": sorted(student_skills),
        "recommendations": recommendations[:3]
    }


# --------------------------------------------------
# OPPORTUNITY MATCHING ENGINE
# --------------------------------------------------

@app.post("/match")
def match_opportunities(request: MatchRequest):

    student_skills = normalize_skills(request.skills)
    preferred_role = normalize_role(request.preferred_role)

    if not student_skills:
        return {
            "student_skills": [],
            "total_opportunities": 0,
            "matches": []
        }

    results = []

    for opportunity in OPPORTUNITIES:

        required_skills = set(opportunity["skills"])

        matched_skills = sorted(
            student_skills.intersection(required_skills)
        )

        missing_skills = sorted(
            required_skills.difference(student_skills)
        )

        total_required = len(required_skills)

        score = round(
            len(matched_skills) / total_required * 100
        ) if total_required else 0

        role_match = (
            preferred_role == "Any"
            or preferred_role == opportunity["role"]
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
# Rule-based version - generative AI integration
# will be added in a later development phase.
# --------------------------------------------------

@app.post("/assistant")
def career_assistant(request: CareerQuestion):

    question = request.question.strip()
    normalized_question = question.casefold()

    student_skills = normalize_skills(request.skills)
    preferred_role = normalize_role(request.preferred_role)

    target_role = detect_role(question, preferred_role)

    if target_role == "Any":
        target_role = find_best_role(student_skills)

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
            "I couldn't identify a suitable career from your current "
            "skills. Please add more skills to your Student Profile, "
            "such as Python, SQL, Excel, or Machine Learning."
        )

    elif any(word in normalized_question for word in [
        "which career", "career match", "suitable career",
        "match my skills", "career matches"
    ]):

        answer = (
            f"Based on your current skills, {target_role} appears "
            f"to be a suitable career direction. You currently match "
            f"{match_percentage}% of its listed skills. "
            f"Focus on the missing skills to strengthen your profile."
        )

    elif any(word in normalized_question for word in [
        "missing", "skill gap", "gap analysis"
    ]):

        answer = (
            f"Your current skill match for {target_role} is "
            f"{match_percentage}%. Your missing skills are: "
            + (
                ", ".join(missing_skills)
                if missing_skills
                else "None. You cover all listed skills."
            )
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
        "roadmap", "learning plan", "study plan",
        "how to start", "how to become", "become a"
    ]):

        answer = (
            f"Your learning roadmap for {target_role} should focus "
            f"on the following missing skills: "
            + (
                ", ".join(missing_skills)
                if missing_skills
                else "You already cover all listed skills."
            )
            + ". Practice through projects and build a portfolio "
            "to demonstrate your progress."
        )

    elif "interview" in normalized_question:

        answer = (
            f"For a {target_role} interview, prepare your fundamentals, "
            "practice technical questions, revise relevant tools, "
            "and be ready to explain your projects."
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


# --------------------------------------------------
# LEARNING PROGRESS API
# --------------------------------------------------

@app.put("/progress")
def update_learning_progress(progress: LearningProgressRequest):

    email = progress.email.strip().casefold()
    skill_name = progress.skill_name.strip()

    if not email or not skill_name:
        raise HTTPException(
            status_code=400,
            detail="Email and skill name are required."
        )

    student = get_student_profile(email)

    if not student:
        raise HTTPException(
            status_code=404,
            detail=(
                "Student profile not found. "
                "Please save your profile first."
            )
        )

    save_learning_progress(
        email,
        skill_name,
        progress.completed
    )

    return {
        "message": "Learning progress updated successfully.",
        "skill_name": skill_name,
        "completed": progress.completed
    }


@app.get("/progress/{email}")
def read_learning_progress(email: str):

    email = email.strip().casefold()

    student = get_student_profile(email)

    if not student:
        raise HTTPException(
            status_code=404,
            detail="Student profile not found."
        )

    completed_skills = get_learning_progress(email)

    return {
        "email": email,
        "completed_skills": completed_skills,
        "total_completed": len(completed_skills)
    }
