import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// jsdom não implementa matchMedia nem ResizeObserver.
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }),
})

globalThis.ResizeObserver ??= class {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Usado por BlurText, ShinyText e Orb (React Bits).
globalThis.IntersectionObserver ??= class {
  readonly root = null
  readonly rootMargin = '0px'
  readonly thresholds = [0]
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return []
  }
} as unknown as typeof IntersectionObserver

// Geometria de SVG usada pelo Moving Border (Aceternity); jsdom não implementa.
const svgProto = (globalThis.SVGElement ?? function () {}).prototype as unknown as Record<string, unknown>
svgProto.getTotalLength ??= () => 0
svgProto.getPointAtLength ??= () => ({ x: 0, y: 0 })

afterEach(() => {
  cleanup()
  localStorage.clear()
})
