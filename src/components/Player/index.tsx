import { useEffect, useRef, useState } from 'react'
import { usePlayer } from '../../contexts/playerContext'
import styles from './styles.module.scss'
import Image from 'next/image'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import { convertDurationToTimeString } from '../../utils/converDurationToTimeString'

export default function Player(){

    const audioRef = useRef<HTMLAudioElement>(null)
    const [progress, setProgress] = useState(0)

    const { 
        episodeList, 
        currentEpisodeIndex, 
        isPlaying,
        isLooping,
        isShuffling,
        hasPrev,
        hasNext,
        togglePlay, 
        toggleLoop, 
        toggleShuffle,
        playNext,
        playPrev,
        setPlayingState,
        clearPlayerState
        } = usePlayer()

    const episode = episodeList[currentEpisodeIndex]

    
    function setupProgressListener(){
        audioRef.current.currentTime = 0
        audioRef.current.addEventListener('timeupdate', () => {
            setProgress(Math.floor(audioRef.current.currentTime))
        })
    }

    function handleSeek(amount: number){
        audioRef.current.currentTime = amount
        setProgress(amount)
    }

    function handleEpisodeEnded () { 
        if(hasNext){
            playNext()
        } else {
            clearPlayerState()
        }
    }

    useEffect(() =>{
        if(!audioRef.current){
            return
        }

        if(isPlaying){
            audioRef.current.play()
            
            
        } else {
            audioRef.current.pause()
            console.log(Math.round(audioRef.current.currentTime))
        }
    }, [isPlaying])

    return(
       <div className={styles.playerContainer}>
           <header>
               <img src="/playing.svg" alt="Tocando Agora"/>
               <strong>Tocando agora</strong>
           </header>

           { episode ? (
                <div className={styles.currentEpisode}>

                    <Image
                        width={592} 
                        height={592} 
                        src={episode.thumbnail} 
                        objectFit="cover"/>

                    <strong>{episode.title}</strong>
                    <span>{episode.members}</span>

                </div>

                ) : (

               <div className={styles.emptyPlayer}>
                    <strong>Selecione um podcast para ouvir</strong>
               </div>
                )
           }
          
           <footer className={!episode ? styles.empty: ''}>
               <div className={styles.progress}>
               <span>{convertDurationToTimeString(progress)}</span>
                   
                   <div className={styles.slider}>
                        {episode ? (
                            <Slider
                                max={episode.file.duration}
                                value={progress}
                                onChange={handleSeek}
                                trackStyle={{backgroundColor:'#04d361'}}
                                railStyle={{backgroundColor: '#9f75ff'}}
                                handleStyle={{borderColor:'#04d361', borderWidth: 4}}
                            />
                        ) : (
                            <div className={styles.emptySlider}/>
                        )}
                   </div>

                   <span>{convertDurationToTimeString(episode?.file.duration ?? 0 )}</span>
               </div>

            { episode && (
                <audio 
                src={episode.file.url} 
                ref={audioRef} 
                onPlay={()=>{setPlayingState(true)}} 
                onPause={()=>{setPlayingState(false)}}
                onEnded={handleEpisodeEnded}
                loop={isLooping}
                onLoadedMetadata={setupProgressListener}
                autoPlay/>
            ) }
               <div className={styles.buttons}>
                   <button
                    type="button" 
                    disabled={!episode || episodeList.length === 1} 
                    onClick={toggleShuffle} 
                    className={isShuffling ? styles.isActive : ''}>
                       <img src="/shuffle.svg" alt="Embaralhar"/>
                   </button>

                   <button 
                    type="button" 
                    disabled={!episode || !hasPrev}>
                       <img 
                        src="/play-previous.svg" 
                        alt="Tocar anterior" 
                        onClick={playPrev}/>
                   </button>

                   <button 
                        type="button"
                        className={styles.playButton} 
                        disabled={!episode}  
                        onClick={togglePlay}>
                        { isPlaying ? <img src="/pause.svg" alt="Pausar episdio"/>
                         : <img src="/play.svg" alt="Tocar Episodio"/>
                         }
                   </button>
                   <button 
                   type="button" 
                   disabled={!episode || !hasNext}>
                       <img 
                        src="/play-next.svg"
                        alt="Tocar proxima" 
                        onClick={playNext}/>
                   </button>

                   <button 
                    type="button" 
                    disabled={!episode} 
                    onClick={toggleLoop} 
                    className={isLooping ? styles.isActive: ''}>
                       <img src="/repeat.svg" alt="Repetir"/>
                   </button>

               </div>
           </footer>
       </div>
    )
}