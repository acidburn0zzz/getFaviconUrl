'use strict';

const request = require("node_modules/request");
const cheerio = require("node_modules/cheerio");
var faviconUrl = "";

console.log('Loading lambda function');

function onError(error) {
  console.log("Error: ${error}")
}

function getFaviconUrl(url, callback) {
  var urlParts = url.replace('http://', '').replace('https://', '').split(/\//);
  var domain = "https://" + urlParts[0];
  var options = {
    url: domain,
    method: "GET",
    headers: {
      "Accept": "text/html"
    }
  };
  request(options, function(error, response, html) {
    if (!error && response.statusCode == 200) {
      const $ = cheerio.load(html);
      console.log("HERE'S THE HTML:" + html);
      $("link").each(function(i, element) {
        console.log(element);
        var rel = $(element).attr("rel");
        if (rel !== undefined && rel.indexOf("icon") > -1) {
          faviconUrl = $(element).attr("href");
          return false;
        }
      });
      if (faviconUrl.indexOf("/") === 0) { // If path returned is relative to root folder
        faviconUrl = domain + faviconUrl;
      }
      callback(null, faviconUrl);
    }
  });
}

exports.handler = (event, context, callback) => {
  getFaviconUrl(event.url, callback);
}
