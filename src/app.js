// 0.2.4 Output working
// 0.2.3 Working in 2.x (apart for output text)
// 0.2.2 Playing with cordova and tabris 2.x
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

const {Button, TextView, contentView, Stack, TextInput, AlertDialog, NavigationView, Page, Action, drawer, Composite, CollectionView, ScrollView, Picker, ui} = require('tabris');

pippo = "niente";

const DEBUG_ON = true;

var username="dummyuser";
var password = "dummypassword";
var vehiclesItems = [];
var VINindex = 1;
var myTimer = -1;
var counter = 0;
var checkInterval = 1; // Minutes between checks
var loginDuration = 10; // To be implemented
var simulatorInterval = 30; // Seconds between simulated increment of SoC (for debugging)
var simulatedSoC = 0;

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

const VERSIONS = [
  {id:"v1"},
  {id:"v2"}
];

const ENDPOINTS =  [
      {id:"cockpit"},
      {id:"battery-status"},
      {id:"hvac-status"}
      ];

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
var myStackSettings = new Composite({
    left: 0, top: 0
  }
);

var gigyaUrlControl = new TextInput({
  message: 'gigyaurl',
  height: CONTROLS_HEIGHT,
  top: CONTROLS_HEIGHT
}).appendTo(myStackSettings);

var gigyaKeyControl = new TextInput({
  message: 'GIGA KEY',
  height: CONTROLS_HEIGHT,
  top: CONTROLS_HEIGHT*2

}).appendTo(myStackSettings);

var kamereonUrlControl = new TextInput({
  message: 'kamereon url',
  height: CONTROLS_HEIGHT,
  top: CONTROLS_HEIGHT * 3

}).appendTo(myStackSettings);

var kamereonKeyControl = new TextInput({
  message: 'KAMEREON API',
  height: CONTROLS_HEIGHT,
  top: CONTROLS_HEIGHT * 4
}).appendTo(myStackSettings);


var paramRow1 = new Composite({
  top: CONTROLS_HEIGHT * 5
}).appendTo(myStackSettings);

var countryControl = new TextInput({
  message: 'country',
  left:0, right:360,
  height: CONTROLS_HEIGHT
}).appendTo(paramRow1);

var VINcontrol = new TextInput({
  message: 'Selected VIN',
  left:90,

  height: CONTROLS_HEIGHT
}).appendTo(paramRow1);

var checkIntervalControl = new TextInput({
  message: 'check interval (minutes)',
  left:200, right:50,

  height: CONTROLS_HEIGHT
}).appendTo(paramRow1);



var loadButton = new Button({
 text: "Load parameters",
  top: CONTROLS_HEIGHT * 6
}).on('select',loadStoredParams)
  .appendTo(myStackSettings);

var saveButton = new Button({
 text: "Save parameters",
  top: CONTROLS_HEIGHT * 7
}).on('select',saveParams)
  .appendTo(myStackSettings);

var resetButton = new Button({
 text: "Reset parameters",
  top: CONTROLS_HEIGHT * 8
}).on('select',resetParams)
  .appendTo(myStackSettings);

////////////////////

var myStack = new Composite({
  }
);



  var debugRow = new Composite({
  left : 0,
  right: 0,
  top: CONTROLS_HEIGHT * 0,
  left:0, right: 0
  }).appendTo(myStack);

  var userAndPass = new TextInput({
    message: 'user,pass',
    type: "password",
    left:0, right: 300
    }).appendTo(myStack);


    var loginButton = new Button({
     text: "Login",
     alignment : "center",
  	 left:"prev()", right: 150
    }).on('select',login)
      .appendTo(debugRow);

/*
var debugButton = new Button({
  text: "timer",
  alignment : "center",
  left:"prev()", right: 0
}).on('select',startTimer)
.appendTo(myStack);
*/


var vehiclePicker = new Picker({
//      textSource: 'VIN',
      itemCount: 0,
      itemText: null,
      selectionIndex: 1  ,

      //onItemSelect: handleVehicleSelection,
      //items: [],
      top: CONTROLS_HEIGHT * 1,
      left:0, right: 0
    }).appendTo(myStack)
	  .on("select",handleVehicleSelection);
