const KEY = 'zapiq_users'
const MAX = 4

export function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]')
  } catch {
    return []
  }
}

export function saveUser(name, crownLevel, obsidianCount = 0) {
  if (!name?.trim()) return
  const others = getUsers().filter(u => u.name !== name)
  others.unshift({ name, crownLevel: crownLevel || 'silver', obsidianCount: obsidianCount || 0 })
  localStorage.setItem(KEY, JSON.stringify(others.slice(0, MAX)))
}
