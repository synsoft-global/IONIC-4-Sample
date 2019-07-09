/*!
 * The server module from node.js, for the browser.
 *
 * @author   Ajay Mishra <ajaymishra@synsoftglobal.com> <https://synsoftglobal.com>
 * @license  MIT
 */
var express = require('express');
var app = express();
var morgan = require('morgan');
var bodyParser = require('body-parser');
var cors = require('cors');
var path = require('path');
var public = path.join(__dirname, 'www');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
  'extended': 'true'
}));
app.use(bodyParser.json());
app.use(cors());

/**
 * Allow All Cross origin.
 * Allow Delete and Put method
 * Define allowed headers.
 */
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'DELETE, PUT');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

/**
 * Serve public folder as HTML.
 * After Run ng build commoand public folder will contain all files. * 
 */
app.use('/', express.static(public));


app.get('*', function (req, res) {
  res.sendFile(path.join(public, 'index.html'));
});

/**
 * Check port number in process env otherwise set 5000 defualt port.
 */
app.set('port', process.env.PORT || 5000);

/**
 * Start NodeJS server in defined port.
 */
app.listen(app.get('port'), function () {
  console.log('web app !! Express server listening on port ' + app.get('port'));
});
