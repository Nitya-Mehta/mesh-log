# Mesh Log

A real-time production logging system with Google authentication that captures machine data and stores it in Google Sheets with structured formatting and shift classification.

## Overview

Mesh Log is a web-based logging system designed to simplify data entry and tracking in industrial workflows. It allows authenticated users to securely input production details, which are recorded and organized for analysis.

## Authentication

- Google Sign-In for secure access
- Authorized user flow for production logging
- User identity capture for accountability

## Features

- Production data entry through a web interface
- Automatic date and time logging
- Shift classification based on current time
- Google Sheets integration
- Structured data storage for tracking and reporting
- Secure access using Google authentication

## How It Works

1. User signs in with a Google account.
2. User selects mills and enters production data.
3. Data is submitted through the app backend.
4. The backend forwards the entry to Google Apps Script.
5. Google Apps Script appends the entry to a Google Sheet.

## Tech Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Vercel serverless function
- Automation: Google Apps Script
- Database: Google Sheets
- Authentication: Google OAuth
- Hosting: Vercel

## Local Development

```bash
cp .env.example .env
make dev
```

Open the local URL printed by Vercel.

## Author

Nitya Mehta  
GitHub: https://github.com/Nitya-Mehta
