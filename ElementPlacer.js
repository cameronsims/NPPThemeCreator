// Get a value in a style string
function getStyleAttribute(element, variable) {
	// Get pre-established Style
	var style = element.getAttribute("style");
	
	if (style == null || !style.includes(variable)) {
		return null;
	}
	
	// get the old value
	const index = style.indexOf(variable + ": ") + variable.length + 2;
	const end = style.indexOf(";", index);
	const val = style.substring( index, end );
	
	return val;
}

// Get a value in a style string
function setStyleAttribute(element, variable, value) {
	// Get pre-established Style
	var style = element.getAttribute("style");
	
	if (!style.includes(variable) || style == null) {
		return null;
	}
	
	// get the old value
	const index = style.indexOf(variable + ": ") + variable.length + 2;
	const end = style.indexOf(";", index);
	
	const pretext = style.substring( 0, index);
	const posttext = style.substring( end, style.length);
	
	element.setAttribute("style", pretext + value + posttext);
}

function getFontStyle(element) {
	// Apply style changes
	var cssVals = ["font-weight", "font-style", "text-decoration"];
	// If we are adding, these must be the values held
	const cssTrueVals = ["bold", "italic", "underline"];
	// The style number
	var style = 0;
	// For all style posibilities
	for (var k = 0; k < cssVals.length; k++) {
		// If it's the value we're expecting
		if (getStyleAttribute(element, cssVals[k]) == cssTrueVals[k]) {
			// Ranges from 0 (None) - 7 (Bold/Italic/Underlined)
			style = style + (k+1);
		}
	}
	
	return style;
}


// Get every unique Token
function getUniqueTokens(xml) {
	// for specific languages
	var lexers = xml.getElementsByTagName("NotepadPlus")[0]
	                .getElementsByTagName("LexerStyles")[0]
					.children;
	
	var uniqueElements = [];
	var uniqueNames = [];
	
	// For all languages
	for (var i = 0; i < lexers.length; i++) {
		
		// The language we're on
		let lang = lexers[i];
		
		// For all the children
		for (var j = 0; j < lang.children.length; j++) {
			
			// Current child of elements
			let child = lang.children[j];
			let childName = child.getAttribute("name");
			
			// If element isn't in the array
			if (!uniqueNames.includes(childName)) {
				// Then add the name
				uniqueElements.push(child);
				uniqueNames.push(childName);
			}
			
		}
	}
	// Return all
	return uniqueElements;
}

// Get default
function getDefaultStyle(xml) {
	// Return all
	var elements = xml.getElementsByTagName("NotepadPlus")[0]
	                  .getElementsByTagName("GlobalStyles")[0].children;
	
	// Loop until we find it
	for (var i = 0; i < elements.length; i++) {
		if (elements[i].getAttribute("name") == "Default Style") {
			return elements[i];
		}
	}			  
			
	// Return null
	return null;
}

