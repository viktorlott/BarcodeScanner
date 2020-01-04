
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    selectElement()

    switch(request.type) {
      case "clicked_browser_action":
        selectElement()
        break;
      case "SELECT_INPUT_ELEMENT":
        selectElement()
        break;
      case "SELECT_BUTTON_ELEMENT":
        selectButtonElement()
        break;
    }
  }
);


let selectedElement
let sstyle

let selectedButtonElement
let sbstyle

function selectElement() {
  startSelectingElement()
  function mousemove(event) {
      const { clientX, clientY } = event
      const el = document.elementFromPoint(clientX, clientY);
      
      if(selectedElement !== el) {
        if(selectedElement && sstyle) {
          selectedElement.style = sstyle
        }
      }
  
      selectedElement = el
      sstyle = el.style
  
      el.style = "background-color: #86ff0059!important; cursor: pointer;"
  }
  
  
  function mouseclick(event) {
    event.preventDefault()
    console.log("selected", selectedElement)
  
    stopSelectingElement()
  }
  
  function startSelectingElement() {
    window.addEventListener("mousemove", mousemove, false)
    window.addEventListener("click", mouseclick, false)
  }
  
  function stopSelectingElement() {
    window.removeEventListener("mousemove", mousemove, false)
    window.removeEventListener("click", mouseclick, false)
  }

}  



function selectButtonElement() {

  startSelectingElement()

  function mousemove(event) {
      const { clientX, clientY } = event
      const el = document.elementFromPoint(clientX, clientY);
      
      if(selectedButtonElement !== el) {
        if(selectedButtonElement && sbstyle) {
          selectedButtonElement.style = sbstyle
        }
      }
  
      selectedButtonElement = el
      sbstyle = el.style
  
      el.style = "background-color: #86ff0059!important; cursor: pointer;"
  }
  
  
  function mouseclick(event) {
    event.preventDefault()
    console.log("selected", selectedButtonElement)
  
    stopSelectingElement()
  }
  
  function startSelectingElement() {
    window.addEventListener("mousemove", mousemove, false)
    window.addEventListener("click", mouseclick, false)
  }
  
  function stopSelectingElement() {
    window.removeEventListener("mousemove", mousemove, false)
    window.removeEventListener("click", mouseclick, false)
  }

}  

