function getTextWidth(message){
	var metrics = ctx.measureText(message);
	var width = metrics.width;
	return width;
}

var base_id = "input"; //base name of the inputfields
var max_input_fields = 10;

var fields = 0;
var checked_fields = 0;
function addLink() {
	if (fields < max_input_fields ) {	
		var array_pos = checked_fields;
		var container = document.createElement("div");
		container.id = base_id + array_pos;
		container.innerHTML = '<input onChange="verifyInput(this)" size="<?php echo $input_field_width; ?>" type="text" class="input_field" name="image' + array_pos + '"><button onclick="removeLink('+input_div+', '+base_id + array_pos+', '+array_pos+')" type="button">Remove</button>';
		if(!document.getElementById(container.id)){
			document.getElementById(input_div).appendChild(container);
			checked_fields = 0;
			fields += 1;
		}else{
			checked_fields += 1;
			addLink();
		}
	} else {
		window.alert("You already have 10 fields, this is max.");
	}
}

function removeLink(parrent, html_id, array_pos) {
	parrent.removeChild(html_id);
	fields -= 1;
}

////////////VERIFYYYY//////////////

function verifyInput(element){
	/*

	var regex = /(\.gif|\.jpg|\.png|\.bmp|\.jpeg)+$/;
	var verified = true;

	if (!regex.test(element.value)){
		verified = false;
	}

	imageExist(element, verified);
	*/
}

/*
function imageExist(element, verified) {
	if (verified){
		var img = new Image();

		img.onload = function(){
			inputCheck(element,verified);
		}
		img.onerror = function(){
			verified = false;
			inputCheck(element,verified);
		}
		img.src = element.value;
	} else {
		inputCheck(element,verified);
	}
}

function inputCheck(element, verified){
	var error_color = "rgb(240, 0, 0)";
	var standard_color = "rgb(0, 255, 64)";

	if(!verified){
		displayError("error_box", error_message, true);
		element.setAttribute("style","background-color: "+error_color+";");

	} else {
		displayError("error_box", error_message, false);
		element.setAttribute("style","background-color: "+standard_color+";");
	}
}
*/

function verifyInputFinalize(){

	return true;
	
	/*
	var inputs = document.getElementsByClassName('input_field');

	var valid = true;

	for (var i = 0; i < inputs.length; i += 1) {
		if (inputs[i].style.backgroundColor == "rgb(240, 0, 0)"){
			valid = false;
		}
    }

    return valid;
    */
}


function displayError(element_id, error, condition){
	element = document.getElementById(element_id); //have to use string instead of DOM object :(
	if (condition){	
		element.innerHTML = error;
	} else { 
		element.innerHTML = '';
	}
}

var image_menu = false;
function addImageSize(){
	var menu_html = '<input type="radio" name="image_aspect" value="height" checked>Height<br><input type="radio" name="image_aspect" value="width">Width<br /><input type="text" name="size">';
	if (image_menu){
		//hide
		document.getElementById('image_menu_btn').innerHTML = "Show Image-properties";
		document.getElementById('image_menu').style.visibility="hidden";
		image_menu = false;
	}else{
		//show
		document.getElementById('image_menu_btn').innerHTML = "Hide Image-properties";
		document.getElementById('image_menu').style.visibility="visible";
		image_menu = true;
	}	
}

window.onload = function() { //RUN THE SLIDESHOW
	if(ready){
		applyStyles();
		start();
	}
}

function applyStyles(){
	document.body.style.background=background_color;
	if (document.getElementById("textfield")){
		document.getElementById("textfield").style.color=font_color;
	}
}

function start(){
	//clear();
	//createImage();
	//if(drawImages()){
	//	setTimeout(start, 1000 / 30); // 30 fps
	//}
	runAnimation();
}

function clear() {
	ctx.clearRect(0, 0, c.width, c.height);
}

function scaleImage (imageObj, max_value, unknown_axis){
	var factor;
	switch (unknown_axis) {
	case "y":
		//max_value width, missing axis y (height)
		factor = max_value / imageObj.width;
		var new_height = imageObj.height * factor;
		return new_height;
		break;
	case "x":
		//max_value height, missing axis x (width)
		factor = max_value / imageObj.height;
		var new_width = imageObj.width * factor;
		return new_width;
		break;
	}
}

