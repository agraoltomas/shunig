import axios from "axios";

axios.defaults.baseURL = `http://${import.meta.env.VITE_API_BASE}`;
axios.defaults.headers.post['Content-Type'] = 'application/json';
export default axios;
