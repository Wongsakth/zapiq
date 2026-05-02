import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyApQM0QF8A2T5iKLQv7yo2xcm0coHWg1Uw',
  authDomain: 'zapiq-511c9.firebaseapp.com',
  projectId: 'zapiq-511c9',
  storageBucket: 'zapiq-511c9.firebasestorage.app',
  messagingSenderId: '59820824145',
  appId: '1:59820824145:web:ba76180bfcf1745aba4a70',
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
