from flask import Flask, jsonify, request
from db import get_db_connection, init_db
import os

app = Flask(__name__)


@app.before_request
def setup():
    init_db()


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


@app.route("/temperature", methods=["POST"])
def create_reading():
    data = request.get_json()

    if data is None:
        return jsonify({"error": "Request body must be JSON"}), 400

    missing = [f for f in ["timestamp", "temperature"] if f not in data]
    if missing:
        return jsonify({"error": f"Missing required fields: {', '.join(missing)}"}), 400

    try:
        timestamp = float(data["timestamp"])
        temperature = float(data["temperature"])
    except (ValueError, TypeError):
        return jsonify({"error": "timestamp and temperature must be numbers"}), 400

    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO readings (timestamp, temperature) VALUES (to_timestamp(%s), %s) RETURNING id",
        (timestamp, temperature),
    )
    row = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()

    return jsonify({"status": "stored", "id": row[0]}), 201


@app.route("/temperature", methods=["GET"])
def list_readings():
    limit = request.args.get("limit", 100, type=int)

    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(
        "SELECT id, extract(epoch from timestamp), temperature FROM readings ORDER BY timestamp DESC LIMIT %s",
        (limit,),
    )
    rows = cur.fetchall()
    cur.close()
    conn.close()

    return jsonify([
        {"id": r[0], "timestamp": r[1], "temperature": r[2]}
        for r in rows
    ])


if __name__ == "__main__":
    port = int(os.environ.get('PORT', 6000))
    app.run(host="0.0.0.0", port=port, ssl_context=('cert.pem', 'key.pem'))