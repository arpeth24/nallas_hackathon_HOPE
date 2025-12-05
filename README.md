# HOPE - Community Gathering Platform

A web application to discover and organize community gatherings by event type.

## Features

- User registration with personal details
- Browse all community gatherings
- Search gatherings by keyword or event type
- Host your own meeting
- View gathering details with event schedule
- Photo gallery of previous gatherings
- Participate in gatherings ("I am there" toggle)

## Tech Stack

- **Frontend**: React, React Router, CSS3
- **Backend**: Node.js, Express.js
- **API**: RESTful API

## Project Structure

## 🔒 Security & Setup

### Firebase Key Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project → **Project Settings** → **Service Accounts**
3. Click **Generate New Private Key**
4. Save as `backend/firebase-key.json`
5. **Never commit this file** - it's in `.gitignore`

### Environment Variables

**Frontend (.env):**

