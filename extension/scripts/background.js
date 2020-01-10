// Called when the user clicks on the browser action
function sendMessage(action) {
	return new Promise((res, rej) => {
		/*global chrome*/
		chrome.tabs.query({ active: true, currentWindow: true },
			function (tabs) {
				const activeTab = tabs[0];
				/*global chrome*/
				chrome.tabs.sendMessage(activeTab.id, action);

				res(tabs)
		});
	})
}

const socket = io.connect("https://develottment.com", { path: "/stream"})


socket.on("connect", () => {
	
	socket.on("/receive/barcode", async barcode => {
		// to content
		await sendMessage({ type: "SEARCH_BARCODE", payload: barcode})
	})

	socket.on("/action", action => {
		// to popup
		chrome.runtime.sendMessage(action)
		sendMessage(action)

	})
})


socket.emit("/room/join", "scanner2")

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		switch(request.type) {
			case "JOIN_ROOM": 
				sendMessage(request)
				socket.emit("/room/join", request.payload.roomname || "scanner")
				break;
			case "POPUP_CLICKED": 
				// to content
				sendMessage({ type: "CHECK_ROOM"})
				break;
		}
	}
)

