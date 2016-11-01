// PebbleKit JS (pkjs)
var myAPIKey = '7de2474761cacdfed0c93e614e1eecfd';
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
    
    var und = '&';
    //var und = '&amp;';
/*
    var url = 'http://mobil.bahn.de/bin/query.exe/dox?';
    var data = 'S=' + '8000207' + //stationA + //
        '&amp;Z=' +  '8006713' + //stationB +  //
        '&amp;timeSel=arrive&amp;rt=1&amp;start=1';
    */
    var url='https://mobile.bahn.de/bin/mobil/query.exe/dox?';
    var data= 'S='+ stationA +
      und + 'Z=' + stationB +
      und + 'protocol=https:' +
      und + 'timesel=depart' + 
        onlynv +
      und + 'rt=1' +
      und + 'use_realtime_filter=1' +
      und + 'start=1';
    //url = new URL('http://tinyurl.com/pebtr1'); //works !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    url = url+data+':'; 
        //'&amp;start=1&amp;rt=1';
    console.log(url);
    //url ='http://mobil.bahn.de/bin/query.exe/dox?S=K%C3%B6ln&Z=Leverkusen%20Mitte&start=1&rt=1';
    //console.log(url);
    request(url, 'GET', function(xmldom) {
      
console.log("This is the DB URL: " + xmldom.responseURL);
      //console.log("This is the content you got: " + xmldom.responseText);
      var code =  xmldom.responseText.split('</thead>');
console.log('heads' + code.length);
      code = code[code.length-1].split('</table>')[0];
      
console.log("This is the content you got: " + code);
      //var code = dom.getElementsByTagName('tbody')[0].innerHTML;
      //get each line
console.log('splitting lines');
      var lines = code.split('</tr><tr><td colspan="4" style="padding:0 !important;"><div class="rlinebig"></div></td></tr>');
console.log('linetype: '+ typeof lines[1]);
      console.log('splitted lines, leng: '+ lines.length);
      console.log('line'+(lines.length-2)+': '+ lines[lines.length-2]);
      console.log('line'+(lines.length-1)+': '+ lines[lines.length-1]);
      
      var startloop = 0;
      var endloop = lines.length-3;
      console.log('endloop: '+ endloop);
      if (typeof lines[1] == 'undefined') {
        lines = code.split('overview timelink');
        startloop = 1;
        endloop = lines.length-3;
      }
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
      var j = 0;
      for (var i = startloop; endloop >= i ; i++) {
console.log(j++);
console.log(lines[i]);
          overview_link.push(lines[i].split('<a href="')[1].split('>')[0]);

          overview_timelink_a.push(lines[i].split('<span class="bold">')[1].split('</span>')[0]);

          overview_timelink_b.push(lines[i].split('<span class="bold">')[2].split('</span>')[0]);
          

          var alertlink = lines[i].split('tprt">')[1].charAt(1);

          if (alertlink=='a'){    // true error in connection
            overview_tprt_a.push('!');
            overview_tprt_b.push('!');
          }
          else if (alertlink=='n'){   //no information available
            overview_tprt_a.push('.');
            overview_tprt_b.push('.');
          }
          else if (alertlink=='s'){

            if ( lines[i].split('tprt">')[1].charAt(13)=='r'){
              overview_tprt_a.push(lines[i].split('"red">')[1].split('</span>')[0]);
              overview_tprt_b.push(lines[i].split('"red">')[2].split('</span>')[0]);
            }
            else if ( lines[i].split('tprt">')[1].charAt(13)=='o'){
              overview_tprt_a.push(lines[i].split('"okmsg">')[1].split('</span>')[0]);
            
              if ( lines[i].split('"okmsg">')[1].charAt(16)=='n'){ //no information available
                overview_tprt_b.push('.');
              }
              else{
                overview_tprt_b.push(lines[i].split('"okmsg">')[2].split('</span>')[0]);
              }
            }
            else {
              overview_tprt_a.push('.');
              overview_tprt_b.push('.');
            }
            
          }

          var overview_m = lines[i].split('"overview">')[1].split('<');
          overview_a.push( overview_m[0]); 
          overview_b.push( overview_m[1].split('>')[1].split('<')[0]); 

          overview_iphonepfeil_a.push(lines[i].split('iphonepfeil">')[1].split('<')[0]);

          //    var here = lines[i].split('<span class="bold">')[2].split('</span>')[0];    
          //var here = lines[i].split('<span class="bold">')[2].split('</span>')[0];   

          if (overview_tprt_a[i] === overview_tprt_b[i]){
              overview_tprt_c.push(overview_tprt_a[i]);
          }
          else{
              overview_tprt_c.push(overview_tprt_a[i]+overview_tprt_b[i]);
          }

      }
        var favoritemin = settings.favorites.split(',');
      for (i = endloop ;  startloop <= i ; i--) {
         var actualmin = overview_timelink_a[i].split(':')[1];
        for (var k = 0; favoritemin.length >= k ; k++) {
          if(actualmin == favoritemin[k]){
            disptext=overview_timelink_a[i]+overview_tprt_c[i]+' '+overview_iphonepfeil_a[i];
          }
        }
      }
      if (disptext===null){
         disptext = overview_timelink_a[0]+overview_tprt_c[0]+' '+overview_iphonepfeil_a[0]; //+'/'+d.getMinutes();
      }
      Pebble.postMessage({ 
            'dbtransport': {  //event
              'allinone': disptext
              }
          });
    });    //end of request
    }     //end of message.fetchdb 
});      //end of pebble.on


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
