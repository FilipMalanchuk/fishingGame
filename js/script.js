let canvas = document.querySelector("canvas");
canvas.width = 1000;
canvas.height= 500;
let score = 0;// счет в игре
const ctx = canvas.getContext("2d");

let currentlyShooting = false; //флаг для прекращения движения прицела туда сюда

// параметры кривой
let curveLine = {
	"startX" : -100,
	"startY" : 150,
	"controlX1" : 280,
	"controlY1" : 110,
	"controlX2" : 700,
	"controlY2" : 260,
	"endX" : canvas.width + 100,
	"endY" : 150
}

// отрисовка лодки
let ship_image = new Image();
	ship_image.src = "images/boatPixelArtNoStringFishingRod.png";
	ship_image.onload = function() {
		ctx.drawImage(ship_image,100,100);
}
// параметры лодки
	let shipX = 50;
	let shipY = 70;
	let shipAllowerToMove = true;

// загрузка облака
	let cloud_image = new Image();
	cloud_image.src = "images/cloud3.png"
	cloud_image.onload = function() {
		ctx.drawImage(cloud_image,100,100);
}
// загрузка облака2
	let cloud_image2 = new Image();
	cloud_image2.src = "images/cloud_02.png"
	cloud_image2.onload = function() {
		ctx.drawImage(cloud_image,100,100);
}
// загрузка камня со звездой
	let rockWithStar = new Image();
	rockWithStar.src = "images/seastar_on_the_rock1.png"
// загрузка растения1
	let seaPlant1 = new Image();
	seaPlant1.src = "images/seaplant.png"
	// загрузка растения1
	let seaPlant2 = new Image();
	seaPlant2.src = "images/seaweed.png"

// загрузка рыбы1 
	let fishSprite1 = new Image();
	fishSprite1.src = "images/fish1SpriteSheet.png";
	let fish1X = -100;
	let fish1YHigh = 150;
	let fish1YLow = 270;

// отрисовка рыбы2
	let fishSprite2 = new Image();
	fishSprite2.src = "images/fish2Sprite.png";
	let fish2X = -100;
	let fish2YHigh = 150;
	let fish2YLow = 270;

// отрисовка краба
	let crabSprite = new Image();
	crabSprite.src = "images/crabSprite.png";
	let crabX = 1000;
	let crabYHigh = 0;
	let crabYLow = 450;

// переменные для спавна рыбы
let fishSpawnHighLimit = 200;
let fishSpawnLowLimit = 50;

let rand = Math.floor(Math.random()*fishSpawnHighLimit) + fishSpawnLowLimit;
let animationCounter = 0;
// анимация
function update () {
	animationCounter++
	//очистка канваса
	ctx.clearRect(0,0,canvas.width,canvas.height);


	// отрисовка неба
	drawSkyCurve(curveLine.startX,curveLine.startY,curveLine.controlX1,curveLine.controlY1,curveLine.controlX2,curveLine.controlY2,curveLine.endX,curveLine.endY);
	drawSand()

	// отрисовка облака
	ctx.drawImage(cloud_image,50,10);
	ctx.drawImage(cloud_image,500,-10);
	// отрисовка облака 2
	ctx.drawImage(cloud_image2,250,10);
	ctx.drawImage(cloud_image2,800,0);


	//отрисовка изображения лодки
	ctx.drawImage(ship_image,shipX,shipY);
	//движения лодки
	if (shipAllowerToMove){ // поменять потом--------------------------------------
		XshipMovement();
	}
	YshipMovement();


	// отрисовка моря
	drawSeaCurve(curveLine.startX,curveLine.startY,curveLine.controlX1,curveLine.controlY1,curveLine.controlX2,curveLine.controlY2,curveLine.endX,curveLine.endY, "#2a66c7");
	drawSeaCurve(curveLine.startX,curveLine.startY+ 30,curveLine.controlX1,curveLine.controlY1,curveLine.controlX2,curveLine.controlY2,curveLine.endX,curveLine.endY + 30, "#1c5fc9");
	drawSeaCurve(curveLine.startX,curveLine.startY+ 50,curveLine.controlX1,curveLine.controlY1,curveLine.controlX2,curveLine.controlY2,curveLine.endX,curveLine.endY + 70, "#034e99");

	changeNumbersCurve();
	drawSand();
	// отрисовка камня со звездой
	ctx.drawImage(rockWithStar,700,380);
	// отрисовка растения1
	ctx.drawImage(seaPlant1,50,375)
	// отрисовка растения1
	ctx.drawImage(seaPlant2,450,375)

	if (animationCounter > rand) {
		animationCounter = 0;
		let nextYfish

		let randomSpawn = Math.floor(Math.random() * 3) + 1;
		if (randomSpawn === 1){
			nextYfish = Math.floor(Math.random() * fish1YHigh)+fish1YLow,spawnFish(fish1X,nextYfish,"X",randomSpawn)
		}
		else if(randomSpawn === 2) {
			nextYfish = Math.floor(Math.random() * fish2YHigh)+fish2YLow,spawnFish(fish2X,nextYfish,"X",randomSpawn)
		}
		else if(randomSpawn === 3) {
			nextYfish = Math.floor(Math.random() * crabYHigh)+crabYLow,spawnFish(crabX,nextYfish,"-X",randomSpawn)
		}

		
	}

	Fishes1.forEach((obj) => {obj.draw(); addORDecrXToFishes(obj)});



	if(!currentlyShooting) {
		moveAim()
	} else {
		shoot();
	}
	printScore();

	// включает бесконечную анимацию
	requestAnimationFrame(update);
}



