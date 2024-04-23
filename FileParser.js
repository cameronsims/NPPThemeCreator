// get the file that the user submitted
async function getFile(func) {
	// Promise, to make sure the function has been read
	var promise = new Promise((resolve) => setTimeout(() => resolve("1"), 1000));
	
	// Get the Element
	var elem = document.getElementById("FileSubmission");
	
	// From this element, we're going to get the file name
	var fileName = elem.files[0];
	
	// Read file
	let reader = new FileReader();
	
	// Read line by line, place in document
	reader.onload = async function() {
		// Contents of the file
		var contents = reader.result;
		
		// Read XML
		var XMLParser = new DOMParser();
		var XMLWords = XMLParser.parseFromString(contents, "text/xml");
		
		// Call a function
		func(XMLWords);
		
		return Promise.resolve("1");
	}
	
	// Read File
	await reader.readAsText(fileName);
}

async function saveFile() {
	// Get element all our opotions are in
	var elements = document.getElementById("TokenField").children;
	
	// The download link
	var link = document.createElement("a");

	// Create new XML Document
	var XMLContent = document.implementation.createDocument(null, "NotepadPlus");
		
	// Add lexer boiler plate + content
	var lexers = XMLContent.createElement("LexerStyles");
	
	// XML Vals
	const XMLWords = getFile( function(XMLWords) {
		
		// General themes
		var generals = XMLWords.getElementsByTagName("NotepadPlus")[0]
		                       .getElementsByTagName("GlobalStyles")[0]
							   .children;
								
								
		// Create, we are saving to this.
		var globals = XMLContent.createElement("GlobalStyles");					   
					
		// Elements we want to change to our own values
		const editableVals = ["Default Style"];
		const editableIDS = ["DEFAULT"];
		
		// vars we want to place
		const keepVars = ["name", "styleID"];
		const changeVars = [ "fgColor", "bgColor", "fontName", "fontSize" ];
		const cssVals = [ "color", "background-color", "font-family", "font-size" ];
		
		// The default element
		var DEFAULT;
					
		// For all values 
		for (var i = 0; i < generals.length; i++) {
			// The thing we're editing
			var e = XMLContent.createElement("WidgetStyle");
			
			// Iterate all things we want to keep
			for (var j = 0; j < keepVars.length; j++) {
				// Temp value to check 
				var temp = generals[i].getAttribute(keepVars[j]);
				// If it exists, add it.
				if (temp != null) {
					e.setAttribute(keepVars[j], temp);
				}
			}
			
			// Declare temp to test
			var temp;
			
			// Loop values we're going to change
			for (var j = 0; j < changeVars.length; j++) {
				// The name of the element
				const elementName = e.getAttribute("name");
				// If it is Default
				if (elementName == "Default Style") {
					DEFAULT = e;
				}
				
				// If the name is something that we want to check:
				if (editableVals.includes(elementName)) {
					
					
					// Find the ID 
					const ID = editableVals.indexOf(elementName);
					var elem = document.getElementById(editableIDS[ID]);
					
					// Change using hash maps
					// Temp value to check 
					temp = getStyleAttribute(elem, cssVals[j]);
					
				}
				// Otherwise
				else {
					// Temp value to check 
					temp = generals[i].getAttribute(changeVars[j]);
				}
				
				// If it exists, add it.
				if (temp != null) {
					
					// If we have a prefix, delete it
					if (temp[0] == '#' ) {
						temp = temp.substring(1, temp.length);
					}
					// If we have a suffix, also remove it
					if (temp.endsWith("px")) {
						temp = temp.substring(0, temp.length - 2);
					}
					
					e.setAttribute(changeVars[j], temp);
				}
			}
			
			// Set font style
			var temp = generals[i].getAttribute("fontStyle");
			if (temp != null) {
				e.setAttribute("fontStyle", temp);
			}
			
			globals.appendChild(e);
		}
		
		
		
		
		////////////////////////////////////////////////////////////////////////
		// 			 	    			 	    			 	              //
		// 			 	   COPY FOR ALL LANGUAGES IN Notepad++ 			 	  //
		// 			 	    			 	    			 	              //
		////////////////////////////////////////////////////////////////////////
		
		var languages = XMLWords.getElementsByTagName("NotepadPlus")[0]
		                        .getElementsByTagName("LexerStyles")[0]
								.children;
		
		// For all languages
		for (var i = 0; i < languages.length; i++) {
			// Create language
			var lang = XMLContent.createElement("LexerType");
			
			// Assign language parameters
			const langParam = ["name", "desc", "ext"];
			for (var j = 0; j < langParam.length; j++) {
				// Assign parameters
				lang.setAttribute(langParam[j], languages[i].getAttribute(langParam[j]));
			}
			
			// Print all token identifiers
			var tokens = languages[i].children;
			for (var j = 0; j < tokens.length; j++) {
				// Get element
				var element = document.getElementById(tokens[j].getAttribute("name"));
				
				var word = XMLContent.createElement("WordsStyle");
				
				// For all the values that we are keeping the same...
				const sameVals = [ "name", "styleID", "keywordClass" ];
				// Copy directly into the new file
				for (var k = 0; k < sameVals.length; k++) {
					// Create temp value to see if null
					const temp = languages[i].children[j].getAttribute(sameVals[k]);
					// If null, doesn't bother
					if (temp != null) {
						word.setAttribute(sameVals[k], temp);
					}
				}
				
				// Copy the HTML vals into the new file
				for (var k = 0; k < changeVars.length; k++) {
					// Create temp value
					var temp = getStyleAttribute(element, cssVals[k]);
					
					// If we have a prefix, delete it
					if (temp[0] == '#' ) {
						temp = temp.substring(1, temp.length);
					}
					// If we have a suffix, also remove it
					if (temp.endsWith("px")) {
						temp = temp.substring(0, temp.length - 2);
					}
					
					// If null value, set it back to what the original had
					if (temp == null) {
						//temp = languages[i].children[j].getAttribute(changeVars[k]);
					}
					
					// If the element is the same
					if (temp == DEFAULT.getAttribute(changeVars[k]) && (changeVars[k] == "fontName" || changeVars[k] == "fontSize")) {
						temp = "";
					}
					word.setAttribute(changeVars[k], temp);
				}
				
				// Get style (in integer form)
				word.setAttribute("fontStyle", getFontStyle(element));
				
				// Add language into the new document
				lang.appendChild(word);
			}
			
			lexers.appendChild(lang);
		}
		
		
		
		
		
		// Add languages
		XMLContent.getElementsByTagName("NotepadPlus")[0].appendChild(lexers);
		XMLContent.getElementsByTagName("NotepadPlus")[0].appendChild(globals);
	
		
		
		
		
		
		// THESE FUNCTIONS BELOW WERE OUTSIDE, BUT ASYNC WAS CAUSING ISSUES SO THEY'RE HERE NOW
		
		// Create file to save to
		var XMLString = new XMLSerializer().serializeToString(XMLContent);
		
		// Format the file so it looks beautiful
		XMLString = XMLString.replaceAll(">", ">\n");
		// Language Styles
		XMLString = XMLString.replaceAll("<LexerStyles",  "    <LexerStyles");
		XMLString = XMLString.replaceAll("</LexerStyles", "    </LexerStyles");
		XMLString = XMLString.replaceAll("<LexerType",    "        <LexerType");
		XMLString = XMLString.replaceAll("</LexerType",   "        </LexerType");
		XMLString = XMLString.replaceAll("<WordsStyle",   "            <WordsStyle");
		// Global Styles
		XMLString = XMLString.replaceAll("<GlobalStyles", "    <GlobalStyles");
		XMLString = XMLString.replaceAll("</GlobalStyles","    </GlobalStyles");
		XMLString = XMLString.replaceAll("<WidgetStyle",  "        <WidgetStyle");
		
		var file = new Blob(["<?xml version=\"1.0\" encoding=\"UTF-8\" ?>\n", XML_COMPILE_CREDITS, XMLString], { type: "text/xml" })
		
		// Make a link
		link.href = URL.createObjectURL(file);
		link.download = "theme.xml";
		
		// Download the file
		link.click();
		
		// Remove the link
		URL.revokeObjectURL(link.href);
	});
}