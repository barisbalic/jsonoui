var http = require('http');
var split = require('split');
var sizeof = require('object-sizeof');
var express = require('express');
var service = express();

var IEEE_LISTINGS_FILE = 'http://standards.ieee.org/develop/regauth/oui/oui.txt';
var DB = {};

service.get('/macs/:mac', function(req, res) {
  var key = req.params.mac.substring(0, 8);
  if(DB[key]) {
    res.send({
      'mac': {
        'organisation': DB[key].organisation,
        'generatedAt': DB[key].generatedAt,
        'meta': {
          'about': 'http://jsonoui.com/about'
        }
      }
    });
  } else {
    res.status(404).send({
      'status': 404,
      'description': 'The MAC address is not in the public registry.'
    });
  }
});

service.get('/about', function(req, res) {
  res.send({
    'about': {
      'db_size': sizeof(DB),
      'description': "Super minimal service that returns the registered \
                        organisation for a MAC address.",
      'pronunciation': 'j\'son wee',
      'reference': {
        'name': 'IEEE MA-L Public Listings',
        'url': 'http://standards.ieee.org/develop/regauth/oui/public.html'
      }
    }
  });
});

service.get('/reload', function(req, res) {
  http.get(IEEE_LISTINGS_FILE, function(res) {
    var generatedDate = '';
    res.pipe(split()).on('data', function(line) {
      if(line.match(/Generated:/)) {
        generatedDate = line.substring(13);
      }

      if(line.match(/\(hex\)/i)) {
        var key = line.substr(2, 8);
        var id = line.substr(20);
        DB[key] = {'organisation': id, 'generatedAt': generatedDate };
      }
    });
  }).on('error', function(err) {
    console.log('Error: ' + err.message);
  });
  res.send({'status':'yeaboi!'});
});

service.listen(8000);
console.log('Listening on 8000');
