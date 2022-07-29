import { TextProcessor, Script } from "./scripts/pali-script.mjs";
//const { TextProcessor } = require("./scripts/pali-script.mjs")
import pv1 from './dpd-for-tpp/Digital_Pāḷi_Dicitonary.js';
import words from './dpd-for-tpp/dpd_inflections_to_headwords.js';


//const sqlite3 = require('sqlite3').verbose();
import sqlite3 from "sqlite3";
const Sqlite3 = sqlite3.verbose();

let db = new Sqlite3.Database('./static/dicts/en-dpd.db', (Sqlite3.OPEN_READWRITE | Sqlite3.OPEN_CREATE));

await db.run('CREATE TABLE IF NOT EXISTS inflection(word text, headwords text)');
await db.run('CREATE TABLE IF NOT EXISTS dictionary(word text, meaning text)');

Object.entries(words).map(([key, val]) => {
  db.run(`INSERT INTO inflection(word, headwords) VALUES(?, ?)`, 
    [TextProcessor.basicConvertFrom(key, Script.RO), 
    TextProcessor.basicConvertFrom(val.toString(), Script.RO)], 
    function(err) {
    if (err) {
      return console.log(err.message);
    }
    // get the last insert id
    console.log(`A row has been inserted with rowid ${this.lastID}`);
  });
})

Object.entries(pv1).map(([key, val]) => {
    db.run(`INSERT INTO dictionary(word, meaning) VALUES(?, ?)`, [TextProcessor.basicConvertFrom(key, Script.RO), val], function(err) {
        if (err) {
          return console.log(err.message);
        }
        // get the last insert id
        console.log(`A row has been inserted with rowid ${this.lastID}`);
      });
})

db.close()