import React, { useEffect, useState } from 'react';
import { omit } from "lodash";
import SongModal from '../modals/SongModal';
import { AddSong, CheckPro } from '../../services/APIRoutes';
import SongList from '../common/SongList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import ProPopup from '../common/ProPopup';

export default function Upload() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    artists: [],
    albums: [],
    genres: [],
    song: null,
    coverImage: null,
    lyrics: null
  });
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [isProUser, setIsProUser] = useState(false);
  const [showProPopup, setShowProPopup] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const token = localStorage.getItem('userToken');
        const response = await fetch(CheckPro, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
        const data = await response.json();
        if (data?.user?.isProUser) {
          setIsProUser(true);
        } else {
          setIsProUser(false);
          setShowProPopup(true);
        }
      } catch (error) {
        console.error('Error checking user:', error);
      }
    }
    checkUser();
  }, []);

  const handleTitle = (e) => {
    const { value } = e.target;
    if (value === "") {
      setErrors({
        ...errors,
        "title": "Enter a valid title",
      });
    } else {
      let newObj = omit(errors, "title");
      setErrors(newObj);
    }
    setFormData({ ...formData, "title": value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData?.artists?.length === 0 || formData?.albums?.length === 0 || formData?.genres?.length === 0) {
      setErrors({
        ...errors,
        "select": "Please fill all the mandatory fields"
      });
      return;
    } else {
      let newObj = omit(errors, "select");
      setErrors(newObj);
    }

    const form = new FormData();
    form.append('title', formData.title);
    formData.artists.forEach(artist => form.append('artists[]', artist.value));
    formData.albums.forEach(album => form.append('albums[]', album.value));
    formData.genres.forEach(genre => form.append('genres[]', genre.value));
    form.append('song', formData.song);
    if (formData.coverImage) {
      form.append('coverImage', formData.coverImage);
    }
    if (formData.privacy !== "public") {
      form.append('isPrivate', true);
    }
    if (formData.lyrics) {
      form.append('lyrics', formData.lyrics);
    }

    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch(AddSong, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: form
      });
      const data = await response.json();
      if (response.ok) {
        setErrors({});
        setIsOpen(false);
        window.location.reload();
      } else {
        console.error('Error adding song:', data.error);
      }
    } catch (error) {
      console.error('Error adding song:', error);
    }
  };

  return (
    <div className="p-4" style={{minHeight: "420px"}}>
      {!isProUser && <ProPopup isOpen={showProPopup} setIsOpen={setShowProPopup} />}
      {isProUser && (
        <>
          <div className="flex justify-between items-center">
            <button
              className="bg-red-600 hover:bg-red-500 text-white px-4 py-2"
              onClick={() => setIsOpen(true)}
            >
              Add Song
            </button>
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

          <SongModal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            setErrors={setErrors}
            handleSubmit={handleSubmit}
            handleTitle={handleTitle}
            handleFileChange={handleFileChange}
            isUpload={true}
          />

          <SongList searchTerm={searchTerm} page={"upload"} />
        </>
      )}
    </div>
  );
}
