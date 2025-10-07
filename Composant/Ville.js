import { useState, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AjouteVilleScreen from "../MesScreens/AjouteVilleScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export default function Ville() {
    const [showAjout, setShowAjout] = useState(false);
    const [villes, setVilles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [villeEnEdition, setVilleEnEdition] = useState(null);

    // 🔹 Charger les villes depuis le backend
    const fetchVilles = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            const res = await axios.get("http://192.168.88.126:8000/api/villes", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setVilles(res.data);
        } catch (error) {
            console.log("Erreur fetch:", error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVilles();
    }, []);

    // 🔹 Suppression (avec confirmation)
    const handleDelete = async (id) => {
      
      
        // Alert.alert(
        //     "Confirmation",
        //     "Voulez-vous vraiment supprimer cette ville ?",
        //     [
        //         { text: "Annuler", style: "cancel" },
        //         {
        //             text: "Supprimer",
        //             style: "destructive",
        //             onPress: async () => {
        //                 try {
        //                     const token = await AsyncStorage.getItem("token");
        //                     await axios.delete(`http://192.168.88.126:8000/api/villes/${id}`, {
        //                         headers: { Authorization: `Bearer ${token}` },
        //                     });
        //                     setVilles((prev) => prev.filter((v) => v.id !== id));
        //                     Alert.alert("✅ Succès", "Ville supprimée avec succès.");
        //                 } catch (err) {
        //                     console.log("Erreur suppression:", err.message);
        //                     Alert.alert("❌ Erreur", "Échec de la suppression.");
        //                 }
        //             },
        //         },
        //     ]
        // );
    };

    const handleAddOrEdit = async () => {
        await fetchVilles(); // 🔁 recharge depuis le backend pour obtenir les relations à jour
        setShowAjout(false);
        setVilleEnEdition(null);
    };


    // 🔹 Ajout ou modification locale
    //   const handleAddOrEdit = (villeData) => {
    //     if (villeEnEdition) {
    //       // modification
    //       setVilles((prev) =>
    //         prev.map((v) => (v.id === villeData.id ? villeData : v))
    //       );
    //       setVilleEnEdition(null);
    //     } else {
    //       // ajout
    //       setVilles((prev) => [...prev, villeData]);
    //     }
    //     setShowAjout(false);
    //   };

    const renderItem = ({ item, index }) => (
        <View style={styles.card}>
            <View style={styles.cardLeft}>
                <View style={styles.numberBadge}>
                    <Text style={styles.numberText}>{index + 1}</Text>
                </View>
                <View style={styles.nomContainer}>
                    <Text style={styles.provinceText}>
                        {item.province?.nom_province || "N/A"}
                    </Text>
                    <Text style={styles.villeText}>
                        {item.nom_ville}
                    </Text>
                </View>

            </View>
            <View style={styles.cardRight}>
                <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => {
                        setVilleEnEdition(item);
                        setShowAjout(true);
                    }}
                >
                    <Ionicons name="create-outline" size={20} color="#3b82f6" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDelete(item.id)}
                >
                    <Ionicons name="trash-outline" size={20} color="#ef4444" />
                </TouchableOpacity>
            </View>
        </View>
    );

    // 🔹 Mode Ajout ou Edition
    if (showAjout) {
        return (
            <AjouteVilleScreen
                onAdd={handleAddOrEdit}
                onCancel={() => {
                    setShowAjout(false);
                    setVilleEnEdition(null);
                }}
                ville={villeEnEdition} // ✅ On passe la ville à modifier
            />
        );
    }

    // 🔹 Loader
    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color="#6366f1" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.topBar}>
                <Text style={styles.title}>Liste des Villes</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => {
                        setVilleEnEdition(null);
                        setShowAjout(true);
                    }}
                >
                    <Ionicons name="add-circle" size={24} color="#fff" />
                    <Text style={styles.addButtonText}>Ajouter</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={villes}
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
    topBar: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#e2e8f0",
    },
    title: { fontSize: 18, fontWeight: "700", color: "#1e293b" },
    addButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#10b981",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        gap: 6,
    },
    addButtonText: { color: "#fff", fontWeight: "600", fontSize: 14 },
    listContainer: { padding: 16, gap: 12 },
    card: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 12,
        elevation: 2,
    },
    cardLeft: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
    numberBadge: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "#6366f1",
        justifyContent: "center",
        alignItems: "center",
    },
    numberText: { color: "#fff", fontWeight: "700", fontSize: 16 },
    nomText: { fontSize: 16, fontWeight: "600", color: "#1e293b", flex: 1 },
    cardRight: { flexDirection: "row", gap: 8 },
    editButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#dbeafe",
        justifyContent: "center",
        alignItems: "center",
    },
    deleteButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#fee2e2",
        justifyContent: "center",
        alignItems: "center",
    },

    provinceText: {
        color: "#64748b",
        fontSize: 14,
    },
    villeText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#1e293b",
    },
});
