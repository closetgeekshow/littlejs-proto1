# BULLET HELL SHMUP DESIGN 101

A glossary to get you started :
https://shmups.wiki/library/Help:Glossary
This doc covers the fundamental aspects of designing a bullet hell (danmaku)
shmup. This is heavily skewed towards CAVE’s style of games, but a lot of the
things discussed here can be carried over to other styles.
Knowing these fundamentals is important even if you’re going to break every
rule in the book, because it helps you make informed choices instead of taking
shots in the dark.
I’ll include examples when appropriate but for practical purposes, I will avoid
too many counterexamples, edge cases and other complications. The goal is to
give a good idea of how to make a typical CAVE-style shmup. If you want to
branch out past that & make something different you’re on your own!
And don't forget, first hand experience is everything! Play shmups a lot, you
don't have to get 1cc's or good scores but getting to a point where you can watch
a good replay of your favourite game and understand what the players are doing
is a must. Game design requires good intuitions for what feels right, and the best
way to build that intuition is through experience.


- MOVEMENT & SPACE
   - The Play Area
   - Movement
   - Normal/Focus Shot
   - Hitbox and visibility
- SHOOTING
   - General
   - Polish Effects & Small Mechanics
   - Shot Limit
   - Power Ups
- LIVES, BOMBS AND RECOVERY
   - General
- BULLET PATTERNS
   - Bullet Visibility
   - Pattern Types
   - Lanes
- ENEMIES
   - Enemy Roles
   - Dynamic Design
   - Polish Effects & Minor Mechanics
- LEVEL DESIGN
   - Player Behaviours
   - The Toaplan Pattern
   - Layered Design
   - Pacing, Variety and Extra Touches
- SCORING SYSTEMS
   - Constructing a Scoring System
   - Incentives & Tangibility
   - Linear vs Exponential Scoring
   - Aggressive vs Defensive
   - Depth vs Clarity


## MOVEMENT & SPACE

### The Play Area

**This is where all the action happens**. The play area can either be contained
by the screen, or it can be wider thanks to horizontal panning seen in many
vertical shmups. The size of the play area is **relative to the size of the game’s
objects and hitboxes**.
The tiny hitboxes of Danmaku games make for relatively large play areas
which allows them to fill the screen with bullets. This has downsides however -
large play areas funnel games into relying on lots of projectiles for challenge. **It
makes it much harder to rely on simple patterns.**
_The same kind of challenge with different hitboxes, the Danmaku style example has
more than twice the bullets._
A game's movement speed and shot type has to be tuned to match the size of
the play area, narrow areas can afford to (and can benefit from) slower move
speeds and narrow shot types to emphasise small differences in positioning and
give enemies time to do their thing _(examples : Gunbird 2, Dragon Blaze)_. Wider
play areas tend to use faster speeds, wider shots or some kind of multi
directional weapons to compensate for the large distances the player has to
travel _(examples : Mars Matrix, Under Defeat HD)_.


### Movement

The most fundamental source of challenge in danmaku games is **identifying** ,
**predicting** and **manipulating** different bullet trajectories and making precise
movements to dodge bullets and control screen space. Because of this, giving
the player as much control, consistency and awareness as you can is the top
priority, **the movement should feel seamless**.
For consistency’s sake, it’s best to avoid different directional movement
speeds, such as the ship moving faster on the x axis than the y axis, or faster
diagonal movement. **Don’t forget to normalise your diagonal movement!** _There
are some great games with faster diagonal movement like Battle Garegga and
Armed Police Batrider, but they are rare._
**Movement inertia** should be **avoided entirely** because it adds an
unnecessary layer of lag to the movement that players have to adjust to, without
adding any interesting gameplay dynamics. Even the smallest amount of
acceleration will be noticeable to experienced players.
If your movement doesn’t “feel smooth”, then it’s most likely the result of
lacklustre visuals rather than a lack of inertia. **Some tricks that can make
movement feel smoother** - beef up your shot/rate, add an afterimage (see
Symphony of the Night/Megaman ZX), match your ship’s banking animation
speed to movement speed, have the ship leave trails (see Danmaku Unlimited 3),
give your ship’s options (floating bits near your ship) some inertia.

