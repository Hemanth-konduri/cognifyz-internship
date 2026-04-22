const express = require('express');
const router = express.Router();
const axios = require('axios');
const cache = require('../middleware/cache');

// In-memory job queue
const jobQueue = [];
let jobIdCounter = 1;

// GET all jobs in queue
router.get('/jobs', cache(60), (req, res) => {
    res.json({
        total: jobQueue.length,
        jobs: jobQueue
    });
});

// POST - add job to queue
router.post('/jobs', async (req, res) => {
    const { type, data } = req.body;

    if (!type || !data) {
        return res.status(400).json({ message: 'Job type and data are required' });
    }

    const job = {
        id: jobIdCounter++,
        type,
        data,
        status: 'pending',
        createdAt: new Date()
    };

    jobQueue.push(job);
    console.log(`Job added to queue: ${JSON.stringify(job)}`);

    // Process job in background
    processJob(job);

    res.status(201).json({
        message: 'Job added to queue',
        job
    });
});

// Background job processor
async function processJob(job) {
    console.log(`Processing job ${job.id} of type ${job.type}...`);

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

    const index = jobQueue.findIndex(j => j.id === job.id);
    if (index !== -1) {
        jobQueue[index].status = 'completed';
        jobQueue[index].completedAt = new Date();
        console.log(`Job ${job.id} completed!`);
    }
}

// GET weather with caching
router.get('/weather/:city', cache(300), async (req, res) => {
    try {
        const { city } = req.params;
        console.log(`Fetching weather for: ${city}`);

        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`
        );

        const weatherData = {
            city: response.data.name,
            country: response.data.sys.country,
            temp: Math.round(response.data.main.temp),
            feels_like: Math.round(response.data.main.feels_like),
            humidity: response.data.main.humidity,
            description: response.data.weather[0].description,
            wind_speed: response.data.wind.speed,
            fromCache: false
        };

        res.json(weatherData);

    } catch (err) {
        if (err.response && err.response.status === 404) {
            res.status(404).json({ message: 'City not found' });
        } else {
            res.status(500).json({ message: 'Error fetching weather', error: err.message });
        }
    }
});

// GET cache stats
router.get('/cache-stats', (req, res) => {
    const NodeCache = require('node-cache');
    res.json({
        message: 'Cache is working with node-cache',
        ttl: '300 seconds for weather, 60 seconds for jobs',
        description: 'Responses are cached to avoid repeated API calls'
    });
});

module.exports = router;