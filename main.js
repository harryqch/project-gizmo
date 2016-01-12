var browseButton = document.getElementById("image_upload")
browseButton.addEventListener('change', loadImage);			//Run 'loadImage' function when file upload detects a change	

var canvasMain = document.getElementById("canvas_picker"); 
var canvasCtx = canvasMain.getContext("2d");				//Adds a '2D' drawing context to it so 2D drawing methods can be used within it
canvasMain.addEventListener('mousedown', previewColour);	//Run 'previewColour' function when mouse is clicked on canvas

var rgbTextbox = document.getElementById("rgb_text");
var hexTextbox = document.getElementById("hex_text");

//Draw selected image to canvas when file is loaded to array
function loadImage(e){
	var img = new Image();
	img.src = URL.createObjectURL(e.target.files[0]);
	
	img.onload = function(){  
		var imgWidth = img.width;
		var imgHeight = img.height;
		var maxWidth = canvasMain.width;
		var maxHeight = canvasMain.height;
		
		canvasCtx.clearRect(1,1,maxWidth,maxHeight); 		//Clear canvas of anything that may have been drawn previously
		
		//Defines height and width of image drawn, adjusts to fit in canvas if too large while keeping height to width ratio the same
		if (imgWidth > imgHeight) {
			if (imgWidth > maxWidth) {
				imgHeight *= maxWidth / imgWidth;
				imgWidth = maxWidth;
			}
		} else {
			if (imgHeight > maxHeight){
				imgWidth *= maxHeight / imgHeight;
				imgHeight = maxHeight;
			}
		}		
		canvasCtx.drawImage(img,1,1,imgWidth,imgHeight);
	}
}			
					
//Updates background colour of preview div
function previewColour(event_mouseMove){
	var canvasOffset = $(canvasMain).offset();	//Gets position of the canvas to be used as offset
	var canvasX = Math.floor(event_mouseMove.pageX - canvasOffset.left);	//Gets x and y coordinates of mouse on page, minus offset to compensate for canvas position relative to the page
	var canvasY = Math.floor(event_mouseMove.pageY - canvasOffset.top);
	
	var imageData = canvasCtx.getImageData(canvasX, canvasY, 1, 1);	//Gets image data of the pixel the mouse is over, stores in array in 'data'
	var pixel = imageData.data;	//Gets array
	var pixelColorCSS_rgb = "rgba("+pixel[0]+", "+pixel[1]+", "+pixel[2]+", "+pixel[3]+")";	//Gets the rgba values from the array
	var pixelColourText_rgb = pixel[0]+", "+pixel[1]+", "+pixel[2];
	$('#colour_preview').css('backgroundColor', pixelColorCSS_rgb);	//Updates CSS of colour_preview, background colour to pixel colour
	rgbTextbox.value = pixelColourText_rgb;
	
	hexTextbox.value = rbgToHex(pixel[0], pixel[1], pixel[2]);	
}

//Parses rgb values as int then converts to base 16 string (hex) 
function rbgToHex(r,g,b){
	var r = parseInt(r).toString(16).toUpperCase(); 	
	var r_hex = r.length == 1 ? "0"+r : r;
	var g = parseInt(g).toString(16).toUpperCase(); 
	var g_hex = g.length == 1 ? "0"+g : g;
	var b = parseInt(b).toString(16).toUpperCase(); 
	var b_hex = b.length == 1 ? "0"+b : b;
	return "#"+r_hex+g_hex+b_hex;
}