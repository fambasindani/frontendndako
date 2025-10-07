import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AjouteProvinceScreen from "../MesScreens/AjouteProvinceScreen";
import { getApi } from "../Api/getApi";
import ModalPop from "../Modal/Message";

export default function Province() {
  const [showAjout, setShowAjout] = useState(false);
  const [provinces, setProvinces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success");
  const [provinceEnEdition, setProvinceEnEdition] = useState(null);

  const fetchProvinces = async () => {
    try {
      setFetching(true);
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("Token manquant");
      const api = getApi();
      const res = await api.get("/api/provinces", { headers: { Authorization: `Bearer ${token}` } });
      setProvinces(res.data);
    } catch (error) {
      console.error(error);
      setModalMessage("Erreur lors du chargement des provinces");
      setModalType("error");
      setModalVisible(true);
    } finally {
      setLoading(false);
      setFetching(false);
    }
  };

  useEffect(() => { fetchProvinces(); }, []);

  const handleDelete = (id) => {
    /* setProvinces((prev) => prev.filter((p) => p.id !== id));
    setModalMessage("Province supprimée !");
    setModalType("success");
    setModalVisible(true); */
  };

  const handleAddOrEdit = (provinceData) => {
    if (provinceEnEdition) {
      // modification
      setProvinces((prev) => prev.map((p) => (p.id === provinceData.id ? provinceData : p)));
      setProvinceEnEdition(null);
    } else {
      // ajout
      setProvinces((prev) => [...prev, provinceData]);
    }
    setShowAjout(false);
    setModalMessage(provinceEnEdition ? "Province modifiée !" : "Province ajoutée !");
    setModalType("success");
    setModalVisible(true);
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.card}>
      <View style={styles.cardLeft}>
        <View style={styles.numberBadge}><Text style={styles.numberText}>{index + 1}</Text></View>
        <Text style={styles.nomText}>{item.nom_province}</Text>
      </View>

      <View style={styles.cardRight}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => { setProvinceEnEdition(item); setShowAjout(true); }}
        >
          <Ionicons name="create-outline" size={20} color="#3b82f6" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
          <Ionicons name="trash-outline" size={20} color="#ef4444" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (showAjout) return (
    <AjouteProvinceScreen
      onAdd={handleAddOrEdit}
      onCancel={() => { setShowAjout(false); setProvinceEnEdition(null); }}
      province={provinceEnEdition}
    />
  );

  if (loading || fetching) return (
    <View style={styles.loaderContainer}>
      <ActivityIndicator size="large" color="#6366f1" />
      <Text style={styles.loaderText}>Chargement des provinces...</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.title}>Liste des Provinces</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setShowAjout(true)}>
          <Ionicons name="add-circle" size={24} color="#fff" />
          <Text style={styles.addButtonText}>Ajouter</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={provinces}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      <ModalPop visible={modalVisible} message={modalMessage} type={modalType} onClose={() => setModalVisible(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc", marginBottom: 25 },
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loaderText: { marginTop: 10, color: "#475569", fontSize: 16 },
  topBar: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#e2e8f0" },
  title: { fontSize: 18, fontWeight: "700", color: "#1e293b" },
  addButton: { flexDirection: "row", alignItems: "center", backgroundColor: "#10b981", paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, gap: 6, elevation: 2 },
  addButtonText: { color: "#fff", fontWeight: "600", fontSize: 14 },
  listContainer: { padding: 16, gap: 12 },
  card: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#fff", padding: 16, borderRadius: 12, elevation: 2 },
  cardLeft: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
  numberBadge: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#6366f1", justifyContent: "center", alignItems: "center" },
  numberText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  nomText: { fontSize: 16, fontWeight: "600", color: "#1e293b", flex: 1 },
  cardRight: { flexDirection: "row", gap: 8 },
  editButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#dbeafe", justifyContent: "center", alignItems: "center" },
  deleteButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#fee2e2", justifyContent: "center", alignItems: "center" },
});










