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
var accountId = "";
var JWT = "";
var MY_VIN = "";
var country = "IT";

contentView.append(
  <Stack stretchX alignment='stretchX' spacing={16} padding={16}>
    <TextInput id='username' message='user name' 	/>
    <TextInput id='password' message='password' type='password'/>
    <Button onSelect={login}>Test 4</Button>
    <TextView/>
  </Stack>
);

console.log("Ready to start. Api keys:", GIGYA_API_KEY, KAMEREON_KEY);


function login() {
  username = `${$(TextInput).only('#username').text}`;
  password = `${$(TextInput).only('#password').text}`;

  var loginUrl =  gigyaurl + "/accounts.login?loginID=" + username + "&password=" + password + "&apikey=" + GIGYA_API_KEY;

console.log("URL ready:", loginUrl);

  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if (xhr.readyState === xhr.DONE) {
      console.log("DONE:" , xhr.response);
	    // Ok, gigya login is working without need for proxy and without CORS error from TABRIS.JS
    }
  };
  xhr.open('GET', loginUrl);
  xhr.send();
}


function loadData2() {
  //dummy
}
