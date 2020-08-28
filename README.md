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

### POST /extract

**Extract a repo specified in extractionsConfig.json**
*Required body*

```json
{
   "name": "repoName",
   "owner": "repoOwner",
   "secret": "secretKey"
}
```

- Secret key
  - Webhook secret as specified in .env

### GET /translations/:project/

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

### GET /translations/:project/:component

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

### GET /translations/:project/:component/:language

**Get translations of the component**
To get all translations, use `all` as language parameter.

*Example responses:*
**/project/component/nl**

```json
{
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
      ],
      "Need more GreenCoins?":[
         "Meer GreenCoins nodig?"
      ],
      "Then visit: https://mrgreengaming.com/greencoins/donate":[
         "Bezoek dan: https://mrgreengaming.com/greencoins/donate"
      ],
      "GreenCoins Shop (F6 to close)":[
         "GreenCoins Shop (F6 om te sluiten)"
      ],
      "Home":[
         "Home"
      ],
      "Hello and welcome to the Grand Guide to GreenCoins!\n\nWTF are Green-Coins?\n--------------------\nThey are a currency used by the Mr. Green community. We created a global database where players can connect their Green-Coins to one account, and use them on different game servers.\n\nWhat can I do with Green-Coins in MTA?\n-------------------------------\nYou can buy car mods, skins, or other fancy stuff that you can use ingame!\n\nWhat do I need to get Green-Coins?\n----------------------------------\nYou need to register a Green-Coins account, go to the \"Register\" tab for more info.\nHow do I get Green-Coins?\n------------------------------------------\n\n":[
         "Hallo en welkom bij de Grote GreenCoins Gids!\n\nWTF zijn Green-Coins?\n--------------------\nHet is een valuta die wordt gebruikt in de Mr. Green gemeenschap. We hebben een globale database gemaakt waar spelers hun Green-Coins aan een account kunnen koppelen en deze op verschillende gameservers kunnen gebruiken.\n\nWat kan ik doen met Green-Coins in MTA?\n-------------------------------\nJe kunt voertuig modificaties, skins en andere leuke dingen kopen die je ingame kunt gebruiken!\n\nWat heb ik nodig om Green-Coins te verdienen?\n----------------------------------\nJe moet een Green-Coins acccount registreren. Klik op het tabblad \"Registreren\" voor meer informatie.\nHoe verdien ik Green-Coins?\n------------------------------------------\n\n"
      ],
      "Donate":[
         "Doneren"
      ],
      "You can donate. For each euro donated you get 1000 GreenCoins.\n\nHow do I donate?\n-----------------------\nGo to mrgreengaming.com and click \"Green-Coins\".\n\nIf you log into your account, you see a conveniently placed button that says \"Send donation\".\n\nJust follow the simple instructions on there and you're done!\n\n":[
         "Je kunt doneren. Voor elke gedoneerde euro krijg je 1000 GreenCoins\n\nHow kan je doneren?\n-----------------------\nGa naar mrgreengaming.com en klik op \"Green-Coins\"\n\nAls je inlogt zie je een handig geplaatste knop met de tekst \"Send donation\".\n\nVolg de eenvoudige instructies en je bent klaar!\n\n"
      ],
      "Win":[
         "Winnen"
      ],
      "The second way to get GreenCoins is racing.\n\nWinning races: you earn GC based on the map length.\nNew toptime: If you're good and manage to get a new top1, top2 or top3 you will earn extra GC!\nEven if you didnt win or finish you earn Green-Coins based on your results, so don't give up!\n\n\n":[
         "De tweede manier om GreenCoins te verdienen is door te racen.\n\nRaces winnen: je verdient GreenCoins op basis van de lengte van de map.\nNieuwe toptijd: Als je goed bent en erin slaagt een nieuwe top 1, top 2 of top 3 te halen, verdien je extra GC!\nZelfs als je niet hebt gewonnen of niet bent of de race niet hebt afgemaakt, verdien je GreenCoins op basis van je resultaten, dus geef niet op!\n\n\n"
      ],
      "More info in the Network section or use this link: http://forums.mrgreengaming.com/topic/2183-the-grand-guide-to-green-coins/":[
         "Meer informatie in de sectie Netwerk of gebruik deze link: http://forums.mrgreengaming.com/topic/2183-the-grand-guide-to-green-coins/"
      ],
      "Register / Login":[
         "Registreren / Inloggen"
      ],
      "1. Register an account on our Forums ( https://mrgreengaming.com/forums )\n\n\n2. Log in using your Forums account:":[
         "1. Registreer een account op onze forum ( https://mrgreengaming.com/forums )\n\n\n2. Log in met jou forum account:"
      ],
      "Username or email:":[
         "Gebruikersnaam of email:"
      ],
      "Password:":[
         "Wachtwoord:"
      ],
      "Bike trials":[
         "Motorfiets proeven"
      ],
      "Faster respawn for 60 days":[
         "Snellere respawn voor 60 dagen"
      ],
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
```

*/project/component/all*

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
