
# Sweety – Blood Glucose Tracker (Frontend)

## Project Overview

Sweety is a Blood Glucose Tracking web application that helps users record, manage, and monitor their daily blood glucose readings.

This repository contains the frontend application built using React and Vite. It provides a simple and user-friendly interface for user authentication, glucose reading management, and viewing dashboard summaries.

## Technologies Used

- React.js
- JavaScript
- Vite
- HTML5
- CSS3
- React Router DOM
- Fetch API
- JWT Authentication

## Features

- User registration with name, email, and password.
- User login with authentication.
- Dashboard displaying glucose reading summaries.
- Add new blood glucose readings.
- View reading history.
- Edit existing readings.
- Delete readings.
- Display total number of readings.
- Display average glucose level.
- Display the latest glucose reading.
- Responsive user interface.
- Secure API communication using JWT authentication.

## Project Structure

```text
sweety-Frontend/
│
├── public/
│
├── src/
│   ├── assets/
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── Dashboard.jsx
│   │
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
│
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

## Prerequisites

Install the following before running the project:

- Node.js
- npm
- Git

## Installation

Clone the repository:

```bash
git clone https://github.com/Navyasripuvvada/sweety-Frontend.git
```

Navigate to the project directory:

```bash
cd sweety-Frontend
```

Install dependencies:

```bash
npm install
```

## Backend Configuration

The frontend communicates with the Sweety backend API.

Make sure the backend is running at:

```text
http://localhost:3000
```

The backend repository is available here:

https://github.com/Navyasripuvvada/sweety-Backend

## Running the Application

Start the frontend development server:

```bash
npm run dev
```

Open the application in your browser:

```text
http://localhost:5173
```

## Available Pages

| Page | Route | Description |
|---|---|---|
| Login | `/` | User login |
| Register | `/register` | New user registration |
| Dashboard | `/dashboard` | Manage glucose readings and view summaries |

## Application Workflow

1. Register using your name, email, and password.
2. Log in using your registered credentials.
3. Access the dashboard.
4. Add blood glucose readings by selecting a date, time slot, and glucose value.
5. View previously recorded readings.
6. Edit or delete existing readings.
7. View glucose summary information on the dashboard.
8. Log out securely.

## Authentication

The frontend integrates with the backend JWT authentication system.

- The access token is stored in browser local storage after successful login.
- The token is included in API requests to protected endpoints.
- Users are redirected to the login page when their authentication session is no longer valid.
- Logging out clears the stored authentication information.

## Build for Production

To create a production build:

```bash
npm run build
```

The generated production files are available in the `dist` directory.

To preview the production build locally:

```bash
npm run preview
```

## Testing

Run the production build to check for frontend compilation errors:

```bash
npm run build
```

## Notes and Assumptions

- The frontend uses the backend API for authentication and glucose reading operations.
- Each user can manage only their own glucose readings.
- Glucose values are displayed in mg/dL.
- The dashboard retrieves reading information from the backend.
- PostgreSQL data is accessed through the backend API.

## Future Improvements

- Daily, month-to-date, and previous-month report views.
- Glucose trend charts.
- Improved dashboard filtering.
- Frontend component and integration tests.
- Enhanced accessibility and user experience.

## Author

Developed as part of the Junior Full Stack Developer – JavaScript & AI technical assignment.
