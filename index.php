<!DOCTYPE html>
<html>

<head>
<script type="text/javascript" src="jscolor/jscolor.js"></script>
<style type="text/css">
body {
	margin: 0;
	padding: 0;
	overflow: hidden;
}

#textfield {
	position:absolute;
	margin-left:50%;
	left:-250px;
	top:30%;
	width:500px;
	z-index:100;
	background-image:url('bg.png');
	background-repeat:repeat;
	border:2px solid;
	border-radius:25px;
	-moz-border-radius:25px;
}

#editor {
	position:absolute;
	margin-left:50%;
	left:-450px;
	top:30%;
	width:900px;
	z-index:100;
	background-image:url('bg.png');
	background-repeat:repeat;
	border:2px solid;
	border-radius:25px;
	-moz-border-radius:25px;
}

#image_menu {
	visibility:visible;
}

#textfield form {
	margin:15px;
}
#textfield p {
	margin:15px;
}

#editor form {
	margin:15px;
}
#editor p {
	margin:15px;
}

#canvas {
	z-index:50;
}

#settings_frame {
	width:100%;
	height:200px;
	position:relative;
}

#link_input {
	width:100%;
	float:left;
	position:relative;
}

#start_btn {
	right:0;
	bottom:-115px;
	position:absolute;
}

.input_box {
	position:relative;
	float:left;
	margin-left:15px;
	border:2px solid #ABABAB;
}

h2 {
	text-align:center;
}


</style>

</head>
<body>
	<canvas id="myCanvas">
		Your browser does not support the HTML5 canvas tag.
	</canvas>


<?php
//var_dump($_GET);
//exit;

////////////////////////////////////////////VARS AND CONTENT////////////////////////////////////

error_reporting(E_ERROR | E_PARSE);
$message = nl2br(htmlentities($_GET["message"], ENT_QUOTES, 'UTF-8'));

//js
$message = nl2br($_GET["message"]);
$image_urls;
$ready = false;
$input_div = "link_input";
$regex_pattern = '/([A-Fa-f0-9]{6})$/';

//image settings
$size = false;
$aspect = false;

if (is_numeric($_GET["size"])){
	if ($_GET["size"] < 2000){
		$max_image_size = $_GET["size"];
		$size = true;
	}
}
if ($_GET["aspect"]=="height"){
	$image_aspect = "x";
	$aspect = true;
}else {
	$image_aspect = "y";
	$aspect = true;
}

if ($size){
	$image_settings = true;
} else {
	$image_settings = false;
}

if ($_GET["force_scale"]=="true"){
	$force_scale = true;
} else {
	$force_scale = false;
}

//color settings
if (preg_match($regex_pattern, $_GET["background_color"])){
	$background_color = "#" . $_GET["background_color"];
} else {
	$background_color = "#FFFFFF";
}

if (preg_match($regex_pattern, $_GET["font_color"])){
	$font_color = "#" . $_GET["font_color"];
} else {
	$font_color = "#000000";
}



//php
$error_wrong = "Error: Your image-links have to be an image file, and end in jpeg, gif, png or similar.";
$none_image_input = 6; //$none_image_input is a magic number for when the $_GET starts containing image URLs
$input_field_width = 120; //width of links-input fields (characters)

function ShowSubmitHtml(){
	global $error_message;
	global $input_field_width;
	global $input_div;
	echo '<div style="position:absolute;top:50px;left:400px;"><br />NOTE: Dont bother trying Internet Explorer, however I recommend <a href="https://www.google.com/intl/en/chrome/browser/">Chrome</a>, <a href="http://www.mozilla.org/en-US/firefox/new/">Firefox</a> or even <a href="http://www.apple.com/downloads/">Safari</a>.</div>
	<div id="editor">
		<form id="editor_form" action="index.php" method="get" onsubmit="return verifyInputFinalize('. $input_div .');">
			<div id="settings_frame">
				<div class="input_box">
					Message: <br /><textarea rows="6" cols="30" type="text" name="message" placeholder="If this field is left blank, no message will be shown"></textarea>
				</div>
				<div class="input_box" title="Select your color settings my clicking on the inputfield">
					Background Color: <br /><input type="text" name="background_color" class="color"><br />
					Font Color: <br /><input type="text" name="font_color" class="color" >
				</div>
				<div class="input_box">
					Image Size: <br /><!--<button type=button id="image_menu_btn" onclick="addImageSize()">Show Image-properties</button>-->
					<div id="image_menu" title="Select your image settings">
						<input type="radio" name="aspect" value="height" checked>Height<br>
						<input type="radio" name="aspect" value="width">Width<br />
						<input placeholder="Input max image size" type="text" name="size"><br />
						<input type="checkbox" name="force_scale" value="true">Scale images to max<br>
					</div>
				</div>
				<div class="input_box">
					<p>Still in development :)</p>
				</div>
			</div>
			<div id="'. $input_div .'" title="Add imagelinks here, remember they have to end in .jpg, .gif, .png or similar">
				Image Link(s): <br />
				<input size="'. $input_field_width .'" type="text" onchange="verifyInput(this)" class="input_field" name="image"><br />
			</div>
			<button type="button" onclick="addLink()">Add More Images</button>
			<div id="error_box">
			'. $error_message .'
			</div>
		</form>
		<input form="editor_form" value="Start" alt="Submit" type="submit" id="start_btn">
		</div>';
		
}

