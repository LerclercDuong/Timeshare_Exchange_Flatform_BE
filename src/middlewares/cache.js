
const redis = require('redis');
const axios = require('axios');
const CacheMiddleware = async (req, res, next) => {
    try {
        const client = redis.createClient({
            // url: process.env.REDIS_URI
        });
        await client.connect();
        const cachedData = await client.get('cachedData');
        if (cachedData) {
            return res.json(JSON.parse(cachedData));
        } else {
            const response = await axios.get(`http://localhost:8080/api/v2/timeshare/query`);
            const { data } = response;
            await client.set('cachedData', JSON.stringify(data));
            return res.json(data);
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
}
async function deleteCachedData() {
    try {
        const client = redis.createClient({
            // url: process.env.REDIS_URI
        });
        await client.connect();
        await client.del('cachedData');
        console.log("Cached data deleted successfully.");
    } catch (err) {
        console.error("Error deleting cached data:", err);
    }
}

setInterval(deleteCachedData, 2000000);//10p

module.exports = CacheMiddleware;
