// PebbleKit JS (pkjs)
var myAPIKey = '123';
var station1A,station2A,station1B,station2B,changedir,colorinv,onlynvbool,onlynv,interval,scalefactor,shifttime,shiftdb;

var Clay = require('./clay');
var clayConfig = require('./config');
var clay = new Clay(clayConfig, null, { autoHandleEvents: false });

Pebble.addEventListener('showConfiguration', function(e) {
  Pebble.openURL(clay.generateUrl());
});

Pebble.addEventListener('webviewclosed', function(e) {
  if (e && !e.response) {
    return;
  }

  // Return settings from Config Page to watch
  var settings = clay.getSettings(e.response, false);

  // Flatten to match localStorage version
  var settingsFlat = {};
  Object.keys(settings).forEach(function(key) {
    if (typeof settings[key] === 'object' && settings[key]) {
      settingsFlat[key] = settings[key].value;
    } else {
      settingsFlat[key] = settings[key];
    }
  });
  console.log(settingsFlat);

  settings = JSON.parse(settingsFlat);

  if (settings) {
    
    Pebble.postMessage({
            'settings': {  //event
              'colorinv': settings.colorinv,
              'interval': settings.interval,
              'scalefactor': settings.scalefactor,
              'shifttime': settings.shifttime,
              'shiftdb': settings.shiftdb
              }
          });
  }

   //console.log(settingsFlat);
  //Pebble.postMessage(settingsFlat);
});



