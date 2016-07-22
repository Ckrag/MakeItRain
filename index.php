<!DOCTYPE html>
<html>
	<head>
		<title>The Image Rain</title>
		<meta charset="UTF-8">
		<script type="text/javascript" src="jscolor/jscolor.js"></script>
		<script type="text/javascript" src="rain.js"></script>
		<link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">
		<link rel="stylesheet" type="text/css" href="style.css">
	</head>
	<body>
		<canvas id="myCanvas">
			Your browser does not support the HTML5 canvas tag.
		</canvas>

		<?php
			include_once "rain.php";
			make();
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
		</script>
	</body>
</html>