// ANIMATION MAGIC


var objToAnimate = [];
function runAnimation(){
	for (var i = 0; i < image_data[0].length; i++) {
		objToAnimate.push(new RainObject(image_data[0][i], image_data[1][i], ctx));
	}
	for (var i = 0; i < objToAnimate.length; i++) {
		objToAnimate[i].init();
	}


	clearCanvas();
}

function clearCanvas(){
	clear();
	for (var i = objToAnimate.length - 1; i >= 0; i--) {
		objToAnimate[i].onScreenCleared();
	}
	setTimeout(function (){ clearCanvas() }, 20);
}

function RainObject(url, mime, canvas) {

    this.url = url;
    this.mime = mime;

    this.drawObj;

    this.init = function(){
    	if(this.mime == "video/webm"){
    		// Video
    		var video = document.createElement('video');
    		video.src = this.url;
    		video.autoPlay = true;
    		video.loop = true;
    		video.volume = 0.0;
    		video.load();
    		video.play();

    		this.drawObj = video;    		
    	} else {
    		// Default to image
    		console.log("Not handling images yet!");
    	}
    	console.log("start drawing");
    	this.move();
    }

    this.isValid = false;

    this.x = 0;
    this.y = 0;
    this.width = 400;
    this.height = 400;
    this.speed = 2;

    this.draw = function(){

    	if(this.isOutside()){
    		this.remove();
    		return;
    	};

    	//DRAW
    	ctx.drawImage(this.drawObj, this.x, this.y, this.width, this.height);
    };

    this.move = function(){
    	this.y += this.speed;
    	var obj = this;
    	setTimeout(function (){ obj.move()}, 50);
    }

    this.isOutside = function(){

    	if(this.y - 50 > c.height)
    		return true;
    	return false;
    }

    this.remove = function(){
    	var index = objToAnimate.indexOf(this);
    	objToAnimate.splice(index, 1);
    }

    this.onScreenCleared = function(){
    	//pseudo callback
    	this.draw();
    }
}


/*
function createImage(){
	if (Math.random() > 0.96){
		var random_image = Math.floor(Math.random()*image_data.length);
		var imageObj = new Image();
		var y_treshhold = 10;
		imageObj.src = image_data[random_image];
		imageObj._x = ((c.width + 600)*Math.random()+1)-300;
		imageObj.speed = (Math.random()*10)+1
		if(image_settings){
			if(force_scale){
				if(image_aspect == "x") {
					imageObj._y = -max_image_size-y_treshhold;//
					imageObj._height = max_image_size; 
					imageObj._width = scaleImage(imageObj, max_image_size, "x");
				} else if(image_aspect == "y") {
					imageObj._y = -imageObj.height-y_treshhold; //
					imageObj._width = max_image_size;
					imageObj._height = scaleImage(imageObj, max_image_size, "y");
				}
			} else {
				if(image_aspect == "x") {
					if(imageObj.height > max_image_size){
						imageObj._y = -max_image_size-y_treshhold; //
						imageObj._height = max_image_size;
						imageObj._width = scaleImage(imageObj, max_image_size, "x");
					}
				} else if(image_aspect == "y") {
					if(imageObj.width > max_image_size){
						imageObj._y = -imageObj.height-y_treshhold;//
						imageObj._width = max_image_size;
						imageObj._height = scaleImage(imageObj, max_image_size, "y");
					}
				}
			}
		} else {
			imageObj._y = -imageObj.height;
			imageObj._height = imageObj.height;
			imageObj._width = imageObj.width;
		}
		allImages.push(imageObj);
	}
}

function drawImages(){
	for (var i = 0; i < allImages.length; i++)
	{
		if (allImages[i]._y - 50 > c.height){
			allImages[i] = null;
			allImages.splice(i, 1);
		}
		try {
			ctx.drawImage(allImages[i], allImages[i]._x, allImages[i]._y, allImages[i]._width, allImages[i]._height);
			allImages[i]._y += allImages[i].speed;
		}
		catch(err) {
			console.log(err + " occured with: " + allImages[i]);
			if(confirm("Bad image url, want to go back and try again?")){
				window.history.back();
			};
			return false;
		}
	}
	return true;
}
*/

