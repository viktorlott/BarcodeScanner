// Popup script

chrome.runtime.sendMessage({type: "POPUP_CLICKED"})


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

const currentRoom = document.querySelector("#current_room")

const room = document.querySelector("#room")

const joinRoomBtn = document.querySelector("#join_room")
const selectInputBtn = document.querySelector("#select_input")
const selectButtonBtn = document.querySelector("#select_button")

joinRoomBtn.addEventListener("click", async () => {
	// to background script
	chrome.runtime.sendMessage({type: "JOIN_ROOM", payload: {roomname: room.value} || ""})

	// to content
	await sendMessage({type: "JOIN_ROOM", payload: {roomname: room.value} || ""})

})

selectInputBtn.addEventListener("click", async () => {
	// to content script
	await sendMessage({type: "SELECT_INPUT_ELEMENT"})
	window.close()
})

selectButtonBtn.addEventListener("click", async () => {
	// to content script
	await sendMessage({type: "SELECT_BUTTON_ELEMENT"})
	window.close()
})


chrome.extension.onMessage.addListener(function(action, messageSender, sendResponse) {
	console.log("popup",action)
	switch(action.type) {
		case "SOCKET_ROOM_JOINED":
			current_room.innerHTML = action.payload.roomname

			break;
	}

});	

