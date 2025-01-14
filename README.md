# WhoMadeThis

## Game Overview

This is a turn-based game where players aim to defeat an AI opponent by correctly identifying whether presented images are real or AI-generated. Players strategically wager their in-game currency to maximise damage to the AI while minimising risks.

## How to launch

### Server

$ cd server/
$ npm install
$ mv .default_env .env
$ npm run dev
 
### Front

The game images are not committed to github, you will have to download them from another source.

$ cd front/
$ npm install
$ cp images front/src/assets
$ npm run dev


## Core Mechanics

a. Player and AI Stats

* Player:

* Starting Currency: 100 units (we can decide on a currency name later on)

* AI Opponent:

* HP: 100 HP

b. Turn Structure

1. Image Presentation:

* Display one image per turn to the player.

* Images are a mix of real and AI-generated content.

2. Player Decision:

* Action: Decide if the image is "Real" or "AI-Generated."

* Wager: Choose an amount of currency to bet on the correctness of the answer.

3. Outcome Determination:

* Correct Answer:

* AI HP Reduction: Damage = Wager × Damage Multiplier

* Points Awarded: Based on response speed.

* Currency: If the answer is correct, the player keeps all the currency.

* Wrong Answer:

* AI HP increased: AI gains HP, making it more difficult to win

* Currency Deduction: Player loses the wagered amount.

4. Speed Bonus:

* Faster responses yield additional points if the answer is correct.

5. Win Condition:

* Victory: Reduce AI HP to 0 before the player's currency depletes.

* Leaderboard Ranking: Fastest to defeat the AI in the fewest turns ranks higher.

c. Game Flow

1. Initialisation:

* Player starts with 100 currency.

* AI starts with 100 HP.

2. Gameplay Loop:

* Present image.

* Player makes a decision and wagers currency.

* Calculate and apply outcome.

* Update HP and currency.

* Check for win/loss conditions.

* Proceed to next turn or end game.

  
  

Currently, we can have a single-player mode (with an option to have it timed and a more relaxed option where players can take as much time as they want, and time is taken out of the equation).

In the future, we can add a multiplayer mode.

------

Architecture:
____________
|          | 
|  creat   | // server: post /games  
|          |
____________
    |
    |
    \/ LOOP HERE
    ______________
    |             | - need a new card 
    |  launchStep | - server: get /card/new/{partyName}
    |             |
    ______________
         |
         | 
         \/
    __________________
    |                | - vote your choice + hp number
    |  vote          | - multi votes if multi players
    |   still in     | - automate call when timer 0
    |   launchStep   |
    __________________
    |
    |
    \/  - /!\ need all players voted
    __________________
    |                | - show result of step
    |  result        | - server = /card/{partyName}&{cardName}
    |   still in     | 
    |   launchStep   | - if askNextGame = launch new Step if cond ok and loop
    __________________
    |
    |
    \/
______________
|             | when hp 0 or maxCards
|  end        | - party done, recapitalutif
|             | - send party to server
______________

