import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
} from "react-native";
import { getImageUrl } from "../Api/getApi";
import { Ionicons } from "@expo/vector-icons";

export default function ListeFiltreScreen({ route, navigation }) {
  const { resultats = [] } = route.params || {};

  const openMap = (item) => {
    if (item.latitude && item.longitude) {
      const url = `https://www.google.com/maps?q=${item.latitude},${item.longitude}`;
      Linking.openURL(url);
    } else {
      alert("Localisation non disponible");
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {/* Image */}
      <Image
        source={{ uri: getImageUrl(item.image_principale) }}
        style={styles.image}
      />

      {/* Infos */}
      <View style={styles.info}>
        <Text style={styles.title}>{item.typepropriete?.nom_propriete}</Text>

        <Text style={styles.location}>
          <Ionicons name="location-outline" size={14} color="#64748b" />{" "}
          {item.ville?.nom_ville || "Ville inconnue"}{" "}
          <Text style={styles.province}>
            ({item.province?.nom_province || "Province inconnue"})
          </Text>
        </Text>

        <Text style={styles.price}>{item.prix} USD</Text>

        <Text style={styles.details}>
          {item.nombre_chambre} ch, {item.nombre_salle_de_bain} sdb
        </Text>

        {/* Boutons actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.btnDetail}
            onPress={() => navigation.navigate("Details", { id: item.id })}
          >
            <Ionicons name="information-circle-outline" size={16} color="#fff" />
            <Text style={styles.btnText}>Détails</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnMap}
            onPress={() => openMap(item)}
          >
            <Ionicons name="map-outline" size={16} color="#fff" />
            <Text style={styles.btnText}>Voir sur la carte</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Résultats du filtre ({resultats.length})</Text>
      <FlatList
        data={resultats}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9", padding: 10 },
  header: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: "#1e293b",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 12,
    overflow: "hidden",
    elevation: 2,
  },
  image: { width: 100, height: 100 },
  info: { flex: 1, padding: 10 },
  title: { fontWeight: "600", fontSize: 16, color: "#1e293b" },
  location: {
    fontSize: 13,
    color: "#475569",
    marginVertical: 2,
  },
  province: {
    color: "#94a3b8",
  },
  price: {
    fontSize: 14,
    color: "#0f766e",
    fontWeight: "bold",
    marginTop: 2,
  },
  details: {
    fontSize: 13,
    color: "#555",
    marginTop: 2,
  },
  actions: {
    flexDirection: "row",
    marginTop: 8,
    gap: 8,
  },
  btnDetail: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2563eb",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  btnMap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#16a34a",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  btnText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
});
