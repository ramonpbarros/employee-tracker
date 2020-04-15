DROP DATABASE IF EXISTS employees_trackerDB;
CREATE database employees_trackerDB;

USE employees_trackerDB;

CREATE TABLE department
(
  id INT
  AUTO_INCREMENT NOT NULL,
name VARCHAR
  (30),
PRIMARY KEY
  (id)
);

  CREATE TABLE role
  (
    id INT
    AUTO_INCREMENT NOT NULL,
title VARCHAR
    (30),
salary DECIMAL
    (8,2),
department_id INT,
PRIMARY KEY
    (id),
FOREIGN KEY
    (department_id) REFERENCES department
    (id)
);

    CREATE TABLE employees
    (
      id INT
      AUTO_INCREMENT NOT NULL,
first_name VARCHAR
      (30),
last_name VARCHAR
      (30),
role_id INT,
manager_id INT,
PRIMARY KEY
      (id),
FOREIGN KEY
      (manager_id) REFERENCES role
      (id)
);