//Creating MODETECT ns for device detection and mobile redirects (to begin with)
//These items live outside of the ALLY ns and have no dependecy on jQuery or other library
var MODETECT = MODETECT || {};

/**
* Device detection for device and device type
*
* Example usage: MODETECT.device.iphone (will return a boolean)
*
* Device list:
*   MODETECT.device.iphone
*   MODETECT.device.ipod
*   MODETECT.device.ipad
*   MODETECT.device.android
*   MODETECT.device.blackberry (will return boolean for webkit based Blackberries)
*   MODETECT.device.blackberryplaybook
*   MODETECT.device.windowsphone
*   MODETECT.device.kindlefire
*   MODETECT.device.othermobile (portrait resolution of 320 or less)
*   MODETECT.device.phone
*   MODETECT.device.tablet
*   MODETECT.device.desktop
*
* Methods for device detection inspired by Sencha Touch Ext.is
* http://docs.sencha.com/touch/1-1/#!/api/Ext.is
*
* Author: Vernon Kesner
* Version: 1.1.0
* Last update: April 1, 2012
*/

MODETECT.device = (function() {
  'use strict';

  var device = {};

  device.phone = false;
  device.tablet = false;
  //iPhone
  device.iphone = (testNavigator(/iPhone/i, 'platform')) ? true : false;
  if(device.iphone) { device.phone = true; }
  //iPad
  device.ipad = (testNavigator(/iPad/i, 'platform')) ? true : false;
  if(device.ipad) { device.tablet = true; }
  //iPod
  device.ipod = (testNavigator(/iPod/i, 'platform')) ? true : false;
  if(device.ipod) { device.phone = true; }
  //Android device
  device.android = testNavigator(/Android/i, 'userAgent');
  if(device.android) {
    //Android v3 built as tablet-only version of the OS
    //Can definitively say it's a tablet at this point
    if(testVersion(/Android\s(\d+\.\d+)/i, 3, 'match') ) {
      device.tablet = true;
    }
    //Checking for "mobile" in userAgent string for Mobile Safari.
    //Also checking resolution here (max portrait of 800), simply because so
    //many Android tablets that are popular use Android v2.x or now v4.x
    else if(testResolution(800) && testNavigator(/Mobile/i, 'userAgent')) {
      device.phone = true;
    }
    //Default phone vs. tablet value? Defaulting to phone for now until I can think
    //of a better alternative approach to narrow down better.
    else {
      device.phone = true;
    }
  }
  //Blackberry Phone with WebKit
  device.blackberry = (testNavigator(/Blackberry/i, 'userAgent') && testNavigator(/Mobile/i, 'userAgent')) ? true : false;
  if(device.blackberry) { device.phone = true; }
  //Blackberry Playbook
  device.blackberryplaybook = testNavigator(/RIM\sTablet/i, 'userAgent');
  if(device.blackberryplaybook) { device.tablet = true; }
  //Windows Phone
  device.windowsphone = testNavigator(/Windows\sPhone/i, 'userAgent');
  if(device.windowsphone) { device.phone = true; }
  //Kindle Fire
  device.kindlefire = testNavigator(/Silk/i, 'userAgent');
  if(device.kindlefire) { device.tablet = true; }
  //other mobile
  device.othermobile = (device.phone || device.tablet || device.ipod) ? false : testResolution(320);
  if(device.othermobile) { device.phone = true; }
  //desktop user?
  device.desktop = (device.phone || device.tablet || device.ipod) ? false : true;

  //Test window.navigator object for a match
  //return - Boolean
  function testNavigator(pattern, property) {
    return pattern.test(window.navigator[property]);
  }

  //Test if maximum portrait width set in platform is less than the current screen width
  //return - Boolean
  function testResolution(maxPortraitWidth) {
    var portraitWidth = Math.min(screen.width, screen.height) / ("devicePixelRatio" in window ? window.devicePixelRatio : 1);
    if(portraitWidth <= maxPortraitWidth) {
      return true;
    }
    else {
      return false;
    }
  }

  //Test OS Version
  //param - pattern - Regex pattern
  //param - version - Integer - Major version to compare against
  //param - versionComparison - String - How version matching is done "match", "greaterThan", "lessThan"
  //return - Boolean
  function testVersion(pattern, version, versionComparison) {
    var fullVersion = pattern.exec(window.navigator.userAgent),
        majorVersion = parseInt(fullVersion[1], 10);
        
    if(versionComparison === "match" && majorVersion === version ) {
      return true;
    }
    else if(versionComparison === "greaterThan" && majorVersion > version) {
      return true;
    }
    else if(versionComparison === "lessThan" && majorVersion < version) {
      return true;
    }
    else {
      return false;
    }
  }

  return device;

}());
