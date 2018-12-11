'use strict';

const lomake = document.querySelector('#lomake');
const lista = document.querySelector('#result');
const upTime = document.getElementById('uploadTime');

//MODALIT

//Valmiiksi oleviin nappeihin modalit (login, signup, upload)
const modal = document.getElementById('myModal');

const btn = document.getElementById("myBtn");

const span = document.getElementsByClassName("close")[0];

btn.onclick = function() {
  modal.style.display = "block";
};

span.onclick = function() {
  modal.style.display = "none";
};

const closeModal = () =>{
  alert("Image sent!");
  modal.style.display = "none";
}

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

const modal2 = document.getElementById('myModal2');

const btn3 = document.getElementById("myBtn3");

const span2 = document.getElementsByClassName("close2")[0];

btn3.onclick = function() {
  modal2.style.display = "block";
};

span2.onclick = function() {
  modal2.style.display = "none";
};

const closeModal2 = () =>{
  modal2.style.display = "none";
}

window.onclick = function(event) {
  if (event.target == modal) {
    modal2.style.display = "none";
  }
};

const modal3 = document.getElementById('myModal3');

const btn4 = document.getElementById("myBtn4");

const span3 = document.getElementsByClassName("close3")[0];

btn4.onclick = function() {
  modal3.style.display = "block";
};

span3.onclick = function() {
  modal3.style.display = "none";
};

const closeModal3 = () => {
  modal3.style.display = "none";
}

window.onclick = function(event) {
  if (event.target == modal) {
    modal3.style.display = "none";
  }
};

////////////////////////////////    MODALIT


//tämän hetkinen aika
const getTime = () => {
  const currentdate = new Date();
  let datetime = currentdate.getDate() + "/"
      + (currentdate.getMonth()+1)  + "/"
      + currentdate.getFullYear() + " @ "
      + currentdate.getHours() + ":"
      + currentdate.getMinutes() + ":"
      + currentdate.getSeconds();
  console.log("Gettime return: "+datetime);
  return datetime;
}


///////////////////////////////////////////////////////////////////////   Kirjautuneiden käyttäjien tarkastus
const kirjautuneenNimi = (nimi) =>{
  if(nimi=="a"){
    return false;
  }else{
    return true;
  }
}

//piilota modal jos ei kirjautunut
const tarkastusLuonninJalkeen = (bool, n) => {
  const avaaModalNappi = document.getElementById("viewForm"+n);
  if(bool==true){
    avaaModalNappi.style.display = "block";
  }else{
    avaaModalNappi.style.display = "none";
  }
}

const tarkastaKirjautuneet  = (callback) =>{
  //h1 alussa jossa sanotaan hello, username
  const hello = document.getElementById('hello');
  //Katsotaan kuka käyttäjä on logannut sisälle, jos on, niin piilotetaan ja näytetään tietyt elementit
  fetch('/loggedUsers').then((response) => {
    return response.json();
  }).then((json) => {
    try{
    hello.innerText = "Hello, "+json[0].kayttaja_nimi;
    //kirjautuneen käyttäjän tiedot formeihin
    logInput.value = json[0].kayttaja_nimi;
    logUpload.value = json[0].kayttaja_nimi;
    userLabel.innerHTML = json[0].kayttaja_nimi;
    hideElements();
    }catch{
      console.log("Not logged in");
    }
    callback();
  });
}

const kirjautunut = "ei kirjautunut";
//palautetaan käyttäjä nimi callbackin jälkeen
const kayttaja = () =>{
  return userLabel.innerHTML;
}

///////////////////////////////    Formien elementit

//create account
const pass1 = document.getElementById("pw1");
const pass2 = document.getElementById("pw2");
const user = document.getElementById("us");
//login
const logUser = document.getElementById("logUser");
const logPw = document.getElementById("logPw");

//login ja create account koko formit
const createForm = document.getElementById('createForm');
const createForm2 = document.getElementById('formLogin');

//logout
const logoutNappi = document.getElementById('nappi2');
const logInput = document.getElementById('logInput');

//username
const userLabel = document.getElementById('userLabel');

//upload
const uploadNappi = document.getElementById('myBtn');
const logUpload = document.getElementById('logUpload');

//loggaus divi
const signUpBtn = document.getElementById('myBtn4');
const loginBtn = document.getElementById('myBtn3');
const loginDiv = document.getElementById('loggaus');

const testPassword  = () =>{
 //jos salasanat täsmäävät
 if(pass1.value==pass2.value ){
   if(user.value != "" ){
     //mahdollistetaan submittaaminen nodeen
     return true;
   }else{
     alert("Empty username!")
     return false;
   }
 }else{
   alert("Passwords don't match!");
   pass1.value = "";
   pass2.value = "";
   return false;
 }
}

