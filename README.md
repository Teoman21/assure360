# Project Database Setup and Initialization

This guide will help you set up the necessary tables and databases for the project.

## Prerequisites

- Node.js installed on your system
- MySQL database server (e.g., MAMP) running

## Setup Instructions

1. **Clone the Repository**

    ```bash
    git clone <https://github.com/Teoman21/assure360.git>
    cd <https://github.com/Teoman21/assure360.git>
    ```

2. **Navigate to the Scripts Directory**

    ```bash
    cd server/src/scripts
    ```

3. **Initialize the Database**

    Run the following command to initialize the database:

    ```bash
    node initDb.js
    ```

    Make sure to check the logs for any errors or warnings.

4. **Start and Connect to the Database**

    Open your MySQL database server (e.g., MAMP).

5. **Start the Server**

    Navigate to the server directory:

    ```bash
    cd ../../
    ```

    Then start the server:

    ```bash
    npm start
    ```

## Additional Notes

- If you encounter any issues during the setup process, refer to the logs for troubleshooting.
- Ensure that the database server is running before attempting to connect.
