﻿# Job-Sage
Job Sage - AI-Powered Job Portal

Project Overview

Job Sage is an AI-powered career guidance and job application platform designed to bridge the gap between job seekers and employers. It offers a smart, fast, and user-friendly experience for registration, resume building, job browsing, applying, skill gap analysis, and interview preparation.

Built with Node.js, Express.js, and MongoDB, it leverages powerful technologies to deliver scalable APIs, AI recommendations, and real-time interactions.

Key Features

Authentication & Authorization

User registration and login with JWT-based authentication.

Secure password hashing with Bcrypt.

Resume Builder

ATS-friendly resume management.

AI Job Matching

AI algorithms to match user profiles with job opportunities.

Job Management

Users can browse, filter, and apply for jobs.

Interview Assistant


Skill Evaluation

Identify skill gaps and recommend learning paths.

Notifications & Email Support

OTP-based email verification and password recovery.

Tech Stack

Backend: Node.js, Express.js

Database: MongoDB, Mongoose

Authentication: JWT, Bcrypt

Email Services: Nodemailer

Validation: Joi

Security: Helmet, CORS, Crypto.js

Folder Structure

JOBSAGE/
├── database/
│   └── dbConnection.js
├── models/
│   └── user.models.js
├── node_modules/
├── src/
│   ├── email/
│   │   ├── email.Html.js
│   │   └── email.js
│   ├── handlers/
│   │   └── handlers.js
│   ├── middleware/
│   │   ├── catchError.js
│   │   ├── checkEmail.js
│   │   ├── globalError.js
│   │   └── verifyToken.js
│   └── modules/
│       ├── auth/
│       │   └── auth.controller.js
│       └── user/
│           ├── user.controller.js
│           ├── user.routes.js
│           └── user.validation.js
├── bootstrap.js
├── utils/
│   ├── appError.js
│   └── api.features.js
├── .env
├── .gitignore
├── DSS
├── index.js
├── package-lock.json
├── package.json
└── README.md

API Documentation

Access the full API collection here:
👉 Job Sage Postman Documentation:https://documenter.getpostman.com/view/30631827/2sAYdbQZdM

Installation & Setup

# Clone the repository
$ git clone https://github.com/mennaseif/Job-Sage.git

# Navigate to project folder
$ cd jobsage

# Install dependencies
$ npm install

# Set up your environment variables (.env)
MONGODB_URI=your_mongo_uri
JWT_SECRET=your_secret_key
EMAIL_USER=your_email
EMAIL_PASS=your_password

# Run the server
$ npm run dev

The server will start on http://localhost:5000/ by default.

Available Scripts

npm run dev: Run in development mode with nodemon.

npm run start: Start the server normally.

Security Measures

JWT authentication & refresh strategies

Password encryption with Bcrypt

Validation with Joi

Helmet for HTTP security headers

Secure environment configuration with dotenv

Future Improvements

AI Chatbot for career guidance

GraphQL gateway for optimized queries

Real-time notifications via WebSocket

Contributions

We welcome contributions! Please see CONTRIBUTING.md for guidelines.

License

This project is for educational purposes under the Higher Technological Institute graduation requirements.

Made with passion by the Job Sage Backend Team.


