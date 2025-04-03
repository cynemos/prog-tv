import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const port = 3000;

const corsOptions = {
  origin: '*' // Allow all origins for testing
};

app.use(cors(corsOptions));

app.get('/proxy', async (req, res) => {
  const targetUrl = 'https://xmltv.ch/xmltv/xmltv-tnt.zip';
  console.log(`Proxy request to: ${targetUrl}`); // Log target URL

  try {
    console.log('Fetching data from:', targetUrl); // Log before fetch
    const response = await fetch(targetUrl, {
      timeout: 30000 // Increased timeout to 30 seconds
    });
    console.log('Fetch response status:', response.status); // Log response status
    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`); // Log the HTTP status code
      return res.status(response.status).send(`Erreur lors de la récupération des données: ${response.status} ${response.statusText}`);
    }
    const data = await response.buffer();

    // Log headers being set by CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    console.log('CORS Headers:', res.getHeaders());

    res.set('Content-Type', 'application/zip');
    res.send(data);
  } catch (error) {
    console.error("Erreur lors de la requête vers xmltv.ch:", error.message, error.stack); // Log error message and stack trace
    res.status(500).send('Erreur interne du serveur proxy');
  }
});

app.listen(port, () => {
  console.log(`Serveur proxy en écoute sur http://localhost:${port}`);
});