//Tee käyttäjä
const teeKayttaja = (evt) => {
 evt.preventDefault();
 const fd = {};
 fd.user = user.value;
 fd.pw = pw2.value;

 let bool = testPassword(); //testataan että salasanat täsmäävät ja jatketaan sitten

 if(bool==true) {
   const asetukset = {
     method: 'post',
     body: JSON.stringify(fd),
     headers: {
       'Content-type': 'application/json',
     },
   };
   fetch('/createAccount', asetukset).then((response) => {
     return response.json();
   }).then((json) => {
     alert("Account created!");
   });
 }
};
createForm.addEventListener('submit', teeKayttaja);


//piilota/näytä elementtäjä jos joku on kirjautunut
const hideElements = () => {
  //logout/upload nappi esiin
  logoutNappi.style.display = "block";
  uploadNappi.style.display = "block";
  loginBtn.style.display = "none";
  signUpBtn.style.display = "none";
  loginDiv.style.display = "none";
};

//Login
const login = (evt) => {
 evt.preventDefault();
 const fd = {};
 fd.logUser = logUser.value;
 fd.logPw = logPw.value;
 fd.aika = logTime.value;
   const asetukset = {
     method: 'post',
     body: JSON.stringify(fd),
     headers: {
       'Content-type': 'application/json',
     },
   };
   fetch('/login', asetukset).then((response) => {
     return response.json();
   }).then((json) => {
     //jos on kirjautunut sisään
     if(json[0].logged_in==1){
       alert("Logged in!");
       hideElements(fd.logUser,fd.logUser);
       logInput.value = fd.logUser;
       //upload nappi esiin
       logUpload.value = fd.logUser;
     }else{//jos ei ole kirjautunut
       alert("Väärä salasana!");
     }
   });
};
createForm2.addEventListener('submit', login);


///////////////////////////////////////////////////////////////////////////////         modali systeemi kuviin
const createModal = (id,kuva) =>{
const modal = '<div id="mo'+id+'" class="modal"> '
 +'  <div class="modal-content">'
 +' <img src="files/'+kuva+'" width=700px; height = 700px />'
 +' <form id="fl'+id+'"></form>' //like
 +' <form id="fd'+id+'"></form>' //dislike
 +' <form id="fc'+id+'"></form>' //comment
 +' <form id="fr'+id+'"></form>' //report
  +' <ul id="fcArea'+id+'"></ul>' //report
     +'      <button onclick="suljeModal('+id+')">Close</button>'
 +'  </div>'
+'  </div>';
return modal; //palauttaa string, joka laitetaan innerHTML:n
}

//muokkaa modalin sisältö
const editModal = (id,i,json,like,dislike,comment,report,kirjautunut) =>{

//haetaan alkuun kaikki elementit: tykkay, dislike, kommentit, report
const fl = document.getElementById('fl'+id);
const fd = document.getElementById('fd'+id);
const fc = document.getElementById('fc'+id);
const fr = document.getElementById('fr'+id);
const commentArea = document.createElement('ul');

//LIKE
fl.method = 'post';
fl.action = '/like';
fl.id = 'form' + id;
fl.innerHTML = like;

//DISLIKE
fd.innerHTML = dislike;
fd.method = 'post';
fd.action = '/dislike';
fd.id = 'dform' + id;

//tykkaysten inputtien arvot
const likeNum = document.getElementById("likeId"+id);
const dislikeNum = document.getElementById("dislikeId"+id);

fl.addEventListener('submit', function(event) {
lahetaLomake2(event,i,likeNum,dislikeNum,kirjautunut,json);});

fd.addEventListener('submit', function(event) {
lahetaLomake3(event,i,likeNum,dislikeNum,kirjautunut,json);});

//COMMENTS
fc.innerHTML = comment;

fc.method = 'post';
fc.action = '/comment';
fc.id = 'comment' + id;

const commentValue = fc.querySelector('input'); //otetaan kommentin sisältö

fc.addEventListener('submit', function(event) {
lahetaLomake4(event,i,commentValue,kirjautunut,json);});

fr.innerHTML = report;

fr.method= 'post';
fr.action = '/report';
fr.id = 'report' + id;
fr.addEventListener('submit', function(event) {
lahetaLomake5(event,i,json);});

//päivitä kommentti kenttä
const fcArea = document.getElementById("fcArea"+id);
updateKomments(fcArea,id);

}

const avaaModal = (id) =>{
  const viewI = document.getElementById('viewInput'+id);
  const modal = document.getElementById('mo'+id);
  modal.style.display = "block";
}

const suljeModal = (id) =>{
  const modal = document.getElementById('mo'+id);
  modal.style.display = "none";
}

