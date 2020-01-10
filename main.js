var headingsInContents = {
	/* "h1":1, */ 
	"h2":2,
	"h3":3,
	"h4":4
}


var sectionsID_and_resourceFiles = [
	["dingo.turtle", "DINGO-OWL.ttl"],
	["dingo.shex", "DINGO.shex"],
	["ontology_detailed_section", "fullOntologySection.html"]
];



window.onload = main;

function main() {
	recursive_getSectionHTML(0, sectionsID_and_resourceFiles.length, makeTableContents, sectionsID_and_resourceFiles)
}

function recursive_getSectionHTML(i=0, times, after_loop_function, sectionsID_and_resources) {
	if(i > times-1) {
		after_loop_function();
		return true;
	}
	var section = sectionsID_and_resources[i]
	var htmlSectionID = sectionsID_and_resources[i][0]
	
	var htmlSection = document.getElementById(htmlSectionID);
	
	var httpRequest = new XMLHttpRequest();
	
	if (!httpRequest) {
          alert('Giving up :( Cannot create an XMLHTTP instance');
          return false;
	}
	
	httpRequest.open('GET', sectionsID_and_resources[i][1]);
	httpRequest.onreadystatechange = setSectionHtml;
	httpRequest.send();
	
	function setSectionHtml() {
		if (httpRequest.readyState === XMLHttpRequest.DONE) {
			/* Status is 0 for local file mode (i.e., file://). */
			if (httpRequest.status === 200 || httpRequest.status === 0) {
			    //Set the contents
				 if(htmlSectionID==="dingo.turtle" || htmlSectionID==="dingo.shex") {
					htmlSection.textContent = httpRequest.responseText;
				 }
				 else {
					htmlSection.innerHTML = httpRequest.responseText;
				 }
				 recursive_getSectionHTML(i+1, times, after_loop_function, sectionsID_and_resources);
		   } else {
			alert('There was a problem with the request.');
		   }
		}		
	}
}
	
function getHeadings(root, headings) {
	
    if( root.nodeType === 1 && root.nodeName !== 'script' ) {
        if( headingsInContents.hasOwnProperty(root.nodeName.toLowerCase()) ) {
            headings.push( root );
        } else {
            for( var i = 0; i < root.childNodes.length; i++ ) {
                getHeadings( root.childNodes[i], headings );
            }
        }
    }
	return headings
}

function getTableContents(headings) {
	var tableOfContents = document.createElement("ol");
	var currentList = tableOfContents;
	var parentLevel = 2;
	for( var i = 0; i < headings.length; i++ ) {
		var nowLevel = headingsInContents[headings[i].nodeName.toLowerCase()];
        var diffLevel = nowLevel-parentLevel;
		currentList = climbBy(currentList, diffLevel);
		parentLevel = nowLevel;
		var listElement = document.createElement("li");
			
		var referenceElement = document.createElement("a");
		referenceElement.href = "#"+headings[i].id;

		referenceElement.textContent = headings[i].textContent;
		listElement.appendChild(referenceElement);

		currentList.appendChild(listElement);
	}
	return tableOfContents;
}

function climbBy(headingsLevelList, n) {
	var currentList = headingsLevelList;	
	if(n>0) {
		
		for(var i =0; i < n; i++) {
			var lastChildCurrent = currentList.lastChild;

			if(lastChildCurrent === null) {
				currentList = currentList.appendChild(document.createElement("li")).appendChild(document.createElement("ol"));
			}
			else {
				currentList = lastChildCurrent.appendChild(document.createElement("ol"));
			}
		}
	}
	else if(n<0) {

		for(var i =0; i < -n; i++) {
			currentList = currentList.parentNode.parentNode;
		}
	}
	return currentList

}



function makeTableContents() {
	
	
	var sidebarContents = document.createElement("div");
	sidebarContents.id = "sidebar";
	var titleContentsTable = document.createElement("h1");
	titleContentsTable.id = "Table.of.contents";
	titleContentsTable.textContent = "Table of contents";
	sidebarContents.appendChild(titleContentsTable);
	var headings = getHeadings(document.body, []);
	sidebarContents.appendChild(getTableContents(headings));

	document.body.appendChild(sidebarContents);
}





