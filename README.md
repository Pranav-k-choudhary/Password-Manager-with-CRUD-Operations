## VaultX - Password Manager

VaultX is a secure and user-friendly password management web application designed to help users organize and protect their login credentials. In today's digital world, individuals use numerous online services and often struggle to remember multiple passwords. This frequently leads to password reuse or insecure storage practices.
VaultX provides a centralized platform where users can securely store, manage, and access their credentials through an authenticated dashboard. The project demonstrates the practical implementation of full-stack web development concepts while emphasizing usability and secure access control.

## Problem Statement
Managing multiple passwords for different websites and applications has become a major challenge. Users often:
  - Forget their passwords.
  - Reuse the same passwords across multiple platforms.
  - Store passwords in insecure locations such as notes or spreadsheets.
  - Face security risks due to poor password management practices.
There is a need for a secure, simple, and efficient system that allows users to manage all their credentials in one place while ensuring that only authorized users can access their data.

## Features
-> User Authentication
   - User registration with email validation.
   - Secure login system.
   - JWT-based authentication.
   - Automatic login after successful registration.
   - Session validation and expiration handling.
   - Logout functionality.
-> Password Management
   - Add new credentials.
   - View saved passwords.
   - Edit existing credentials.
   - Delete credentials permanently.
   - Store website URL, username, and password.
   - User-specific credential isolation.
-> User Experience Features
   - Password visibility toggle.
   - Copy credentials to clipboard.
   - Pagination for better readability.
   - Real-time toast notifications.
   - Responsive user interface.
-> Security Features
   - Password hashing using bcryptjs.
   - Protected API routes.
   - JWT token validation.
   - Authorization-based access control.
   - Separate records for each user.

## Tech Stack
-> Frontend
   - React.js
   - Tailwind CSS
   - React Toastify
-> Backend
   - Node.js
   - Express.js
-> Authentication & Security
   - JWT (JSON Web Token)
   - bcryptjs
-> Database
  JSON-based local database
     - users.json
     - passwords.json
    
## Workflow
>> User Registration
   - User enters email, password, and confirm password.
   - Backend validates the information.
   - Password is hashed using bcryptjs.
   - User details are stored in users.json.
   - JWT token is generated.
   - User is automatically logged in.
>> User Login
   - User submits login credentials.
   - Backend verifies the email and password.
   - JWT token is generated.
   - Token is stored in session storage.
   - User gains access to the dashboard.
>> Session Validation
   - Stored JWT token is validated whenever the application loads.
   - If the token is valid, access is granted.
   - If invalid or expired, the user is logged out automatically.
>> Add Credentials
   - User enters website URL, username, and password.
   - Frontend performs validation.
   - Request is sent to the backend.
   - Credential is stored in passwords.json.
   - Dashboard updates instantly.
>> View Credentials
   - Authenticated users request their saved passwords.
   - Backend filters records using user ID.
   - Only the logged-in user's credentials are returned.
   - Data is displayed on the dashboard.
>> Edit Credentials
   - User selects a credential to edit.
   - Existing data populates the form.
   - Updated information is submitted.
   - Backend updates the stored record.
   - Changes appear immediately.
>> Delete Credentials
   - User confirms deletion.
   - Backend removes the selected credential.
   - The interface refreshes automatically.

## Future Enhancements
- Integration with MongoDB.
- Search and filtering capabilities.
- Email verification.
- Biometric authentication.
- Mobile application support.

