// API client — stub only (not yet wired to store).
// All future API calls must go through this module.
// Set VITE_API_BASE_URL in .env for production; omit for local dev (Vite proxy handles it).

const BASE = import.meta.env.VITE_API_BASE_URL || ''

async function request(method, path, body) {
  const url = BASE + path
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
  }
  if (body !== undefined) options.body = JSON.stringify(body)

  const res = await fetch(url, options)
  const data = await res.json().catch(() => null)

  if (!res.ok) {
    const message = data?.error || `HTTP ${res.status}`
    throw new Error(message)
  }

  return data
}

// ── Tasks ─────────────────────────────────────────────────────
export const getTasks    = ()           => request('GET',    '/api/tasks')
export const createTask  = (body)       => request('POST',   '/api/tasks', body)
export const updateTask  = (id, body)   => request('PUT',    `/api/tasks/${id}`, body)
export const deleteTask  = (id)         => request('DELETE', `/api/tasks/${id}`)

// ── History ───────────────────────────────────────────────────
export const getHistory    = ()     => request('GET',    '/api/history')
export const createHistory = (body) => request('POST',   '/api/history', body)
export const deleteHistory = (id)   => request('DELETE', `/api/history/${id}`)

// ── Profile ───────────────────────────────────────────────────
export const getProfile    = ()       => request('GET',  '/api/profile')
export const updateTheme   = (theme)  => request('PUT',  '/api/profile/theme', { theme })
export const updateName    = (name)   => request('PUT',  '/api/profile/name',  { name })
export const resetProfile  = ()       => request('POST', '/api/profile/reset')

// ── Health ────────────────────────────────────────────────────
export const health = () => request('GET', '/api/health')
