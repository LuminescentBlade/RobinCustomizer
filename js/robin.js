var canvas;
var ctx;
var tintcanvas;
var ttx;
var currentFilter = "overlay";
var isFirefox = typeof InstallTrigger !== 'undefined';  


var currentrobin = 0; //0,1,2M 3,4,5F
var currentHair = 0;
var currentFace = 0;
var currentColor = 0;

var colorList = ["#f9f2eb","#8e5956","#4c5f7a","#6e8160","#7d6350","#f6b1b1","#dfc7a9","#83618a","#5a5354","#b3afb0","#d57a80","#97aed3","#84cad2","#b9d3ad","#cbb1a1","#ffdadc","#fde8c0","#c7a3d8","#b17878","#e28d73"];
//["#F7E4D3","#8A504E","#4D596A","#71795A","#634E3F","#E6A197","#D3B692","#815E78","#5B4E49","#A59C95","#CA7A73","#96A2B7","#7EB1AD","#B4C199","#C39F89","#FCD0C2","#F4DBAD","#C497BC","#A26B61","#D57F60"]
var loadednum = 0;
var robinList = [];


initrobin();

function initCanvas(){
	canvas=$("#robincanvas")[0];
	ctx=canvas.getContext("2d");
	tintcanvas = document.createElement('canvas');
	tintcanvas.width = 256;
	tintcanvas.height = 256;
	ttx = tintcanvas.getContext('2d');
}


function Reflet(gender, size){
	this.gender = gender;
	this.size = size;
	this.faces = [];
	this.hair = [];
}

function initrobin(){
	robinList.push(new Reflet("male", 1));
	robinList.push(new Reflet("male", 2));
	robinList.push(new Reflet("male", 3));
	robinList.push(new Reflet("fem", 1));
	robinList.push(new Reflet("fem", 2));
	robinList.push(new Reflet("fem", 3));
	targetnum = robinList.length*(5+5);

	//
	for(var i = 0; i < robinList.length; i++){
		var robin = robinList[i];

		for(var j = 1; j <= 5; j++){
			var s = "img/face/"+robin.gender+"-"+robin.size+"/"+j+".png";
			var img = new Image();
			img.onload=function(){
				loadednum++;
				dispload();
			}
			img.src = s;
			robin.faces.push(img);
		}

		for(var j = 1; j <= 5; j++){
			var s = "img/hair/"+robin.gender+"-"+robin.size+"/"+j+".png";
			var img = new Image();
			img.onload=function(){
				loadednum++;
				dispload();
			}
			img.src = s;
			robin.hair.push(img);
		}	
	}
}

function forward(param){
	if(param === "robin"){
		currentrobin = (currentrobin+1)%robinList.length;
	}
	else if(param === "face"){
		var numface = robinList[currentrobin].faces.length;
		currentFace = (currentFace+1)%numface;
	}
	else if(param === "hair"){
		var numhair = robinList[currentrobin].hair.length;
		currentHair = (currentHair+1)%numhair;
	}
	else if(param === "color"){
		currentColor = (currentColor+1)%colorList.length;
	}
	changeMenu(param);
	loadCurrentrobin();

}

function backward(param){
	if(param === "robin"){
		currentrobin = (currentrobin+robinList.length-1)%robinList.length;
	}
	else if(param === "face"){
		var numface = robinList[currentrobin].faces.length;
		currentFace = (currentFace+numface-1)%numface;
	}
	else if(param === "hair"){
		var numhair = robinList[currentrobin].hair.length;
		currentHair = (currentHair+numhair-1)%numhair;
	}
	else if(param === "color"){
		currentColor = (currentColor+colorList.length-1)%colorList.length;
	}
	changeMenu(param);
	loadCurrentrobin();	
}

function loadCurrentrobin(){
	ctx.clearRect(0,0,256,256);
	var robin = robinList[currentrobin];

	ctx.drawImage(robin.faces[currentFace],0, 0);
	ctx.drawImage(robin.faces[currentFace],0, 0);

	var img = robin.hair[currentHair];
	drawHair(img);

}
function shift(){
	ttx.globalAlpha = 0.20;
	ttx.fillStyle = "#84C4F9";
	ttx.fillRect(0,0,256,256);
	ttx.globalAlpha = 1;
}
/*function drawHair(img){
	
	ttx.clearRect(0,0,255,255);
	if(currentFilter === "hard-light"){	
		ctx.drawImage(img, 0, 0);
		ttx.globalCompositeOperation = "source-over";
		ttx.drawImage(img, 0, 0);
		ttx.fillStyle = colorList[currentColor];
		ttx.fillRect(0,0,256,256);
		//shift();
		ttx.globalCompositeOperation = "destination-atop";
		ttx.drawImage(img, 0, 0);
		ttx.globalCompositeOperation = currentFilter;
		ttx.drawImage(img, 0, 0);

		ctx.drawImage(tintcanvas, 0, 0);
	}
	else if(currentFilter === "overlay"){
		ctx.drawImage(img, 0, 0);
		ttx.globalCompositeOperation = "source-over";
		ttx.drawImage(img, 0, 0);
		ttx.fillStyle = colorList[currentColor];
		ttx.fillRect(0,0,256,256);
		//shift();
		ttx.globalCompositeOperation = "destination-atop";
		ttx.drawImage(img, 0, 0);
		ttx.globalCompositeOperation = "source-over";

		ctx.globalCompositeOperation = "source-over";
		ctx.drawImage(img, 0, 0);
		ctx.globalCompositeOperation = "overlay";
		ctx.drawImage(tintcanvas, 0, 0);
		ctx.globalCompositeOperation = "source-over";
	}
	ttx.globalCompositeOperation = "source-over";
	ttx.clearRect(0,0,255,255);
}*/

