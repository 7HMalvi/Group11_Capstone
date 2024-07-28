import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import Modal from 'react-modal';
import { omit } from "lodash";
import 'react-h5-audio-player/lib/styles.css';
import AudioPlayer from 'react-h5-audio-player';
import { GetSongList, UpdateSong, DeleteSong, LikeSong, UnlikeSong, AddComment, GetComments, GetPlaylists, UpdatePlaylist } from '../../services/APIRoutes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faHeart as faSolidHeart, faPlus } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faRegularHeart } from '@fortawesome/free-regular-svg-icons';
import EditSongModal from '../modals/EditSongModal';

const SongList = ({ searchTerm, page }) => {
  const [songs, setSongs] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedSong, setSelectedSong] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [playlistModalIsOpen, setPlaylistModalIsOpen] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylists, setSelectedPlaylists] = useState([]);
  const [songId, setSongId] = useState("");
  const [commentText, setCommentText] = useState('');
  const [formData, setFormData] = useState({
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
    try {
      const token = localStorage.getItem('userToken');

      let payload = {search}
      if(page==="upload"){
        payload = {
          ...payload,
          isUser: true
        }
      }

      const response = await fetch(GetSongList, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      setSongs(data.songs);
    } catch (error) {
      console.error('Error fetching songs:', error);
    }
  };

  const fetchComments = async (songId) => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch(`${GetComments}/${songId}`, {
        method: 'GET',
        headers: 
        {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      const data = await response.json();
      return data.comments;
    } catch (error) 
    {
      console.error('Error fetching comments:', error);
    }
  };

  const fetchPlaylistsWithSongPresence = async (song) => {
    try 
    {
      setSelectedSong(song);
      const token = localStorage.getItem('userToken');
      const response = await fetch(GetPlaylists, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ songId: song._id }),
      });
      const data = await response.json();
      setPlaylists(data.playlists);
      setSelectedPlaylists(data.playlists.filter(playlist => playlist.containsSong).map(playlist => playlist._id));
    } catch (error) {
      console.error('Error fetching playlists:', error);
    }
  };

  const handlePageClick = (data) => 
  {
    setCurrentPage(data.selected);
  };

  const openModal = async (song) =>
  {
    const comments = await fetchComments(song._id);
    setSelectedSong({ ...song, comments });
    setModalIsOpen(true);
  };

  const closeModal = () => 
  {
    setModalIsOpen(false);
    setSelectedSong(null);
  };

  const openEditModal = (song) => 
  {
    setFormData({
      title: song.title,
      artists: song.artists.map(ele => ({ label: ele.name, value: ele._id })),
      albums: song.albums.map(ele => ({ label: ele.name, value: ele._id })),
      genres: song.genres.map(ele => ({ label: ele.name, value: ele._id })),
      song: song.file,
      coverImage: song.coverImage,
      privacy: song.isPrivate ? "private" : "public"
    });
    setSongId(song._id);
    setSelectedSong(song);
    setEditModalIsOpen(true);
  };

  const handleTitle = (e) => 
  {
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
    setFormData({ ...formData, title: value });
  };

  const handleFileChange = (e) => 
  {
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
    } else {
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

    try {
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
      } else {
        console.error('Error updating song:', data.error);
      }
    } catch (error) {
      console.error('Error updating song:', error);
    }
  };

  const handleDelete = async (songId) => 
  {
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch(`${DeleteSong}/${songId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        setSongs(songs.filter(song => song._id !== songId));
        window.location.reload();
      } else {
        const data = await response.json();
        console.error('Error deleting song:', data.error);
      }
    } catch (error) {
      console.error('Error deleting song:', error);
    }
  };

  const handleLike = async (song) => 
  {
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch(`${song.liked === true ? UnlikeSong : LikeSong}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: song._id })
      });
      if (response.ok) {
        const updatedSongs = songs.map(s => s._id === song._id ? { ...s, liked: !s.liked } : s);
        setSongs(updatedSongs);        
        if(selectedSong?._id === song?._id) {
          setSelectedSong({ ...selectedSong, liked: !selectedSong.liked });
        }
      } else 
      {

        const data = await response.json();
        console.error('Error updating song like status:', data.error);
      }
    } catch (error) {
      console.error('Error updating song like status:', error);
    }
  };

  const handleAddComment = async () => {
    if (commentText.trim() === '') return;

    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch(AddComment, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ song: selectedSong._id, message: commentText })
      });
      const data = await response.json();
      if (response.ok) {
        setSelectedSong((selectedSong) => ({
          ...selectedSong,
          comments: selectedSong.comments ? [data.comment, ...selectedSong.comments] : [data.comment]
        }));
        setCommentText('');
      } else {
        console.error('Error adding comment:', data.error);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }

  };

  const togglePlaylistSelection = (playlistId) => {
    if (selectedPlaylists.includes(playlistId)) {
      setSelectedPlaylists(selectedPlaylists.filter((id) => id !== playlistId));
    } else {
      setSelectedPlaylists([...selectedPlaylists, playlistId]);
    }
  };

  const handleAddSongToPlaylists = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch(UpdatePlaylist, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ songId: selectedSong._id, playlistIds: selectedPlaylists }),
      });
      if (response.ok) {
        setPlaylistModalIsOpen(false);
        setSelectedPlaylists([]);
        window.location.reload();
      } else {
        const data = await response.json();
        console.error('Error adding song to playlists:', data.error);
      }
    } catch (error) {
      console.error('Error adding song to playlists:', error);
    }
  };

  const startIndex = currentPage * songsPerPage;
  const selectedSongs = songs.length > 0 ? songs.slice(startIndex, startIndex + songsPerPage) : [];

  return (
    <div>
      <div className="flex flex-wrap gap-4 m-3" style={{ height: "500px" }}>
        {selectedSongs.length > 0 ? (
          selectedSongs.map((song) => (
            <div
              key={song._id}
              className="w-36 cursor-pointer text-center shadow-red bg-black"
              style={{ height: "220px" }}
              onClick={() => openModal(song)}
            >
              <img src={song.coverImage} alt={song.title} className="w-full h-auto" />
              <h3
                className="mt-2 text-white"
                style={{ height: "40px", overflow: "hidden", fontSize: "12px" }}
              >
                {song.title}
              </h3>
              {localStorage.getItem("userType") === "user" && (
                <FontAwesomeIcon
                  icon={faPlus}
                  className="cursor-pointer float-left ml-3"
                  onClick={(e) => {
                    e.stopPropagation();
                    fetchPlaylistsWithSongPresence(song);
                    setPlaylistModalIsOpen(true);
                  }}
                />
              )}
              {localStorage.getItem("userType") === "user" && (
                <FontAwesomeIcon
                  icon={song.liked === true ? faSolidHeart : faRegularHeart}
                  className="cursor-pointer float-right mr-3"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLike(song);
                  }}
                />
              )}
            </div>
          ))
        ) : (
          <div className="w-full text-center text-white">No songs found</div>
        )}
      </div>

      <ReactPaginate
        previousLabel={"Previous"}
        nextLabel={"Next"}
        breakLabel={"..."}
        breakClassName={"break-me"}
        pageCount={Math.ceil(songs.length / songsPerPage)}
        marginPagesDisplayed={2}
        pageRangeDisplayed={10}
        onPageChange={handlePageClick}
        containerClassName={"flex justify-center mt-4 space-x-2"}
        activeClassName={"font-bold underline"}
      />

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Song Details"
        className="bg-black shadow-red p-6 rounded-lg w-full md:w-3/4 lg:w-2/3 xl:w-1/2 mx-auto my-20"
      >
        {selectedSong && (
          <div className="flex flex-col md:flex-row">
            <div className="md:w-2/3">
              {page !== "home" && (
                <button
                  className="absolute text-white p-1"
                  style={{ marginTop: "-3px", marginLeft: "275px" }}
                  onClick={() => openEditModal(selectedSong)}
                >
                  <FontAwesomeIcon icon={faEdit} className="block h-6 w-6" aria-hidden="true" />
                </button>
              )}
              {page !== "home" && (
                <button
                  className="absolute text-white p-1"
                  style={{ marginTop: "-3px", marginLeft: "307px" }}
                  onClick={() => handleDelete(selectedSong._id)}
                >
                  <FontAwesomeIcon icon={faTrash} className="block h-6 w-6" aria-hidden="true" />
                </button>
              )}
              <h2 className="text-sm font-semibold mb-4 text-red-500" style={{ marginRight: "65px" }}>{selectedSong.title}</h2>
              <img src={selectedSong.coverImage} alt={selectedSong.title} className="mb-4" style={{ width: "250px", height: "250px" }} />
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
            <div className="md:w-1/3 mt-6 md:mt-0 md:ml-6">
              {
                localStorage.getItem("userType") === "user" && (
                  <FontAwesomeIcon
                    icon={selectedSong.liked===true ? faSolidHeart : faRegularHeart}
                    className="cursor-pointer float-right mr-3"
                    onClick={(e) => {e.stopPropagation(); handleLike(selectedSong)}}
                    style={{height:"25px", width:"25px"}}
                  />
              )}
              <div className="comments-section mt-4">
                <h3 className="text-red-500 mb-2">Comments</h3>
                  {localStorage.getItem("userType") === "user" && (
                    <div className="add-comment mt-4 mb-4">
                      <textarea
                        className="w-full p-2 bg-black text-white rounded shadow-red"
                        placeholder="Add a comment..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                      />
                      <button
                        className="mt-2 bg-red-500 text-white py-1 px-4 rounded text-sm"
                        onClick={handleAddComment}
                      >
                        Add Comment
                      </button>
                    </div>
                  )}
                  <div className="comments-list" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {selectedSong.comments && selectedSong.comments.length > 0 ? (
                      selectedSong.comments.map((comment) => (
                        <div key={comment._id} className="comment mb-2">
                          <p className='text-sm'>
                            <strong className="text-red-500">{comment.user.firstName + " " + comment.user.lastName}</strong><br/>{comment.message}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p>No comments yet.</p>
                    )}
                  </div>
              </div>
            </div>
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
        page={page}
      />

      <Modal
        isOpen={playlistModalIsOpen}
        onRequestClose={() => setPlaylistModalIsOpen(false)}
        contentLabel="Select Playlists"
        className="bg-black shadow-red p-6 rounded-lg w-full md:w-3/4 lg:w-2/3 xl:w-1/2 mx-auto my-20"
      >
        <h2 className="text-red-500 mb-4">Select Playlists</h2>
        <div className="playlists">
          {playlists.length > 0 ? (
            playlists.map((playlist) => (
              <div key={playlist._id} className="playlist mb-2">
                <label className="text-white">
                  <input
                    type="checkbox"
                    checked={selectedPlaylists.includes(playlist._id)}
                    onChange={() => togglePlaylistSelection(playlist._id)}
                  />
                  {playlist.name}
                </label>
              </div>
            ))
          ) : (
            <p className="text-white">No playlists available.</p>
          )}
        </div>
        <button
          className="mt-4 bg-red-500 text-white py-1 px-4 rounded"
          onClick={handleAddSongToPlaylists}
        >
          Add to Playlists
        </button>
      </Modal>
    </div>
  );
};

export default SongList;