Pebble.on('message', function(event){
  var message = event.data;
  
  
  if (event.data.command === 'settings') {
    restoreSettings();
  }
  
  
  // WEATHER code ---------------------------------------------------------------
  var weatherData;
  if (message.fetchweather) {
      navigator.geolocation.getCurrentPosition(function(pos) {
        var url = 'http://api.openweathermap.org/data/2.5/weather' +
                '?lat=' + pos.coords.latitude +
                '&lon=' + pos.coords.longitude +
                '&appid=' + myAPIKey;
  
        request(url, 'GET', function(dom) {  
           weatherData = JSON.parse(dom.responseText);
              
          Pebble.postMessage({
            'weather': {
              // Convert from Kelvin
              'celcius': Math.round(weatherData.main.temp - 273.15),
              'fahrenheit': Math.round((weatherData.main.temp - 273.15) * 9 / 5 + 32),
              'desc': weatherData.weather[0].main,
              'wind': Math.round(weatherData.wind.speed * 3.6)
            }
          
          });
      }, function(err) {
        console.error('Error getting location');
      },
      { timeout: 50000, maximumAge: 120000 });
      }                                         
    );
  }
  var settings = JSON.parse(localStorage.getItem('clay-settings'));
  
  
  station1A =settings.cstation1a;
station1B=settings.cstation1b;
station2A= settings.cstation2a;
station2B= settings.cstation2b;
  onlynvbool = settings.onlynv;
  if (onlynvbool){
    onlynv='&journeyProducts=1016';
  }
  else{
    onlynv='';
  }
  
               
            
        
    
  // DB Transportation code -----------------------------------------------------

 changedir=       settings.changedir;
  
  var ChangeDirectionOnTimeM = changedir.split(':')[0]*60+changedir.split(':')[1]*1;
  
  // Get the message that was passed
  var d = new Date();
  var stationA, stationB;
  //var minutes = d.getMinutes();
  var daymins = d.getMinutes() + d.getHours() * 60;
  if (message.fetchdb) {
    if (daymins < ChangeDirectionOnTimeM) {
      stationA = station1A;
      stationB = station1B;
    }
    else {
      stationA = station2A ;
      stationB = station2B ;
    }
    

    var url='https://mobile.bahn.de/bin/mobil/query.exe/dox?';
    var data= 'S='+ stationA +
      '&Z=' + stationB +
      '&protocol=https:' +
      '&timesel=depart' + 
        onlynv +
      '&rt=1' +
      '&use_realtime_filter=1' +
      '&start=1';
    url = url+data;//+':'; 
console.log('passed url: ' + url);
    //url ='http://mobil.bahn.de/bin/query.exe/dox?S=K%C3%B6ln&Z=Leverkusen%20Mitte&start=1&rt=1'; //alternativ
    request(url, 'GET', function(xmldom) {
      
console.log("received URL: " + xmldom.responseURL);
      //console.log("This is the content you got: " + xmldom.responseText);
      var code =  xmldom.responseText.split('</thead>');
      code = splito(code[code.length-1],'</table>',0);
      
console.log("This is the received webpage: \n" + code + '\n');
      //var code = dom.getElementsByTagName('tbody')[0].innerHTML;
      //get each line
console.log('splitting lines');
      /*
      var lines = code.split('</tr><tr><td colspan="4" style="padding:0 !important;"><div class="rlinebig"></div></td></tr>');
console.log('splitted lines, leng: '+ lines.length);
      
      var startloop = 0;
      var endloop = 2; //lines.length-3
      if (typeof lines[1] == 'undefined') {
        console.log('lines[1] is undefined, splitting with timelink');
        */
      var  lines = code.split('overview timelink');
        console.log('timelink splitted lines, leng: '+ lines.length);
      var  startloop = 1;
      var endloop = lines.length -1 ;
      /*
      }
      */
      var overview_link = [];             // link to connection
      var overview_timelink_a = [];       // boardingtimes start
      var overview_timelink_b = [];       // boardingtimes end
      var overview_tprt_a =[];            // delay start
      var overview_tprt_b =[];            // delay end
      var overview_tprt_c = [];           // concanate delays
      var overview_a = [];                // changes 
      var overview_b = [];                // travel time
      var overview_iphonepfeil_a = [];    // train types
      //var overview_iphonepfeil_b = [];    // price
var disptext=null;
    
      for (var i = startloop; endloop >= i ; i++) {
        var inotlines = i -startloop
        var check = 0;
        console.log('line '+ i + ': \n' + lines[i]);

          overview_link.push(lines[i].split('<a href="')[1].split('">')[0]);               // link to connection
          overview_timelink_a.push(splito(splito(lines[i],'<span class="bold">',1),'<',0));// boardingtimes start
          overview_timelink_b.push(lines[i].split('<span class="bold">')[2].split('<')[0]);// boardingtimes end
        console.log('departure: ' + overview_timelink_a[inotlines]); //+ '  ' + overview_timelink_b[inotlines]);
          var alertlink = lines[i].split('tprt">')[1].charAt(1);// indicates which kind of delay information is given for overview_timelink_a
        console.log('alertlink: >>'+ alertlink +'<< '+ check++);
          if (alertlink=='a'){    // true error in connection
            overview_tprt_a.push('!');
            overview_tprt_b.push('!');
          }
          else if (alertlink=='n'){   // really no information available (bus or sth like this)
            overview_tprt_a.push('.');
            overview_tprt_b.push('.');
          }
          else if (alertlink == 's'){  // delay time 
            var alertlink2 = lines[i].split('tprt">')[1].charAt(13);
            
            if ( alertlink2 == 'r'){  // indicates red delay time. train is simply to late
              overview_tprt_a.push(lines[i].split('"red">')[1].split('</span>')[0]);
              //overview_tprt_b.push(lines[i].split('"red">')[2].split('</span>')[0]); // this will eventually fail. if second delay is not red.
              overview_tprt_b.push('.'); // as long as not fixed better say "i dont know"
            }
            else if (alertlink2 == 'o'){ // indicates green delaytime (under 5min is obviously 'OK')
              overview_tprt_a.push(lines[i].split('"okmsg">')[1].split('</span>')[0]);
            
              if ( lines[i].split('"okmsg">')[1].charAt(16)== 'n' ){ // no information available. charat 16 is ok because overview_tprt_a has exact 2 chars here 
                overview_tprt_b.push('.');
              }
              else{
                overview_tprt_b.push(lines[i].split('"okmsg">')[2].split('</span>')[0]); // this will eventually fail. not sure if this is always the case.
              }
            }
            else {
              overview_tprt_a.push('.'); // no information available
              overview_tprt_b.push('.');
            }
            
          }

          var overview_m = lines[i].split('"overview">')[1].split('<');
          overview_a.push( overview_m[0]);                               // changes 
          overview_b.push( overview_m[1].split('>')[1].split('<')[0]);   // travel time

          overview_iphonepfeil_a.push(lines[i].split('iphonepfeil">')[1].split('<')[0]); // train types

          //    var here = lines[i].split('<span class="bold">')[2].split('</span>')[0];    
          //var here = lines[i].split('<span class="bold">')[2].split('</span>')[0];   

          if (overview_tprt_a[inotlines] === overview_tprt_b[inotlines]){ 
              overview_tprt_c.push(overview_tprt_a[inotlines]);   // concanate delays
          }
          else{
              overview_tprt_c.push(overview_tprt_a[inotlines]+overview_tprt_b[inotlines]);
          }

      }
      var dispindex = 0;
      if (settings.favorites !== ''){
          var favoritemin = settings.favorites.split(',');
          for (i = endloop ;  startloop <= i ; i--) { //search for next approaching favorite train. 
            var inotlinesb = i-startloop;
            console.log('actualmin '+overview_timelink_a[inotlinesb] +' ' + i + ' line ' + lines[i]);
            var actualmin = splito(overview_timelink_a[inotlinesb],':',1);  // get found minutes
            console.log('actualmin');
            for (var k = 0; favoritemin.length-1 >= k ; k++) {      
              if(actualmin*1 == favoritemin[k]*1 && favoritemin[k] !== ""){                // compare found minutes on site with favorits from settings            
                dispindex = inotlinesb;  //overwrite everytime a favorite is found
              }
            }
          }
        }
     
      
      if (overview_tprt_a[dispindex] == '!'){ // Bahn say there is something wrong in regared transit
        var url2a = overview_link[dispindex].split('&amp;');
        var url2 = url2a.join("&");
        console.log("url2 is:"+url2);
        request(url2, 'GET', function(xmldom) {
          var code2 =  xmldom.responseText;
          var out = splito(splito(splito(splito(code2,overview_timelink_a[dispindex],1),overview_timelink_b[dispindex],0),'+',1),'<',0) ;

          if ( out != 'undefined' ) {
            disptext = overview_timelink_a[dispindex] +'+'+ out + '!! ' + overview_iphonepfeil_a[dispindex];
              Pebble.postMessage({ 
            'dbtransport': {  //event
              'allinone': disptext
              }
          });
              
            }
            else{
              disptext = overview_timelink_a[dispindex] + ' !! ' + overview_iphonepfeil_a[dispindex];
              Pebble.postMessage({ 
            'dbtransport': {  //event
              'allinone': disptext
              }
          });
            }
        });   
      }
      else{
        disptext = overview_timelink_a[dispindex] + overview_tprt_a[dispindex] + ' ' + overview_iphonepfeil_a[dispindex];
        Pebble.postMessage({ 
            'dbtransport': {  //event
              'allinone': disptext
              }
          });
      }
    
    });    //end of request
    }     //end of message.fetchdb 
});      //end of pebble.on

