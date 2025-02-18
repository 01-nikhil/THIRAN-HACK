const express = require('express');
const fs = require('fs');
const { google } = require('googleapis');
const chokidar = require('chokidar');
const app = express();
const port = 5001;

// Paths for credentials and token
const CREDENTIALS_PATH = './credentials.json';
const TOKEN_PATH = './token.json';

// Load the credentials; for a Web Application, use credentials.web
const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
const { client_id, client_secret, redirect_uris } = credentials.web;
const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

// Function to start the OAuth flow
app.get('/auth', (req, res) => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/drive.file'],
    prompt: 'consent'
  });
  console.log('Redirecting to:', authUrl);
  res.redirect(authUrl);
});

// OAuth2 callback endpoint (must match your authorized URI)
app.get('/oauth2callback', (req, res) => {
  const code = req.query.code;
  if (!code) {
    res.send('No code received.');
    return;
  }
  // Exchange the code for tokens
  oAuth2Client.getToken(code, (err, token) => {
    if (err) {
      console.error('Error retrieving access token', err);
      res.send('Error retrieving access token.');
      return;
    }
    oAuth2Client.setCredentials(token);
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
    console.log('Token stored to', TOKEN_PATH);
    res.send('Authentication successful! You can close this window.');
  });
});

// --- File Sync Logic Below ---

// Function to upload/update db.json on Google Drive
async function uploadDBFile() {
  const drive = google.drive({ version: 'v3', auth: oAuth2Client });
  const fileMetadata = { name: 'db.json' };
  const media = { mimeType: 'application/json', body: fs.createReadStream('db.json') };

  // List files to see if db.json already exists
  try {
    const res = await drive.files.list({
      q: "name = 'db.json'",
      fields: 'files(id, name)'
    });
    if (res.data.files.length > 0) {
      // Update the first matching file
      const fileId = res.data.files[0].id;
      await drive.files.update({ fileId, media });
      console.log('db.json updated on Google Drive.');
    } else {
      // Create new file if it doesn't exist
      const createRes = await drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id'
      });
      console.log('db.json uploaded. File ID:', createRes.data.id);
    }
  } catch (error) {
    console.error('Error during file sync:', error);
  }
}

// Function to download the latest db.json from Google Drive (if needed)
async function downloadDBFile() {
  const drive = google.drive({ version: 'v3', auth: oAuth2Client });
  try {
    const res = await drive.files.list({
      q: "name = 'db.json'",
      fields: 'files(id, name)'
    });
    if (res.data.files.length > 0) {
      const fileId = res.data.files[0].id;
      const dest = fs.createWriteStream('db.json');
      const fileRes = await drive.files.get({ fileId, alt: 'media' }, { responseType: 'stream' });
      fileRes.data
        .on('end', () => {
          console.log('db.json downloaded from Google Drive.');
        })
        .on('error', err => {
          console.error('Error downloading file:', err);
        })
        .pipe(dest);
    }
  } catch (error) {
    console.error('Error during file download:', error);
  }
}

// Watch for changes in db.json and trigger upload
function startWatchingDB() {
  chokidar.watch('db.json').on('change', () => {
    console.log('Detected change in db.json, syncing to Google Drive...');
    // Ensure we have a valid token before uploading
    if (fs.existsSync(TOKEN_PATH)) {
      uploadDBFile();
    } else {
      console.log('No token found. Please authenticate via /auth.');
    }
  });
}

// --- End of File Sync Logic ---

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
  console.log('Visit http://localhost:5001/auth to authenticate with Google.');
  // Optionally, start watching db.json immediately if already authenticated
  if (fs.existsSync(TOKEN_PATH)) {
    oAuth2Client.setCredentials(JSON.parse(fs.readFileSync(TOKEN_PATH)));
    startWatchingDB();
  } else {
    console.log('Please authenticate first to generate token.json.');
  }
});
