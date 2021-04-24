import { createContext, useState, ReactNode } from 'react'


type Episode = {
  id: string,
  title: string,
  members:string,
  thumbnail: string,
  file: { duration: number, url: string}
}


type PlayerContextData = {
  episodeList: Array<Episode>,
  currentEpisodeIndex: number, 
  isPlaying: boolean,
  play: (episode: Episode) => void,
  setPlayingState: (state: boolean) => void
  togglePlay: () => void,
}

export const PlayerContext = createContext({} as PlayerContextData)


type PlayerContextProviderProps =  {
  children: ReactNode
  
}

export function PlayerContextProvider ({ children }: PlayerContextProviderProps) {
  
  const [ episodeList, setEpisodeList ] = useState([])
  const [ currentEpisodeIndex, setCurrentEpisodeIndex ] = useState(0)
  const [ isPlaying, setIsPlaying ] = useState(false)
  
  
  function play(episode){
    setEpisodeList([episode])
    setCurrentEpisodeIndex(0)
    setIsPlaying(true)
  }
  
  function playList(list: Array<Episode>, index: number){
    setEpisodeList(list)
    setCurrentEpisodeIndex(index)
    
  }
  
  
  function togglePlay(){
    setIsPlaying(!isPlaying)
    
  }
  
  function setPlayingState(state: boolean) {
    setIsPlaying(state)
  }
  
  return (
    <PlayerContext.Provider 
    value={{ 
      episodeList, 
      currentEpisodeIndex, 
      play, 
      togglePlay, 
      setPlayingState, 
      isPlaying}} >
      {children}
      </PlayerContext.Provider>
      
      )
    }