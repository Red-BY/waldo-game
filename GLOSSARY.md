# Waldo Game

A timed hide-and-seek picture game: players find hidden characters on a large illustrated image and compete on a public leaderboard for the fastest time.

## Language

**Board**:
One illustrated image that players search, together with the characters hidden in it.
_Avoid_: Level, map, game (for the image itself)

**Character Location**:
The rectangular area on a Board where one named character is hidden.
_Avoid_: Hitbox, target, coordinates

**Game**:
One timed attempt by a player to find every character on a Board, measured by the server from start to completion.
_Avoid_: Round, run, session

**Score**:
The elapsed time of one completed Game on a Board, as measured by the server; lower is better. At most one Score can be submitted per completed Game.
_Avoid_: Time, result, points

**Player Name**:
The short public name a player attaches to a Score; it must pass the name rules (length and profanity) before it appears on a Leaderboard.
_Avoid_: Username, nickname, handle

**Leaderboard**:
The public ranking of one Board's submitted Scores, fastest first.
_Avoid_: High scores, rankings
