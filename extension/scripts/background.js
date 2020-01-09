// Called when the user clicks on the browser action


const socket = io.connect("https://develottment.com", { path: "/stream"})

console.log("Connected", socket)

socket.on("connect", () => {
	console.log("connected Real",socket.id)

	socket.on("/receive/barcode", barcode => {
		/*global chrome*/
		chrome.tabs.query({ active: true, currentWindow: true },
			function (tabs) {
				const activeTab = tabs[0];
				/*global chrome*/
				chrome.tabs.sendMessage(activeTab.id,
					{ type: "SEARCH_BARCODE", payload: barcode}
			);
		});
	})
})