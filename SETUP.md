# HOPE - Setup Instructions for Clients

## Prerequisites
- Node.js v14+ installed
- npm installed
- Firebase project created

## Backend Setup

1. Navigate to backend folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file with:
   ```
   PORT=5000
   NODE_ENV=development
   FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
   FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   ```

4. Add `firebase-key.json`:
   - Go to Firebase Console → Project Settings → Service Accounts
   - Click "Generate New Private Key"
   - Save as `backend/firebase-key.json`

5. Start backend:
   ```bash
   npm start
   ```
   Server runs on http://localhost:5000

## Frontend Setup

1. Navigate to frontend folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file with Firebase Web App credentials:
   ```
   REACT_APP_FIREBASE_API_KEY=your_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

4. Start frontend:
   ```bash
   npm start
   ```
   App runs on http://localhost:3000

## Firebase Configuration

1. Enable Firestore Database in Firebase Console
2. Enable Email/Password authentication in Authentication → Sign-in method
3. Set up Firestore Security Rules (optional for development)

## Running the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

Both will start automatically. Open http://localhost:3000 in your browser.

## Features
- User Registration & Login with Firebase Auth
- Create, Edit, Delete Gatherings
- Search Gatherings by Keyword or Event Type
- Photo Gallery with Upload Feature
- Participation Toggle ("I am there")
- Real-time Data with Firestore

## Troubleshooting

**Firebase Error "configuration-not-found":**
- Ensure all REACT_APP_FIREBASE_* variables are in `.env`
- Restart frontend after changing `.env`

**Backend connection error:**
- Verify backend is running on port 5000
- Check `firebase-key.json` path and permissions

**Database errors:**
- Ensure Firestore Database is enabled in Firebase Console
- Check Firebase Security Rules allow read/write operations
