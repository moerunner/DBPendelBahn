// Rocky.js
var rocky = require('rocky');

// Global variables to store data
var transport;
var weather;
//var debugmode = true;
var settings = null;
var interval = 1;
var thetime, standby, standbytimea, standbytimeb;
//var scalefactor;
var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
  'Oct', 'Nov', 'Dec'];
var dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
rocky.postMessage({command: 'settings'});

rocky.on('hourchange', function(event) {
  // Send a message to fetch the weather information (on startup and every hour)
  rocky.postMessage({'fetchweather': true});
  //rocky.postMessage({'fetchdb': true});
  rocky.postMessage({'settings': true}); //rocky.postMessage({command: 'settings'});
  
});

rocky.on('minutechange', function(event) {  
  var d = new Date();
  var minutes= d.getMinutes();
  // Send a message to fetch the DB information at interval
  if (minutes%interval === 0.0 ){  //only look at ie. 7, 17, 27 ...
    if (standby){
      thetime = minutes + d.getHours()*60;
      if (standbytimeb < standbytimea){
        if (thetime > standbytimeb && thetime < standbytimea){
          rocky.postMessage({'fetchdb': true});
        }
      } else{
        if (thetime > standbytimeb || thetime < standbytimea){
          rocky.postMessage({'fetchdb': true});
        }
      }

    } else {
      rocky.postMessage({'fetchdb': true});
    }
  }
 
  // Tick every minute
  rocky.requestDraw();
});

rocky.on('message', function(event) {
  // Receive a message from the mobile device (pkjs)
  var message = event.data;
  
   
  if (message.weather || message.dbtransport || message.settings) {
    // Save the weather data
    if (message.weather ){
      weather = message.weather;
    }
    if (message.dbtransport) {
      // Save the DB data
      transport = message.dbtransport;
    }
    if (message.settings){
      settings = message.settings;
      interval = message.settings.interval;
      standby = message.settings.standby;
      if (standby){
        standbytimea = message.settings.standbytime.split(',')[0].split(':');
        standbytimea = standbytimea[0]*60+standbytimea[1]*1;
        standbytimeb = message.settings.standbytime.split(',')[1].split(':');
        standbytimeb = standbytimeb[0]*60+standbytimeb[1]*1;
        var d = new Date();
        thetime =   d.getMinutes()+d.getHours()*60;
        if (standbytimeb < standbytimea){
          if (thetime > standbytimeb && thetime < standbytimea){
            rocky.postMessage({'fetchdb': true});
          }
        } else{
          if (thetime > standbytimeb || thetime < standbytimea){
            rocky.postMessage({'fetchdb': true});
          }
        }
      
      } else {
        rocky.postMessage({'fetchdb': true});
      }
      
      //scalefactor = message.settings.scalefactor/100;
    }

    // Request a redraw so we see the information
    rocky.requestDraw();
}
});

