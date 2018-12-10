drop table if exists kuvat;
CREATE TABLE kuvat
(
  kuva_id INT NOT NULL,
  kayttaja_nimi VARCHAR(30),
  URL VARCHAR(50),
  kuva_teksti VARCHAR(50),
  views INT,
  tykkaa INT,
  eitykkaa INT,
  tag VARCHAR(40),
  reported INT,
  upload_time VARCHAR(40),
  PRIMARY KEY (kuva_id)
);

drop table if exists kayttaja;
CREATE TABLE kayttaja
(
  kayttaja_id INT NOT NULL,
  kayttaja_nimi VARCHAR(50) NOT NULL,
  sahkoposti VARCHAR(50),
  salasana VARCHAR(30) NOT NULL,
  logged_in INT(10),
  ip VARCHAR(40),
  last_login ip VARCHAR(40),
  PRIMARY KEY (kayttaja_id)
);

drop table if exists views;
CREATE TABLE views
(
  kuva_id INT NOT NULL,
  kayttaja_id INT,
  ei_kirjautunut_kayttaja INT
);

drop table if exists kommentit;
CREATE TABLE kommentit
(
  kuva_id INT NOT NULL,
  kayttaja_nimi VARCHAR(30),
  kommentti VARCHAR(100),
  reported INT
);

drop table if exists tykkaykset;
CREATE TABLE tykkaykset
(
  kuva_id INT NOT NULL,
  kayttaja_nimi VARCHAR(30),
  tykkaa INT,
  ala_tykkaa INT
);
