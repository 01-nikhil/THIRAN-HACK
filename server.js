const express = require('express');
const fs = require('fs');
const { google } = require('googleapis');
const chokidar = require('chokidar');
const util = require('util');

const app = express();
const port = 5001;

// Paths for credentials and token files
const CREDENTIALS_PATH = './credentials.json';
const TOKEN_PATH = './token.json';

// Helper: Promisify getToken for easier async/await usage
const getTokenAsync = util.promisify((client, code, callback) => client.getToken(code, callback));

// Load credentials synchronously at startup
let credentials;
try {
  credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
} catch (error) {
  console.error('Error loading credentials:', error);
  process.exit(1);
}
const { client_id, client_secret, redirect_uris } = credentials.web;
const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

// ----------- OAuth2 Authentication Routes -----------

// Start the OAuth flow
app.get('/auth', (req, res) => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/drive.file'],
    prompt: 'consent',
  });
  console.log('Redirecting to:', authUrl);
  res.redirect(authUrl);
});

// OAuth2 callback endpoint (must match your authorized URI)
app.get('/oauth2callback', async (req, res) => {
  const code = req.query.code;
  if (!code) {
    res.status(400).send('No code received.');
    return;
  }
  try {
    const token = await getTokenAsync(oAuth2Client, code);
    oAuth2Client.setCredentials(token);
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(token, null, 2));
    console.log('Token stored to', TOKEN_PATH);
    res.send('Authentication successful! You can close this window.');
  } catch (err) {
    console.error('Error retrieving access token:', err);
    res.status(500).send('Error retrieving access token.');
  }
});

// ----------- File Sync Logic -----------

// Create a Drive client instance
function getDriveClient() {
  return google.drive({ version: 'v3', auth: oAuth2Client });
}

// Upload (or update) db.json to Google Drive
async function uploadDBFile() {
  const drive = getDriveClient();
  const fileMetadata = { name: 'db.json' };
  const media = { mimeType: 'application/json', body: fs.createReadStream('db.json') };

  try {
    const listRes = await drive.files.list({
      q: "name = 'db.json'",
      fields: 'files(id, name, modifiedTime)',
    });

    if (listRes.data.files.length > 0) {
      const fileId = listRes.data.files[0].id;
      await drive.files.update({ fileId, media });
      console.log('db.json updated on Google Drive.');
    } else {
      const createRes = await drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id',
      });
      console.log('db.json uploaded. File ID:', createRes.data.id);
    }
  } catch (error) {
    console.error('Error during file upload:', error);
  }
}

// Download the latest db.json from Google Drive
async function downloadDBFile() {
  const drive = getDriveClient();
  try {
    const listRes = await drive.files.list({
      q: "name = 'db.json'",
      fields: 'files(id, name, modifiedTime)',
    });
    if (listRes.data.files.length > 0) {
      const fileId = listRes.data.files[0].id;
      const dest = fs.createWriteStream('db.json');
      const fileRes = await drive.files.get(
        { fileId, alt: 'media' },
        { responseType: 'stream' }
      );
      fileRes.data
        .on('end', () => console.log('db.json downloaded from Google Drive.'))
        .on('error', (err) => console.error('Error downloading file:', err))
        .pipe(dest);
    } else {
      console.log('No db.json file found on Google Drive.');
    }
  } catch (error) {
    console.error('Error during file download:', error);
  }
}

// Sync local and remote db.json based on modification times
async function syncDBFile() {
  const drive = getDriveClient();
  try {
    const listRes = await drive.files.list({
      q: "name = 'db.json'",
      fields: 'files(id, name, modifiedTime)',
    });
    let driveFile;
    if (listRes.data.files.length > 0) {
      driveFile = listRes.data.files[0];
    }
    const localExists = fs.existsSync('db.json');
    const localFileStats = localExists ? fs.statSync('db.json') : null;
    const localModifiedTime = localFileStats ? new Date(localFileStats.mtime) : null;

    if (driveFile) {
      const driveFileModifiedTime = new Date(driveFile.modifiedTime);
      if (!localModifiedTime || driveFileModifiedTime > localModifiedTime) {
        console.log('Google Drive version is newer. Downloading...');
        await downloadDBFile();
      } else if (localModifiedTime > driveFileModifiedTime) {
        console.log('Local version is newer. Uploading...');
        await uploadDBFile();
      } else {
        console.log('Both local and Google Drive versions are up-to-date.');
      }
    } else {
      console.log('No db.json found on Google Drive. Uploading local version...');
      if (localExists) {
        await uploadDBFile();
      } else {
        console.log('Local db.json does not exist.');
      }
    }
  } catch (error) {
    console.error('Error during file sync:', error);
  }
}

// Watch for local changes and trigger upload
function startWatchingDB() {
  chokidar.watch('db.json', { ignoreInitial: true }).on('change', () => {
    console.log('Detected change in db.json, syncing to Google Drive...');
    if (fs.existsSync(TOKEN_PATH)) {
      uploadDBFile();
    } else {
      console.log('No token found. Please authenticate via /auth.');
    }
  });
}

// Periodically poll Google Drive for updates (every 10 seconds)
function startPollingDrive() {
  setInterval(() => {
    console.log('Polling Google Drive for updates...');
    syncDBFile();
  }, 10000);
}

// ----------- Server Startup -----------

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
  console.log(`Visit http://localhost:${port}/auth to authenticate with Google.`);
  if (fs.existsSync(TOKEN_PATH)) {
    try {
      const token = JSON.parse(fs.readFileSync(TOKEN_PATH));
      oAuth2Client.setCredentials(token);
      startWatchingDB();
      startPollingDrive();
    } catch (error) {
      console.error('Error reading token file:', error);
    }
  } else {
    console.log('Please authenticate first to generate token.json.');
  }
});
