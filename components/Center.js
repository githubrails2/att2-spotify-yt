import { playlistIdState, playlistState } from "../atoms/playlistAtom";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

import { ChevronDownIcon } from "@heroicons/react/outline";
import Songs from "./Songs";
import { shuffle } from "lodash";
import { useSession } from "next-auth/react";
import  useSpotify from '../hooks/useSpotify'

const colors = [
  "from-indigo-500",
  "from-blue-500",
  "from-green-500",
  "from-red-500",
  "from-yellow-500",
  "from-pink-500",
  "from-purple-500",
];
const Center = () => {
  const { data: session } = useSession();
  const spotifyApi = useSpotify();
  const [color, setColor] = useState(null);
  const [playlistId] = useRecoilValue(playlistIdState);
  const [playlist, setPlaylist] = useRecoilState(playlistState)

  useEffect(() => {
    setColor(shuffle(colors).pop());
  }, [playlistId]);
  
  useEffect(() => {
    
      spotifyApi.getPlaylist(playlistId).then(data => {
        setPlaylist(data.body);
      })
        .catch(error => {
          console.log("Something went wrong!", error);
        })   
  
    
    
 
  }, [spotifyApi,playlistId]);
  console.log("Playlist contents",playlist);
  return (
    <div className="flex-grow">
      <header className="absolute top-5 right-8">
        <div className="flex items-center text-white bg-black space-x-2 opacity-90 hover:opacity-80 rounded-full cursor-pointer p-1 pr-2">
          <img src={session?.user.image} className="rounded-full w-10 h-10" />
          <h2>{session?.user.name}</h2>
          <ChevronDownIcon className="h-5 w-5" />
        </div>
      </header>
      <section
        className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} h-80 text-white p-8`}
      > <img src={playlist?.images?.[0]?.url} alt="" className="h-44 w-44 shadow-2xl" />
        <div>
          <p>Playlist</p>
          <h1 className="text-2xl md:text-3xl xl:text-5xl font-bold">{playlist?.name}</h1>
          </div>
      </section>
      <div>
        <Songs/>
      </div>
    </div>
  );
};

export default Center;
