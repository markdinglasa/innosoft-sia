# INNOSOFT-SIA Application

- Introduction
  - The INNOSOFT-SIA (iSIA) application is a desktop application designed to facilitate SM-SIA Accreditation. This document provides comprehensive information on the functionalities, installation, usage, and troubleshooting of the application. The INNOSOFT-SIA application should be robust, secure, and user-friendly, providing a high-quality experience to its users.

# Non-Functionalities

- **Performance**
  - [x] Response Time: The application should have a response time of less than 2 seconds for database operations under normal load.
  - [x] Throughput: The application should handle up to 1000 concurrent records without performance degradation.
- **Reliability**
  - [x] Availability: The application should have an availability of 99.9%, ensuring it is operational 24/7 with minimal downtime.
  - [x] Error Handling: The application should handle errors gracefully, providing meaningful error messages and logging the errors for further analysis.
- **Security**
  - [x] Authentication: The application should enforce user authentication using secure methods (e.g., OAuth, JWT).
  - [x] Data Encryption: All sensitive data should be encrypted both in transit and at rest using industry-standard encryption methods.
  - [x] Audit Logging: The application should log all critical operations and access to sensitive data for audit purposes.
- **Usability**
  - [x] User Interface: The application should have an intuitive and user-friendly interface that complies with standard usability principles.
  - [x] Accessibility: The application should be accessible to users with disabilities, complying with WCAG 2.1 standards.
- **Compatibility**
  - [x] Operating Systems: The application should be compatible with major operating systems (Windows, macOS, Linux).
  - [x] Database Systems: The application should support specific database system ( MSSQL Server 2008).
- **Interoperability**
  - [x] Data Export: The application should support exporting data in common formats (e.g., CSV, JSON, XML, XLS, PDF).
- **Maintainability**
  - [x] Code Quality: The codebase should follow industry best practices, including proper naming conventions, modularity, and documentation.
  - [x] Automated Testing: The application should have automated unit and integration tests to ensure code quality and facilitate continuous integration.
  - [x] Auto Start: The application should automatically start upon system reboot without requiring manual intervention from the user.
  - Configuration:
    - The auto-start feature should be configurable, allowing users to enable or disable it based on their preference.
    - Provide an option in the settings menu to toggle the auto-start functionality.

# Functionalities

- [x] Licensing, this software requires a license to use.
- [x] Database configuration
- [x] SIA path selection, in this function the implementor should check if the selected path needs further more access rights to write and read
- [x] Automatic generation of SIA report, the generation of report reboots after every 5mins
