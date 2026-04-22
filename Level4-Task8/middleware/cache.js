const NodeCache = require('node-cache');

// Cache with 5 minutes TTL
const cache = new NodeCache({ stdTTL: 300 });

module.exports = (duration) => (req, res, next) => {
    // Skip cache for non-GET requests
    if (req.method !== 'GET') {
        return next();
    }

    const key = req.originalUrl;
    const cachedResponse = cache.get(key);

    if (cachedResponse) {
        console.log(`Cache HIT for: ${key}`);
        return res.json({
            ...cachedResponse,
            fromCache: true
        });
    }

    console.log(`Cache MISS for: ${key}`);

    // Override res.json to cache the response
    const originalJson = res.json.bind(res);
    res.json = (data) => {
        cache.set(key, data, duration);
        return originalJson(data);
    };

    next();
};
