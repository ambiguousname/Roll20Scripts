# Roll20Scripts
I like to play pen &amp; paper RPGs, and I like to tinker with Roll20. This is just for me to post experimental scripts. Feel free to use 'em if you find them useful. If you need help with any of the scripts, just put up an issue in the issue tracker. Thanks.

### Patrol.js
A few commands:
- !pt <args1> <args2>
Creates a patrol. The patrol begins immediately.
Args 1: The name of token(s) to patrol. The name should have no spaces, and should be unique from tokens that aren't going to be patrolling. The tokens will all take the same path.
Args 2: The coordinate pairs. The coordinate pairs are represented as follows: x,y:x,y:x,y (etc.)
- !stoppt <args1>
Stops a patrol.
Args 1: The name of the token(s) to stop patrolling (should already have a patrol set).
- !startpt <args1>
Starts a patrol
Args 1: The name of the token(s) to start patrolling (should already have a patrol set).
- !clearpt <args1>
Clear a patrol
Args 1: The name of the token(s) to clear patrol behavior (should already have a patrol set).
- !initpt <args1> <args2>
Settings for patrol.js
Args1: Whether or not patrol.js should be based on turns. "true" for "yes, I want this to based on turns" and "false" for "I want this to be in real-time". (true by default)
Args2: If arg1 is false, then this sets the milisecond delay between moves for patrollers. (Default is 1000 miliseconds before moving).
