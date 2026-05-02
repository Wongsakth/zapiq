import React, { useState, useEffect, useCallback } from 'react'
import useGameStore from '../store/gameStore'
import Crown from '../components/ui/Crown'
import { getLeaderboard } from '../services/leaderboard'

const RANK_COLORS = {
  1: { num: '#B8860B', bg: '#FFFBEF', border: '#EDD890' },
  2: { num: '#6B6878', bg: '#F5F4FA', border: '#C8C4DC' },
  3: { num: '#8B4513', bg: '#FFF0E8', border: '#F0C090' },
}

function RankBadge({ rank }) {
  const style = RANK_COLORS[rank]
  if (style) {
    return (
      <div className="w-8 h-8 rounded-full flex items-center justify-center font-extrabold text-sm flex-shrink-0"
           style={{ background: style.bg, border: `2px solid ${style.border}`, color: style.num }}>
        {rank}
      </div>
    )
  }
  return (
    <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-[#9D9AA8] bg-[#F5F4FA] flex-shrink-0">
      {rank}
    </div>
  )
}

function PlayerRow({ rank, entry, isMe }) {
  const [expanded, setExpanded] = useState(false)

  const obsidianPts = (entry.obsidianCount || 0) * 2
  const hasBests    = (entry.silverBest || entry.goldBest || entry.diamondBest || entry.obsidianCount)

  return (
    <div className={`rounded-2xl border overflow-hidden transition-all ${
      isMe ? 'bg-[#F0EDF8] border-[#C8B8F0] shadow-sm' : 'bg-white border-[#E8E4F0]'
    }`}>
      {/* Main row */}
      <button
        className="w-full flex items-center gap-3 px-4 py-3 active:opacity-70 transition-opacity"
        onClick={() => hasBests && setExpanded(e => !e)}
      >
        <RankBadge rank={rank} />

        <Crown level={entry.crownLevel || 'silver'} size={28} animated={false} />

        <div className="flex-1 min-w-0 text-left">
          <div className="flex items-center gap-1.5 flex-wrap">
            <p className={`font-bold text-sm truncate ${isMe ? 'text-[#6B4EFF]' : 'text-[#2C2C2A]'}`}>
              {entry.playerName}
              {isMe && <span className="text-[#6B4EFF] text-xs ml-1">(คุณ)</span>}
            </p>
            {(entry.obsidianCount || 0) > 0 && (
              <span className="text-xs font-bold text-[#1A0A3A] bg-[#E8D8FF] px-1.5 py-0.5 rounded-full flex-shrink-0">
                👑×{entry.obsidianCount}
              </span>
            )}
          </div>
          {hasBests && (
            <p className="text-[#9D9AA8] text-xs mt-0.5">{expanded ? '▲ ซ่อน' : '▼ ดูรายละเอียด'}</p>
          )}
        </div>

        <div className="text-right flex-shrink-0">
          <p className={`font-extrabold tabular-nums text-xl leading-none ${isMe ? 'text-[#6B4EFF]' : 'text-[#2C2C2A]'}`}>
            {entry.prestigeScore ?? 0}
          </p>
          <p className="text-[#9D9AA8] text-xs">คะแนนรวม</p>
        </div>
      </button>

      {/* Expandable detail */}
      {expanded && hasBests && (
        <div className="px-4 pb-3 pt-0 flex flex-wrap gap-x-4 gap-y-1 border-t border-[#E8E4F0]" style={{ paddingTop: 8 }}>
          <span className="text-xs text-[#6B6878]">
            🤍 Silver: <strong>{entry.silverBest || 0}pt</strong>
          </span>
          <span className="text-xs text-[#6B6878]">
            💛 Gold: <strong>{entry.goldBest || 0}pt</strong>
          </span>
          <span className="text-xs text-[#6B6878]">
            💎 Diamond: <strong>{entry.diamondBest || 0}pt</strong>
          </span>
          {(entry.obsidianCount || 0) > 0 && (
            <span className="text-xs text-[#6B6878]">
              👑 ×{entry.obsidianCount} <strong>(+{obsidianPts}pt)</strong>
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export default function LeaderboardScreen() {
  const { playerName, navigateTo } = useGameStore()
  const [entries, setEntries]      = useState([])
  const [loading, setLoading]      = useState(true)
  const [error, setError]          = useState(null)
  const [lastRefresh, setLastRefresh] = useState(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getLeaderboard(20)
      setEntries(data)
      setLastRefresh(new Date())
    } catch {
      setError('โหลดข้อมูลไม่ได้ ลองใหม่อีกครั้ง')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
    const id = setInterval(fetchData, 30_000)
    return () => clearInterval(id)
  }, [fetchData])

  const myRank = entries.findIndex(e => e.playerName === playerName) + 1

  return (
    <div className="flex flex-col h-full bg-[#FAF8FF] screen-enter">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-5 pb-3 border-b border-[#E8E4F0]">
        <button
          onClick={() => navigateTo('home')}
          className="w-10 h-10 rounded-full bg-white border border-[#E8E4F0] flex items-center justify-center text-[#6B6878] active:scale-90 transition-transform"
        >
          ‹
        </button>
        <div className="flex-1">
          <h1 className="text-[#2C2C2A] font-bold text-xl leading-tight">🏆 Leaderboard</h1>
          {lastRefresh && (
            <p className="text-[#9D9AA8] text-xs">
              อัปเดต {lastRefresh.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
            </p>
          )}
        </div>
        <button
          onClick={fetchData}
          disabled={loading}
          className="w-9 h-9 rounded-full bg-white border border-[#E8E4F0] flex items-center justify-center text-sm active:scale-90 transition-transform disabled:opacity-40"
        >
          🔄
        </button>
      </div>

      {/* Your rank */}
      {myRank > 0 && (
        <div className="mx-4 mt-3 px-4 py-2.5 rounded-2xl bg-[#F0EDF8] border border-[#C8B8F0] flex items-center gap-2">
          <span className="text-[#6B4EFF] font-bold text-sm">อันดับของคุณ:</span>
          <span className="text-[#6B4EFF] font-extrabold text-lg">#{myRank}</span>
          <span className="text-[#9D9AA8] text-xs ml-auto">คะแนนรวม = silver + gold + diamond + (👑×2)</span>
        </div>
      )}

      {/* List */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
        {loading && entries.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-10 h-10 border-4 border-[#E8E4F0] border-t-[#A8D5A2] rounded-full animate-spin" />
            <p className="text-[#9D9AA8] text-sm">กำลังโหลด...</p>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <p className="text-[#E24B4A] text-sm">{error}</p>
            <button
              onClick={fetchData}
              className="px-5 py-2 rounded-xl bg-[#A8D5A2] text-[#1A4D1A] font-bold text-sm active:scale-95 transition-transform"
            >
              ลองใหม่
            </button>
          </div>
        )}

        {!loading && !error && entries.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-2">
            <span className="text-5xl">🏆</span>
            <p className="text-[#2C2C2A] font-bold text-lg mt-2">ยังไม่มีคะแนน</p>
            <p className="text-[#9D9AA8] text-sm">เป็นคนแรก!</p>
          </div>
        )}

        {entries.map((entry, i) => (
          <PlayerRow
            key={entry.id}
            rank={i + 1}
            entry={entry}
            isMe={entry.playerName === playerName}
          />
        ))}

        {loading && entries.length > 0 && (
          <p className="text-center text-[#9D9AA8] text-xs py-2">กำลังอัปเดต...</p>
        )}
      </div>
    </div>
  )
}
