import { put, takeEvery, all, call } from 'redux-saga/effects'

function storeMessage(action) {
	return {
		type: ""
	}
}

export function* fromExtension(action) {
	yield put()
}

export function* toExtension(action) {
	/*global chrome*/
	chrome.tabs.query({ active: true, currentWindow: true },
		function (tabs) {
			const activeTab = tabs[0];
			/*global chrome*/
			chrome.tabs.sendMessage(activeTab.id,
				action.payload
		);
	});
}