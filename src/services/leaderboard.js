import { db } from '../firebase'
import {
  doc, getDoc, setDoc, collection,
  query, orderBy, limit, getDocs, serverTimestamp,
} from 'firebase/firestore'

const COLLECTION = 'leaderboard'

export async function saveScore(playerName, crownLevel, zapiqScore, brainAge, obsidianCount, prestigeLevel) {
  console.log('[Leaderboard] saveScore called', { playerName, crownLevel, zapiqScore, brainAge })

  if (!playerName || !zapiqScore) {
    console.log('[Leaderboard] saveScore skipped: missing playerName or zapiqScore')
    return
  }

  try {
    const ref = doc(db, COLLECTION, playerName)
    console.log('[Leaderboard] fetching existing doc...')
    const snap = await getDoc(ref)

    if (snap.exists() && snap.data().zapiqScore >= zapiqScore) {
      console.log('[Leaderboard] existing score is higher, skip save', snap.data().zapiqScore, '>=', zapiqScore)
      return
    }

    console.log('[Leaderboard] saving score to Firebase...')
    await setDoc(ref, {
      playerName,
      crownLevel,
      zapiqScore,
      brainAge: brainAge ?? null,
      obsidianCount: obsidianCount ?? 0,
      prestigeLevel: prestigeLevel ?? 0,
      updatedAt: serverTimestamp(),
    })
    console.log('[Leaderboard] Firebase save success ✓', playerName, zapiqScore)
  } catch (error) {
    console.error('[Leaderboard] Firebase save error', error)
  }
}

export async function getLeaderboard(limitCount = 20) {
  console.log('[Leaderboard] fetching top', limitCount)
  try {
    const q = query(
      collection(db, COLLECTION),
      orderBy('zapiqScore', 'desc'),
      limit(limitCount),
    )
    const snap = await getDocs(q)
    const results = snap.docs.map(d => ({ id: d.id, ...d.data() }))
    console.log('[Leaderboard] fetched', results.length, 'entries')
    return results
  } catch (error) {
    console.error('[Leaderboard] fetch error', error)
    throw error
  }
}
