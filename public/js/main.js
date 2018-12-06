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
