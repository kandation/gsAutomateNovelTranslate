var tempe;
var page_id = 0;

function myFunction() {
    var body = DocumentApp.getActiveDocument().getBody();

    var text = body.editAsText();
    console.log(text.getText())
}



function doGet(e) {
    tempe = e;
    Logger.log(Utilities.jsonStringify(e));
    if (!e.parameter.page) {
        // When no specific page requested, return "home page"
        return HtmlService.createTemplateFromFile('pages').evaluate();
    }
    // else, use page parameter to pick an html file from the script
    return HtmlService.createTemplateFromFile(e.parameter['pages']).evaluate();
}

function getScriptUrl() {
    var url = ScriptApp.getService().getUrl();
    return url;
}

function getAllPositionedImages(page) {
    // Open document if given ID, otherwise use active document.


    // Get handle on document's body
    var body = DocumentApp.getActiveDocument().getBody();

    // array to hold all images in document
    var allPositionedImages = [];

    var numElems = body.getNumChildren();
    //testinline();

    var content = '';
    var page_couter = 0;

    var page_spliter = 200

    for (var childIndex = 0; childIndex < numElems; childIndex++) {
        var child = body.getChild(childIndex);

        if (childIndex >= page * page_spliter && childIndex < (page * page_spliter) + page_spliter) {


            switch (child.getType()) {
                case DocumentApp.ElementType.PARAGRAPH:
                    var container = child.asParagraph();

                    break;
                case DocumentApp.ElementType.LIST_ITEM:
                    container = child.asListItem();
                    break;

                default:
                    // Skip elements that can't contain PositionedImages.
                    continue;
            }
            var out = getImagesInChild(container);


            if (out) {
                content += '<div><p>';
                if (out.text && out.text.length > 0) {
                    content += out.text + '<br/>';
                    if (out.text.length > 0) {
                        var thai = LanguageApp.translate(out.text, 'en', 'th');
                        content += thai + '<br/>';
                        Utilities.sleep(100);
                    }

                }
                if (out.img) {
                    content += out.img + '<br/>';
                }
                content += '</p><br/></div>';

            }


        }
    } return content;
}

function getImagesInChild(container) {
    var con_child_num = container.getNumChildren();
    var obj_text;
    var obj_img;
    for (var i = 0; i < con_child_num; i++) {
        var con_child = container.getChild(i);
        switch (con_child.getType()) {
            case DocumentApp.ElementType.TEXT:
                var con = con_child.asText();
                obj_text = con.getText();
                break;
            case DocumentApp.ElementType.INLINE_IMAGE:
                var con = con_child.asInlineImage();
                var base64String = Utilities.base64Encode(con.getBlob().getBytes());
                Logger.log(base64String);

                obj_img = '<img src="data:image/png;base64, ' + base64String + '" alt="img name" width="' + con.getWidth() + 'px"/>';
                break;
            default:
                obj_text = '';
                continue;
        }
    }
    if (obj_text) {
        return { 'text': obj_text };
    } else if (obj_img) {
        return { 'img': obj_img };
        //return {'text':obj_text,'img':obj_img}
    } else {
        return null;
    }
}



/*function testinline() {
    var body = DocumentApp.getActiveDocument().getBody();
    var numElems = body.getNumChildren();
    var images = body.getImages()
    var img_num = images.length;
    var style = {};
    style[DocumentApp.Attribute.HORIZONTAL_ALIGNMENT] =
        DocumentApp.HorizontalAlignment.RIGHT;

    for (var cci = 0; cci < img_num; cci++) {

        images[cci].setAttributes(style);
        Logger.log(images[cci].get);
    }

}*/

