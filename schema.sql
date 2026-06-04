-- SQL Schema for Secretarios Relatorios Snapshots
CREATE TABLE IF NOT EXISTS relatorios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  data_upload TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  dados LONGTEXT NOT NULL
);
