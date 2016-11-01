module.exports = [
  {
    "type": "heading",
    "defaultValue": "DB Pendel Pebble"
  },
  {
    "type": "text",
    "defaultValue": "configuration"
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
        "defaultValue": "Köln Hbf",
        "label": "Departure <em>von</em>",
        "attributes": {
          "placeholder": "eg: Köln Hbf or ibnr",
          "limit": 50,
          "type": "text"
        }
      },
      {
        "type": "input",
        "messageKey": "cstation1b",
        "defaultValue": "Düsseldorf Hbf",
        "label": "Arrival <em>nach</em>",
        "attributes": {
          "placeholder": "eg: Düsseldorf Hbf or ibnr",
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
        "defaultValue": "Düsseldorf Hbf",
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
        "defaultValue": "Köln Hbf",
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
         "defaultValue": null,
        "label": 'Favoriten <br><em><font size="1">Komma getrennte Liste mit Minutenwerten, zu der präfertierte Züge abfahren</font></em>',
        "attributes": {
          "placeholder": "eg: 07,18,21",
          "limit": 30,
          "type": "text"
        }
       },
      {
        "type": "input",
        "messageKey": "interval",
         "defaultValue": 1,
        "label": 'Interval <br><em><font size="1">Aktualisierungsinterval der DB Anzeige in Minuten </font></em>',
        "attributes": {
          "placeholder": "eg: 3",
          "limit": 30,
          "type": "number"
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
        "defaultValue": 100,
        "label": "Ziffernblatt skalieren",
        "description": 'in Prozent (keine Zeiger mehr bei 150%)', 
        "min": 50,
        "max": 150,
        "step": 1
      },
      {
        "type": "slider",
        "messageKey": "shifttime",
        "defaultValue": 1,
        "label": "Position der Digitaluhr",
        "min": 1,
        "max": 40,
        "step": 1
      },
       {
        "type": "slider",
        "messageKey": "shiftdb",
        "defaultValue": 10,
        "label": "Position der DB Anzeige",
        "min": 1,
        "max": 40,
        "step": 1
      },
    ]
  },
  
  {
    "type": "submit",
    "defaultValue": "Save Settings"
  }
];