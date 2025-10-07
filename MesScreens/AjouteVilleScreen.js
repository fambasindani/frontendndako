import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApi } from "../Api/getApi";
import { Couleurs } from "../Composant/Couleurs";
import Droplist from "../Composant/Droplist";

export default function AjouteVilleScreen({ onAdd, onCancel, ville }) {
  const [nom, setNom] = useState("");
  const [provinces, setProvinces] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // ✅ Si on est en mode édition, pré-remplir les champs
  useEffect(() => {
    if (ville) {
      setNom(ville.nom_ville || "");
      if (ville.province) {
        setSelectedProvince({
          label: ville.province.nom_province,
          value: ville.province.id,
        });
      }
    }
  }, [ville]);

  // ✅ Charger la liste des provinces
  useEffect(() => {
    fetchProvinces();
  }, []);

  const fetchProvinces = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;
      const api = getApi();
      const res = await api.get("/api/provinces", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data.map((p) => ({
        label: p.nom_province,
        value: p.id,
      }));
      setProvinces(data);
    } catch (e) {
      console.log("Erreur fetch provinces:", e.message);
    }
  };

  // ✅ Envoi du formulaire (ajout ou modification)
  const handleSubmit = async () => {
    if (!nom.trim()) {
      setErrorMessage("Le nom de la ville est requis.");
      return;
    }
    if (!selectedProvince) {
      setErrorMessage("Veuillez sélectionner une province.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        setErrorMessage("Aucun token trouvé. Veuillez vous reconnecter.");
        setLoading(false);
        return;
      }

      const api = getApi();

      let response;

      if (ville) {
        // 🟢 Mode édition → PUT
        response = await api.put(
          `/api/villes/${ville.id}`,
          {
            nom_ville: nom.trim(),
            id_province: selectedProvince.value,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        Alert.alert("✅ Succès", "Ville mise à jour avec succès !");
      } else {
        // 🟢 Mode ajout → POST
        response = await api.post(
          "/api/villes",
          {
            nom_ville: nom.trim(),
            id_province: selectedProvince.value,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        Alert.alert("✅ Succès", "Ville ajoutée avec succès !");
      }

      // 🔁 Mise à jour de la liste
        onAdd(response.data);
      //onAdd();

      // 🧹 Réinitialiser
      if (!ville) {
        setNom("");
        setSelectedProvince(null);
      }
    } catch (error) {
      console.log("Erreur:", error.response?.data || error.message);
      const msg =
        error.response?.data?.errors?.nom_ville?.[0] ||
        error.response?.data?.message ||
        "Erreur lors de l’enregistrement.";
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {ville ? "Modifier la Ville" : "Ajouter une Ville"}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.formContainer}>
          <Text style={styles.label}>Nom de la Ville</Text>
          <TextInput
            style={[
              styles.input,
              errorMessage.includes("nom") && styles.inputError,
            ]}
            placeholder="Ex: Kinshasa"
            value={nom}
            onChangeText={(text) => {
              setNom(text);
              setErrorMessage("");
            }}
            placeholderTextColor="#94a3b8"
          />
          {errorMessage.includes("nom") && (
            <Text style={styles.errorText}>{errorMessage}</Text>
          )}
        </View>

        <View style={styles.formContainer}>
         <Text style={styles.label}>Province</Text>
          <Droplist
           // label="Province"
            value={selectedProvince}
            onSelect={(item) => {
              setSelectedProvince(item);
              setErrorMessage("");
            }}
            options={provinces}
            placeholder="Sélectionnez une province"
            error={
              errorMessage.includes("province") ? errorMessage : undefined
            }
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.cancelButtonText}>Annuler</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.submitButton,
              (loading || !nom.trim() || !selectedProvince) &&
                styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={loading || !nom.trim() || !selectedProvince}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>
                {ville ? "Mettre à jour" : "Enregistrer"}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1,  backgroundColor: "#f8fafc",  },
  header: {  flexDirection: "row",    justifyContent: "space-between", alignItems: "center",  padding: 16,  backgroundColor: "#fff",
    borderBottomWidth: 1,  
    borderBottomColor: "#e2e8f0",  },
  headerTitle: {  fontSize: 18,  fontWeight: "700", color: "#1e293b",  },
  content: { flex: 1,  padding: 24,  },
  formContainer: { marginBottom: 24,  },
  label: {  fontSize: 16,  fontWeight: "600",  color: "#1e293b",    marginBottom: 8,    },

  input: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#1e293b",
  },
  inputError: {
    borderColor: Couleurs.error,
  },
  errorText: {
    color: Couleurs.error,
    marginTop: 4,
    fontSize: 13,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#e2e8f0",
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#64748b",
  },
  submitButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: "#10b981",
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  submitButtonDisabled: {
    backgroundColor: "#94a3b8",
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});
