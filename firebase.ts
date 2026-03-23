import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyCbSdElE-DXh83x02wszjfUcXl9z0iQj1A",
    authDomain: "edufy-makerlab.firebaseapp.com",
    projectId: "edufy-makerlab",
    storageBucket: "edufy-makerlab.firebasestorage.app",
    messagingSenderId: "273507751238",
    appId: "1:273507751238:web:3cc4de472be6cba2a54147",
    measurementId: "G-31HSQ3R70R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app, "websitev2");
export const storage = getStorage(app);

// Initialize Analytics (optional, can be skipped in SSR or unsupported environments)
export let analytics;
try {
    analytics = getAnalytics(app);
} catch (e) {
    console.warn("Firebase Analytics not supported in this environment");
}

export default app;
