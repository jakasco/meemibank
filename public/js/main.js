'use strict';

const lomake = document.querySelector('#lomake');
const lista = document.querySelector('#result');


const lahetaLomake = (evt) => {
  evt.preventDefault();
  const fd = new FormData(lomake);
  console.log(fd.values);
  const asetukset = {
    method: 'post',
    body: fd,
  };
  fetch('/upload', asetukset).then((response) => {
    return response.json();
  }).then((json) => {
    const polku = 'files/';
    lista.innerHTML = '';
    console.log(json.length);
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



// Get the modal
const modal = document.getElementById('myModal');

// Get the button that opens the modal
const btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
const span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function() {
  modal.style.display = "block";
};

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
};

function closeModal() {
  alert("Image sent!");
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

const modal2 = document.getElementById('myModal2');

// Get the button that opens the modal
const btn3 = document.getElementById("myBtn3");

// Get the <span> element that closes the modal
const span2 = document.getElementsByClassName("close2")[0];

// When the user clicks on the button, open the modal
btn3.onclick = function() {
  modal2.style.display = "block";
};

// When the user clicks on <span> (x), close the modal
span2.onclick = function() {
  modal2.style.display = "none";
};

function closeModal2() {
  modal2.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal2.style.display = "none";
  }
};

const modal3 = document.getElementById('myModal3');

// Get the button that opens the modal
const btn4 = document.getElementById("myBtn4");

// Get the <span> element that closes the modal
const span3 = document.getElementsByClassName("close3")[0];

// When the user clicks on the button, open the modal
btn4.onclick = function() {
  modal3.style.display = "block";
};

// When the user clicks on <span> (x), close the modal
span3.onclick = function() {
  modal3.style.display = "none";
};

function closeModal3() {
  modal3.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal3.style.display = "none";
  }
};


///////////////////////////////////////////////////////////////////////
function tarkastaKirjautuneet(){
  //h1 alussa jossa sanotaan hello, username
  const hello = document.getElementById('hello');
  //Katsotaan kuka käyttäjä on logannut sisälle, jos on, niin piilotetaan ja näytetään tietyt elementit
  fetch('/loggedUsers').then((response) => {
    return response.json();
  }).then((json) => {
    try{
      console.log("loggesUsers json: ",json[0].kayttaja_nimi);
      hello.innerText = "Hello, "+json[0].kayttaja_nimi;
    //kirjautuneen käyttäjän tiedot formeihin
    logInput.value = json[0].kayttaja_nimi;
    logUpload.value = json[0].kayttaja_nimi;
    hideElements();
    }catch{
      console.log("Not logged in");
    }
  });

}

//create account
const pass1 = document.getElementById("pw1");
const pass2 = document.getElementById("pw2");
const user = document.getElementById("us");
//login
const logUser = document.getElementById("logUser");
const logPw = document.getElementById("logPw");
//const logTime = document.getElementById('logTime');


//login ja create account koko formit
const createForm = document.getElementById('createForm');
const createForm2 = document.getElementById('formLogin');

//logout
const logoutNappi = document.getElementById('nappi2');
const logInput = document.getElementById('logInput');



//upload
const uploadNappi = document.getElementById('myBtn');
const logUpload = document.getElementById('logUpload');



//loggaus divi
//const loggausDivi = document.getElementById('loggaus');
const signUpBtn = document.getElementById('myBtn4');
const loginBtn = document.getElementById('myBtn3');
const loginDiv = document.getElementById('loggaus');

function testPassword(){
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

   console.log('fd', fd);
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
   console.log('fd', fd);
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
     console.log(json[0].logged_in);
     alert("Logged = "+json[0].logged_in);
     //jos on kirjautunut sisään
     if(json[0].logged_in==1){


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


//modali systeemi kuviin
function createModal(id,kuva){
const modal = '<div id="mo'+id+'" class="modal"> '
 +'  <div class="modal-content">'
 +' <img src="files/'+kuva+'" width=700px; height = 700px />'
 +' <form id="f'+id+'"></form>'
     +'      <button onclick="suljeModal('+id+')">Close</button>'
 +'  </div>'
+'  </div>';
return modal; //palauttaa string, joka laitetaan innerHTML:n
}

//muokkaa modalin sisältö
function editModal(id,like){
const f = document.getElementById('f'+id);
f.innerHTML = like;
}


function avaaModal(id){
  console.log("AVAA");
const modal = document.getElementById('mo'+id);
modal.style.display = "block";
}

function suljeModal(id){
const modal = document.getElementById('mo'+id);
modal.style.display = "none";
}


//Scriptit
//
//
//

//tykkaa
const lahetaLomake2 = (evt,kuvaId,likeNum,json) => {
evt.preventDefault();
console.log("Clicked!  "+kuvaId);
const fd = {};
fd.kuvaId = kuvaId;
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
 const amount = json[0].tykkaa;
 likeNum.value = amount;
});
};

//dislike
const lahetaLomake3 = (evt,kuvaId,dislikeNum,json) => {
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
fetch('/dislike', asetukset).then((response) => {
 return response.json();
}).then((json) => {
 const amount = json[0].eitykkaa;
 dislikeNum.value = amount;
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

//kommentoi
const lahetaLomake4 = (evt,kuvaId,kommentti,json) => {
evt.preventDefault();
const fd = {};
fd.comment = kommentti.value;
fd.kuvaId = kuvaId;
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
 alert(json.success);
});
};

function updateKomments(commentArea,n){
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
 json.forEach(item => {
//   console.log(item);
   const li = document.createElement('li');
   li.innerHTML = item.kommentti;
   commentArea.appendChild(li);
 });
});
}

function muokkaaFormit(formi,n){
formi.method = 'post';
formi.action = '/comment';
formi.id = 'comment' + n;
return formi;
}


//uusimmat ul lista
const newestUl = document.getElementById("newest");
//suosituimmat ul
const popularUl = document.getElementById("mostPopular");
//kaikki kuvat lista
const allUl = document.getElementById('all');
