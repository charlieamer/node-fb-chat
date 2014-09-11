FRONTEND
========
Dzanan ? Mario ?

BAKCEND
=======
- GET /user - podaci o trenutnom korisniku. Vratice false ako user nije logovan, vratice JSON (vidi dole) o podacima o trenutnom logovanom korisniku
- GET /users - svi online korisnici (niz korisnika)
- GET /users/wait_change - cekaj na nekog novog logovanog korisnika (niz korisnika)
- GET /fb_login - ovaj link treba posjetiti korisnik kada hoce da se loguje sa fb-om
- GET /chat/last_messages - zadnjih 10 poruka
- GET /chat/message/:id - daj poruku sa id :id. Ako ta poruka ne postoji, backend ce da ceka na tu poruku da je neko posalje.
- POST /chat/message - posalji poruku u formatu prikazanom dole.
- GET /heartbeat - da znamo da je korisnik aktivan. Ovaj link treba da se posjecuje svakih 10 sekundi, i ne vraca nista znacajno, ovo je samo da server zna ko je aktivan na chatu.

MOZDA BACKEND, ako budemo ono bas prejaki
-----------------------------------------
GET /rooms/change_room/:room_id
GET /rooms/all_rooms

JSON-i
======

- Poruka koju salje server client-u:

```javascript
[
  {
    "id": 30,
    "from": { json od user-a (vidi dole) },
    "message": "hepek",
    "room": "public"
  }
]
```

- Poruka koju salje client server-u:
```javascript
{
  "message": "neka poruka bla bla bla"
}
```

- User:

```javascript
{
  "_id": "000000010203973972764720"
, "displayName": "Amer Zavlan"
, "profile_picture": "http://graph.facebook.com/10203973972764720/picture?type=square"
, "current_room": "public"
, "online": true
, "__v": 0
};
```
