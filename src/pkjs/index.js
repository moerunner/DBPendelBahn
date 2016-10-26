// PebbleKit JS (pkjs)

Pebble.on('message', function(event) {
  var station1A = 'Köln';
  var station1B = 'Leverkusen Mitte';
  
  /*
    var station1A = 'K%C3%B6ln';
  var station1B = 'Leverkusen%20Mitte';
  */
  var ChangeDirectionOnTimeM = 12*60;
  // Get the message that was passed
  var message = event.data;
  var d = new Date();
  var stationA, stationB;
  if (message.fetchdb) {
    if (d.getMinutes() < ChangeDirectionOnTimeM) {
      stationA = station1A;
      stationB = station1B;
    }
    else {
      stationA = station1B;
      stationB = station1A;
    }
    
    var und = '&amp;';
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
    und + 'rt=1' +
    und + 'use_realtime_filter=1' +
    und + 'start=1';
    url = new URL('http://tinyurl.com/pebtr1'); //works !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //url = new URL(url+data); 
        //'&amp;start=1&amp;rt=1';
    console.log(url);
    //url ='http://mobil.bahn.de/bin/query.exe/dox?S=K%C3%B6ln&Z=Leverkusen%20Mitte&start=1&rt=1';
    //console.log(url);
    request(url, 'GET', function(xmldom) {
      
      console.log("This is the URL: " + xmldom.responseURL);
      //console.log("This is the content you got: " + xmldom.responseText);
      var code =  xmldom.responseText.split('</thead>');
      console.log('heads' + code.length);
      code = code[code.length-1].split('</table>')[0];
      
      console.log("This is the content you got: " + code);
      //var code = dom.getElementsByTagName('tbody')[0].innerHTML;
      //get each line
      var lines = code.split('</tr><tr><td colspan="4" style="padding:0 !important;"><div class="rlinebig"></div></td></tr>');
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


      for (var i = 0; lines.length-3 >= i ; i++) {
          
          overview_link.push(lines[i].split('<a href="')[1].split('>')[0]);
          overview_timelink_a.push(lines[i].split('<span class="bold">')[1].split('</span>')[0]);
          overview_timelink_b.push(lines[i].split('<span class="bold">')[2].split('</span>')[0]);
          var disptext;

          var alertlink = lines[i].split('tprt">')[1].charAt(1);
          if (alertlink=='a'){    // true error in connection
            overview_tprt_a.push('!');
            overview_tprt_b.push('!');
          }
          else if (alertlink=='n'){   //no information available
            overview_tprt_a.push('?');
            overview_tprt_b.push('?');
          }
          else{
            overview_tprt_a.push(lines[i].split('"okmsg">')[1].split('</span>')[0]);
            overview_tprt_b.push(lines[i].split('"okmsg">')[2].split('</span>')[0]);
          }
          var overview_m = lines[i].split('"overview">')[1].split('<');
          overview_a.push( overview_m[0]); 
          overview_b.push( overview_m[1].split('>')[1].split('<')[0]); 
          overview_iphonepfeil_a.push(lines[i].split('iphonepfeil">')[1].split('<')[0]);

          //    var here = lines[i].split('<span class="bold">')[2].split('</span>')[0];    
          //var here = lines[i].split('<span class="bold">')[2].split('</span>')[0];    
          if (overview_tprt_a[i] == overview_tprt_b[i]){
              overview_tprt_c.push(overview_tprt_a[i]);
          }
          else{
              overview_tprt_c.push(overview_tprt_a[i]+overview_tprt_b[i]);
          }
          
          if (overview_a[i] === 0 && ( overview_timelink_a[i].split(':')[1] === 14 || overview_timelink_a[i].split(':')[1] === 18 || overview_timelink_a[i].split(':')[1] == 21)) {
              disptext = overview_timelink_a[i]+overview_tprt_c[i]+' '+overview_iphonepfeil_a[i]+'/'+d.getMinutes();
          }
          else{
              disptext = overview_timelink_a[0]+overview_tprt_c[0]+' '+overview_iphonepfeil_a[0]+'/'+d.getMinutes();
          }
          
          //here= overview_timelink_a[i].split(':')[1];

          Pebble.postMessage({ 
            'dbtransport': {  //event
              'allinone': disptext
              }
              });
      }


    });//end of request
    } //endif message.fetchdb 
    
  
});//end of pebble.on

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
  xhr.responseType = "text";
  xhr.send();
}
