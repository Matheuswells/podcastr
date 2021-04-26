//Components
import Image from 'next/image'
import Link from 'next/link'
import Head from 'next/head'

//Context
import { GetStaticProps } from 'next'
import { usePlayer } from '../contexts/playerContext'

import styles from './home.module.scss'

//Utils & Services
import { api } from '../services/api'
import { convertDurationToTimeString } from '../utils/converDurationToTimeString'
import { convertDaySizeTwoChars } from '../utils/convertDaySizeTwoChars'
import  ptBR  from 'date-fns/locale/pt-BR'
import {format, parseISO } from 'date-fns'


//Types
type Episode = { 
  id : string,
  title : string,
  members: string,
  published_at: string,
  publishedAt: string,
  durationAsString: string,
  thumbnail: string,
  file: { duration: number, url: string}
}

type HomeProps = {
  latestEpisodes: Array<Episode>,
  allEpisodes: Array<Episode>,
}

export default function Home({ latestEpisodes, allEpisodes }: HomeProps) {
  const { playList } = usePlayer()
  const episodeList = [...latestEpisodes, ...allEpisodes]

  return (
    <div className={styles.homepage}>
      
      <Head>
        <title>Podcastr</title>
      </Head>

      <section className={styles.latestEpisodes}>
      
        <h2>Ultimos lançamentos</h2>

        <ul>
           {latestEpisodes.map((episode, index) => { 
             return (
                <li key={episode.id}>
                  <Image 
                    width={192} 
                    height={192} 
                    src={episode.thumbnail} 
                    alt={episode.title}
                    objectFit="cover"
                  />

                  <div className={styles.episodeDetails}>
                      
                    <Link href={`/episode/${episode.id}`}>
                      <a>{episode.title}</a>
                    </Link>

                    <p>{episode.members}</p>
                    <span>{episode.publishedAt}</span>
                    <span>{episode.durationAsString}</span>

                  </div>

                  <button type="button" onClick={() => playList(episodeList, index) }>
                    <img src="/play-green.svg" alt="Tocar Epsodio"/>
                  </button>
                </li> 
              )
           })}
        </ul>
      </section>

      <section className={styles.allEpisodes}>
          
          <h2>Todos episodios</h2>

          <table cellSpacing={0}>
            <thead>
              <tr>
                <th></th>
                <th>Podcast</th>
                <th>Integrantes</th>
                <th>Data</th>
                <th>Duração</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {allEpisodes.map((episode, index) => {
                return (
                  <tr key={episode.id}>
                    <td style={{ width: 72}}>
                      <Image 
                        width={120}
                        height={120}
                        src={episode.thumbnail}
                        objectFit='cover'
                        alt={episode.title}
                      />
                    </td>
                    <td>
                      <Link href={`/episode/${episode.id}`}>
                        <a>{episode.title}</a>
                      </Link>   
                    </td>
                    <td>{episode.members}</td>
                    <td style={{ width: 100}}>{episode.publishedAt}</td>
                    <td>{episode.durationAsString}</td>
                    <td>  
                      <button onClick={() => playList(episodeList, index + latestEpisodes.length)}>
                        <img src="/play-green.svg" alt="Tocar episodio"/>
                      </button>   
                    </td>
                  </tr>
                    )
                  })}
            </tbody>
          </table>
      </section>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  //Consume Api
  const { data } = await api.get('episodes', { 
    params: {
      _limit: 12,
      _sord: 'published_at',
      _order: 'desc'
    }
  })
  //Map the data to Type Episode
  const episodes = data.map((episode: Episode) => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: convertDaySizeTwoChars(format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBR} )),
      durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
      file: { 
        url: episode.file.url,
        duration: Number(episode.file.duration),
      }
    } 
  })

  const latestEpisodes = episodes.slice(0,2)
  const allEpisodes = episodes.slice(2, episodes.length)

  return {
    props: { 
      latestEpisodes,
      allEpisodes
    }, 
    revalidate: 60 * 60 
  }
 }
