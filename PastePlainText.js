(function($) {
    $.pastePlainText = function(element) {
        var _self = this;
        var $self = $(element);
        
        var _get_text = function(event){
            if(event.clipboardData)
                return event.clipboardData.getData("text/plain");
            else if(window.clipboardData)
                return window.clipboardData.getData("Text");
            
            return undefined;
        };
        
        var _gen_plain_text = function(){
            var tmp = document.createElement("div");
            tmp.innerHTML = _self.raw_text;
            
            return tmp.textContent;
        };
        
        var _set_text_getSelection = function(){
            var sel = window.getSelection();
            if (sel.getRangeAt && sel.rangeCount) {
                var range = sel.getRangeAt(0);
                range.deleteContents();
                
                // Range.createContextualFragment() would be useful here but is
                // only relatively recently standardized and is not supported in
                // some browsers (IE9, for one)
                var el = document.createElement("div");
                el.innerHTML = _self.plain_text;
                var frag = document.createDocumentFragment(), node, lastNode;
                while ( (node = el.firstChild) ) {
                    lastNode = frag.appendChild(node);
                }
                range.insertNode(frag);
                
                // Preserve the selection
                if (lastNode) {
                    range = range.cloneRange();
                    range.setStartAfter(lastNode);
                    range.collapse(true);
                    sel.removeAllRanges();
                    sel.addRange(range);
                }
            }
        };
        
        var _set_text_documentSelection = function(){
            document.selection.createRange().pasteHTML('<div id="removeme"></div>' + _self.plain_text);
            $self.find('#removeme').remove();
        };
        
        var _set_text_execCommand = function(){
            var result = document.execCommand('insertText', false, _self.plain_text);
            
            if(result === false){
                _set_text_getSelection();
            }
        };
        
        var _set_text = function(plain_text){
            if(document.execCommand){
                _set_text_execCommand();
                
            } else if(document.selection){
                _set_text_documentSelection();
                
            } else if(window.getSelection){
                _set_text_getSelection();
            }            
        };
        
        element.addEventListener("paste", function(event) {
            event.preventDefault();
            
            _self.raw_text = _get_text(event);
            
            if(_self.raw_text === undefined){
                console.warn("Couldn't get raw text.");
                return false;
            }
            
            _self.plain_text = _gen_plain_text();
            
            _set_text();
        });
    };
        
    $.fn.pastePlainText = function() {
        return this.each(function() {
            if ($(this).data("pastePlainText") === undefined) {
                var plugin = new $.pastePlainText(this);
                $(this).data("pastePlainText", plugin);
            }
        });
    };
})(jQuery);