import { GameCanvas } from './components/GameCanvas'
import { HUD } from './ui/HUD'

export default function App() {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <GameCanvas />
      <HUD />
    </div>
  )
}
