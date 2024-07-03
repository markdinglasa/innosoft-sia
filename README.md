# SM-SIA Application
- Introduction
  - The SM-SIA application is a desktop application designed to facilitate SM-SIA Accreditation. This document provides comprehensive information on the functionalities, installation, usage, and troubleshooting of the application. The SM-SIA application should be robust, secure, and user-friendly, providing a high-quality experience to its users.

# Non-Functionalities
  - **Performance**
    -  [x] Response Time: The application should have a response time of less than 2 seconds for database operations under normal load.
    -  [x] Throughput: The application should handle up to 1000 concurrent records without performance degradation.
  - **Reliability**
    -  [x] Availability: The application should have an availability of 99.9%, ensuring it is operational 24/7 with minimal downtime.
    -  [x] Error Handling: The application should handle errors gracefully, providing meaningful error messages and logging the errors for further analysis.
  - **Security**
    -  [x] Authentication: The application should enforce user authentication using secure methods (e.g., OAuth, JWT).
    -  [x] Data Encryption: All sensitive data should be encrypted both in transit and at rest using industry-standard encryption methods.
    -  [x] Audit Logging: The application should log all critical operations and access to sensitive data for audit purposes.
  - **Usability**
    -  [x] User Interface: The application should have an intuitive and user-friendly interface that complies with standard usability principles.
    -  [x] Accessibility: The application should be accessible to users with disabilities, complying with WCAG 2.1 standards.
  - **Compatibility**
    -  [x] Operating Systems: The application should be compatible with major operating systems (Windows, macOS, Linux).
    -  [x] Database Systems: The application should support specific database system ( MSSQL Server 2008).
  - **Interoperability**
    -  [x] Data Export: The application should support exporting data in common formats (e.g., CSV, JSON, XML, XLS, PDF).
  - **Maintainability**
    - [x] Code Quality: The codebase should follow industry best practices, including proper naming conventions, modularity, and documentation.
    - [x] Automated Testing: The application should have automated unit and integration tests to ensure code quality and facilitate continuous integration.
    - [x] Auto Start: The application should automatically start upon system reboot without requiring manual intervention from the user.
    - Configuration:
      - The auto-start feature should be configurable, allowing users to enable or disable it based on their preference.
      - Provide an option in the settings menu to toggle the auto-start functionality.
# Functionalities
- [x] Database configuration
  - Details: 
    - The database configuration can be configured only once if successfully connected.
    - The configuration is persistent, meaning it remains the same even after shutting down or restarting the computer.
    - The application will not proceed to the next page/step if the database connection is not established.
  - Inputs:
    - Host: The IP address or hostname of your database server.
    - Port: The port number your database server is listening on.
    - Username: The username for accessing the database.
    - Password: The password associated with the username.
    - Database Name: The name of the database to connect to.
  - Persistence:
    - The database configuration is saved locally on your machine.
    - It remains intact across application restarts and system reboots.
  - Initial Setup:
    - The database configuration is mandatory on the first run.
    - Subsequent launches will use the saved configuration unless manually changed.

- [x] Persistent User Authentication
  - Details:
    - The application should support persistent user authentication. Once a user logs in, their session should remain active across application restarts and system reboots until they explicitly choose to log out.
    - Use secure methods to store authentication tokens or session information locally.
    - Ensure that sensitive data such as tokens are encrypted and securely stored.
  
- [x] Dashboard
    - Details: 
      - Todays Revenue Chart: 
      - Monthly Revenue Chart:

- [x] Initialize Button // to-be-discuss
  - Details:
    - This button initialize the auto-creation of reports
    - Selects a directory in which to put the folder SIA
      - The SIA folder contains the transaction records of the POS
      - The transactions are group by month (e.g 06_2024_Transactions.csv)
    - SIA
      - It should create a Folder SIA if it doesn't exist on setted location. // constraints cannot create folder in `Dir C`  hence needs Administrator access right
      - It create a CSV file in SIA.
      - The CSV file name should have a format of MM_YYYY_Transaction.csv
      - The CSV should contain all of the transactions made within the month.

- [x] Reports Page
  - Details:
    - The reports page are the SM-SIA reports, the user may generate reports.
    - Has filter date to which transaction start and ends, after generating the report it should preview. Then the user may choose what kind of file it should export to. (CSV, XLS, PDF)

