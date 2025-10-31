import React, { useRef, useEffect, useState, useContext, createContext } from "react";
import {
  ScrollView,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApi, getImageUrl } from "../Api/getApi";
import Loader from "../Composant/Loader";

const { width } = Dimensions.get("window");

// ---- CONTEXT ----
export const ApiContexts = createContext();

export const ApiProviderDetails = ({ children, routeId }) => {
  const [apiData, setApiData] = useState(null);

  useEffect(() => {
    const fetchApiData = async () => {
      try {
       /*  const token = await AsyncStorage.getItem("token");
        if (!token) return; */

        const api = getApi();
        const response = await api.get(`/api/proprieteall/${routeId}`, {
    /*       headers: { Authorization: `Bearer ${token}` }, */
        });

        setApiData(response.data);
      } catch (err) {
        console.error("Erreur API:", err.response?.data || err.message);
      }
    };

    if (routeId) fetchApiData();
  }, [routeId]);

  return <ApiContexts.Provider value={{ apiData }}>{children}</ApiContexts.Provider>;
};

// ---- DETAIL SCREEN ----
export default function DetailScreen() {
  const route = useRoute();
  const { id: routeId } = route.params || {};

  return (
    <ApiProviderDetails routeId={routeId}>
      <DetailContent />
    </ApiProviderDetails>
  );
}

