import 'dotenv/config';
import axios from 'axios';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

/**
 * Extract video ID from various YouTube URL formats
 * Supports: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/shorts/ID, youtube.com/playlist?list=ID
 */
function extractVideoId(url) {
	if (!url || typeof url !== 'string') {
		return null;
	}

	// Standard youtube.com/watch?v=ID format
	const watchMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
	if (watchMatch) {
		return watchMatch[1];
	}

	// YouTube Shorts format: youtube.com/shorts/ID
	const shortsMatch = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/);
	if (shortsMatch) {
		return shortsMatch[1];
	}

	// Playlist format: youtube.com/playlist?list=ID (extract first video if available)
	const playlistMatch = url.match(/youtube\.com\/playlist\?list=([a-zA-Z0-9_-]+)/);
	if (playlistMatch) {
		// For playlists, we'd need to fetch the first video - for now return null
		return null;
	}

	return null;
}

/**
 * Fetch YouTube video details using YouTube Data API v3
 */
async function fetchYouTubeData(youtubeUrl) {
	const videoId = extractVideoId(youtubeUrl);

	if (!videoId) {
		throw new Error('Invalid YouTube URL');
	}

	const response = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
		params: {
			id: videoId,
			part: 'snippet,contentDetails',
			key: YOUTUBE_API_KEY,
		},
	});

	if (!response.data.items || response.data.items.length === 0) {
		throw new Error('Failed to fetch YouTube data');
	}

	const video = response.data.items[0];
	const snippet = video.snippet;
	const contentDetails = video.contentDetails;

	// Extract thumbnail URL (prefer maxres, then high, then medium)
	const thumbnails = snippet.thumbnails;
	const posterUrl = thumbnails.maxres?.url || thumbnails.high?.url || thumbnails.medium?.url || null;

	// Parse ISO 8601 duration to seconds
	const duration = parseDuration(contentDetails.duration);

	return {
		title: snippet.title,
		description: snippet.description,
		posterUrl,
		duration,
		uploader: snippet.channelTitle,
		videoId,
	};
}

/**
 * Convert ISO 8601 duration to seconds
 * Example: PT1H30M45S -> 5445
 */
function parseDuration(duration) {
	const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
	const matches = duration.match(regex);

	const hours = parseInt(matches[1] || 0, 10);
	const minutes = parseInt(matches[2] || 0, 10);
	const seconds = parseInt(matches[3] || 0, 10);

	return hours * 3600 + minutes * 60 + seconds;
}

export { fetchYouTubeData, extractVideoId };