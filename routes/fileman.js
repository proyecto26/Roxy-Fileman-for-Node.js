var express = require('express');
var router = express.Router();
var fs = require('fs-extra');
var path = require('path');
var sizeOf = require('image-size');
var gm = require('gm');
var multer  = require('multer');
var archiver = require('archiver');

var serverRoot = './public/';

/* List directory tree */
router.post('/dirlist', function(req, res) {
  
  var response = [];  
  var filesRoot = 'Uploads';
  
  getDirectories(filesRoot, response);
  
  res.send(response);
});

/* List files in a directory */
router.post('/fileslist', function(req, res) {
  
  var response = [];
  var pathDir = serverRoot + req.body.d;
  fs.readdirSync(pathDir).map(function(file) {
    var fileDir = path.join(pathDir, file);
    var info = fs.statSync(fileDir); 
    if(info.isFile()){
        var size = null;
        try { size = sizeOf(fileDir); } catch(err) { size = {}; }
        response.push({ 
            p: path.join(req.body.d, file).replace(/\\/g, '/'), 
            s: info.size,
            t: (info.mtime.getTime() / 1000).toFixed(0),
            w: size.width,
            h: size.height
        });
    }
  });
  
  res.send(response);
});

/* Copying a file or directory */
router.post('/copy', function(req, res) {
  
  try {
    fs.copySync(path.join(serverRoot, req.body.f || req.body.d), path.join(serverRoot, req.body.n));
    res.send({ res: "ok", msg: "Success" });
  } catch (err) {
    res.send({ res:"error", msg: err });
  }
});

/* Create directory */
router.post('/createdir', function(req, res) {
  try {
    fs.mkdirsSync(path.join(serverRoot, req.body.d, req.body.n));
    res.send({ res: "ok", msg: "Success" });
  } catch (err) {
    res.send({ res:"error", msg: err });
  }
});

/* Delete a file or directory */
router.post('/delete', function(req, res) {
  try {
    fs.removeSync(path.join(serverRoot, req.body.f || req.body.d));
    res.send({ res: "ok", msg: "Success" });
  } catch (err) {
    res.send({ res:"error", msg: err });
  }
});

/* Download file */
router.get('/download', function(req, res) {
  
  res.download(path.join(serverRoot, req.query.f));
});

/* Download directory */
router.get('/downloaddir', function(req, res) {
    
  res.setHeader('Content-disposition', 'attachment; filename=' + path.basename(req.query.d) + '.zip');
  
  var archive = archiver('zip');
  archive.pipe(res);
  archive.bulk([
    { expand: true, cwd: path.join(serverRoot, req.query.d), src: ['**/*'] }
  ]);
  archive.finalize();
});

/* Move a file or directory */
router.post('/move', function(req, res) {
  
  fs.move(path.join(serverRoot, req.body.f || req.body.d), path.join(serverRoot, req.body.n), function (err) {
    if (err) {
        res.send({ res:"error", msg: err });
    }
    else{
        res.send({ res: "ok", msg: "Success" });
    }
  });
});

/* Rename a file or directory */
router.post('/rename', function(req, res) {
  var pathDir = path.dirname(req.body.f || req.body.d);
  try {
    fs.renameSync(path.join(serverRoot, req.body.f || req.body.d), path.join(serverRoot, pathDir, req.body.n));
    res.send({ res: "ok", msg: "Success" });
  } catch (err) {
    res.send({ res:"error", msg: err });
  }
});

/* Generate thumbnail */
router.get('/generatethumb', function(req, res) {
  
  res.setHeader("content-type", "image/png");
  
  gm(path.join(serverRoot, req.query.f))
  .resize(req.query.width || '200', req.query.height || '200', '^')
  .gravity('Center')
  .crop(req.query.width || '200', req.query.height || '200')
  .stream('png')
  .pipe(res);  
  
});

/* Upload files */
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(serverRoot, req.body.d));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

var upload = multer({ storage: storage }).array('files[]');
router.post('/upload', function(req, res) {
  upload(req, res, function (err) {
    if (err) {
      res.send({ res:"error", msg: err });
    }
    else{
      res.send({ res: "ok", msg: "Success" });  
    }
  })  
});

var getDirectories = function(srcpath, response) {
  
  var info = {
    p: srcpath.replace(/\\/g, '/'),
    f: 0,
    d: 0
  };
  response.push(info);
  
  fs.readdirSync(serverRoot + srcpath).map(function(file) {
    var pathDir = path.join(srcpath, file);
    if(fs.statSync(serverRoot + pathDir).isDirectory()){
        info.d++;
        getDirectories(pathDir, response);
    }else{
        info.f++;
    }
  });
};

module.exports = router;