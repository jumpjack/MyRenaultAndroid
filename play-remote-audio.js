const {TextView, Composite, Page, Button, NavigationView, ui} = require('tabris');

let path ='https://raw.githubusercontent.com/jumpjack/MyRenaultAndroid/main/beep-01a.mp3';
let onSuccess = () => console.log('Audio file "' + path  + '" loaded successfully');
let onError = err => console.log('Unable to play audio file "' + path  + '": ' + err.code + ' - ' + err.message);

console.log("playing " + path);

mymedia= new Media(path, onSuccess, onError);


let navigationView = new NavigationView({left: 0, top: 0, right: 0, bottom: 0})
  .appendTo(ui.contentView);

mybutton = new Button({id: 'playButton', text: "PLAY"})
	.appendTo(ui.contentView)
	.on('select', () => myplay());


function myplay() {
  mymedia.play();
  
}

