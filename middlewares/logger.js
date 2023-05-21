const fs = require('fs'), 
{ promisify } = require('util'),
appendFile = promisify(fs.appendFile),
moment = require('moment');

module.exports.log = async (fileName, message, path = './logs/') => {
  await appendFile(`${path}${fileName}.${moment().format('YYYY.MM.DD')}.log`, `${fileName == 'error' ? moment().format('HH:mm:ss') : ''}${message.toString()}\n`);
}