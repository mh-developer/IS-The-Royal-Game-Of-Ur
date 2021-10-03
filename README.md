# The Royal Game Of Ur

## Main idea

Idea is to create very old arcade game with name "The Royal Game Of Ur". The estimated age of the game is at least 4500 years. Despite his age, scientists were able to find the rules of the game written on cuneiform. So we recreated this game and also add four different autonomous players.

## System architecture

In this experiment I used following technologies:
- React.js (with Redux)

## Autonomous players

We have four different autonomous players which all are based on probability.

- Aggressive player - Performs moves with the highest probability of takeover
- Defenzive player - Performs the safest moves
- Pacifist player - Performs moves without taking the opposite figure (if possible)
- Random player - Performs a random possible move

## Installation and running

So you need first to clone this repo.

You can locally run app with the following commands:

1. `npm install`
2. `npm start`

Then you can open app in your browser on `http://localhost:3000/`.


You can also tried this game on the next link:

- https://mh-developer.github.io/IS-The-Royal-Game-Of-Ur/
