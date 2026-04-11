import os
import psycopg2

DB_CONFIG = {
    "host": os.environ.get("DB_HOST", "db"),
    "port": os.environ.get("DB_PORT", 5432),
    "dbname": os.environ.get("DB_NAME", "temperatures_db"),
    "user": os.environ.get("DB_USER", "postgres"),
    "password": os.environ.get("DB_PASSWORD", "postgres"),
}


def get_db_connection():
    return psycopg2.connect(**DB_CONFIG)


def init_db():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS readings (
            id        SERIAL PRIMARY KEY,
            timestamp TIMESTAMPTZ NOT NULL,
            temperature   NUMERIC(8, 4) NOT NULL
        )
    """)
    conn.commit()
    cur.close()
    conn.close()