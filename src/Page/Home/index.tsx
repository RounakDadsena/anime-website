import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import * as C from './styles'
import API from '../../API/anilist'
import HeadingContent from '../../Components/Home/HeadingContent'
import AnimesReleasingThisWeek from '../../Components/Home/AnimesReleasingThisWeekList'
import { ReactComponent as ArrowLeftSvg } from '../../imgs/svg/arrow-left-short.svg'
import Trending from '../../Components/Home/Trending'

export default function Home() {

  const [indexInnerPageLink, setIndexInnerPageLink] = useState(0) //aux to show inner page

  // const [increaseIdNumberFromMap, setIncreaseIdNumberFromMape] = useState(0)
  // setIncreaseIdNumberFromMape((increaseIdNumberFromMap) + 1)

  const [loading, setLoading] = useState(true)

  const [releasingThisSeason, setReleasingThisSeason] = useState([])
  const [releasingThisWeek, setReleasingThisWeek] = useState([])
  const [trending, setTrending] = useState([])

  useEffect(() => {

    const loadData = async () => {

      setLoading(true)

      //stores the heading content, which is the releases of the season
      const data1 = await API.getNewReleases()
      setReleasingThisSeason(data1)

      //stores releases of this week
      const data2 = await API.getReleasingThisWeek()
      setReleasingThisWeek(data2)

      //stores what is trending 
      const data3 = await API.getTrending()
      setTrending(data3)

      setLoading(false)

    }
    loadData()

    console.log(releasingThisSeason)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  return (
    <C.Container innerPageLink={indexInnerPageLink}>

      <nav className='links'>

        <h3>Category</h3>

        <ul>

          <li><Link to={``}>Shonen</Link></li>
          <li><Link to={``}>Shojo</Link></li>
          <li><Link to={``}>Seinen</Link></li>
          <li><Link to={``}>Sports</Link></li>
          <li><Link to={``}>Action</Link></li>

        </ul>

        <h3>Discover</h3>

        <ul>

          <li><Link to={``}>Placeholder</Link></li>
          <li><Link to={``}>Placeholder</Link></li>
          <li><Link to={``}>Placeholder</Link></li>
          <li><Link to={``}>Placeholder</Link></li>

        </ul>

        <h3>Discover</h3>

        <ul>

          <li><Link to={``}>Placeholder</Link></li>
          <li><Link to={``}>Placeholder</Link></li>
          <li><Link to={``}>Placeholder</Link></li>
          <li><Link to={``}>Placeholder</Link></li>


        </ul>
      </nav>

      <div className='main-content'>

        <nav className='links-inner-page'>
          <Link to={`/`} onClick={() => setIndexInnerPageLink(0)} className='anime'>Anime</Link>
          <Link to={`/`} onClick={() => setIndexInnerPageLink(1)} className='manga'>Manga</Link>
          <Link to={`/`} onClick={() => setIndexInnerPageLink(2)} className='movie'>Movie</Link>
        </nav>

        <section id='anime'>
          <div className={loading === true ? 'banne-most-watch div-skeleton' : 'banne-most-watch'}>
            {loading === false && (
              releasingThisSeason.map((item: any, key) => (
                <HeadingContent key={key} data={item} />
              ))
            )}
          </div>

          <div className={loading === true ? 'new-episodes div-skeleton' : 'new-episodes'}>
            <div className='heading'>

              <h2>Releasing This Week</h2>

              <div className='nav-buttons'>
                <button type='button'><ArrowLeftSvg /></button>
                <button type='button' className='arrow-to-be-inverted'><ArrowLeftSvg /></button>
              </div>

            </div>

            <div className='releasing-this-week'>
              {loading === false && (
                releasingThisWeek.map((item: any, key) => (
                  <AnimesReleasingThisWeek key={key} data={item} />
                ))
              )}
            </div>

          </div>

          <div className={loading === true ? 'best-rated div-skeleton' : 'best-rated'}>
            <div className='heading'>

              <h2>Top Rated</h2>

              <div className='nav-buttons'>
                <button type='button'><ArrowLeftSvg /></button>
                <button type='button' className='arrow-to-be-inverted'><ArrowLeftSvg /></button>
              </div>

            </div>

            c
          </div>
        </section>

        <section id='manga'></section>

        <section id='movie'></section>
      </div >

      <aside>
        <div className='trending'>
          {loading === false && (
            trending.map((item, key) => (
              <Trending key={key} data={item} />
            ))
          )}
          aside
        </div>
        <div>
          aside
        </div>
      </aside>

    </C.Container >

  )
}