### Normal/Focus Shot

Danmaku games often feature a focus shot mechanic, which was popularised
by CAVE. The player’s ship has 2 states with their own speed, a fast wide shot
mode (tapping the button), and a slower focus shot mode (holding down the
button) usually represented by a laser or another kind of concentrated shot.


This is useful because it gives the player more control and **creates some basic
but rewarding gameplay dynamics** - the players have to think whether they
need to use fast movement to quickly get into position, use slow movement to
make dodging more precise, or accept slow movement for the sake of additional
damage-per-second.
The transition between normal & focused speed is usually _(but not always, see
Touhou)_ interpolated to create a smoother, more gradual transition. The speed
difference between the normal and focus shot itself varies depending on game &
ship _(focus being ⅔ of the original speed is a good middle ground)_.
The gameplay effects of different speeds are highly varied, the usual
archetypes you have are fast, powerful ships with narrow shots, or slower
weaker ships with wide shots.

### Hitbox and visibility

During gameplay, **players won’t have the time to look at their ships** , instead
focusing on enemies, their patterns and places they are moving to. They will
roughly estimate the ship’s position based on the stream of bullets they shoot
out, the general silhouette of the ship & additional visual elements (like HUD
elements, flashing colours) near the ship. As a result, giving players thick, fast,
noticeable bullet streams can not only enhance your game’s feel, but also the
visibility. Perfectly centering the hitbox is also important because it keeps things
consistent.


## SHOOTING

### General

Shmups are all about shooting. Above all it’s important to make the act of
shooting feel satisfying. Achieving a decent game feel isn’t too difficult, but there
are a lot of little things to take into consideration.
A general bit of advice - **when you’re making a game’s objects move, you
become the game’s animator**. The only difference is that you animate things
through code rather than by redrawing frames or moving things around. **As a
result, studying fundamentals of animation & practising will pay off
immensely**.
On the mechanical side, the key principle for achieving a good game feel is to
**skew things in the player’s favour in subtle ways**. Give the player a hand &
compensate for their small positioning/timing mistakes, while focusing on
punishing big ones.

### Polish Effects & Small Mechanics

The first thing you want is **speed**.
● Speed is good for **conveying force** and making **impact feel stronger**. A fast
bullet is a powerful bullet, especially if you combine it with an appropriate bullet
splash effect.
● Speed helps create **immediate feedback** which is important for **enhancing**
the player’s **sense of agency**. When the player presses a button they expect
results.
● Speed helps the player **keep track of the ship’s position**. The faster you
can update the bullet stream to reflect the player’s current position, the better
they can estimate it.


In animation, a good way to convey the feeling of speed is by using motion
blur (smears, trails). **Length will create the illusion of motion and make bullets
feel even faster**. This can be taken to ridiculous extremes and still look good.
The opposite will likely read poorly - short sprites will clash with fast travel
speed and create a disconnect. As a general rule of thumb, you should always
consider the projectiles’ travel speed when deciding the length of its sprite.
_An extreme example - which one looks like it’s travelling quickly?_
The next element you want is density. Make big, fat projectiles, huge messy
streams, cluster bullets together and don’t concern yourself with making things
too neat and organised. All of this makes the player ship feel like a force to be
reckoned with. **Players want to feel powerful** , they want to feel like they’re
wiping out everything in their path and overwhelming the enemies, even as the
game is kicking their ass. Dense bullet streams create this illusion.
_CAVE’s shots are rarely too “pretty” or organised, but they work. Chaos feels good!_
Dense patterns help the players estimate their position, smoothen out
imperfections and let the player’s mind imagine more interesting bullet streams
than what’s actually on the screen.


Giving the player’s shots huge hitboxes, and giving enemies huge hurtboxes
makes the game feel better by **compensating for the player’s minor
positioning/aiming mistakes**. The player’s shots shouldn’t have massive gaps or
dead zones, and their emitters should be low.
_Make sure that players can hit enemies while sitting on top of them so they don’t
run into frustrating moments where they have to do micro-adjustments in the heat of
the moment._

