// 0.2.1 Playing with timers and intervals
// 0.2.0 Implemented dropdown list for endpoint and version selection; implemented scrolling for output
// 0.1.1 Implemented user-specified endpoint
// 0.1.0 First version with working endpoint (tested: cockpit)
// 0.0.9 Added list to select vehicle
// 0.0.8 Interface split into Main and Settings pages; experimenting with drawer (opened by left swipe)
// 0.0.7 Introduced default params
// 0.0.6 tests with promises
// 0.0.5 All checks passed: successfully retrieved cookie, JWT token, personId, accountId, VIN and vehicles
// 0.0.4 Single user+pass input, cookievalue output on interface
// 0.0.3 Skipped
// 0.0.2: Cleaned up interface and source; no functions added, still just logging in to Gigya server.

import {Button, TextView, contentView, Stack, TextInput, AlertDialog, NavigationView, Page, Action, drawer, Composite, CollectionView, ScrollView, Row} from 'tabris';
const {ItemPicker, List} = require('tabris-decorators');

const DEBUG_ON = true;

var username="dummyuser";
var password = "dummypassword";
var vehiclesItems = [];
var VINindex = 1;
var myTimer = -1;
var counter = 0;
var checkInterval = 5; // Minutes between checks
var loginDuration = 10;

const newData = {
	"servers": {
        "wiredProd": {
            "target": "https://api-wired-prod-1-euw1.wrd-aws.com",
            "apikey": "VAX7XYKGfa92yMvXculCkEFyfZbuM7Ss" // Valid as of feb 2022
        },
         "gigyaProd": {
            "target": "https://accounts.eu1.gigya.com",
            "apikey": "3_js8th3jdmCWV86fKR3SXQWvXGKbHoWFv8NAgRbH7FnIBsi_XvCpN_rtLcI07uNuq"
        }
    },
};

/*
drawer.set({enabled: true});
drawer.onOpen(() => console.log('drawer opened'));
drawer.onClose(() => console.log('drawer closed'));
const arrow = String.fromCharCode(8592);

drawer.append(
  <TextView left={16}  font='22px Arial' onTap={() => drawer.close()}>
    Renault API manager
  </TextView>
)
*/


const CONTROLS_HEIGHT = 50;
const CONTROLS_WIDTH = 200;
const CONTROLS_SPACING = 0;
const CONTROLS_PADDING = 0;

var	gigyaurl = "";
var	GIGYA_API_KEY= "";
var	kamereonurl = "";
var	KAMEREON_KEY = "";
var country = "";

var QUESTION_MARK = "?";
var cookieValue = "";
var JWT = "";
var personId = "";
var accountId = "";
var accountId2 = "";
var MY_VIN = "";
var globalVehicles = [];
var headers = [{}, {}, {}, {}, {}];

///////////////////////////////////////////////////
var myStackSettings = new Stack({
  alignment:  'stretchX',
  spacing: CONTROLS_SPACING,
  padding: CONTROLS_PADDING,
  layoutData: "stretchX"
  }
);

var gigyaUrlControl = new TextInput({
  message: 'gigyaurl',
  //width: CONTROLS_WIDTH,
  height: CONTROLS_HEIGHT
}).appendTo(myStackSettings);

var gigyaKeyControl = new TextInput({
  message: 'GIGA KEY',
  height: CONTROLS_HEIGHT
}).appendTo(myStackSettings);

var kamereonUrlControl = new TextInput({
  message: 'kamereon url',
  height: CONTROLS_HEIGHT
}).appendTo(myStackSettings);

var kamereonKeyControl = new TextInput({
  message: 'KAMEREON API',
  height: CONTROLS_HEIGHT
}).appendTo(myStackSettings);


var paramRow1 = new Row({
  left : 0,
  right: 0,
}).appendTo(myStackSettings);

var countryControl = new TextInput({
  message: 'country',
  height: CONTROLS_HEIGHT
}).appendTo(paramRow1);

var VINcontrol = new TextInput({
  message: 'Selected VIN',
  height: CONTROLS_HEIGHT
}).appendTo(paramRow1);

var checkIntervalControl = new TextInput({
  message: 'check interval (minutes)',
  height: CONTROLS_HEIGHT
}).appendTo(paramRow1);



var loadButton = new Button({
 text: "Load parameters"
}).onSelect(loadStoredParams)
  .appendTo(myStackSettings);

var saveButton = new Button({
 text: "Save parameters"
}).onSelect(saveParams)
  .appendTo(myStackSettings);

var resetButton = new Button({
 text: "Reset parameters"
}).onSelect(resetParams)
  .appendTo(myStackSettings);

////////////////////

