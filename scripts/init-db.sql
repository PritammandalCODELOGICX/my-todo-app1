-- Run once after RDS is created:
-- mysql -h YOUR_RDS_ENDPOINT -u admin -p < scripts/init-db.sql

CREATE DATABASE IF NOT EXISTS tododb
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE tododb;

CREATE USER IF NOT EXISTS 'todouser'@'%' IDENTIFIED BY 'REPLACE_THIS_PASSWORD';
GRANT SELECT, INSERT, UPDATE, DELETE ON tododb.* TO 'todouser'@'%';
FLUSH PRIVILEGES;

CREATE TABLE IF NOT EXISTS todos (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  title       VARCHAR(500) NOT NULL,
  completed   BOOLEAN      NOT NULL DEFAULT FALSE,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO todos (title, completed) VALUES
  ('Set up EC2 instance', TRUE),
  ('Create RDS database', TRUE),
  ('Configure GitHub Actions', FALSE),
  ('Deploy to CloudFront', FALSE);

SELECT 'Database ready!' AS status;
