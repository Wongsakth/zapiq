import { db } from '../firebase'
import {
  doc, getDoc, setDoc, collection,
  query, orderBy, limit, getDocs, serverTimestamp,
} from 'firebase/firestore'

const COLLECTION = 'leaderboard'

export async function saveScore(playerName, crownLevel, zapiqScore, brainAge, obsidianCount, prestigeLevel) {
  if (!playerName || !zapiqScore) return

  const ref = doc(db, COLLECTION, playerName)
  const snap = await getDoc(ref)

  if (snap.exists() && snap.data().zapiqScore >= zapiqScore) return

  await setDoc(ref, {
    playerName,
    crownLevel,
    zapiqScore,
    brainAge: brainAge ?? null,
    obsidianCount: obsidianCount ?? 0,
    prestigeLevel: prestigeLevel ?? 0,
    updatedAt: serverTimestamp(),
  })
}

export async function getLeaderboard(limitCount = 20) {
  const q = query(
    collection(db, COLLECTION),
    orderBy('zapiqScore', 'desc'),
    limit(limitCount),
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}
