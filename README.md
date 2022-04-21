# MyRenaultAndroid
Testing Renault API usage with [Tabris.js](https://tabris.com/) , to create a standalone app for Android and iOS using javascript.

Current status:
 - login to Gigya server **DONE** - It works properly, without need for proxy and without CORS errors
 - login to Kamereon server: **DONE**
 - retrieve PersonId: **DONE**
 - retrieve AccountId: **DONE**
 - retrieve VIN: **DONE**
 - run endpoint: **DONE** (first working version: 0.1.0)
 - [compile online with tabris.js](https://build.tabris.com/): to do (tried, no success as of now)

Usage:

Replace any [Tabris.js playground example](https://playground.tabris.com/#) by this script, scan the QR code with [Tabris.js app](https://play.google.com/store/apps/details?id=com.eclipsesource.tabris.js) 3.8.0 (beware of other versions! Use only this link, the others are old:  tabris 3.x broke compatibility w.r.t tabris 2.x.), input credentials (as **user,name** , i.e. separated by comma) and click login button. 

If app works, it should end up showing your VIN.

Swipe left to see console output for debugging purpose.

NOTE: You may need to put your region-specific data in Settings page.

----------
Actual app

Once this test app will be working, an "actual" app will be developed to perform these tasks:

- constant monitoring of charge level in background, stop charging at user-defined level  - to do
- show charging sessions - to do
-
