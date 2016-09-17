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
	spawnRainObject();
	clearCanvas();
}

function clearCanvas(){
	clear();
	for (var i = objToAnimate.length - 1; i >= 0; i--) {
		objToAnimate[i].onScreenCleared();
	}
	setTimeout(function (){ clearCanvas() }, 20);
}

function removeImageDataEntry(index){
	image_data[0].splice(index, 1);
	image_data[1].splice(index, 1);
}

function spawnRainObject(){
	// Nothing to show anyway
	if(image_data[0].length == 0)
		return;

	var random_index = Math.floor(Math.random()*image_data[0].length);

	var rainItem = new RainObject(image_data[0][random_index], image_data[1][random_index], ctx, random_index);
	rainItem.init();
	objToAnimate.push(rainItem);

	setTimeout(function (){ spawnRainObject() }, Math.random()*5000);
}

function RainObject(url, mime, canvas, dataIndex) {

    this.url = url;
    this.mime = mime;
    this.dataIndex = dataIndex;

    this.ready = false;
    this.isDirty = false;

    this.drawObj;

    this.init = function(){

    	if(this.mime.indexOf("text/html") !== -1 && this.url.indexOf("gifv") !== -1){
    		this.url = handleImgurLink(this.url);
    		//try again!
    		this.init();

    	} else if(this.mime == "video/webm" || this.mime == "video/mp4" || this.url.indexOf(".mp4") == this.url.length - 4){
    		// Video
    		var video = document.createElement('video');
    		video.src = this.url;
    		video.autoPlay = true;
    		video.loop = true;
    		video.volume = 0.0;

    		var obj = this;

    		// We wait for metadata so we know the size
    		video.addEventListener("loadedmetadata", function (e) {
    			video.width = video.videoWidth;
    			video.height = video.videoHeight;
    			obj.drawObj = video;

    			obj.onInitComplete();
    		}, false);

    		video.load();
    		video.play();

    		    		
    	} else {
    		// Default to image
    		var image = new Image();
    		image.src = this.url;

    		this.drawObj = image;

    		this.onInitComplete();
    	}
    	
    }

    this.onInitComplete = function(){
    	this.correctSizing();
    	this.move();
    	this.ready = true;
    }

    this.correctSizing = function(){
    	if(image_settings){
			if(force_scale){
				if(image_aspect == "x") {
					this.drawObj.y = -max_image_size-this.yThreshhold;//
					this.height = max_image_size; 
					this.width = scaleImage(this.drawObj, max_image_size, "x");
				} else if(image_aspect == "y") {
					this.drawObj.y = -this.drawObj.height-this.yThreshhold; //
					this.width = max_image_size;
					this.height = scaleImage(this.drawObj, max_image_size, "y");
				}
			} else {
				if(image_aspect == "x") {
					if(this.drawObj.height > max_image_size){
						this.drawObj.y = -max_image_size-this.yThreshhold; //
						this.height = max_image_size;
						this.width = scaleImage(this.drawObj, max_image_size, "x");
					}
				} else if(image_aspect == "y") {
					if(this.drawObj.width > max_image_size){
						this.drawObj.y = -this.drawObj.height-this.yThreshhold;//
						this.width = max_image_size;
						this.height = scaleImage(this.drawObj, max_image_size, "y");
					}
				}
			}
		} else {
			this.y = -this.drawObj.height;
			this.height = this.drawObj.height;
			this.width = this.drawObj.width;
		}
    }

    this.isValid = false;
    this.x = ((c.width + 600)*Math.random()+1)-300;
    this.y = -400;
    this.width = 400;
    this.height = 400;
    this.speed = Math.random()*10;
    this.yTreshhold = 10;

    this.draw = function(){

    	if(this.isOutside()){
    		this.remove();
    		return;
    	};

    	if(this.ready){
    		//DRAW
    		try {
    			ctx.drawImage(this.drawObj, this.x, this.y, this.width, this.height);
    		}

    		catch(err) {
    			this.isDirty = true;
				if(confirm("Error loading: " + this.url + ", want to go back and try again?")){
					window.history.back();
				};
			return false;
			}
    	}
    	
    };

    this.move = function(){
    	this.y += this.speed;
    	var obj = this;
    	if(!this.isDirty)
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
    	if(this.isDirty){
    		this.remove();
    		removeImageDataEntry(this.dataIndex);
    	} else
    		this.draw();
    }
}

function handleImgurLink(url){
	// we assume all imgur video is mp4
	var idString = "imgur.com/";

	var fileNameIndex = url.indexOf(idString) + idString.length;
	var fileName = url.substring(fileNameIndex, url.length);

	//remove ending as well
	var baseName = fileName.substring(0, fileName.indexOf(".gifv"));

	return "https://i.imgur.com/" + baseName + ".mp4";
}