// For the file
function placeElements(xml) {
	// Unique elements
	var uniqueElements = getUniqueTokens(xml);
	
	// Get value of default style
	var DEFAULT = getDefaultStyle(xml);
	
	// Global Styles
	const global = xml.getElementsByTagName("NotepadPlus")[0]
	                  .getElementsByTagName("GlobalStyles")[0]
					  .children[1];
	
	// Element we are adding to
	var elem = document.getElementById("TokenField");
	
	// For each, make a new elements
	for (var i = 0; i < uniqueElements.length; i++) {
		// New element
		var row = document.createElement("tr");
		var e = document.createElement("td");
		
		// Add the name of the element
		e.setAttribute("id", uniqueElements[i].getAttribute("name"));
		e.innerHTML = uniqueElements[i].getAttribute("name");
		e.setAttribute("class", "token");
		
		// Make CSS, added later lines //////////////////////////////////////////////////////////////
		var style = "";
		
		// Elements of importance
		const importantNames = ["fgColor", "bgColor", "fontName", "fontSize"];
		const cssNames = ["color", "background-color", "font-family", "font-size"];
		const prefix = ['#', '#', '', '']
		const postfix = ['', '', '', "px"]
		
		// For all memebers of importance
		for (var j = 0; j < importantNames.length; j++) {
			// Create temporary value to check
			var temp = uniqueElements[i].getAttribute(importantNames[j]);
			// If invalid
			if (temp == "") {
				// Set to global default
				temp = global.getAttribute(importantNames[j]);
			}
			// Then add this to the style
			style += `${cssNames[j]}: ${prefix[j]}${temp}${postfix[j]};`;
		}
		
		// Decide the decoration for the text (Bold/Italic/Underline)
		switch (uniqueElements[i].getAttribute("fontStyle")) {
		  // If bold
		  case "1":
			style += "font-weight: bold; ";
			break;
		
		  // If italic
		  case "2":
			style += "font-style: italic; ";
			break;
		
		  // If bold and italic
		  case "3":
			style += "font-style: italic; ";
			style += "font-weight: bold; ";
			break;
		
		  // If underline
		  case "4":
			style += "text-decoration: underline; ";
			break;
		
		  // If underline and bold
		  case "5":
			style += "font-weight: bold; ";
			style += "text-decoration: underline; ";
			break;
		
		  // If underline and italic
		  case "6":
			style += "font-style: italic; ";
			style += "text-decoration: underline; ";
			break;
		
		  // If ALL
		  case "7":
			style += "font-weight: bold; ";
			style += "font-style: italic; ";
			style += "text-decoration: underline; ";
			break;
		}
		
		
		
		// Add stylisation to the element
		e.setAttribute("style", style);
		
		/////////////////////////////////////////////////////////////////////////////////////////////
		
		// Add new rows 
		const names = ["fgColor", "bgColor", "bold", "italics", "underline"];
		const types = ["color", "color", "checkbox", "checkbox", "checkbox"];
		const funcs = [newColor, newColor, toggleBold, toggleItalics, toggleUnderline ];
		
		// Create a two colour pickers, one for the background and one for the foreground
		for (var j = 0; j < names.length; j++) {
			
			// Create new cell
			var cell = document.createElement("td");
			cell.setAttribute("class", names[i]);
			
			// Create box
			var input = document.createElement("input");
			input.setAttribute("id", uniqueElements[i].getAttribute("name") + "." + names[j]);
			input.setAttribute("type", types[j]);
			
			// Track changes
			input.addEventListener("input", funcs[j], false);
			
			// If we are inputting a colour box
			if (types[j] == "color") {
				input.setAttribute("value", '#' + uniqueElements[i].getAttribute(names[j]));
				input.addEventListener("change", funcs[j], false);
			}
			// If we are inputting a tick box
			if (types[j] == "checkbox" && i > 2) {
				// Get relative position
				const rel = i - 3;
				// Get value of an element
				var value = uniqueElements[i].getAttribute("fontStyle");
				
				
				// If we are testing for bold
				if (j == 2 && (value  == 1 || value == 3 || value == 5 || value == 7)) {
					// If it is, then we will tick the box
					input.setAttribute("checked", true);
				}
				
				// If we are testing for italics
				if (j == 3 && (value  == 2 || value == 3 || value == 6 || value == 7)) {
					// If it is, then we will tick the box
					input.setAttribute("checked", true);
				}
				
				// If we are testing for underline
				if (j == 4 && (value  == 4 || value == 5 || value == 6 || value == 7)) {
					// If it is, then we will tick the box
					input.setAttribute("checked", true);
				}
			}
			
			// Add value
			cell.appendChild(input);
			row.appendChild(cell);
		}
		
		
		
		/////// CREATE TEXT BETWEEN TWO FIELDS //////////////////////////////////////////////////////
		
		// Create text / Styling
		row.appendChild(e);
		
		/////////////////////////////////////////////////////////////////////////////////////////////
		
		
		
		
		
		// Font stuff
		const fontFields = ["fontName", "fontSize"];
		const fontCSS = ["font-family", "font-size"];
		const fontLambda = [changeFontFamily, changeFontSize]
		
		// Create a field for both of these
		for (var j = 0; j < fontFields.length; j++) {
			
			// Create new cell
			var cell = document.createElement("td");
			cell.setAttribute("class", fontFields[j]);
			
			// Create inputs
			var input = document.createElement("input");
			input.setAttribute("id", uniqueElements[i].getAttribute("name") + "." + fontFields[j]);
			
			// Set default parameters
			var value = uniqueElements[i].getAttribute(fontFields[j]);
			
			// If value is nothing, assume default
			if (value == null || value == undefined || value == "") {
				// Get the value it was in Default
				value = DEFAULT.getAttribute(fontFields[j]);
			}
			
			// Set default
			input.setAttribute("value", value);
			
			input.addEventListener("input", fontLambda[i], false);
			input.addEventListener("change", fontLambda[i], false);
			
			cell.appendChild(input);
			row.appendChild(cell);
		}
		
		// Add element to parent element
		elem.appendChild(row);
	}
}

// Function remove all children of NPP
function removeAllNPPElements() {
	// GET ALL CHILDREN
	var children = document.getElementsByClassName("token");
	// KILL ALL CHILDREN
	for (var i = 0; i < children.length; i++) {
		// KILL THE child
		children[i].remove();
	}
}

function replaceNPPElements() {
	// Remove all elements
	removeAllNPPElements();
	
	// Check if element has any values
	var fileSub = document.getElementById("FileSubmission");
	
	// Set error to not shown
	setStyleAttribute(document.getElementById("ErrorLocation"), "display", "none");
	
	// Check if it has any values
	if (fileSub.length < 1 || fileSub.files[0] == undefined) {
		// Then give some error
		noFileDetected();
	}
	
	// Then replace them
	getFile(placeElements);
}

// Tell user of no files
function noFileDetected() {
	// Change to exist
	var element = document.getElementById("ErrorLocation");
	// Get the style element
	setStyleAttribute(element, "display", "inline");
}