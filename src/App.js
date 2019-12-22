import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components'
import useScanner from './hooks/useScanner'
import JsBarcode from "jsbarcode";
import io from 'socket.io-client'
import Scanner from './components/Scanner'

function App() {
  
  return (
  <Scanner/>
  );
}

export default App;
