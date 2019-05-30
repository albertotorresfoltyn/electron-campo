import fs from 'fs';
import cfg from '../config';

const ENV = process.env.NODE_ENV || 'development';
const isPresentInFile =
  ENV === 'test'
    ? string => string === 'found'
    : string =>
      fs.readFile('app/config/pwdlist.txt', (err, cont) => {
        if (err) {
          throw err;
        }
        return cont.indexOf(string) > -1;
      });

export const CMFL18Check = (password) => {
  if (password && password.length < cfg.minPwLen) {
    return false; // password too short
  }
  const res = !isPresentInFile(password);
  return res; // password is in the blacklist
};

export default CMFL18Check;
