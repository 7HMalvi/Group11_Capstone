const baseURL = "http://localhost:5000";


const SignUpAPI = `${baseURL}/signup`;
const LoginAPI = `${baseURL}/login`;
const LogoutAPI = `${baseURL}/logout`;

const GetUserList = `${baseURL}/getuserlist`;
const EditUser = `${baseURL}/edituser`;
const DeleteUser = `${baseURL}/deleteuser`;

const GetCardDetail = `${baseURL}/carddetails`;

const AddSong = `${baseURL}/addsong`;
const UpdateSong = `${baseURL}/updatesong`;
const DeleteSong = `${baseURL}/deleteSong`;
const GetSongList = `${baseURL}/getsonglist`;

const GetArtists = `${baseURL}/getartists`;
const GetAlbums = `${baseURL}/getalbums`;
const GetGenres = `${baseURL}/getgenres`;



module.exports = {
    SignUpAPI, 
    LoginAPI,
    LogoutAPI,
    GetUserList,
    EditUser,
    DeleteUser,
    GetCardDetail,
    AddSong,
    UpdateSong,
    DeleteSong,
    GetSongList,
    GetArtists,
    GetAlbums,
    GetGenres,
 }