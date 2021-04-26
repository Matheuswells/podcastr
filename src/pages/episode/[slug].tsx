import {format, parseISO } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { GetStaticPaths, GetStaticProps } from 'next'
import { api } from '../../services/api'
import { convertDurationToTimeString } from '../../utils/converDurationToTimeString'
import styles from './episode.module.scss'
import Image from 'next/image'
import Link from 'next/link'
import Head from 'next/head'
import { usePlayer } from '../../contexts/playerContext'

type Episode = { 
    id : string,
    title : string,
    members: string,
    published_at: string,
    publishedAt: string,
    durationAsString: string,
    thumbnail: string,
    description: string,
    file: { duration: number, url: string},
}

type EpisodeProps = {
    episode: Episode
}

export default function Episode({ episode }: EpisodeProps){

    const { episodeList, currentEpisodeIndex, isPlaying, togglePlay, play } = usePlayer()
    const currentEpisode = episodeList[currentEpisodeIndex]
    return(
        <div className={styles.episode}>
            <Head>
                <title>{episode.title}</title>
            </Head>
            <div className={styles.thumbnailContainer}>
                <Link href="/">
                    <button type="button">
                        <img src="/arrow-left.svg" alt="Voltar"/>
                    </button>
                </Link>
                <Image 
                    width={700}
                    height={160}
                    src={episode.thumbnail}
                    objectFit="cover"
                    />
                <button type="button" onClick={() => {


                    episodeList.length > 0 ? ()=>{
                        
                        if(currentEpisode.id == episode.id){
                            togglePlay()
                        } else {
                            isPlaying ? togglePlay() : play(episode)
                        }   

                    }
                    
                    : play(episode)

                    

                }}>
                    { isPlaying ? 
                    <img src="/pause.svg" alt="Pausar episodio"/> :
                        <img src="/play.svg" alt="Tocar episodio"/>
                    }
                </button>
            </div>
            <header>

                <h1>{episode.title}</h1>
                <span>{episode.members}</span>
                <span>{episode.publishedAt}</span>
                <span>{episode.durationAsString}</span>
            </header>
            <div className={styles.description} dangerouslySetInnerHTML={{__html: episode.description}} />
        </div>
    )
}


export const getStaticPaths: GetStaticPaths = async () => { 
    return {
        paths:[],
        fallback: 'blocking'
    }    
}

export const getStaticProps: GetStaticProps = async (ctx) => {
    const { slug } = ctx.params
    const { data } = await api.get(`/episodes/${slug}`)

    const episode = { 

        id: data.id,
        title: data.title,
        thumbnail: data.thumbnail,
        members: data.members,
        publishedAt: format(parseISO(data.published_at), 'd MMM yy', { locale: ptBR} ),
        durationAsString: convertDurationToTimeString(Number(data.file.duration)),
        description: data.description,
        file: { 
            url: data.file.url,
            duration: data.file.duration,
        }
    }

    return {
        props: { episode},
        revalidate: 60 * 60 * 24 //24 hours
    }
}

