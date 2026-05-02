import { db } from '../firebase'
import {
  doc, getDoc, setDoc, collection,
  query, orderBy, limit, getDocs, serverTimestamp,
} from 'firebase/firestore'

const COLLECTION = 'leaderboard'

export async function saveScore(playerName, crownLevel, zapiqScore, brainAge, obsidianCount, prestigeLevel) {
  console.log('[FIREBASE] saveScore called with:', { playerName, crownLevel, zapiqScore, brainAge, obsidianCount, prestigeLevel })
  console.log('[FIREBASE] Firestore db:', db)
  console.log('[FIREBASE] Writing to collection:', COLLECTION)

  if (!playerName || !(zapiqScore > 0)) {
    console.log('[FIREBASE] saveScore aborted: invalid playerName or zapiqScore')
    return
  }

  const ref = doc(db, COLLECTION, playerName)
  console.log('[FIREBASE] doc ref path:', ref.path)

  const snap = await getDoc(ref)
  if (snap.exists() && snap.data().zapiqScore >= zapiqScore) {
    console.log('[FIREBASE] existing score is higher, skipping save', snap.data().zapiqScore, '>=', zapiqScore)
    return
  }

  await setDoc(ref, {
    playerName,
    crownLevel,
    zapiqScore,
    brainAge: brainAge ?? null,
    obsidianCount: obsidianCount ?? 0,
    prestigeLevel: prestigeLevel ?? 0,
    updatedAt: serverTimestamp(),
  })
  console.log('[FIREBASE] save complete ✓', ref.path)
}

export async function getLeaderboard(limitCount = 20) {
  console.log('[FIREBASE] getLeaderboard called, limit:', limitCount)
  const q = query(
    collection(db, COLLECTION),
    orderBy('zapiqScore', 'desc'),
    limit(limitCount),
  )
  const snap = await getDocs(q)
  const results = snap.docs.map(d => ({ id: d.id, ...d.data() }))
  console.log('[FIREBASE] fetched', results.length, 'entries')
  return results
}