;


var myRow = new Composite({
  left : 0,
  right: 0,
  top: CONTROLS_HEIGHT * 2
}).appendTo(myStack);


  var endpointControl = new TextInput({
    message: 'endpoint',
    text: "cockpit",
    left:0, right: 250,
    }).appendTo(myRow);

  var endpointPicker = new Picker({
      itemCount: ENDPOINTS.length,
      itemText: (index) => ENDPOINTS[index].id,
      selectionIndex: 1,
    left:130, right: 100,
  }).appendTo(myRow);


  var versionPicker = new Picker({
      itemCount: VERSIONS.length,
      itemText: (index) => VERSIONS[index].id,
      selectionIndex: 1 ,
	  left:250, right: 0,
  }).appendTo(myRow);



var endpointButton = new Button({
 text: "Query",
// alignment : "centerX",
 left : 50,
 right: 50,
 top: CONTROLS_HEIGHT * 3
}).on('select',endpointStart)
  .appendTo(myStack);


const scrollView = new ScrollView({
   direction : "vertical",
   background: '#f3f3f3',
	left: 0, right: 0,
    top: CONTROLS_HEIGHT * 4,
	bottom: 0,
   })
  .appendTo(myStack/*ui.contentView*/);


    var output = new TextView({
      alignment : "center",
      text : "aswf dfg sfghswrt sfghsrt sdfg aergtsd aerg asf ",
      left: 0,
      right : 0
    }).appendTo(scrollView);



var pageMain = new Page({title: 'Main'});
pageMain.append(myStack);

var pageConfig = new Page({title: 'Settings', autoDispose: false});
pageConfig.append(myStackSettings);

////////////////////////////////////


var actSettings = new Action ({
  title: "Settings"
}).on('select',() =>
{
  console.log('Settings selected');
  pageConfig.append(myStackSettings);
  navView.append(pageConfig);
}
);


var navView = new NavigationView({/*layoutData: 'stretch',*/ drawerActionVisible: false})
  .append(pageMain)
  .append(actSettings)
  .appendTo(ui.contentView);

loadStoredParams();

output.text = "(Here you will see output)";
console.log("Ready to start. Api keys:", GIGYA_API_KEY, KAMEREON_KEY);


// ------------------------------ //

