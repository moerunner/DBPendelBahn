module.exports = [
  {
    "type": "heading",
    "defaultValue": "DB Pendel Bahn"
  },
  {
    "type": "text",
    "defaultValue": '<font size="3">Änderungen in den Einstellungen werden nur gesichert, wenn man diese mit dem >>save settings<< Button bestätigt.</font>'
  },
  {
    "type": "section",
    "items": [
      {
        "type": "heading",
        "defaultValue": "Hinweg"
      },
      {
        "type": "input",
        "messageKey": "cstation1a",
        "defaultValue": "K",
        "label": "Departure <em>von</em>",
        "attributes": {
          "placeholder": "eg: Köln Hbf or ibnr or k",
          "limit": 50,
          "type": "text"
        }
      },
      {
        "type": "input",
        "messageKey": "cstation1b",
        "defaultValue": "d",
        "label": "Arrival <em>nach</em>",
        "attributes": {
          "placeholder": "eg: Düsseldorf Hbf or ibnr or d",
          "limit": 50,
          "type": "text"
        }
      }
    ]
  },
  
  
   {
    "type": "section",
    "items": [
      {
        "type": "heading",
        "defaultValue": "Rückweg" 
      },
       {
        "type": "input",
        "messageKey": "cstation2a",
        "defaultValue": "d",
        "label": "Departure <em>von</em>",
        "attributes": {
          "placeholder": "zB: Düsseldorf Hbf or 8000085",
          "limit": 50,
          "type": "text"
        }
      },
      {
        "type": "input",
        "messageKey": "cstation2b",
        "defaultValue": "k",
        "label": "Arrival <em>nach</em>",
        "attributes": {
          "placeholder": "eg: Köln Hbf or 8000207",
          "limit": 50,
          "type": "text"
        }
      }
      ]
   },
  {
    "type": "section",
    "items": [
      {
        "type": "heading",
        "defaultValue": "Additional"
      },
      {
        "type": "toggle",
        "messageKey": "onlynv",
        "label": "Nur Nahverkehr",
        "defaultValue": false
      },
       {
        "type": "input",
        "messageKey": "changedir",
         "defaultValue": "12:00",
         "label": "Richtungswechsel um",
        "attributes": {
          "placeholder": "12:00",
          "type": "time",
        }
       },
      
       {
        "type": "input",
        "messageKey": "favorites",
         "defaultValue": '61,62',
        "label": 'Favoriten <br><font size="2">Komma getrennte Liste mit Minutenwerten, zu der präfertierte Züge abfahren. Diese werden in der Anzeige bevorzugt.</font>',
        "attributes": {
          "placeholder": "eg: 07,18,21",
          "limit": 70,
          "type": "text"
        }
       },
      {
        "type": "input",
        "messageKey": "interval",
         "defaultValue": 5,
        "label": 'Interval <br><font size="2">Aktualisierungsinterval der DB Anzeige in Minuten</font>',
        "attributes": {
          "placeholder": "eg: 3",
          "limit": 30,
          "type": "number"
        }
       },
      {
        "type": "toggle",
        "messageKey": "standby",
        "label": "Standby aktivieren",
        "defaultValue": false
      },
      {
        "type": "input",
        "messageKey": "standbytime",
        "defaultValue": '20:00,08:00',
        "label": 'Standby Zeit <br><font size="2">Komma getrennte Liste mit 2 Zeitwerten, zwischen denen keine Verbindungen abgerufen werden (um Energie zu sparen).</font>',
        "attributes": {
          "placeholder": "eg: 20:00,08:00",
          "limit": 70,
          "type": "text"
        }
       }
    ]
  },
  {
    "type": "section",
    "items": [
      {
        "type": "heading",
        "defaultValue": "Skin"
      },
      {
        "type": "toggle",
        "messageKey": "colorinv",
        "label": "dunkle Farbgebung",
        "defaultValue": false
      },
      {
        "type": "slider",
        "messageKey": "scalefactor",
        "defaultValue": 80,
        "label": "Ziffernblatt skalieren",
        "description": 'in Prozent (keine Zeiger mehr bei 150%)', 
        "min": 50,
        "max": 150,
        "step": 1
      },
      {
        "type": "slider",
        "messageKey": "shifttime",
        "defaultValue": 0,
        "label": "Position der Digitaluhr",
        "min": -100,
        "max": 100,
        "step": 5
      },
       {
        "type": "slider",
        "messageKey": "shiftdb",
        "defaultValue": 10,
        "label": "Position der DB Anzeige",
        "min": -100,
        "max": 100,
        "step": 5
      }
    ]
  },
  {
    "type": "section",
    "items": [
      {
        "type": "heading",
        "defaultValue": "Misc"
      },
      {
        "type": "toggle",
        "messageKey": "kraken",
        "label": "Zeige Kraken Ether Kurs",
        "defaultValue": false
      },
      {
        "type": "text",
        "defaultValue": '<a href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=YNAK2AH7ZK4WQ">Donate</a><br> zur Motivation und Weiterentwicklung freue ich mich über eure Unterstützung!'
      }
      ]
  },
  {
    "type": "submit",
    "defaultValue": "Save Settings"
  }
];