import React, { useRef, useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { ApiContexts } from "../context/ApiProviderDetails";
import { getImageUrl } from "../Api/getApi";
import Loader from '../Composant/Loader'; // Importer le Loader

const { width } = Dimensions.get("window");

export default function Detail() {
  const { apiData } = useContext(ApiContexts);
  const scrollRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState([]);
  const [nomcomplet, setnomcomplet] = useState(null);

  // Vérifiez si apiData est disponible
  if (!apiData) {
    return <Loader />; // Afficher le Loader ici
  }

  // Formater le prix
  function formatNumber(prix) {
    if (prix < 1000) {
      return prix.toString();
    }
    const suffix = prix < 1000000 ? 'k' : 'M';
    const formattedNumber = (prix / (suffix === 'k' ? 1000 : 1000000)).toFixed(0);
    return `${formattedNumber}${suffix}`;
  }

  // Charger les images
  useEffect(() => {
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
      autresImages = [];
    }

    const newImages = [];
    if (apiData.image_principale) {
      newImages.push(getImageUrl(apiData.image_principale));
    }
    if (autresImages.length > 0) {
      newImages.push(...autresImages.map((img) => getImageUrl(img)));
    }

    setImages(newImages);
  }, [apiData]);

  // Auto-scroll
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

  // Récupérer le nom complet de l'utilisateur
  useEffect(() => {
    const prenom = apiData.utilisateur?.prenom ?? "nom inconnu";
    const nomFamille = apiData.utilisateur?.nom_famille ?? "";
    setnomcomplet(`${prenom} ${nomFamille}`);
  }, [apiData]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Partie 1 : Carrousel + infos principales */}
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
                onError={(e) => {
                  console.warn('Image load error', e.nativeEvent);
                }}
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

        {/* Indicateurs (points) */}
        {images.length > 1 && (
          <View style={styles.dotsContainer}>
            {images.map((_, idx) => (
              <View
                key={idx}
                style={[
                  styles.dot,
                  { backgroundColor: idx === currentIndex ? "#fff" : "#888" },
                ]}
              />
            ))}
          </View>
        )}
      </View>

      {/* Détails */}
      <View style={styles.details}>
        <Text style={styles.title}>
          {apiData.typepropriete?.nom_propriete ?? ""}
          {apiData.statut ? " à vendre" : " à louer"}{" "}
        </Text>
        <Text style={styles.price}>${formatNumber(apiData.prix) ?? "N/A"} </Text>

        <View style={styles.row}>
          <Icon name="map-marker" size={18} color="#0d6efd" />
          <Text style={styles.address}>
            {apiData.avenue ?? "N/A"}, {apiData.quartier ?? "N/A"}, ville:{" "}
            {apiData.ville?.nom_ville ?? "N/A"}
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

      {/* Détails du bien */}
      <Text style={styles.sectionTitle}>Détails du bien</Text>
      <View style={styles.detailBox}>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Date d'ajout:</Text>
          <Text style={styles.value}>
            {new Date(apiData.date_enregistrement).toLocaleDateString() ?? "N/A"}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Prix :</Text>
          <Text style={styles.value}>${formatNumber(apiData.prix) ?? "N/A"}</Text>
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
        <View style={styles.detailRow}>
          <Text style={styles.label}>Statut :</Text>
          <Text style={styles.value}>{apiData.statut ? "À Vendre - Disponible" : "À Louer"}</Text>
        </View>
      </View>

      {/* Contact vendeur */}
      <Text style={styles.sectionTitle}>Contactez le vendeur</Text>
      <View style={styles.contactBox}>
        <View style={styles.contactHeader}>
          <Icon name="user-circle" size={40} color="#888" />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.contactName}>{nomcomplet ?? "nom inconnu"}</Text>
            <Text style={styles.contactRole}>Agent Immo</Text>
          </View>
        </View>

        {/* Téléphone */}
        <View style={styles.contactRow}>
          <Icon name="phone" size={18} color="#0d6efd" />
          <Text style={styles.contactText}>{apiData.utilisateur?.telephone ?? "Aucun num téléphone"}</Text>
        </View>

        {/* Email */}
        <View style={styles.contactRow}>
          <Icon name="envelope" size={18} color="#0d6efd" />
          <Text style={styles.contactText}>{apiData.utilisateur?.email ?? "Aucun email"}</Text>
        </View>

        {/* WhatsApp */}
        <TouchableOpacity style={styles.contactRow}>
          <Icon name="whatsapp" size={18} color="green" />
          <Text style={styles.contactText}> whatsapp </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  imageContainer: { position: "relative" },
  image: { width: width, height: 250, resizeMode: "cover" },
  noImage: { alignItems: "center", justifyContent: "center", backgroundColor: "#f0f0f0" },
  shareButton: { position: "absolute", top: 20, right: 15, backgroundColor: "#0d6efd", padding: 10, borderRadius: 30 },
  dotsContainer: { position: "absolute", bottom: 10, flexDirection: "row", alignSelf: "center" },
  dot: { width: 10, height: 10, borderRadius: 5, marginHorizontal: 4 },
  details: { padding: 15 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 5 },
  price: { fontSize: 20, fontWeight: "bold", color: "red", marginBottom: 10 },
  row: { flexDirection: "row", alignItems: "center", marginVertical: 5 },
  address: { marginLeft: 8, fontSize: 14, color: "#444", flexShrink: 1 },
  statusContainer: { flexDirection: "row", marginTop: 10 },
  status: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8, fontSize: 13, borderWidth: 1, overflow: "hidden", marginLeft: 3 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginVertical: 10, color: "#222" },
  description: { fontSize: 14, color: "#444", marginBottom: 10, lineHeight: 20 },
  detailBox: { backgroundColor: "#f5f5f5", borderRadius: 8, padding: 10, marginBottom: 15 },
  detailRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6, borderBottomWidth: 0.5, borderBottomColor: "#ddd" },
  label: { fontSize: 14, fontWeight: "600", color: "#333" },
  value: { fontSize: 14, color: "#444" },
  contactBox: { backgroundColor: "#f5f5f5", borderRadius: 8, padding: 12 },
  contactHeader: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  contactName: { fontSize: 16, fontWeight: "bold" },
  contactRole: { fontSize: 13, color: "#666" },
  contactRow: { flexDirection: "row", alignItems: "center", marginVertical: 5 },
  contactText: { marginLeft: 10, fontSize: 14, color: "#333" },
});