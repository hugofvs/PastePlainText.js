# [PastePlainText.js](https://github.com/hugofvs/PastePlainText.js)

jQuery extension that makes any contenteditable able to paste only plain text


## How to use it

```html
<div id="editor" contenteditable="true">
    Text inside contenteditable element...
</div>
```

```javascript
$(document).ready(function(){
    $("#editor").pastePlainText();
});
```
