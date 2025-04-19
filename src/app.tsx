import { useState } from 'preact/hooks'
import { JSX } from 'preact/jsx-runtime'
import './app.css'
import logo from './assets/logo.png'

type Layout = 'colemak' | 'dh'
type Keymap = Record<string, string>

const keymaps: Record<Layout, Keymap> = {
  colemak: {
    'q': 'q', 'w': 'w', 'f': 'e', 'p': 'r', 'g': 't',
    'j': 'y', 'l': 'u', 'u': 'i', 'y': 'o', ';': 'p',
    'a': 'a', 'r': 's', 's': 'd', 't': 'f', 'd': 'g',
    'h': 'h', 'n': 'j', 'e': 'k', 'i': 'l', 'o': ';',
    'z': 'z', 'x': 'x', 'c': 'c', 'v': 'v', 'b': 'b',
    'k': 'n', 'm': 'm'
  },
  dh: {
    'q': 'q', 'w': 'w', 'f': 'e', 'p': 'r', 'b': 't',
    'j': 'y', 'l': 'u', 'u': 'i', 'y': 'o', ';': 'p',
    'a': 'a', 's': 's', 'r': 'd', 't': 'f', 'g': 'g',
    'm': 'h', 'n': 'j', 'e': 'k', 'i': 'l', 'o': ';',
    'z': 'z', 'x': 'x', 'c': 'c', 'd': 'v', 'v': 'b',
    'k': 'n', 'h': 'm'
  }
}

function invertKeymap(map: Keymap): Keymap {
  const inverted: Keymap = {}
  for (const key in map) {
    inverted[map[key]] = key
  }
  return inverted
}

function translate(input: string, layout: Layout): string {
  const map = invertKeymap(keymaps[layout])
  return input.split('').map(char => {
    const lower = char.toLowerCase()
    const mapped = map[lower] || char
    return char === lower ? mapped : mapped.toUpperCase()
  }).join('')
}

export function App(): JSX.Element {
  const [input, setInput] = useState<string>('')
  const [layout, setLayout] = useState<Layout>('colemak')
  const [copied, setCopied] = useState<boolean>(false)

  const output = translate(input, layout)

  const handleCopy = () => {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div class="min-h-screen bg-gray-900 text-white p-6 flex justify-center">
      <div class="flex justify-center">
      <img src={logo} alt="Logo" style={{ height: '256px', width: 'auto' }} class="mx-auto mb-4" />
    </div>
      <div class="w-full max-w-5xl grid gap-6">
        {/* Radio buttons */}
        <div class="flex gap-6 text-sm">
          <label class="flex items-center gap-1">
            <input
              type="radio"
              name="layout"
              value="colemak"
              checked={layout === 'colemak'}
              onChange={() => setLayout('colemak')}
            />
            Fix Colemak
          </label>
          <label class="flex items-center gap-1">
            <input
              type="radio"
              name="layout"
              value="dh"
              checked={layout === 'dh'}
              onChange={() => setLayout('dh')}
            />
            Fix DH
          </label>
        </div>

        {/* Textareas with 16:9 ratio */}
        <div class="grid md:grid-cols-2 gap-6">
          <div class="aspect-[16/9]">
            <textarea
              class="p-3 bg-gray-800 rounded-lg w-full h-full resize-none"
              placeholder="Paste mistyped text here..."
              value={input}
              onInput={(e: JSX.TargetedEvent<HTMLTextAreaElement, Event>) =>
                setInput(e.currentTarget.value)
              }
            />
          </div>

          <div class="aspect-[16/9] flex flex-col">
            <div class="flex justify-between items-center mb-1">
              <label class="text-sm font-medium">Fixed Output</label>
              <button
                onClick={handleCopy}
                class="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
              >
                {copied ? 'Copied!' : 'Copy Text'}
              </button>
            </div>
            <textarea
              class="p-3 bg-gray-800 rounded-lg w-full h-full resize-none flex-1"
              value={output}
              readOnly
            />
          </div>
        </div>

        {/* Live View */}
        <div>
          <label class="block font-semibold mb-2">Live View</label>
          <div class="p-4 bg-gray-800 rounded-lg min-h-[6rem] whitespace-pre-wrap text-sm">
            {output
              ? output.split('\n').map((line, i) => (
                  <span key={i}>
                    {line}
                    <br />
                  </span>
                ))
              : <span class="text-gray-500">Output appears here as you type...</span>}
          </div>
        </div>
      </div>
    </div>
  )
}
