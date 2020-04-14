INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Ashley","Rodriguez",1,null), ("Malia","Brown",2,null), 
       ("Sarah","Lourd","3", null), ("John","Doe",4,1), 
       ("Mike","Chan",5,4), ("Kevin","Tupik",6,1), ("Tom", "Allen", 7, 3);

INSERT INTO role (title, salary, department_id)
VALUES ("Lead Engineer",150000.00,2), ("Accountant", 125000.00,3), 
       ("Legal Team Lead", 250000.00, 4), ("Sales Lead", 100000.00,1),
       ("Sales Person",80000.00,1), ("Software Engineer", 120000.00,2), ("Lawyer",190000.00,4);

INSERT INTO department (name)
VALUES ("Sales"),("Engineering"),("Finance"),("Legal");