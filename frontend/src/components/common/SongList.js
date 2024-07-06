import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import Modal from 'react-modal';
import { omit } from "lodash";
import 'react-h5-audio-player/lib/styles.css';
import AudioPlayer from 'react-h5-audio-player';
import { GetSongList, UpdateSong, DeleteSong } from '../../services/APIRoutes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import EditSongModal from '../custom/EditSongModal';

const SongList = ({ searchTerm }) => {
  const [songs, setSongs] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedSong, setSelectedSong] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [songId, setSongId] = useState("");
  const [formData, setFormData] = useState(
{
    title: '',
    artists: [],
    albums: [],
    genres: [],
    song: null,
    coverImage: null
  });
  const [errors, setErrors] = useState({});

  const songsPerPage = 10;

  useEffect(() => {
    fetchSongs(searchTerm);
  }, [searchTerm]);

  const fetchSongs = async (search) => {
    try 
    {
      const token = localStorage.getItem('userToken');
      const response = await fetch(GetSongList, {
        method: 'POST',
        headers:
         {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ search })
      });
      const data = await response.json();
      setSongs(data.songs);
    } 
    catch (error)
    {
      console.error('Error fetching songs:', error);
    }
  };


  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const openModal = (song) => {
    setSelectedSong(song);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedSong(null);
  };

  const openEditModal = (song) => {
    setFormData({
      title: song.title,
      artists: song.artists.map(ele => ({ label: ele.name, value: ele._id })),
      albums: song.albums.map(ele => ({ label: ele.name, value: ele._id })),
      genres: song.genres.map(ele => ({ label: ele.name, value: ele._id })),
      song: song.file,
      coverImage: song.coverImage
    });
    setSongId(song._id);
    setSelectedSong(song);
    setEditModalIsOpen(true);
  };

//   const closeEditModal = () => {
//     setEditModalIsOpen(false);
//     setSelectedSong(null);
//   };

  const handleTitle = (e) => {
    const { value } = e.target;
    if (value === "") {
      setErrors({
        ...errors,
        "title": "Enter a valid title",
      });
    } 
    else
    {
      let newObj = omit(errors, "title");
      setErrors(newObj);
    }
    setFormData({ ...formData, title: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.artists.length === 0 || formData.albums.length === 0 || formData.genres.length === 0) {
      setErrors({
        ...errors,
        "select": "Please fill all the mandatory fields"
      });
      return;
    }
     else 
    {
      let newObj = omit(errors, "select");
      setErrors(newObj);
    }

    const form = new FormData();
    form.append('title', formData.title);
    formData.artists.forEach(artist => form.append('artists[]', artist.value));
    formData.albums.forEach(album => form.append('albums[]', album.value));
    formData.genres.forEach(genre => form.append('genres[]', genre.value));
    if (formData.song) {
      form.append('song', formData.song);
    }
    if (formData.coverImage) {
      form.append('coverImage', formData.coverImage);
    }

    try 
    {
      const token = localStorage.getItem('userToken');
      const response = await fetch(`${UpdateSong}/${songId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },


    body: form
      });
      const data = await response.json();
      if (response.ok) {
        setErrors({});
        setEditModalIsOpen(false);
        window.location.reload();
      } 
      else 
      {
        console.error('Error updating song:', data.error);
      }
    } 
    catch (error) 
    {
      console.error('Error updating song:', error);
    }
  };

  const handleDelete = async (songId) => {
    try 
    {
      const token = localStorage.getItem('userToken');
      const response = await fetch(`${DeleteSong}/${songId}`, {
        method: 'DELETE',
        headers: 
        {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });


      if (response.ok) 
      {
        setSongs(songs.filter(song => song._id !== songId));
        window.location.reload();
      } else {
        const data = await response.json();
        console.error('Error deleting song:', data.error);
      }
    } 
    catch (error)
    {
      console.error('Error deleting song:', error);
    }
  };

  const startIndex = currentPage * songsPerPage;
  const selectedSongs = songs.length > 0 ? songs.slice(startIndex, startIndex + songsPerPage) : [];

  return (
    <div>
       <div className="flex flex-wrap gap-4 m-3" style={{ height: "500px" }}>
        {
            selectedSongs.length > 0 ? 
                selectedSongs.map((song) => (
                    <div key={song.value} className="w-36 cursor-pointer text-center shadow-red bg-black" style={{ height: "190px" }} onClick={() => openModal(song)}>
                     <img src={song.coverImage} alt={song.title} className="w-full h-auto" />
                    <h3 className="mt-2 text-white" style={{ height: "40px", overflow: "hidden", fontSize: "12px" }}>{song.title}</h3>
                    </div>
                ))
            :
                <div className="w-full text-center text-white">
                    No songs found
                </div>
        }
      </div>

      <ReactPaginate
        previousLabel={'Previous'}
        nextLabel={'Next'}
        breakLabel={'...'}
        breakClassName={'break-me'}
        pageCount={Math.ceil(songs.length / songsPerPage)}
        marginPagesDisplayed={2}
        pageRangeDisplayed={10}
        onPageChange={handlePageClick}
        containerClassName={'flex justify-center mt-4 space-x-2'}
        activeClassName={'font-bold underline'}
      />

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Song Details"
        className="bg-black shadow-red p-6 rounded-lg w-96 mx-auto my-20"
      >
        {selectedSong && (
          <div>
            {
              localStorage.getItem("userType")!=="user" && <button
                className="absolute text-white p-1"
                style={{ marginTop: "-3px", marginLeft: "275px" }}
                onClick={() => openEditModal(selectedSong)}
              >
                <FontAwesomeIcon icon={faEdit} className="block h-6 w-6" aria-hidden="true" />
              </button>
            }
            {
              localStorage.getItem("userType")!=="user" && <button
                className="absolute text-white p-1"
                style={{ marginTop: "-3px", marginLeft: "307px" }}
                onClick={() => handleDelete(selectedSong._id)}
              >
                <FontAwesomeIcon icon={faTrash} className="block h-6 w-6" aria-hidden="true" />
              </button>
            }
            <h2 className="text-sm font-semibold mb-4 text-red-500" style={{ marginRight: "65px" }}>{selectedSong.title}</h2>
            <img src={selectedSong.coverImage} alt={selectedSong.title} className="w-full h-auto mb-4" />
            <p><strong className='text-red-500'>Artists:</strong> {selectedSong.artists.map(ele => ele.name).join(', ')}</p>
            <p><strong className='text-red-500'>Albums:</strong> {selectedSong.albums.map(ele => ele.name).join(', ')}</p>
            <p><strong className='text-red-500'>Genres:</strong> {selectedSong.genres.map(ele => ele.name).join(', ')}</p>
            <AudioPlayer
              src={selectedSong.file}
              customAdditionalControls={[]}
              customVolumeControls={[]}
              autoPlayAfterSrcChange={false}
              style={{
                backgroundColor: 'black',
                color: 'red',
                borderRadius: '0.375rem'
              }}
            />
          </div>
        )}
      </Modal>

      <EditSongModal
        isOpen={editModalIsOpen}
        setIsOpen={setEditModalIsOpen}
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        setErrors={setErrors}
        handleSubmit={handleSubmit}
        handleTitle={handleTitle}
        handleFileChange={handleFileChange}
      />
    </div>
  );
};

export default SongList;