### Shot Limit

The on screen shot limit is when games only allows a limited amount of
player projectiles to be on the screen at once, it refuses to create new ones until
the old ones exit the screen, hit an enemy or are otherwise destroyed.
_The shot limit is most obvious in early shmups such as Galaga (which only allows 2
shots on screen) but it exists in almost every other arcade shmup as well._
Born out of hardware limitations, the mechanic has become a staple of the
genre because it perfectly meshes with the player’s movement and creates some


very fun natural gameplay dynamics. **The closer the player is to an enemy, the
faster their shot rate (and DPS) will be.**
The prominence of the shot rate is different in every game. Games/ships with
high fire rates and low on screen shot counts encourage a very aggressive
in-your-face kind of playstyle while the opposite creates more dodging oriented
games.
_A classic example of players using proximity to quickly kill the stage 1 mid boss in
Raiden 2._
It should be noted that in addition to this, some games have other forms of
proximity damage, such as Dodonpachi’s ship aura, which surrounds the ship
and does tick damage. **Other unique ways of creating proximity damage are
worth experimenting with.**

### Power Ups

Power ups are all about **trickery and illusion**. Increasing the damage in a
straightforward manner will most likely lead to balancing issues. The player's
level 10 shot cannot be 10 times more powerful than their default shot without
something breaking.


Shmups get around this problem by simply **lying** to the player about their
power level, increasing damage by a very small amount (for example x1.1). This
practice is normal and is seen in most shmups from Toaplan to CAVE.
Numbers aside there are other ways to make shots feel more powerful.
Increase projectile width and height, increase their speed, make them look more
saturated, add details to the shots, make damage sounds more powerful. You can
even decrease the damage values but add additional projectile emitters, like
Gradius-style trailing options. Anything that makes the shot more satisfying
without causing balance issues or making the lower levels feel terrible is fair
game.

## LIVES, BOMBS AND RECOVERY

### General

Shmups tend to be pretty strict with how they handle lives - in CAVE games
you tend to get a starting stock, a couple of extends and a 1-UP item. This strict
approach has its benefits as **it forces the game design to be very tight** since any
mistake will be severely punished. The games are, with some exceptions (true
last bosses) designed to **let you avoid every single bit of damage** with some
practice.
Shmups with robust, large health bars tend to lack this **rigorous** design,
which is why health bars are a bit of a taboo. That does not mean that they’re
bad, however - multiple CAVE games like Guwange, Deathsmiles and Akai Katana
use them quite well.
Because each mistake is very costly, the games give you a breather if you do
die. After each death, all enemy bullets are cancelled to clear up the screen. After
a short while, this cancelling stops but the player is still given a couple-few


seconds of invincibility to kill some enemies & reposition themselves. Not
destroying bullets helps with the repositioning process since players will know
what to expect. **Generous invincibility is important to prevent chain-deaths.**
Bombs are a multi-purpose resource, they can be used defensively (called
panic bombing) and offensively to safely & quickly kill bosses. It’s beneficial to
add a small buffer so that if the player bombs within a couple or a few frames of
their death, they can nullify their death. **Dying on the frame you bombed always
feels frustrating.**

## BULLET PATTERNS

### Bullet Visibility

The overlapping projectiles and patterns, enemy waves, various particle
effects and items make for very chaotic and busy screens. Yet despite this
density of objects and information, danmaku games must have **exceptionally
good visibility** to guarantee a fair, non-frustrating player experience.
The world of art provides a very helpful concept when dealing with visibility -
**VALUE**. Value refers to the lightness/darkness of any given colour, it takes
hue/saturation/brightness into consideration, as each part of the hue is unique.
It can be grouped into 3 general categories - highlights, midtones and shadows.


