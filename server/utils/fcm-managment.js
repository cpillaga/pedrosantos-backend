var admin = require('firebase-admin');

// Load FireBase Credentials
var userServiceAccount = require('../firebase/pedro-santos-1e354-firebase-adminsdk-z6vqp-05ff3f60ab.json');

// Declare FireBase Apps
var _userFCM = admin.initializeApp({
    credential: admin.credential.cert(userServiceAccount),
}, 'userFCM');

exports.userNotification = function(tokensList, title, body, data) {

    data.click_action = 'FLUTTER_NOTIFICATION_CLICK';

    var payload = {
        notification: {
            title,
            body,
            click_action: 'FLUTTER_NOTIFICATION_CLICK'
        },
        data
    };

    return _userFCM.messaging().sendToDevice(tokensList, payload);
};

// Broadcast Messages
// user
exports.userBroadcastNotification = function(title, body, data, topico) {
    console.log("Title: " + title);
    console.log(body);
    var payload = {
        notification: {
            title,
            body,
            click_action: 'FLUTTER_NOTIFICATION_CLICK'
        },
        data: data
    };
    return _userFCM.messaging().sendToTopic(`/topics/${topico}`, payload);
};

exports.userSubscribetoTopic = function(token, topico) {
    return _userFCM.messaging().subscribeToTopic(token, topico);
};
