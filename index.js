const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

function filterGamePasses(gamePasses, targetCreatorId) {
    return gamePasses.filter(gamePass => 
        gamePass.creator && 
        gamePass.creator.creatorId.toString() === targetCreatorId.toString()
    );
}

app.get('/api/game-passes/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const count = req.query.count || 100;

        const url = `https://apis.roblox.com/game-passes/v1/users/${userId}/game-passes?count=${count}`;

        const headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };

        const response = await axios.get(url, { headers });

        res.json({
            success: true,
            userId: userId,
            gamePasses: filterGamePasses(response.data.gamePasses, userId),
            total: response.data.length
        });

    } catch (error) {
        console.error('Error fetching game passes:', error.message);
        
        res.status(500).json({
            success: false,
            error: error.message,
            message: 'Gagal mengambil data game passes dari Roblox API'
        });
    }
});

app.get('/', (req, res) => {
    res.json({
        message: 'Roblox Game Passes API Proxy',
        endpoints: {
            '/api/game-passes/:userId': 'Get game passes for specific user'
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Endpoints:`);
    console.log(`http://localhost:${PORT}/api/game-passes`);
    console.log(`http://localhost:${PORT}/api/game-passes/9275480939`);
});