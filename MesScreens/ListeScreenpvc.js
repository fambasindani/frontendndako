import { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import Province from "../Composant/Province"
import Ville from "../Composant/Ville"
import Commune from "../Composant/Commune"
import { Couleurs } from "../Composant/Couleurs"

export default function ListeScreenpvc() {
  const [activeTab, setActiveTab] = useState("province")

  const renderContent = () => {
    switch (activeTab) {
      case "province":
        return <Province />
      case "ville":
        return <Ville />
      case "commune":
        return <Commune />
      default:
        return <Province />
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A1F44" />

      {/* Header */}
     {/*  <View style={styles.header}>
        <Text style={styles.headerTitle}>Gestion Administrative</Text>
      </View> */}

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "province" && styles.activeTab]}
          onPress={() => setActiveTab("province")}
        >
          <Ionicons name="map" size={20} color={activeTab === "province" ? "#fff" : "#0A1F44"} />
          <Text style={[styles.tabText, activeTab === "province" && styles.activeTabText]}>Province</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "ville" && styles.activeTab]}
          onPress={() => setActiveTab("ville")}
        >
          <Ionicons name="business" size={20} color={activeTab === "ville" ? "#fff" : "#0A1F44"} />
          <Text style={[styles.tabText, activeTab === "ville" && styles.activeTabText]}>Ville</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "commune" && styles.activeTab]}
          onPress={() => setActiveTab("commune")}
        >
          <Ionicons name="location" size={20} color={activeTab === "commune" ? "#fff" : "#0A1F44"} />
          <Text style={[styles.tabText, activeTab === "commune" && styles.activeTabText]}>Commune</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>{renderContent()}</View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    backgroundColor: Couleurs.couleurprincipale,
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    elevation: 4,
    shadowColor: Couleurs.couleurprincipale,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#f1f5f9",
    gap: 8,
  },
  activeTab: {
    backgroundColor: Couleurs.couleurprincipale
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "",
  },
  activeTabText: {
    color: "#fff",
  },
  content: {
    flex: 1,
  },
})
