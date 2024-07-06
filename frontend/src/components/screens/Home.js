import React, { useState } from 'react';
import SongList from '../common/SongList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import Image1 from '../../image/Image1.png';
import Image2 from '../../image/Image2.png';
import Image3 from '../../image/Image3.png';
import Image4 from '../../image/Image4.png';
import Image5 from '../../image/Image5.png';
import Image6 from '../../image/Image6.png';
import Image7 from '../../image/Image7.png';


export default function Home() {

  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="p-4">
      <div className="flex justify-between items-center">
        <h3>Songs</h3>
        <div className="relative shadow-red">
          <input
            type="text"
            className="pl-10 pr-4 py-2 rounded bg-black text-white placeholder-gray-400"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FontAwesomeIcon icon={faSearch} className="absolute left-0 top-0 mt-3 ml-2 text-gray-400" />
        </div>
      </div>
      <SongList searchTerm={searchTerm}/>
      <div class="music">
        <img src={Image1} />
        <img src={Image2} />
        <img src={Image3} />
        <img src={Image4} />
        <img src={Image5} />
        <img src={Image6} />
        <img src={Image7} />
      </div>
    </div>
  )
}
