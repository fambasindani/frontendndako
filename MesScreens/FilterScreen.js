import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TextInput,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { getApi } from "../Api/getApi";
import AsyncStorage from "@react-native-async-storage/async-storage";

const MAX_PRICE = 100_000_000; // 100 millions

export default function FilterScreen({ navigation }) {
  const [selectedPropertyType, setSelectedPropertyType] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedBathroom, setSelectedBathroom] = useState(null);
  const [rawPriceMinStr, setRawPriceMinStr] = useState("0");
  const [rawPriceMaxStr, setRawPriceMaxStr] = useState(String(MAX_PRICE));
  const [propertyTypes, setPropertyTypes] = useState([]);

  // Charger les types de propriétés
  useEffect(() => {
    const fetchPropertyTypes = async () => {
      try {
        const api = getApi();
        const response = await api.get("api/type-proprietes");
        setPropertyTypes(response.data);
      } catch (error) {
        console.error("Erreur:", error);
        Alert.alert("Erreur", "Impossible de charger les types de propriétés.");
      }
    };
    fetchPropertyTypes();
  }, []);

  const sanitizeNumberStr = (s = "") => s.toString().replace(/\D/g, "");
  const formatNumber = (s = "") =>
    Number(s === "" ? 0 : s).toLocaleString("fr-FR");

  const handleApply = async () => {
    const id_type = selectedPropertyType;
    const nombre_chambre = parseInt(selectedRoom);
    const nombre_salle_de_bain = parseInt(selectedBathroom);
    const prix_initiale = parseInt(sanitizeNumberStr(rawPriceMinStr));
    const prix_final = parseInt(sanitizeNumberStr(rawPriceMaxStr));

    if (!id_type || !nombre_chambre || !nombre_salle_de_bain) {
      Alert.alert("Erreur", "Veuillez remplir tous les filtres.");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");
      const api = getApi();
      const res = await api.post(
        "/api/getProprietesFiltrees",
        {
          id_type,
          nombre_chambre,
          nombre_salle_de_bain,
          prix_initiale,
          prix_final,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Naviguer vers la page résultat avec les données
      navigation.navigate("ListeFiltreScreen", { resultats: res.data });
    } catch (e) {
      console.error(e);
      Alert.alert("Erreur", "Impossible d'appliquer le filtre.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
       // style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView style={styles.scrollView}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Type de propriété</Text>
            <View style={styles.buttonContainer}>
              {propertyTypes.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.filterButton,
                    selectedPropertyType === type.id && styles.selectedButton,
                  ]}
                  onPress={() => setSelectedPropertyType(type.id)}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      selectedPropertyType === type.id && styles.selectedText,
                    ]}
                  >
                    {type.nom_propriete}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Nombre de chambres</Text>
            <View style={styles.buttonContainer}>
              {["1", "2", "3", "4", "5"].map((num) => (
                <TouchableOpacity
                  key={num}
                  style={[
                    styles.filterButton,
                    selectedRoom === num && styles.selectedButton,
                  ]}
                  onPress={() => setSelectedRoom(num)}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      selectedRoom === num && styles.selectedText,
                    ]}
                  >
                    {num}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Salles de bains</Text>
            <View style={styles.buttonContainer}>
              {["1", "2", "3", "4", "5"].map((num) => (
                <TouchableOpacity
                  key={num}
                  style={[
                    styles.filterButton,
                    selectedBathroom === num && styles.selectedButton,
                  ]}
                  onPress={() => setSelectedBathroom(num)}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      selectedBathroom === num && styles.selectedText,
                    ]}
                  >
                    {num}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Prix */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Échelle des prix</Text>
            <View style={styles.priceInputsRow}>
              <TextInput
                value={rawPriceMinStr}
                onChangeText={(t) => setRawPriceMinStr(sanitizeNumberStr(t))}
                keyboardType="numeric"
                style={styles.priceInput}
                placeholder="Prix min"
              />
              <TextInput
                value={rawPriceMaxStr}
                onChangeText={(t) => setRawPriceMaxStr(sanitizeNumberStr(t))}
                keyboardType="numeric"
                style={styles.priceInput}
                placeholder="Prix max"
              />
            </View>
          </View>
        </ScrollView>

        {/* Boutons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
            <Text style={styles.cancelButtonText}>Annuler</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
            <Text style={styles.applyButtonText}>Appliquer</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollView: { padding: 20 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: "600", color: "#2E5BBA", marginBottom: 12 },
  buttonContainer: { flexDirection: "row", flexWrap: "wrap" },
  filterButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    marginBottom: 8,
    marginRight: 8,
  },
  selectedButton: { backgroundColor: "#2E5BBA", borderColor: "#2E5BBA" },
  buttonText: { fontSize: 14 },
  selectedText: { color: "#fff" },
  priceInputsRow: { flexDirection: "row", gap: 10 },
  priceInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#fff",
  },
  actionButtons: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#D4AF37",
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
    marginRight: 8,
  },
  cancelButtonText: { color: "#fff", fontSize: 16 },
  applyButton: {
    flex: 1,
    backgroundColor: "#2E5BBA",
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
    marginLeft: 8,
  },
  applyButtonText: { color: "#fff", fontSize: 16 },
});
