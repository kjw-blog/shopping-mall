// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import 'dotenv/config';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

/**
 * env 파일을 못불러오는 문제 발생
 * dotenv/config를 import해주니 해결됐다.
 *
 */

const {
  fb_apiKey,
  fb_authDomain,
  fb_projectId,
  fb_storageBucket,
  fb_messagingSenderId,
  fb_appId,
} = process.env;

const firebaseConfig = {
  apiKey: fb_apiKey,
  authDomain: fb_authDomain,
  projectId: fb_projectId,
  storageBucket: fb_storageBucket,
  messagingSenderId: fb_messagingSenderId,
  appId: fb_appId,
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;

export const db = getFirestore(app);
