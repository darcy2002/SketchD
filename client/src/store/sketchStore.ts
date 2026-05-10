import { create } from 'zustand'

interface SketchStore {
  // generation state
  code: string
  isStreaming: boolean
  error: string | null
  abortController: AbortController | null

  // mode
  mode: 'fresh' | 'refine'
  previousCode: string | null

  // provider display
  provider: string

  // actions
  startGeneration: (imageBase64: string) => Promise<void>
  appendToken: (token: string) => void
  stopGeneration: () => void
  setError: (msg: string | null) => void
  resetCode: () => void
  setCode: (code: string) => void
  toggleRefineMode: () => void
}

export const useSketchStore = create<SketchStore>((set, get) => ({
  code: '',
  isStreaming: false,
  error: null,
  abortController: null,
  mode: 'fresh',
  previousCode: null,
  provider: 'nvidia',

  startGeneration: async (imageBase64: string) => {
    const { abortController: existing, mode, previousCode } = get()

    if (existing) {
      existing.abort()
    }

    set({ code: '', isStreaming: true, error: null })

    const controller = new AbortController()
    set({ abortController: controller })

    let accumulatedCode = ''

    try {
      const response = await fetch('http://localhost:3001/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64, mode, previousCode }),
        signal: controller.signal,
        cache: 'no-store',
        keepalive: false,
      })

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`)
      }

      if (!response.body) {
        throw new Error('No response body')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''

        for (const line of lines) {
          const trimmed = line.trim()
          if (!trimmed.startsWith('data: ')) continue

          const payload = trimmed.slice(6)
          if (payload === '[DONE]') {
            const cleaned = accumulatedCode
              .replace(/^\s*```[\w]*\n?/, '')
              .replace(/```\s*$/, '')
              .trim()
            if (cleaned !== accumulatedCode) {
              set({ code: cleaned })
              accumulatedCode = cleaned
            }
            if (mode === 'fresh' && accumulatedCode) {
              set({ previousCode: accumulatedCode })
            }
            return
          }

          try {
            const parsed = JSON.parse(payload)
            if (parsed.token) {
              get().appendToken(parsed.token)
              accumulatedCode += parsed.token
            }
            if (parsed.error) {
              get().setError(parsed.error)
            }
          } catch {
            // malformed chunk — skip
          }
        }
      }
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        set({ error: err.message })
      }
    } finally {
      set({ isStreaming: false, abortController: null })
    }
  },

  appendToken: (token: string) => {
    set((state) => ({ code: state.code + token }))
  },

  stopGeneration: () => {
    get().abortController?.abort()
    set({ isStreaming: false })
  },

  setError: (msg: string | null) => {
    set({ error: msg })
  },

  resetCode: () => {
    set({ code: '' })
  },

  setCode: (code: string) => {
    set({ code })
  },

  toggleRefineMode: () => {
    set((state) => ({
      mode: state.mode === 'fresh' ? 'refine' : 'fresh',
      previousCode: state.mode === 'refine' ? null : state.previousCode,
    }))
  },
}))
