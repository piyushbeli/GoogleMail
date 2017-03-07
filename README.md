This module expects that you already have the authorization in place and have accessToken stored at somewhere.
You need to have below scope while getting the authorization from user.
1) gmail.modify
2) gmail.readonly
Make sure that you do not have gmail.metadata scope. Looks there is some bug in Gmail API.


Steps to run the script:
1) go to GoogleGmail directory
2) run "npm install"
3) run "node app"
You should see the results on the console.

Change line no: 63 to fetch different kind of conversations. For example.
For email in inbox: 'inbox'
For chats: 'chats'