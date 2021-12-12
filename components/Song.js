import { currentTrackIdState, isPlayingState } from '../atoms/songAtom';
import { useRecoilState, useRecoilValue } from 'recoil';


import React from 'react'
import { millisToMinutesAndSeconds } from '../lib/time';
import useSpotify from '../hooks/useSpotify'

const Song = ({ order, track }) => {
    const spotifyApi = useSpotify();
    const [isPlaying,setIsPlaying] = useRecoilState(isPlayingState)
    const [currentTrackId,setCurrentTrackId] = useRecoilState(currentTrackIdState)
    const playSong =  () => {
        setCurrentTrackId(track.track.id);
        setIsPlaying(true);
        {/*spotifyApi.play({
            uris: [track.track.uri],

        })*/}
    }
    return (
        <div className="grid grid-cols-2 text-gray-500 py-4 px-5 hover:bg-gray-900 rounded-lg cursor-pointer" onClick={()=>playSong()}>
            <div className=" flex items-center space-x-4">
                <p>{order + 1}</p>
                <img src={track.track.album.images[0].url} className="h-10 w-10" alt="" />
                <div>
                    <p className="w-36 lg:w-64 text-white truncate">{track.track.name}</p>
                    <p className="w-40 ">{track.track.artists[0].name}</p>

                </div>
                <div className="flex items-center justify-between ml-auto md:ml-0">
                    <p className="hidden md:inline w-40">{track.track.album.name}</p>
                    <p>{millisToMinutesAndSeconds(track.track.duration_ms)}</p>
                </div>
                

            </div>
        </div>
    )
}

export default Song
