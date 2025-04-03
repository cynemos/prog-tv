import express from 'express';
import fetch from 'node-fetch';
const app = express();
const port = 3000;

app.get('/proxy', async (req, res) => {
  try {
    const response = await fetch('https://xmltv.ch/xmltv/xmltv-tnt.zip');
    const data = await response.buffer();
    res.set('Content-Type', 'application/zip');
    res.send(data);
  } catch (error) {
    res.status(500).send('Erreur lors de la récupération des données');
  }
});

app.listen(port, () => {
  console.log(`Serveur proxy en écoute sur http://localhost:${port}`);
});
