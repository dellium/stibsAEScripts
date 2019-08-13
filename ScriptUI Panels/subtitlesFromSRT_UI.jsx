﻿// @target AfterEffects
//JSON - from: https://github.com/douglascrockford/JSON-js

if(typeof JSON !=='object'){JSON={};}(function(){'use strict';function f(n){return n<10?'0'+n:n;}function this_value(){return this.valueOf();}if(typeof Date.prototype.toJSON!=='function'){Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+'-'+f(this.getUTCMonth()+1)+'-'+f(this.getUTCDate())+'T'+f(this.getUTCHours())+':'+f(this.getUTCMinutes())+':'+f(this.getUTCSeconds())+'Z':null;};Boolean.prototype.toJSON=this_value;Number.prototype.toJSON=this_value;String.prototype.toJSON=this_value;}var cx,escapable,gap,indent,meta,rep;function quote(string){escapable.lastIndex=0;return escapable.test(string)?'"'+string.replace(escapable,function(a){var c=meta[a];return typeof c==='string'?c:'\\u'+('0000'+a.charCodeAt(0).toString(16)).slice(-4);})+'"':'"'+string+'"';}function str(key,holder){var i,k,v,length,mind=gap,partial,value=holder[key];if(value&&typeof value==='object'&&typeof value.toJSON==='function'){value=value.toJSON(key);}if(typeof rep==='function'){value=rep.call(holder,key,value);}switch(typeof value){case'string':return quote(value);case'number':return isFinite(value)?String(value):'null';case'boolean':case'null':return String(value);case'object':if(!value){return'null';}gap+=indent;partial=[];if(Object.prototype.toString.apply(value)==='[object Array]'){length=value.length;for(i=0;i<length;i+=1){partial[i]=str(i,value)||'null';}v=partial.length===0?'[]':gap?'[\n'+gap+partial.join(',\n'+gap)+'\n'+mind+']':'['+partial.join(',\n')+']';gap=mind;return v;}if(rep&&typeof rep==='object'){length=rep.length;for(i=0;i<length;i+=1){if(typeof rep[i]==='string'){k=rep[i];v=str(k,value);if(v){partial.push(quote(k)+(gap?': ':':')+v);}}}}else{for(k in value){if(Object.prototype.hasOwnProperty.call(value,k)){v=str(k,value);if(v){partial.push(quote(k)+(gap?': ':':')+v);}}}}v=partial.length===0?'{}':gap?'{\n'+gap+partial.join(',\n'+gap)+'\n'+mind+'}':'{'+partial.join(',\n')+'}';gap=mind;return v;}}if(typeof JSON.stringify!=='function'){escapable=/[\\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;meta={'\b':'\\b','\t':'\\t','\n':'\\n','\f':'\\f','\r':'\\r','"':'\\"','\\':'\\\\'};JSON.stringify=function(value,replacer,space){var i;gap='';indent='';if(typeof space==='number'){for(i=0;i<space;i+=1){indent+=' ';}}else if(typeof space==='string'){indent=space;}rep=replacer;if(replacer&&typeof replacer!=='function'&&(typeof replacer!=='object'||typeof replacer.length!=='number')){throw new Error('JSON.stringify');}return str('',{'':value});};}if(typeof JSON.parse!=='function'){cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;JSON.parse=function(text,reviver){var j;function walk(holder,key){var k,v,value=holder[key];if(value&&typeof value==='object'){for(k in value){if(Object.prototype.hasOwnProperty.call(value,k)){v=walk(value,k);if(v!==undefined){value[k]=v;}else{delete value[k];}}}}return reviver.call(holder,key,value);}text=String(text);cx.lastIndex=0;if(cx.test(text)){text=text.replace(cx,function(a){return'\\u'+('0000'+a.charCodeAt(0).toString(16)).slice(-4);});}if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,'@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,']').replace(/(?:^|:|,)(?:\s*\[)+/g,''))){j=eval('('+text+')');return typeof reviver==='function'?walk({'':j},''):j;}throw new SyntaxError('JSON.parse');};}}());

function parseSRTFile(srtFile){
    var subtitleInfo  = {
        fileName: srtFile.toString().replace(/.srt$/i, ""),
        name: srtFile.displayName.replace(/.srt$/i, ""),
        firstSubtitle: null,
        lastSubtitle: 0,
        subtitles: []
    }
    srtFile.open("r");
    while (! srtFile.eof){
        var srtLine = srtFile.readln();
        // timecodes in SRT files look like:
        // 00:00:10,700 --> 00:00:13,460
        if (srtLine.match(/^[0-9]{2}:[0-9]{2}:[0-9]{2},[0-9]{3}\s-->\s[0-9]{2}:[0-9]{2}:[0-9]{2},[0-9]{3}$/)){
            // start a new subtitle once we find the timecode
            var newSub = {};
            hmsi = srtLine.match(/^([0-9]{2}):([0-9]{2}):([0-9]{2}),([0-9]{3})\s-->/);
            var inPt = parseInt(hmsi[1]*3600) + parseInt(hmsi[2]*60) + parseInt(hmsi[3]) + parseInt(hmsi[4])/1000;
            newSub.inPoint = inPt;
            if (subtitleInfo.firstSubtitle === null){subtitleInfo.firstSubtitle = inPt}
            hmsi = srtLine.match(/-->\s([0-9]{2}):([0-9]{2}):([0-9]{2}),([0-9]{3})$/);
            var outPt = parseInt(hmsi[1]*3600) + parseInt(hmsi[2]*60) + parseInt(hmsi[3]) + parseInt(hmsi[4])/1000;
            newSub.outPoint = outPt;
            if (outPt > subtitleInfo.lastSubtitle){subtitleInfo.lastSubtitle = outPt} 
            if (! srtFile.eof){
                // next comes the text payload. It is sometimes blank
                textPayload = srtFile.readln();
                if (textPayload){
                    if (! srtFile.eof){
                        // there can be more than one line of text
                        // this loop will finish when it hits a blank line
                        nextLine = srtFile.readln();
                        while (nextLine){
                            textPayload += "\n" + nextLine;
                            if (! srtFile.eof){
                                nextLine = srtFile.readln()
                            } else {
                                nextLine = false
                            };
                        }
                    }
                    
                }
                newSub.textPayload = textPayload;
            }
            subtitleInfo.subtitles.push(newSub);
        } 
    }
    srtFile.close();
    return subtitleInfo
}

function writeJSONFile(subtitleInfo){
    var theJSON = JSON.stringify(subtitleInfo.subtitles);
    jsonFile = File(subtitleInfo.fileName + ".json");
    theJSON = theJSON.replace(/"},{"/g, '"},\n{"'); // just to prettify it
    jsonFile.open("w");
    jsonFile.write(theJSON);
    jsonFile.close();
    return jsonFile;
}

function makeSubtitlesComp(compSettings, subtitleInfo){
    var subtitles = subtitleInfo.subtitles;
    var duration = (subtitleInfo.lastSubtitle)? subtitleInfo.lastSubtitle: 10;
    var compName = (subtitleInfo.name)? subtitleInfo.name: "subtitles";
    // var sideMargin = (compSettings.sideMargins)? compSettings.sideMargins: 20; // percentage
    //     var font = (compSettings.font)? compSettings.font: "Source Sans Pro";
    var fontSize = (compSettings.fontSize)? compSettings.fontSize: 50 * width/1920;
    var hPos = (compSettings.hPos)? compSettings.hPos: width/2;
    var vPos = (compSettings.vPos)? compSettings.vPos: height - fontSize * 2.75;
    var dropShadow = (compSettings.dropShadow)? compSettings.dropShadow: false;
    var method = (compSettings.method)? compSettings.method: 0;

    // create a new comp
    if( !(compSettings.width && compSettings.height)){
        // using custom comp settings
        app.executeCommand(app.findMenuCommandId("New Composition..."));
        var subtitlesComp = app.project.activeItem;
    } else {
        var subtitlesComp = app.project.items.addComp(compName, compSettings.width, compSettings.height, 1.0, duration, compSettings.frameRate);
    }
    
    if (method === 2){
        // create layers
        for (var i = 0; i < subtitles.length; i++){
            var subtitlesLayer = subtitlesComp.layers.addText(subtitles[i].textPayload);
            // subtitlesText.font = font;
            var subtitlesText = subtitlesLayer.property("Source Text").value;
            subtitlesText.fontSize = fontSize;
            subtitlesText.justification = ParagraphJustification.CENTER_JUSTIFY;
            subtitlesLayer.position.setValue([hPos, vPos]);
            subtitlesLayer.inPoint = subtitles[i].inPoint;
            subtitlesLayer.outPoint = subtitles[i].outPoint;
            if (dropShadow){
                addDropShadow(subtitlesLayer, dropShadow);
            }
        }
    } else {
        //next two methods use a single layer, so create it now
        var subtitlesLayer = subtitlesComp.layers.addText("Subtitles");
        subtitlesLayer.name = "Subtitles";
        var subtitlesTextProp = subtitlesLayer.property("Source Text");
        subtitlesText = subtitlesTextProp.value;
        // subtitlesText.font = font;
        subtitlesText.fontSize = fontSize;
        subtitlesText.justification = ParagraphJustification.CENTER_JUSTIFY;
        subtitlesTextProp.setValue(subtitlesText);
        subtitlesLayer.position.setValue([hPos, vPos]);
        // subtitlesLayer.position.expression = 'transform.position - [0, sourceRectAtTime().height]'; // anchors the text at the bottom
        if (dropShadow){
            addDropShadow(subtitlesLayer, dropShadow);
        }
    if (method === 1){
        // use expression
        fileName = subtitleInfo.name + ".json";
        jsonFile = writeJSONFile(subtitleInfo)
        app.project.importFile(new ImportOptions(jsonFile));
        subtitlesLayer.text.sourceText.expression = 'var subtitles = footage("' + jsonFile.displayName + '").sourceData;\nvar i= 0;\nwhile (i < subtitles.length ){\n	if (time > subtitles[i].inPoint && time < subtitles[i].outPoint ){ \n        subtitles[i].textPayload;\n        break;\n    } else {\n        i++;\n        "";\n    }\n}';
    } else {
        // use keyframes
            subtitlesLayer.text.sourceText.setValueAtTime(0, "")
            for (var i = 0; i < subtitles.length; i++){
                subtitlesTextProp.setValueAtTime(subtitles[i].inPoint, subtitles[i].textPayload);
                subtitlesTextProp.setValueAtTime(subtitles[i].outPoint, "");
            }
        // subtitlesComp.motionGraphicsTemplateName = compName;
        // subtitlesComp.openInEssentialGraphics();
        }
    }

    subtitlesComp.openInViewer();
    // subtitlesLayer.position.addToMotionGraphicsTemplate(subtitlesComp);
    return subtitlesComp;
}


function addDropShadow(theLayer, dropShadow){
    var dropShadowEffect = (theLayer.effect("Drop Shadow"))?
        theLayer.effect("Drop Shadow")
        :theLayer.property("ADBE Effect Parade").addProperty("ADBE Drop Shadow");
    
    dropShadowEffect.enabled = (dropShadow !== null);
    dropShadowEffect.property("Opacity").setValue(dropShadow.opacity * 2.55); //opacity seems to be 0-255, although the display is in percent
    dropShadowEffect.property("Softness").setValue(dropShadow.softness);
    dropShadowEffect.property("Distance").setValue(dropShadow.distance);
}
// var compSettings = {"compName": null, "width": null, "height": null, "pixelAspect": null, "frameRate": null, "font": null, "fontSize": null, "hPos": null, "vPos": null, "dropShadow": null, "useExpressions": null};
// var srtFile = File.openDialog (prompt= "Choose an srt file", filter = "*.srt", multiSelect = false);
// subtitlesComp = makeSubtitlesComp({"dropShadow":{"opacity":50, "softness": 25, "distance": 0}}, srtFile);
// // subtitlesComp.exportAsMotionGraphicsTemplate(true);
// subtitlesComp.openInViewer();

function chooseSrtFile(){
    return File.openDialog (prompt= "Choose an srt file", filter = "*.srt", multiSelect = false);
}



buildGUI(this);

function buildGUI(thisObj) {
  if (thisObj instanceof Panel) {
    pal = thisObj;
  } else {
    pal = new Window('palette', "Subtitles From SRT");
  }

  if (pal !== null) {
    var methodList = [
        "Keyframes - 1 layer",
        "Expression - 1 layer",
        "Multiple Layers"
    ];
    var compList = [ 
        "16:9 landscape 1920 x 1080",
        "9:16 portrait 1080 x 1920",
        "5:4 portrait 1080 x 1350",
        "5:4 portrait 864 x 1080",
        "1:1 square 1080 x 1080",
        "-",
        "Other.."];
    var compsizes = [
        {width: 1920, height: 1080, fontSize: 64},
        {width: 1080, height: 1920, fontSize: 54},
        {width: 1080, height: 1350, fontSize: 54},
        {width: 864, height: 1080, fontSize: 48},
        {width: 1080, height: 1080, fontSize: 54},
        {width: null, height: null}
        ]
    var btn_Grp = pal.add('group{orientation: "column"}');
    var newCompSettings_Panel = btn_Grp.add('panel{orientation: "column", text: "New Comp Settings"}', undefined );
    var srt_Panel =  newCompSettings_Panel.add('panel{orientation: "column", text: ".srt file"}', undefined );
    var srtFile_ST = srt_Panel.add('staticText',[undefined, undefined, 154, 12], "no file chosen");
    var chooseSRT_Btn = srt_Panel.add('button{text: "Choose"}', [undefined, undefined, 154, 25] );
    var methd_Panel =  newCompSettings_Panel.add('panel{orientation: "column", text: "subtitle format"}', undefined);
    // var method_DD = methd_Panel.add('staticText', undefined, "subtitle format");
    var method_DD = methd_Panel.add('dropDownList', [undefined, undefined, 154, undefined], methodList);
    method_DD.selection = 0;
    // var useMGTemplate_Chkbx = methd_Panel.add('Checkbox', [undefined, undefined, 170, 16], 'Motion Graphics Template');

    var comp_Panel =  newCompSettings_Panel.add('panel{orientation: "column", text: "comp settings"}', undefined);
    var compSize_DD = comp_Panel.add('dropDownList', [undefined, undefined, 154, undefined], compList, {selection: 1});

    var frameRate_Grp = comp_Panel.add('group{orientation: "row"}');
    var frameRate_ST = frameRate_Grp.add('staticText', undefined, "frames per second");
    var frameRate_ET = frameRate_Grp.add('editText', [undefined, undefined, 48, 20], "25");
    var doTheThings_Btn =  newCompSettings_Panel.add('button{enabled: false, text: "Make Subtitles"}', [undefined, undefined, 186, 25]);
    
    var fontOpts_Panel = btn_Grp.add('panel' ,undefined, "text properties");
    var fontSizeText_Grp = fontOpts_Panel.add('group{orientation: "row"}');
    var fontSize_ST = fontSizeText_Grp.add('staticText', [undefined, undefined, 146, 20], 'Font Size');
    var fontSize_ET = fontSizeText_Grp.add('editText', [undefined, undefined, 26, 20], '64');
    var fontSize_Slider = fontOpts_Panel.add('slider',[undefined, undefined, 186, 12], 64, 0, 128);
    var xPosText_Grp = fontOpts_Panel.add('group{orientation: "row"}');
    var xPos_ST = xPosText_Grp.add('staticText', [undefined, undefined, 146, 20], 'X pos (% of comp)');
    var xPos_ET = xPosText_Grp.add('editText', [undefined, undefined, 26, 20], '50');
    var xPos_Slider = fontOpts_Panel.add('slider',[undefined, undefined, 186, 12], 50, 0, 100);
    var yPosText_Grp = fontOpts_Panel.add('group{orientation: "row"}');
    var yPos_ST = yPosText_Grp.add('staticText', [undefined, undefined, 146, 20], 'Y pos (% of comp)');
    var yPos_ET = yPosText_Grp.add('editText', [undefined, undefined, 26, 20], '85');
    var yPos_Slider = fontOpts_Panel.add('slider',[undefined, undefined, 186, 12], 85, 0, 100);

    var dropshadow_Panel = btn_Grp.add('panel{orientation: "column", text: "Drop Shadow"}', undefined);
    var doDropShadow_Chkbx = dropshadow_Panel.add('Checkbox', [undefined, undefined, 186, 16], 'Add drop shadow');
    var dropShadowOpacity_ST = dropshadow_Panel.add('staticText', [undefined, undefined, 186, 12], 'Drop shadow opacity')
    var dropShadowOpacity_Slider = dropshadow_Panel.add('slider',[undefined, undefined, 186, 12], 60, 0, 100);
    var dropShadowSoftness_ST = dropshadow_Panel.add('staticText', [undefined, undefined, 186, 12], 'Drop shadow softness')
    var dropShadowSoftness_Slider = dropshadow_Panel.add('slider', [undefined, undefined, 186, 12], 30, 0, 100);
    var dropShadowDistance_ST = dropshadow_Panel.add('staticText', [undefined, undefined, 186, 12], 'Drop shadow distance')
    var dropShadowDistance_Slider = dropshadow_Panel.add('slider', [undefined, undefined, 186, 12], 0, 0, 20);
    
    thisObj.srtFile = null;
    chooseSRT_Btn.onClick = function(){
        var fileChoice = chooseSrtFile();
        // only set the value if user makes a selection
        if (fileChoice) thisObj.srtFile = fileChoice; 
        if (thisObj.srtFile !== null){
            thisObj.subtitleInfo = parseSRTFile(thisObj.srtFile);
            srtFile_ST.text = thisObj.subtitleInfo.name + ".srt";
            doTheThings_Btn.enabled = true;
        } else {
            srtFile_ST.value = "No file chosen";
            doTheThings_Btn.enabled = false;
        }
    }

    compSize_DD.selection = 0; 
    // TODO add scaling for fontsizes based on comp template
    compSize_DD.onChange = function(){
        // multiply fontsize by relative comp width
        var newCompWidth = compsizes[compSize_DD.selection.index].width;
        if (newCompWidth){fontSize_ET.text = fontSize_Slider.value = compsizes[compSize_DD.selection.index].fontSize}
    }


    doTheThings_Btn.onClick = function(){
        
        var whichComp = compSize_DD.selection.index;
        var compSettings = {
            name: thisObj.subtitleInfo.name, 
            width: compsizes[whichComp].width, 
            height: compsizes[whichComp].height, 
            frameRate: parseFloat(frameRate_ET.text), 
            // sideMargins: , 
            // font: , 
            fontSize: Math.round(fontSize_Slider.value),
            hPos: xPos_Slider.value / 100 * compsizes[whichComp].width, 
            vPos: yPos_Slider.value / 100 * compsizes[whichComp].height,
            dropShadow: (doDropShadow_Chkbx.value)? {
                opacity: dropShadowOpacity_Slider.value,
                softness: dropShadowSoftness_Slider.value,
                distance: dropShadowDistance_Slider.value}
                : false,
            method: method_DD.selection.index//,
            // makeMGTemplate: useMGTemplate_Chkbx.value
        }
        thisObj.theComp = makeSubtitlesComp(compSettings, thisObj.subtitleInfo);
    }

    frameRate_ET.oldVal = 25;
    frameRate_ET.onChange = function(){
        var fr = parseFloat(frameRate_ET.text);
        if (fr){
            frameRate_ET.text = fr;
            frameRate_ET.oldVal = fr;
        } else {
            alert ('number required');
            frameRate_ET.text = frameRate_ET.oldVal;
        }
    }
    // useMGTemplate_Chkbx.oldVal = useMGTemplate_Chkbx.value;
    // method_DD.onChange = function(){
    //     if (method_DD.selection.index != 2){
    //         useMGTemplate_Chkbx.value = useMGTemplate_Chkbx.oldVal;
    //         useMGTemplate_Chkbx.enabled = true;
    //     } else {
    //         useMGTemplate_Chkbx.oldVal = useMGTemplate_Chkbx.value;
    //         useMGTemplate_Chkbx.enabled = false;
    //         useMGTemplate_Chkbx.value = false;
    //     }
    // }
    doDropShadow_Chkbx.value = true;
    doDropShadow_Chkbx.onClick = function(){
        if (doDropShadow_Chkbx.value){
            dropShadowOpacity_Slider.enabled = true;
            dropShadowSoftness_Slider.enabled = true;
            dropShadowDistance_Slider.enabled = true;
            
        } else {
            dropShadowOpacity_Slider.enabled = false;
            dropShadowSoftness_Slider.enabled = false;
            dropShadowDistance_Slider.enabled = false;
        }
        updateDropShad(doDropShadow_Chkbx.value);
    }

    dropShadowOpacity_Slider.onChange = 
    dropShadowSoftness_Slider.onChange = 
    dropShadowDistance_Slider.onChange = 
        function(){
            updateDropShad(doDropShadow_Chkbx.value);
        };
    
    function updateDropShad(shadowOn){
        // check to see if we've built a comp
        
        if (thisObj.theComp && app.project.activeItem == thisObj.theComp){
            var theCompLayers = false;
            theCompLayers = thisObj.theComp.layers;
            if (theCompLayers){
                for (var i = 1; i <= theCompLayers.length; i++){
                    if (shadowOn){
                        var dropShadowEffect = (theCompLayers[i].effect("Drop Shadow"))?
                            theCompLayers[i].effect("Drop Shadow")
                            :theCompLayers[i].property("ADBE Effect Parade").addProperty("ADBE Drop Shadow");
                        
                        dropShadowEffect.enabled = true;
                        dropShadowEffect.property("Opacity").setValue(dropShadowOpacity_Slider.value * 2.55); //opacity seems to be 0-255, although the display is in percent
                        dropShadowEffect.property("Softness").setValue(dropShadowSoftness_Slider.value);
                        dropShadowEffect.property("Distance").setValue(dropShadowDistance_Slider.value);
                    } else {
                        var dropShadow = theCompLayers[i].effect("Drop Shadow");
                        if (dropShadow){dropShadow.enabled = false;}
                    }
                }
            }
        }
    }
    fontSize_ET.oldVal = fontSize_ET.text;
    xPos_ET.oldVal = xPos_ET.text;
    yPos_ET.oldVal = yPos_ET.text;
    fontSize_ET.onChange = xPos_ET.onChange = yPos_ET.onChange = function(){
        var newFontSize = parseFloat(fontSize_ET.text);
        if (newFontSize){
            fontSize_Slider.value = newFontSize;
        } else {
            alert("Need a number");
            fontSize_ET.text = fontSize_ET.oldVal;
        }
        var newPosX = parseFloat(xPos_ET.text);
        if (newPosX){
            xPos_Slider.value = newPosX;
        } else {
            alert("Need a number");
            xPos_ET.text = xPos_ET.oldVal;
        }
        var newPosY = parseFloat(yPos_ET.text);
        if (newPosY){
            yPos_Slider.value = newPosY;
        } else {
            alert("Need a number");
            yPos_ET.text = yPos_ET.oldVal;
        }
        updateText();
    }
    fontSize_Slider.onChange = yPos_Slider.onChange = xPos_Slider.onChange = function(){
        fontSize_Slider.value = Math.round(fontSize_Slider.value);
        fontSize_ET.text = "" + fontSize_Slider.value;
        xPos_Slider.value = Math.round(xPos_Slider.value);
        xPos_ET.text = "" + xPos_Slider.value;
        yPos_Slider.value = Math.round(yPos_Slider.value);
        yPos_ET.text = "" + yPos_Slider.value;
        updateText();
    }
    function updateText(){
        if (thisObj.theComp && app.project.activeItem == thisObj.theComp){;
            var theCompLayers = false;
            theCompLayers = thisObj.theComp.layers;
            if (theCompLayers){
                for (var i = 1; i <= theCompLayers.length; i++){
                    
                    var subtitlesTextProp = theCompLayers[i].text.sourceText;
                    if (subtitlesTextProp.numKeys > 0){
                        for (var k =1; k <= subtitlesTextProp.numKeys; k++){
                            //create a text document with the current value
                            var textVal = subtitlesTextProp.valueAtTime(subtitlesTextProp.keyTime(k), true);
                            textVal.fontSize = fontSize_Slider.value;
                            subtitlesTextProp.setValueAtTime(subtitlesTextProp.keyTime(k),textVal);
                        }
                    } else {
                        var textVal = subtitlesTextProp.value;
                        textVal.fontSize = fontSize_Slider.value;
                        subtitlesTextProp.setValue(textVal);
                    }
                    hPos = xPos_Slider.value / 100 * thisObj.theComp.width;
                    vPos = yPos_Slider.value / 100 * thisObj.theComp.height;
                    theCompLayers[i].transform.position.setValue([hPos, vPos]);
                }
            }
        }
    };

    if (thisObj instanceof Window) {
        thisObj.center();
        thisObj.show();
    }  else {
        pal.layout.layout(true);
    }
  }
};
