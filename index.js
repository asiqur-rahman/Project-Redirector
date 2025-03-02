const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = 3000;
const httpPort = Number(process.env.PORT || port);

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Load URL mappings from appsettings.json
let urlMappings;
fs.readFile('appsettings.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading appsettings.json:', err);
        process.exit(1);
    }
    urlMappings = JSON.parse(data).urls;
});

app.get('/', (req, res) => {
    res.json({
        developedBy: "Md. Asiqur Rahman Khan",
        urls: urlMappings
    });
});

// Redirect based on URL mapping
app.get('/:shortUrl', (req, res) => {
    const shortUrl = req.params.shortUrl;
    const longUrl = urlMappings[shortUrl];

    if (longUrl) {
        res.redirect(longUrl.link);
    } else {
        res.json({
            statusCode:404,
            message:"Endpoint Not Found !",
            url:req.protocol + '://' + req.get('host') + req.originalUrl,
            developedBy: "Md. Asiqur Rahman Khan"
        });
    }
});

app.all('*', (req, res, next) => {
    res.json({
        statusCode:200,
        url:req.protocol + '://' + req.get('host') + req.originalUrl,
        developedBy: "Md. Asiqur Rahman Khan"
    });
});

app.listen(httpPort, () => {
    console.log(`URL shortener app listening at http://localhost:${httpPort}`);
});
