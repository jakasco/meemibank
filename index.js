'use strict';
require('dotenv').config();
const express = require('express');
// const fs      = require('fs');
// const https   = require('https');

const database = require('./modules/database');
const resize = require('./modules/resize');
const exif = require('./modules/exif');
const multer = require('multer');
const upload = multer({dest: 'public/files/'});

const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

/*
const sslkey  = fs.readFileSync('/etc/pki/tls/private/ca.key');
const sslcert = fs.readFileSync('/etc/pki/tls/certs/ca.crt');
const options = {
  key: sslkey,
  cert: sslcert
};
*/

app.use(express.static('public'));

// create the connection to database
const connection = database.connect();
//testataan toimiiko tietokanta

database.select(connection, (results) => {
});

const insertToDB = (data, res, next) => {
  database.insert(data, connection, () => {
    next();
  });
};

const tykkaa2update = (nimi, id, res, next) => {
  database.tykkaa2update(nimi, id, connection, () => {
    next();
  });
};

const tykkaa2 = (data, res, next) => {
  database.tykkaa2(data, connection, () => {
    next();
  });
};

const dislike2 = (nimi, res, next) => {
  database.dislike2(nimi,connection, () => {
    next();
  });
};

const dislike2update = (nimi, id, res, next) => {
  database.dislike2update(nimi, id, connection, () => {
    next();
  });
};



const insertView = (data, res, next) => {
  database.insertView(data, connection, () => {
    next();
  });
};

const addComment= (data, res, next) => {
  database.addComment(data, connection, () => {
    next();
  });
};

const insertUser = (data, res, next) => {
  database.insertUser(data, connection, () => {
    next();
  });
};

//report
const report = (kuvaId, req, next) =>{
  database.reportImage(kuvaId, connection, (results) => {
    req.custom = results;
    next();
  })
};

//login eka vaihe  //tunnus, salasana, ip time
const login = (data1, data2, data3, data4, res, next) => {
  database.login(data1, data2, data3, data4, connection, () => {
    next();
  });
};
//login tokavaihe
const checkLogin = (tunnus, req, next) => {
  database.checkLogin(tunnus, connection, (results) => {
    req.custom = results;
    next();
  });
};

//login jos jo valmiiksi kirjautunut
const checkIfLogged = (tunnus, ip, req, next) => {
  database.checkIfLogged(tunnus,ip,connection, (results) => {
    req.custom = results;
    next();
  });
};

//tarkista käyttäjät tästä ip:stä
const checkIp = (ip, req, next) => {
  database.checkIP(ip,connection, (results) => {
    req.custom = results;
    console.log("req.custom: ",req.custom);
    next();
  });
};

//hae kaikki kuvat
const selectAll = (req, next) => {
  database.select(connection, (results) => {
    req.custom = results;
    next();
  });
};

//tarkasta onko käyttäjä tykännyt kuvasta
const tarkastaTykkays = (kayttaja_nimi,id,req, next) => {
  database.tarkastaTykkays(kayttaja_nimi,id,connection, (results) => {
    req.custom = results;
    next();
  });
};

//tarkasta onko käyttäjä tykännyt kuvasta
const tarkastaDisTykkays = (kayttaja_nimi,id,req, next) => {
  database.tarkastaDisTykkays(kayttaja_nimi,id,connection, (results) => {
    req.custom = results;
    next();
  });
};


//logout
const logout = (data,  res, next) => {
  database.logout(data,  connection, () => {
    next();

  });
};

const haeTykkays = (data, req, next) => {
  console.log('haetykkäys');
  database.haeTykkays(data, connection, (results) => {
  //  req.custom = results;
    next();
  });
};

const getUserId = (data, req, next) => {
  console.log('hae käyttäjä id');
  database.getUserId(data, connection, (results) => {
    req.custom = results;
    next();
  });
};

const countViews = (data, req, next) => {
  database.countViews(data, connection, (results) => {
    req.custom = results;
    next();
  });
};

const updateViews = (kuvaId, views, req, next) => {
  database.updateViews(kuvaId, views, connection, (results) => {
    next();
  });
};

const checkUserView = (data, req, next) => {
  console.log('katso onko käyttäjä jo antanut viewin');
  database.checkUserView(data, connection, (results) => {
    req.custom = results;
    next();
  });
};

