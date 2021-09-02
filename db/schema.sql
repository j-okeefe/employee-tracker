DROP DATABASE IF EXISTS employees;

CREATE DATABASE employees;

USE employees_db;

CREATE TABLE department (
  id INT(10) AUTO_INCREMENT,
  name VARCHAR(30),
  PRIMARY KEY (id)
);

CREATE TABLE role (
  id INT(10) PRIMARY KEY,
  title VARCHAR(30),
  salary DECIMAL,
  department_id INT(10),
  FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE employee (
  id INT(10) PRIMARY KEY,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  role_id INT(10),
  FOREIGN KEY (role_id) REFERENCES role(id)
  manager_id INT(10),
  FOREIGN KEY (manager_id) REFERENCES employee(id)
);
