'use strict';

const request = require("node_modules/request");
const cheerio = require("node_modules/cheerio");
var faviconUrl = "";

console.log('Loading lambda function');

function getIconUrl(index, element) {
  	const rel = $(element).attr("rel");
  	if (rel === "icon" || rel === "shortcut icon") {
        faviconUrl = $(element).attr("href");
    	return false;
    }
}

function processResponse(error, response, body){
    const $ = cheerio.load(body);
    $("link", "head", body).each(getIconUrl(index, element));
    concole.log(faviconUrl);
    if (faviconUrl.indexOf("/") === 0) { // If path returned is relative
        faviconUrl = "https://" + domain + faviconUrl;
    }
}

function getFaviconUrl(url){
    var urlParts = url.replace('http://','').replace('https://','').split(/[/?#]/);
    var domain = "https://" + urlParts[0];
    console.log(domain);
    var options = {
        url: domain,
        method: "POST",
        headers: {
            "Content-Type": "text/html"
        }
    };
    request(options, processResponse);
}

exports.handler = (event, context, callback) => {
    getFaviconUrl(event.url);
    callback(null, faviconUrl);
    //callback('Something went wrong');