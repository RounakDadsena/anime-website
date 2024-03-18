import React from 'react'
import styles from "./page.module.css"
import { ApiDefaultResult, ApiMediaResults } from '../../ts/interfaces/apiAnilistDataInterface'
import gogoanime from '@/api/gogoanime'
import anilist from '@/api/anilist'
import CardMediaCoverAndDescription from '@/app/components/CardMediaCoverAndDescription'
import { EpisodeLinksGoGoAnime, MediaEpisodes, MediaInfo, MediaSearchResult } from '@/app/ts/interfaces/apiGogoanimeDataInterface'
import EpisodesSideListContainer from './components/EpisodesSideListContainer'
import CommentSectionContainer from '@/app/components/CommentSectionContainer'
import aniwatch from '@/api/aniwatch'
import Player from './components/VideoPlayer'
import { EpisodeLinksAnimeWatch, EpisodesFetchedAnimeWatch } from '@/app/ts/interfaces/apiAnimewatchInterface'
import simulateRange from '@/app/lib/simulateRange'
import { stringToUrlFriendly } from '@/app/lib/convertStringToUrlFriendly'

export async function generateMetadata({ params, searchParams }: {
    params: { id: number }, // ANILIST ANIME ID
    searchParams: { episode: string, source: string, q: string } // EPISODE NUMBER, SOURCE, EPISODE ID
}) {

    const mediaData = await anilist.getMediaInfo(params.id) as ApiDefaultResult

    return {
        title: `Watching EP ${searchParams.episode} - ${mediaData.title.romaji} | AniProject`,
        description: `Watch ${mediaData.title.romaji}, episode ${searchParams.episode}. ${mediaData.description && mediaData.description}}`,
    }
}

