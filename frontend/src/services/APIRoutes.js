const baseURL = "http://localhost:5000";


const SignUpAPI = `${baseURL}/signup`;
const LoginAPI = `${baseURL}/login`;
const LogoutAPI = `${baseURL}/logout`;
const ForgotPasswordAPI = `${baseURL}/forgotpassword`;

const GetUserList = `${baseURL}/getuserlist`;
const EditUser = `${baseURL}/edituser`;
const DeleteUser = `${baseURL}/deleteuser`;
const GetProfile = `${baseURL}/getuser`;
const EditProfile = `${baseURL}/editprofile`;
const EditProfilePic = `${baseURL}/editprofilepic`;
const RemoveProfilePic = `${baseURL}/removeprofilepic`;

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

const CheckPro = `${baseURL}/checkpro`;
const CreatePaymentIntent = `${baseURL}/create-payment-intent`;
const ConfirmPayment = `${baseURL}/confirm-payment`;


module.exports = {
    SignUpAPI, 
    LoginAPI,
    LogoutAPI,
    ForgotPasswordAPI,
    GetUserList,
    GetProfile,
    EditProfile,
    EditProfilePic,
    RemoveProfilePic,
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
    UpdatePlaylist,
    CheckPro,
    CreatePaymentIntent,
    ConfirmPayment
 }