function drawHair(img){
	
	ttx.clearRect(0,0,256,256);
	if(currentFilter === "hard-light"){	
		ctx.drawImage(img, 0, 0);
		ttx.globalCompositeOperation = "source-over";
		hairfill(img,colorList[currentColor]);
		ttx.globalCompositeOperation = currentFilter;
		ttx.drawImage(img, 0, 0);

		ctx.drawImage(tintcanvas, 0, 0);
	}
	else if(currentFilter === "overlay"){
		ctx.drawImage(img, 0, 0);
		ttx.globalCompositeOperation = "source-over";
		hairfill(img,colorList[currentColor]);
		ttx.globalCompositeOperation = "source-over";
		

		ctx.globalCompositeOperation = "source-over";
		ctx.drawImage(img, 0, 0);
		ctx.globalCompositeOperation = "overlay";
		ctx.drawImage(tintcanvas, 0, 0);
		ctx.globalCompositeOperation = "source-over";
	}
	ttx.globalCompositeOperation = "source-over";
	ttx.clearRect(0,0,255,255);
}

function dispload(){
	var p = Math.floor(100*(loadednum/targetnum));
	$("#loaderinner").html("Loading... <span>"+p+"</span>%");
	if (p > 75) $("#loaderinner span").css("color","#c3e9f8");
	else if (p > 50)$("#loaderinner span").css("color","#9ad0e6");
	else if (p > 25)$("#loaderinner span").css("color","#78b5cf");

	if(p === 100){
		$("#loader").remove();
	}
}


function changeMenu(param){
	if(param === "robin"){
		var kgender = (robinList[currentrobin].gender === "fem")?"Female":"Male";
		var ksize = robinList[currentrobin].size;

		$("#robin").html(kgender+" Build "+ksize);

		var clip = $("#clip");
		if(kgender === "Female"){
			if(clip.hasClass("disabled")){
				clip.removeClass("disabled");
				if(currentClip < 5){
					clip.html("Hair Clip "+(currentClip+1));
				}
				else{
					clip.html("None");
				}
			}
		}
		else{
			clip.addClass("disabled");
			clip.html("None");
		}

	}
	else if(param === "face"){
		$("#face").html("Face "+(currentFace+1));
	}
	else if(param === "hair"){
		$("#hair").html("Hair "+(currentHair+1));
	}
	else if(param === "hairclip"){
		var clip = $("#clip");
		if(currentClip < 5){
			clip.html("Hair Clip "+(currentClip+1));
		}
		else{
			clip.html("None");
		}

	}
	else if(param === "features"){
		if(currentFeature < 12){
			$("#features").html("Facial Feature "+(currentFeature+1));
		}
		else{
			$("#features").html("None");
		}
	}
	else if(param === "color"){
		$("#color").html("Hair Color "+(currentColor+1));
	}
}

function setFilterButton(){
	var h = "Current Blend Mode: ";
	if(currentFilter === "overlay") h += "Overlay";
	else h += "Hard Light";
	$("#algo").html(h);
}

function toggleFilter(){
	if(currentFilter === "overlay") currentFilter = "hard-light";
	else currentFilter = "overlay";
	setFilterButton();
	loadCurrentrobin();
}

function setupHelp(){
	var h = $("#helpinner");
	$("#helpinner").css("top",-h.outerHeight());
	$("#helpmenu").addClass("invis");
}

function closeHelp(){
	var h = $("#helpinner");
	$("#helpinner").animate({top:-h.outerHeight()},{complete:function(){
		$("#helpmenu").addClass("invis");
	}},"fast");
}

function openHelp(){
	$("#helpmenu").removeClass("invis");
	var h = $("#helpinner");
	$("#helpinner").animate({top:0},"fast");
}

function hexToRGBA(hex,alpha) {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? {
		r: parseInt(result[1], 16),
		g: parseInt(result[2], 16),
		b: parseInt(result[3], 16),
		a: alpha
	} : null;
}

function hairfill(img,color){
	ttx.clearRect(0,0,256,256);
	ttx.drawImage(img, 0, 0);
	var imgdata = ttx.getImageData(0,0,256,256);
	var col = hexToRGBA(color);
	var hasColor = function(pos){
		var r = imgdata.data[pos];
		var g = imgdata.data[pos+1];
		var b = imgdata.data[pos+2];
		var a = imgdata.data[pos+3];

		return (a != 0)
	}
	var colorPix = function(pos){
		imgdata.data[pos] = col.r;
		imgdata.data[pos+1] = col.g;
		imgdata.data[pos+2] = col.b;
	}

	for(var i = 0; i < imgdata.data.length;i+=4){
		if(hasColor(i)) colorPix(i);
	}
	ttx.putImageData(imgdata,0,0);
}

$(window).load(function(){
	setupHelp();
	initCanvas();
	setFilterButton();
	changeMenu("robin");
	changeMenu("face");
	changeMenu("hair");
	changeMenu("color");
//	initrobin();
	loadCurrentrobin();	
});
