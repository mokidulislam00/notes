# Notes Application

A modern, feature-rich notes application with CRUD operations, dynamic routes, MongoDB integration, and beautiful animations.

## Features

### Core Functionality
- Create notes with custom colors and tags
- Edit notes with color and tag management
- Delete notes with confirmation
- View individual notes
- Search notes by title, content, or tags
- Pin important notes to the top
- Filter notes (All, Pinned, Recent)

### Design & UX
- Beautiful gradient background
- Smooth animations and transitions
- Responsive design for all devices
- Color picker for note customization
- Tag system for organization
- Toast notifications for user feedback
- Modern card-based layout
- Font Awesome icons
- Hover effects and interactive elements

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- Font Awesome (icons)

## Prerequisites

- Node.js installed
- MongoDB installed and running

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Make sure MongoDB is running on your machine:
```bash
# On Windows
mongod

# On macOS/Linux
sudo systemctl start mongod
# or
mongod
```

3. Configure MongoDB connection (optional):
Edit the `.env` file to set your MongoDB URI:
```
MONGODB_URI=mongodb://localhost:27017/notes-app
PORT=3000
```

4. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

5. Open your browser and navigate to:
```
http://localhost:3000
```

## API Endpoints

- `GET /api/notes` - Get all notes
- `GET /api/notes/:id` - Get a single note by ID
- `POST /api/notes` - Create a new note
- `PUT /api/notes/:id` - Update a note
- `DELETE /api/notes/:id` - Delete a note
- `GET /api/notes/search/:query` - Search notes by title, content, or tags
- `PATCH /api/notes/:id/pin` - Toggle pin status of a note

## Project Structure

```
notes/
├── public/
│   ├── index.html    # Frontend HTML
│   ├── style.css     # Frontend styles with animations
│   └── app.js        # Frontend JavaScript
├── models/
│   └── Note.js       # Mongoose Note model
├── routes/
│   └── notes.js      # API routes
├── server.js         # Express server
├── package.json      # Project dependencies
└── .env             # Environment variables
```

## Note Schema

```javascript
{
  title: String (required),
  content: String (required),
  tags: [String] (optional),
  color: String (default: '#ffffff'),
  isPinned: Boolean (default: false),
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-updated)
}
```

## Color Options

- White (#ffffff)
- Yellow (#ffeaa7)
- Blue (#74b9ff)
- Green (#55efc4)
- Red (#ff7675)
- Purple (#a29bfe)
- Pink (#fd79a8)

## Animations

- Slide down header animation
- Pop-in statistics animation
- Slide up search bar animation
- Scale-in modal animation
- Staggered note card animations
- Hover effects on cards and buttons
- Toast notification animations
- Color picker scale effects
