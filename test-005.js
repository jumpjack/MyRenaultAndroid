// 0.0.5 All checks passed: successfully retrieved cookie, JWT token, personId, accountId, VIN and vehicles
// 0.0.4 Single user+pass input, cookievalue output on interface
// 0.0.3 Skipped
// 0.0.2: Cleaned up interface and source; no functions added, still just logging in to Gigya server.

import {Button, TextView, contentView, Stack, TextInput} from 'tabris';
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


var QUESTION_MARK = "?";
var country = "IT";
var cookieValue = "";
var JWT = "";
var personId = "";
var accountId = "";
var accountId2 = "";
var MY_VIN = "";
var globalVehicles = [];

contentView.append(
  <Stack stretchX alignment='stretchX' spacing={16} padding={16}>
    <TextInput id='uspass' message='username,password' type='password' 	/>
    <Button onSelect={login}>Login</Button>
    <TextView text='(Here you will see output)' alignment='left' id='output' />
  </Stack>
);
    //<TextInput id='username' message='user name' 	/>
    //<TextInput id='password' message='password' type='password'/>

const output = $('#output').only(TextView);
output.text = "(Here you will see output)";
console.log("Ready to start. Api keys:", GIGYA_API_KEY, KAMEREON_KEY);


function login() {
  var usp =  `${$(TextInput).only('#uspass').text}`;
  username = usp.split(",")[0];
  password = usp.split(",")[1];
  output.text = "(Here you will see output)";

  var loginUrl =  gigyaurl + "/accounts.login?loginID=" + username + "&password=" + password + "&apikey=" + GIGYA_API_KEY;

console.log("URL ready:", loginUrl);

  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if (xhr.readyState === xhr.DONE) {
      console.log("DONE:" , xhr.response);
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
      var JWTurl = gigyaurl + "/accounts.getJWT?fields=data.personId%2Cdata.gigyaDataCenter&expiration=600&APIKey=" + GIGYA_API_KEY +
"&sdk=js_latest&authMode=cookie&pageURL=https%3A%2F%2Fmyr.renault.it%2F&sdkBuild=12426&format=json&login_token=" +	cookieValue;

      const xhr2 = new XMLHttpRequest();
      xhr2.onreadystatechange = () => {
        console.log("send2a...");
        if (xhr2.readyState === xhr2.DONE) {
          console.log("send2c...");
          var JSONresponse =  JSON.parse(xhr2.response);
          console.log("DONE:" , xhr2.response);
          JWT = JSONresponse.id_token;
          // Test 2
            output.text = "JWT: " + JWT;

/*            var personHeaders = {
              'login_token': cookieValue,
              'apikey': KAMEREON_KEY,
              'expiration': 87000
            };
*/

            var personUrl = gigyaurl + "/accounts.getAccountInfo?apikey=" + GIGYA_API_KEY + "&login_token=" + cookieValue;
            const xhr3 = new XMLHttpRequest();
            xhr3.onreadystatechange = () => {
              console.log("send3a...");
              if (xhr3.readyState === xhr3.DONE) {
                console.log("send3c...");
                var JSONresponse =  JSON.parse(xhr3.response);
                console.log("DONE:" , xhr3.response);
                personId = JSONresponse.data.personId;;
                // Test 3
                output.text = "personId: " + personId;

                var accountUrl = kamereonurl + "/commerce/v1/persons/" +
                  personId +
                  "?apikey=" + KAMEREON_KEY +
                  "&country=" + country;


                const xhr4 = new XMLHttpRequest();
                xhr4.onreadystatechange = () => {
                  console.log("send4a...");
                  if (xhr4.readyState === xhr4.DONE) {
                    console.log("send4c...");
                    var JSONresponse =  JSON.parse(xhr4.response);
                    console.log("DONE:" , xhr4.response);
                    accountId = JSONresponse.accounts[0].accountId;
                    accountId2 = JSONresponse.accounts[1].accountId;
                    // Test 4
                      output.text = "accountId: " + accountId + "\n" + accountId2;


                      var vehiclesListQueryUrl = kamereonurl + "/commerce/v1/accounts/" +
                        accountId2 +
                        "/vehicles" +
                        "?apikey=" + KAMEREON_KEY +
                        "&country=" + country;

                      const xhr5 = new XMLHttpRequest();
                      xhr5.onreadystatechange = () => {
                        console.log("send5a...");
                        if (xhr5.readyState === xhr5.DONE) {
                          console.log("send5c...");
                          var JSONresponse =  JSON.parse(xhr5.response);
                          console.log("DONE:" , xhr5.response);
                          globalVehicles = JSONresponse.vehicleLinks;

                          // Test 5
                          output.text = "";
                          for (var vins=0; vins < JSONresponse.vehicleLinks.length; vins++) {
                            //opt = document.createElement("option");
                            //opt.innerHTML = VINResponse.vehicleLinks[vins].vin;
                            //document.getElementById("lstVIN").appendChild(opt);
                            output.text +=  JSONresponse.vehicleLinks[vins].vin + ",";
                          }
                        }
                      };
                      xhr5.open('GET', vehiclesListQueryUrl);

                      xhr5.setRequestHeader("x-gigya-id_token", JWT);
                      xhr5.setRequestHeader("apikey", KAMEREON_KEY);
                      xhr5.setRequestHeader("Content-type", "application/vnd.api+json");
                      xhr5.setRequestHeader("expiration", "87000");
                      xhr5.setRequestHeader("login_token", cookieValue);

                      console.log("send5...");
                      xhr5.send();

                  }
                };
                xhr4.open('GET', accountUrl);

                xhr4.setRequestHeader("x-gigya-id_token", JWT);
                xhr4.setRequestHeader("apikey", KAMEREON_KEY);
                xhr4.setRequestHeader("Content-type", "application/vnd.api+json");
                xhr4.setRequestHeader("expiration", "87000");
                xhr4.setRequestHeader("login_token", cookieValue);

                console.log("send4...");
                xhr4.send();

              }
            };
            xhr3.open('GET', personUrl);
            console.log("send3...");
            xhr3.send();
        }
      };
      xhr2.open('GET', JWTurl);
      console.log("send2...");
      xhr2.send();

    }
  };
  xhr.open('GET', loginUrl);
  xhr.send();
}


function loadData2() {
  //dummy
}


