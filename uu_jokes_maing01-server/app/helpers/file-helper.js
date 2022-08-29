"use strict";
const fileType = require("file-type");

const IMAGE_MIME_TYPE_PREFIX = "image/";

class FileHelper {
  validateImageBuffer(buffer) {
    let result = fileType(buffer);
    if (result && result.mime.includes(IMAGE_MIME_TYPE_PREFIX)) {
      result = { valid: true, buffer: buffer };
    } else {
      result = { valid: false, buffer: buffer };
    }
    return result;
  }

  async validateImageStream(stream) {
    let result;
    if ((stream.contentType && stream.contentType.includes(IMAGE_MIME_TYPE_PREFIX)) || !stream.contentType) {
      let fileStream = await fileType.stream(stream);
      if (fileStream && fileStream.fileType && fileStream.fileType.mime.includes(IMAGE_MIME_TYPE_PREFIX)) {
        result = { valid: true, stream: fileStream };
      } else {
        result = { valid: false, stream: fileStream };
      }
    } else {
      result = { valid: false, stream: stream };
    }
    return result;
  }

  toStream(buffer) {
    const { Readable } = require("stream");
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);
    return stream;
  }
}

module.exports = new FileHelper();