var ATTClient = (function() {

  var instance, client;

  function init(options, callback) {

    var broker, topic;

    var stompUrl = 'http://broker.smartliving.io:15674/stomp';

    var ws = new SockJS(stompUrl);
    client = Stomp.over(ws);

    client.heartbeat.outgoing = 0;
    client.heartbeat.incoming = 0;

    var clientID  = options.clientID;
    var clientKey = options.clientKey;

    var host = clientID;

    var headers = {
      'login'   : clientID,
      'passcode': clientKey,
      'host'    : host
    };

    client.connect(headers, function() {

      subscribeToTopic(options, callback);

    }, handleError);

  }

  // subscribe to the correct broker topic
  function subscribeToTopic(options, callback) {

    var topic = buildTopic({
      clientID: options.clientID,
      assetID : 'random-boolean-sensor'
    });

    client.subscribe(topic, function(data) {
      var msg = parseMessage(data).message;
      callback(msg);
    });

  }

  // Parse a message
  // TODO: refactor this method to be less error-prone
  function parseMessage(data) {

    var body = data.body, timestamp;

    body = body.split('|');

    if (body.length === 1) {
      message = body[0];
    } else {
      message = body[1];
      timestamp = body[0];
    }

    return {
      message   : message,
      timestamp : timestamp
    };
  }

  // Build the topic for a device/asset
  function buildTopic(options) {

    var type, uid;

    if (!options.clientID)
      return console.error('Could not subscribe to topic. No clientID');

    if (options.hasOwnProperty('assetID')) {
      type = 'asset';
      uid = options.assetID;
    } else if (options.hasOwnProperty('deviceID')) {
      type = 'device';
      uid = options.deviceID;
    }

    if (!uid)
      return console.error('Could not subscribe to topic. No deviceID or assetID');

    return '/exchange/root/client.' + options.clientID + '.out.' + type + '.' + uid + '.state';
  }

  function handleError(err) {
    console.error('Error:', err);
  }

  return {
    listen: function (options, callback) {
      if (!instance)
        init(options, callback);
      else
        callback(instance);
    }
  };

})();