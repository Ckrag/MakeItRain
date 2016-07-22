<?php
////////////////////////////////////////////VARS AND CONTENT////////////////////////////////////

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

//php
$error_wrong = "Error: Your image-links have to be an image file, and end in jpeg, gif, png or similar.";
$none_image_input = 6; //$none_image_input is a magic number for when the $_GET starts containing image URLs

function make(){
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

	////////////////////////////////////////////TEMPLATE SELECTOR////////////////////////////////////
	if (validateGets()) { //if $_GET isn't empty, validate input
		global $image_urls;
		$image_urls = createImgArray();
		if (validateUrls($image_urls)){
			$ready = true;
			showContentHtml();
		} else { //if validateUrls returns false, show error
			$error_message = $error_wrong;
			showSubmitHtml();
		}
	} else { //if no $_GET show base template
		showSubmitHtml();
	}
}



function showSubmitHtml(){
	global $error_message;
	global $input_field_width;
	global $input_div;
	echo
	'<div id="editor">
		<form id="editor_form" action="index.php" method="get" onsubmit="return verifyInputFinalize('. $input_div .');">
			<div id="settings_frame">
				<div class="input_box">
					Message: <br><textarea rows="6" cols="30" name="message" placeholder="If this field is left blank, no message will be shown"></textarea>
				</div>
				<div class="input_box" title="Select your color settings my clicking on the inputfield">
					Background Color: <br><input type="text" name="background_color" class="color"><br>
					Font Color: <br><input type="text" name="font_color" class="color" >
				</div>
				<div class="input_box">
					Image Size: <br><!--<button type=button id="image_menu_btn" onclick="addImageSize()">Show Image-properties</button>-->
					<div id="image_menu" title="Select your image settings">
						<input type="radio" name="aspect" value="height" checked>Height<br>
						<input type="radio" name="aspect" value="width">Width<br>
						<input placeholder="Input max image size" type="text" name="size"><br>
						<input type="checkbox" name="force_scale" value="true">Scale images to max<br>
					</div>
				</div>
				<div class="input_box">
					<p>Still in development :)</p>
				</div>
			</div>
			<div id="'. $input_div .'" title="Add imagelinks here, remember they have to end in .jpg, .gif, .png or similar">
				Image Link(s): <br>
				<input type="text" onchange="verifyInput(this)" class="input_field" name="image"><br>
			</div>
			<button type="button" onclick="addLink()">Add More Images</button>
			<div id="error_box">
			'. $error_message .'
			</div>
			<input value="Start" type="submit" id="start_btn">
		</form>
	</div>';
		
}

function showContentHtml(){
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

function createImgArray(){
	$image_urls = array();
	foreach($_GET as $key => $value) {
		if (preg_match("/image/", $key)){
			array_push($image_urls, $value);
		}
	}
	return $image_urls;
}

function validateGets() {
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

function checkExt($ext){
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

function validateUrls($img_url_array) {
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
		
		if(!checkExt($ext)){
			$correct_format = false;
		}
		
	}
	
	if($image && $correct_format) {
		return true;
	} else {
		return false;
	}
}
?>