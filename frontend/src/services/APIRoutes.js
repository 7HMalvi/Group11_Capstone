const baseURL = "http://localhost:5000";


const SignUpAPI = `${baseURL}/signup`;
const LoginAPI = `${baseURL}/login`;
const LogoutAPI = `${baseURL}/logout`;

const GetUserList = `${baseURL}/getuserlist`;
const EditUser = `${baseURL}/edituser`;
const DeleteUser = `${baseURL}/deleteuser`;

const GetCardDetail = `${baseURL}/carddetails`;

module.exports = 
{
    SignUpAPI, 
    LoginAPI,
    LogoutAPI,
    GetUserList,
    EditUser,
    DeleteUser,
    GetCardDetail
 }