function randomJarjestys(json) {
    for (let i = json.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = json[i];
        json[i] = json[j];
        json[j] = temp;
    }
    return json;
}


/////////////////////////////////////////           Scriptit formien käsittelyyn ja backendiin lähetys


//uplaod
const lahetaLomake = (evt) => {
  evt.preventDefault();
  //uppaus aika ylös
  let datetime = getTime();
  upTime.value = datetime;
  const fd = new FormData(lomake);
  const asetukset = {
    method: 'post',
    body: fd,
  };
  fetch('/upload', asetukset).then((response) => {
    return response.json();
  }).then((json) => {
    const polku = 'files/';
    lista.innerHTML = '';
    json.forEach(item => {
      const li = document.createElement('li');
      const kuva = document.createElement('img');
      kuva.src = polku + item.ufile;
      li.appendChild(kuva);
      lista.appendChild(li);
   });
  });
};

lomake.addEventListener('submit', lahetaLomake);

//tykkaa
const lahetaLomake2 = (evt,kuvaId,likeNum,dislikeNum,kirjautunut,json) => {
evt.preventDefault();
console.log("Clicked!  "+kuvaId);
const fd = {};
fd.kuvaId = kuvaId;
fd.kirjautunut = kirjautunut;
console.log('fd', fd);
const asetukset = {
 method: 'post',
 body: JSON.stringify(fd),
 headers: {
   'Content-type': 'application/json',
 },
};
fetch('/like', asetukset).then((response) => {
 return response.json();
}).then((json) => {
  try{
  //muuta tykkäys kenttien arvot
  const amount = json[0].tykkaa;
  likeNum.value = amount;
  const amount2 = json[0].eitykkaa;
  dislikeNum.value = amount2;
  }catch{}
});
};

//dislike
const lahetaLomake3 = (evt,kuvaId,likeNum,dislikeNum,kirjautunut,json) => {
evt.preventDefault();
const fd = {};
fd.kuvaId = kuvaId;
fd.kirjautunut = kirjautunut;
const asetukset = {
 method: 'post',
 body: JSON.stringify(fd),
 headers: {
   'Content-type': 'application/json',
 },
};
fetch('/dislike', asetukset).then((response) => {
 return response.json();
}).then((json) => {
  try{
 const amount = json[0].tykkaa;
 likeNum.value = amount;
 const amount2 = json[0].eitykkaa;
 dislikeNum.value = amount2;
}catch{}
});
};

//kommentoi
const lahetaLomake4 = (evt,kuvaId,kommentti,kirjautunut,json) => {
evt.preventDefault();
const fd = {};
fd.comment = kommentti.value;
fd.kuvaId = kuvaId;
fd.user = kirjautunut;
console.log(fd);
const asetukset = {
 method: 'post',
 body: JSON.stringify(fd),
 headers: {
   'Content-type': 'application/json',
 },
};
fetch('/comment', asetukset).then((response) => {
 return response.json();
}).then((json) => {
 //Näytä että kommentti meni tietokantaan
 alert(json.success);
});
};

//Reportti
const lahetaLomake5 = (evt,kuvaId,json) => {
evt.preventDefault();
const fd = {};
fd.kuvaId = kuvaId;
const asetukset = {
 method: 'post',
 body: JSON.stringify(fd),
 headers: {
   'Content-type': 'application/json',
 },
};
fetch('/report', asetukset).then((response) => {
 return response.json();
}).then((json) => {
 alert(json);
});
};

//Views
const lahetaLomake6 = (evt,kuvaId,kirjautunut) => {
evt.preventDefault();
console.log("Views");
const fd = {};
fd.kuvaId = kuvaId;
fd.user = kirjautunut;
const asetukset = {
 method: 'post',
 body: JSON.stringify(fd),
 headers: {
   'Content-type': 'application/json',
 },
};
fetch('/view', asetukset).then((response) => {
 return response.json();
}).then((json) => {
 console.log("View json: ",json);
 console.log("View json: ",json[0].viewCount);
});
};

const updateKomments = (commentArea,n) =>{
//päivitä kommentti kenttä
const fd = {};
fd.Id = n;
const asetukset = {
 method: 'post',
 body: JSON.stringify(fd),
 headers: {
   'Content-type': 'application/json',
 },
};
fetch('/loadComments', asetukset).then((response) => {
 return response.json();
}).then((json) => {
 //json sisältää yhden kuvan kaikki kommentit
 console.log("id: "+n+" , json: ",json);
 json.forEach(item => {
   const li = document.createElement('li');
   li.innerHTML = item.kayttaja_nimi + " : " +item.kommentti;
   commentArea.appendChild(li);
 });
});
}

//Lista jossa kaikki kuvat ovat
const popularUl = document.getElementById("mostPopular");
