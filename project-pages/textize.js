function imagesSelected(myFiles) {
  var imageReader = new FileReader();
  imageReader.onload = function(e) {
    var dataUrl = e.target.result;
    var display = document.getElementById('display');
    display.src = dataUrl;
  }
  imageReader.readAsDataURL(myFiles[0]);
}

 function getBlockInfo(imageData, x, y, w, h) {
  var sumGray = 0,
	sumR = 0,
	sumG = 0,
	sumB = 0;
  for (var r = 0; r < h; r++) {
	for (var c = 0; c < w; c++) {
	  var cx = x + c,
		cy = y + r;
	  var index = (cy * imageData.width + cx) * 4;
	  var data = imageData.data;
	  var R = data[index],
		G = data[index + 1],
		B = data[index + 2],
		A = data[index + 3],
	    gray = ~~ (R * 0.3 + G * 0.59 + B * 0.11);
	  sumGray += gray;
	  sumR += R;
	  sumG += G;
	  sumB += B;
	}
  }
  var pixelCount = w * h;
  return {
	gray: ~~(sumGray / pixelCount),
	color: [~~(sumR / pixelCount), ~~(sumG / pixelCount), ~~(sumB / pixelCount)]
  };
}

function render(context, imageData, res, text){
	context.font = "8" + "px " + "Courier New";
	var textIndex = 0, rgbValue, grayValue;
	var w=imageData.width, h = imageData.height, min = w < h ? w : h;
	res = res > min ? min : res;
	var colNum = ~~(w / res);
	var rowNum = ~~(h / res);
	var i,j,blockAvg;
	for(i = 0;i < rowNum;i += 1)
		for(j = 0; j < colNum; j += 1){
			blockAvg = getBlockInfo(imageData, j * res, i * res, res, res);
			rgbValue = polarize(blockAvg).color;
			
			context.fillStyle = "rgb(" + rgbValue[0] + "," + rgbValue[1] + "," + rgbValue[2] + ")";
			//context.fillStyle = "rgb(" + 100 + "," + 0 + "," + 0 + ")";
			context.fillText(text[textIndex], j * res, i * res);
			//context.fillText(rgbValue[0] + ',' + rgbValue[1] + ',' + rgbValue[2], j * res, i * res);
			textIndex = textIndex >= text.length - 1 ? 0 : textIndex + 1;
		}
}

function show(hiddenCanvas, displayCanvas, inputImg, res, text){
	hiddenCanvas.width = display.width;
	hiddenCanvas.height = display.height;
	displayCanvas.width = display.width;
	displayCanvas.height = display.height;
	var ctx_h = hiddenCanvas.getContext('2d');
	var ctx_d = displayCanvas.getContext('2d');
	ctx_h.drawImage(display, 0, 0, display.width, display.height);//is this the only way to transfer pixel data from img to canvas?
	var imageData = ctx_h.getImageData(0, 0, hiddenCanvas.width, hiddenCanvas.height);
	//var data = imageData.data;//color data
	render(ctx_d, imageData, res, text);
}

function polarize(avg)
{
	var r = avg.color[0], g = avg.color[1], b = avg.color[2];
	if(avg.gray > 128){
		avg.color[0] = avg.color[0] * 1.2 > 255 ? 255 : ~~(avg.color[0] * 1.2);
		avg.color[1] = avg.color[1] * 1.2 > 255 ? 255 : ~~(avg.color[1] * 1.2);
		avg.color[2] = avg.color[0] * 1.2 > 255 ? 255 : ~~(avg.color[2] * 1.2);
	}
	else{
		avg.color[0] = ~~(avg.color[0] / 1.2);
		avg.color[1] = ~~(avg.color[1] / 1.2);
		avg.color[2] = ~~(avg.color[0] / 1.2);
	} 
	return avg;
}

var keyWords = "SteveJobs";
var blockSize = 6;
var canvas_h = document.getElementById('hidden-canvas');
var canvas_d = document.getElementById('display-canvas')
var display = document.getElementById('display');

display.onload = function(){
	show(canvas_h, canvas_d, display, blockSize, keyWords);
}

