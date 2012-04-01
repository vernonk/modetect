#MoDetect

## Description:

With the mobile web growing at a huge rate, we have to decide how we're going to support devices.  
Feature detection? Top-notch solution if you are just worried about device type. But what about when you 
need to separate phone vs. tablet, iPhone from Android?  MoDetect will 
give you just what you need in a small package.

MoDetect exists to give a different approach to device detection making it easy to:  

  - Make testing Android phones vs. tablets more reliable.
  - Tests based on window.navigator.userAgent and .platform with regex patterns
  - Device resolution
  - Device OS major version comparison "match", "greaterThan", "lessThan"
  - Subtests so that you can do more specific detection.
  

## Example usage: 

`MODETECT.device.iphone` (will return a boolean)


## Device Property list:

  - `MODETECT.device.iphone`
  - `MODETECT.device.ipod`
  - `MODETECT.device.ipad`
  - `MODETECT.device.android`
  - `MODETECT.device.blackberry` (will return boolean for webkit based Blackberries)
  - `MODETECT.device.blackberryplaybook`
  - `MODETECT.device.windowsphone`
  - `MODETECT.device.kindlefire`
  - `MODETECT.device.othermobile` (portrait resolution of 320 or less)
  - `MODETECT.device.phone`
  - `MODETECT.device.tablet`
  - `MODETECT.device.desktop`
