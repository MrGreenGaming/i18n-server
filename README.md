# Mr. Green Gaming i18n API

Serves .po parsed JSON translations from <https://github.com/MrGreenGaming/i18n>

## Development / Production

### Prerequisites

Make sure you have [docker and docker-compose installed](https://docs.docker.com/compose/install/).

### Development

Run command `npm run start:dev`.
This will docker-compose the `docker-compose.dev.yml` file and start the development container with a file watcher/hot reloading.
Debug is exposed at `localhost:9229` and the API at `localhost:3000`

Keep in mind that the root of this repo will be a volume inside your container.

### Production

Run command `npm run start`.

This will docker-compose `docker-compose.prod.yml` file and start the container in production at port `7002`.

You can overwrite docker-compose values using the standard docker-compose overriding methods. [More info on overrriding](https://docs.docker.com/compose/extends/)

## API Paths

### GET /:project/

**Get project information**
*Example response:*

```json
{
  "name": "TestProject",
  "components": [
    {
      "name": "TestComponent",
      "languages": [
        {
          "name": "en",
          "file": "en.json"
        },
        {
          "name": "nl",
          "file": "nl.json"
        }
      ]
    }
  ]
}
```

### GET /:project/:component

**Get component information**
*Example response:*

```json
{
  "name": "TestComponent",
  "languages": [
    {
      "name": "en",
      "file": "en.json"
    },
    {
      "name": "nl",
      "file": "nl.json"
    }
  ]
}
```

### GET /:project/:component/translations

**Get all translations of the component**
*Example response:*

```json
{
   "en":{
      "":{
         "GreenCoin":[
            "GreenCoin",
            "GreenCoins"
         ],
         "You successfully logged in!\n\nYour account is linked to your pc and you will automatically log in.":[
            "You successfully logged in!\n\nYour account is linked to your pc and you will automatically log in."
         ],
         "Log out":[
            "Log out"
         ],
         "Login":[
            "Login"
         ],
         "Wrong username, e-mail or password! Go to www.mrgreengaming.com/forums/lostpassword/ to retrieve your password.":[
            "Wrong username, e-mail or password! Go to www.mrgreengaming.com/forums/lostpassword/ to retrieve your password."
         ],
         "Not logged in!":[
            "Not logged in!"
         ],
         "Press F6 to buy items in the GreenCoins shop.":[
            "Press F6 to buy items in the GreenCoins shop."
         ]
      },
      "color":{
         "Aqua":[
            "Aqua"
         ]
      },
      "GCshop Teams Tab":{
         "Teams":[
            "Teams"
         ]
      },
      "Character model":{
         "Skin":[
            "Skin"
         ]
      },
      "Keyboard":{
         "Key":[
            "Key"
         ]
      }
   },
   "nl":{
      "":{
         "GreenCoin":[
            "GreenCoin",
            "GreenCoins"
         ],
         "You successfully logged in!\n\nYour account is linked to your pc and you will automatically log in.":[
            "Je bent succesvol ingelogd!\n\ne account is gekoppeld aan je pc en je logt automatisch in."
         ],
         "Log out":[
            "Uitloggen"
         ],
         "Login":[
            "Inloggen"
         ],
         "Wrong username, e-mail or password! Go to www.mrgreengaming.com/forums/lostpassword/ to retrieve your password.":[
            "Verkeerde gebruikersnaam, e-mail of wachtwoord! Ga naar www.mrgreengaming.com/forums/lostpassword/ om jou wachtwoord op te halen."
         ],
         "Not logged in!":[
            "Niet ingelogd!"
         ],
         "Press F6 to buy items in the GreenCoins shop.":[
            "Druk op F6 om items in de GreenCoins winkel te kopen."
         ]
      },
      "color":{
         "Aqua":[
            "Aqua"
         ]
      },
      "GCshop Teams Tab":{
         "Teams":[
            "Teams"
         ]
      },
      "Character model":{
         "Skin":[
            "Skin"
         ]
      },
      "Keyboard":{
         "Key":[
            "Toets"
         ]
      }
   }
}
```

The structure is as follows: `languageCode > context > untranslatedString > translatedStringArray`.
Strings that have no context are saved under the context `""`, as an empty string.
The reason it serves an array of translated strings is because a string can have plural/singular forms.