// ---- DETAIL CONTENT ----
function DetailContent() {
  const { apiData } = useContext(ApiContexts);
  const scrollRef = useRef(null);
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nomComplet, setNomComplet] = useState("");

  // ---- FORMATAGE PRIX ----
  const formatNumber = (prix) => {
    if (!prix) return "N/A";
    if (prix < 1000) return prix.toString();
    const suffix = prix < 1000000 ? "k" : "M";
    const formattedNumber = (prix / (suffix === "k" ? 1000 : 1000000)).toFixed(0);
    return `${formattedNumber}${suffix}`;
  };

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

  // ---- NOM COMPLET VENDEUR ----
  useEffect(() => {
    if (!apiData) return;
    const prenom = apiData.utilisateur?.prenom ?? "Nom";
    const nomFamille = apiData.utilisateur?.nom_famille ?? "Inconnu";
    setNomComplet(`${prenom} ${nomFamille}`);
  }, [apiData]);

  // ---- RENDER ----
  if (!apiData) return <Loader />; // Affiche le loader tant que les données ne sont pas disponibles

  return (
    <ScrollView style={styles.container}>
      {/* Carrousel */}
      <View style={styles.imageContainer}>
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onMomentumScrollEnd={(e) => {
            const index = Math.round(e.nativeEvent.contentOffset.x / width);
            setCurrentIndex(index);
          }}
        >
          {images.length > 0 ? (
            images.map((img, index) => (
              <Image
                key={index}
                source={{ uri: img }}
                style={styles.image}
                onError={(e) => console.warn("Image load error", e.nativeEvent)}
              />
            ))
          ) : (
            <View style={[styles.image, styles.noImage]}>
              <Text style={{ color: "#777" }}>Aucune image disponible</Text>
            </View>
          )}
        </ScrollView>

        {/* Bouton partage */}
        <TouchableOpacity style={styles.shareButton}>
          <Icon name="share-alt" size={20} color="#fff" />
        </TouchableOpacity>

        {/* Dots */}
        {images.length > 1 && (
          <View style={styles.dotsContainer}>
            {images.map((_, idx) => (
              <View
                key={idx}
                style={[styles.dot, { backgroundColor: idx === currentIndex ? "#fff" : "#888" }]}
              />
            ))}
          </View>
        )}
      </View>

      {/* Infos principales */}
      <View style={styles.details}>
        <Text style={styles.title}>
          {apiData.typepropriete?.nom_propriete ?? ""}
          {apiData.statut ? " à vendre" : " à louer"}
        </Text>
        <Text style={styles.price}>${formatNumber(apiData.prix)}</Text>

        <View style={styles.row}>
          <Icon name="map-marker" size={18} color="#0d6efd" />
          <Text style={styles.address}>
            {apiData.avenue ?? "N/A"}, {apiData.quartier ?? "N/A"}, ville: {apiData.ville?.nom_ville ?? "N/A"}
          </Text>
        </View>

        <View style={styles.statusContainer}>
          <Text style={[styles.status, { backgroundColor: "#ff7f0e", color: "#fff" }]}>
            {apiData.statut ? "À vendre" : "À louer"}
          </Text>
          <Text style={[styles.status, { borderColor: "#0d6efd", color: "#0d6efd" }]}>
            Disponible maintenant
          </Text>
        </View>
      </View>

      {/* Description */}
      <Text style={styles.sectionTitle}>Description</Text>
      <Text style={styles.description}>
        {apiData.description ?? "Description non disponible"}
      </Text>

      {/* Détails supplémentaires */}
      <Text style={styles.sectionTitle}>Détails du bien</Text>
      <View style={styles.detailBox}>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Date d'ajout:</Text>
          <Text style={styles.value}>{new Date(apiData.date_enregistrement).toLocaleDateString()}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Prix :</Text>
          <Text style={styles.value}>${formatNumber(apiData.prix)}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Type :</Text>
          <Text style={styles.value}>{apiData.typepropriete?.nom_propriete ?? "N/A"}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Chambres :</Text>
          <Text style={styles.value}>{apiData.nombre_chambre ?? "N/A"}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Salle de bains :</Text>
          <Text style={styles.value}>{apiData.nombre_salle_de_bain ?? "N/A"}</Text>
        </View>
      </View>

      {/* Contact vendeur */}
      <Text style={styles.sectionTitle}>Contactez le vendeur</Text>
      <View style={styles.contactBox}>
        <View style={styles.contactHeader}>
          <Icon name="user-circle" size={40} color="#888" />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.contactName}>{nomComplet}</Text>
            <Text style={styles.contactRole}>Agent Immo</Text>
          </View>
        </View>

        <View style={styles.contactRow}>
          <Icon name="phone" size={18} color="#0d6efd" />
          <Text style={styles.contactText}>{apiData.utilisateur?.telephone ?? "Aucun numéro"}</Text>
        </View>

        <View style={styles.contactRow}>
          <Icon name="envelope" size={18} color="#0d6efd" />
          <Text style={styles.contactText}>{apiData.utilisateur?.email ?? "Aucun email"}</Text>
        </View>

        <TouchableOpacity style={styles.contactRow}>
          <Icon name="whatsapp" size={18} color="green" />
          <Text style={styles.contactText}>WhatsApp</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// ---- STYLES ----
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff",marginBottom:40, },
  imageContainer: { position: "relative",borderColor:"#1b3b78",borderBottomWidth:0.2,marginBottom:1 },
  image: { width: width, height: 250, resizeMode: "cover",},
  noImage: { alignItems: "center", justifyContent: "center", backgroundColor: "#f0f0f0", },
  shareButton: {alignItems: "center", justifyContent: "center", position: "absolute", top: 15, right: 15,width:45, height:45, backgroundColor: "#1b3b78",  borderRadius: 58 },
  dotsContainer: { position: "absolute", bottom: 10, flexDirection: "row", alignSelf: "center" },
  dot: { width: 10, height: 10, borderRadius: 5, marginHorizontal: 4 },
  details: { padding: 5, },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 5, color:"#1b3b78"},
  price: { fontSize: 20, fontWeight: "bold", color: "red", marginBottom: 10 },
  row: { flexDirection: "row", alignItems: "center", marginVertical: 5 },
  address: { marginLeft: 8, fontSize: 14, color: "#444", flexShrink: 1 },
  statusContainer: { flexDirection: "row", marginTop: 10 },
  status: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 0, fontSize: 13, borderWidth: 0.2, overflow: "hidden", marginLeft: 0.7 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginVertical: 10,  color:"#1b3b78", margin:5 },
  description: { fontSize: 14, color: "#444", marginBottom: 10, lineHeight: 20, margin:5 },
  detailBox: { backgroundColor: "#e0e0e0", borderRadius: 4, padding: 10, paddingBottom: 10, margin:6 },
  detailRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: "#bebfbf" },
  label: { fontSize: 14, fontWeight: "600", color: "#333" },
  value: { fontSize: 14, color: "#444" },
  contactBox: { backgroundColor: "#e0e0e0", borderRadius: 4, padding: 10, marginBottom: 20, margin:6 },
  contactHeader: { flexDirection: "row", alignItems: "center", marginBottom: 15,borderBottomWidth: 1, borderBottomColor: "#bebfbf",padding:9},
  contactName: { fontSize: 16, fontWeight: "bold" },
  contactRole: { fontSize: 13, color: "#666" },
  contactRow: { flexDirection: "row", alignItems: "center", marginVertical: 5 },
  contactText: { marginLeft: 10, fontSize: 14, color: "#333" },
});