_The best way to isolate value is to run an image through a black & white filter._
While looking at the values of different bullet sprites, you may notice a
pattern - **they put light & dark values side-by-side**. The bullets often have very
bright elements (the glowing cores) right next to dark elements (borders,
sometimes inner circles/lines). This is how you maximise visibility by using
values.
Low contrast backgrounds that rely primarily on midtones also help with
visibility since **they let you freely use extreme values for important elements**.
_Colour is important too - there are good reasons why so many danmaku games
settled on reds, pinks and purples - they are less likely to clash with commonly used
colours, unlike traditional yellow and orange bullets which tend to overlap with
explosions & golden items._
Chunking patterns is vital for visibility. **Players try to predict bullet
trajectories and move accordingly, and chunking helps to telegraph this.** Try to
group bullets up into lines and other clear patterns, single stray bullets are hard


to read and can often feel unfair. Bullets with unusual, hard to predict
trajectories may need extra effects like trails to help players out.
_Some examples of how you can make trajectories clearer - group bullets, elongate
them, or give them trails._
Animation also helps bullets stand out. Looking at CAVE bullet sprites will
quickly reveal all kinds of wobble and ripple animation which catch the player's
eye and give each bullet a unique identity.
Last but not least you have depth sorting. Enemy bullets should always be
drawn on top of other game objects such as player sprites, projectiles, items and
explosions. Use bullet size and speed to inform their depth. Smaller, faster
bullets should be drawn over bigger, slower bullets. Single bullets or small
chunks should be drawn over bigger easier to read chunks.

### Pattern Types

When you break things down, danmaku games only have **3 simple types of
patterns** , they are as follows :
● **Aimed**. The trajectory of the pattern is based on the player's position on
screen. Good for pressure, allows conscious manipulation by the player.
Can be quite dynamic due to inconsistency in the player's inputs.
● **Static**. The bullet trajectories are predefined and do not change based on
the player's position. Good for creating obstacles. Static patterns give the
designer a lot of control, letting them flex and make beautiful and cool
patterns.


● **Random**. The bullet trajectory is randomised. Keeps things fresh. Has to
be used carefully because it can create unfair situations.
_A common pattern combining a static pattern (elongated bullets) and an aimed
pattern (chunks of thick round bullets). The aimed bullets force the player to move,
while the static pattern makes their movement more difficult. Games mix and match
these 3 simple pattern types to create layered, unique and fun challenges._
The **x/y coordinates** of the **emitters** can either be **preset and unchanging**
(which guarantees that the patterns are clean and consistent), or they can
**change based** on the **enemy's movements** (which allows you to create very
dynamic and unpredictable patterns by bending and distorting the patterns).

### Lanes

```
When designing dense patterns , thinking of them as a collection of "lanes"
that players can take is very helpful.
Think of each lane as a micro-challenge that players opt into. They can
either commit to one lane or move from one to another in real time.
Additionally, the lanes can change over time and force the player to adapt. Each
lane can have its own pros and cons - some might be safer but give you less
damage opportunities, some might be very risky but rewarding, some might give
```

```
you less space to move around, some more. Ideally, their properties will become
even more meaningful when you combine enemy types. Obvious safe spots that
let you quickly kill enemies can also be very rewarding.
Compare this to enemy attacks in other action games - you don't want there
to only be 1 way of dealing with them. Ideally, you want to give the player a
range of options , each with their own semi-unique pros and cons.
A common mistake - having patterns entirely block off huge chunks of the screen and forcing
players to stay outside and either wait them out or kill enemies from weird angles.
```
## ENEMIES

### Enemy Roles

Controlling screen space makes up the majority of shmup gameplay, which
means active manipulation of bullets and enemies by the player. Keeping this in
mind, you can identify some common enemy roles:
● **Pressure**. The shots of these enemies put constant pressure on the player
and force them to move around.


```
● Area denial. The shots of these enemies block off parts of the screen and
make movement more difficult.
● Direct challenge. These enemies are usually elites that challenge the
player directly with dense, difficult patterns.
Levels mix and match these enemy types to create interesting challenges.
```
### Dynamic Design