rocky.on('draw', function(event) {
  var light;
  //light = !debugmode;
  //var scalefactor;
  var scalefactor =1;
  light=false;
  var shifttime = 0;
  var shiftdb = 0;
  if (settings) {
    light = settings.colorinv;
    shifttime = settings.shifttime;
    shiftdb=  settings.shiftdb;
    scalefactor = settings.scalefactor;
    scalefactor /= 100;
  }
  
  var ctx = event.context;
  var d = new Date();
  var minutes = d.getMinutes() ;
  var hours = d.getHours();
  // Clear the screen
  //ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);
  ctx.clearRect(0, 0, ctx.canvas.unobstructedWidth, ctx.canvas.unobstructedHeight);
  
  var cscreen ;
  var cfinger;
  var ctext ;
  var cpoints ;
  if (light){  
    cscreen = 'black';//dark colors
    cfinger = 'yellow';
    ctext =  'white';
    cpoints = 'yellow';
  } 
  else{
    cscreen = 'white'; //light colors
    cfinger = 'darkred';
    ctext =  'black';
    cpoints = 'darkred';
  }
  

  
    
  // Determine the width and height of the display
  var w = ctx.canvas.unobstructedWidth;
  var h = ctx.canvas.unobstructedHeight;

  // Determine the center point of the display
  // and the max size of watch hands
  var cx = w / 2;
  var cy = h / 2;
  
  // -20 so we're inset 10px on each side
  var maxLength =  (Math.min(w, h) - 4) / 2;
  ctx.fillStyle = cscreen;
  ctx.fillRect(0, 0, w, h);
  
  
  //draw point

  for (var i = 0; 12 > i ; i++) {
    //ctx.strokeStyle = cpoints;
    //ctx.beginPath();
    //ctx.lineWidth = 5;
    var arcel= (Math.PI)/6*i ;
    //ctx.arc(cx,cy, maxLength*scalefactor, arcel, arcel, false);
    //ctx.stroke();
    var asymetriccanvas = 0;
    drawHand(ctx, cx, cy, arcel, maxLength*2, 3, cpoints);
    if (Math.abs(w-h)>2){
      asymetriccanvas=(Math.abs(Math.cos(arcel))-0.5)*10;
      drawHand(ctx, cx, cy, arcel, (asymetriccanvas+maxLength)*scalefactor, 5, cscreen);
    }
   //drawHand(ctx, cx, cy, arcel, (asymetriccanvas+maxLength)*scalefactor, 5, cscreen);
  }
  if (Math.abs(w-h)<2){
  ctx.fillStyle = cscreen;
  ctx.rockyFillRadial(cx, cy, 0, maxLength*scalefactor, 0, 2 * Math.PI);
  }  
  

  // Calculate the minute hand angle
  var minuteFraction = (d.getMinutes()) / 60;
  var minuteAngle = fractionToRadian(minuteFraction);
  if(scalefactor <1.49){
  // Draw the minute hand
  drawHand(ctx, cx, cy, minuteAngle, maxLength*0.7, 4, cfinger);
  drawHand(ctx, cx, cy, minuteAngle, maxLength*0.7, 2, cscreen);
  }
  // Calculate the hour hand angle
  var hourFraction = (d.getHours() % 12 + minuteFraction) / 12;
  var hourAngle = fractionToRadian(hourFraction);
if(scalefactor <1.49){
  // Draw the hour hand
  drawHand(ctx, cx, cy, hourAngle, maxLength * 0.4, 5, cfinger);
  drawHand(ctx, cx, cy, hourAngle, maxLength * 0.4, 2, cscreen);
}
// Draw the DIGITAL CLOCK text, top center
  ctx.fillStyle = ctext;
  ctx.textAlign = 'center';
  //ctx.font = '26px bold Leco-numbers-am-pm';
  ctx.font = '28px light numbers Leco-numbers';
  ctx.fillText(addZero(hours)+':'+addZero(minutes), ctx.canvas.unobstructedWidth/2 , ctx.canvas.unobstructedHeight*0.17-shifttime ); //  ... unobstructedWidth/2, ...
  // Draw DATE underneath
  var stryear= '' + d.getFullYear();
  stryear = stryear.substr(2);
  var clockDate = dayNames[d.getDay()] + ' ' + d.getDate() + ' ' +
                    monthNames[d.getMonth()] + ' ' + stryear;
  ctx.font = '18px Gothic';
  //var month = d.getMonth()+1;
  ctx.fillText(clockDate, ctx.canvas.unobstructedWidth/2 , ctx.canvas.unobstructedHeight*0.32-shifttime); //d.getDate()+'.'+month+'.'+d.getFullYear()
  
  
   // Draw the conditions (before clock hands, so it's drawn underneath them)
  if (transport) {
    drawtransport(ctx, transport, ctext,shiftdb);
  }
    // -------------------<  WEATHER  > -----------------------------
  if (weather) {
    drawWeather(ctx, weather, ctext,shiftdb);
  }
  // -------------------< / WEATHER  > ----------------------------
});

function drawWeather(ctx, weather, ctext,shiftdb) {
  // Create a string describing the weather
  var weatherString = weather.celcius    + '°C,' + weather.wind + 'km/h,' + weather.desc;
//var weatherString = weather.fahrenheit + 'ºF, ' + weather.desc;

  // Draw the text, top center
  ctx.fillStyle = ctext;
  ctx.textAlign = 'center';
  ctx.font = '14px Gothic';
  ctx.fillText(weatherString, ctx.canvas.unobstructedWidth / 2, ctx.canvas.unobstructedHeight*0.72+shiftdb-10);
}


function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}


function drawtransport(ctx, transport, textcolor,shiftdb) {
  // Create a string describing the transport
  var transportString = transport.allinone;

  // Draw the text, top center
  ctx.fillStyle = textcolor;
  ctx.textAlign = 'center';
  ctx.font = '18px Gothic';
  ctx.fillText(transportString, ctx.canvas.unobstructedWidth/2 , ctx.canvas.unobstructedHeight*0.6 +shiftdb-10); //  ... unobstructedWidth/2, ...
}

function drawHand(ctx, cx, cy, angle, length, lw, color) {
  // Find the end points
  var x2 = cx + Math.sin(angle) * length;
  var y2 = cy - Math.cos(angle) * length;

  // Configure how we want to draw the hand
  ctx.lineWidth = lw;
  ctx.strokeStyle = color;
  //ctx.fillStyle('white');

  // Begin drawing
  ctx.beginPath();

  // Move to the center point, then draw the line
  ctx.moveTo(cx, cy);
  ctx.lineTo(x2, y2);

  // Stroke the line (output to display)
  ctx.stroke();
}

function fractionToRadian(fraction) {
  return fraction * 2 * Math.PI;
}



