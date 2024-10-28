import axios from "axios";

const instance = axios.create({
    baseURL : 'http://localhost:8080/',
});

const APITinhThanh = axios.create({
    baseURL : 'https://provinces.open-api.vn/',
}); 
export default instance;
export {APITinhThanh};