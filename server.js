var express  = require('express');
var app      = express();                               
var morgan = require('morgan');            
var bodyParser = require('body-parser');    
var cors = require('cors');
var path = require('path');
var public = path.join(__dirname, 'www');

app.use(morgan('dev'));                                        
app.use(bodyParser.urlencoded({'extended':'true'}));            
app.use(bodyParser.json());                                     
app.use(cors());
 
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'DELETE, PUT');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.use('/',express.static(public));

app.get('*', function(req, res) {
    res.sendFile(path.join(public, 'index.html'));
});
 

app.set('port', process.env.PORT || 5000);
app.listen(app.get('port'), function () {
  console.log('web app !! Express server listening on port ' + app.get('port'));
});