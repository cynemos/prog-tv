import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();

const corsOptions = {
  origin: '*'
};
app.use(cors(corsOptions));

app.get('/proxy', async (req, res) => {
  const targetUrl = 'https://xmltv.ch/xmltv/xmltv-tnt.zip';
  console.log(`Proxy request to: ${targetUrl}`);

  try {
    console.log('Fetching data from:', targetUrl);
    const response = await fetch(targetUrl, {
      timeout: 30000
    });
    console.log('Fetch response status:', response.status);
    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      return res.status(response.status).send(`Erreur lors de la récupération des données: ${response.status} ${response.statusText}`);
    }
    const data = await response.buffer();

    res.setHeader('Access-Control-Allow-Origin', '*');
    console.log('CORS Headers:', res.getHeaders());

    res.set('Content-Type', 'application/zip');
    console.log('Content-Length:', data.length); // Log the content length
    res.send(data);
  } catch (error) {
    console.error("Erreur lors de la requête vers xmltv.ch:", error.message, error.stack);
    res.status(500).send('Erreur interne du serveur proxy');
  }
});

// Netlify Function handler
export const handler = async (event, context) => {
  // For local testing, you might want to start the server normally
  // if (process.env.NODE_ENV !== 'production') {
  //   app.listen(3000, () => {
  //     console.log(`Serveur proxy en écoute sur http://localhost:3000`);
  //   });
  // }

  // Netlify expects a handler to return an object with statusCode, headers, and body
  const expressHandler = (req, res) => {
    app(req, res);
  };

  return new Promise((resolve, reject) => {
    const mockReq = {
      method: event.httpMethod,
      path: event.path,
      headers: event.headers,
    };

    const mockRes = {
      statusCode: 200,
      headers: {},
      body: '',
      send: function(data) {
        this.body = data;
        resolve({
          statusCode: this.statusCode,
          headers: this.headers,
          body: this.body.toString() // Ensure body is string
        });
      },
      status: function(code) {
        this.statusCode = code;
        return this; // for chaining
      },
      set: function(header, value) {
        this.headers[header] = value;
      },
      setHeader: function(header, value) {
        this.headers[header] = value;
      },
      getHeaders: function() {
        return this.headers;
      }
    };

    expressHandler(mockReq, mockRes);
  });
};