The player's engagement with enemies should be dynamic. You should never
let the player feel like their actions don’t matter. A good, dynamic enemy design
would be one which plays out very **differently based on how well the player’s
doing**. Killing enemies quickly should be hugely beneficial, and leaving them alive
should be rather dangerous. The last thing you want is enemies which are hard
to kill, but also not very dangerous if left alive.
_Ketsui excels in dynamic enemy design - playing aggressively lets you keep the
screen very clear while not keeping up with enemy spawns will let them quickly
overwhelm you. Tyrian 2000 is the opposite - it’s safer to outright ignore many
enemies than trying to kill them._


Think of enemy design in terms of roles given the player’s performance.
● **Optimal Kill/Intro**. What happens if the player kills the enemy
immediately. Do you want to make sure the enemy shoots at least a little
bit no matter what, or do you want to allow the player to instantly take
them out?
● **Average Kill**. The enemy’s normal, intended behaviour.
● **Slow Kill/Safety Net**. What happens if the player is slow in killing the
enemy. Do they linger on the screen and trap the player, or will you add
some safety nets and have them fly away? Perhaps they could change their
pattern to be less aggressive but still problematic.
An enemy’s **priority** has to be taken into consideration as well. Whether an
enemy is high or low priority is an emergent property that depends on too many
factors to break down into simple rules, but here are some things that tend to
work:
● **High HP**. Bulkier enemies tend to command attention because they block
player shots and can’t be easily cleared out whenever the player wants.
● **Dense patterns**. Patterns which are difficult to dodge and block off parts
of the screen will make enemies exceptionally dangerous especially when
there is a high amount of overlap.
● **Wide cone**. Enemies that have aimed shots that spread out over a wide
cone are a lot harder to control, and as such more dangerous.


● **High rate of fire**. This makes enemies particularly nasty and prone to
trapping the player, encouraging players to dispatch them ASAP.
Some **rules of thumb** :
● **Enemies** , especially popcorn enemies, should **not** have **much more HP**
than is needed to fulfil their function.
● Safely approaching enemies for a kill shouldn’t be disproportionately
dangerous, it should **never be** more beneficial to **ignore enemies** and let
them leave the screen than efficiently killing them.
_Having high HP enemies drift downwards can exacerbate this problem, because
being under them is inherently very dangerous._
● Enemies should have **big hitboxes** and **slower predictable movement**.
Dense and difficult bullet patterns make up most of the challenges in danmaku
games, so making enemies needlessly elusive and difficult to hit will likely cause
frustration for the player.


To keep **enemy health low** while guaranteeing they will **shoot at least
once** , it may be desirable to cheat and only make them **vulnerable after** that
**first initial shot**.

### Polish Effects & Minor Mechanics

```
A good enemy is fun to hit and kill. Some ways this can be achieved are:
● Hit indicators. Enemies should react to getting hit or else they will feel
like ethereal forces rather than objects that exist in the game’s world. This
can take the form of simple flashing, damage particles/effects or shaking.
● Subtle hit sound effects. The player needs to feel it when they’re doing
damage to enemies.
● Big, meaty explosions. Explosion sprites should be large, significantly
bigger than the enemy sprite. Different explosion sprites, patterns and
extra debris are always welcome.
Some minor mechanics which help make games feel more polished:
● Bullet sealing. This is an anti-frustration mechanic that makes it so that
weaker ground enemies don’t shoot if the player’s sitting on top of
them/is very close to them.
● Dead zone at the top of the screen. This is a small space near the very top
where enemies cannot be killed or damaged. This prevents the player
from killing off-screen enemies they can’t even see.
● Ceasefire zone. The invisible part of the screen that renders enemies
passive. This is primarily used for ground targets such as turrets and
tanks, which drift to the bottom of the screen if left alive.
```

## LEVEL DESIGN

