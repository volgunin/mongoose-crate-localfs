# mongoose-crate-localfs

[![Dependency Status](https://david-dm.org/achingbrain/mongoose-crate-localfs.svg?theme=shields.io)](https://david-dm.org/achingbrain/mongoose-crate-localfs) [![devDependency Status](https://david-dm.org/achingbrain/mongoose-crate-localfs/dev-status.svg?theme=shields.io)](https://david-dm.org/achingbrainmongoose-crate-localfs#info=devDependencies) [![Build Status](https://img.shields.io/travis/achingbrain/mongoose-crate-localfs/master.svg)](https://travis-ci.org/achingbrain/mongoose-crate-localfs) [![Coverage Status](http://img.shields.io/coveralls/achingbrain/mongoose-crate-localfs/master.svg)](https://coveralls.io/r/achingbrain/mongoose-crate-localfs)

A StorageProvider for mongoose-crate that stores files on the local filesystem.

## Usage

```javascript
var mongoose = require('mongoose'),
  crate = require('mongoose-crate'),
  LocalFS = require('mongoose-crate-localfs')

var PostSchema = new mongoose.Schema({
  title: String,
  description: String
})

PostSchema.plugin(crate, {
  storage: new LocalFS({
    directory: '/path/to/storage/directory',
    path: function(attachment) { // where the file is stored in the directory - defaults to this function
      return '/' + path.basename(attachment.path)
    }
  }),
  fields: {
    file: {}
  }
})

var Post = mongoose.model('Post', PostSchema)
```

.. then later:

```javascript
var post = new Post()
post.attach('image', {path: '/path/to/image'}, function(error) {
  // file is now attached and post.file is populated e.g.:
  // post.file.url
})
```

.. or:

```javascript
var post = new Post()
var data = []
post.attach('image', {path: '/path/to/image', data: data}, function(error) {
  // data is now saved and post.file is populated e.g.:
  // post.file.url
})
```
