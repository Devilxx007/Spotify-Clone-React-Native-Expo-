import { createContext, useState } from 'react'
const Player = createContext()

const PlayerContext = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null)
  const [progress, setprogress] = useState(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [totalDuration, setTotalDuration] = useState(0)
  const [currentSound, setCurrentSound] = useState(null)
  return (
    <Player.Provider
      value={{
        currentTrack,
        setCurrentTrack,
        progress,
        setprogress,
        currentTime,
        setCurrentTime,
        totalDuration,
        setTotalDuration,
        currentSound,
        setCurrentSound
      }}
    >
      {children}
    </Player.Provider>
  )
}

export { PlayerContext, Player }