function splito(text,splitter,index){ //split only if splitable. else return string 'undefined'
  if (typeof text=='undefined'){
    console.log('splito failed. string not defined at all, will not split. splitter was: '+ splitter);
    return 'undefined';
  }
  else{
    console.log('splitolog: text: '+text+' \n splitter:'+ splitter);
  }
  
  if (text=='undefined'){
    console.log('splito failed. string was undefined, will not split. splitter was: '+ splitter);
    return 'undefined';
  }
  else if (typeof text.split(splitter)[1] == 'undefined'){  //make sure an index 0 is not accepted if not splitted
    console.log('splito failed. splitter did not occur in string. did not split. splitter was: '+ splitter);
    return 'undefined';
  }
  else if (typeof text.split(splitter)[index] == 'undefined'){  //make sure an index 0 is not accepted if not splitted
    console.log('splito failed. splitting was successfull but index: '+index + ' was  undefined. splitter was: '+ splitter);
    return 'undefined';
  }
  else{
    var result=text.split(splitter)[index];
    console.log('splito successfull. splitter was: '+ splitter + 'return value is '+result);
    return result;
  }
}


function restoreSettings() {
  // Restore settings from localStorage and send to watch
  var settings = JSON.parse(localStorage.getItem('clay-settings'));
  
  if (settings) {
  //Pebble.postMessage(settings);
  
  
    colorinv = settings.colorinv;
    interval = settings.interval;
    scalefactor = settings.scalefactor;
    shifttime= settings.shifttime;
    shiftdb= settings.shiftdb;
    Pebble.postMessage({ 
            'settings': {  //event
              'colorinv': colorinv,
              'interval': interval,
              'scalefactor': scalefactor,
              'shifttime': shifttime,
              'shiftdb': shiftdb
              }
          });
          
  }
  
  
}



function request(url, type, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onload = function (e) {
    // HTTP 4xx-5xx are errors:
    if (xhr.status >= 400 && xhr.status < 600) {
      console.error('Request failed with HTTP status ' + xhr.status + ', body: ' + this.responseText);
      return;
    }
    callback(this);
    //console.log('Got response: ' + this.responseText);
    
  };
  xhr.open(type, url);
  //xhr.withCredentials = true;
  //xhr.responseType = "text";
  xhr.send();
}

/*
Changelog:
v1.1:
- Donate Button hinzugefügt
- Limits der Slider für DB und Digitaluhr Anzeige erhöht
v1.2:
*/