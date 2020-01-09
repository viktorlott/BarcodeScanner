// Called when the user clicks on the browser action



const socket = io.connect("https://develottment.com", { path: "/stream"})

console.log(socket)
chrome.browserAction.onClicked.addListener(function(tab) {
	console.log("hello")
	// Send a message to the active tab
	chrome.tabs.query({active: true, currentWindow:true},
	   function(tabs) {
		  var activeTab = tabs[0];
		  chrome.tabs.sendMessage(activeTab.id, 
			  {"message": "clicked_browser_action"}
		  );
	});
 });