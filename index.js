const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");
const figlet = require("figlet");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "employees_trackerDB",
});

connection.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("connected as id " + connection.threadId + "\n");
  header();
});

function header() {
  figlet("Employee Summary", function (err, data) {
    if (err) {
      console.log("Something went wrong...");
      console.dir(err);
      return;
    }
    console.log(data);
    startApp();
  });
}

function startApp() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: [
          {
            name: "View all employees",
            value: searchAllEmployees,
          },
          {
            name: "View all employee by department",
            value: searchEmployeesDepart,
          },
          {
            name: "View all employee by manager",
            value: searchEmployeesManager,
          },
          {
            name: "Add employee",
            value: addEmployee,
          },
          {
            name: "Remove employee",
            value: removeEmployee,
          },
          {
            name: "Update employee role",
            value: updateEmployeeRole,
          },
          {
            name: "Update employee manager",
            value: updateEmployeeManager,
          },
          {
            name: "Exit",
            value: exit,
          },
        ],
      },
    ])
    .then((answers) => {
      answers.action();
    });
}

function searchAllEmployees() {
  connection.query(
    `SELECT 
      e.id, 
      e.first_name, 
      e.last_name, 
      r.title, 
      d.name AS department,
      r.salary, 
      m.first_name AS manager
  FROM employees e
  LEFT JOIN employees m
    ON e.manager_id = m.id
  JOIN role r
    ON e.role_id = r.id
  JOIN department d
    ON r.department_id = d.id`,
    (err, res) => {
      if (err) {
        throw err;
      } else {
        console.table(res);
        startApp();
      }
    }
  );
}

function searchEmployeesDepart() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "department",
        message: "Choose a department",
        choices: ["Sales", "Engineering", "Finance", "Legal"],
      },
    ])
    .then((answers) => {
      connection.query(
        `SELECT 
        e.id, 
        e.first_name, 
        e.last_name, 
        r.title, 
        d.name AS department,
        r.salary, 
        m.first_name AS manager
      FROM employees e
      LEFT JOIN employees m
        ON e.manager_id = m.id
      JOIN role r
        ON e.role_id = r.id
      JOIN department d
        ON r.department_id = d.id
      WHERE d.name = ?`,
        answers.department,
        (err, res) => {
          if (err) {
            throw err;
          } else {
            console.table(res);
            startApp();
          }
        }
      );
    });
}

function searchEmployeesManager() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "manager",
        message: "Choose a manager",
        choices: ["null", "Ashley Rodriguez", "Sarah Lours", "Malia Brown"],
      },
    ])
    .then((answers) => {
      connection.query(
        `SELECT 
        e.id, 
        e.first_name, 
        e.last_name, 
        r.title, 
        d.name AS department,
        r.salary, 
        m.first_name AS manager
      FROM employees e
      LEFT JOIN employees m
        ON e.manager_id = m.id
      JOIN role r
        ON e.role_id = r.id
      JOIN department d
        ON r.department_id = d.id
        WHERE m.first_name = ?`,
        answers.manager.split(" ", 1),
        (err, res) => {
          if (err) {
            throw err;
          } else {
            console.table(res);
            startApp();
          }
        }
      );
    });
}

function addEmployee() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "firstName",
        message: "What's the employee's first name?",
      },
      {
        type: "input",
        name: "lastName",
        message: "What's the employee's last name?",
      },
      {
        type: "list",
        name: "role",
        message: "What's the employee's role?",
        choices: [
          "Sales Lead",
          "Sales Person",
          "Lead Engineer",
          "Software Engineer",
          "Lawyer",
          "Accountant",
          "Legal Team Lead",
        ],
      },
      {
        type: "list",
        name: "manager",
        message: "Who is the employee's manager?",
        choices: [
          "null",
          "John Doe",
          "Mike Chan",
          "Ashley Rodriguez",
          "Kevin Tupik",
          "Malia Brown",
          "Sarah Lourd",
        ],
      },
    ])
    .then((answers) => {
      let roleId;
      switch (answers.role) {
        case "Sales Lead":
          roleId = 4;
          break;
        case "Sales Person":
          roleId = 5;
          break;
        case "Lead Engineer":
          roleId = 1;
          break;
        case "Software Engineer":
          roleId = 6;
          break;
        case "Lawyer":
          roleId = 5;
          break;
        case "Accountant":
          roleId = 2;
          break;
        case "Legal Team Lead":
          roleId = 3;
          break;
      }

      let managerId;
      switch (answers.manager) {
        case "Ashley Rodriguez":
          managerId = 1;
          break;
        case "Malia Brown":
          managerId = 2;
          break;
        case "Sarah Lourd":
          managerId = 3;
          break;
        case "John Doe":
          managerId = 4;
          break;
        case "Mike Chan":
          managerId = 5;
          break;
        case "Kevin Tupik":
          managerId = 6;
          break;
        case "null":
          managerId = null;
          break;
      }

      connection.query(
        `INSERT INTO employees (first_name, last_name, role_id, manager_id) 
        VALUES (?,?,?,?)`,
        [answers.firstName, answers.lastName, roleId, managerId],
        (err, res) => {
          if (err) {
            throw err;
          } else {
            console.table(res);
            startApp();
          }
        }
      );
    });
}

function removeEmployee() {
  connection.query(
    `SELECT first_name, last_name
    FROM employees`,
    (err, res) => {
      if (err) {
        throw err;
      } else {
        const employeeChoices = res.map((name) => ({
          name: name.first_name + " " + name.last_name,
        }));
        console.table(employeeChoices);
        inquirer
          .prompt([
            {
              type: "list",
              name: "employee",
              choices: employeeChoices,
            },
          ])
          .then((answers) => {
            connection.query(
              `DELETE FROM employees  WHERE first_name = ?;`,
              answers.employee.split(" ", 1),
              (err, res) => {
                if (err) {
                  throw err;
                } else {
                  startApp();
                }
              }
            );
          });
      }
    }
  );
}

function updateEmployeeRole() {
  console.log("updateEmployeeRole it works!");
  startApp();
}

function updateEmployeeManager() {
  console.log("updateEmployeeManager it works!");
  startApp();
}

function exit() {
  connection.end();
}
