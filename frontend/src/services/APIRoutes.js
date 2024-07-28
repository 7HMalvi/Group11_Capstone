const baseURL = "http://localhost:5000";


const SignUpAPI = `${baseURL}/signup`;
const LoginAPI = `${baseURL}/login`;
const LogoutAPI = `${baseURL}/logout`;

const GetUserList = `${baseURL}/getuserlist`;
const EditUser = `${baseURL}/edituser`;
const DeleteUser = `${baseURL}/deleteuser`;

const GetCardDetail = `${baseURL}/carddetails`;
const GetGraphData = `${baseURL}/getgraphdata`;

const AddSong = `${baseURL}/addsong`;
const UpdateSong = `${baseURL}/updatesong`;
const DeleteSong = `${baseURL}/deleteSong`;
const GetSongList = `${baseURL}/getsonglist`;

const LikeSong = `${baseURL}/addlike`;
const UnlikeSong = `${baseURL}/removelike`;

const AddComment = `${baseURL}/addcomment`;
const GetComments = `${baseURL}/getcomments`;

const CreatePlaylist = `${baseURL}/createplaylist`;
const DeletePlaylist = `${baseURL}/deleteplaylist`;
const AddPlaylist = `${baseURL}/addplaylist`;
const RemovePlaylist = `${baseURL}/removeplaylist`;
const GetPlaylists = `${baseURL}/getplaylists`;
const UpdatePlaylist = `${baseURL}/updateplaylist`;

const GetArtists = `${baseURL}/getartists`;
const GetAlbums = `${baseURL}/getalbums`;
const GetGenres = `${baseURL}/getgenres`;

const DeleteArtist = `${baseURL}/deleteartist`;
const DeleteAlbum = `${baseURL}/deletealbum`;
const DeleteGenre = `${baseURL}/deletegenre`;

const EditArtist = `${baseURL}/editartist`;
const EditAlbum = `${baseURL}/editalbum`;
const EditGenre = `${baseURL}/editgenre`;

const AddArtist = `${baseURL}/addartist`;
const AddAlbum = `${baseURL}/addalbum`;
const AddGenre = `${baseURL}/addgenre`;


module.exports = {
    SignUpAPI, 
    LoginAPI,
    LogoutAPI,
    GetUserList,
    EditUser,
    DeleteUser,
    GetCardDetail,
    GetGraphData,
    AddSong,
    UpdateSong,
    DeleteSong,
    GetSongList,
    GetArtists,
    GetAlbums,
    GetGenres,
    DeleteArtist,
    DeleteAlbum,
    DeleteGenre,
    EditArtist,
    EditAlbum,
    EditGenre,
    AddArtist,
    AddAlbum,
    AddGenre,
    LikeSong,
    UnlikeSong,
    AddComment,
    GetComments,
    CreatePlaylist,
    DeletePlaylist,
    AddPlaylist,
    RemovePlaylist,
    GetPlaylists,
    UpdatePlaylist
 }