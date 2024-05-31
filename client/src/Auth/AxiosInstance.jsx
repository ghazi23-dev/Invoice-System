import axios from 'axios';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_API_URL, 
  withCredentials: true,
  
});

// Request Interceptor With JWT Token
axiosInstance.interceptors.request.use(
  (config) => {
    const tokenExpiration = Cookies.get('tokenExpiration');
 
    if (tokenExpiration && tokenExpiration * 1000 < Date.now()) {
      // Token has expired
      console.log("Token has expired");
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Votre session a expiré merci de vous reconnecter! instaance axios",
      });
    } else {
      // Token is valid, include it in the Authorization header
      const token = Cookies.get('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