var myStack = new Stack({
  alignment:  'stretchX',
  spacing: CONTROLS_SPACING,
  padding: CONTROLS_PADDING,
  layoutData: "stretch"
  }
);


var userAndPass = new TextInput({
  message: 'user,pass',
  type: "password"
  }).appendTo(myStack);


  var debugRow = new Row({
  left : 0,
  right: 0,
  }).appendTo(myStack);


var loginButton = new Button({
 text: "Login",
 alignment : "left",
 left:0,
}).onSelect(login)
  .appendTo(debugRow);


var debugButton = new Button({
 text: "timer2",
 alignment : "right",
 right: 0,
}).onSelect(startTimer)
  .appendTo(debugRow);



var vehiclePicker = ItemPicker({
      textSource: 'VIN',
      onItemSelect: handleVehicleSelection,
      items: []
    }).appendTo(myStack);


  var myRow = new Row({
  left : 0,
  right: 0,
  }).appendTo(myStack);


var endpointControl = new TextInput({
  message: 'endpoint',
  text: "hvac-settings",
  alignment: "left"
  }).appendTo(myRow);

var endpointPicker = ItemPicker({
  items: [
    "cockpit",
    "battery-status",
    "hvac-status"
    ],
  onItemSelect : endpointHandler,
  alignment: "centerX"
}).appendTo(myRow);


var versionPicker = ItemPicker({
  items: ["v1","v2"],
  alignment: "right"
}).appendTo(myRow);



var endpointButton = new Button({
 text: "Query",
 alignment : "centerX",
 left : 50,
 right: 50,
}).onSelect(endpointStart)
  .appendTo(myStack);

const scrollView = new ScrollView({
   direction : "vertical",
   layoutData: "stretchY",
   //height : 100,
   left : 0,
   right : 0
   })
  .appendTo(myStack);

var output = new TextView({
  alignment : "centerX",
  left: 0,
  right : 0
}).appendTo(scrollView);


var pageMain = new Page({title: 'Main'});
pageMain.append(myStack);

var pageConfig = new Page({title: 'Settings', autoDispose: false});
pageConfig.append(myStackSettings);

////////////////////////////////////


var actSettings = new Action ({
 // placement: "overflow",
  title: "Settings"
}).onSelect(() =>
{
  console.log('Settings selected');
  pageConfig.append(myStackSettings);
  navView.append(pageConfig);
}
);

var navView = new NavigationView({layoutData: 'stretch', drawerActionVisible: true})
  .append(actSettings)
  .append(pageMain)
  .appendTo(contentView);

loadStoredParams();

output.text = "(Here you will see output)";
console.log("Ready to start. Api keys:", GIGYA_API_KEY, KAMEREON_KEY);


// ------------------------------ //

function handleVehicleSelection({item, itemIndex}) {
  output.text = "Vehicle selected: " + item.VIN;
  VINindex = itemIndex;
}


function endpointHandler({item, itemIndex}) {
  LOG(item, "")  ;
  endpointControl.text = item;
}


function startTimer() {
  if (myTimer === -1) {
      LOG("Avvio timer...", "");
      myTimer = setInterval(aggiorna, 1000);
      LOG("Avviato?", "");
  } else {
    LOG("Fermo timer...", "");
    clearInterval(myTimer);
    LOG("Fermato?", "");
  }
  LOG("Fine start", "");
}

function aggiorna() {
  console.log(counter++);
}


function LOG(mex1, mex2) {
  if (DEBUG_ON)  console.log(mex1, mex2)
}

