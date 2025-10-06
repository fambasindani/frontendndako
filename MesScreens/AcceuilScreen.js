import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { getApi, getImageUrl } from "../Api/getApi";
import { Couleurs } from "../Composant/Couleurs";

const { width } = Dimensions.get("window");

export default function AccueilScreen({ navigation }) {
  const [selected, setSelected] = useState("Tout");
  const [premiers, setPremiers] = useState([]);
  const [derniers, setDerniers] = useState([]);
  const [loading, setLoading] = useState(true);

  const genres = ["Tout", "Location", "Vente", "Journalier"];

  // 🔹 Format prix
  const formatPrice = (price) => {
    if (!price) return "N/A";
    const p = parseFloat(price.toString());
    return p >= 1000 ? `${(p / 1000).toFixed(1)}k USD` : `${p} USD`;
  };

  // 🔹 Récupération depuis API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const api = getApi();

        const [res1, res2] = await Promise.all([
          api.get("/api/premiersProprietes"),
          api.get("/api/derniersProprietes"),
        ]);

        const mapData = (data) =>
          data.map((item) => ({
            id: item.id,
            title: item.typepropriete?.nom_propriete ?? "Type inconnu",
            status: item.statut ? "En vente" : "Location",
            location:
              item.ville?.nom_ville ??
              item.province?.nom_province ??
              "Localisation inconnue",
            price: formatPrice(item.prix),
            image: { uri: getImageUrl(item.image_principale) },
            rooms: item.nombre_chambre,
            baths: item.nombre_salle_de_bain,
            description: item.description ?? "",
            date: item.date_enregistrement,
          }));

        setPremiers(mapData(res1.data));
        setDerniers(mapData(res2.data));
      } catch (err) {
        console.error(err);
        Alert.alert("Erreur", "Impossible de charger les propriétés");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 🔹 Filtrage selon le type
  const isToday = (dateStr) => {
    if (!dateStr) return false;
    const today = new Date();
    const date = new Date(dateStr);
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const filterList = (list) => {
    if (selected === "Tout") return list;
    if (selected === "Location") return list.filter((i) => i.status === "Location");
    if (selected === "Vente") return list.filter((i) => i.status === "En vente");
    if (selected === "Journalier") return list.filter((i) => isToday(i.date));
    return list;
  };

  // 🔹 Loader
  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0d2c6b" />
        <Text>Chargement des propriétés...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* 🔹 Filtres */}
      <View style={styles.filterSection}>
        <Text style={styles.title}>Genre d'annonce</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.buttonContainer}
        >
          {genres.map((genre) => (
            <TouchableOpacity
              key={genre}
              style={[
                styles.filterButton,
                selected === genre && styles.filterButtonSelected,
              ]}
              onPress={() => setSelected(genre)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  selected === genre && styles.filterButtonTextSelected,
                ]}
              >
                {genre}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* 🔹 Section 1 : avec Voir + */}
      <Section
        title="Propriétés récentes"
        data={filterList(premiers)}
        navigation={navigation}
        selected={selected}
        showSeeMore={true}
      />

      {/* 🔹 Section 2 : sans Voir + */}
      <Section
        title="Anciennes propriétés"
        data={filterList(derniers)}
        navigation={navigation}
        selected={selected}
        showSeeMore={false}
      />
    </ScrollView>
  );
}

// 🔹 Section Component
function Section({ title, data, navigation, selected, showSeeMore }) {
  const handleSeeMore = () => {
    navigation.navigate("ListScreentout", { filter: selected });
  };

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>{title}</Text>

        {/* Affiche Voir + seulement si showSeeMore = true */}
        {showSeeMore && (
          <TouchableOpacity onPress={handleSeeMore}>
            <Text style={styles.seeMore}>Voir +</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 10 }}
      >
        {data.length > 0 ? (
          data.map((item) => (
            <Card key={item.id} item={item} navigation={navigation} />
          ))
        ) : (
          <Text style={{ paddingHorizontal: 15, color: "#999" }}>
            Aucune propriété
          </Text>
        )}
      </ScrollView>
    </View>
  );
}

// 🔹 Carte
function Card({ item, navigation }) {
  return (
    <View style={styles.card}>
      <Image source={item.image} style={styles.image} />
      <View style={styles.status}>
        <Text style={styles.statusText}>{item.status}</Text>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.rowBetween}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.price}>{item.price}</Text>
        </View>

        <View style={styles.row}>
          <Icon name="map-marker" size={14} color="#0d6efd" />
          <Text style={styles.location}>{item.location}</Text>
        </View>

        <View style={styles.row}>
          <Icon name="bed" size={14} color="#444" />
          <Text style={styles.detailText}> {item.rooms} </Text>
          <Icon name="bath" size={14} color="#444" />
          <Text style={styles.detailText}> {item.baths} </Text>
        </View>

        <Text numberOfLines={1} style={styles.description}>
          {item.description}
        </Text>

        <TouchableOpacity
          style={styles.detailsButton}
          onPress={() => navigation.navigate("Details", { id: item.id })}
        >
          <Text style={styles.detailsButtonText}>Voir les détails</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// 🔹 Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  filterSection: { marginBottom: 20, backgroundColor: "#fff", padding: 10 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10, color: "#0d2c6b" },
  buttonContainer: { flexDirection: "row" },
  filterButton: {
    backgroundColor: "white",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#224270",
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginRight: 8,
  },
  filterButtonSelected: { backgroundColor: "#224270" },
  filterButtonText: { color: "#224270", fontWeight: "bold" },
  filterButtonTextSelected: { color: "white" },
  section: { marginBottom: 30 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#0d2c6b" },
  seeMore: { fontSize: 14, color: "#0d6efd", fontWeight: "600" },
  card: {
    width: width * 0.65,
    marginRight: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    overflow: "hidden",
  },
  image: { width: "100%", height: 150 },
  status: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#FFD580",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusText: { fontSize: 12, fontWeight: "600" },
  cardBody: { padding: 10 },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  cardTitle: { fontSize: 16, fontWeight: "bold", color: "#222" },
  price: { fontSize: 15, color: "red", fontWeight: "bold" },
  row: { flexDirection: "row", alignItems: "center", marginVertical: 2 },
  location: { fontSize: 12, marginLeft: 4, color: "#444" },
  detailText: { fontSize: 12, marginHorizontal: 4, color: "#444" },
  description: { fontSize: 12, color: "#666", marginVertical: 4 },
  detailsButton: {
    marginTop: 8,
    backgroundColor: Couleurs.couleurprincipale,
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: "center",
  },
  detailsButtonText: { color: "#fff", fontSize: 13, fontWeight: "600" },
});
