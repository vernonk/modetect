// modetect.js
// A different approach to device detection allowing numerous levels of tests.
// Covering userAgent, platform, resolution and device version tests
// Author: Vernon Kesner
// Email: vernonkesner@me.com
// v0.1.0

//Methods for device detection inspired by Sencha Touch Ext.is
//http://docs.sencha.com/touch/1-1/#!/api/Ext.is

var MODETECT = MODETECT || {};

MODETECT.detection = {

  //If a platform match is not found, the three following default values will be returned from getCurrentDevice
  //If a platform match is found, these values will be updated with device information defined in the platforms array.
  currentDevice: "desktop",
  currentDeviceGroup: "desktop",
  currentDeviceType: "desktop",

  //all detection based off of window.navigator.platform || window.navigator.userAgent || window.screen.width
  //each platform below has 4 properties
  // @property - This should be which property we will use to do our test against platform, userAgent, resolution, androidVersion.
  // @pattern || @maxWidth - Pattern used in regex to match OR integer of max width to match resolution
  // @identifier - Used as the return identifier set in the options.currentDevice property
  // @deviceGroup - One of 5 values: ios, iosTablet, androidPhone, androidTablet, otherMobile
  platforms: [
    {
      property: "platform",
      pattern: /iPhone/i,
      identifier: "iphone",
      deviceGroup: "ios",
      deviceType: "phone"
    },
    {
      property: "platform",
      pattern: /iPad/i,
      identifier: "ipad",
      deviceGroup: "iosTablet",
      deviceType: "tablet"
    },
    {
      property: "platform",
      pattern: /iPod/i,
      identifier: "iphone",
      deviceGroup: "ios",
      deviceType: "phone"
    },
    {
      property: "userAgent",
      pattern: /Android/i,
      identifier: "android",
      deviceGroup: "androidPhone",
      deviceType: "phone",
      subtests: [
        {
          property: "userAgent",
          pattern: /Mobile/i,
          identifier: "android",
          deviceGroup: "androidPhone",
          deviceType: "phone"
        },
        {
          property: "osVersion",
          pattern: /Android\s(\d+\.\d+)/i,
          version: 3,
          versionComparison: "match",
          exitTest: true,
          identifier: "android",
          deviceGroup: "androidTablet",
          deviceType: "tablet"
        },
        {
          property: "resolution",
          maxPortraitWidth: 320,
          identifier: "android",
          deviceGroup: "androidPhone",
          deviceType: "phone"
        }
      ]
    },
    {
      property: "userAgent",
      pattern: /Android/i,
      identifier: "android",
      deviceGroup: "androidPhone",
      deviceType: "phone",
      subtests: [
        {
          property: "userAgent",
          pattern: /Opera\sMini/i,
          identifier: "android",
          deviceGroup: "androidPhone",
          deviceType: "phone"
        }
      ]
    },
    {
      property: "userAgent",
      pattern: /Android/i,
      identifier: "android",
      deviceGroup: "androidTablet",
      deviceType: "tablet"
    },
    {
      property: "userAgent",
      pattern: /BlackBerry/i,
      identifier: "blackberry",
      deviceGroup: "unsupportedMobile",
      deviceType: "phone",
      subtests: [
        {
          property: "userAgent",
          pattern: /Mobile/i,
          identifier: "blackberry",
          deviceGroup: "otherMobile",
          deviceType: "phone"
        }
      ]
    },
    {
      property: "userAgent",
      pattern: /RIM\sTablet/i,
      identifer: "rimTablet",
      deviceGroup: "rimTablet",
      deviceType: "tablet"
    },
    {
      property: "userAgent",
      pattern: /Windows\sPhone/i, //may also need to include IEMobile
      identifier: "windowsphone",
      deviceGroup: "otherMobile",
      deviceType: "phone"
    },
    {
      property: "userAgent",
      pattern: /Silk/i,
      identifier: "kindlefire",
      deviceGroup: "androidTablet",
      deviceType: "tablet"
    },
    {
      property: "userAgent",
      pattern: /Opera\sMini/i,
      identifier: "unknown",
      deviceGroup: "otherMobile",
      deviceType: "phone"
    },
    {
      property: "resolution",
      maxPortraitWidth: 320,
      identifier: "mobile",
      deviceGroup: "otherMobile",
      deviceType: "phone"
    }
  ],

  init: function() {
    this.getCurrentDevice();
  },

  //determine the current device a user is using.
  // return - Object with three properties: device, deviceGroup, deviceType
  getCurrentDevice: function() {
    var self = this,
        navigator = window.navigator,
        platforms = self.platforms,
        totalPlatforms = platforms.length,
        currentPlatform,
        screenWidth = window.screen.width, //updated on orientation change in Android but not iOS
        screenHeight = window.screen.height, //updated on orientation change in Android but not iOS
        //screenOrientation = (window.orientation) ? window.orientation : -1,  <- Removing for now as Android doesn't always update
        deviceMatch,
        i, j,
        subtestsLength,
        currentSubtest;

    //loop through each platform to test for a device match
    for(i = 0; i < totalPlatforms; i++) {
      currentPlatform = platforms[i];
      if(currentPlatform.property === "resolution") {
        if(self.testDeviceResolution(currentPlatform.maxPortraitWidth, screenWidth, screenHeight)) {
          self.currentDevice = currentPlatform.identifier;
          self.currentDeviceGroup = currentPlatform.deviceGroup;
          self.currentDeviceType = currentPlatform.deviceType;
          //Match found, return device and skip needless loop iterations
          return { device: self.currentDevice, deviceGroup: self.currentDeviceGroup, deviceType: self.currentDeviceType };

        }
      }
      else {
        //TODO: Add check in here to test for Android version on the top level of tests as well.
        //checking the navigator object
        deviceMatch = currentPlatform.pattern.test(navigator[currentPlatform.property]);
        //create an entry on the deviceDetection object that holds this specific device with a match and group
        //This will allow for each "is this an iPad" type conditionals if necessary

        if(deviceMatch) {
          //add this device in its current identification state as the current device.
          self.currentDevice = currentPlatform.identifier;
          self.currentDeviceGroup = currentPlatform.deviceGroup;
          self.currentDeviceType = currentPlatform.deviceType;

          //are there any subtests we want to run on this device?
          subtestsLength = (currentPlatform.subtests) ? currentPlatform.subtests.length : 0;

          for(j = 0; j < subtestsLength; j++) {

            currentSubtest = currentPlatform["subtests"][j];

            if(currentSubtest.property === "resolution") {
              if(self.testDeviceResolution(currentSubtest.maxPortraitWidth, screenWidth, screenHeight)) {
                self.currentDevice = currentSubtest.identifier;
                self.currentDeviceGroup = currentSubtest.deviceGroup;
                self.currentDeviceType = currentSubtest.deviceType;
              }
              else {
                deviceMatch = false;
              }
            }
            else if(currentSubtest.property === "osVersion" && self.testVersion(currentSubtest.pattern, currentSubtest.version, currentSubtest.versionComparison)) {
              self.currentDevice = currentSubtest.identifier;
              self.currentDeviceGroup = currentSubtest.deviceGroup;
              self.currentDeviceType = currentSubtest.deviceType;

              if(currentSubtest.exitTest) {
                //test is treated as an exitTest, return device now
                return { device: self.currentDevice, deviceGroup: self.currentDeviceGroup, deviceType: self.currentDeviceType };
              }

            }
            else if (currentSubtest.pattern.test(navigator[currentSubtest.property])) {
              //Testing the navigator object
              self.currentDevice = currentSubtest.identifier;
              self.currentDeviceGroup = currentSubtest.deviceGroup;
              self.currentDeviceType = currentSubtest.deviceType;
            }
            else {
              deviceMatch = false;
            }
          }

          //make sure we still have a device match after the battery of subtests.
          //If so, return device and skip needless loop iterations
          if(deviceMatch) {
            return { device: self.currentDevice, deviceGroup: self.currentDeviceGroup, deviceType: self.currentDeviceType };
          }

        }
      }
    }

    //no match was found, return default data
    return { device: self.currentDevice, deviceGroup: self.currentDeviceGroup, deviceType: self.currentDeviceType };

  },

  //Test if maximum portrait width set in platform is less than the current screen width
  //return - Boolean
  testDeviceResolution: function(maxPortraitWidth, screenWidth, screenHeight) {
    //TODO: Update to use screen orientation when Android support for updating orientation property is better.
    //Right now, I'm going to take the smaller value between screenWidth and screenHeight and consider that portrait width.
    var portraitWidth = (screenWidth < screenHeight) ? screenWidth : screenHeight;

    if(portraitWidth < maxPortraitWidth) {
      return true;
    }
    else {
      return false;
    }
  },

  //Test OS Version
  //param - pattern - Regex pattern
  //param - version - Integer - Major version to compare against
  //param - versionComparison - String - How version matching is done "match", "greaterThan", "lessThan"
  //return - Boolean
  testVersion: function(pattern, version, versionComparison) {
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

};