Danmaku level design might seem very simple on the surface, however there
are many nuances to it that make it both difficult and interesting. At its core, it's
just like any other type of level design - the goal is to build challenges that
encourage the player to play the way you want them to, while leaving plenty of
room for experimentation.
**Flow** should be the core goal of Danmaku level design. Flow is a feeling the
players get when **experiencing an uninterrupted sequence of smooth
movement**. It is achieved by guiding the player towards the intended route with
the use of **soft incentives & clear telegraphing** and making the movement itself
interesting. The player’s movement should be frequent. It should be smooth, one
action should flow into the next; there needs to be a constant sense of **forward
momentum**. It should be varied, testing the player in different ways - quick
**sweeping zig zag motions** , precise tap-dodging, aggressive point blanking at the
top of the screen and defensive dodging at the bottom. And it should **take
advantage of the screen real estate** , clustering the action on one side of the
screen is wasteful and unexciting.


_Zig zagging patterns are better for creating a sense of flow because they don’t force
the player to pause. The same applies to tank formations, it’s important to avoid the
kinds of vertical stacks of tanks that force the player to move back & forth or stay in a
single area.
Avoid putting enemies too close to the borders of the play area, it can create some
nasty traps for the player.
Spawning two or more higher HP enemies at the exact same time creates confusion
in the player as they won’t know which to prioritise. Spawning them one-by-one with
slight delays in between creates an obvious route for players to take._

### Player Behaviours


Because danmaku games have full freedom of movement, it can be difficult to
guide the player through the levels. You must rely on **soft incentives** , which
requires a good understanding of how players move, what they **prioritise** and
what they **look at** when playing danmaku games.
Here are some common player behaviours which you should keep in mind:
● Players will naturally **stay closer** to the **centre** of the screen on the **Y axis**.
It gives them decent DPS and allows them to misdirect bullets more effectively
while giving enough time to react to oncoming bullets.
● They will get **close to high HP enemies** to do **extra damage** whenever
they get the opportunity. Usually when said enemy is preparing to shoot. Then
they'll tend to go back down to dodge the volley of shots.
● As long as **popcorns keep spawning in** , the players will naturally **move
side to side** as they keep streaming bullets.
● Dodging bullets at **awkward diagonal angles** or by mainly using up/down
movement in one side of the screen is **reserved for special occasions** or
last-resort scenarios, players will rarely do it unless they absolutely have to
because it's harder to read bullets travelling diagonally, it requires more
awkward inputs and it limits their offensive ability/dodging space.

### The Toaplan Pattern

The Toaplan pattern is a very common enemy spawn pattern seen in most
vertical shmups, but is used so frequently and so blatantly in Toaplan’s games
that I came to associate it with them.
To understand the pattern it’s best to view the screen as a bunch of **lanes**.
Their exact number isn’t too important but 5-7 tends to be the norm due to the
sizes of enemies.


_An image showing 5 lanes. The edges of the screen don’t have lanes to prevent
awkward traps._
The idea is to spawn each enemy on the **opposite side of the screen** from the
previous one to force the player to move & create a kind of **sense of rhythm**.
_Many configurations can work as long as they use lanes & create sufficient gaps
between enemies. Lower HP enemies can have smaller gaps in between them, while
higher HP enemies will require bigger ones._
The Toaplan pattern works best with **high priority enemies** because they let
you control the player’s movement and predict where they will be at any given
time. It serves as the **core “layer” of your level design** that everything else is
built around.


### Layered Design

**The Toaplan pattern** creates a **strong, reliable centre of gravity that pulls
the player** and makes them more predictable. To emphasise this and create a
sense of rhythm, **some amount of overlap is required**. Enemies must spawn in
relatively quick succession so that the player won’t be able to linger in one area
for long. This also gives the enemies some time to breathe.
Overlap turns a series of **disconnected enemy spawns** into a **cohesive level**
with its own sense of flow and interesting risk vs reward dynamics. The waves
will affect each other by throwing off the player's positioning and blocking parts
of the screen with projectiles, they **give the player's actions more meaning** as a
result. If the player kills a wave quickly they will be rewarded with a safer,
cleaner screen right before the next wave hits. If they fail then the wave overlap
will force them to try and recover from their mistake. It gives the players good
reasons to care about taking out all of those high HP enemies and popcorns as
efficiently as possible.
You can augment your core layer by throwing in a bunch of weak popcorn
enemies. Their most basic use is serving as little obstacles clustered on the path
to the player's destination, which will most likely be enemies from the **primary
layer**. These enemies will give the player extra things to do and worry about. The
more the waves overlap the more **chaotic** the game can become as the shots of
popcorns will block off parts of the screen and change how you approach future
encounters and patterns.


