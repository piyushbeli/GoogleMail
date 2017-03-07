var NODE_GMAIL_API    = require('node-gmail-api'),
    DEFERRED          = require('deferred'),
    ATOB              = require('atob');

var ACCESS_TOKEN = "your-access-token";
var LABEL = 'chats';
var NO_OF_CONVERSATIONS = 3;

function GmailWrapper(accessToken) {
    this._accessToken = accessToken || ACCESS_TOKEN;

    this._api = new NODE_GMAIL_API(this._accessToken);
}

function Message(msg) {
    var self = this;
    var headers = msg.payload.headers;
    headers.forEach(function (header) {
        var name = header.name.toLowerCase();
        if (name == 'from') {
            this.from = header.value;
        } else if (name == 'date') {
            this.receivedAt = header.value;
        } else if (name == 'subject') {
            this.subject = header.value;
        }
    }.bind(this));
    this.read = msg.labelIds.some(function (label) {
        return label == 'UNREAD'
    });

    this.body = msg.payload.body.data ? ATOB(msg.payload.body.data) : '';
    this.snippet = msg.snippet;
}

GmailWrapper.prototype.fetchConversations    = function (noOfConversations, label) {
    label = label || 'inbox';
    var response            = this._api.messages('label:' + label, {max: noOfConversations}),
        deferred            = new DEFERRED(),
        fetchedConversation = 0,
        messages            = [];

    response.on('data', function (data) {
        var message    = new Message(data);
        fetchedConversation++;
        messages.push(message);
        if (fetchedConversation == noOfConversations) {
            deferred.resolve(messages);
        }
        console.log(message);
    });

    response.on('error', function (err) {
        console.log({
            msg: 'Error has occurred while fetching the gmail conversations',
            err: err
        });
        deferred.reject(err);
    });

    return deferred.promise;
};

module.exports = GmailWrapper;

var test = new GmailWrapper();
test.fetchConversations(NO_OF_CONVERSATIONS, LABEL);



/*
s.on('data', function (d) {
    console.log(d.snippet)

    console.log('#################Body#############');
    console.log(atob(d.payload.body.data));
})*/
