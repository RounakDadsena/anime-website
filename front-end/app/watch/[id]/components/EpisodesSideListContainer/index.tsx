"use client"
import React, { useEffect, useState } from 'react'
import styles from "./component.module.css"
import { MediaEpisodes, MediaInfo, MediaSearchResult } from '@/app/ts/interfaces/apiGogoanimeDataInterface'
import gogoanime from '@/api/gogoanime'
import Link from 'next/link'
import Image from 'next/image'
import ButtonMarkEpisodeAsWatched from '@/app/components/ButtonMarkEpisodeAsWatched'
import { stringToUrlFriendly } from '@/app/lib/convertStringToUrlFriendly'

function EpisodesSideListContainer({ mediaId, mediaTitle, episodeId }: { mediaId: number, mediaTitle: string, episodeId: string }) {

    const [mediaData, setMediaData] = useState<MediaInfo>()
    const [episodesList, setEpisodesList] = useState<MediaEpisodes[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)

    async function loadData() {

        setIsLoading(true)
        const query = stringToUrlFriendly(mediaTitle)

        let response = await gogoanime.getInfoFromThisMedia(query, "anime") as MediaInfo

        if (response == null) {
            const searchResultsForMedia = await gogoanime.searchMedia(query, "anime") as MediaSearchResult[]

            // try to found a result that matches the title from anilist on gogoanime (might work in some cases)
            const closestResult = searchResultsForMedia.find((item) => item.id.includes(query + "-tv"))

            response = await gogoanime.getInfoFromThisMedia(closestResult?.id || searchResultsForMedia[0].id, "anime") as MediaInfo
        }

        setMediaData(response)
        setEpisodesList(response.episodes)

        setIsLoading(false)

    }

    useEffect(() => {

        // focus list item that correspond to current episode on page
        if (!isLoading) {
            const elementActive = document.querySelector("li[data-active=true]")
            elementActive?.scrollIntoView();
        }

        if (episodesList.length == 0) loadData()

    }, [mediaTitle, isLoading, episodeId])

    return (
        <div id={styles.episodes_list_container}>

            <h3>EPISODES</h3>

            <ol id={styles.list_container} data-loading={isLoading}>

                {isLoading && (
                    <>
                        <li className={styles.item_placeholder}></li>
                        <li className={styles.item_placeholder}></li>
                        <li className={styles.item_placeholder}></li>
                        <li className={styles.item_placeholder}></li>
                    </>
                )}

                {isLoading == false && (

                    episodesList?.map((item, key: number) => (
                        <li key={key} data-active={item.id == episodeId}>

                            <Link href={`/watch/${mediaId}?q=${item.id}`}>

                                <div className={styles.img_container}>

                                    <Image src={mediaData?.image as string} alt={mediaData?.title as string} fill></Image>

                                </div>

                            </Link>

                            <div className={styles.episode_info_container}>

                                <Link href={`/watch/${mediaId}?q=${item.id}`}>
                                    <h4>Episode {item.number}</h4>

                                </Link>

                                <ButtonMarkEpisodeAsWatched
                                    data={item}
                                    mediaId={mediaId}
                                    source={'gogoanime'}
                                    hasText={true}
                                />

                            </div>

                        </li>
                    ))
                )}

            </ol>

        </div >
    )
}

export default EpisodesSideListContainer