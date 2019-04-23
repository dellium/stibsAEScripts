﻿{if (proj instanceof Project)
	// Sort Layers by In Point.jsx
	//
	// This script reorders layers in the active comp, sorted by inPoint.
	//
	
	function indexCompare(layerObject, anotherLayerObject){
			return layerObject.index - anotherLayerObject.index;
		}
	
	
	function reverseOrderOfSelected(thisObj)
	{
		var proj = app.project;
		var scriptName = "Sort Layers by In Point";
		
		
		function reverseOrder(thelayers) {
		var total_number = thelayers.length;
		thelayers.sort(indexCompare);		
		for (var i=0; i<total_number-1; i++){
			thelayers[i].moveAfter(thelayers[total_number-1]);
			}
		}
		// change this to true if you want to leave locked layers untouched.
		var unlockedOnly = false;
		if (proj) {
			var theLayers = app.project.activeItem.selectedLayers;
			if (theLayers != null) {
				app.beginUndoGroup(scriptName);
				reverseOrder(theLayers, unlockedOnly);
				app.endUndoGroup();
			} else {
				alert("Please select some layers to use this script", scriptName);
			}
		} else {
			alert("Please open a project first to use this script.", scriptName);
		}
	}
	
	
	reverseOrderOfSelected(this);
}