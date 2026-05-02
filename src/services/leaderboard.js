import { db } from '../firebase'
import {
  doc, getDoc, setDoc, collection,
  query, orderBy, limit, getDocs,
  where, deleteDoc,
} from 'firebase/firestore'

const COLLECTION = 'leaderboard'

export async function saveScore(playerName, highScores, zapiqScore, brainAge, obsidianCount, crownLevel) {
  console.log('[FIREBASE] saveScore called', { playerName, zapiqScore, obsidianCount, crownLevel })

  if (!playerName || !(zapiqScore > 0)) {
    console.log('[FIREBASE] saveScore aborted: missing playerName or zapiqScore')
    return
  }

  // Local bests from store
  const silverBest  = highScores?.silver?.combo  || 0
  const goldBest    = highScores?.gold?.combo    || 0
  const diamondBest = highScores?.diamond?.combo || 0

  // Read existing Firestore doc
  const ref  = doc(db, COLLECTION, playerName)
  const snap = await getDoc(ref)
  const ex   = snap.exists() ? snap.data() : {}
  console.log('[FIREBASE] existing doc:', ex)

  // Merge — always take the best
  const finalSilver   = Math.max(ex.silverBest   || 0, silverBest)
  const finalGold     = Math.max(ex.goldBest     || 0, goldBest)
  const finalDiamond  = Math.max(ex.diamondBest  || 0, diamondBest)
  const finalObsidian = Math.max(ex.obsidianCount || 0, obsidianCount || 0)
  const finalPrestige = finalSilver + finalGold + finalDiamond + (finalObsidian * 2)
  const finalZapiq    = Math.max(ex.zapiqScore   || 0, zapiqScore   || 0)
  const finalBrainAge = brainAge
    ? (ex.brainAge ? Math.min(ex.brainAge, brainAge) : brainAge)
    : (ex.brainAge || null)

  const payload = {
    playerName,
    crownLevel,
    silverBest:   finalSilver,
    goldBest:     finalGold,
    diamondBest:  finalDiamond,
    obsidianCount: finalObsidian,
    prestigeScore: finalPrestige,
    zapiqScore:   finalZapiq,
    brainAge:     finalBrainAge,
    updatedAt:    new Date().toISOString(),
  }

  console.log('[FIREBASE] writing payload:', payload)
  await setDoc(ref, payload)
  console.log('[FIREBASE] save complete ✓')
}

export async function getLeaderboard(limitCount = 20) {
  const q = query(
    collection(db, COLLECTION),
    orderBy('prestigeScore', 'desc'),
    limit(limitCount),
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function cleanupTestDocs() {
  const q    = query(collection(db, COLLECTION), where('test', '==', true))
  const snap = await getDocs(q)
  await Promise.all(snap.docs.map(d => deleteDoc(d.ref)))
  if (snap.docs.length > 0) console.log('[FIREBASE] deleted', snap.docs.length, 'test doc(s)')
}
