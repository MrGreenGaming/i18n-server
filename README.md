# Mr. Green Gaming i18n API
Serves JSON translation files from https://github.com/MrGreenGaming/i18n


# Paths
## GET /:project/
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
          "file": "translation-en.json"
        },
        {
          "name": "nl",
          "file": "translation-nl.json"
        }
      ]
    }
  ]
}
```

## GET /:project/:component
**Get component information**
*Example response:*
```json
{
  "name": "TestComponent",
  "languages": [
    {
      "name": "en",
      "file": "translation-en.json"
    },
    {
      "name": "nl",
      "file": "translation-nl.json"
    }
  ]
}
```

## GET /:project/:component/translations
**Get all translations of the component**
*Example response:*
```json
{
  "en": {
    "teamname": "Not the name of the team.",
    "empty": "Empty! No entries added yet.",
    "ok": "Ok.",
    "amountleft": "You have %s GreenCoins left",
    "welcomeback": "Welcome, %s",
    "hello": "Hello and welcome to the Grand Guide to GreenCoins!\n\n",
    "how1": "WTF are Green-Coins?",
    "how2": "They are a currency used by the Mr. Green community. We created a global database where players can connect their Green-Coins to one account, and use them on different game servers.\n\n",
    "how3": "What can I do with Green-Coins in MTA?\n",
    "how4": "You can buy car mods, skins, or other fancy stuff that you can use ingame!\n\n",
    "how5": "What do I need to get Green-Coins?\n",
    "how6": "You need to register a Green-Coins account, go to the \"Register\" tab for more info.\n\n",
    "how7": "How do I get Green-Coins?",
    "how8": "You can donate. For each euro donated you get 1000 GreenCoins.\n",
    "how9": "How do I donate?\n",
    "how10": "Go to mrgreengaming.com and click\"Green-Coins\".\n\nIf you log into your account, you see a conveniently placed button that says \"Send donation\".\n\nJust follow the simple instructions on there and you're done!\n"
  },
  "nl": {
    "how10": "Ga naar mrgreengaming.com en klik op \"Green-Coins\".\n\nAls je ingelogd bent, zie je een handige knop met de tekst \"Send Donation\".\n\nVolg de eenvoudige instructies en je bent klaar!\n",
    "how9": "Hoe kan ik doneren?\n",
    "how8": "Je kan doneren. Voor elke euro krijg je 1000 GreenCoins\n",
    "how7": "Hoe krijg ik Green-Coins?",
    "how6": "Je moet een Green-Coins account registreren, ga naar het \"Registreer\" tabblad voor meer informatie.\n\n",
    "how5": "Wat heb ik nodig om Green-Coins te gebruiken?\n",
    "how4": "Je kunt auto modificaties, skins of andere mooie dingen kopen die je in het spel kunt gebruiken!\n\n",
    "how3": "Wat kan je doen met Green-Coins in MTA?\n",
    "how2": "Het is een valuta die gebruikt wordt in de Mr. Green gemeenschap. Wij hebben een globale database waarbij spelers hun Green-Coins aan een account kunnen koppelen, en het op meerdere game servers kunnen gebruiken.\n\n",
    "how1": "WTF zijn Green-Coins?",
    "hello": "Hallo en welkom bij de Grote GreenCoins Gids!\n\n",
    "welcomeback": "Welkom terug, %s",
    "amountleft": "Je hebt nog %s GreenCoins over",
    "ok": "Ok.",
    "empty": "Leeg!. Nog geen items toegevoegd.",
    "teamname": "Naam van het team."
  }
}
```