// отрисовка моря
function drawSeaCurve(startX,StartY,controlX1,controlY1,controlX2,controlY2,endX,endY,color) {
	ctx.beginPath();
	ctx.moveTo(startX,StartY);
	ctx.bezierCurveTo(controlX1,controlY1,controlX2,controlY2,endX,endY);
	ctx.lineTo(canvas.width,canvas.height);
	ctx.lineTo(0,canvas.height);
	ctx.fillStyle = color;
	ctx.fill()
}
// отрисовка неба
function drawSkyCurve(startX,StartY,controlX1,controlY1,controlX2,controlY2,endX,endY){
	ctx.beginPath();
	ctx.moveTo(startX,StartY);
	ctx.bezierCurveTo(controlX1,controlY1,controlX2,controlY2,endX,endY);
	ctx.lineTo(canvas.width,0);
	ctx.lineTo(0,0);
	ctx.fillStyle = "#87CEEB"
	ctx.fill()
}
// отрисовка песка
function drawSand(){
	ctx.fillStyle = "#e6eba4";
	ctx.fillRect(0,450,1000,100)
}



//------------меняем параметры кривой для анимации
let flagForCurve = true; // флаг для изменения направления
let counterForCurve = 0;
let curveStep = 2; // шаг прибавления/убавления
let limitForCounterCurve = 100;
let startXChange = false; // флаг для изменения начала кривой убавляем затем добавляем

function changeNumbersCurve() {
	// вправо
	if (flagForCurve) {
		curveLine.controlX1+=curveStep;
		curveLine.controlX2+=curveStep;

		counterForCurve++;
		if (counterForCurve > limitForCounterCurve) {
			flagForCurve = false;
			startXChange = true;
		}
	}
	// влево 
	else {
		curveLine.controlX1-=curveStep;
		curveLine.controlX2-=curveStep;
		counterForCurve--;
		if (counterForCurve <= (limitForCounterCurve * -1)) {
			flagForCurve = true;
		}
	}
}

// ------------параметры для движения корабля
// Движение по X
let xshipMovementLimit = 5;
let xShipCounter = 0;
let xShipFlag = true;
let xIntensity = 15;
let xIntensityCounter = 0;
function XshipMovement(){
	xIntensityCounter++;
	if(xIntensityCounter < xIntensity){
		return;
	}
	xIntensityCounter = 0;

	if (xShipFlag) {
		xShipCounter++;
		if(xShipCounter >= xshipMovementLimit) {
			xShipFlag = false;
		}
		shipX++;
	}
	else {
		xShipCounter--;
		if(xShipCounter <= 0) {
			xShipFlag = true;
		}
		shipX--;
	}
}

