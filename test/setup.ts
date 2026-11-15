import { vi } from 'vitest'

// Mock Supabase for tests
declare global {
  var createSupabaseClient: ReturnType<typeof vi.fn>
  var createServerClient: ReturnType<typeof vi.fn>
  var createBrowserClient: ReturnType<typeof vi.fn>
}

global.createSupabaseClient = vi.fn()
global.createServerClient = vi.fn()
global.createBrowserClient = vi.fn()

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})