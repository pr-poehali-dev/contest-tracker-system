CREATE TABLE IF NOT EXISTS t_p85443557_contest_tracker_syst.users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    role VARCHAR(20) NOT NULL,
    grade VARCHAR(20),
    school VARCHAR(300),
    email VARCHAR(200),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS t_p85443557_contest_tracker_syst.contests (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    level VARCHAR(50) NOT NULL,
    deadline DATE,
    status VARCHAR(30) DEFAULT 'open',
    description TEXT,
    subject VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS t_p85443557_contest_tracker_syst.applications (
    id SERIAL PRIMARY KEY,
    contest_id INTEGER REFERENCES t_p85443557_contest_tracker_syst.contests(id),
    user_id INTEGER REFERENCES t_p85443557_contest_tracker_syst.users(id),
    submitted_by INTEGER REFERENCES t_p85443557_contest_tracker_syst.users(id),
    class_group VARCHAR(50),
    status VARCHAR(30) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(contest_id, user_id)
);

CREATE TABLE IF NOT EXISTS t_p85443557_contest_tracker_syst.achievements (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES t_p85443557_contest_tracker_syst.users(id),
    contest_id INTEGER REFERENCES t_p85443557_contest_tracker_syst.contests(id),
    title VARCHAR(500) NOT NULL,
    level VARCHAR(20) NOT NULL,
    date_received DATE,
    verified BOOLEAN DEFAULT FALSE,
    document_url TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS t_p85443557_contest_tracker_syst.notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES t_p85443557_contest_tracker_syst.users(id),
    title VARCHAR(500) NOT NULL,
    type VARCHAR(30) DEFAULT 'info',
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);