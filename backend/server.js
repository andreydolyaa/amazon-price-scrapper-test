const express = require('express');
const path = require('path');
const app = express();
const http = require('http').createServer(app);
const cors = require('cors');
const bodyParser = require('body-parser');
const { track, getItem } = require('./services');
const { sendEmail } = require('./emailService');
const { send } = require('process');

app.use(bodyParser.json());

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'public')));
} else {
    const corsOptions = {
        origin: ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:5500'],
        credentials: true
    };
    app.use(cors(corsOptions));
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/subscribe', (req, res) => {
    track(req.body)
    res.end();
})

app.post('/item', async (req, res) => {
    const { URL } = req.body
    var item = await getItem(URL);
    res.send(item);
})


app.get('/unsubscribe', (req, res) => {
    var data = 'unsubscribe';
    sendEmail(data);
    track(data);
    res.send('YOU HAVE UNSUBSCRIBED').end();
})

const port = process.env.PORT || 3001;
http.listen(port, () => {
    console.log(`Server started on port ${port}`);
})
