const inquirer = require("inquirer");
const mysql = require("mysql");
require("console.table");
const db = require("./db");
const { connection } = require("./db");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "6Epecha$",
  database: "employees_db",
});


start();

function start() {
  inquirer.prompt({
      name: "selection",
      type: "list",
      message: "What would you like to do?",
      choices: [
          "View All Employees",
          "Add Employee",
          "Update Employee",
          "View All Roles",
          "Add Role",
          "View All Departments",
          "Add Department",
          "Exit",
      ],
    })
  .then((response) => {
    switch (response.selection) {
      case "View All Employees":
        return viewEmployees();
      case "Add Employee":
        return addEmployee();
      case "Update Employee":
        return updateEmployee();
      case "View All Roles":
        return viewRoles();
      case "View All Departments":
        return viewDepartments();
      case "Add Department":
        return addDepartment();
      case "Add Role":
        return addRole();
      case "Exit":
        connection.end();
        break;

      default:
      return allDone();
    }
  });
};

function allDone() {
  inquirer.prompt({
    name: "selection",
    type: "confirm",
    message: "Are you all done?"
  })
  .then((response => {
    if (response.selection === false) {
      start();
    }

    connection.end();
  }))
}
function viewEmployees() {
  const employees = db.findAllEmployees();

  console.table(employees);

  start();
}

function viewRoles() {
  const roles = db.findAllRoles();

  console.table(roles);

  start();
}

async function addRole() {
  const departments = await db.findAllDepartments();

  const departmentSelections= departments.map(({ id, name }) => ({
    name: name,
    value: id
  }));

  const role = await prompt([
    {
      name: "title",
      message: "What is the name of the role?"
    },
    {
      name: "salary",
      message: "What is the salary of the role?"
    },
    {
      type: "list",
      name: "department_id",
      message: "Which department does the role belong to?",
      choices: departmentSelections
    }
  ]);

  await db.createRole(role);

  console.log(`Added role to the database`);

  start();
}

async function viewDepartments() {
  const departments = await db.findAllDepartments();
  console.table(departments);

  start();
}

async function addDepartment() {
  const department = await prompt([
    {
      name: "name",
      message: "What is the name of the department?"
    }
  ]);

  await db.createDepartment(department);

  console.log(`Added department to the database`);

  start();
}

async function addEmployee() {
  const roles = await db.findAllRoles();
  const employees = await db.findAllEmployees();

  const employee = await prompt([
    {
      name: "first_name",
      message: "What is the employee's first name?"
    },
    {
      name: "last_name",
      message: "What is the employee's last name?"
    }
  ]);

  const roleSelections = roles.map(({ id, title }) => ({
    name: title,
    value: id
  }));

  const { roleId } = await prompt({
    type: "list",
    name: "roleId",
    message: "What is the employee's role?",
    choices: roleSelections
  });

  employee.role_id = roleId;

  const managerSelections = employees.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id
  }));
  managerChoices.unshift({ name: "None", value: null });

  const { managerId } = await prompt({
    type: "list",
    name: "managerId",
    message: "Who is the employee's manager?",
    choices: managerSelections
  });

  employee.manager_id = managerId;

  await db.createEmployee(employee);

  console.log(
    `Added this employee to the database`
  );

  start();
}