function handleVehicleSelection(a,b) {
  output.text = "Vehicle selected: " + vehiclesItems[a.index].VIN;
  console.log("Selezionato: ",a.index, vehiclesItems[a.index].VIN)
  VINindex = a.index;
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
	/*
	if (counter>10) {
		cordova.plugins.notification.local.schedule({
		title: 'Time over',
		text: 'Facile...',
		foreground: true
		});
	    clearInterval(myTimer);
	}
	*/
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
                personId = JSONresponse.data.personId;
                output.text = "personId: " + personId + "\n";
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
                    LOG("DONE 4", " ");
                    accountId = JSONresponse.accounts[0].accountId;
                    accountId2 = JSONresponse.accounts[1].accountId;
                      output.text += "accountId: " + accountId + "\n" + accountId2 + "\n";
                      var vehiclesListQueryUrl = kamereonurl + "/commerce/v1/accounts/" +
                        accountId2 +
                        "/vehicles" +
                        "?apikey=" + KAMEREON_KEY +
                        "&country=" + country;
                      const xhr5 = new XMLHttpRequest();
                      xhr5.onreadystatechange = () => {
                        LOG("send5a..."," ");
                        if (xhr5.readyState === xhr5.DONE) {
                          LOG("send5c...",xhr5);
                          var JSONresponse =  JSON.parse(xhr5.response);
                          LOG("DONE 5", "Login completed.");
                          globalVehicles = JSONresponse.vehicleLinks;
                          output.text += "Login completed.\n";
                          for (var vins=0; vins < JSONresponse.vehicleLinks.length; vins++) {
                            vehiclesItems.push({ "VIN" : JSONresponse.vehicleLinks[vins].vin});
                            output.text +=  JSONresponse.vehicleLinks[vins].vin + ",";
                            console.log("Vehicle "+ vins + "= " + JSONresponse.vehicleLinks[vins].vin)
                          }
                          //vehiclePicker.items = vehiclesItems;
                          //vehiclePicker.selectionIndex = VINindex;
                          vehiclePicker.itemCount = vehiclesItems.length;
                          vehiclePicker.itemText = testfun;
                          output.text += "Ready to query vehicle " + JSONresponse.vehicleLinks[VINindex].vin;
                          MY_VIN = JSONresponse.vehicleLinks[VINindex].vin;// + "\n";
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

function testfun(index) {
  console.log("PICKER:",index)
  return vehiclesItems[index].VIN;

}

function endpointStart() {
  var testlink = kamereonurl + "/commerce/v1/accounts/" +
      accountId +
      "/kamereon/kca/car-adapter/" +
      VERSIONS[versionPicker.selectionIndex].id +
      "/cars/" +
      MY_VIN +
      "/" +
      endpointControl.text +
      "?" +
      "apikey=" + KAMEREON_KEY +
      "&country=" + country;
      LOG("Testing endpoint: ", testlink);
  //loadData(testlink);

  query(testlink);
}


function loadData(url) {
  //url = 'http://ip-api.com/json';

   fetchInit =     {
      headers: {
      	'Content-Type': 'application/json'
      }
    };

  console.log("1:",fetchInit);

  /*fetchInit = {
    headers : {

    }

  };*/


  for (var i=0; i<headers.length; i++) {
    fetchInit.headers[headers[i].name] =  headers[i].value;
  }

  console.log("2:",fetchInit);

  console.log("URL=", url);
  console.log("HEADERS=",fetchInit);
  fetch(url,fetchInit)
    .then(response =>  checkStatus(response) && response.json())
    .then(json => console.log("JSON:",json))
    .catch(err => console.error("Niente, non va:",err, "\n------------------\n")); // Never forget the final catch!
}

function checkStatus(response) {
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} - ${response.statusText}`);
  }
  return response;
}



function query1(url) {
  const xhr6 = new XMLHttpRequest();
  xhr6.onreadystatechange = () => {
    LOG("send6a..."," ");
    if (xhr6.readyState === xhr6.DONE) {
      LOG("send6c..."," ");
      //var JSONresponse =  JSON.parse(xhr6.response);
      LOG("DONE 6", "Endpoint completed.");
      output.text += "Endpoint completed.\n";
      console.log("Finale:>>>" + xhr6.response + "<<<");
      //output.text +=  JSONresponse;
    }
  };
  xhr6.open('GET', url);

  xhr6.setRequestHeader("x-gigya-id_token", JWT);
  xhr6.setRequestHeader("apikey", KAMEREON_KEY);
  xhr6.setRequestHeader("Content-type", "application/vnd.api+json");
  xhr6.setRequestHeader("expiration", "87000");
  xhr6.setRequestHeader("login_token", cookieValue);
  LOG("send6...", " ");
  xhr6.send();

}

function  query(url) {
    LOG("RICEVUTO: " + url);
    console.log("HEADERS:", headers);
    // var JSONresponse = {};
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
    	LOG("send_a...", " ");
      if (xhr.readyState === xhr.DONE) {
        LOG("send_c...", " ");
        LOG("DONE:" , xhr);
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

function  queryOld(url, headers) {
    LOG("RICEVUTO: " + url, headers);
    var JSONresponse = {};
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
    LOG("send_a...", " ");
      if (xhr.readyState === xhr.DONE) {
        LOG("send_c...", " ");
        try {
          LOG("DONE:" , ">>>>>\n" + xhr.response + "<<<<<<\n");
          //output.text = xhr.response;
          JSONresponse =  JSON.parse(xhr.response);
          console.log(JSONresponse);
          console.log("ok");
        } catch(err) {
          console.log("Mannaggia");
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
  }).on("closeOk",() => {
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
    .on("closeCancel",() => {
      LOG("Cancel reset","");
      return;
      })
    .open()
}
