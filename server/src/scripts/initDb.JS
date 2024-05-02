require('dotenv').config({ path: '../../.env' }); 

const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT 
});

connection.connect(err => {
    if (err) {
        console.error('Error connecting: ', err.stack);
        return;
    }

    console.log('Connected as id ' + connection.threadId);

    // First, create the database if it doesn't exist
    const createDbSQL = `CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`;
    connection.query(createDbSQL, (err, result) => {
        if (err) {
            console.error("Error creating database: ", err.message);
            connection.end();
            return;
        }
        console.log("Database created or already exists.");

        // Ensure connection to the correct database
        connection.changeUser({database : process.env.DB_NAME}, (err) => {
            if (err) {
                console.error('Error changing database', err.message);
                connection.end();
                return;
            }

            // SQL statement to create tables
            const createTablesSQL = `
            CREATE TABLE IF NOT EXISTS Users (
                UserId INT AUTO_INCREMENT PRIMARY KEY,
                Username VARCHAR(255) NOT NULL,
                Password VARCHAR(255) NOT NULL,
                Email VARCHAR(255) NOT NULL,
                FirstName VARCHAR(255),
                LastName VARCHAR(255),
                Role ENUM('Admin', 'Agent', 'Support') DEFAULT 'Agent',
                CreateDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            
            CREATE TABLE IF NOT EXISTS Customers (
                CustomerId INT AUTO_INCREMENT PRIMARY KEY,
                FirstName VARCHAR(255),
                LastName VARCHAR(255),
                Email VARCHAR(255) UNIQUE,
                ContactNumber VARCHAR(15),
                Address TEXT,
                Status ENUM('Active', 'Inactive', 'Prospect') DEFAULT 'Prospect',
                AssignedUserId INT,
                FOREIGN KEY (AssignedUserId) REFERENCES Users(UserId)
            );
            
            CREATE TABLE IF NOT EXISTS Policies (
                PolicyId INT AUTO_INCREMENT PRIMARY KEY,
                CustomerId INT,
                Type ENUM('Life', 'Health', 'Auto', 'Property'),
                PolicyNumber VARCHAR(255),
                StartDate DATE,
                EndDate DATE,
                PremiumAmount DECIMAL(10,2),
                FOREIGN KEY (CustomerId) REFERENCES Customers(CustomerId)
            );
            
            CREATE TABLE IF NOT EXISTS Claims (
                ClaimId INT AUTO_INCREMENT PRIMARY KEY,
                PolicyId INT,
                DateFiled DATE,
                ClaimAmount DECIMAL(10,2),
                Status ENUM('Filed', 'Processing', 'Approved', 'Denied'),
                ResolutionDate DATE,
                FOREIGN KEY (PolicyId) REFERENCES Policies(PolicyId)
            );
            
            CREATE TABLE IF NOT EXISTS Interactions (
                InteractionId INT AUTO_INCREMENT PRIMARY KEY,
                CustomerId INT,
                UserId INT,
                Type ENUM('Email', 'Call', 'Visit', 'Mail'),
                Content TEXT,
                InteractionDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (CustomerId) REFERENCES Customers(CustomerId),
                FOREIGN KEY (UserId) REFERENCES Users(UserId)
            );
            
            CREATE TABLE IF NOT EXISTS Sales (
                SaleId INT AUTO_INCREMENT PRIMARY KEY,
                PolicyId INT,
                UserId INT,
                SaleAmount DECIMAL(10,2),
                SaleDate DATE,
                FOREIGN KEY (PolicyId) REFERENCES Policies(PolicyId),
                FOREIGN KEY (UserId) REFERENCES Users(UserId)
            );
            
            CREATE TABLE IF NOT EXISTS Appointments (
                AppointmentId INT AUTO_INCREMENT PRIMARY KEY,
                CustomerId INT,
                UserId INT,
                AppointmentDate DATETIME,
                Purpose TEXT,
                Status ENUM('Scheduled', 'Completed', 'Cancelled'),
                FOREIGN KEY (CustomerId) REFERENCES Customers(CustomerId),
                FOREIGN KEY (UserId) REFERENCES Users(UserId)
            );
            `;

            // Split the SQL statements and execute them individually
            const individualCreateTableStatements = createTablesSQL.split(';').filter(statement => statement.trim() !== '');

            individualCreateTableStatements.forEach(sql => {
                connection.query(sql, (err, results) => {
                    if (err) {
                        console.error("Error creating tables: ", err.message);
                    } else {
                        console.log("Table created successfully!");
                    }
                });
            });

            // End the database connection
            connection.end();
        });
    });
});
