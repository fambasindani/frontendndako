import React, { createContext, useState, useEffect } from 'react';
import { getApi } from '../Api/getApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';


export const ApiContexts = createContext();


export default function DetailScreen() {
  const route = useRoute();
  const { id: routeId } = route.params || {};

  return (
    <ApiProviderDetails routeId={routeId}>
      <DetailContent />
    </ApiProviderDetails>
  );
}

// Provider
export const ApiProviderDetails = ({ children, routeId }) => {
  const [apiData, setApiData] = useState(null);

  useEffect(() => {
    const fetchApiData = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) return;
        const api = getApi();
        const response = await api.get(`/api/proprieteall/${routeId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setApiData(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    if (routeId) fetchApiData();
  }, [routeId]);

  return (
    <ApiContexts.Provider value={{ apiData }}>
      {children}
    </ApiContexts.Provider>
  );
};

// DetailContent
function DetailContent() {
  const { apiData } = useContext(ApiContexts);
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nomComplet, setNomComplet] = useState("");
  const scrollRef = useRef(null);

  // ---- CHARGER IMAGES ----
  useEffect(() => {
    if (!apiData) return;

    let autresImages = [];
    try {
      if (apiData.autres_images) {
        if (typeof apiData.autres_images === "string") {
          const parsed = JSON.parse(apiData.autres_images);
          if (Array.isArray(parsed)) autresImages = parsed;
        } else if (Array.isArray(apiData.autres_images)) {
          autresImages = apiData.autres_images;
        }
      }
    } catch (err) {
      console.warn("Erreur parse autres_images:", err);
    }

    const newImages = [];
    if (apiData.image_principale) newImages.push(getImageUrl(apiData.image_principale));
    if (autresImages.length > 0)
      newImages.push(...autresImages.map((img) => getImageUrl(img)));

    setImages(newImages);
  }, [apiData]);

  // ---- NOM COMPLET VENDEUR ----
  useEffect(() => {
    if (!apiData) return;
    const prenom = apiData.utilisateur?.prenom ?? "Nom";
    const nomFamille = apiData.utilisateur?.nom_famille ?? "Inconnu";
    setNomComplet(`${prenom} ${nomFamille}`);
  }, [apiData]);

  // ---- CARROUSEL AUTO-SCROLL ----
  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % images.length;
        scrollRef.current?.scrollTo({ x: next * width, animated: true });
        return next;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [images]);

  // ---- RENDER ----
  if (!apiData) {
    // loader rendu **dans JSX**, mais tous les hooks ont déjà été appelés
    return <Loader />;
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Ton code de rendu ici */}
      <Text>Détails du bien : {apiData.typepropriete?.nom_propriete}</Text>
      <Text>Vendeur : {nomComplet}</Text>
      {/* etc... */}
    </ScrollView>
  );
}





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


