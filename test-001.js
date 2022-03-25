import {Button, TextView, contentView, Stack, TextInput} from 'tabris';
var	BASE_HORIZONS_URL = "https://ssd.jpl.nasa.gov/api/horizons.api?format=text";
var	LOCAL_PROXY = "http://win98.altervista.org/space/exploration/myp.php?pass=miapass&mode=native&url=";
var	fullURL = BASE_HORIZONS_URL + "&COMMAND=%27*%27&CENTER=%27@*%27"; // Download list of bodies
var	finalURL = LOCAL_PROXY +  encodeURIComponent(fullURL);
var	finalURL = fullURL;
var username="dummyuser";
var password = "dummypassword";

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

const	gigyaurl = newData.servers.gigyaProd.target;
const	GIGYA_API_KEY= newData.servers.gigyaProd.apikey;
const	kamereonurl = newData.servers.wiredProd.target;
const	KAMEREON_KEY = newData.servers.wiredProd.apikey;

console.log(GIGYA_API_KEY, KAMEREON_KEY);

var QUESTION_MARK = "?";
var accountId = "";
var JWT = "";
var MY_VIN = "";
var country = "IT";

console.log("READY");

contentView.append(
  <Stack stretchX alignment='stretchX' spacing={16} padding={16}>
  <TextInput id='username' message='user name' 	/>
    <TextInput id='password' message='password' type='password'/>
    <Button onSelect={loadData2}>Test 4</Button>
    <TextView/>
  </Stack>
);


function loadData2() {
main();

}


function main() {
	username = `${$(TextInput).only('#username').text}`;
	password = `${$(TextInput).only('#password').text}`;
	var loginUrl =  gigyaurl + "/accounts.login?loginID=" + username + "&password=" + password + "&apikey=" + GIGYA_API_KEY;
	var finalLoginURL =  "http://win98.altervista.org/space/exploration/myp.php?pass=miapass&mode=native&url=" + encodeURIComponent(loginUrl);
	var finalLoginURL =  "http://win98.altervista.org/space/exploration/myp.php?pass=miapass&mode=native&url=" + loginUrl;
var finalLoginURL =  loginUrl;

	username = `${$(TextInput).only('#username').text}`;
	password = `${$(TextInput).only('#password').text}`;
	console.log(username,password);

	const requestsList = request(finalLoginURL, null, null, "post");
	requestsList
	  .then(initialLogin)
	  .catch(errore)
}

function initialLogin(loginResponse) {
console.log("Renault login...\n",loginResponse);
	var loginResult = JSON.parse(loginResponse);

console.log("===================", loginResult);
	if (loginResult.errorCode === 400002) {
		console.log("ERR 002 - Cannot retrieve JWT due to missing login data:\n"+ loginResult.errorDetails);
		return "error 002";
	}


	if (loginResult.errorCode === 403042) {
		console.log("ERR 042 - Cannot retrieve JWT due to invalid login data:\n"+ loginResult.errorDetails);
		return "error 042";
	}


	if (loginResult.errorCode != "0") {
		console.log("ERR unknwon - Cannot retrieve JWT:\n"+ loginResult.errorDetails);
		return "error unknown";
	}

	console.log("Credentials accepted.");
	var ookie = loginResult.sessionInfo.cookieValue;
	var renaultUID = loginResult.UID; // needed for Axios calls?

	var cookieValue = loginResult.sessionInfo.cookieValue;
console.log("Cookie=", loginResult.sessionInfo.cookieValue);
	return(loginResult.sessionInfo.cookieValue)
}


function errore() {
  console.log("errore");
}



function request(url, setMyHeader, actionHeader, requestType) {
console.log("Processing " , url , "...");
console.log("Header ricevuto: '" , actionHeader , "'");
  return new Promise(function (resolve, reject) {
	const xhr = new XMLHttpRequest();
	xhr.timeout = 2000;

	xhr.onreadystatechange = function(e) {
	  if (xhr.readyState === 4) {
		if (xhr.status === 200) {
console.log(">>>>>>>>>>Risposta ad URL " , url , ":", xhr.response);
		  resolve(xhr.response)
		} else {
					console.log("not 200: " , xhr.status);
					reject(xhr.status)
				}
			} else {
				//console.log("Ongoing,Status=", xhr.readyState);
			}
		}

	xhr.ontimeout = function () {
			console.log("\n>>>>>>>>>XHR timeout error.\n");
	  reject('timeout');
	}

	xhr.onerror = function (e) {
		console.log("\n>>>>>>>>>XHR  error: ", e , "\n");
	  reject('error');
	}

	if (setMyHeader === true) {
console.log("======= RICHIESTA CON HEADER");
		if (requestType == "get") {
console.log("Richiesta GET");
			xhr.open('get', url  , true)
		} else {
console.log("Richiesta POST");
				xhr.open('post', url  , true)
		}
		xhr.setRequestHeader("x-gigya-id_token",JWT);
		xhr.setRequestHeader("apikey",KAMEREON_KEY);
		xhr.setRequestHeader("Content-type","application/vnd.api+json");

		if ((actionHeader != null) && (actionHeader.length > 0)) {
console.log("L'HEADER VA ELABORATO, PROCEDO");
console.log(actionHeader);
			//xhr.setRequestHeader("data",JSON.parse(actionHeader));
		} else {
console.log("No header");
		}
	} else {
		xhr.open('get', url , true)
	}
// {"data":{"type": "HvacStart","attributes": {"action": "start","targetTemperature": "25"}}}
	if (setMyHeader === true) {
		if ( false /* debug */) {
console.log("payload test");
			try {
				xhr.send('{"data":{"type": "HvacStart","attributes": {"action": "start","targetTemperature": "25"}}}');
			} catch (err) {
				console.log(">>>>>>>>>>>>Request error 001:", err);
			}
		} else {
console.log("no payload");
			try {
				xhr.send();
			} catch (err) {
				console.log(">>>>>>>>>>>>>>>>Request error 002:", err);
			}
		}
	} else {
		try {
			xhr.send();
		} catch (err) {
			console.log(">>>>>>>>>>>>>>>Request error 003:", err);
		}
	}
  })
}



function justQuery(endpoint) {
  var actionHeader = {};

	console.log("=== DIRECT QUERY");
var 	queryUrl = kamereonurl + "/commerce/v1/accounts/" +
		accountId +
		"/kamereon/kca/car-adapter/v1/cars/" + MY_VIN +
		"/" +
		endpoint +
		QUESTION_MARK +
		"apikey=" + KAMEREON_KEY +
		"&country=" + country;
console.log("finalQueryUrl ", queryUrl);

	const sendQuery = request(queryUrl, true, actionHeader, "get");
	sendQuery
	  .then(showResults)
	  .catch(vehicleError)
	return ("query finished.");

}


function showResults() {
  console.log("showResults");
}

function vehicleError() {
  console.log("vehicleError");
}


async function loadData() {

/*
  const response = await fetch('http://ip-api.com/json');
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} - ${response.statusText}`);
  }
  const data = await response.json();
  $(TextView).only().text = `You appear to be in ${data.city ? data.city : data.country}`;
*/

}
