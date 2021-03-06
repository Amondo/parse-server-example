// Example express application adding the parse-server module to expose Parse
// compatible API routes.

var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var path = require('path');
// var SimpleMailgunAdapter = require('parse-server/lib/Adapters/Email/SimpleMailgunAdapter');

var databaseUri = process.env.DATABASE_URI || process.env.MONGODB_URI;

if (!databaseUri) {
  console.log('DATABASE_URI not specified, falling back to localhost.');
}

var api = new ParseServer({
  databaseURI: databaseUri || 'mongodb://heroku_z25kbwmc:470grupv02p4npc30prq5uj0fm@ds145469-a0.mlab.com:45469,ds145469-a1.mlab.com:45469/heroku_z25kbwmc?replicaSet=rs-ds145469',
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
  appId: process.env.APP_ID || 'myAppId',
  masterKey: process.env.MASTER_KEY || 'myMasterKey', //Add your master key here. Keep it secret!
  serverURL: process.env.SERVER_URL || 'http://amondo+PARSE_MOUNT.herokuapp.com/parse',
  
  verifyUserEmails: true,
  publicServerURL: 'http://amondo.herokuapp.com/parse',
  appName: 'Amondo',
  
  emailAdapter: {
    module: 'parse-server-simple-mailgun-adapter',
    options: {
      // The address that your emails come from
      fromAddress: 'postmaster@sandboxb57b62665795473f88eb403619b7daa9.mailgun.org',
      // Your domain from mailgun.com
      domain: 'sandboxb57b62665795473f88eb403619b7daa9.mailgun.org',
      // Your API key from mailgun.com
      apiKey: 'key-a504ea128ef8a3a0870ff5a701fb51de',
    }
  }
  
});
// Client-keys like the javascript key or the .NET key are not necessary with parse-server
// If you wish you require them, you can set them as options in the initialization above:
// javascriptKey, restAPIKey, dotNetKey, clientKey

var app = express();

// Serve static assets from the /public folder
app.use('/public', express.static(path.join(__dirname, '/public')));

// Serve the Parse API on the /parse URL prefix
var mountPath = process.env.PARSE_MOUNT || '/parse';
app.use(mountPath, api);

// Parse Server plays nicely with the rest of your web routes
app.get('/', function(req, res) {
  res.status(200).send('I dream of being a website.  Please star the parse-server repo on GitHub!');
});

// There will be a test page available on the /test path of your server url
// Remove this before launching your app
app.get('/test', function(req, res) {
  res.sendFile(path.join(__dirname, '/public/test.html'));
});

var port = process.env.PORT || 1337;
var httpServer = require('http').createServer(app);
httpServer.listen(port, function() {
    console.log('parse-server-example running on port ' + port + '.');
});

// This will enable the Live Query real-time server
ParseServer.createLiveQueryServer(httpServer);