// движение по Y
let yshipMovementLimit = 5;
let yShipCounter = 0;
let yShipFlag = true;
let yIntensity = 25;
let yIntensityCounter = 0;
function YshipMovement(){
	yIntensityCounter++;
	if(yIntensityCounter < yIntensity){
		return;
	}
	yIntensityCounter = 0;

	if (yShipFlag) {
		yShipCounter++;
		if(yShipCounter >= yshipMovementLimit) {
			yShipFlag = false;
		}
		shipY++;
	}
	else {
		yShipCounter--;
		if(yShipCounter <= 0) {
			yShipFlag = true;
		}
		shipY--;
	}
}


// движение прицела

let aimFlagMoveRight = true;
let aimCounter = 0;
let aimLimit = 100;
let aimXstart = 453;
let aimYstart = 80;

	//движение прицела с крючком
function moveAim () {
	// добавить проверку на отрисовку




	ctx.beginPath()
	ctx.moveTo(aimXstart + xShipCounter,aimYstart + yShipCounter);
	ctx.strokeStyle = "gray";
	ctx.lineWidth = 3;
	// движение вправо
	if (aimFlagMoveRight){
		aimCounter++;
		if (aimCounter >= aimLimit){
			aimFlagMoveRight = false;
		}
	} 
	// движение влево
	else {
		aimCounter--;
		if (aimCounter <= (aimLimit * -1)){
			aimFlagMoveRight = true;
		}
	}

	// отрисовка конца прицела
	ctx.lineTo(aimXstart + xShipCounter + aimCounter,aimYstart + 100 + yShipCounter - Math.abs(aimCounter / 3));
	ctx.stroke();
	// отрисовка крючка
	ctx.beginPath();
	ctx.moveTo(aimXstart + xShipCounter + aimCounter,aimYstart + 100 + yShipCounter - Math.abs(aimCounter / 3));
	ctx.strokeStyle = "silver";
	ctx.lineWidth = 2;
	ctx.lineTo(aimXstart + xShipCounter + aimCounter,aimYstart + 100 + yShipCounter - Math.abs(aimCounter / 3) + 3);
	ctx.lineTo(aimXstart + xShipCounter + aimCounter - 6,aimYstart + 100 + yShipCounter - Math.abs(aimCounter / 3) + 3);
	ctx.lineTo(aimXstart + xShipCounter + aimCounter - 6,aimYstart + 100 + yShipCounter - Math.abs(aimCounter / 3)-2);
	ctx.stroke();

	ctx.lineWidth = 1;
}


// стрельба по событию
let shootingSpeed = 2;
let endingStartX = aimXstart + xShipCounter + aimCounter;
let endingStartY = aimYstart + 100 + yShipCounter - Math.abs(aimCounter / 3);
let shootingStepX = 0;
let shootingStepY = 0;
function shoot () {
	currentlyShooting = true;
	
	// отрисовка выстрела

	ctx.beginPath()
	ctx.moveTo(aimXstart + xShipCounter,aimYstart + yShipCounter);
	ctx.strokeStyle = "gray";
	ctx.lineWidth = 3;

	// отрисовка конца прицела

	ctx.lineTo(endingStartX,endingStartY);
	ctx.stroke();
	// отрисовка крючка
	ctx.beginPath();
	ctx.moveTo(endingStartX,endingStartY);
	ctx.strokeStyle = "silver";
	ctx.lineWidth = 2;
	ctx.lineTo(endingStartX,endingStartY + 3);
	ctx.lineTo(endingStartX - 6,endingStartY + 3);
	ctx.lineTo(endingStartX - 6,endingStartY-2);
	ctx.stroke();

	// определяют направление, значения меняються в событии нажание на пробел
	endingStartX+=shootingStepX;
	endingStartY+=shootingStepY;


	// проверка на промах
	if (endingStartX >= canvas.width || endingStartY >= canvas.height || endingStartX < 0) {
		currentlyShooting = false;
	}


	// Добавить проверку на попадание 
	Fishes1.forEach(obj => collisionDetection(endingStartX,endingStartY,obj.X,obj.Y,obj.usingWidth,obj.usingHeight,obj.ID));
}


