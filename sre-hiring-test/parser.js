'use strict';

  const Busboy = require('busboy');

  const getContentType = (event) => {
      let contentType = event.headers['content-type']
      if (!contentType){
        return event.headers['Content-Type'];
      }
      return contentType;
  };

  const parser = (event) => new Promise((resolve, reject) => {
      const busboy = new Busboy({
          headers: {
              'content-type': getContentType(event),
          }
      });
    
      let result = {
        files: []
      };
    
      busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        file.on('data', data => {
          result.files.push({
            file: data,
            fileName: filename,
            contentType: mimetype
          });
        });
      });
    
      busboy.on('field', (fieldname, value) => {
        try {
          result[fieldname] = JSON.parse(value);
        } catch (err) {
          result[fieldname] = value;
        }
      });
    
      busboy.on('error', error => reject(`Parse error: ${error}`));
      busboy.on('finish', () => {
        event.body = result;
        resolve(event);
      });
    
      busboy.write(event.body, event.isBase64Encoded ? 'base64' : 'binary');
      busboy.end();
  });

  module.exports.parse = parser;