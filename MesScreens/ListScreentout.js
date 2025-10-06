import React, { useEffect, useState, useMemo } from "react";
import { View, Text, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApi, getImageUrl } from "../Api/getApi";
import ListflastTout from "../Composant/ListflastTout";
import { Couleurs } from "../Composant/Couleurs";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/fr";
import Loader from "../Composant/Loader"; // Importer votre composant Loader

dayjs.extend(relativeTime);
dayjs.locale("fr");

const ListScreentout = ({ navigation }) => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 50; // Nombre d'éléments par page

  // 🔹 Récupération des propriétés
  useEffect(() => {
    fetchProperties(page);
  }, [page]);

  const fetchProperties = async (page) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Erreur", "Token introuvable");
        return;
      }

      const api = getApi();
      const res = await api.get(`/api/getallproprieties?page=${page}&limit=${itemsPerPage}`);

      // Vérification de la structure de la réponse
      if (res.data && res.data.data && Array.isArray(res.data.data)) {
        const data = res.data.data.map((item) => ({
          id: item.id,
          ville: item.ville?.nom_ville ?? "Aucune ville",
          title: item.typepropriete?.nom_propriete ?? "Nom inconnu",
          status: item.statut ? "En vente" : "Location",
          statu: item.statut ? "vendre" : "louer",
          location: item.ville?.nom_ville ?? "Ville inconnue",
          price: formatPrice(item.prix),
          image: { uri: getImageUrl(item.image_principale) },
          nombre_chambre: item.nombre_chambre,
          nombre_salle_de_bain: item.nombre_salle_de_bain,
          description: item.description ?? "",
          date_enregistrement: item.date_enregistrement,
          timeAgo: item.date_enregistrement ? dayjs(item.date_enregistrement).fromNow() : "Date inconnue",
          latitude: item.latitude,
          longitude: item.longitude,
          nom_commune: item.commune?.nom_commune,
          prix: item.prix,
        }));

        setProperties((prev) => [...prev, ...data]); // Ajouter les nouvelles propriétés à la liste existante
      } else {
        console.error("La réponse de l'API n'est pas un tableau:", res.data);
        Alert.alert("Erreur", "Les données reçues ne sont pas valides.");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Erreur", "Impossible de récupérer les propriétés");
    } finally {
      setLoading(false);
      setLoadingMore(false); // Arrêter le chargement supplémentaire
    }
  };

  const formatPrice = (price) => {
    if (!price) return "N/A";
    return price >= 1000 ? `${(price / 1000).toFixed(0)}k USD` : `${price} USD`;
  };

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

  const filteredProperties = useMemo(() => {
    if (activeFilter === "all") return properties.filter((p) => isToday(p.date_enregistrement));
    if (activeFilter === "location") return properties.filter((p) => p.status === "Location");
    if (activeFilter === "vendre") return properties.filter((p) => p.statu === "vendre");
    if (activeFilter === "louer") return properties.filter((p) => p.statu === "louer");
    if (activeFilter === "vente") return properties.filter((p) => p.status === "En vente");
    return properties;
  }, [properties, activeFilter]);

  // 🔹 Navigation
  const handlePropertyPress = (property) => {
    navigation.navigate("Details", { id: property.id });
  };

  const loadMoreProperties = () => {
    if (loadingMore) return; // Évite de charger si déjà en cours
    setLoadingMore(true);
    setPage((prev) => prev + 1); // Incrémente la page pour charger plus
  };

  // 🔹 Loader principal
  if (loading) {
    return <Loader />;
  }

  const ActionMap=(item)=>{
    navigation.navigate("AppartementCard",{item:item})
  }

  return (
    <View style={styles.container}>
      {/* 🔹 Barre de recherche */}
      <TouchableOpacity
        style={styles.searchBar}
        onPress={() => navigation.navigate("FilterScreen")}
      >
        <Ionicons name="search" size={20} color={Couleurs.textSecondary} />
        <Text style={styles.searchText}>Rechercher une propriété...</Text>
      </TouchableOpacity>

      {/* 🔹 Filtres */}
      <View style={styles.filterContainer}>
        {[
          { key: "location", label: "En location" },
          { key: "vente", label: "En vente" },
          { key: "all", label: "Journalier" },
        ].map((filter) => (
          <TouchableOpacity
            key={filter.key}
            style={[styles.filterButton, activeFilter === filter.key && styles.filterButtonActive]}
            onPress={() => setActiveFilter(filter.key)}
          >
            <Text
              style={[
                styles.filterButtonText,
                activeFilter === filter.key && styles.filterButtonTextActive,
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 🔹 Liste */}
      <Text style={styles.sectionTitle}>
        {activeFilter === "all"
          ? "Propriétés enregistrées aujourd’hui"
          : "Mes propriétés"}
      </Text>

      <ListflastTout
        properties={filteredProperties}
        onPropertyPress={handlePropertyPress}
        itemsPerPage={itemsPerPage}
        onLoadMore={loadMoreProperties} // Passer la fonction pour charger plus
        ActionMap={ActionMap}
      />

      {/* Afficher l'indicateur de chargement supplémentaire */}
      {loadingMore && <Loader />}
    </View>
  );
};

// 🎨 Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Couleurs.background,
    marginBottom: 30,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Couleurs.white,
    padding: 10,
    margin: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Couleurs.border,
  },
  searchText: {
    marginLeft: 8,
    color: Couleurs.textSecondary,
    fontSize: 14,
  },
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Couleurs.white,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Couleurs.border,
  },
  filterButtonActive: {
    backgroundColor: Couleurs.primary,
    borderColor: Couleurs.primary,
  },
  filterButtonText: {
    fontSize: 14,
    color: Couleurs.textSecondary,
  },
  filterButtonTextActive: {
    color: Couleurs.white,
    fontWeight: "500",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Couleurs.textPrimary,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});

export default ListScreentout;