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
          // {
          //   name: "Add employee",
          //   value: addEmployee,
          // },
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

// function addEmployee() {
//   inquirer
//     .prompt([
//       {
//         type: "input",
//         name: "firstName",
//         message: "What's the employee's first name?",
//       },
//       {
//         type: "input",
//         name: "lastName",
//         message: "What's the employee's last name?",
//       },
//       {
//         type: "list",
//         name: "role",
//         message: "What's the employee's role?",
//         choices: ['Sales Lead', 'Sales Person', 'Lead Engineer', 'Software Engineer', 'Account Manager', 'Accountant', 'Legal Team Lead']
//       },
//       {
//         type: "list",
//         name: "manager",
//         message: "Who is the employee's manager?",
//         choices: ['None', 'John Doe', 'Mike Chan', 'Ashley Rodriguez', 'Kevin Tupik', 'Malia Brown', 'Sarah Lourd']
//       },
//      ])
//      .then(answers => {
//        connection.query(
//          `INSERT INTO employees (first_name, last_name, role_id, manager_id)
//           VALUES ()`
//        )
//      }
//   // console.log("addEmployee it works!");
//   // startApp();
// }

function removeEmployee() {
  console.log("removeEmployee it works!");
  startApp();
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