const selectComments = (data, req, next) => {
 // console.log('haekommentit');
  database.selectComments(data, connection, (results) => {
    req.custom = results;
    next();
  });
};

const tykkaa = (data, res, next) => {
  database.tykkaa(data, connection, () => {
    next();
  });
};

const haeDisTykkays = (data, req, next) => {
  console.log('Dishaetykkäys');
  database.haeDisTykkays(data, connection, (results) => {
    req.custom = results;
    next();
  });
};

const dislike = (data, res, next) => {
  database.dislike(data, connection, () => {
    next();
  });
};





const selectAll2 = (req, next) => {
  database.insertA(connection, (results) => {
    req.custom = results;
    next();
  });
};

//hae päivitetyt tiedot tietokannasta
app.use('/pageLoad', (req, res, next) => {
  selectAll(req, next);
});


//lähetä tiedot selaimeen//
app.use('/pageLoad', (req, res) => {
  res.send(req.custom);
});












//TARKASTA ETTÄ checkIp(req.ip, REQ, next); EIKÄ RES!!!!!!

//tarkasta kirjautuneet käyttäjät
app.use('/loggedUsers', (req, res, next) => {
  checkIp(req.ip, req, next);
});

app.use('/loggedUsers', (req, res,next) => {

  //katso kuka on onlinessa:
  for(let i=0; i<req.custom.length; i++) {

 //   console.log("USER: "+req.custom[i].kayttaja_nimi);
    checkIfLogged(req.custom[i].kayttaja_nimi, req.ip, req, next);
  }
  console.log("Req.custom: ",req.custom);
  res.send(req.custom);
});














//hae päivitetyt tiedot tietokannasta
app.use('/loadComments', (req, res, next) => {
  const data = req.body.Id;
 // console.log(data);
  selectComments(data, req, next);
});
//lähetä tiedot selaimeen//
app.use('/loadComments', (req, res) => {
  console.log("loadcomment: ",req.custom);
  res.send(req.custom);
});





//Tykkays systeemi
app.post('/like', (req, res, next) => {//
tarkastaTykkays(req.body.kirjautunut,req,next);
});


app.use('/like', (req, res, next) => {
  console.log("reqcus:",req.custom);

  if(req.custom.length == 0){
    console.log(req.body);
  const data = [req.body.kuvaId, req.body.kirjautunut, 1, 0];
  console.log(data);
  tykkaa2(data, req, next);
}else{
  console.log("On jo tykätty");
  next();
}
});

app.use('/like', (req, res, next) => {

  if(req.custom.length == 0){
  const data = req.body.kuvaId;
   tykkaa(req.body.kuvaId, req, next);
   tykkaa2update(req.body.kirjautunut,req.body.kuvaId, req, next);
  }else{
    console.log("On jo tykätty 2");
  }
  console.log("resss",req.custom);
  res.send(req.custom);
});



//Dislike systeemi
app.post('/dislike', (req, res, next) => {//
  console.log("asda",req.body);
tarkastaDisTykkays(req.body.kirjautunut,req.body.kuvaId,req,next);
});


app.use('/dislike', (req, res, next) => {
  console.log("reqcus:",req.custom);

  if(req.custom.length == 0){
  const data = [req.body.kuvaId, req.body.kirjautunut, 0, 1];
  console.log(data);
  dislike2(data, req, next);
}else{
  console.log("On jo eitykätty");
  next();
}
});

app.use('/dislike', (req, res, next) => {

  if(req.custom.length == 0){
  const data = req.body.kuvaId;
   dislike(req.body.kuvaId, req, next);
   dislike2update(req.body.kirjautunut,req.body.kuvaId, req, next);
  }else{
    console.log("On jo eitykätty 2");
  }
  console.log("resss",req.custom);
  res.send(req.custom);
});
/**



app.post('/dislike', (req, res, next) => {//
 // console.log('body', req.body);
  const data = req.body.kuvaId;
  haeDisTykkays(data, req, next);
});

app.use('/dislike', (req, res, next) => {
  const data = req.body.kuvaId;
  dislike(data, req, next);
  res.send(req.custom);
});
*/





