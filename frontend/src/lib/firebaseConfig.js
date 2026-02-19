/**
 * Firebase 설정 파일
 * 프론트엔드에서 사용하는 Firebase 클라이언트 SDK 설정
 */

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Firebase 프로젝트 설정 (Firebase Console에서 복사)
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "YOUR_API_KEY",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "your-project.firebaseapp.com",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "your-project-id",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "your-project.appspot.com",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:123456789:web:abc123"
};

// Firebase 앱 초기화
const app = initializeApp(firebaseConfig);

// Firestore 데이터베이스
export const db = getFirestore(app);

// Firebase 인증
export const auth = getAuth(app);

// Firebase Storage
export const storage = getStorage(app);

export default app;
