(function() {
	"use strict";

	var Pos         = CodeMirror.Pos;

	function getFields(cm, option) {
		
		var cur = cm.getCursor(), token = cm.getTokenAt(cur),
		result = [];
		if(option === 'fields'){
			var typeclass = '.pod-field-row',
				wrap = {start: "{@", end: "}"},
				prefix = token.string.split('@')[1],
				start = ((token.start-1)+token.string.split('@')[0].length);
		}else if(option === 'loop'){
			var typeclass = '.pod-field-loop',
				wrap = {start: "[loop ", end: "]"},
				prefix = token.string.slice(6),
				start = token.start;
		}
		jQuery(typeclass).each(function(){
			console.log(this);
			var label = jQuery(this).find('.pod-field-label').html(),
			field = jQuery(this).find('.pod-field-name').data('tag');
			if (label.indexOf(prefix) == 0 || field.indexOf(prefix) == 0){
				result.push({text: wrap.start + field, displayText: (display == 'label' ? label : field)});
			}
		});
		if(result.length < 2){
			if(prefix.length >= 1 && result.length > 0){
				result[0].text += wrap.end;
			}
		}
		return {
			list: result,
			from: Pos(cur.line, start),
			to: Pos(cur.line, token.end)
		};
	}
	CodeMirror.registerHelper("hint", "podfield", getFields);
})();

var hidehints   = false,
	display = 'fields';

function podFields(cm, e) {
console.log(e);
	var cur = cm.getCursor();
	if(e.keyCode === 27){
		hidehints = (hidehints ? false : true);
	}
	if(e.keyCode === 18){
		display = (display == 'label' ? 'fields' : 'label');
	}
	
	if(e.keyCode === 8){
		return;
	}

	if (typeof pred === 'undefined' || typeof pred === 'object'){		
		if (!cm.state.completionActive || e.keyCode === 18){			
			var cur = cm.getCursor(), token = cm.getTokenAt(cur), prefix,
			prefix = token.string.slice(0);
			if(prefix){
				if(token.type === 'mustache'){
					if(hidehints === false){
						CodeMirror.showHint(cm, CodeMirror.hint.podfield, 'fields');
					}
				}else if(prefix.indexOf('[l') == 0 || prefix.indexOf('[@') == 0){
					if(hidehints === false){
						CodeMirror.showHint(cm, CodeMirror.hint.podfield, 'loop');
					}					
				}else{
					hidehints = false;
				}
			}
		}
	}
return;
}
/* Setup Editors */

var mustache = function(stream, state) {

	var ch;

	if (stream.match("{@")) {
		while ((ch = stream.next()) != null){
			if(stream.eat("}")) break;
		}
		return "mustache";
	}
	if (stream.match("{&")) {
		while ((ch = stream.next()) != null)
			if (ch == "}") break;
		stream.eat("}");
		return "mustacheinternal";
	}
	if (stream.match("[once]") || stream.match("[/once]") || stream.match("[/loop]") || stream.match("[else]") || stream.match("[/if]")) {
		return "command";
	}
	if (stream.match("[loop") || stream.match("[if")) {
		while ((ch = stream.next()) != null){
			if(stream.eat("]")) break;
		}
		return "command";
	}

	/*
	if (stream.match("[[")) {
		while ((ch = stream.next()) != null)
			if (ch == "]" && stream.next() == "]") break;
		stream.eat("]");
		return "include";
	}*/
	while (stream.next() != null && 
		!stream.match("{@", false) && 
		!stream.match("{&", false) && 
		!stream.match("{{_", false) && 
		!stream.match("[once]", false) && 
		!stream.match("[/once]", false) && 
		!stream.match("[loop", false) && 
		!stream.match("[/loop]", false) && 
		!stream.match("[if", false) && 
		!stream.match("[else]", false) && 
		!stream.match("[/if]", false) ) {}
		return null;
};



CodeMirror.defineMode("mustache", function(config, parserConfig) {
	var mustacheOverlay = {
		token: mustache
	};
	return CodeMirror.overlayMode(CodeMirror.getMode(config, parserConfig.backdrop || "text/html"), mustacheOverlay);
});

var htmleditor = CodeMirror.fromTextArea(document.getElementById("code-html"), {
	lineNumbers: true,
	matchBrackets: true,
	mode: "mustache",
	indentUnit: 4,
	indentWithTabs: true,
	enterMode: "keep",
	tabMode: "shift",
	lineWrapping: true

});

/* Setup autocomplete */
htmleditor.on('keyup', podFields);


// setup pod selection
jQuery(function($){

	$('.pod-switch').baldrick({
		request: ajaxurl,
		method: 'POST'
	});

});

