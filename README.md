#slackBot

This bot was originally created for freenode#reddit-naw.

Now it lives on heroku and uses node.js and Slack's API.

## Slack Integration
This bot makes use of Slack's Incoming and Outgoing Webhook integrations.

## Usage
From Slack

```
!live oh hai loganz
// returns xbox live gamertag status

!urban word
// returns a definition from urban dictionary

!img word
// return an image based on your search term

!cwfeed on/off
// Posts victories to your channel during a Call of Duty Clan War

!ping
// return "Pong!"; mainly for testing
```

## Setup
Outgoing webhooks from Slack expect an HTTP response. Environment variables are for configuring the incoming webhook
Deploy this application and set the following Environment variables.

```
export SLACK_TEAM=T07G89S73
export SLACK_TOKEN=iuy0Woifudoi8Shkuhf

# Still trying to figure out what this on is
export MIDDLE_THING=B049382KJ

```
 To configure !live and !cwfeed the following are also necessary

```
COD_USER=user@example.com
COD_PASS=password123

XBOX_API=e98171ba018230d987eb08ce87612
```

If you're running on a free tier of Heroku, prevent a sleepy dyno with:

```
export KEEP_DYNO_UP=true
```
