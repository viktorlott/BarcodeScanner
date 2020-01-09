function sendMessage(action) {
	console.log("hello")
	/*global chrome*/
	chrome.tabs.query({ active: true, currentWindow: true },
		function (tabs) {
			const activeTab = tabs[0];
			/*global chrome*/
			chrome.tabs.sendMessage(activeTab.id, action);
	});
}
const currentRoom = document.querySelector("#current_room")

const room = document.querySelector("#room")

const joinRoomBtn = document.querySelector("#join_room")
const selectInputBtn = document.querySelector("#select_input")
const selectButtonBtn = document.querySelector("#select_button")

joinRoomBtn.addEventListener("click", () => {
	sendMessage({type: "JOIN_ROOM", payload: room.value || ""})
})

selectInputBtn.addEventListener("click", () => {
	sendMessage({type: "SELECT_INPUT_ELEMENT"})
})

selectButtonBtn.addEventListener("click", () => {
	sendMessage({type: "SELECT_BUTTON_ELEMENT"})
})


function test() {
	sendMessage({type: "SELECT_INPUT_ELEMENT"})

}
