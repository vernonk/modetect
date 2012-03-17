#Mo' Detect

##Description:

Mo' Detect exists to give a different approach to device detection.  This rather small library makes it easy to:  

  - Make testing Android phones vs. tablets more reliable.
  - Tests based on window.navigator.userAgent and .platform with regex patterns
  - Device resolution
  - Device OS major version comparison "match", "greaterThan", "lessThan"
  - Subtests so that you can do more specific detection.

###Usage:

Simply call init at any point (DOM ready, etc):

_Runs the device detection updating the publicly accessible properties available for use in other methods_

    (function() { 
      MODETECT.detection.init();
    })();
    
_Run device detection getting a return Object with device, deviceGroup, and deviceType (also updates publicly accessible properties on MODETECT NS)_

    (function() {
      var deviceInfo = MODETECT.detection.getCurrentDevice();
    })();