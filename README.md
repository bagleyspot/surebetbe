# SureBetBe
## _V.0.0.1_

 [![Build Status]( https://travis-ci.com/sourheartita/surebetbe.svg?token=ZAMnLsdoeyAp5qxtny53&branch=main)](https://travis-ci.com/github/sourheartita/surebetbe)
 ![Docker Pulls](https://img.shields.io/docker/pulls/sourheart/surebet-app)
 ![Image Size](https://img.shields.io/docker/image-size/sourheart/surebet-app?sort=date)
 ![Version](https://img.shields.io/docker/v/sourheart/surebet-app?sort=date)
 ![Rating](https://img.shields.io/docker/stars/sourheart/surebet-app)
 ![Contributors](https://img.shields.io/github/contributors/sourheartita/surebetbe)
 ![Last Commit](https://img.shields.io/github/last-commit/sourheartita/surebetbe)
 ![Downloads](https://img.shields.io/github/downloads/sourheartita/surebetbe/total)
 ![Size](https://img.shields.io/github/languages/code-size/sourheartita/surebetbe)
 ## What is SureBetBe
 SureBetBe it's a BackEnd Application that analizing the bookmakers for different league of football and find the surebets
 When SureBetBet will find a surebet, it save in the db and can return the surebet in JSON with a REST EndPoint
 
 ## Technologies
 - NodeJs
 - MongoDB
 - TelegramBot
 - SportDataApi (for source of match and bookmakers)
 - Docker
 - Google App Engine
 ## First Step
 - Import the Project with github
 ```sh
gh repo clone sourheartita/surebetbe
```
 - Create file .env
 ```.env
PORTSERVER=8080
URL_DATABASE=<url database remote>
BASE_URL=https://app.sportdataapi.com
API_VERSION=/api/v1/
SEASON_ID=2024
API_KEY=<key api sport data api>
TOKEN_TELEGRAM=<key telegram bot>
```
 ## Guide
 TODO
