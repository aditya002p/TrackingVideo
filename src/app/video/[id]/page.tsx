'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import VideoPlayer from '../../../components/VideoPlayer';
import { Video } from '../../../types';

// Mock user ID (in a real app, this would come from authentication)
const MOCK_USER_ID = 'user-123';

// Mock videos database (in a real app, this would come from an API)
const VIDEOS_DB: Video[] = [
  {
    id: 'video-1',
    title: 'Introduction to JavaScript',
    description: 'Learn the basics of JavaScript programming language.',
    url: '/videos/react-hooks.mp4',
    thumbnail: '/videos/thumbnail.png',
    duration: 300 // 5 minutes
  },
  {
    id: 'video-2',
    title: 'Advanced React Hooks',
    description: 'Dive deep into React Hooks and learn advanced patterns.',
    url: '/videos/react-hooks.mp4',
    thumbnail: '/videos/thumbnail.png',
    duration: 480 // 8 minutes
  },
  {
    id: 'video-3',
    title: 'CSS Grid Layout',
    description: 'Master CSS Grid layout for modern web design.',
    url: '/videos/react-hooks.mp4',
    thumbnail: '/videos/thumbnail.png',
    duration: 420 // 7 minutes
  }
];

export default function VideoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const videoId = params.id as string;
  
  const [video, setVideo] = useState<Video | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // In a real app, this would be an API call
    const fetchVideo = () => {
      setIsLoading(true);
      
      try {
        const foundVideo = VIDEOS_DB.find(v => v.id === videoId);
        
        if (foundVideo) {
          setVideo(foundVideo);
          setError(null);
        } else {
          setError('Video not found');
          setVideo(null);
        }
      } catch (err) {
        setError('Failed to load video');
        setVideo(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (videoId) {
      fetchVideo();
    }
  }, [videoId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="min-h-screen p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error || 'Something went wrong'}</p>
            </div>
          </div>
        </div>
        <button 
          onClick={() => router.push('/')}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="mb-6">
        <button 
          onClick={() => router.push('/')}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Videos
        </button>
      </div>

      <VideoPlayer 
        videoUrl={video.url}
        videoId={video.id}
        userId={MOCK_USER_ID}
        videoDuration={video.duration}
        title={video.title}
      />

      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-2">{video.title}</h2>
        <p className="text-gray-600 mb-4">{video.description}</p>
        
        <div className="border-t pt-4 mt-4">
          <h3 className="text-lg font-semibold mb-2">About this lecture</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Duration</p>
              <p className="font-medium">{Math.floor(video.duration / 60)} minutes</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Topics</p>
              <p className="font-medium">Programming, Web Development</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Related Videos</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {VIDEOS_DB.filter(v => v.id !== video.id).map((relatedVideo) => (
            <div 
              key={relatedVideo.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => router.push(`/video/${relatedVideo.id}`)}
            >
              <div className="relative pb-[56.25%]">
                <img 
                  src={relatedVideo.thumbnail || `/api/placeholder/400/225`} 
                  alt={relatedVideo.title}
                  className="absolute top-0 left-0 w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-medium mb-1">{relatedVideo.title}</h3>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">{relatedVideo.description}</p>
                <span className="text-sm text-gray-500">{Math.floor(relatedVideo.duration / 60)} min</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}