import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import 'react-h5-audio-player/lib/styles.css';
import AudioPlayer from 'react-h5-audio-player';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faHeart as faSolidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faRegularHeart } from '@fortawesome/free-regular-svg-icons';

const SongDetailModal = ({
  isOpen,
  onRequestClose,
  song,
  page,
  openEditModal,
  handleDelete,
  handleLike,
  commentText,
  setCommentText,
  handleAddComment,
}) => {
  const [currentLine, setCurrentLine] = useState('');
  const [lyricsArray, setLyricsArray] = useState([]);

  // Parse lyrics to get an array of { time, text }
  const parseLyrics = (lyricsContent) => {
    return lyricsContent.split('\n').map((line) => {
      const [time, text] = line.split(']');
      const parsedTime = parseTime(time.replace('[', ''));
      return { time: parsedTime, text };
    });
  };

  // Convert time string to seconds
  const parseTime = (timeString) => {
    const [minutes, seconds] = timeString.split(':').map(Number);
    return minutes * 60 + seconds;
  };

  useEffect(() => {
    if (!song) return;

    const fetchLyrics = async () => {
      const token = localStorage.getItem('userToken');
      const response = await fetch(`/getlyrics/${song._id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      const data = await response.json();
      console.log(data)
      const lyricsArray = data.lyrics ? parseLyrics(data.lyrics) : [];
      setLyricsArray(lyricsArray);
      setCurrentLine(lyricsArray[0]?.text || '');
    };

    fetchLyrics();
  }, [song]);

  const handleListen = (event) => {
    const currentTime = event.target.currentTime;
    const currentLyric = lyricsArray.find((lyric, index) => {
      return (
        currentTime >= lyric.time &&
        (index === lyricsArray.length - 1 || currentTime < lyricsArray[index + 1].time)
      );
    });
    if (currentLyric) {
      setCurrentLine(currentLyric.text);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Song Details"
      className="bg-black shadow-red p-6 rounded-lg w-full md:w-3/4 lg:w-2/3 xl:w-1/2 mx-auto my-5 md:mx-50"
    >
      {song && (
        <div className="flex flex-col md:flex-row">
          <div className="md:w-2/3 relative">
            {page !== "home" && page !== "search" && (
              <>
                <button
                  className="absolute top-0 right-20 text-white p-1"
                  onClick={() => openEditModal(song)}
                >
                  <FontAwesomeIcon icon={faEdit} className="block h-6 w-6" aria-hidden="true" />
                </button>
                <button
                  className="absolute top-0 right-12 text-white p-1"
                  onClick={() => handleDelete(song._id)}
                >
                  <FontAwesomeIcon icon={faTrash} className="block h-6 w-6" aria-hidden="true" />
                </button>
              </>
            )}
            <h2 className="text-sm font-semibold mb-4 text-red-500">{song.title}</h2>
            <img src={"https://backendgroovix.onrender.com"+song.coverImage} alt={song.title} className="mb-4 w-64 h-64" />
            <p><strong className='text-red-500'>Artists:</strong> {song.artists.map(ele => ele.name).join(', ')}</p>
            <p><strong className='text-red-500'>Albums:</strong> {song.albums.map(ele => ele.name).join(', ')}</p>
            <p><strong className='text-red-500'>Genres:</strong> {song.genres.map(ele => ele.name).join(', ')}</p>

            {/* Display the current line of lyrics */}
            <div className="lyrics-section mt-4 text-center">
              <h3 className="text-red-500 mb-2">Lyrics</h3>
              {lyricsArray.length > 0 ? 
                (<p className="text-white text-2xl">{currentLine}</p>) : 
                (<p className="text-gray-500">No lyrics available.</p>)
              }
            </div>

            <AudioPlayer
              src={"https://backendgroovix.onrender.com"+song.file}
              customAdditionalControls={[]}
              customVolumeControls={[]}
              autoPlayAfterSrcChange={false}
              onListen={handleListen}
              style={{
                backgroundColor: 'black',
                color: 'red',
                borderRadius: '0.375rem'
              }}
            />
          </div>
          <div className="md:w-1/3 mt-6 md:mt-0 md:ml-6">
            {localStorage.getItem("userType") === "user" && (
              <FontAwesomeIcon
                icon={song.liked === true ? faSolidHeart : faRegularHeart}
                className="cursor-pointer float-right mr-3"
                onClick={(e) => { e.stopPropagation(); handleLike(song) }}
                style={{ height: "25px", width: "25px" }}
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
                {song.comments && song.comments.length > 0 ? (
                  song.comments.map((comment) => (
                    <div key={comment._id} className="comment mb-2">
                      <p className='text-sm'>
                        <strong className="text-red-500">{comment.user.firstName + " " + comment.user.lastName}</strong><br />{comment.message}
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
  );
};

export default SongDetailModal;
