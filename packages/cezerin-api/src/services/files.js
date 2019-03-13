import path from 'path';
import fs from 'fs';
// eslint-disable-next-line no-unused-vars
import url from 'url';
import formidable from 'formidable';
import utils from '../lib/utils';
import settings from '../lib/settings';

const CONTENT_PATH = path.resolve(settings.filesUploadPath);

class FilesService {
  getFileData(fileName) {
    const filePath = `${CONTENT_PATH}/${fileName}`;
    const stats = fs.statSync(filePath);
    if (stats.isFile()) {
      return {
        file: fileName,
        size: stats.size,
        modified: stats.mtime
      };
    }
    return null;
  }

  getFilesData(files) {
    return files
      .map(fileName => this.getFileData(fileName))
      .filter(fileData => fileData !== null)
      .sort((a, b) => a.modified - b.modified);
  }

  getFiles() {
    return new Promise((resolve, reject) => {
      fs.readdir(CONTENT_PATH, (err, files) => {
        if (err) {
          reject(err);
        } else {
          const filesData = this.getFilesData(files);
          resolve(filesData);
        }
      });
    });
  }

  deleteFile(fileName) {
    return new Promise((resolve, reject) => {
      const filePath = `${CONTENT_PATH}/${fileName}`;
      if (fs.existsSync(filePath)) {
        fs.unlink(filePath, () => {
          resolve();
        });
      } else {
        reject(new Error('File not found'));
      }
    });
  }

  uploadFile(req, res) {
    const uploadDir = CONTENT_PATH;

    const form = new formidable.IncomingForm();
    let fileName = null;
    let fileSize = 0;

    form.uploadDir = uploadDir;

    form
      .on('fileBegin', (name, file) => {
        // Emitted whenever a field / value pair has been received.
        file.name = utils.getCorrectFileName(file.name);
        file.path = `${uploadDir}/${file.name}`;
      })
      .on('file', (name, file) => {
        // every time a file has been uploaded successfully,
        fileName = file.name;
        fileSize = file.size;
      })
      .on('error', err => {
        res.status(500).send(this.getErrorMessage(err));
      })
      .on('end', () => {
        // Emitted when the entire request has been received, and all contained files have finished flushing to disk.
        if (fileName) {
          res.send({ file: fileName, size: fileSize });
        } else {
          res.status(400).send(this.getErrorMessage('Required fields are missing'));
        }
      });

    form.parse(req);
  }

  getErrorMessage(err) {
    return { error: true, message: err.toString() };
  }
}

export default new FilesService();
