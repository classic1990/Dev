import express from 'express';
import { fetchYouTubeData } from '../utils/youtube.js';
import logger from '../utils/logger.js';
import { verifyAuth } from '../middleware/auth.js';
import { getAdminClient } from '../lib/pocketbase.js';

const router = express.Router();

router.post('/fetch-youtube-data', async (req, res) => {
	const { youtubeUrl } = req.body;

	if (!youtubeUrl) {
		return res.status(400).json({ error: 'youtubeUrl is required' });
	}

	logger.info(`Fetching YouTube data for URL: ${youtubeUrl}`);

	const data = await fetchYouTubeData(youtubeUrl);

	logger.info(`Successfully fetched YouTube data for video: ${data.videoId}`);

	res.json(data);
});

// Create Movie
router.post('/', verifyAuth, async (req, res) => {
	try {
		const pb = await getAdminClient();
		const record = await pb.collection('movies').create(req.body);
		logger.info(`Created movie: ${record.id}`);
		res.json(record);
	} catch (error) {
		logger.error('Create movie error:', error);
		res.status(500).json({ error: error.message });
	}
});

// Update Movie
router.put('/:id', verifyAuth, async (req, res) => {
	try {
		const { id } = req.params;
		const pb = await getAdminClient();
		const record = await pb.collection('movies').update(id, req.body);
		logger.info(`Updated movie: ${id}`);
		res.json(record);
	} catch (error) {
		logger.error('Update movie error:', error);
		res.status(500).json({ error: error.message });
	}
});

// Delete Movie
router.delete('/:id', verifyAuth, async (req, res) => {
	try {
		const { id } = req.params;
		const pb = await getAdminClient();
		await pb.collection('movies').delete(id);
		logger.info(`Deleted movie: ${id}`);
		res.json({ success: true });
	} catch (error) {
		logger.error('Delete movie error:', error);
		res.status(500).json({ error: error.message });
	}
});

export default router;