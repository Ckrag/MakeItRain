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
	clear();
	createImage();
	drawImages();
	setTimeout(start, 50);
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

function createImage(){
	if (Math.random() > 0.96){
		var random_image = Math.floor(Math.random()*image_array.length);
		var imageObj = new Image();
		var y_treshhold = 10;
		imageObj.src = image_array[random_image];
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
			console.log(allImage[i]);
			console.log(err + ", wierd chrome bug");
		}
	}
}

