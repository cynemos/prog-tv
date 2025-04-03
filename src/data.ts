import { Channel } from './types';
import JSZip from 'jszip';

const XMLTV_URL = '/api/proxy';

export const fetchChannelsData = async (): Promise<Channel[]> => {
  try {
    const zipResponse = await fetch(XMLTV_URL);
    if (!zipResponse.ok) {
      const message = `HTTP error! status: ${zipResponse.status}`;
      console.error('Erreur HTTP lors du téléchargement du ZIP:', message);
      throw new Error(`Erreur lors du téléchargement des données XMLTV: ${message}`);
    }
    const zipData = await zipResponse.arrayBuffer();

    let zip;
    try {
      zip = await JSZip.loadAsync(zipData);
    } catch (error) {
      console.error('Erreur lors du chargement du contenu ZIP:', error);
      throw new Error('Erreur lors du traitement du fichier ZIP.');
    }

    const xmlFile = zip.file('xmltv.xml');

    if (!xmlFile) {
      const message = 'xmltv.xml not found in zip archive';
      console.error('Fichier XML manquant dans l\'archive ZIP:', message);
      throw new Error(`Erreur lors du traitement des données XMLTV: ${message}`);
    }

    let xmlContent;
    try {
      xmlContent = await xmlFile.async('text');
    } catch (error) {
      console.error('Erreur lors de la lecture du fichier XML:', error);
      throw new Error('Erreur lors de la lecture du fichier XML dans l\'archive.');
    }


    return new Promise((resolve, reject) => {
      const pythonProcess = Bun.spawn(['python3', 'pyxmltv.py', '-j'], {
        stdin: new TextEncoder().encode(xmlContent),
        stdout: 'pipe',
        stderr: 'pipe',
      });

      let stdoutData = '';
      let stderrData = '';

      pythonProcess.stdout.on('data', (data) => {
        stdoutData += new TextDecoder().decode(data);
      });

      pythonProcess.stderr.on('data', (data) => {
        stderrData += new TextDecoder().decode(data);
      });

      pythonProcess.on('exit', (code) => {
        if (code === 0) {
          try {
            const jsonData = JSON.parse(stdoutData);
            resolve(jsonData);
          } catch (error) {
            console.error('Erreur lors du parsing JSON:', error, '\nOutput Python (stdout):', stdoutData, '\nError Python (stderr):', stderrData);
            reject('Erreur lors du traitement des données JSON.');
          }
        } else {
          console.error(`Erreur Python script exited with code ${code}: ${stderrData}, \nOutput Python (stdout): ${stdoutData}`);
          reject(`Erreur lors de l'exécution du script Python: ${stderrData}`);
        }
      });
    });
  } catch (error) {
    console.error('Erreur globale lors du téléchargement ou du traitement des données XMLTV:', error);
    throw new Error('Erreur lors du chargement des programmes TV.');
  }
};
