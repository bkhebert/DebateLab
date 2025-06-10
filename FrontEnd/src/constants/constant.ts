const isDevelopment = false; // toggle this value

const baseURL = isDevelopment
  ? 'http://localhost:3000'
  : 'https://debatelab-server.onrender.com';

export default baseURL; //