async function WatchEpisode({ params, searchParams }: {
    params: { id: number }, // ANILIST ANIME ID
    searchParams: { episode: string, source: string, q: string, t: string } // EPISODE NUMBER, SOURCE, EPISODE ID, TIME LAST STOP
}) {

    const mediaData = await anilist.getMediaInfo(params.id) as ApiMediaResults

    let episodeData

    // fetch episode data
    if (searchParams.source == "gogoanime") {

        episodeData = await gogoanime.getLinksForThisEpisode(searchParams.q) as EpisodeLinksGoGoAnime

    }
    else {

        episodeData = await aniwatch.episodesLinks(searchParams.q) as EpisodeLinksAnimeWatch

    }

    let videoSrc: string

    // fetch episode link source
    if (searchParams.source == "gogoanime") {

        videoSrc = (episodeData as EpisodeLinksGoGoAnime).sources.find(item => item.quality == "default").url

        if (!videoSrc) videoSrc = (episodeData as EpisodeLinksGoGoAnime).sources[0].url

    }
    else {
        videoSrc = episodeData.sources[0].url
    }

    let episodes
    // fetch episodes for this media
    let response: MediaInfo | EpisodesFetchedAnimeWatch | { episodes: MediaEpisodes[] } | null

    if (searchParams.source == "gogoanime") {

        response = await gogoanime.getInfoFromThisMedia(mediaData.title.romaji, "anime") as MediaInfo
        let searchResultsForMedia: any[]
        let closestResult: MediaSearchResult | undefined

        if (response == null) {
            searchResultsForMedia = await gogoanime.searchMedia(stringToUrlFriendly(mediaData.title.romaji), "anime") as MediaSearchResult[]

            // try to found a result that matches the title from anilist on gogoanime (might work in some cases)
            closestResult = searchResultsForMedia.find((item) => item.id.includes(mediaData.title.romaji + "-tv"))

            response = await gogoanime.getInfoFromThisMedia(closestResult?.id || searchResultsForMedia[0].id, "anime") as MediaInfo

        }

        // work around the api not return episodes
        if (response.episodes.length == 0) {

            const episodes: MediaEpisodes[] = []

            simulateRange(mediaData.nextAiringEpisode ?
                mediaData.nextAiringEpisode.episode - 1 : mediaData.episodes as number)
                .map((item, key) => (

                    episodes.push({
                        number: key + 1,
                        id: `${((response as MediaInfo)?.id || closestResult?.id || searchResultsForMedia[0].id).toLowerCase()}-episode-${key + 1}`,
                        url: ""
                    })

                ))

            response = { episodes: episodes }

        }
    }
    else {

        response = await aniwatch.getEpisodes(
            searchParams.q.slice(0, searchParams?.q.search(/\bep\b/))
                .slice(0, searchParams.q.slice(0, searchParams?.q.search(/\bep\b/)).length - 1)) as EpisodesFetchedAnimeWatch

    }

    episodes = response!.episodes

    let nextEpisodeSrc
    // find next episode
    if (episodes) {

        nextEpisodeSrc = episodes.find(item => item.number == (Number(searchParams.episode) + 1))

        if (nextEpisodeSrc) {

            if (searchParams.source == "gogoanime") {

                nextEpisodeSrc = (episodeData as EpisodeLinksGoGoAnime).sources.find(item => item.quality == "default").url

                if (!nextEpisodeSrc) nextEpisodeSrc = (episodeData as EpisodeLinksGoGoAnime).sources[0].url

            }
            else {
                nextEpisodeSrc = episodeData.sources[0].url
            }
        }

    }

    return (
        <main id={styles.container}>

            {/* PLAYER */}
            <div className={styles.background}>
                <section id={styles.video_container}>
                    <Player
                        source={videoSrc}
                        currentLastStop={searchParams.t || undefined}
                        mediaSource={searchParams.source}
                        media={mediaData}
                        episodeIntro={(episodeData as EpisodeLinksAnimeWatch)?.intro}
                        episodeOutro={(episodeData as EpisodeLinksAnimeWatch)?.outro}
                        episodeNumber={searchParams.episode}
                        nextEpisodeSrc={nextEpisodeSrc}
                        episodeId={searchParams.q}
                        subtitles={searchParams.source == "gogoanime" ? undefined : (episodeData as EpisodeLinksAnimeWatch).tracks}
                        videoQualities={searchParams.source == "gogoanime" ? (episodeData as EpisodeLinksGoGoAnime).sources : undefined}
                    />
                </section>
            </div>

            <section id={styles.media_info_container}>

                <div id={styles.info_comments}>

                    <div id={styles.heading_info_container}>

                        {mediaData.format == "MOVIE" ? (
                            <h1 className='display_flex_row align_items_center'>{mediaData.title.romaji || mediaData.title.native}</h1>
                        ) : (
                            <h1 className='display_flex_row align_items_center'>
                                Episode {searchParams.episode}
                                <span>{" "}-{" "}</span>
                                <span>{mediaData.title.romaji || mediaData.title.native}</span>
                            </h1>
                        )}

                        <CardMediaCoverAndDescription data={mediaData as ApiDefaultResult} showButtons={false} />

                    </div>

                    <div className={styles.only_desktop}>

                        <div className={styles.comment_container}>

                            <h2>COMMENTS {mediaData.format != "MOVIE" && (`FOR EPISODE ${searchParams.episode}`)}</h2>

                            {/* ONLY ON DESKTOP */}
                            <CommentSectionContainer
                                media={mediaData}
                                onWatchPage={true}
                                episodeId={searchParams.q}
                                episodeNumber={Number(searchParams.episode)}
                            />
                        </div>

                    </div>

                </div>

                <div data-format={mediaData.format}>

                    {mediaData.format != "MOVIE" && (
                        <EpisodesSideListContainer
                            source={searchParams.source}
                            episodesList={episodes}
                            mediaId={params.id}
                            activeEpisodeNumber={Number(searchParams.episode)}
                        />
                    )}

                    {/* ONLY ON MOBILE */}
                    <div className={styles.only_mobile}>

                        <div className={styles.comment_container}>

                            <h2>COMMENTS {mediaData.format != "MOVIE" && (`FOR EPISODE ${searchParams.episode}`)}</h2>

                            <CommentSectionContainer
                                media={mediaData}
                                onWatchPage={true}
                                episodeId={searchParams.q}
                                episodeNumber={Number(searchParams.episode)}
                            />

                        </div>

                    </div>

                </div>

            </section>

        </main>
    )
}

export default WatchEpisode