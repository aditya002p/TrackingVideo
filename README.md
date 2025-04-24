# Video Progress Tracker

A sophisticated video progress tracking system that accurately measures how much of a lecture video a user has actually watched. Unlike conventional systems that simply mark videos as complete when they finish playing, this system only counts new parts of the video that have been watched, preventing progress from being recorded when users skip content or re-watch sections.

## Features

- **Track Real Progress**: Only count unique parts of the video the user has watched
- **Prevent Skipping**: Progress is not counted for skipped sections
- **Save and Resume**: Store user's progress for seamless continuation
- **Visual Progress Indicator**: Show progress as a percentage and visual bar
- **Persistent Storage**: Support for both cache-based and API-based storage

## Project Structure

```
video-progress-tracker/
│
├── frontend/                # Next.js frontend
│   ├── public/
│   │   └── videos/          # Sample videos for demo
│   │
│   ├── src/
│   │   ├── app/             # Next.js app router
│   │   ├── components/      # React components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API services
│   │   ├── types/           # TypeScript type definitions
│   │   └── utils/           # Utility functions
│   │
│   ├── package.json
│   └── next.config.js
│
└── README.md                # Project documentation
```

## Technical Implementation

### Tracking Watched Intervals

The core functionality of this system is based on tracking intervals of time that a user has watched. Here's how it works:

1. **Interval Recording**: When a user is watching a video, we continuously record the interval they're viewing.
2. **Interval Merging**: When intervals overlap (e.g., if a user watches 0-20s and then 15-30s), we merge them into a single interval (0-30s).
3. **Progress Calculation**: The total unique time watched divided by the video duration gives us the progress percentage.

### Key Components

- **VideoPlayer**: Manages video playback and events
- **useVideoProgress**: Custom hook that handles the core logic for tracking intervals
- **progressService**: Service for communicating with the backend API
- **intervalUtils**: Utility functions for interval operations

## Setup and Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/video-progress-tracker.git
   cd video-progress-tracker
   ```

2. Install dependencies:
   ```
   cd frontend
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the `frontend` directory with the following content:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

4. Run the development server:
   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application

## Backend Integration

The frontend is designed to work with the provided FastAPI backend. If the backend is not available, the system will fall back to using in-memory storage for development and testing purposes.

## Design Decisions

### 1. Interval-Based Tracking

Instead of simply tracking a single "furthest watched" position, we track all intervals that have been watched. This allows us to:
- Handle non-linear viewing patterns
- Calculate precise progress percentages
- Properly handle skipped content

### 2. Client-Side Processing with Server-Side Persistence

We process intervals on the client-side for real-time feedback but persist the merged intervals to the server for permanent storage. This hybrid approach provides a responsive user experience while ensuring data isn't lost between sessions.

### 3. Fallback to In-Memory Storage

For development and testing, the system can operate entirely client-side using in-memory storage. This makes local development easier and provides a graceful degradation path if the backend is unavailable.

## Challenges and Solutions

### Challenge: Handling Frequent Updates

**Problem**: Sending updates to the server on every time update would create excessive network traffic.

**Solution**: We batch updates and only send to the server when the user pauses, seeks, or leaves the page.

### Challenge: Precise Interval Merging

**Problem**: Ensuring that overlapping intervals are correctly merged without double-counting.

**Solution**: Implemented a robust interval merging algorithm that sorts intervals by start time and combines overlapping segments.

### Challenge: Handling Edge Cases

**Problem**: Users might exhibit unexpected behavior like rapid seeking, page refreshes, etc.

**Solution**: Added event listeners for various video events (seeking, ended, pause) and browser events (beforeunload) to ensure progress is saved in all scenarios.

## Improvements for Production

1. Add authentication for user identification
2. Implement caching strategies to reduce server load
3. Add analytics to track user engagement patterns
4. Optimize for mobile devices and different video formats
5. Add support for chapters and sectional progress tracking