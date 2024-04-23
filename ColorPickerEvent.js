// When a new colour is input
function newColor(event) {
	// The element that was called
	var element = event.target;
	
	// Name segments
	var nameParts = element.getAttribute("id").split(".");
	
	// The parent element
	var parent = document.getElementById( nameParts[0] );
	
	// Change element
	var type = (nameParts[1] == "fgColor") ? "color" : "background-color";
					
	setStyleAttribute(parent, type, element.value);
}

// Toggle a style value
function toggleStyleValue(event, type, value, badValue) {
	// The element that was called
	var element = event.target;
	
	// Name segments
	var nameParts = element.getAttribute("id").split(".");
	
	// The parent element
	var parent = document.getElementById( nameParts[0] );
	
	// Decide what value we're switching to
	if (getStyleAttribute(parent, type) == value) {
		value = badValue;
	}
	// If there is no value
	else if (getStyleAttribute(parent, type) == null) {
		// Add it
		var style = parent.getAttribute("style");
		style += (type + ": " + value + ";");
		// Set it
		parent.setAttribute("style", style);
	}
	
	setStyleAttribute(parent, type, value);
}

// When bold is input
function toggleBold(event) {
	toggleStyleValue(event, "font-weight", "bold", "normal");
}

// When italics is input
function toggleItalics(event) {
	toggleStyleValue(event, "font-style", "italic", "normal");
}

// When italics is input
function toggleUnderline(event) {
	toggleStyleValue(event, "text-decoration", "underline", "none");
}

// When italics is input
function changeFontFamily(event) {
	// The element that was called
	var element = event.target;
	
	// Name segments
	var nameParts = element.getAttribute("id").split(".");
	
	// The parent element
	var parent = document.getElementById( nameParts[0] );
	
	var fontFamily = element.value;
	
	setStyleAttribute(parent, "font-family", element.value);
}

// When italics is input
function changeFontSize(event) {
	// The element that was called
	var element = event.target;
	
	// Name segments
	var nameParts = element.getAttribute("id").split(".");
	
	// The parent element
	var parent = document.getElementById( nameParts[0] );
	
	var fontSize = element.value;
	
	setStyleAttribute(parent, "font-size", element.value + "px");
}