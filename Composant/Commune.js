"use client";

import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AjouteCommuneScreen from "../MesScreens/AjouteCommuneScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApi } from "../Api/getApi";

export default function Commune() {
  const [showAjout, setShowAjout] = useState(false);
  const [communes, setCommunes] = useState([]);
  const [villes, setVilles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [communeEnEdition, setCommuneEnEdition] = useState(null);

  useEffect(() => {
    fetchVilles();
    fetchCommunes();
  }, []);

  const fetchVilles = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const api = getApi();
      const res = await api.get("/api/villes", { headers: { Authorization: `Bearer ${token}` } });
      setVilles(res.data);
    } catch (error) {
      console.log("Erreur fetch villes:", error.message);
    }
  };

  const fetchCommunes = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const api = getApi();
      const res = await api.get("/api/communes", { headers: { Authorization: `Bearer ${token}` } });
      setCommunes(res.data);
    } catch (error) {
      console.log("Erreur fetch communes:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    // try {
    //   const token = await AsyncStorage.getItem("token");
    //   const api = getApi();
    //   await api.delete(`/api/communes/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    //   setCommunes((prev) => prev.filter((c) => c.id !== id));
    // } catch (error) {
    //   console.log("Erreur delete commune:", error.message);
    // }
  };

     const handleAddOrEdit = async () => {
        await fetchCommunes(); // 🔁 recharge depuis le backend pour obtenir les relations à jour
        setShowAjout(false);
        setCommuneEnEdition(null);
    };

 /*  const handleAddOrEdit = (communeData) => {
    if (communeEnEdition) {
      setCommunes((prev) => prev.map((c) => (c.id === communeData.id ? communeData : c)));
      setCommuneEnEdition(null);
    } else {
      setCommunes((prev) => [...prev, communeData]);
    }
    setShowAjout(false);
  }; */

  const renderItem = ({ item, index }) => (
    <View style={styles.card}>
      <View style={styles.cardLeft}>
        <View style={styles.numberBadge}>
          <Text style={styles.numberText}>{index + 1}</Text>
        </View>
        <View style={styles.nomContainer}>
          <Text style={styles.villeText}>{item.ville?.nom_ville || "N/A"}</Text>
          <Text style={styles.communeText}>{item.nom_commune}</Text>
        </View>
      </View>

      <View style={styles.cardRight}>
        <TouchableOpacity style={styles.editButton} onPress={() => { setCommuneEnEdition(item); setShowAjout(true); }}>
          <Ionicons name="create-outline" size={20} color="#3b82f6" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
          <Ionicons name="trash-outline" size={20} color="#ef4444" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (showAjout) {
    return (
      <AjouteCommuneScreen
        onAdd={handleAddOrEdit}
        onCancel={() => { setShowAjout(false); setCommuneEnEdition(null); }}
        commune={communeEnEdition}
        villes={villes}
      />
    );
  }

  if (loading) {
    return <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#6366f1" />
    </View>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.title}>Liste des Communes</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setShowAjout(true)}>
          <Ionicons name="add-circle" size={24} color="#fff" />
          <Text style={styles.addButtonText}>Ajouter</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={communes}
        renderItem={renderItem}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc", marginBottom: 25 },
  topBar: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#e2e8f0" },
  title: { fontSize: 18, fontWeight: "700", color: "#1e293b" },
  addButton: { flexDirection: "row", alignItems: "center", backgroundColor: "#10b981", paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, gap: 6 },
  addButtonText: { color: "#fff", fontWeight: "600", fontSize: 14 },
  listContainer: { padding: 16, gap: 12 },
  card: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#fff", padding: 16, borderRadius: 12, elevation: 2 },
  cardLeft: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
  numberBadge: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#6366f1", justifyContent: "center", alignItems: "center" },
  numberText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  nomContainer: { flexDirection: "column" },
  villeText: { color: "#64748b", fontSize: 14 },
  communeText: { fontSize: 16, fontWeight: "600", color: "#1e293b" },
  cardRight: { flexDirection: "row", gap: 8 },
  editButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#dbeafe", justifyContent: "center", alignItems: "center" },
  deleteButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#fee2e2", justifyContent: "center", alignItems: "center" },
});
