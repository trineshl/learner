import sqlite3 from 'sqlite3';
import path from 'path';

const FSqlite3 = sqlite3.verbose();

var FDbPath = path.resolve('databases/data.db');

// open the database
var FDb = new FSqlite3.Database(FDbPath);

export default FDb;