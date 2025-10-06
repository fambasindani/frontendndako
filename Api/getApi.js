// services/api.js
import axios from "axios"

// // Fonction qui retourne l'instance Axios
// export const getApi = () => {
//     return axios.create({
//         baseURL: "http://10.243.35.117:8000/", // URL de ton API Laravel
//         headers: {
//             "Content-Type": "application/json",
//             Accept: "application/json",
//         },
//     })
//}


// URL de base de ton backend Laravel
const BASE_URL = "http://192.168.88.126:8000";

export const getApi = () => {
  return axios.create({
    baseURL: `${BASE_URL}`, // ton API Laravel démarre par /api
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
};

// ✅ Fonction utilitaire pour construire l'URL complète d'une image

export const getImageUrl = (path) => {
  if (!path) return null; // si pas d'image, retourne null
  return `${BASE_URL}/storage/${path}`;
};
