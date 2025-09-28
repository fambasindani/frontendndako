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
// Assurez-vous que le chemin est correct

const { width } = Dimensions.get("window");

export default function Detail1() {
  const { apiData } = useContext(ApiContexts);
  
  const scrollRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto scroll toutes les 3 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % (apiData.autres_images ? JSON.parse(apiData.autres_images).length + 1 : 1);
      setCurrentIndex(nextIndex);
      scrollRef.current?.scrollTo({ x: nextIndex * width, animated: true });
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex, apiData]);

  const images = [getImageUrl(apiData.image_principale), ...(apiData.autres_images ? JSON.parse(apiData.autres_images).map(getImageUrl) : [])];

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
          {images.map((img, index) => (
            <Image key={index} source={{ uri: img }} style={styles.image} />
          ))}
        </ScrollView>

        {/* Bouton partage */}
        <TouchableOpacity style={styles.shareButton}>
          <Icon name="share-alt" size={20} color="#fff" />
        </TouchableOpacity>

        {/* Indicateurs (points) */}
        <View style={styles.dotsContainer}>
          {images.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                { backgroundColor: index === currentIndex ? "#fff" : "#888" },
              ]}
            />
          ))}
        </View>
      </View>

      {/* Détails */}
      <View style={styles.details}>
        <Text style={styles.title}>{apiData.statut ? "A vendre" : "A louer"} {apiData.typepropriete.nom_propriete}</Text>
        <Text style={styles.price}>{apiData.prix}$</Text>

        <View style={styles.row}>
          <Icon name="map-marker" size={18} color="#0d6efd" />
          <Text style={styles.address}>
            {apiData.avenue}, {apiData.quartier}, ville: {apiData.ville.nom_ville}
          </Text>
        </View>

        <View style={styles.statusContainer}>
          <Text style={[styles.status, { backgroundColor: "#ff7f0e", color: "#fff" }]}>
            {apiData.statut ? "A vendre" : "A louer"}
          </Text>
          <Text style={[styles.status, { borderColor: "#0d6efd", color: "#0d6efd" }]}>
            Disponible maintenant
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    width: width,
    height: 250,
    resizeMode: "cover",
  },
  shareButton: {
    position: "absolute",
    top: 20,
    right: 15,
    backgroundColor: "#0d6efd",
    padding: 10,
    borderRadius: 30,
  },
  dotsContainer: {
    position: "absolute",
    bottom: 10,
    flexDirection: "row",
    alignSelf: "center",
    gap: 6,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  details: {
    padding: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 5,
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    color: "red",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  address: {
    marginLeft: 8,
    fontSize: 14,
    color: "#444",
    flexShrink: 1,
  },
  statusContainer: {
    flexDirection: "row",
    marginTop: 10,
    gap: 10,
  },
  status: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    fontSize: 13,
    borderWidth: 1,
    overflow: "hidden",
  },
});