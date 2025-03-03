importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging.js');

firebase.initializeApp({
    apiKey: "AIzaSyDInHVXYXea_3VFDvD4eB1yf5EhvhVFq7U",
    authDomain: "first-ef141.firebaseapp.com",
    projectId: "first-ef141",
    storageBucket: "first-ef141.firebasestorage.app",
    messagingSenderId: "1083533684990",
    appId: "1:1083533684990:web:ebc5a0ead791d565eb75af"
});

const messaging = firebase.messaging();

// 📩 監聽推播訊息 (背景接收)
messaging.onBackgroundMessage(payload => {
    console.log("📩 (背景) 收到推播:", payload);
    self.registration.showNotification(payload.notification.title, {
        body: payload.notification.body,
        icon: "icon-192.png"
    });
});
