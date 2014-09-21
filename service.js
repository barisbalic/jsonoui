var http = require('http');
var split = require('split');
var sizeof = require('object-sizeof');
var express = require('express');
var service = express();

var IEEE_LISTINGS_FILE = 'http://standards.ieee.org/develop/regauth/oui/oui.txt';
var URL = 'http://jsonoui.com';
var DB = {}; // ROFLCOPTOR
var PORT = (process.env.PORT || 8000);

function keyFromAddressSpace(address) {
  var hyphenated = address.replace(/:/g, '-');
  return hyphenated.substr(0, 8);
}

service.get('/about', function(req, res) {
  res.send({
    about: {
      pronunciation: 'jay-son-wee',
      description: "Overly minimal service that returns the registered \
                       organisation for a MAC address.",
      source_code: 'https://github.com/barisbalic/jsonoui',
      db_size: sizeof(DB),
      reference: {
        name: 'IEEE MA-L Public Listings',
        url: 'http://standards.ieee.org/develop/regauth/oui/public.html',
        data_source: IEEE_LISTINGS_FILE
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
        var key = keyFromAddressSpace(line.substr(2, 8));
        var id = line.substr(20);
        DB[key] = {'organisation': id, 'generatedAt': generatedDate };
      }
    });
  }).on('error', function(err) {
    console.log('Error: ' + err.message);
  });

  res.send({
    reload: {
      description: 'Will make an effort to reload, no promises.'
    }
  });
});

service.get('/ouis/:bytes', function(req, res) {
  var key = keyFromAddressSpace(req.params.bytes);
  if(DB[key]) {
    res.send({
      entry: {
        organisation: DB[key].organisation,
        generated_at: DB[key].generatedAt
      },
      meta: {
        about: 'http://jsonoui.com/about'
      }
    });
  } else {
    res.status(404).send({
      status: 404,
      description: 'The OUI was not found in the public registry.'
    });
  }
});

service.get('*', function(req, res) {
  res.status(404).send({
    status: 404,
    description: 'The OUI was not found in the public registry.'
  });
});

service.listen(PORT);
console.log('Listening on ' + PORT);
