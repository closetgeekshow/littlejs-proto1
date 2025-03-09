import{p as e}from"./phaser-CwoquCe3.js";!function(){const e=document.createElement("link").relList;if(!(e&&e.supports&&e.supports("modulepreload"))){for(const e of document.querySelectorAll('link[rel="modulepreload"]'))t(e);new MutationObserver((e=>{for(const i of e)if("childList"===i.type)for(const e of i.addedNodes)"LINK"===e.tagName&&"modulepreload"===e.rel&&t(e)})).observe(document,{childList:!0,subtree:!0})}function t(e){if(e.ep)return;e.ep=!0;const t=function(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),"use-credentials"===e.crossOrigin?t.credentials="include":"anonymous"===e.crossOrigin?t.credentials="omit":t.credentials="same-origin",t}(e);fetch(e.href,t)}}();class t extends e.Scene{constructor(){super("Boot")}preload(){this.load.image("background","assets/bg.png")}create(){this.scene.start("Preloader"),this.scale.on("orientationchange",(e=>{e===Phaser.Scale.PORTRAIT||this.add.text(this.scale.width/2,this.scale.height/2,"Please rotate your device to portrait mode",{fontSize:"24px",fill:"#fff"}).setOrigin(.5)}))}}const i={core:{type:Phaser.AUTO,parent:"game-container",backgroundColor:"#028af8"},scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH,width:900,height:1600,min:{width:270,height:480},max:{width:1800,height:3200},orientation:Phaser.Scale.PORTRAIT},physics:{default:"arcade",arcade:{gravity:{y:0},debug:!1}},mechanics:{damage:{enemyToPlayer:1,playerToEnemy:1},knockback:{force:150},timers:{deathDelay:1e3}},camera:{shake:{duration:100,intensity:.01},flash:{duration:500,color:{r:255,g:0,b:0}}},fx:{hitFlash:{duration:100,color:16777215}},targeting:{defaultRange:800,preferClosest:!0},player:{startX:450,startY:800,size:90,innerSize:72,maxSpeed:500,accelFactor:10,health:3,invulnerability:{duration:1e3,blinkDuration:100,blinkCount:10},colors:{border:0,fill:255}},weapon:{fireRate:250,bulletSpeed:400,bulletSize:20,damage:1,range:500,color:16711680},joystick:{x:450,y:1400,radius:140,baseRadius:140,thumbRadius:70,baseColor:8947848,thumbColor:13421772,forceMin:20},ui:{timeScaleText:{x:460,y:20,style:{fontFamily:"Arial",fontSize:"3rem",color:"#000000"}},healthDisplay:{x:20,y:20,size:20,spacing:30,colors:{active:16711680,inactive:5592405}}},backgroundColor:"#F8FAFC"};class s{constructor(e){this.scene=e,this.cursors=e.input.keyboard.createCursorKeys(),this.wasd=e.input.keyboard.addKeys({w:"W",a:"A",s:"S",d:"D"});const{radius:t,baseRadius:s,thumbRadius:a,baseColor:r,thumbColor:n,forceMin:o}=i.joystick,l=e.add.circle(0,0,s,r,.5),h=e.add.circle(0,0,a,n,.8);l.setVisible(!1),h.setVisible(!1),this.joyStick=e.plugins.get("rexvirtualjoystickplugin").add(e,{radius:t,base:l,thumb:h,dir:"4way",forceMin:o,fixed:!1,enable:!1}),e.input.on("pointerdown",(e=>{this.joyStick.x=e.x,this.joyStick.y=e.y,l.setVisible(!0),h.setVisible(!0),this.joyStick.setEnable(!0)})),e.input.on("pointerup",(()=>{l.setVisible(!1),h.setVisible(!1),this.joyStick.setEnable(!1)})),e.input.on("gameout",this.handlePointerUp,this),e.input.on("mouseleave",this.handlePointerUp,this),e.input.on("pointerleave",this.handlePointerUp,this),window.addEventListener("mouseup",this.handlePointerUp.bind(this)),window.addEventListener("touchend",this.handlePointerUp.bind(this))}destroy(){window.removeEventListener("mouseup",this.handlePointerUp.bind(this)),window.removeEventListener("touchend",this.handlePointerUp.bind(this))}handlePointerUp(){this.joyStick&&(this.joyStick.base.setVisible(!1),this.joyStick.thumb.setVisible(!1),this.joyStick.setEnable(!1))}getMovementVector(){const e=i.player.maxSpeed;let t=0,s=0;if(this.joyStick&&this.joyStick.force>0)return{x:this.joyStick.forceX,y:this.joyStick.forceY};t=(this.wasd.d.isDown||this.cursors.right.isDown)-(this.wasd.a.isDown||this.cursors.left.isDown),s=(this.wasd.s.isDown||this.cursors.down.isDown)-(this.wasd.w.isDown||this.cursors.up.isDown);const a=Math.sqrt(t*t+s*s);return a>0&&(t/=a,s/=a),{x:t*e,y:s*e}}}class a extends Phaser.Physics.Arcade.Sprite{constructor(e,t,a){super(e,t,a,"playerSprite"),e.add.existing(this),e.physics.add.existing(this),this.playerInput=new s(e),this.setCollideWorldBounds(!0),this.setDamping(!0),this.setDrag(.9),this.health=i.player.health,this.maxHealth=i.player.health,this.invulnerable=!1,this.invulnerabilityTime=i.player.invulnerability.duration,this.createHealthDisplay(),this.bullets=null,this.lastFiredTime=0}createHealthDisplay(){const e=i.ui.healthDisplay;this.healthDisplay=[];for(let t=0;t<this.maxHealth;t++){const i=this.scene.add.rectangle(e.x+t*e.spacing,e.y,e.size,e.size,e.colors.active).setScrollFactor(0);this.healthDisplay.push(i)}this.updateHealthDisplay()}updateHealthDisplay(){const e=i.ui.healthDisplay;for(let t=0;t<this.healthDisplay.length;t++)this.healthDisplay[t].fillColor=t<this.health?e.colors.active:e.colors.inactive}takeDamage(e){this.invulnerable||(this.health=Math.max(0,this.health-e),this.updateHealthDisplay(),this.setInvulnerable(),this.scene.cameras.main.shake(i.camera.shake.duration,i.camera.shake.intensity),this.health<=0&&this.onDeath())}setInvulnerable(){this.invulnerable=!0,this.blinkEffect=this.scene.tweens.add({targets:this,alpha:.5,duration:i.player.invulnerability.blinkDuration,yoyo:!0,repeat:i.player.invulnerability.blinkCount}),this.scene.time.delayedCall(this.invulnerabilityTime,(()=>{this.invulnerable=!1,this.alpha=1}))}static createPlayerTexture(e){if(e.textures.exists("playerSprite"))return;const{size:t,innerSize:s,colors:a}=i.player,r=e.make.graphics();r.fillStyle(a.border),r.fillRect(0,0,t,t);const n=(t-s)/2;r.fillStyle(a.fill),r.fillRect(n,n,s,s),r.generateTexture("playerSprite",t,t)}update(e,t){const i=this.playerInput.getMovementVector();this.setVelocity(i.x,i.y),this.fireBullet(t)}onDeath(){const e=i.camera.flash;this.scene.cameras.main.flash(e.duration,e.color.r,e.color.g,e.color.b),this.setActive(!1),this.scene.time.delayedCall(i.mechanics.timers.deathDelay,(()=>{this.scene.scene.start("GameOver")}))}setWeaponSystem(e,t){this.targetingSystem=e,this.bullets=t}fireBullet(e){if(!this.targetingSystem||!this.bullets)return;if(e-this.lastFiredTime<i.weapon.fireRate)return;const t=this.targetingSystem.findNearestTarget(this.x,this.y);if(!t)return;const s=this.bullets.get();s&&(s.fire(this.x,this.y,t.x,t.y),this.lastFiredTime=e)}}class r{constructor(e){this.scene=e,this.timeScale=1;const{x:t,y:s,style:a}=i.ui.timeScaleText;this.timeScaleText=e.add.text(t,s,"Speed: 1x",a),this.timeScaleText.setDepth(1e3),this.setupControls()}setupControls(){this.scene.input.keyboard.on("keydown-ONE",(()=>this.setTimeScale(0))),this.scene.input.keyboard.on("keydown-TWO",(()=>this.setTimeScale(.5))),this.scene.input.keyboard.on("keydown-THREE",(()=>this.setTimeScale(1))),this.scene.input.keyboard.on("keydown-FOUR",(()=>this.setTimeScale(2)))}setTimeScale(e){this.timeScale=e,this.scene.time.timeScale=e,this.scene.physics.world.timeScale=0===e?1e-4:1/e;let t=0===e?"PAUSED":`${e}x`;this.timeScaleText.setText(`Speed: ${t}`)}getScaledDelta(e){return e*this.timeScale}}class n extends Phaser.Physics.Arcade.Sprite{constructor(e,t,s){super(e,t,s,"bulletSprite"),this.damage=i.weapon.damage,this.lifespan=0,this.maxLifespan=i.weapon.range/i.weapon.bulletSpeed*1e3}fire(e,t,s,a){this.setActive(!0),this.setVisible(!0),this.setPosition(e,t);const r=Phaser.Math.Angle.Between(e,t,s,a);this.scene.physics.velocityFromRotation(r,i.weapon.bulletSpeed,this.body.velocity),this.setRotation(r),this.lifespan=0}update(e,t){this.lifespan+=t,this.lifespan>=this.maxLifespan&&(this.setActive(!1),this.setVisible(!1))}}class o{constructor(e,t={}){this.scene=e,this.targetType=t.targetType||"enemy",this.range=t.range||1/0,this.preferClosest=!1!==t.preferClosest,this.targetGroup=t.targetGroup||null}findNearestTarget(e,t){return this.targetGroup&&this.targetGroup.getChildren().length>0?this.findNearestRealTarget(e,t):this.generateSimulatedTarget(e,t)}findNearestRealTarget(e,t){let i=null,s=1/0;return this.targetGroup.getChildren().forEach((a=>{if(a.active){const r=Phaser.Math.Distance.Between(e,t,a.x,a.y);r<=this.range&&r<s&&(s=r,i=a)}})),i}generateSimulatedTarget(e,t){const i=Phaser.Math.FloatBetween(0,360),s=this.range;return{x:e+s*Math.cos(Phaser.Math.DegToRad(i)),y:t+s*Math.sin(Phaser.Math.DegToRad(i))}}}class l extends e.Scene{constructor(){super("Game")}preload(){this.load.plugin("rexvirtualjoystickplugin","https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexvirtualjoystickplugin.min.js",!0)}create(){this.cameras.main.setBackgroundColor(i.backgroundColor),this.inputController=new s(this),this.timeScaleManager=new r(this),this.player=new a(this,i.player.startX,i.player.startY),this.input.keyboard.on("keydown-P",(()=>{this.scene.pause(),this.scene.launch("Pause")})),this.bullets=this.physics.add.group({classType:n,maxSize:30,runChildUpdate:!0}),this.playerTargeting=new o(this,{targetType:"enemy",range:1.5*i.weapon.range}),this.player.setWeaponSystem(this.playerTargeting,this.bullets),this.lastFiredTime=0}handlePlayerEnemyCollision(e,t){if(e.takeDamage(i.mechanics.damage.enemyToPlayer)){const s=Phaser.Math.Angle.Between(t.x,t.y,e.x,e.y),a=i.mechanics.knockback.force;e.body.velocity.x=Math.cos(s)*a,e.body.velocity.y=Math.sin(s)*a}}update(e,t){const i=this.timeScaleManager.getScaledDelta(t)/1e3;this.player&&this.player.active&&this.player.update(i,e)}getNearestEnemy(){let e,t;switch(Phaser.Math.Between(0,3)){case 0:e=Phaser.Math.Between(0,this.game.config.width),t=-50;break;case 1:e=this.game.config.width+50,t=Phaser.Math.Between(0,this.game.config.height);break;case 2:e=Phaser.Math.Between(0,this.game.config.width),t=this.game.config.height+50;break;case 3:e=-50,t=Phaser.Math.Between(0,this.game.config.height)}return{x:e,y:t}}handleBulletEnemyCollision(e,t){e.setActive(!1),e.setVisible(!1)}}class h extends e.Scene{constructor(){super("GameOver")}create(){this.cameras.main.setBackgroundColor(16711680),this.add.text(this.scale.width/2,this.scale.height/3,"Game Over",{fontFamily:"Arial Black",fontSize:64,color:"#ffffff",stroke:"#000000",strokeThickness:8,align:"center"}).setOrigin(.5),this.add.text(this.scale.width/2,this.scale.height/2+100,"Play Again",{fontFamily:"Arial",fontSize:36,color:"#ffffff",backgroundColor:"#000000",padding:{left:20,right:20,top:10,bottom:10}}).setOrigin(.5).setInteractive().on("pointerdown",(()=>{this.scene.start("Game")})),this.add.text(this.scale.width/2,this.scale.height/2+200,"Main Menu",{fontFamily:"Arial",fontSize:36,color:"#ffffff",backgroundColor:"#000000",padding:{left:20,right:20,top:10,bottom:10}}).setOrigin(.5).setInteractive().on("pointerdown",(()=>{this.scene.start("MainMenu")}))}}class c extends e.Scene{constructor(){super("MainMenu")}create(){this.add.image(512,384,"background"),this.add.image(512,300,"logo"),this.add.text(512,460,"Main Menu",{fontFamily:"Arial Black",fontSize:38,color:"#ffffff",stroke:"#000000",strokeThickness:8,align:"center"}).setOrigin(.5),this.input.once("pointerdown",(()=>{this.scene.start("Game")}))}}class d{static generateAllTextures(e){this.createPlayerTexture(e),this.createBulletTexture(e)}static createPlayerTexture(e){if(e.textures.exists("playerSprite"))return;const{size:t,innerSize:s,colors:a}=i.player,r=e.make.graphics();r.fillStyle(a.border),r.fillRect(0,0,t,t);const n=(t-s)/2;r.fillStyle(a.fill),r.fillRect(n,n,s,s),r.generateTexture("playerSprite",t,t),r.clear()}static createBulletTexture(e){if(e.textures.exists("bulletSprite"))return;const t=e.make.graphics();t.fillStyle(i.weapon.color),t.fillRect(0,0,i.weapon.bulletSize,i.weapon.bulletSize/2),t.generateTexture("bulletSprite",i.weapon.bulletSize,i.weapon.bulletSize/2),t.clear()}}class u extends e.Scene{constructor(){super("Preloader")}init(){this.add.image(512,384,"background"),this.add.rectangle(512,384,468,32).setStrokeStyle(1,16777215);const e=this.add.rectangle(282,384,4,28,16777215);this.load.on("progress",(t=>{e.width=4+460*t}))}preload(){this.load.setPath("assets"),this.load.image("logo","logo.png"),d.generateAllTextures(this)}create(){this.scene.start("MainMenu")}}class p extends e.Scene{constructor(){super("Pause")}create(){this.add.rectangle(450,800,900,1600,0,.7),this.add.text(450,700,"PAUSED",{fontFamily:"Arial Black",fontSize:64,color:"#ffffff",align:"center"}).setOrigin(.5),this.add.text(450,850,"Resume",{fontFamily:"Arial",fontSize:36,color:"#ffffff",align:"center"}).setOrigin(.5).setInteractive().on("pointerdown",(()=>{this.scene.resume("Game"),this.scene.stop()})),this.add.text(450,920,"Restart",{fontFamily:"Arial",fontSize:36,color:"#ffffff",align:"center"}).setOrigin(.5).setInteractive().on("pointerdown",(()=>{this.scene.stop("Pause"),this.scene.stop("Game"),this.scene.start("Game")})),this.add.text(450,990,"Main Menu",{fontFamily:"Arial",fontSize:36,color:"#ffffff",align:"center"}).setOrigin(.5).setInteractive().on("pointerdown",(()=>{this.scene.stop("Game"),this.scene.start("MainMenu")})),this.input.keyboard.on("keydown-P",(()=>{this.scene.resume("Game"),this.scene.stop()}))}}const y={type:i.core.type,parent:i.core.parent,backgroundColor:i.core.backgroundColor,scale:i.scale,physics:i.physics,scene:[t,u,c,l,h,p]};new Phaser.Game(y);
