var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    
    res.json({
        "FILES_ROOT":          "",
        "RETURN_URL_PREFIX":   "",
        "SESSION_PATH_KEY":    "",
        "THUMBS_VIEW_WIDTH":   "140",
        "THUMBS_VIEW_HEIGHT":  "120",
        "PREVIEW_THUMB_WIDTH": "300",
        "PREVIEW_THUMB_HEIGHT":"200",
        "MAX_IMAGE_WIDTH":     "1000",
        "MAX_IMAGE_HEIGHT":    "1000",
        "INTEGRATION":         "ckeditor",
        "DIRLIST":             "/fileman/dirlist",
        "CREATEDIR":           "/fileman/createdir",
        "DELETEDIR":           "/fileman/delete",
        "MOVEDIR":             "/fileman/move",
        "COPYDIR":             "/fileman/copy",
        "RENAMEDIR":           "/fileman/rename",
        "FILESLIST":           "/fileman/fileslist",
        "UPLOAD":              "/fileman/upload",
        "DOWNLOAD":            "/fileman/download",
        "DOWNLOADDIR":         "/fileman/downloaddir",
        "DELETEFILE":          "/fileman/delete",
        "MOVEFILE":            "/fileman/move",
        "COPYFILE":            "/fileman/copy",
        "RENAMEFILE":          "/fileman/rename",
        "GENERATETHUMB":       "/fileman/generatethumb",
        "DEFAULTVIEW":         "list",
        "FORBIDDEN_UPLOADS":   "zip js jsp jsb mhtml mht xhtml xht php phtml php3 php4 php5 phps shtml jhtml pl sh py cgi exe application gadget hta cpl msc jar vb jse ws wsf wsc wsh ps1 ps2 psc1 psc2 msh msh1 msh2 inf reg scf msp scr dll msi vbs bat com pif cmd vxd cpl htpasswd htaccess",
        "ALLOWED_UPLOADS":     "",
        "FILEPERMISSIONS":     "0644",
        "DIRPERMISSIONS":      "0755",
        "LANG":                "auto",
        "DATEFORMAT":          "dd/MM/yyyy HH:mm",
        "OPEN_LAST_DIR":       "yes"
    });
});

module.exports = router;