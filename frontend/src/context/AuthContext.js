'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import {
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebaseConfig';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const loginWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // Firestore에 사용자 정보 저장
            const userRef = doc(db, 'users', user.uid);
            const userSnap = await getDoc(userRef);

            const userData = {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                lastLoginAt: serverTimestamp(),
            };

            if (!userSnap.exists()) {
                // 신규 가입
                await setDoc(userRef, {
                    ...userData,
                    role: 'user',
                    createdAt: serverTimestamp(),
                    preferences: {
                        categories: [], // 관심 카테고리
                        notifications: true
                    }
                });
            } else {
                // 기존 회원 정보 업데이트
                await setDoc(userRef, userData, { merge: true });
            }

            return user;
        } catch (error) {
            console.error("Login failed:", error);
            throw error;
        }
    };

    const logout = async () => {
        setUser(null);
        await signOut(auth);
    };

    return (
        <AuthContext.Provider value={{ user, loginWithGoogle, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