```
Throwing in a bunch of popcorn around your core spawns can make things more
dynamic without disrupting flow.
```
### Pacing, Variety and Extra Touches

Despite how short and dense danmaku games are, there is still a lot of room
to make the pacing dynamic & memorable. Dynamism, smart repetition & variety
are important because they smoothen out the learning process, **making
otherwise unmemorable encounters stick in the player’s mind**.
Players like patterns and **controlled repetition**. Reusing the same enemy for
several encounters back-to-back can make a part of a level more memorable, as
long as there is sufficient variety in the encounters and how they challenge the
player, and they **don't overstay their welcome**.
Constant intensity, heavy layering/overlap and high levels of challenge will
blend together and **wear out the player**. Creating slight variations in the game's
intensity levels by tweaking and emphasising those aspects of level design to
different extents can help **make the intense parts stand out even more**.
You want some unique set pieces to punctuate levels and create **landmarks**
the player can use when they are learning the layout. Big mid boss like enemies,
**background events** and even unique props are very useful here.
Adding some **interaction** between the enemy layer and the background layer
helps make your level feel like an **actual physical space**. This can be achieved
with destructible scenery, hidden bonuses and various polish effects like ground
explosions leaving behind craters.

## SCORING SYSTEMS


Scoring systems are integral to shmups, the genre developed them more than
any other. There are so many tightly made robust systems that it often feels like
everything's been done already, and done well.
They add depth to games and make them more replayable by giving players
more meaningful elements to learn & clear constantly shifting goals. They create
dynamic difficulty by having players take on greater challenges as they get better
even in earlier levels. They make the games more engaging on a moment to
moment basis by giving players more to consider/think about/execute.
Scoring systems can add **a layer of resource management** to the games or
give existing resource management more meaning. They connect different
encounters into a cohesive whole and give players **long term goals** to work on
beyond survival. And they can work as a way to gauge the player's **skill growth**
over time.
_Ketsui’s enemy multiplier & Espgaluda’s gems are finite resources that players have to
manage and spend strategically (because different enemies/screens have different
scoring potential). Many games use such systems to create layers of resource
management._


_Battle Garegga and Armed Police Batrider have particularly robust economies
where in addition to bomb fragments & lives, the dynamic difficulty itself (rank)
functions like a resource that must be managed._
Shmups have a very simple core layer that's transferable between games,
scoring systems are what make the games truly come into their own.
Even if you, as a developer, have no interest in adding & fleshing out scoring
systems, **you must understand what they bring to the table** and figure out good
ways to recreate it by other means.

### Constructing a Scoring System

When **creating scoring systems** , it’s good to **think of them as sets of
conflicting goals & priorities**. This is what makes scoring systems dynamic &
deep and **forces players to make decisions and plan their routes**.
The most **basic example** of this conflict is between **scoring and survival** -
**players want to stay safe** to survive, but scoring **forces them** to go out of their
way & **do risky stuff** to reach secondary objectives.
These **conflicting goals** also exist **within** scoring systems too. If your scoring
is item-based it may be impossible to grab every single item the game can
generate, **forcing players** to decide what to **prioritise**. If your game uses **finite
resources** for scoring, then players have to figure out **where to optimally use
them**. The fact that **players can’t have everything** forces them to approach the
games more **thoughtfully**.
The principle is the same when creating any kind of game depth - create sets
of conflicting short term & long term goals with some overlap and force players
to figure out what to prioritise when.


### Incentives & Tangibility

