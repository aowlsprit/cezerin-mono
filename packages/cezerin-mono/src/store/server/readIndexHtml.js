import fs from 'fs';
import path from 'path';
import winston from 'winston';

const FILE_PATH = path.resolve('../cezerin-theme/assets/index.html');

let indexHtml = null;

console.log('>>> ', FILE_PATH);

fs.readFile(FILE_PATH, 'utf8', (err, data) => {
	if (err) {
		indexHtml = '';
		console.log('>>> ', FILE_PATH);
		winston.error('Fail to read file', FILE_PATH, err);
	} else {
		indexHtml = data;
	}
});

export default () => indexHtml;
