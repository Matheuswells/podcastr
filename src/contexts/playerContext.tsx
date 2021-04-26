import { createContext, useState, useContext,  ReactNode } from 'react'

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
  isLooping: boolean,
  isShuffling: boolean,
  hasPrev: boolean,
  hasNext: boolean,
  play: (episode: Episode) => void,
  playList: (list: Array<Episode>, index: number) => void,
  setPlayingState: (state: boolean) => void
  togglePlay: () => void,
  toggleLoop: () => void,
  toggleShuffle: () => void,
  playNext: () => void,
  playPrev: () => void,
  clearPlayerState: () => void,
}

export const PlayerContext = createContext({} as PlayerContextData)

type PlayerContextProviderProps =  {
  children: ReactNode  
}

export function PlayerContextProvider ({ children }: PlayerContextProviderProps) {
  
  const [ episodeList, setEpisodeList ] = useState([])
  const [ currentEpisodeIndex, setCurrentEpisodeIndex ] = useState(0)
  const [ isPlaying, setIsPlaying ] = useState(false)
  const [ isLooping, setIsLooping ] = useState(false)
  const [ isShuffling, setIsShuffling ] = useState(false)
  
  
  function play(episode){
    setEpisodeList([episode])
    setCurrentEpisodeIndex(0)
    setIsPlaying(true)
  }
  
  function playList(list: Array<Episode>, index: number){
    setEpisodeList(list)
    setCurrentEpisodeIndex(index)
    setIsPlaying(true)
  }

  const hasPrev = currentEpisodeIndex > 0
  const hasNext = isShuffling || (currentEpisodeIndex + 1) < episodeList.length
  
  function playNext(){
    if(isShuffling){
      const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length)
      return setCurrentEpisodeIndex(nextRandomEpisodeIndex)
    }

    if(hasNext) return setCurrentEpisodeIndex(currentEpisodeIndex + 1)
  }

  function playPrev(){

    if(hasPrev){//1 ?  
      setCurrentEpisodeIndex(currentEpisodeIndex - 1)
    }

  }
  
  function togglePlay(){
    setIsPlaying(!isPlaying)
  }

  function toggleLoop(){
    setIsLooping(!isLooping)

  }

  function toggleShuffle() { setIsShuffling(!isShuffling) }
  
  function setPlayingState(state: boolean) {
    setIsPlaying(state)
  }


  function clearPlayerState() {
    setEpisodeList([])
    setCurrentEpisodeIndex(0)
  }
  
  return (
    <PlayerContext.Provider 
    value={{ 
      episodeList, 
      currentEpisodeIndex, 
      hasPrev,
      hasNext,
      isPlaying,
      isLooping,
      isShuffling,
      play,
      playList, 
      togglePlay, 
      toggleLoop,
      toggleShuffle,
      setPlayingState, 
      playNext, 
      playPrev,
      clearPlayerState,
      }} >
      {children}
      </PlayerContext.Provider>
      )
}

export const usePlayer = () => { 
  return useContext(PlayerContext)
}