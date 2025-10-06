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

export default function Detail1() {
  const { apiData } = useContext(ApiContexts);
  const scrollRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState([]);
  
    function formatNumber(prix) {
    // Vérifiez si le nombre est inférieur à 1000
    if (prix < 1000) {
        return prix.toString();
    }

    // Déterminez le suffixe
    const suffix = prix < 1000000 ? 'k' : 'M';

    // Calculez le nombre formaté
    const formattedNumber = (prix / (suffix === 'k' ? 1000 : 1000000)).toFixed(0);

    return `${formattedNumber}${suffix}`;
}


  // Effect pour charger les images
  useEffect(() => {
    if (apiData && Object.keys(apiData).length > 0) {
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
    }
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

  if (!apiData || Object.keys(apiData).length === 0) {
      return <Loader></Loader>;;// Utilisez le loader ici
  }

  return (
    <View style={styles.container}>
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
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  loader: { flex: 1, alignItems: "center", justifyContent: "center" },
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
  status: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8, fontSize: 13, borderWidth: 1, overflow: "hidden", marginLeft:3 },
});