Scoring on its own can be a rather **abstract** mini-game which is **detached**
from most in-game objects & natural player behaviours. As a result, scoring
systems can feel **arbitrary and meaningless** to players. To counter this, games
try to take advantage of **intuitive incentives** while making scoring elements
more **tangible & connected with the player's performance**.
**Incentives** are natural/intuitive when they are either backed by **very strong
audio-visual feedback** (making items tangible helps), when they take advantage
of behaviours players are conditioned to, or behaviours that naturally follow
from the rules of the game (such as killing enemies efficiently, or going fast in a
racing game). The more in line with the **feedback & rules** of the game your
incentives are, **the less arbitrary they will feel**. Going fast to increase your score
in a racing game will feel natural, going in circles at the starting line will not.
_Things like shiny coins and big numbers are ways to make scoring feel more
tangible by representing it by real in-game objects which players will “naturally” want
to grab._


_Even relatively more detached scoring systems like the one in Dodonpachi use a
“natural” desire to see big flashing numbers grow as an incentive for scoring.
Caravan-style games like Soldier Blade & Dangun Feveron take advantage of the
player’s desire to kill enemies quickly & efficiently by rewarding quick kills with more
score._
The ideal scoring system is one that players fall into from playing due to
incentives being perfectly lined up, one where players can gauge their
performance without looking at numbers, and one that’s deep & challenging.

### Linear vs Exponential Scoring

**Linear vs Exponential** refers to two types of scoring system, they should be
viewed more as metaphors rather than taken literally.
**Linear scoring systems** are straightforward - you kill an enemy/pick up a
scoring item, you get a set number of points. Typically these scoring systems
have **little to no punishment** for missing an individual enemy/scoring item.


Once things like **multipliers** , **big cash out moments & end stage bonuses** are
introduced, the scoring gain becomes **exponential**. **Exponential scoring
systems** typically come with **harsher punishments** for failure. Your chains might
break & your bonuses will reset/disappear.
**Linear systems**
● **Reflect the player’s skill** more holistically. They don’t disproportionately
punish mistakes during specific sections, or make longer stages/specific
parts disproportionately lucrative.
● **Minimise frustration**. Linear systems let you recover from mistakes with
exceptional performance.
**Exponential systems**
● Provide **high risk, high reward**. This can be very exciting and gives the
games a strong “one more try” quality.
● Offer **very clear feedback** when the player is doing well/poorly. Sudden
massive boosts of score are a good way to indicate that the player is doing
something right.
Both styles have their own pros & cons. **Games are rarely one or the other** ,
they usually limit the **exponential** elements (such as capping multipliers) to
create a more **linear curve** and add various small multipliers to further optimise
fairly linear scoring systems.

### Aggressive vs Defensive

**Defensive Scoring Systems
The game attacks you with its scoring**. Whenever you perform an action like
killing an enemy or picking up an item, the games give you some kind of bonus
and start a timer **forcing you to continue certain actions** in fear of losing said
bonus. **Being passive is massively punished.**


_Example: Dodonpachi_
**Aggressive Scoring Systems
You attack the game.** Extra score has to be actively earned by performing
certain actions. The game does not pressure you into continuing combos, **being
passive is simply not rewarded.**
_Example: Giga Wing_
Games exist on a **spectrum** between these two styles. Certain games like
**Guwange** have strong defensive & aggressive elements - your chain is timed, but
it also doesn’t increase much unless you aggressively earn coins.

### Depth vs Clarity

It may be tempting to go nuts with all kinds of multipliers, sub multipliers,
varied base values, several levels of resource management & more in order to
create a deep system that’ll keep players occupied for a long time.
This has **massive downsides** because as you’re increasing a game’s
mechanical **complexity** in an effort to maximise **depth** , you’re making your
system **hard to understand** and as a result preventing players from forming a
solid **game plan**. Focusing solely on adding depth without increased complexity
is a potential solution, but not a practically viable one.
To solve this problem, games create a **hierarchy of systems/goals** and limit
depth by creating more **clear discrete states**. To do this mechanically, scoring
needs to **invert its risk vs reward dynamics** - instead of riskier & more
complicated moves being more rewarding, they should be less rewarding. To do
this visually, you need to emphasise the more important scoring elements
visually while making the less important ones more subtle.
The idea is to give the player a simple, easy to understand game plan upfront
and then let them discover additional nuances and complications at their own
pace.



