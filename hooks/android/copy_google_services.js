var fs = require('fs');
var path = require('path');
var et = require('elementtree');  
var utils = require('./utilities');

function getAppId(context) {
  var config_xml = path.join(context.opts.projectRoot, 'config.xml');
  var data = fs.readFileSync(config_xml).toString();
  var etree = et.parse(data);
  return etree.getroot().attrib.id;
}

function checkIfFolderExists(path) {
  return fs.existsSync(path);
}

function installNodeDependencies() {
    var child_process;
    var deferral;

    child_process = require('child_process');
    deferral = require('q').defer();

    var output = child_process.exec('npm install', {cwd: __dirname}, function (error) {
    if (error !== null) {
      console.log('exec error: ' + error);
      deferral.reject('npm installation failed');
    }
    else {
      console.log("⭐️ Node Dependencies installed succesfuly ⭐️");
      deferral.resolve();
    }
    });

    return deferral.promise;
}

module.exports = function(context) {
    installNodeDependencies();
    var appId = getAppId(context);
    const sourceFilePath = path.join(context.opts.projectRoot, '/platforms/android/app/src/main/assets/www/' + appId + '.PushNotifications/google-services.json');
    //const sourceFilePath = path.join(context.opts.projectRoot, "www", appId + ".PushNotifications", "google-services.json");       
    const destinationFilePath = path.join(context.opts.projectRoot, 'platforms', 'android', 'app', 'google-services.json');
    
    if(!checkIfFolderExists(sourceFilePath)) {
        throw new Error("🚨 No google services configuration file found 🚨");
    }   
    else {
        fs.copyFile(sourceFilePath, destinationFilePath, (err) => {
          if (err) throw err;
          console.log('⭐️ google-service.json was succesfuly copied to: ' + destinationFilePath + ' ⭐️');
        });
    }
}

