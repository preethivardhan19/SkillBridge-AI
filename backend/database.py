
import json
import os
import sqlite3
from pathlib import Path

from dotenv import load_dotenv
import psycopg
from psycopg.rows import dict_row

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
DATABASE_PATH = Path(__file__).resolve().parent / "skillbridge.db"


def get_connection():
    if DATABASE_URL:
        return psycopg.connect(
            DATABASE_URL,
            row_factory=dict_row
        )

    connection = sqlite3.connect(DATABASE_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def execute_query(connection, query, params=()):
    if DATABASE_URL:
        query = query.replace("?", "%s")

    return connection.execute(query, params)


def initialize_database():
    connection = get_connection()

    try:
        if DATABASE_URL:
            profile_id = "BIGSERIAL PRIMARY KEY"
            progress_id = "BIGSERIAL PRIMARY KEY"
        else:
            profile_id = "INTEGER PRIMARY KEY AUTOINCREMENT"
            progress_id = "INTEGER PRIMARY KEY AUTOINCREMENT"

        execute_query(connection, f"""
            CREATE TABLE IF NOT EXISTS student_profiles (
                id {profile_id},
                name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                education TEXT,
                graduation TEXT,
                skills TEXT NOT NULL DEFAULT '[]',
                preferred_role TEXT DEFAULT 'Any',
                location TEXT,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        execute_query(connection, f"""
            CREATE TABLE IF NOT EXISTS learning_progress (
                id {progress_id},
                student_email TEXT NOT NULL,
                skill_name TEXT NOT NULL,
                completed INTEGER NOT NULL DEFAULT 0,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(student_email, skill_name)
            )
        """)

        connection.commit()

    finally:
        connection.close()


def save_student_profile(profile):
    connection = get_connection()

    try:
        execute_query(connection, """
            INSERT INTO student_profiles (
                name, email, education, graduation,
                skills, preferred_role, location, updated_at
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
        row = execute_query(connection, """
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


def save_learning_progress(email, skill_name, completed):
    connection = get_connection()

    try:
        execute_query(connection, """
            INSERT INTO learning_progress (
                student_email, skill_name, completed, updated_at
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
        rows = execute_query(connection, """
            SELECT skill_name
            FROM learning_progress
            WHERE student_email = ?
            AND completed = 1
            ORDER BY skill_name
        """, (email.strip().casefold(),)).fetchall()

        return [row["skill_name"] for row in rows]

    finally:
        connection.close()
