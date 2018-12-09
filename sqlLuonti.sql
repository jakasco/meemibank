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
  last_login INT(14),
  PRIMARY KEY (kayttaja_id)
);