function ShowContentHtml(){
	global $message;
	if (ctype_space($message) || !$message == ''){
		echo '<div id="textfield">
					<h2>
						'. $message .'
					</h2>
			</div>';
	}
}

////////////////////////////////////////////FUNCTIONS////////////////////////////////////

function CreateImgArray(){
	$image_urls = array();
	foreach($_GET as $key => $value) {
		if (preg_match("/image/", $key)){
			array_push($image_urls, $value);
		}
	}
	return $image_urls;
}

function ValidateGets() {
	$validate = true;
	if ($_GET) {
		foreach($_GET as $key => $value) {
			if (empty($value) && preg_match("/image/", $key)){
				$validate = false;
			}
		}
	} else {
		$validate = false;
	}
	return $validate;
}

function CheckExt($ext){
	switch ($ext) {
	case "jpg":
		$valid_format = true;
		break;
	case "jpeg":
		$valid_format = true;
		break;
	case "png":
		$valid_format = true;
		break;
	case "gif":
		$valid_format = true;
		break;
	case "bmp":
		$valid_format = true;
		break;
	default:
		$valid_format = false;
	}
	return $valid_format;

}

function ValidateUrls ($img_url_array) {
	$image = true;
	$correct_format = true;
	
	foreach($img_url_array as $imageurl) {
		$imagecheck = getimagesize($imageurl);
		$pathinfo =  pathinfo($imageurl);
		$ext = $pathinfo['extension'];

		
		//check if it's an image
		if (!is_array($imagecheck)){
			$image = false;
		}
		//if it has an acceptable format
		
		if(!CheckExt($ext)){
			$correct_format = false;
		}
		
	}
	
	if($image && $correct_format) {
		return true;
	} else {
		return false;
	}
}

////////////////////////////////////////////TEMPLATE SELECTOR////////////////////////////////////
if (ValidateGets()) { //if $_GET isn't empty, validate input
	global $image_urls;
	$image_urls = CreateImgArray();
	if (ValidateUrls($image_urls)){
		$ready = true;
		ShowContentHtml();
	} else { //if validateUrls returns false, show error
		$error_message = $error_wrong;
		ShowSubmitHtml();
	}
} else { //if no $_GET show base template
	ShowSubmitHtml();
}
?>

<script>

//###############################################
//###############################################
//###############################################
//############ guys #############################
//###############################################
//############ please don't steal ###############
//############################## <3<3<3<3<3 #####
//###############################################
//##### clauskrag.com ###########################
//###############################################

//TODO --
//input -> error -> correct -> input (doesn't work unless page is reloaded) ??? needs a weird refresh (something with the file validation maybe)
//image-properties, graceful fallback something (too big image setting / no setting set but 'scale to max' set)

var c=document.getElementById("myCanvas");
var ctx=c.getContext("2d");
ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;
var canvasXtraSize = 600;
var allImages = new Array();
var maxNumberOfImages = 100;


var image_array = <?php echo json_encode($image_urls); ?>;
var ready = <?php echo json_encode($ready); ?>;

var max_image_size = <?php echo json_encode($max_image_size); ?>;
var image_aspect = <?php echo json_encode($image_aspect); ?>;
var image_settings = <?php echo json_encode($image_settings); ?>;
var force_scale = <?php echo json_encode($force_scale); ?>;

var input_div = <?php echo json_encode($input_div); ?>;
var error_message = <?php echo json_encode($error_wrong); ?>;
var background_color = <?php echo json_encode($background_color); ?>;
var font_color = <?php echo json_encode($font_color); ?>;

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
	var regex = /(\.gif|\.jpg|\.png|\.bmp|\.jpeg)+$/;
	var verified = true;

	if (!regex.test(element.value)){
		verified = false;
	}

	imageExist(element, verified);
}

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

function verifyInputFinalize(){
	
	var inputs = document.getElementsByClassName('input_field');

	var valid = true;

	for (var i = 0; i < inputs.length; i += 1) {
		if (inputs[i].style.backgroundColor == "rgb(240, 0, 0)"){
			valid = false;
		}
    }

    return valid;
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


</script>
</body>
</html>

