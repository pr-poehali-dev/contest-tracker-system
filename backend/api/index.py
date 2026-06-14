"""
Главный API для Конкурс-Трекера.
Роутинг через query parameter ?action=...
Все SQL запросы используют полное имя schema.table.
"""
import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

S = "t_p85443557_contest_tracker_syst"

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-User-Id",
}


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def resp(status, data):
    return {
        "statusCode": status,
        "headers": {**CORS, "Content-Type": "application/json"},
        "body": json.dumps(data, ensure_ascii=False, default=str),
    }


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    method = event.get("httpMethod", "GET")
    params = event.get("queryStringParameters") or {}
    action = params.get("action", "")
    body = {}
    if event.get("body"):
        body = json.loads(event["body"])

    conn = get_conn()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:

            # GET ?action=stats
            if action == "stats" and method == "GET":
                cur.execute(f"SELECT COUNT(*) as cnt FROM {S}.contests WHERE status IN ('open','registration')")
                contests_active = cur.fetchone()["cnt"]
                cur.execute(f"SELECT COUNT(*) as cnt FROM {S}.users WHERE role = 'student'")
                students = cur.fetchone()["cnt"]
                cur.execute(f"SELECT COUNT(*) as cnt FROM {S}.achievements")
                diplomas = cur.fetchone()["cnt"]
                cur.execute(f"SELECT COUNT(*) as cnt FROM {S}.achievements WHERE level IN ('gold','silver','bronze')")
                wins = cur.fetchone()["cnt"]
                return resp(200, {
                    "contests_active": int(contests_active),
                    "students": int(students),
                    "diplomas": int(diplomas),
                    "wins": int(wins),
                })

            # GET ?action=contests
            if action == "contests" and method == "GET":
                level = params.get("level")
                if level and level != "all":
                    cur.execute(f"SELECT * FROM {S}.contests WHERE level = %s ORDER BY deadline ASC", (level,))
                else:
                    cur.execute(f"SELECT * FROM {S}.contests ORDER BY deadline ASC")
                return resp(200, cur.fetchall())

            # POST ?action=contests
            if action == "contests" and method == "POST":
                cur.execute(
                    f"INSERT INTO {S}.contests (title, level, deadline, status, subject, description) "
                    "VALUES (%s, %s, %s, %s, %s, %s) RETURNING *",
                    (body["title"], body["level"], body.get("deadline"),
                     body.get("status", "open"), body.get("subject"), body.get("description"))
                )
                conn.commit()
                return resp(201, cur.fetchone())

            # GET ?action=users
            if action == "users" and method == "GET":
                role = params.get("role")
                if role:
                    cur.execute(
                        f"SELECT id, name, role, grade, school, email FROM {S}.users WHERE role = %s ORDER BY name",
                        (role,)
                    )
                else:
                    cur.execute(f"SELECT id, name, role, grade, school, email FROM {S}.users ORDER BY name")
                return resp(200, cur.fetchall())

            # GET ?action=rating
            if action == "rating" and method == "GET":
                cur.execute(f"""
                    SELECT
                        u.id, u.name, u.grade,
                        COUNT(a.id) FILTER (WHERE a.level IN ('gold','silver','bronze')) AS wins,
                        COUNT(a.id) AS total,
                        (COUNT(a.id) FILTER (WHERE a.level = 'gold') * 300 +
                         COUNT(a.id) FILTER (WHERE a.level = 'silver') * 200 +
                         COUNT(a.id) FILTER (WHERE a.level = 'bronze') * 100 +
                         COUNT(a.id) FILTER (WHERE a.level = 'participation') * 20) AS points
                    FROM {S}.users u
                    LEFT JOIN {S}.achievements a ON a.user_id = u.id
                    WHERE u.role = 'student'
                    GROUP BY u.id, u.name, u.grade
                    ORDER BY points DESC
                    LIMIT 50
                """)
                rows = cur.fetchall()
                return resp(200, [dict(r, rank=i + 1) for i, r in enumerate(rows)])

            # GET ?action=achievements&user_id=
            if action == "achievements" and method == "GET":
                user_id = params.get("user_id", 1)
                cur.execute(
                    f"SELECT * FROM {S}.achievements WHERE user_id = %s ORDER BY date_received DESC",
                    (user_id,)
                )
                return resp(200, cur.fetchall())

            # POST ?action=achievements
            if action == "achievements" and method == "POST":
                cur.execute(
                    f"INSERT INTO {S}.achievements (user_id, title, level, date_received, verified, document_url) "
                    "VALUES (%s, %s, %s, %s, FALSE, %s) RETURNING *",
                    (body["user_id"], body["title"], body["level"],
                     body.get("date_received"), body.get("document_url"))
                )
                conn.commit()
                return resp(201, cur.fetchone())

            # GET ?action=applications
            if action == "applications" and method == "GET":
                user_id = params.get("user_id")
                if user_id:
                    cur.execute(f"""
                        SELECT ap.*, c.title as contest_title, c.level as contest_level,
                               u.name as user_name, u.grade
                        FROM {S}.applications ap
                        JOIN {S}.contests c ON c.id = ap.contest_id
                        JOIN {S}.users u ON u.id = ap.user_id
                        WHERE ap.user_id = %s OR ap.submitted_by = %s
                        ORDER BY ap.created_at DESC
                    """, (user_id, user_id))
                else:
                    cur.execute(f"""
                        SELECT ap.*, c.title as contest_title, c.level as contest_level,
                               u.name as user_name, u.grade
                        FROM {S}.applications ap
                        JOIN {S}.contests c ON c.id = ap.contest_id
                        JOIN {S}.users u ON u.id = ap.user_id
                        ORDER BY ap.created_at DESC
                        LIMIT 100
                    """)
                return resp(200, cur.fetchall())

            # POST ?action=applications
            if action == "applications" and method == "POST":
                cur.execute(
                    f"INSERT INTO {S}.applications (contest_id, user_id, submitted_by, class_group, status) "
                    "VALUES (%s, %s, %s, %s, 'pending') "
                    "ON CONFLICT (contest_id, user_id) DO UPDATE SET status = 'pending' "
                    "RETURNING *",
                    (body["contest_id"], body["user_id"],
                     body.get("submitted_by", body["user_id"]), body.get("class_group"))
                )
                conn.commit()
                return resp(201, cur.fetchone())

            # POST ?action=applications_bulk
            if action == "applications_bulk" and method == "POST":
                contest_id = body["contest_id"]
                class_group = body["class_group"]
                submitted_by = body["submitted_by"]
                cur.execute(f"SELECT id FROM {S}.users WHERE grade = %s AND role = 'student'", (class_group,))
                students = cur.fetchall()
                count = 0
                for s in students:
                    cur.execute(
                        f"INSERT INTO {S}.applications (contest_id, user_id, submitted_by, class_group, status) "
                        "VALUES (%s, %s, %s, %s, 'pending') "
                        "ON CONFLICT (contest_id, user_id) DO NOTHING",
                        (contest_id, s["id"], submitted_by, class_group)
                    )
                    count += cur.rowcount
                conn.commit()
                return resp(201, {"registered": count, "class_group": class_group})

            # GET ?action=notifications&user_id=
            if action == "notifications" and method == "GET":
                user_id = params.get("user_id", 1)
                cur.execute(
                    f"SELECT * FROM {S}.notifications WHERE user_id = %s ORDER BY created_at DESC",
                    (user_id,)
                )
                return resp(200, cur.fetchall())

            # PUT ?action=notifications_read&user_id=
            if action == "notifications_read" and method == "PUT":
                user_id = params.get("user_id", 1)
                cur.execute(f"UPDATE {S}.notifications SET read = TRUE WHERE user_id = %s", (user_id,))
                conn.commit()
                return resp(200, {"ok": True})

            return resp(404, {"error": f"Unknown action: {action}"})

    except Exception as e:
        conn.rollback()
        return resp(500, {"error": str(e)})
    finally:
        conn.close()
