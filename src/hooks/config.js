export default state => ({
	inputStream : {
	  name : "Live",
	  type : "LiveStream",
	  target: state.target,
	  constraints: {
		width: 640,
		height: 480,
		facingMode: "environment",
		// deviceId: "7832475934759384534"
	  },
	  area: { // defines rectangle of the detection/localization area
		top: "0%",    // top offset
		right: "0%",  // right offset
		left: "0%",   // left offset
		bottom: "30%"  // bottom offset
	  },
	  singleChannel: false // true: only the red color-channel is read
	},
	decoder : {
	  readers : ["code_128_reader", "ean_reader", "ean_8_reader", "code_39_reader", "code_39_vin_reader", "codabar_reader"],
	  debug: {
		drawBoundingBox: false,
		showFrequency: false,
		drawScanline: false,
		showPattern: false
	}
	},
	locate: true,
	frequency: 10,
	locator: {
	  halfSample: true,
	  patchSize: "medium", // x-small, small, medium, large, x-large
	  debug: {
		showCanvas: false,
		showPatches: false,
		showFoundPatches: false,
		showSkeleton: false,
		showLabels: false,
		showPatchLabels: false,
		showRemainingPatchLabels: false,
		boxFromPatches: {
		  showTransformed: false,
		  showTransformedBox: false,
		  showBB: false
		}
	  }
	}
  })