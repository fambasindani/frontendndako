"use client";

import React, { useEffect, useState, useMemo } from "react";
import { View, Text, StyleSheet, Alert, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApi, getImageUrl } from "../Api/getApi";
import Listflast from "../Composant/Listflast";
import { Couleurs } from "../Composant/Couleurs";

// 🕒 Import dayjs et plugin
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/fr";
dayjs.extend(relativeTime);
dayjs.locale("fr");

const ListScreen = ({ navigation }) => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [UserNom, setUserNom] = useState('');
  

  // 🔹 Formatage du prix
  const formatPrice = (price) => {
    if (!price) return "N/A";
    if (price >= 1000) {
      return `${(price / 1000).toFixed(0)}k USD`;
    }
    return `${price} USD`;
  };

  // 🔹 Récupération des propriétés depuis l'API
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const nom = await AsyncStorage.getItem("userNom");
        const prenom = await AsyncStorage.getItem("userPrenom");
        const userId = await AsyncStorage.getItem("userId");
        
        const nomcomplets=prenom+"  "+nom;
        setUserNom(nomcomplets);
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          Alert.alert("Erreur", "Token introuvable");
          return;
        }

        const api = getApi();
       // const res = await api.get("/api/proprieteall");
       
        const res = await api.get(`api/proprieteIdUser/${userId}`);
        const data = res.data.map((item) => ({
          id: item.id,
          nom:item.utilisateur?.nom_famille ,
          prenom:item.utilisateur?.prenom ,
          title: item.typepropriete?.nom_propriete ?? "Nom inconnu",
          status: item.statut ? "En vente" : "Location",
          location: item.ville?.nom_ville ?? "Ville inconnue",
          price: formatPrice(item.prix),
          image: { uri: getImageUrl(item.image_principale) },
          nombre_chambre: item.nombre_chambre,
          nombre_salle_de_bain: item.nombre_salle_de_bain,
          description: item.description ?? "",
          date_enregistrement: item.date_enregistrement,
          // ⏰ Temps relatif
          timeAgo: item.date_enregistrement ? dayjs(item.date_enregistrement).fromNow() : "Date inconnue",
        }));

        setProperties(data);
      } catch (err) {
        console.error(err);
        Alert.alert("Erreur", "Impossible de récupérer les propriétés");
      } finally {
        setLoading(false);
      }
    };


     
    fetchProperties();
  }, []);

  const nomcomplet = 
  properties[0] 
    ? `${properties[0]?.prenom ?? ""} ${properties[0]?.nom ?? ""}`.trim() 
    : "Nom inconnu";


  // 🔹 Fonction pour comparer les dates (même jour)
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

  // 🔹 Filtrage
  const filteredProperties = useMemo(() => {
    if (activeFilter === "all") return properties.filter((p) => isToday(p.date_enregistrement)); // Journalier
    if (activeFilter === "location") return properties.filter((p) => p.status === "Location");
    if (activeFilter === "vente") return properties.filter((p) => p.status === "En vente");
    return properties;
  }, [properties, activeFilter]);

  // 🔹 Navigation & actions
  const handlePropertyPress = (property) => {
    navigation.navigate("Details", { id: property.id });
  };

  const handleEditPress = (property) => {
    Alert.alert("Modifier", `Modifier: ${property.title}`);
  };

  const handleDeletePress = (property) => {
    Alert.alert("Supprimer", `Voulez-vous supprimer: ${property.title}?`, [
      { text: "Annuler", style: "cancel" },
      { text: "Supprimer", style: "destructive" },
    ]);
  };

  const handleAddProperty = () => {
    navigation.navigate("Ajouter une propriété");
  };

  // 🔹 Loader
  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={Couleurs.primary} />
        <Text>Chargement des propriétés...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 🔹 Header */}
      <View style={styles.header}>
        <View style={styles.agentInfo}>
          <View style={styles.agentAvatar}>
            <Ionicons name="person" size={24} color={Couleurs.white} />
          </View>
          <View>
            <Text style={styles.agentLabel}>AGENT</Text>
            <Text style={styles.agentName}>{UserNom ?? "Agent inconnu"}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.addButton} onPress={handleAddProperty}>
          <Ionicons name="add" size={20} color={Couleurs.primary} />
          <Text style={styles.addButtonText}>Ajouter</Text>
        </TouchableOpacity>
      </View>

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
            <Text style={[styles.filterButtonText, activeFilter === filter.key && styles.filterButtonTextActive]}>
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 🔹 Liste */}
      <Text style={styles.sectionTitle}>
        {activeFilter === "all" ? "Propriétés enregistrées aujourd’hui" : "Mes propriétés"}
      </Text>

      <Listflast
        properties={filteredProperties}
        onPropertyPress={handlePropertyPress}
        onEditPress={handleEditPress}
        onDeletePress={handleDeletePress}
        itemsPerPage={10}
      />
    </View>
  );
};

// 🎨 Styles
const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingBottom: 30,
    flex: 1,
    backgroundColor: Couleurs.background,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: Couleurs.white,
    borderBottomWidth: 1,
    borderBottomColor: Couleurs.border,
  },
  agentInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  agentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Couleurs.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  agentLabel: {
    fontSize: 12,
    color: Couleurs.textSecondary,
    fontWeight: "600",
  },
  agentName: {
    fontSize: 14,
    color: Couleurs.textPrimary,
    fontWeight: "500",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Couleurs.primary,
    borderRadius: 6,
  },
  addButtonText: {
    marginLeft: 6,
    color: Couleurs.primary,
    fontSize: 14,
    fontWeight: "500",
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

export default ListScreen;
