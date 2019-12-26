import React, { useRef, useEffect, useState } from 'react';
import useScanner from '../../hooks/useScanner'
import JsBarcode from "jsbarcode";
import io from 'socket.io-client'
import {
	Container,
	ScannerContainer,
	ScannerWrapper,
	TopBlock,
	CenterBlock,
	CenterRight,
	Scope,
	CenterLeft,
	Darker,
	BottomBlock,
	Gradient,
	FieldView,
	TopLeft,
	TopRight,
	BottomLeft,
	BottomRight,
	MatchFound,
	Barcode,
	List,
	ButtonDiv,
	Spinner,
} from './styles'
import { Icon } from 'antd'
import { Link, useHistory } from 'react-router-dom'





const jsBarcodeConfig = state => ({
	format: state.match.format.replace("_", "").toUpperCase(),
	lineColor: "#ffffff",
	background: "#000000",
	width: 2,
	height: 40,
	displayValue: true
  })




function Scanner() {
  const [bind, state, ctl] = useScanner({})
  const barcodeRef = useRef()

  useEffect(() => {
    if(state.match) {
      JsBarcode(barcodeRef.current, state.match.code, jsBarcodeConfig(state));
    }
  },[state.match]) 

  return (
    <Container>
      <ScannerWrapper {...bind} />
      <ScannerContainer isPaused={ctl.isPaused}>
          <TopBlock>
            <Darker flexEnd={true}>
				<ButtonDiv to="/" style={{position: "absolute", top: 0, right: 0}}>
					<Icon type="close"/>
				</ButtonDiv>
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
                    {ctl.list.map((result, i) => {
                      if(result.product) {
                      return <li key={i}>{result.product.title}{" "}<span>{" "}</span>{" - "}{result.product.price}{"kr"}</li> 
                      }
                      return <li key={i}><Spinner/>{result.code}</li>
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


// const mapStateToProp = state => ({
// 	products: state.products
// })

// const mapActionsToProp = () => ({
// 	addProduct,
// 	changeProduct
// })

export default Scanner
// connect(mapStateToProp, mapActionsToProp)(Scanner);
