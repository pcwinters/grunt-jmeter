var fs = require('fs');
var path = require('path');
var url = require('url');
var http = require('http');


var JMETER_DIR = path.resolve(__dirname, '../jmeter');
var versions = require('../package.json').jmeterVersions;
var filename = "apache-jmeter-"+versions.jmeter+".tgz";
var download_url = "http://www.us.apache.org/dist/jmeter/binaries/"+filename;

var filePath = path.join(JMETER_DIR, filename)
var jmeter_extracted = path.join(path.dirname(filePath), path.basename(filePath, '.tgz'))

module.exports.extractIfDoesNotExist = function(tgzPath, callback) {
	var extractedFolder = path.join(path.dirname(tgzPath), path.basename(tgzPath, '.tgz'))
	if(!fs.existsSync(extractedFolder)){
		module.exports.extract(tgzPath, function(err){
			callback(err, tgzPath)
		})
	} else {
		callback(null, tgzPath)
	}
}

/**
 * If a new version of the file with the given url exists, download and
 * delete the old version.
 */
module.exports.downloadIfDoesNotExist = function(callback) {
	var fileUrl = download_url;
	var outputDir = JMETER_DIR;

	var filePath = path.join(outputDir, filename)
	if(!fs.existsSync(filePath)){
		if(!fs.exists(outputDir)){
			fs.mkdirSync(outputDir)
		}
		module.exports.httpGetFile(fileUrl, filename, outputDir, function(err, tgzPath){module.exports.extractIfDoesNotExist(tgzPath, callback)})
	} else {
		module.exports.extractIfDoesNotExist(path.join(outputDir, filename), callback)
	}
};

/**
 * Function to download file using HTTP.get.
 * Thanks to http://www.hacksparrow.com/using-node-js-to-download-files.html
 * for the outline of this code.
 */
module.exports.httpGetFile = function(fileUrl, fileName, outputDir, callback) {
	console.log('downloading ' + fileUrl + '...');
	var options = {
		host: url.parse(fileUrl).host,
		port: 80,
		path: url.parse(fileUrl).pathname
	};
	http.get(options, function(res) {
		if (res.statusCode !== 200) {
			throw new Error('Got code ' + res.statusCode + ' from ' + fileUrl);
		}
		var filePath = path.join(outputDir, fileName);
		console.log('filePath', filePath)
		var file = fs.createWriteStream(filePath);
		var dataCount = 0;
		res.on('data', function(data) {
			file.write(data);
			dataCount++
			if(dataCount % 100 == 0){
				dataCount = 0;
				process.stdout.write(".");
			}
		}).on('end', function() {
			file.end(function() {
				console.log(fileName + ' downloaded to ' + filePath);
				if (callback) {
					callback(null, filePath);
				}
			});
		});
	});
};

module.exports.extract = function(tgzPath, callback) {
	var tarball = require('tarball-extract')
	tarball.extractTarball(tgzPath, path.dirname(tgzPath), function(err){
		if(err) console.log(err)
		callback(err)
	});
}
