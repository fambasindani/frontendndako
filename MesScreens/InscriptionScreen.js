import { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Input from "../Login/Input.js";
import Button from "../Login/Button.js";
import Droplist from "../Login/Droplist.js";
import { Couleurs } from "../Login/Couleurs.js";
import { getApi } from "../Api/getApi.js";
import * as ImagePicker from 'expo-image-picker';

const InscriptionScreen = () => {
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [typesProprietaire, setTypesProprietaire] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [villes, setVilles] = useState([]);
  const [communes, setCommunes] = useState([]);

  const [formData, setFormData] = useState({
    typeProprietaire: null,
    prix: "",
    nombreChambres: "",
    nombreSalleBains: "",
    dimension: "",
    description: "",
    statut: 1, // 1 pour En Vente, 0 pour En Location
    province: null,
    ville: null,
    commune: null,
    typesProprietaire:null,
    avenue: "",
    quartier: "",
    imagePrincipale: null,
    autresImages: [],
  });

  // Charger les types de propriété
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) return setFetching(false);

        const api = getApi();
        const res = await api.get("/api/type-proprietes", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const options = res.data.map((item) => ({ value: item.id, label: item.nom_propriete }));
        setTypesProprietaire(options);
      } catch (err) {
        console.error("Erreur types de propriété :", err.response?.data || err.message);
      } finally {
        setFetching(false);
      }
    };
    fetchTypes();
  }, []);

  // Charger provinces
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) return;

        const api = getApi();
        const res = await api.get("/api/provinces", { headers: { Authorization: `Bearer ${token}` } });

        const opts = res.data.map((p) => ({ value: p.id, label: p.nom_province }));
        setProvinces(opts);
      } catch (err) {
        console.error("Erreur provinces :", err.response?.data || err.message);
      }
    };
    fetchProvinces();
  }, []);

  // Charger villes quand province change
  useEffect(() => {
    if (!formData.province) {
      setVilles([]);
      setCommunes([]);
      return;
    }
    const fetchVilles = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) return;

        const api = getApi();
        const res = await api.get("/api/villes", { headers: { Authorization: `Bearer ${token}` } });

        const filtered = res.data
          .filter((v) => v.id_province === formData.province.value)
          .map((v) => ({ value: v.id, label: v.nom_ville }));

        setVilles(filtered);
        setCommunes([]);
      } catch (err) {
        console.error("Erreur villes :", err.response?.data || err.message);
      }
    };
    fetchVilles();
  }, [formData.province]);

  // Charger communes quand ville change
  useEffect(() => {
    if (!formData.ville) {
      setCommunes([]);
      return;
    }
    const fetchCommunes = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) return;

        const api = getApi();
        const res = await api.get("/api/communes", { headers: { Authorization: `Bearer ${token}` } });

        const filtered = res.data
          .filter((c) => c.id_ville === formData.ville.value)
          .map((c) => ({ value: c.id, label: c.nom_commune }));

        setCommunes(filtered);
      } catch (err) {
        console.error("Erreur communes :", err.response?.data || err.message);
      }
    };
    fetchCommunes();
  }, [formData.ville]);

  // Validation du formulaire
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.typeProprietaire) newErrors.typeProprietaire = "Le type de propriété est requis";
    if (!formData.prix.trim()) newErrors.prix = "Le prix est requis";
    else if (isNaN(formData.prix) || Number.parseFloat(formData.prix) <= 0)
      newErrors.prix = "Le prix doit être un nombre valide";
    if (!formData.nombreChambres.trim()) newErrors.nombreChambres = "Le nombre de chambres est requis";
    if (!formData.nombreSalleBains.trim()) newErrors.nombreSalleBains = "Le nombre de salles de bains est requis";
    if (!formData.dimension.trim()) newErrors.dimension = "La dimension est requise";
    if (!formData.description.trim()) newErrors.description = "La description est requise";
    else if (formData.description.length < 20)
      newErrors.description = "La description doit contenir au moins 20 caractères";
    if (!formData.province) newErrors.province = "Veuillez sélectionner une province";
    if (!formData.ville) newErrors.ville = "Veuillez sélectionner une ville";
    if (!formData.commune) newErrors.commune = "Veuillez sélectionner une commune";
    if (!formData.avenue) newErrors.avenue = "Veuillez saisir l'avenue";
    if (!formData.quartier) newErrors.quartier = "Veuillez saisir le quartier";

    setErrors(newErrors);
    console.log("Erreurs de validation :", newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleChargerImagePrincipale = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("La permission d'accès à la galerie est requise !");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync();
    console.log("Résultat du sélecteur d'image principale : ", pickerResult);

    if (!pickerResult.canceled) {
      const imageUri = pickerResult.assets[0].uri;
      setFormData((prev) => ({
        ...prev,
        imagePrincipale: imageUri,
      }));
    } else {
      Alert.alert("Erreur", "La sélection d'image principale a été annulée.");
    }
  };

  const handleChargerImages = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("La permission d'accès à la galerie est requise !");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
    });

    console.log("Résultat du sélecteur d'image : ", pickerResult);

    if (!pickerResult.canceled) {
      const selectedImages = pickerResult.assets.map(asset => asset.uri);
      setFormData((prev) => ({
        ...prev,
        autresImages: selectedImages,
      }));
    } else {
      Alert.alert("Erreur", "La sélection d'image a été annulée.");
    }
  };

  const handleSubmit = async () => {
    console.log("Données du formulaire : ", formData);

    if (!validateForm()) {
      Alert.alert("Erreur", "Veuillez corriger les erreurs dans le formulaire");
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Erreur", "Authentification requise !");
        return;
      }

      const api = getApi();

      if (!formData.imagePrincipale || formData.imagePrincipale.trim() === "") {
        Alert.alert("Erreur", "L'image principale est requise.");
        return;
      }

      if (!Array.isArray(formData.autresImages) || formData.autresImages.length === 0) {
        Alert.alert("Erreur", "Autres images sont requises");
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append('id_utilisateur', "1"); // Remplacez par l'ID de l'utilisateur courant
      formDataToSend.append('id_province', formData.province.value);
      formDataToSend.append('id_type', formData.typeProprietaire.value);
      formDataToSend.append('id_ville', formData.ville.value);
      formDataToSend.append('id_commune', formData.commune.value);
      formDataToSend.append('quartier', formData.quartier);
      formDataToSend.append('avenue', formData.avenue);
      formDataToSend.append('prix', parseFloat(formData.prix));
      formDataToSend.append('nombre_chambre', parseInt(formData.nombreChambres, 10));
      formDataToSend.append('nombre_salle_de_bain', parseInt(formData.nombreSalleBains, 10));
      formDataToSend.append('dimension', formData.dimension);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('statut', formData.statut === 1 ? 1 : 0);

      // Ajouter l'image principale
      formDataToSend.append('image_principale', {
        uri: formData.imagePrincipale,
        type: 'image/jpeg',
        name: 'image_principale.jpg',
      });

      // Ajouter d'autres images
      formData.autresImages.forEach((imageUri, index) => {
        formDataToSend.append(`autres_images[${index}]`, {
          uri: imageUri,
          type: 'image/jpeg',
          name: `autres_image_${index}.jpg`,
        });
      });

      // Appel à l'API pour soumettre les données
      const response = await api.post("/api/proprietes", formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log("Réponse de l'API : ", response.data);
      Alert.alert("Succès", "Votre propriété a été ajoutée avec succès !");
      
      // Réinitialiser le formulaire
      setFormData({
        typeProprietaire: null,
        prix: "",
        nombreChambres: "",
        nombreSalleBains: "",
        dimension: "",
        description: "",
        statut: 1,
        province: null,
        ville: null,
        commune: null,
        avenue: "",
        quartier: "",
        imagePrincipale: null,
        autresImages: [],
      });
    } catch (err) {
      console.error("Erreur lors de l'ajout de la propriété :", err.response?.data || err.message);
      Alert.alert("Erreur", "Une erreur est survenue lors de l'ajout de la propriété");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={Couleurs.primary} />
        <Text>Chargement des types...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Sélection du type de propriété */}
        <Droplist
          label="Type de propriété"
          value={formData.typeProprietaire}
          onSelect={(item) => {
            setFormData((prev) => ({ ...prev, typeProprietaire: item }));
            if (errors.typeProprietaire) setErrors((prev) => ({ ...prev, typeProprietaire: null }));
          }}
          placeholder="Sélectionner le type"
          options={typesProprietaire}
          error={errors.typeProprietaire}
        />

        {/* Sélection de la province */}
        <Droplist
          label="Province"
          value={formData.province}
          options={provinces}
          placeholder="-- Choisir une province --"
          onSelect={(item) => {
            setFormData((prev) => ({ ...prev, province: item, ville: null, commune: null }));
            if (errors.province) setErrors((prev) => ({ ...prev, province: null }));
          }}
          error={errors.province}
        />

        {/* Sélection de la ville */}
        <Droplist
          label="Ville"
          value={formData.ville}
          options={villes}
          placeholder="-- Choisir une ville --"
          onSelect={(item) => {
            setFormData((prev) => ({ ...prev, ville: item, commune: null }));
            if (errors.ville) setErrors((prev) => ({ ...prev, ville: null }));
          }}
          disabled={!formData.province}
          error={errors.ville}
        />

        {/* Sélection de la commune */}
        <Droplist
          label="Commune"
          value={formData.commune}
          options={communes}
          placeholder="-- Choisir une commune --"
          onSelect={(item) => {
            setFormData((prev) => ({ ...prev, commune: item }));
            if (errors.commune) setErrors((prev) => ({ ...prev, commune: null }));
          }}
          disabled={!formData.ville}
          error={errors.commune}
        />

        {/* Champ pour le quartier */}
        <Input
          label="Quartier"
          value={formData.quartier}
          onChangeText={(text) => {
            setFormData((prev) => ({ ...prev, quartier: text }));
            if (errors.quartier) setErrors((prev) => ({ ...prev, quartier: null }));
          }}
          placeholder="Entrer le quartier"
          error={errors.quartier}
        />

        {/* Champ pour l'avenue */}
        <Input
          label="Avenue"
          value={formData.avenue}
          onChangeText={(text) => {
            setFormData((prev) => ({ ...prev, avenue: text }));
            if (errors.avenue) setErrors((prev) => ({ ...prev, avenue: null }));
          }}
          placeholder="Entrer l'avenue"
          error={errors.avenue}
        />

        {/* Champ pour le prix */}
        <Input
          label="Prix: Vente ou Location"
          value={formData.prix}
          onChangeText={(text) => {
            setFormData((prev) => ({ ...prev, prix: text }));
            if (errors.prix) setErrors((prev) => ({ ...prev, prix: null }));
          }}
          placeholder="Entrer le prix"
          keyboardType="numeric"
          error={errors.prix}
        />

        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <Input
              label="Nombre Chambres"
              value={formData.nombreChambres}
              onChangeText={(text) => {
                setFormData((prev) => ({ ...prev, nombreChambres: text }));
                if (errors.nombreChambres) setErrors((prev) => ({ ...prev, nombreChambres: null }));
              }}
              placeholder="0"
              keyboardType="numeric"
              error={errors.nombreChambres}
            />
          </View>
          <View style={styles.halfWidth}>
            <Input
              label="Nombre salle de bains"
              value={formData.nombreSalleBains}
              onChangeText={(text) => {
                setFormData((prev) => ({ ...prev, nombreSalleBains: text }));
                if (errors.nombreSalleBains) setErrors((prev) => ({ ...prev, nombreSalleBains: null }));
              }}
              placeholder="0"
              keyboardType="numeric"
              error={errors.nombreSalleBains}
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <Input
              label="Dimension"
              value={formData.dimension}
              onChangeText={(text) => {
                setFormData((prev) => ({ ...prev, dimension: text }));
                if (errors.dimension) setErrors((prev) => ({ ...prev, dimension: null }));
              }}
              placeholder="Ex: 100m²"
              error={errors.dimension}
            />
          </View>
        </View>

        <Input
          label="Description de la propriété"
          value={formData.description}
          onChangeText={(text) => {
            setFormData((prev) => ({ ...prev, description: text }));
            if (errors.description) setErrors((prev) => ({ ...prev, description: null }));
          }}
          placeholder="Décrivez votre propriété en détail..."
          multiline={true}
          numberOfLines={4}
          style={styles.textArea}
          error={errors.description}
        />

        {/* Bouton pour charger l'image principale */}
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={() => handleChargerImagePrincipale(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="cloud-upload-outline" size={24} color={Couleurs.primary} />
          <Text style={styles.uploadText}>Charger l'image principale</Text>
        </TouchableOpacity>

        {/* Bouton pour charger d'autres images */}
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={() => handleChargerImages(false)}
          activeOpacity={0.8}
        >
          <Ionicons name="cloud-upload-outline" size={24} color={Couleurs.primary} />
          <Text style={styles.uploadText}>Charger autres images</Text>
        </TouchableOpacity>

        {/* Affichage du nombre d'images sélectionnées */}
        <Text style={styles.imageCountText}>
          Nombre d'images sélectionnées : {formData.autresImages.length}
        </Text>

        {/* Sélection du statut de la propriété */}
        <View style={styles.statutContainer}>
          <Text style={styles.statutLabel}>Statut de la propriété</Text>
          <View style={styles.statutButtons}>
            <TouchableOpacity
              style={[styles.statutButton, formData.statut === 1 && styles.statutButtonActive]}
              onPress={() => setFormData((prev) => ({ ...prev, statut: 1 }))}
              activeOpacity={0.8}
            >
              <Text style={[styles.statutButtonText, formData.statut === 1 && styles.statutButtonTextActive]}>
                En Vente
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.statutButton, formData.statut === 0 && styles.statutButtonActive]}
              onPress={() => setFormData((prev) => ({ ...prev, statut: 0 }))}
              activeOpacity={0.8}
            >
              <Text style={[styles.statutButtonText, formData.statut === 0 && styles.statutButtonTextActive]}>
                En Location
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <Button
          title="Ajouter"
          onPress={handleSubmit}
          loading={loading}
          icon="add-circle"
          iconPosition="right"
          style={styles.submitButton}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Couleurs.background },
  content: { padding: 20, paddingBottom: 40 },
  row: { flexDirection: "row", justifyContent: "space-between", gap: 12 },
  halfWidth: { flex: 1 },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Couleurs.white,
    borderWidth: 2,
    borderColor: Couleurs.primary,
    borderStyle: "dashed",
    borderRadius: 8,
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginBottom: 10,
    marginTop: 10,
  },
  uploadText: { marginLeft: 10, color: Couleurs.primary },
  statutContainer: { marginVertical: 12 },
  statutLabel: { fontWeight: "bold", marginBottom: 6 },
  statutButtons: { flexDirection: "row", gap: 10 },
  statutButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: Couleurs.primary,
    borderRadius: 6,
    paddingVertical: 10,
    alignItems: "center",
  },
  statutButtonActive: { backgroundColor: Couleurs.primary },
  statutButtonText: { color: Couleurs.primary, fontWeight: "bold" },
  statutButtonTextActive: { color: Couleurs.white },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  imageCountText: { marginVertical: 10, fontWeight: "bold" },
});

export default InscriptionScreen;