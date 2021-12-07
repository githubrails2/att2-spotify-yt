import React from 'react'
import useSpotify from '../hooks/useSpotify'

const Song = ({ order, track }) => {
    const spotifyApi = useSpotify();
    return (
        <div className="grid grid-cols-2">
            <div className="space-x-4 flex item-centers">
                <p>{order + 1}</p>
                <img src={track.track.album.images[0].url} className="h-10 w-10" alt="" />
                <div>
                    <p>{track.track.name}</p>
                    <p>{track.track.artists[0].name}</p>

                </div>
                <div className="flex items-center justify-between ml-auto md:ml-0">
                    <p className="hidden md:inline">{track.track.album.name}</p>
                    <p>duration</p>
                </div>
            </div>
        </div>
    )
}

export default Song