//------------------------------------------------------------------------ОТСЮДА ВНИЗ МАКСИМАЛЬНО ПЕРЕДЕЛАТЬ TODO
class fish {
	constructor(options) {
		this.frameWidth = options.frameWidth;// ширина
		this.frameHeight = options.frameHeight//высота
		this.frames = options.frames;//количество фреймов в спрайте
		this.image = options.image;//переменная с изображением
		this.animationspeedCounter = 0;// счетчик для изменения фрейма спрайта
		this.animationspeed = 10;// скорость с которой меняеться фрейм(чем выше, тем медленее)
		this.counter = 0; // определяет конкретный фрейм
		this.X = options.X;
		this.Y = options.Y;
		this.add = options.add;
		this.usingWidth = options.usingWidth;
		this.usingHeight = options.usingHeight;
		this.ID = options.ID;
	}
	draw() {
		ctx.drawImage(this.image,this.frameWidth * this.counter,0,this.frameWidth,this.frameHeight,this.X,this.Y,this.usingWidth,this.usingHeight);
		this.animationspeedCounter++
		if(this.animationspeedCounter >= this.animationspeed){
			this.counter++
			this.animationspeedCounter = 0;
		}
		

		if(this.counter >= this.frames) {this.counter = 0}
	}
}



let Fishes1 = [];

function addORDecrXToFishes(obj){
	if( obj.add === "X"){
		obj.X+=3;
		if(obj.X > canvas.width) {
			Fishes1 = Fishes1.filter(el => el.ID !== obj.ID);
		}
	} else {
		obj.X-=3
		if(obj.X + obj.usingWidth < 0) {
			Fishes1 = Fishes1.filter(el => el.ID !== obj.ID);
		}
	}
}


let IDcounter = 0;
function spawnFish(X,Y,add,randomSpawn){
	IDcounter++
	let newFish = new fish({
		frameWidth : 256,
		frameHeight : 256,
		counterForImage : 0,
		frames : 5,
		image : fishSprite1,
		X : X,
		Y : Y,
		add : add,
		usingWidth : 64,
		usingHeight : 64,
		ID : IDcounter
	});
	let newFish2 = new fish({
		frameWidth : 105,
		frameHeight : 85,
		counterForImage : 0,
		frames : 6,
		image : fishSprite2,
		X : X,
		Y : Y,
		add : add,
		usingWidth : 52,
		usingHeight : 42,
		ID : IDcounter
	})
	let newCrab = new fish({
		frameWidth : 162,
		frameHeight : 112,
		counterForImage : 0,
		frames : 4,
		image : crabSprite,
		X : X,
		Y : Y,
		add : add,
		usingWidth : 54,
		usingHeight : 37,
		ID : IDcounter
	})

	//добавить выбор спавна
	if (randomSpawn === 1){Fishes1.push(newFish)}
	else if(randomSpawn === 2) Fishes1.push(newFish2)
	else if (randomSpawn === 3) Fishes1.push(newCrab)
	else (console.log("error"))
}



// collision detection

function collisionDetection(Xpoint,Ypoint,objX,objY,objWidth,objHeight,objID){
	if(
		Xpoint >= objX
		&& Xpoint <= objX + objWidth
		&& Ypoint >= objY
		&& Ypoint <= objY + objHeight
		) {
		Fishes1 = Fishes1.filter(el => el.ID !== objID)
		currentlyShooting = false;
		score+=100;
		console.log(objID);
	}
}


function printScore (){
	ctx.font = "32px serif"
	ctx.fillStyle = "black";
	ctx.fillText(score ,10,30)
}



// событие при нажании на пробел

document.body.onkeyup = function(e) {
	if(e.key === "" || e.code === "Space" || e.keyCode === 32) {
		currentlyShooting = true;
		endingStartX = aimXstart + xShipCounter + aimCounter;
		endingStartY = aimYstart + 100 + yShipCounter - Math.abs(aimCounter / 3);
		shootingStepX = (endingStartX - aimXstart) / 50
		shootingStepY = (endingStartY - aimYstart) / 50
	}
}



















// after init
//update();
ship_image.onload = () => {
		update();
	}