import { useEffect, useState } from 'react'
import { useGameStore, getXpProgress } from '../game/store'
import { WAVE } from '../game/constants'
import { runtime } from '../game/runtime'
import { audio } from '../audio/audio'

/** Classic MMO unit-frame bar (HP / XP / boss) */
function UnitBar({
  kind,
  ratio,
  label,
  value,
}: {
  kind: 'hp' | 'xp' | 'boss'
  ratio: number
  label: string
  value: string
}) {
  const pct = Math.max(0, Math.min(100, ratio * 100))
  return (
    <div className={`unit-bar unit-bar-${kind}`}>
      <div className="unit-bar-track">
        <span className="unit-bar-fill" style={{ width: `${pct}%` }} />
        <span className="unit-bar-gloss" />
        <span className="unit-bar-label">{label}</span>
        <span className="unit-bar-value">{value}</span>
      </div>
    </div>
  )
}

/** Subtle corner notice — never blocks the character. */
function LevelUpCelebration() {
  const levelUp = useGameStore((s) => s.levelUp)
  if (!levelUp) return null

  const fade = Math.min(1, levelUp.life / 0.45)
  const lifeRatio = levelUp.life / levelUp.maxLife

  return (
    <div
      className="notify-chip levelup-toast"
      key={levelUp.key}
      style={{ opacity: Math.min(1, fade) * (0.55 + lifeRatio * 0.45) }}
    >
      <div className="notify-chip-inner voxel-panel accent-gold">
        <span className="notify-chip-tag">Level up</span>
        <span className="notify-chip-strong">LV {levelUp.level}</span>
        <span className="notify-chip-meta">+12 Max HP · +20 Heal</span>
      </div>
    </div>
  )
}

function EventNotify() {
  const banner = useGameStore((s) => s.banner)
  const bannerKey = useGameStore((s) => s.bannerKey)
  const phase = useGameStore((s) => s.phase)
  const restTimer = useGameStore((s) => s.restTimer)
  const levelUp = useGameStore((s) => s.levelUp)
  const boss = useGameStore((s) => s.mobs.some((m) => m.alive && m.isBoss))

  if (!banner || phase === 'dead' || phase === 'victory' || phase === 'title' || levelUp) {
    return null
  }

  return (
    <div
      key={bannerKey}
      className={`event-notify ${boss ? 'is-boss' : ''} ${phase === 'waveClear' ? 'is-rest' : ''}`}
    >
      <div className={`event-notify-inner voxel-panel ${boss ? 'accent-boss' : ''}`}>
        <span className="event-notify-text">{banner}</span>
        {phase === 'waveClear' && (
          <span className="event-notify-meta">Rest {Math.ceil(restTimer)}s</span>
        )}
      </div>
    </div>
  )
}

