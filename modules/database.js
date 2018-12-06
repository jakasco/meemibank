'use strict';
// get the client
const mysql = require('mysql2');

const connect = () => {

// create the connection to database

  const connection = mysql.createConnection({
    host: 'localhost',
		user: 'root',
		password: '',
		database: 'some'
  });
  //Tarkastetaan saadaanko MySql yhteys
  connection.connect(function(error){
    if(!!error){
      console.log("Error to connect mySQL");
    }else{
      console.log("Connected to MySQL");
    }
  });
  return connection;
};

//Loggaa sisään jos pw ja username täsmäävät
const login = (tunnus, salasana, ip, connection, callback) => {

  connection.execute(
      "UPDATE kayttaja SET logged_in = CASE WHEN salasana ='"+salasana+"'  THEN 1 ELSE 0 END, ip = CASE WHEN salasana ='"+salasana+"' THEN '"+ip+"' ELSE NUll END WHERE kayttaja_nimi IN ('"+tunnus+"')",
      (err, results, fields) => {
        callback();
      },
  );
};

//testaa ylempi
const checkLogin = (data, connection, callback) => {
  console.log("Tunnus: "+data);
  connection.execute(
      "SELECT logged_in FROM kayttaja WHERE kayttaja_nimi = '"+data+"';",
      (err, results, fields) => {
        callback(results);
      },
  );
};


const checkIP = (ip,  connection, callback) => {
  console.log("IP:  "+ip);
  connection.execute(
      "SELECT kayttaja_nimi FROM kayttaja WHERE ip = '"+ip+"';",
      (err, results, fields) => {
        callback(results);
      },
  );
};

const select = (connection, callback) => {
  // simple query
  connection.query(
      'SELECT * FROM kuvat;',
      (err, results, fields) => {
        console.log(err);
        callback(results);
      },
  );
};



const checkIfLogged = (tunnus, ip,  connection, callback) => {//
  console.log("Tunnus: "+tunnus+" , "+ip);
  connection.execute(
      "SELECT logged_in, ip FROM kayttaja WHERE kayttaja_nimi = '"+tunnus+"';",
      (err, results, fields) => {
        callback(results);
      },
  );
};


//logout
const logout = (tunnus, connection, callback) => {
  connection.execute(
      "UPDATE kayttaja SET logged_in = 0 , ip = NULL WHERE kayttaja_nimi IN ('"+tunnus+"')",
      (err, results, fields) => {
        console.log("LOGOUT RESULTS : ",results);
        callback();
      },
  );
};


const insertUser = (data, connection, callback) => {
  console.log("Inser user")
  connection.execute(
      'INSERT INTO kayttaja (kayttaja_id, kayttaja_nimi, sahkoposti, salasana, logged_in, ip, last_login) VALUES (?, ?, ?, ?, ?, ?, ?);',
      data,
      (err, results, fields) => {
        console.log(results); // results contains rows returned by server
        console.log(err);
        callback();
      },
  );
  console.log("sql done");
};


const insert = (data, connection, callback) => {

  connection.execute(
      'INSERT INTO kuvat (kuva_id, kayttaja_nimi, URL, kuva_teksti, views, tykkaa, eitykkaa,tag) VALUES (?, ?, ?, ?, ?,?,?,?);',
      data,
      (err, results, fields) => {
        console.log(results); // results contains rows returned by server
        // console.log(fields); // fields contains extra meta data about results, if available
        console.log(err);
        callback();
      },
  );
};

const insertA = (data, connection, callback) => {
  console.log("uppaus2?");
  // simple query
  connection.execute(
      'INSERT INTO wp_users (ufname, ulname, ufile, uthumb, mimetype, coordinates) VALUES (?, ?, ?, ?, ?, ?);',
      data,
      (err, results, fields) => {
       // console.log(results); // results contains rows returned by server
        // console.log(fields); // fields contains extra meta data about results, if available
        console.log(err);
        callback();
      },
  );
};

const haeTykkays = (data, connection, callback) => {
  // simple query
  connection.query(
      'SELECT * FROM kuvat WHERE kuva_id = "'+data+'";',
      (err, results, fields) => {
        callback(results);
      },
  );
};


const tykkaa = (id, connection, callback) => {
  // simple query
  connection.execute(
      'UPDATE kuvat SET tykkaa = tykkaa + 1 WHERE kuva_id = "'+id+'"',
      (err, results, fields) => {
      //  console.log(results);
        callback();
      },
  );
};

const haeDisTykkays = (data, connection, callback) => {
  connection.query(
      'SELECT * FROM kuvat WHERE kuva_id = "'+data+'";',
      (err, results, fields) => {
        console.log(err);
        callback(results);
      },
  );
};


const dislike = (data, connection, callback) => {
  // simple query
  connection.execute(
      'UPDATE kuvat SET eitykkaa = eitykkaa + 1 WHERE kuva_id = "'+data+'"',
      (err, results, fields) => {
        callback();
      },
  );
};

const addComment = (data, connection, callback) => {
  console.log("add comment: "+data);
  connection.execute(
      'INSERT INTO kommentit (kuva_id, kayttaja_id, kommentti) VALUES (?, ?, ?);',
      data,
      (err, results, fields) => {
        console.log(err);
        callback();
      },
  );
};

const selectComments = (data,connection, callback) => {
 // console.log("data: "+data);
  connection.query(
      'SELECT kommentti, kuva_id FROM kommentit WHERE kuva_id = '+data+';',
      (err, results, fields) => {
        console.log(err);
        callback(results);
      },
  );
};

const insertTag = (data, connection, callback) => {

  connection.execute(
      'INSERT INTO tags (?,?);',
      data,
      (err, results, fields) => {
    console.log(results);
  console.log(err);
  callback();
},
);
};

//DATABASE
const reportImage= (kuvaId, connection, callback)=> {
  connection.execute(
      'update kuvat set reported = 1 where kuva_id = '+kuvaId+';',
      (err, results) => {
        console.log(err);
        callback();
      },
  );
};


module.exports = {
  connect: connect,
  select: select,
  insert: insert,
  insertA: insertA,
  haeTykkays: haeTykkays,
  tykkaa: tykkaa,
  haeDisTykkays: haeDisTykkays,
  dislike: dislike,
  addComment: addComment,
  selectComments: selectComments,
  insertUser: insertUser,
  login: login,
  checkLogin: checkLogin,
  logout: logout,
  checkIfLogged: checkIfLogged,
  checkIP: checkIP,
  reportImage: reportImage,
};
