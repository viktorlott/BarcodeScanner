import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import store from './store'
import { Provider } from 'react-redux'
import './App.css';
import 'antd/dist/antd.css';
import Factory from './components/Factory'
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Link,
  } from "react-router-dom";

function Root() {
	return (
		<Provider store={store}>
			<Router>
				<App/>
			</Router>
		</Provider>
	)
}



/*global chrome*/
ReactDOM.render(<Root/>, document.getElementById('root'));

serviceWorker.unregister();
// serviceWorker.register()

// Disable zoom in iOS safari
document.addEventListener('touchmove', function(event) {
	event = event.originalEvent || event;
	if (event.scale !== 1) {
	   event.preventDefault();
	}
}, false);
