FRONTEND
========

HOME #/
-------
- Vidjeti je li logovan preko fejsbuka
- Frontend posalje request da vidi jel user logovan
- Ako je logovan redirect se na #/chat/public
- Ako nije, redirect se na #/login

LOGIN #/login
-------------
- Prikazati facebook login
- Kad se loguje redirect na nas /facebook_login

CHAT #/chat/:id
---------------
- Po defaultu je na public chat-u
- Posalji API request na nas za zadnjih 10 poruka
- Posalji API request da cekas novu poruku
- Posalji API request da cekas novog logovonog usera

BAKCEND
=======
GET /facebook_login - loguje nas facebook
GET /chat/last_messages - zadnjih 10 poruka
GET /chat/message/:id - sve poruke od :id pa na dalje
POST /chat/message - posalji poruku
GET /chat/users - svi logovani korisnici
GET /chat/users/wait_change - cekaj na nekog novog logovanog korisnika
GET /heartbeat - da znamo da je korisnik aktivan

MOZDA BACKEND, ako budemo ono bas prejaki
-----------------------------------------
GET /rooms/change_room/:room_id
GET /rooms/all_rooms

JSON-i
======

- Poruka:

```javascript
[
  {
    "id": 30,
    "from": "amerz",
    "message": "hepek",
    "room": "public"
  }
]
```
- User:

```javascript
[
  {
    "profile_picture": url,
    "name": "amerz",
    "fbId": "blablabla"
  }
]
```
