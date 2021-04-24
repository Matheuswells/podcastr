import { useContext, useEffect, useRef } from 'react'
import { PlayerContext } from '../../contexts/playerContext'
import styles from './styles.module.scss'
import Image from 'next/image'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'

export default function Player(){

    const audioRef = useRef<HTMLAudioElement>(null)

    const { 
        episodeList, 
        currentEpisodeIndex, 
        isPlaying, 
        play, 
        togglePlay, 
        setPlayingState} = useContext(PlayerContext)

    const episode = episodeList[currentEpisodeIndex]

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
    })

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
                   <span>00:00</span>
                   
                   <div className={styles.slider}>
                        {episode ? (
                            <Slider
                                trackStyle={{backgroundColor:'#04d361'}}
                                railStyle={{backgroundColor: '#9f75ff'}}
                                handleStyle={{borderColor:'#04d361', borderWidth: 4}}
                            />
                        ) : (
                            <div className={styles.emptySlider}/>
                        )}
                   </div>

                   <span>00:00</span>
               </div>

            { episode && (
                <audio 
                src={episode.file.url} 
                ref={audioRef} 
                onPlay={()=>{setPlayingState(true)}} 
                onPause={()=>{setPlayingState(false)} }
                autoPlay/>
            ) }
               <div className={styles.buttons}>
                   <button type="button" disabled={!episode}>
                       <img src="/shuffle.svg" alt="Embaralhar"/>
                   </button>
                   <button type="button" disabled={!episode}>
                       <img src="/play-previous.svg" alt="Tocar anterior"/>
                   </button>
                   <button 
                        type="button"
                        className={styles.playButton} 
                        disabled={!episode}  
                        onClick={togglePlay}>
                        { isPlaying ? <img src="/pause.svg" alt="tocar"/>
                         : <img src="/play.svg" alt="tocar"/>
                         }
                   </button>
                   <button type="button" disabled={!episode}>
                       <img src="/play-next.svg" alt="Tocar proxima"/>
                   </button>
                   <button type="button" disabled={!episode}>
                       <img src="/repeat.svg" alt="Repetir"/>
                   </button>
               </div>
           </footer>
       </div>
    )
}