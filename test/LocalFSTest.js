var should = require('should'),
  crypto = require('crypto'),
  os = require('os'),
  fs = require('fs'),
  path = require('path'),
  LocalFS = require('../lib/LocalFS')

function randomString(length) {
  return crypto.randomBytes(Math.ceil(length/2))
    .toString('hex')
    .slice(0, length)
}

describe('LocalFS', function() {

  it('should object strenuously if target directory is not specified', function(done) {
    (function() {
      new LocalFS()
    }).should.throw()

    done()
  })

  it('should store a file', function(done) {
    var targetDirectory = path.join(os.tmpdir(), randomString(20))

    // should not exist yet
    fs.existsSync(targetDirectory).should.be.false

    var provider = new LocalFS({
      directory: targetDirectory
    })

    // make a copy of the file so we don't delete it from the fixtures directory
    var sourceFile = path.resolve(__dirname + '/./fixtures/node_js_logo.png')
    var targetFile = path.join(os.tmpdir(), randomString(20))

    fs.existsSync(sourceFile).should.be.true
    fs.writeFileSync(targetFile, fs.readFileSync(sourceFile))
    fs.existsSync(targetFile).should.be.true

    provider.save({
      path: targetFile
    }, function(error, url) {
      if(error) {
        throw error
      }

      // should have created target directory
      fs.existsSync(targetDirectory).should.be.true

      // file should have moved into directory
      fs.existsSync(targetFile).should.be.false
      fs.existsSync(url).should.be.true

      done()
    })
  })

  it('should store a file from a buffer', function(done) {
    var targetDirectory = path.join(os.tmpdir(), randomString(20))

    // should not exist yet
    fs.existsSync(targetDirectory).should.be.false

    var provider = new LocalFS({
      directory: targetDirectory
    })

    // make a copy of the file so we don't delete it from the fixtures directory
    var sourceFile = path.resolve(__dirname + '/./fixtures/node_js_logo.png')

    fs.existsSync(sourceFile).should.be.true

    provider.save({
      path: 'node_js_logo.png',
      data: fs.readFileSync(sourceFile)
    }, function(error, url) {
      if(error) {
        throw error
      }

      // should have created target directory
      fs.existsSync(targetDirectory).should.be.true

      // data should be saved into directory
      fs.existsSync(url).should.be.true

      done()
    })
  })

  it('should delete a file', function(done) {
    var provider = new LocalFS({
      directory: os.tmpdir()
    })

    // make a copy of the file so we don't delete it from the fixtures directory
    var sourceFile = path.resolve(__dirname + '/./fixtures/node_js_logo.png')
    var targetFile = path.join(os.tmpdir(), randomString(20))

    fs.existsSync(sourceFile).should.be.true
    fs.writeFileSync(targetFile, fs.readFileSync(sourceFile))
    fs.existsSync(targetFile).should.be.true

    provider.save({
      path: targetFile
    }, function(error, url) {
      if(error) {
        throw error
      }

      // file should have moved into directory
      fs.existsSync(url).should.be.true

      provider.remove({url: url}, function(error) {
        if(error) {
          throw error
        }

        // file should have been deleted
        fs.existsSync(url).should.be.false

        done()
      })
    })
  })

  it('should not delete a file outside of our directory', function(done) {
    var targetDirectory = path.join(os.tmpdir(), randomString(20))

    var provider = new LocalFS({
      directory: targetDirectory
    })

    // make a copy of the file so we don't delete it from the fixtures directory
    var sourceFile = path.resolve(__dirname + '/./fixtures/node_js_logo.png')
    var targetFile = path.join(os.tmpdir(), randomString(20))

    fs.existsSync(sourceFile).should.be.true
    fs.writeFileSync(targetFile, fs.readFileSync(sourceFile))
    fs.existsSync(targetFile).should.be.true

    provider.remove({url: targetFile}, function(error) {
      // should have errored
      error.should.be.ok

      // file should not have been deleted
      fs.existsSync(targetFile).should.be.true

      done()
    })
  })
})
