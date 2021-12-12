import {
	FastForwardIcon,
	PauseIcon,
	PlayIcon,
	ReplyIcon,
	RewindIcon,
	SwitchHorizontalIcon,
	VolumeUpIcon,
} from "@heroicons/react/outline";
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom";
import { useCallback, useEffect, useState } from "react";

import Image from 'next/image';
import { debounce } from "lodash";
import { useRecoilState } from "recoil";
import { useSession } from "next-auth/react";
import useSongInfo from "../hooks/useSongInfo";
import useSpotify from "../hooks/useSpotify";

const Player = () => {
	const spotifyApi = useSpotify();
	const { data: session, status } = useSession();
	const songInfo = useSongInfo();
	const [currentTrackId, setCurrenTrackId] =
		useRecoilState(currentTrackIdState);
	const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
	const [volume, setVolume] = useState(50);
    const debounceAdjustVolume = useCallback(
        debounce((volume) => {
            spotifyApi.setVolume(volume).catch(error => console.log(error))
        },500),[])
        
    
    const fetchCurrentSong = () => {
		if (!songInfo) {
			spotifyApi.getMyCurrentPlayingTrack().then((data) => {
				setCurrenTrackId(data.body?.item?.id);
				spotifyApi.getMyCurrentPlaybackState().then((data) => {
					setIsPlaying(data.body?.is_playing);
				});
			});
		}
	};
	const handlePlayPause = () => {
		console.log(spotifyApi.getMyCurrentPlaybackState());
		spotifyApi.getMyCurrentPlaybackState().then((data) => {
			console.log(data);

			if (data.body?.is_playing) {
				spotifyApi.pause();
				setIsPlaying(false);
			} else {
				spotifyApi.play();
				setIsPlaying(true);
			}
		});
	};
	useEffect(() => {
		if (spotifyApi.getAccessToken() && !currentTrackId) {
			fetchCurrentSong();
			setVolume(50);
		}
	}, [currentTrackId, spotifyApi, session]);
    useEffect(() => {
        if (volume > 0 && volume < 100) {
            debounceAdjustVolume(volume);
            }    
    }, [debounceAdjustVolume,volume])
    
	return (
		<div className="h-24 bg-gradient-to-b from-black to-gray-900 text-white grid grid-cols-3 text-xs md:text-base px-2 md:px-8">
			<div className="space-x-4 flex items-center ">
				<Image
					src={songInfo?.album.images?.[0]?.url}
					alt=""
					className="hidden md:inline h-10 w-10"
				/>
				<div>
					<h3>{songInfo?.name}</h3>
					<p>{songInfo?.artists?.[0]?.name}</p>
				</div>
			</div>
			{/**Center */}
			<div className="flex justify-evenly items-center">
				<SwitchHorizontalIcon className="button" />
				<RewindIcon className="button" />
				{isPlaying ? (
					<PauseIcon
						onClick={() => handlePlayPause()}
						className="button w-10 h-10"
					/>
				) : (
					<PlayIcon
						onClick={() => handlePlayPause()}
						className="button w-10 h-10"
					/>
				)}
				<FastForwardIcon className="button" />
				<ReplyIcon className="button" />
            </div>
            <div className="space-x-3 md:space-x-4 flex justify-end items-center pr-5">
               {/**<VolumeDownIcon className="button" /> */} 
                <input type="range" className="w-14 md:w-20" value={volume} onChange={e=>setVolume(Number(e.target.value)) }min={0} max={100}/>
                
                <VolumeUpIcon onClick={()=> volume <100 && setVolume(volume+10)} className="button"/>
                    </div>
		</div>
	);
};

export default Player;
