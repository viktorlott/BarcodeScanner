import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components'
import useScanner from './hooks/useScanner'
import JsBarcode from "jsbarcode";
import io from 'socket.io-client'

function fetchBarcode(id) {
  return fetch("https://develottment.com/products/"+id, {mode: 'cors'})
}

const socket = io("https://develottment.com", { path: "/stream"})



const Container = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: black;


`

const ScannerContainer = styled.div`
  /* width: 100vw; */
  /* height: 480px; */
  position: absolute;
  top: 0;
  width: 100vw;
  height: 100vh;
  /* display:flex;
  justify-content: center;
  align-items: center;
  overflow: hidden; */
  position: absolute;
  background: ${props => props.isPaused ? "black" : "none"};
 

`

const ScannerWrapper = styled.div`
  /* 
  width: 640px;
  height: 480px; */
  /* width: 100%;
  height: 100%; */
  position: relative;
  overflow: hidden;

`

const TopBlock = styled.div`
  width: 100%;
  height: 100px;

`
const CenterBlock = styled(TopBlock)`
  display: flex;
  height: 200px;

`
const CenterRight = styled.div`
  flex: 1;
  background: rgba(0,0,0,0.7);
`;
const Scope = styled.div`
  flex: 5;
  background: ${props => props.isPaused ? "black" : "none"};
`;
const CenterLeft = styled.div`
  flex: 1;
  background: rgba(0,0,0,0.7);
`;

const Darker = styled.div`
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.7);
  display: flex;
  justify-content: center;
  align-items: ${props => props.flexStart ? "flex-start" : props.flexEnd ? "flex-end" : "flex-end"};
  color: white;
  text-transform: capitalize;
  position: relative;
  overflow: hidden;
`



const BottomBlock = styled(TopBlock)`
  height: calc(100% - 200px - 100px);
  width: 100%;
  overflow: hidden;
`

const Gradient = styled.div`

  width: 100%;
  height: calc(100% - 100px - 200px);
  position: absolute;
  bottom: 0;
  background: linear-gradient(
      rgba(0, 0, 0, 0.0) 0%,
      rgba(0, 0, 0, 0.7) 50%,
      rgba(0, 0, 0, 0.8) 70%,
      rgba(0, 0, 0, 0.9) 80%,
      rgba(0, 0, 0, 1) 90%,
      rgba(0, 0, 0, 1) 95%,

      rgba(0, 0, 0, 1.0) 100%
    );


`

const FieldView = styled.div`
  position: relative;
  z-index: 10;  
  width: 100%;
  height: 200px;
  transition: border 0.2s;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  > * {
    transition: all 0.2s ease-in;
  }
`

const TopLeft = styled.div`
  height: 30%;
  width: 30%;
  position: absolute;
  top: 0;
  left: 0;
  background: none;
  border-top: 3px solid ${props => props.match ? "#00FF00" : "white"};
  border-left: 3px solid ${props => props.match ? "#00FF00" : "white"};
`
const TopRight = styled.div`
  height: 30%;
  width: 30%;
  position: absolute;
  top: 0;
  right: 0;
  background: none;
  border-top: 3px solid ${props => props.match ? "#00FF00" : "white"};
  border-right: 3px solid ${props => props.match ? "#00FF00" : "white"};

`
const BottomLeft = styled.div`
  height: 30%;
  width: 30%;
  position: absolute;
  bottom: 0;
  background: none;
  left: 0;
  border-bottom: 3px solid ${props => props.match ? "#00FF00" : "white"};
  border-left: 3px solid ${props => props.match ? "#00FF00" : "white"};

`
const BottomRight = styled.div`
  height: 30%;
  width: 30%;
  position: absolute;
  bottom: 0;
  right: 0;
  background: none;
  border-bottom: 3px solid ${props => props.match ? "#00FF00" : "white"};
  border-right: 3px solid ${props => props.match ? "#00FF00" : "white"};

`
const MatchFound = styled.div`
  color: #7CFC00;
  transition: opacity 0.2s ease-in, visibility 0.2s ease-in;
  opacity: ${props => props.isMatch ? 1 : 0};
  visibility: ${props => props.isMatch ? "visible" : "hidden"};

  >h3 {
    text-align: center;
    margin: 5px;

    text-transform: capitalize;
  }
`

const Barcode = styled.svg`

`

const List = styled.div`
  padding: 10px 0;
  z-index: 1000;
  height: calc(100% - 80px);
  margin: 10px 0;
  overflow: scroll;
  -webkit-overflow-scrolling: touch;

  >ul {
    padding: 0;
    li {
      h4 {
        padding: 0;
        margin: 0;
        text-align: center;
      }
      color: white;
      list-style-type: none;
      padding: 0;
    }
  }

`

const ButtonDiv = styled.div`
  height: 60;
  width: 100%;
  border-radius: 0; 
  outline: none;
  text-align: center; 
  background-color: #1890ff; 
  vertical-align: middle; 
  display: flex;
  justify-content: center; 
  align-items: center;
  text-shadow: 0 -1px 0 rgba(0,0,0,0.12);
  text-transform: capitalize;
  font-size: 16;
  border-radius: 1;
  border: 1px solid #1890ff;
  box-shadow: 0 2px 0 rgba(0,0,0,0.045);
  cursor: pointer;
  position: absolute;
  top: 0;
  padding: 10px;
`

const Spinner = () => (
<div class="spinner">
  <div class="rect1"></div>
  <div class="rect2"></div>
  <div class="rect3"></div>
  {/* <div class="rect4"></div> */}
  {/* <div class="rect5"></div> */}
</div>
)

function App() {
  const [bind, state, ctl] = useScanner({ fetchBarcode, socket })
  const barcodeRef = useRef()


  useEffect(() => {


  },[])

  useEffect(() => {
    if(state.match) {
      JsBarcode(barcodeRef.current, state.match.code, {
        format: state.match.format.replace("_", "").toUpperCase(),
        lineColor: "#ffffff",
        background: "#000000",
        width: 2,
        height: 40,
        displayValue: true
      });
    }
  },[state.match]) 

  return (
    <Container>
      <ScannerWrapper {...bind} />
      <ScannerContainer isPaused={ctl.isPaused}>
          <TopBlock>
            <Darker flexEnd={true}>
              <h4 style={{display: state.match ? "none" : "block"}}>Scan Barcode</h4>
            </Darker>
          </TopBlock>
          <CenterBlock>
            <CenterLeft/>
            <Scope isPaused={ctl.isPaused}>
              <FieldView> 
                    <TopLeft className="border" match={state.match} />
                    <TopRight className="border" match={state.match}/>
                    <MatchFound isMatch={state.match}>
                      <h3>Match hittad!</h3>
                      <div onClick={e => ctl.start()}><Barcode  ref={barcodeRef} /></div>
                    </MatchFound>
                    <BottomRight className="border" match={state.match}/>
                    <BottomLeft className="border" match={state.match}/>
                </FieldView>
            </Scope>
            <CenterRight/>
          </CenterBlock>
          <BottomBlock>
            <Darker flexStart={true}>
                <List>
                  <ul>
                    <li style={{marginBottom: 5}}><h4>Barkoder</h4></li>
                    {ctl.list.map(result => {
                      if(result.product) {
                      return <li>{result.product.title}{" "}<span>{" "}</span>{" - "}{result.product.price}{"kr"}</li> 
                      }
                      return <li><Spinner/>{result.code}</li>
                    })}
                  </ul>
                </List>
            </Darker>
            <Gradient/>
          </BottomBlock>
      
        </ScannerContainer>
    </Container>
  );
}

export default App;
