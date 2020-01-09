let selectedElement
let sstyle

let selectedButtonElement
let sbstyle

let path = {
  _input: null,
  _button: null,
  _url: null,
  get input() {
    return window.localStorage.getItem("_input") || this._input
  },
  set input(val) {
    this._input = val
    window.localStorage.setItem("_input", val)
  },
  get button() {
    return window.localStorage.getItem("_button") || this._button
  },
  set button(val) {
    this._button = val
    window.localStorage.setItem("_button", val)
  },
  get url() {
    return window.localStorage.getItem("_url") || this._url
  },
  set url(val) {
    this._url = val
    window.localStorage.setItem("_url", val)
  }
}



chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    // selectElement()
    console.log(request)

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

      case "SAVE_URL":
        path.url = window.location.href
        break;
      case "SEARCH_BARCODE": 
        document.querySelector(path.input).value = request.payload
        document.querySelector(path.button).click()
    }
  }
);



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
    path.input = dompath(event.target)
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
  
      el.style = "background-color: #008b8b70!important; cursor: pointer;"


  }
  
  
  function mouseclick(event) {
    event.preventDefault()
    console.log("selected", selectedButtonElement)
    stopSelectingElement()
    path.button = dompath(event.target)
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



function dompath(element) {
  let path = '',
  i, innerText, tag, selector, classes;

  for (i = 0; element && element.nodeType == 1; element = element.parentNode, i++) {
      innerText = element.childNodes.length === 0 ? element.innerHTML : '';
      tag = element.tagName.toLowerCase();
      classes = element.className;

      // Skip <html> and <body> tags
      if (tag === "html" || tag === "body")
          continue;

      if (element.id !== '') {
          // If element has an ID, use only the ID of the element
          selector = '#' + element.id;

          // To use this with jQuery, return a path once we have an ID
          // as it's no need to look for more parents afterwards.
          //return selector + ' ' + path;
      } else if (classes.length > 0) {
          // If element has classes, use the element tag with the class names appended
          selector = tag + '.' + classes.replace(/ /g , ".");
      } else {
          // If element has neither, print tag with containing text appended (if any)
          selector = tag + ((innerText.length > 0) ? ":contains('" + innerText + "')" : "");
      }

      path = ' ' + selector + path;
  }
  return path;
}