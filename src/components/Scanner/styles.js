import styled from 'styled-components'
import React from 'react'




export const Container = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: black;


`

export const ScannerContainer = styled.div`
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

export const ScannerWrapper = styled.div`
  /* 
  width: 640px;
  height: 480px; */
  /* width: 100%;
  height: 100%; */
  position: relative;
  overflow: hidden;

`

export const TopBlock = styled.div`
  width: 100%;
  height: 100px;

`
export const CenterBlock = styled(TopBlock)`
  display: flex;
  height: 200px;

`
export const CenterRight = styled.div`
  flex: 1;
  background: rgba(0,0,0,0.7);
`;
export const Scope = styled.div`
  flex: 5;
  background: ${props => props.isPaused ? "black" : "none"};
`;
export const CenterLeft = styled.div`
  flex: 1;
  background: rgba(0,0,0,0.7);
`;

export const Darker = styled.div`
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



export const BottomBlock = styled(TopBlock)`
  height: calc(100% - 200px - 100px);
  width: 100%;
  overflow: hidden;
`

export const Gradient = styled.div`

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

export const FieldView = styled.div`
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

export const TopLeft = styled.div`
  height: 30%;
  width: 30%;
  position: absolute;
  top: 0;
  left: 0;
  background: none;
  border-top: 3px solid ${props => props.match ? "#00FF00" : "white"};
  border-left: 3px solid ${props => props.match ? "#00FF00" : "white"};
`
export const TopRight = styled.div`
  height: 30%;
  width: 30%;
  position: absolute;
  top: 0;
  right: 0;
  background: none;
  border-top: 3px solid ${props => props.match ? "#00FF00" : "white"};
  border-right: 3px solid ${props => props.match ? "#00FF00" : "white"};

`
export const BottomLeft = styled.div`
  height: 30%;
  width: 30%;
  position: absolute;
  bottom: 0;
  background: none;
  left: 0;
  border-bottom: 3px solid ${props => props.match ? "#00FF00" : "white"};
  border-left: 3px solid ${props => props.match ? "#00FF00" : "white"};

`
export const BottomRight = styled.div`
  height: 30%;
  width: 30%;
  position: absolute;
  bottom: 0;
  right: 0;
  background: none;
  border-bottom: 3px solid ${props => props.match ? "#00FF00" : "white"};
  border-right: 3px solid ${props => props.match ? "#00FF00" : "white"};

`
export const MatchFound = styled.div`
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

export const Barcode = styled.svg`

`

export const List = styled.div`
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

export const ButtonDiv = styled.div`
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

export const Spinner = () => (
<div className="spinner">
  <div className="rect1"></div>
  <div className="rect2"></div>
  <div className="rect3"></div>
  {/* <div class="rect4"></div> */}
  {/* <div class="rect5"></div> */}
</div>
)