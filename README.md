# **API for Secret Santa Event**
## **What is a Secret Santa Event :**
For Christmas Eve, to make sure that everyone are getting and offering gift we can organize a Secret Santa. Each member secretly draws another member to buy him a gift. Then when the moment come Secret Santa reveals by offering the gift to the attributed member. To be fair a price limit is set. 
## **Users :**
Their is differents type of API users:
- Admin of the API : own rights on every Secret Santa events (possibility to participate too).
- Organizer of a Secret Santa event (possibility to participate too).
- Participants of a Secret Santa event.

Every Organizer and Participants are members but they get different right according to the role given in the event. Members can participate to many events. So one member can be participant in one event and organizer in another.

## **Features by users :**
- Admin :
  - GET/DELETE/POST on all events.
  - GET/DELETE/POST on all members (except DELETE himself).
  - GET deletion request.
  - GET admin rights request.
- Organizer :
  - GET/DELETE/POST on the event concerned.
  - GET/DELETE/POST on all participants on the event concerned (if DELETE himself that DELETE the concerned event).
- Participant :
  - GET on events he participate (except secret santa assiotiation informations).
  - GET/POST on himself.
  - POST to request ADMIN to DELETE him.
- Everyone :
  - GET to login.
  - POST to subscribe.
  

## Installation :
git init
git clone https://github.com/CamilleTouron/NODEJS_API_SECRET_SANTA.git
npm start

  