function HurtVignette() {
  const [intensity, setIntensity] = useState(0)
  const [amount, setAmount] = useState(0)

  useEffect(() => {
    let raf = 0
    const tick = () => {
      const t = runtime.playerHurtFx
      setIntensity(t > 0 ? Math.min(1, t / 0.55) : 0)
      if (t > 0) setAmount(runtime.lastHurtAmount)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  if (intensity <= 0.02) return null

  return (
    <div className="hurt-vignette" style={{ opacity: intensity * 0.85 }} aria-hidden>
      <div className="hurt-float" style={{ opacity: intensity }}>
        -{amount}
      </div>
    </div>
  )
}

/** MMORPG-style player unit frame: portrait + name + level + bars */
function PlayerUnitFrame() {
  const player = useGameStore((s) => s.player)
  const levelUp = useGameStore((s) => s.levelUp)
  const xp = getXpProgress(player)
  const hurt = player.invuln > 0.4

  return (
    <div className={`unit-frame player-frame ${hurt ? 'hp-flash' : ''}`}>
      <div className="unit-portrait">
        <div className="unit-portrait-ring">
          <div className="unit-portrait-face" aria-hidden>
            <span className="unit-portrait-hat" />
            <span className="unit-portrait-eyes" />
          </div>
        </div>
        <span className={`unit-level-badge ${levelUp ? 'pop' : ''}`}>{player.level}</span>
      </div>

      <div className="unit-body">
        <div className="unit-name-row">
          <span className="unit-name">Hearthkeeper</span>
          <span className="unit-class">Grove Guard</span>
        </div>
        <UnitBar
          kind="hp"
          ratio={player.hp / player.maxHp}
          label="HP"
          value={`${Math.ceil(player.hp)} / ${player.maxHp}`}
        />
        <UnitBar
          kind="xp"
          ratio={xp.ratio}
          label="XP"
          value={`${xp.xp} / ${xp.need}`}
        />
      </div>
    </div>
  )
}

/** Target / boss frame — right side, MMO style */
function TargetUnitFrame() {
  const mobs = useGameStore((s) => s.mobs)
  const boss = mobs.find((m) => m.alive && m.isBoss)
  const aliveMobs = mobs.filter((m) => m.alive && !m.isBoss).length
  const wave = useGameStore((s) => s.wave)
  const nextBossWave = Math.ceil(Math.max(wave, 1) / WAVE.bossEvery) * WAVE.bossEvery

  if (boss) {
    return (
      <div className="unit-frame target-frame is-boss">
        <div className="unit-body target-body">
          <div className="unit-name-row">
            <span className="unit-name">Grove Tyrant</span>
            <span className="unit-class boss-tag">Boss</span>
          </div>
          <UnitBar
            kind="boss"
            ratio={boss.hp / boss.maxHp}
            label="HP"
            value={`${Math.ceil(boss.hp)} / ${boss.maxHp}`}
          />
        </div>
        <div className="unit-portrait target-portrait">
          <div className="unit-portrait-ring boss-ring">
            <div className="unit-portrait-face boss-face" aria-hidden>
              <span className="unit-portrait-crown" />
              <span className="unit-portrait-eyes boss-eyes" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="unit-frame target-frame is-idle">
      <div className="unit-body target-body">
        <div className="unit-name-row">
          <span className="unit-name">Grove</span>
          <span className="unit-class">Field</span>
        </div>
        <div className="target-idle-stats">
          <span>
            Spirits <strong>{aliveMobs}</strong>
          </span>
          <span>
            Boss @ <strong>W{nextBossWave}</strong>
          </span>
        </div>
      </div>
    </div>
  )
}

/** Wave / kills — top-center session strip (not inside player frame) */
function SessionStrip() {
  const wave = useGameStore((s) => s.wave)
  const kills = useGameStore((s) => s.player.kills)

  return (
    <div className="session-strip">
      <div className="session-strip-inner">
        <div className="session-stat">
          <span className="session-k">Wave</span>
          <span className="session-v">{wave}</span>
        </div>
        <div className="session-divider" />
        <div className="session-stat">
          <span className="session-k">Kills</span>
          <span className="session-v">{kills}</span>
        </div>
      </div>
    </div>
  )
}

export function HUD() {
  const phase = useGameStore((s) => s.phase)
  const player = useGameStore((s) => s.player)
  const wave = useGameStore((s) => s.wave)
  const restTimer = useGameStore((s) => s.restTimer)
  const toasts = useGameStore((s) => s.toasts)
  const startGame = useGameStore((s) => s.startGame)
  const returnToTitle = useGameStore((s) => s.returnToTitle)
  const beginNextWave = useGameStore((s) => s.beginNextWave)

  if (phase === 'title') {
    return (
      <div className="ui-root">
        <div className="title-screen">
          <div className="title-card voxel-panel accent-gold">
            <h1>Embervale</h1>
            <p className="tagline">
              Cozy voxel grove · angled top-down PvE. Calm wild spirits, then face the
              Grove Tyrant.
            </p>
            <div className="meta">
              <div>
                <strong>Move</strong> — WASD / Arrows
              </div>
              <div>
                <strong>Attack</strong> — Click or Space
              </div>
              <div>
                <strong>Dash</strong> — Shift
              </div>
              <div>
                <strong>Goal</strong> — Survive to wave 15
              </div>
            </div>
            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                audio.unlock()
                audio.play('ui-select', { volume: 0.7 })
                startGame()
              }}
            >
              Enter the Grove
            </button>
            <p className="title-attribution">
              A game by{' '}
              <a
                href="https://carlomigueldy.dev"
                target="_blank"
                rel="noopener noreferrer author"
                className="title-attribution-link"
              >
                Carlo Miguel Dy
              </a>
              <span className="title-attribution-sep">·</span>
              <a
                href="https://carlomigueldy.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="title-attribution-link"
              >
                carlomigueldy.dev
              </a>
            </p>
          </div>
          <footer className="site-credit" role="contentinfo">
            <span>Built with React · R3F · Rapier · ElevenLabs SFX</span>
            <span aria-hidden>·</span>
            <a href="https://carlomigueldy.dev" target="_blank" rel="noopener noreferrer">
              carlomigueldy.dev
            </a>
          </footer>
        </div>
      </div>
    )
  }

  return (
    <div className="ui-root">
      <div className="hud">
        <HurtVignette />

        {/* MMO layout: player frame L · session strip C · target frame R */}
        <div className="hud-frames">
          <PlayerUnitFrame />
          <SessionStrip />
          <TargetUnitFrame />
        </div>

        <EventNotify />
        <LevelUpCelebration />

        {phase === 'waveClear' && (
          <div className="wave-skip">
            <div className="wave-skip-inner voxel-panel">
              <span className="wave-skip-meta">Rest {Math.ceil(restTimer)}s</span>
              <button type="button" className="btn-primary btn-compact" onClick={beginNextWave}>
                Next wave
              </button>
            </div>
          </div>
        )}

        <div className="controls-hint voxel-panel">
          <span className="pixel-label">Controls</span>
          WASD move · Click/Space attack
          <br />
          Chain clicks for combos · Shift dash
        </div>

        <a
          className="hud-credit"
          href="https://carlomigueldy.dev"
          target="_blank"
          rel="noopener noreferrer author"
          title="Made by Carlo Miguel Dy"
        >
          carlomigueldy.dev
        </a>

        <div className="toast-stack">
          {toasts.map((t) => (
            <div key={t.id} className={`toast ${t.kind}`}>
              {t.text}
            </div>
          ))}
        </div>
      </div>

      {phase === 'dead' && (
        <div className="overlay-center">
          <div className="overlay-card voxel-panel accent-gold">
            <h1>Fallen Softly</h1>
            <p>
              Wave {wave} · {player.kills} spirits calmed. The grove will wait for another try.
            </p>
            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                audio.play('ui-select', { volume: 0.65 })
                startGame()
              }}
            >
              Rise again
            </button>
            <div>
              <button
                type="button"
                className="btn-ghost"
                onClick={() => {
                  audio.play('ui-select', { volume: 0.55 })
                  returnToTitle()
                }}
              >
                Back to title
              </button>
            </div>
            <p className="overlay-credit">
              by{' '}
              <a href="https://carlomigueldy.dev" target="_blank" rel="noopener noreferrer">
                carlomigueldy.dev
              </a>
            </p>
          </div>
        </div>
      )}

      {phase === 'victory' && (
        <div className="overlay-center">
          <div className="overlay-card voxel-panel accent-gold">
            <h1>Embervale Saved</h1>
            <p>
              You cleared {wave} waves with {player.kills} spirits laid to rest. The lanterns burn
              warm again.
            </p>
            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                audio.play('ui-select', { volume: 0.65 })
                startGame()
              }}
            >
              Play again
            </button>
            <div>
              <button
                type="button"
                className="btn-ghost"
                onClick={() => {
                  audio.play('ui-select', { volume: 0.55 })
                  returnToTitle()
                }}
              >
                Back to title
              </button>
            </div>
            <p className="overlay-credit">
              by{' '}
              <a href="https://carlomigueldy.dev" target="_blank" rel="noopener noreferrer">
                carlomigueldy.dev
              </a>
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