function login() {
  var usp =  userAndPass.text;
  username = usp.split(",")[0];
  password = usp.split(",")[1];
  output.text = "(Here you will see output)";

  var loginUrl =  gigyaurl + "/accounts.login?loginID=" + username + "&password=" + password + "&apikey=" + GIGYA_API_KEY;

  LOG("URL ready:", loginUrl);

  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if (xhr.readyState === xhr.DONE) {
      LOG("DONE 1", " ");
      var JSONresponse =  JSON.parse(xhr.response);
	    // Ok, gigya login is working without need for proxy and without CORS error from TABRIS.JS
      cookieValue = JSONresponse.sessionInfo.cookieValue
      output.text = cookieValue;
      var 	JWTheaders = {
              'login_token': cookieValue,
              'apikey': KAMEREON_KEY,
                'fields' : 'data.personId,data.gigyaDataCenter',
              'expiration': 87000
            };
      var JWTurl = gigyaurl + "/accounts.getJWT?fields=data.personId%2Cdata.gigyaDataCenter&expiration=600&APIKey=" + GIGYA_API_KEY + "&sdk=js_latest&authMode=cookie&pageURL=https%3A%2F%2Fmyr.renault.it%2F&sdkBuild=12426&format=json&login_token=" +	cookieValue;

      const xhr2 = new XMLHttpRequest();
      xhr2.onreadystatechange = () => {
        LOG("send2a...", " ");
        if (xhr2.readyState === xhr2.DONE) {
          LOG("send2c...", " ");
          var JSONresponse =  JSON.parse(xhr2.response);
          LOG("DONE 2", " ");// , xhr2.response);
          JWT = JSONresponse.id_token;
            output.text = "JWT: " + JWT;
            headers[0] = {"name" : "x-gigya-id_token", "value" : JWT}
            headers[1] = {"name" : "apikey", "value" : KAMEREON_KEY}
            headers[2] = {"name" : "Content-type", "value" : "application/vnd.api+json"}
            headers[3] = {"name" : "expiration", "value" : "87000"}
            headers[4] = {"name" : "login_token", "value" : cookieValue}
            var personUrl = gigyaurl + "/accounts.getAccountInfo?apikey=" + GIGYA_API_KEY + "&login_token=" + cookieValue;
            const xhr3 = new XMLHttpRequest();
            xhr3.onreadystatechange = () => {
            LOG("send3a...", " ");
              if (xhr3.readyState === xhr3.DONE) {
                LOG("send3c...", " ");
                var JSONresponse =  JSON.parse(xhr3.response);
                LOG("DONE 3", " ");
                personId = JSONresponse.data.personId;;
                output.text = "personId: " + personId;
                var accountUrl = kamereonurl + "/commerce/v1/persons/" +
                  personId +
                  "?apikey=" + KAMEREON_KEY +
                  "&country=" + country;
                const xhr4 = new XMLHttpRequest();
                xhr4.onreadystatechange = () => {
                LOG("send4a...", " ");
                  if (xhr4.readyState === xhr4.DONE) {
                    LOG("send4c..."," ");
                    var JSONresponse =  JSON.parse(xhr4.response);
                    LOG("DONE 4", " ");// xhr4.response);
                    accountId = JSONresponse.accounts[0].accountId;
                    accountId2 = JSONresponse.accounts[1].accountId;
                      output.text = "accountId: " + accountId + "\n" + accountId2;
                      var vehiclesListQueryUrl = kamereonurl + "/commerce/v1/accounts/" +
                        accountId2 +
                        "/vehicles" +
                        "?apikey=" + KAMEREON_KEY +
                        "&country=" + country;
                      const xhr5 = new XMLHttpRequest();
                      xhr5.onreadystatechange = () => {
                        LOG("send5a..."," ");
                        if (xhr5.readyState === xhr5.DONE) {
                          LOG("send5c..."," ");
                          var JSONresponse =  JSON.parse(xhr5.response);
                          LOG("DONE 5:"," ");
                          globalVehicles = JSONresponse.vehicleLinks;
                          output.text = "";
                          for (var vins=0; vins < JSONresponse.vehicleLinks.length; vins++) {
                            vehiclesItems.push({ "VIN" : JSONresponse.vehicleLinks[vins].vin});
                            output.text +=  JSONresponse.vehicleLinks[vins].vin + ",";
                          }
                          vehiclePicker.items = vehiclesItems;
                          vehiclePicker.selectionIndex = VINindex;
                          output.text = "Ready to query vehicle " + JSONresponse.vehicleLinks[VINindex].vin;
                          MY_VIN = JSONresponse.vehicleLinks[VINindex].vin;
                        }
                      };
                      xhr5.open('GET', vehiclesListQueryUrl);

                      xhr5.setRequestHeader("x-gigya-id_token", JWT);
                      xhr5.setRequestHeader("apikey", KAMEREON_KEY);
                      xhr5.setRequestHeader("Content-type", "application/vnd.api+json");
                      xhr5.setRequestHeader("expiration", "87000");
                      xhr5.setRequestHeader("login_token", cookieValue);
                      LOG("send5...", " ");
                      xhr5.send();

                  }
                };
                xhr4.open('GET', accountUrl);

                xhr4.setRequestHeader("x-gigya-id_token", JWT);
                xhr4.setRequestHeader("apikey", KAMEREON_KEY);
                xhr4.setRequestHeader("Content-type", "application/vnd.api+json");
                xhr4.setRequestHeader("expiration", "87000");
                xhr4.setRequestHeader("login_token", cookieValue);

                LOG("send4..."," ");
                xhr4.send();

              }
            };
            xhr3.open('GET', personUrl);
            LOG("send3...", " ");
            xhr3.send();
        }
      };
      xhr2.open('GET', JWTurl);
      LOG("send2...", " ");
      xhr2.send();

    }
  };
  xhr.open('GET', loginUrl);
  xhr.send();
}


