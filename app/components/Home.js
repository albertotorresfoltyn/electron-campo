// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.css';
import { Button } from 'reactstrap';
import SQL from '../db';
const fs = require('fs');
const path = require('path');


export default class Home extends Component {
  constructor(props) {
    super(props);
    this.doDatabase = this.doDatabase.bind(this);
  }

  doDatabase = () => { //run sql shit heres
    debugger;
    let dbPath = path.dirname('example.db')+'/'
    console.log('el path es ', dbPath);
    let createDb = function (dbPath) {
      // Create a database.
      let db = new SQL.Database()
      let query = fs.readFileSync(
        path.join(__dirname, 'db', 'schema.sql'), 'utf8')
      let result = db.exec(query)
      if (Object.keys(result).length === 0 &&
        typeof result.constructor === 'function' &&
        SQL.dbClose(db, dbPath)) {
        console.log('Created a new database.')
      } else {
        console.log('model.initDb.createDb failed.')
      }
    }
    let db = SQL.dbOpen(dbPath+'example.db')
    if (db === null) {
      /* The file doesn't exist so create a new database. */
      createDb(dbPath + 'example.db')
    } else {
      /*
        The file is a valid sqlite3 database. This simple query will demonstrate
        whether it's in good health or not.
      */
      let query = 'SELECT count(*) as `count` FROM `sqlite_master`'
      let row = db.exec(query)
      let tableCount = parseInt(row[0].values)
      if (tableCount === 0) {
        console.log('The file is an empty SQLite3 database.')
        createDb(dbPath + 'example.db')
      } else {
        console.log('The database has', tableCount, 'tables.')
      }
      if (typeof callback === 'function') {
        callback()
      }
    }
  }
  render() {
    return (
      <div>
        <div className={styles.container} data-tid="container">
          <h2>Home</h2>
          <Button variant = "primary" size = "lg" onClick={this.doDatabase} >Primary button </Button>
          <Link to="/concha">to la concha de la puta madre</Link>
        </div>
      </div>
    );
  }
}
