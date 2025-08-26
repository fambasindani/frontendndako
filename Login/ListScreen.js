"use client"

import { useState, useMemo } from "react"
import { View, Text, StyleSheet, Alert, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import _ from "lodash"
import Listflast from "./Listflast.js"
import { Couleurs } from "./Couleurs.js"

const ListScreen = ({ navigation }) => {
  const [activeFilter, setActiveFilter] = useState("all")

  const allProperties = useMemo(() => {
    const types = ["Maison", "Studio", "Parcelle", "Appartement", "Villa"]
    const statuses = ["En vente", "Location", "Vente"]
    const locations = ["Kinshasa", "Lubumbashi", "Goma", "Bukavu", "Matadi"]

    return _.times(20, (index) => ({
      id: index + 1,
      title: `${_.sample(types)} ${index % 3 === 0 ? "à vendre" : index % 3 === 1 ? "en location" : "moderne"}`,
      status: _.sample(statuses),
      location: `${_.sample(locations)}, ${_.sample(["Centre-ville", "Ngaliema", "Gombe", "Limete"])}`,
      price: index % 3 === 1 ? `${_.random(50, 500)} USD/Mois` : `${_.random(15000, 80000)} USD`,
      timeAgo: `Il y a ${_.random(1, 30)} jours`,
      image: require("../assets/maison.jpg"),
      type: _.sample(types).toLowerCase(),
    }))
  }, [])

  const filteredProperties = useMemo(() => {
    if (activeFilter === "all") return allProperties
    if (activeFilter === "location") return allProperties.filter((p) => p.status === "Location")
    if (activeFilter === "vente") return allProperties.filter((p) => p.status.includes("vente") || p.status === "Vente")
    return allProperties
  }, [allProperties, activeFilter])

  const handlePropertyPress = (property) => {
    Alert.alert("Détails", `Afficher les détails de: ${property.title}`)
  }

  const handleEditPress = (property) => {
    Alert.alert("Modifier", `Modifier: ${property.title}`)
  }

  const handleDeletePress = (property) => {
    Alert.alert("Supprimer", `Êtes-vous sûr de vouloir supprimer: ${property.title}?`, [
      { text: "Annuler", style: "cancel" },
      { text: "Supprimer", style: "destructive" },
    ])
  }

  const handleAddProperty = () => {
    Alert.alert("Ajouter", "Naviguer vers l'écran d'ajout de propriété")
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.agentInfo}>
          <View style={styles.agentAvatar}>
            <Ionicons name="person" size={24} color={Couleurs.white} />
          </View>
          <View>
            <Text style={styles.agentLabel}>AGENT</Text>
            <Text style={styles.agentName}>Schadrack Gina</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.addButton} onPress={handleAddProperty}>
          <Ionicons name="add" size={20} color={Couleurs.primary} />
          <Text style={styles.addButtonText}>Ajouter</Text>
        </TouchableOpacity>
      </View>

      {/* Filters */}
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

      {/* Section Title */}
      <Text style={styles.sectionTitle}>Mes propriétés</Text>

      {/* Property List */}
      <Listflast
        properties={filteredProperties}
        onPropertyPress={handlePropertyPress}
        onEditPress={handleEditPress}
        onDeletePress={handleDeletePress}
        itemsPerPage={10}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingTop:20,
    paddingBottom:30,
    flex: 1,
    backgroundColor: Couleurs.background,
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
})

export default ListScreen
