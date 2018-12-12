'use strict';

const mysql = require('mysql2');

const connect = () => {

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
const login = (tunnus, salasana, ip, time, connection, callback) => {

  connection.execute(
      "UPDATE kayttaja SET logged_in = CASE WHEN salasana ='"+salasana+"'  THEN 1 ELSE 0 END, ip = CASE WHEN salasana ='"+salasana+"' THEN '"+ip+"' ELSE NUll END, last_login = CASE WHEN salasana ='"+salasana+"' THEN '"+time+"' ELSE NUll END WHERE kayttaja_nimi IN ('"+tunnus+"')",
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

//tarkista mikä on käyttäjän IP osoite
const checkIP = (ip,  connection, callback) => {
  console.log("IP:  "+ip);
  connection.execute(
      "SELECT kayttaja_nimi FROM kayttaja WHERE ip = '"+ip+"';",
      (err, results, fields) => {
        callback(results);
      },
  );
};

//valitse kaikki kuvat
const select = (connection, callback) => {
  connection.query(
      'SELECT * FROM kuvat;',
      (err, results, fields) => {
        callback(results);
      },
  );
};


//tarkasta onko tietty käyttäjä tietystä ip:stä logannut sisään
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

//lisää uusi käyttäjä
const insertUser = (data, connection, callback) => {
  console.log("Inser user")
  connection.execute(
      'INSERT INTO kayttaja (kayttaja_id, kayttaja_nimi, sahkoposti, salasana, logged_in, ip, last_login) VALUES (?, ?, ?, ?, ?, ?, ?);',
      data,
      (err, results, fields) => {
        callback();
      },
  );
  console.log("sql done");
};

const insertView = (data, connection, callback) => {
  connection.execute(
      'INSERT INTO views (kuva_id, kayttaja_id, ei_kirjautunut_kayttaja) VALUES (?, ?, ?);',
      data,
      (err, results, fields) => {
        console.log(err);
        callback();
      },
  );
};

//lisää uusi kuva
const insert = (data, connection, callback) => {
  connection.execute(
      'INSERT INTO kuvat (kuva_id, kayttaja_nimi, URL, kuva_teksti, views, tykkaa, eitykkaa,tag,upload_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);',
      data,
      (err, results, fields) => {
        console.log("insert results:",results);
        callback();
      },
  );
};

//etsi tykkäys kuva id:n perusteella
const haeTykkays = (data, connection, callback) => {
  // simple query
  connection.query(
      'SELECT * FROM kuvat WHERE kuva_id = "'+data+'";',
      (err, results, fields) => {
        callback(results);
      },
  );
};

//lisää kuvaan tykkäys ja ota pois dislike
const tykkaa = (id, connection, callback) => {
  // simple query
  connection.execute(
      'UPDATE kuvat SET tykkaa = tykkaa + 1,eitykkaa = eitykkaa - 1 WHERE kuva_id = "'+id+'"',
      (err, results, fields) => {
        callback();
      },
  );
};

//tarkasta onko käyttäjä tykännyt aiemmin tästä kuvasta
const tarkastaTykkays = (kayttaja_nimi,id, connection, callback) => {
    console.log("kayttaja_nimi: "+kayttaja_nimi+" , id:"+id);
  connection.execute(
    "SELECT tykkaykset.tykkaa AS ttykkaa, tykkaykset.ala_tykkaa AS ala_tykkaa, kuvat.kuva_id, kuvat.tykkaa, kuvat.eitykkaa FROM tykkaykset INNER JOIN kuvat ON tykkaykset.kuva_id = kuvat.kuva_id AND tykkaykset.kayttaja_nimi = '"+kayttaja_nimi+"'AND tykkaykset.kuva_id = "+id+" ",
      (err, results, fields) => {
        callback(results);
      },
  );
};

//lisää tykkaykset tauluun uusi rivi käyttäjästä ja mistä kuvasta hän tykkää
const tykkaa2 = (data, connection, callback) => {
  connection.execute(
      'INSERT INTO tykkaykset (kuva_id, kayttaja_nimi, tykkaa, ala_tykkaa) VALUES (?, ?, ?, ?);',
      data,
      (err, results, fields) => {
        callback();
      },
  );
};

//tarkasta onko käyttäjä dislikennut tästä kuvasta aiemmin
const tarkastaDisTykkays = (kayttaja_nimi, id, connection, callback) => {
  connection.execute(
    "SELECT tykkaykset.tykkaa AS ttykkaa, tykkaykset.ala_tykkaa AS ala_tykkaa, kuvat.kuva_id, kuvat.tykkaa , kuvat.eitykkaa FROM tykkaykset INNER JOIN kuvat ON tykkaykset.kuva_id = kuvat.kuva_id AND tykkaykset.kayttaja_nimi = '"+kayttaja_nimi+"'AND tykkaykset.kuva_id = "+id+" ",
      (err, results, fields) => {
        callback(results);
      },
  );
};

//lisää tykkaykset tauluun uusi rivi käyttäjästä ja mistä kuvasta hän ei tykkää
const dislike2 = (data, connection, callback) => {
  console.log("data: "+data);
  connection.execute(
      'INSERT INTO tykkaykset (kuva_id, kayttaja_nimi, tykkaa, ala_tykkaa) VALUES (?, ?, ?, ?);',
      data,
      (err, results, fields) => {
        console.log(err);
        callback();
      },
  );
};

//etsi tietyn kuvan disliket
const haeDisTykkays = (data, connection, callback) => {
  connection.query(
      'SELECT * FROM kuvat WHERE kuva_id = "'+data+'";',
      (err, results, fields) => {
        console.log(err);
        callback(results);
      },
  );
};

//hae käyttäjän id nimen perusteella
const getUserId = (data, connection, callback) => {
  connection.query(
      'SELECT kayttaja_id FROM kayttaja WHERE kayttaja_nimi = "'+data+'";',
      (err, results, fields) => {
        callback(results);
      },
  );
};

//lisää kuvaan 1 dislike ja ota poist 1 tykkäys
const dislike = (data, connection, callback) => {
  connection.execute(
      'UPDATE kuvat SET eitykkaa = eitykkaa + 1, tykkaa = tykkaa - 1 WHERE kuva_id = "'+data+'"',
      (err, results, fields) => {
        callback();
      },
  );
};

//päivitä tykkaykset taulun tykkäys dislikeen
const dislike2update = (data, data2, connection, callback) => {
  connection.execute(
      'UPDATE tykkaykset SET tykkaa = 0, ala_tykkaa = 1 WHERE kayttaja_nimi = "'+data+'" AND kuva_id = "'+data2+'"',
      (err, results, fields) => {
        callback();
      },
  );
};

//päivitä tykkaykset taulun dislike likeen
const tykkaa2update = (data, data2, connection, callback) => {
  // simple query
  connection.execute(
      'UPDATE tykkaykset SET tykkaa = 1, ala_tykkaa = 0 WHERE kayttaja_nimi = "'+data+'" AND kuva_id = "'+data2+'"',
      (err, results, fields) => {
        callback();
      },
  );
};

//lisää kommentti tiettyyn kuvaan tietyltä käyttäjältä
const addComment = (data, connection, callback) => {
  connection.execute(
      'INSERT INTO kommentit (kuva_id, kayttaja_nimi, kommentti) VALUES (?, ?, ?);',
      data,
      (err, results, fields) => {
        callback();
      },
  );
};

//valise yhden kuvan kommentit
const selectComments = (data,connection, callback) => {
  connection.query(
      'SELECT kommentti, kuva_id, kayttaja_nimi FROM kommentit WHERE kuva_id = '+data+';',
      (err, results, fields) => {
        callback(results);
      },
  );
};

//tarkasta onko käyttäjä katsonut kuvan
const checkUserView = (data, connection, callback) => {
  console.log("kuva id : "+data);
  connection.query(
      'SELECT kayttaja_id FROM views WHERE kuva_id = "'+data+'";',
      (err, results, fields) => {
        callback(results);
      },
  );
};

//laske yhden kuvan kaikki viewit
const countViews = (data,connection, callback) => {
  connection.query(
      'SELECT COUNT(kuva_id) AS viewCount FROM views WHERE kuva_id = '+data+';',
      (err, results, fields) => {
        callback(results);
      },
  );
};

//laske yhden kuvan kaikki viewit
const updateViews = (kuvaId, views ,connection, callback) => {
  connection.query(
      'UPDATE kuvat SET views = '+views+' WHERE kuva_id = '+kuvaId+';',
      (err, results, fields) => {
        callback();
      },
  );
};

//lisää tagi
const insertTag = (data, connection, callback) => {
  connection.execute(
      'INSERT INTO tags (?,?);',
      data,
      (err, results, fields) => {
        callback();
      },
    );
};

//Reporttaa tietty kuva
const reportImage= (kuvaId, connection, callback)=> {
  console.log("kuva id: "+kuvaId);
  connection.execute(
      'update kuvat set reported = 1 where kuva_id = '+kuvaId+';',
      (err, results) => {
        console.log(err);
        callback();
      },
  );
};

//laske yhden kuvan kaikki viewit
const countLikes = (data,connection, callback) => {
  connection.query(
      'SELECT COUNT(tykkaa) AS likeCount FROM tykkaykset WHERE kuva_id = '+data+';',
      (err, results, fields) => {
        callback(results);
      },
  );
};



module.exports = {
  connect: connect,
  select: select,
  insert: insert,
  haeTykkays: haeTykkays,
  tykkaa: tykkaa,
  tykkaa2: tykkaa2,
  tykkaa2update: tykkaa2update,
  haeDisTykkays: haeDisTykkays,
  dislike: dislike,
  dislike2: dislike2,
  dislike2update: dislike2update,
  addComment: addComment,
  selectComments: selectComments,
  insertUser: insertUser,
  login: login,
  checkLogin: checkLogin,
  logout: logout,
  checkIfLogged: checkIfLogged,
  checkIP: checkIP,
  reportImage: reportImage,
  insertView: insertView,
  getUserId: getUserId,
  checkUserView: checkUserView,
  countViews: countViews,
  countLikes: countLikes,
  updateViews: updateViews,
  tarkastaTykkays: tarkastaTykkays,
  tarkastaDisTykkays: tarkastaDisTykkays,
};
