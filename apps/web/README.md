# DuyKan Movie Platform

A modern web application for managing and streaming movies with Firebase authentication and database.

## Features

- User authentication with Firebase
- Movie management system
- Admin dashboard
- Responsive design with Tailwind CSS
- React Router for navigation

## Technology Stack

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **UI Components**: Radix UI, Lucide Icons
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Environment Variables

Create a `.env.local` file in the root of the project:

```env
VITE_POCKETBASE_URL=http://127.0.0.1:8090
VITE_API_URL=http://127.0.0.1:8090/api
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Development

Start the development server:

```bash
npm run dev
```

### Production Build

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Deployment

### Firebase Hosting

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Initialize Firebase Hosting:
   ```bash
   firebase init hosting
   ```

3. Deploy:
   ```bash
   firebase deploy
   ```

### Vercel

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

## Project Structure

```
src/
├── components/
│   ├── admin/          # Admin components
│   ├── common/         # Common components
│   ├── forms/          # Form components
│   └── ui/             # UI components
├── contexts/           # React contexts
├── lib/               # Utility functions
├── pages/             # Page components
└── styles/            # Global styles
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
