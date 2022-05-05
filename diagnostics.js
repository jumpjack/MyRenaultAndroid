const {fs} = require('tabris');

const getMethods = (obj) => {
  counter = 0;
  let currentObj = obj
  do {
    Object.getOwnPropertyNames(currentObj).map(item => {
        if ((item.indexOf("_") < 0) && (item.indexOf("$") < 0)) {
          console.log(counter++, typeof obj[item],);
          try {
           console.log("     i ", item,); 
           if ( typeof currentObj[item]  !== "function") {
             	try {
              	  console.log("          val=" , currentObj[item]);
                } catch(e) {
                  console.log("          val=?" );
                }
            }
          } catch(e) {
            console.log("    (no data)",e, "<<<");  
          }
        }   
      })
  } while ((currentObj = Object.getPrototypeOf(currentObj)))
}


console.log("Installed modules:" , Object.keys(require('./package.json').dependencies)); // List installed modules (just 'tabris' in developer app);
  
console.log("Device:");
getMethods(device);
  
console.log("Metodhs for 'fs':");
getMethods(fs);