//kommentti systeemi
app.post('/comment', (req, res, next) => {//
  console.log('body', req.body);
  const data = [req.body.kuvaId, req.body.user , req.body.comment];
  addComment(data, req, next);

  const json = {
    success: "Comment succesfully sent!"
  }
  res.send(json);
});




//Tee käyttäjä
app.post('/createAccount',  (req, res, next) => {
  console.log(req.body);
  const data = [0,req.body.user,"random@com", req.body.pw, 0, null, null]; //ip alkuun
  insertUser(data, req, next);
  console.log(req.custom);
  res.send(req.body);
});



//Kirjaudu sisään
app.post('/login',  (req, res, next) => {
  console.log("Login");
  console.log(req.body);
  login(req.body.logUser, req.body.logPw, req.ip, req.body.aika, req, next);
});
//lähetä fronttiin logged_in joko 1 tai 0
app.use('/login',  (req, res, next) => {
  console.log("ennen checklogin");
  const tunnus = req.body.logUser;
  console.log(req.body);
  console.log(req.body.logUser)
  checkLogin(tunnus,req,next);
});

app.use('/login',  (req, res, next) => {
console.log("jälkeen checklogin");
console.log("Req.custom: ",req.custom);
res.send(req.custom);
});



//ulos loggaus
app.post('/profileLogout',  (req, res, next) => {
  console.log("Ulos loggaus");
  logout(req.body.user, req, next);
  console.log(req.body);
  res.redirect('/');
});


//REPORT

app.post('/report', (req, res, next) =>{
  console.log("REPORT");
  console.log("KUVA jota reportetaaN: ", req.body);
  const reportti = [req.body.kuvaId];
  report(reportti, req, next);
  res.send(req.body);
});


//Viewi systeemi
//katsotaan alkuun kuka käyttäjä katsoo kuvaa
app.post('/view', (req, res, next) =>{
  console.log("View count");
  console.log("Req.body: ", req.body);
  getUserId(req.body.user,req,next);
});

//seuraavaksi katsotaan onko hän jo katsonut kuvan kertaalleen
app.use('/view', (req, res, next) =>{
  console.log("req1:",req.custom);
//  const tempUser = req.custom[0].kayttaja_id;
  try{
  checkUserView(req.body.kuvaId, res, next);
}catch{
  console.log("ei kirjautunut");
}

});
app.use('/view', (req, res, next) =>{
//  const tempUser2 = req.custom[0].kayttaja_id;
  //jos käyttäjä ei ole katsonut kuvaa, annetaan viewi
//  console.log("tempUser: "+tempUser+", tempUser2:"+tempUser2);
//  if(tempUser!=tempUser2){
  try{
  const data = [ req.body.kuvaId, req.custom[0].kayttaja_id, null];
  insertView(data, res, next);
}catch{

}
//}else{
//}
});

app.use('/view', (req, res, next) =>{
  countViews(req.body.kuvaId,req, next);
});

app.use('/view', (req, res, next) =>{
  updateViews(req.body.kuvaId,req.custom[0].viewCount,req, next);
});

app.use('/view', (req, res, next) =>{
  console.log("final req.custom: ",req.custom[0].viewCount);
  res.send(req.custom);
});



//tallenna tiedosto
app.post('/upload', upload.single('kuva'), (req, res, next) => {
  console.log(req.body);
  console.log("aika:"+req.body.time);
  console.log("file:",req.file);
  next();
});

// tallenna tiedot tietokantaan
app.use('/upload', (req, res, next) => {
  const data = [0, req.body.user, req.file.filename, 'text', 0, 0, 0,req.body.tag,req.body.time];
  insertToDB(data, res, next);
});
//hae päivitetyt tiedot tietokannasta
app.use('/upload', (req, res, next) => {
  selectAll(req, next);
});
//lähetä tiedot selaimeen//
app.use('/upload', (req, res) => {
//  console.log(req.custom); //kaikki kuvat
  res.send(req.custom);
});

/*
app.get('/test', (req,res) => {
  if (req.secure) res.send('https :)');
  else res.send('hello not secure?');
});
*/

app.listen(8000); //normal http traffic
// https.createServer(options, app).listen(3000); //https traffic
