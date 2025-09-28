import React, { createContext, useState, useEffect } from 'react';
import { getApi } from '../Api/getApi';


export const ApiContexts = createContext();

export const ApiProviderDetails = ({ children , routeId}) => {
    const [nom, setnom] = useState("Famba Ngoy");
 
     const [apiData, setApiData] = useState(null);

   

     
  useEffect(() => {
        if (routeId) {
            fetchApiData(); // Récupérez les données à l'aide de la fonction
        }
    }, [routeId]); // Dépendance sur routeId

    const fetchApiData = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            if (!token) return; // Ne pas continuer si aucun token

            const api = getApi(); // Obtenez l'instance Axios
            const response = await api.get(`/api/proprieteall/${routeId}`, { // Concaténez routeId dans l'URL
                headers: { Authorization: `Bearer ${token}` } // Ajoutez l'en-tête d'autorisation
            });

            setApiData(response.data); // Stockez les données dans l'état
        } catch (error) {
            console.error("Erreur lors de la récupération des données :", error.response?.data || error.message);
        }
    };



/*     const insertData = async (newData) => {
        try {
            const response = await axios.post('URL_DE_VOTRE_API', newData); // Remplacez par votre URL
            setApiData((prevData) => [...prevData, response.data]); // Ajoutez le nouvel élément aux données existantes
        } catch (error) {
            console.error("Erreur lors de l'insertion des données :", error);
        }
    }; */

/*     const updateData = async (id, updatedData) => {
        try {
            const response = await axios.put(`URL_DE_VOTRE_API/${id}`, updatedData); // Remplacez par votre URL
            setApiData((prevData) =>
                prevData.map((item) => (item.id === id ? response.data : item))
            ); // Mettez à jour l'élément dans les données existantes
        } catch (error) {
            console.error("Erreur lors de la mise à jour des données :", error);
        }
    }; */


    return (
       /*  <ApiContext.Provider value={{ apiData, nom, insertData, updateData }}> </ApiContext.Provider> */
              <ApiContexts.Provider value={{ nom, routeId}}>
                        {children}
              </ApiContexts.Provider>
          
       
    );
};