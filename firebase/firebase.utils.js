const firebase = require('firebase');
require('firebase/auth');
require('firebase/firestore');

const config = {
    apiKey: 'AIzaSyCS5Tlxjwkes2Oc1RTB7KTWXwjgAWXgwMY',
    authDomain: 'raspberry-d86c8.firebaseapp.com',
    databaseURL: 'https://raspberry-d86c8.firebaseio.com',
    projectId: 'raspberry-d86c8',
    storageBucket: 'raspberry-d86c8.appspot.com',
    messagingSenderId: '66389975989',
    appId: '1:66389975989:web:65113c069afbf4958daffc',
    measurementId: 'G-N7LP7ZY20N',
};

export const createUserProfileDocument = async (userAuth, additionalData) => {
	if (!userAuth) return;
	
    const userRef = firestore.doc(`users/${userAuth.uid}`);

    const snapShot = await userRef.get();
	
    if (!snapShot.exists) {
        const { displayName, email } = userAuth;
        const createdAt = new Date();

        try {
            await userRef.set({
                displayName,
                email,
                createdAt,
                ...additionalData,
            });
        } catch (error) {
            console.log(`Erorr occured: ${error}`);
        }
    }

    return userRef;
};

firebase.initializeApp(firebaseConfig);