function endpointStart() {
  var testlink = kamereonurl + "/commerce/v1/accounts/" +
			accountId +
			"/kamereon/kca/car-adapter/" +
      versionPicker.items[versionPicker.selectionIndex] +
      "/cars/" +
      MY_VIN +
			"/" +
      endpointControl.text +
			"?" +
			"apikey=" + KAMEREON_KEY +
			"&country=" + country;
      LOG("Testing endpoint: ", testlink);
  query(testlink, headers)
}

function  query(url, headers) {
    LOG("RICEVUTO: " + url, headers);
    var JSONresponse = {};
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
    LOG("send_a...", " ");
      if (xhr.readyState === xhr.DONE) {
        LOG("send_c...", " ");
        LOG("DONE:" , xhr.response);
        try {
              output.text = xhr.response;
              JSONresponse =  JSON.parse(xhr.response);
        } catch(err) {
                JSONresponse = {"data" : "error on url " + url};
        }
        return {"response_text" : xhr.response, "response_JSON" : JSONresponse}
      }
    };
    xhr.open('GET', url);

    for (var i=0; i<headers.length; i++) {
          xhr.setRequestHeader(headers[i].name, headers[i].value);
    }

    LOG("send...", " ");
    xhr.send();
    LOG("send_b...", " ");
}


function saveParams() {
  localStorage.setItem("storedGigyaUrl", gigyaurl);
  localStorage.setItem("storedGigyaKey", GIGYA_API_KEY);
  localStorage.setItem("storedKamereonUrl", kamereonurl);
  localStorage.setItem("storedKamereonKey", KAMEREON_KEY);
  localStorage.setItem("storedCountry", country);
  localStorage.setItem("storedVehicle", VINindex.toString());
  localStorage.setItem("checkInterval", checkIntervalControl.text);
}


function loadStoredParams() {
  if (localStorage.getItem("storedGigyaUrl") !="") {
    gigyaurl = localStorage.getItem("storedGigyaUrl");
    gigyaUrlControl.text = gigyaurl;
  } else {
    LOG("gigyaurl not yet stored", " ")
  }

  if (localStorage.getItem("storedGigyaKey") !="") {
    GIGYA_API_KEY = localStorage.getItem("storedGigyaKey");
    gigyaKeyControl.text = GIGYA_API_KEY;
  } else {
    LOG("GigyaKey not yet stored", "")
  }

  if (localStorage.getItem("storedKamereonUrl") !="") {
    kamereonurl = localStorage.getItem("storedKamereonUrl");
    kamereonUrlControl.text = kamereonurl;
  } else {
    LOG("KamereonUrl not yet stored","")
  }

  if (localStorage.getItem("storedKamereonKey") !="") {
    KAMEREON_KEY = localStorage.getItem("storedKamereonKey");
    kamereonKeyControl.text = KAMEREON_KEY;
  } else {
    LOG("KamereonKey not yet stored","")
  }

  if (localStorage.getItem("storedCountry") !="") {
    country = localStorage.getItem("storedCountry");
    countryControl.text = country;
  } else {
    LOG("Country not yet stored","")
  }

  if (localStorage.getItem("storedVehicle") !="") {
    VINindex = parseInt(localStorage.getItem("storedVehicle"));
    VINcontrol.text = VINindex.toString();
  } else {
    LOG("VIN index not yet stored","")
  }

  if (localStorage.getItem("checkInterval") !="") {
    checkInterval = parseInt(localStorage.getItem("checkInterval"));
    checkIntervalControl.text = checkInterval.toString();
  } else {
    LOG("checkInterval not yet stored","")
  }
}

function resetParams() {
  new AlertDialog({
    title: 'Are you sure?',
    buttons: {
      ok: 'Yes',
      cancel : "No",
      neutral: "Cancel"
      }
  }).onCloseOk(() => {
      LOG("Reset authorization confirmed", "")
      gigyaurl = newData.servers.gigyaProd.target;
      GIGYA_API_KEY= newData.servers.gigyaProd.apikey;
      kamereonurl = newData.servers.wiredProd.target;
      KAMEREON_KEY = newData.servers.wiredProd.apikey;
      country = "IT";
      VINindex = 1;
      checkInterval = 10;

      gigyaUrlControl.text = gigyaurl;
      gigyaKeyControl.text = GIGYA_API_KEY;
      kamereonUrlControl.text = kamereonurl;
      kamereonKeyControl.text = KAMEREON_KEY;
      countryControl.text = country;
      VINcontrol.text = VINindex + "";
      checkIntervalControl.text = "10";

      saveParams();
      })
    .onCloseCancel(() => {
      LOG("Cancel reset","");
      return;
      })
    .open()
}
