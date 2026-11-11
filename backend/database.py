
import sqlite3
import json
from pathlib import Path


# Database file stored inside the backend folder
DATABASE_PATH = Path(__file__).resolve().parent / "skillbridge.db"


def get_connection():
    connection = sqlite3.connect(DATABASE_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def initialize_database():

    connection = get_connection()

    try:
        connection.execute("""
            CREATE TABLE IF NOT EXISTS student_profiles (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                education TEXT,
                graduation TEXT,
                skills TEXT NOT NULL DEFAULT '[]',
                preferred_role TEXT DEFAULT 'Any',
                location TEXT,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        """)

        connection.execute("""
            CREATE TABLE IF NOT EXISTS learning_progress (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                student_email TEXT NOT NULL,
                skill_name TEXT NOT NULL,
                completed INTEGER NOT NULL DEFAULT 0,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(student_email, skill_name)
            )
        """)

        connection.commit()

    finally:
        connection.close()


def save_student_profile(profile):

    connection = get_connection()

    try:
        connection.execute("""
            INSERT INTO student_profiles (
                name,
                email,
                education,
                graduation,
                skills,
                preferred_role,
                location,
                updated_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)

            ON CONFLICT(email) DO UPDATE SET
                name = excluded.name,
                education = excluded.education,
                graduation = excluded.graduation,
                skills = excluded.skills,
                preferred_role = excluded.preferred_role,
                location = excluded.location,
                updated_at = CURRENT_TIMESTAMP
        """, (
            profile["name"],
            profile["email"],
            profile.get("education", ""),
            profile.get("graduation", ""),
            json.dumps(profile.get("skills", [])),
            profile.get("preferredRole", "Any"),
            profile.get("location", "")
        ))

        connection.commit()
        return True

    finally:
        connection.close()


def get_student_profile(email):

    connection = get_connection()

    try:
        row = connection.execute("""
            SELECT * FROM student_profiles
            WHERE email = ?
        """, (email,)).fetchone()

        if row is None:
            return None

        profile = dict(row)
        profile["skills"] = json.loads(profile["skills"])

        return profile

    finally:
        connection.close()

# --------------------------------------------------
# LEARNING PROGRESS DATABASE FUNCTIONS
# --------------------------------------------------

def save_learning_progress(email, skill_name, completed):

    connection = get_connection()

    try:
        connection.execute("""
            INSERT INTO learning_progress (
                student_email,
                skill_name,
                completed,
                updated_at
            )
            VALUES (?, ?, ?, CURRENT_TIMESTAMP)

            ON CONFLICT(student_email, skill_name)
            DO UPDATE SET
                completed = excluded.completed,
                updated_at = CURRENT_TIMESTAMP
        """, (
            email.strip().casefold(),
            skill_name.strip(),
            int(completed)
        ))

        connection.commit()
        return True

    finally:
        connection.close()


def get_learning_progress(email):

    connection = get_connection()

    try:
        rows = connection.execute("""
            SELECT skill_name
            FROM learning_progress
            WHERE student_email = ?
            AND completed = 1
            ORDER BY skill_name
        """, (email.strip().casefold(),)).fetchall()

        return [row["skill_name"] for row in rows]

    finally:
        connection.close()
