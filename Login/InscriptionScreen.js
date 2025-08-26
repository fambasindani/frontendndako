"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import Input from "./Input.js"
import Button from "./Button.js"
import Droplist from "./Droplist.js"
import PhoneInput from "./PhoneInput.js"
import { Couleurs } from "./Couleurs.js"

const InscriptionScreen = () => {
  const [formData, setFormData] = useState({
    typeProprietaire: null,
    prix: "",
    nombreChambres: "",
    nombreSalleBains: "",
    dimension: "",
    adresse: "",
    description: "",
    pays: null,
    telephone: "",
    statut: "En Vente",
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  // Options pour le type de propriétaire
  const typesProprietaire = [
    { value: "parcelle", label: "Parcelle" },
    { value: "maison", label: "Maison" },
    { value: "appartement", label: "Appartement" },
    { value: "villa", label: "Villa" },
    { value: "terrain", label: "Terrain" },
    { value: "bureau", label: "Bureau" },
    { value: "commerce", label: "Commerce" },
  ]

  const validateForm = () => {
    const newErrors = {}

    if (!formData.typeProprietaire) {
      newErrors.typeProprietaire = "Le type de propriété est requis"
    }

    if (!formData.prix.trim()) {
      newErrors.prix = "Le prix est requis"
    } else if (isNaN(formData.prix) || Number.parseFloat(formData.prix) <= 0) {
      newErrors.prix = "Le prix doit être un nombre valide"
    }

    if (!formData.nombreChambres.trim()) {
      newErrors.nombreChambres = "Le nombre de chambres est requis"
    } else if (isNaN(formData.nombreChambres) || Number.parseInt(formData.nombreChambres) < 0) {
      newErrors.nombreChambres = "Le nombre de chambres doit être un nombre valide"
    }

    if (!formData.nombreSalleBains.trim()) {
      newErrors.nombreSalleBains = "Le nombre de salles de bains est requis"
    } else if (isNaN(formData.nombreSalleBains) || Number.parseInt(formData.nombreSalleBains) < 0) {
      newErrors.nombreSalleBains = "Le nombre de salles de bains doit être un nombre valide"
    }

    if (!formData.dimension.trim()) {
      newErrors.dimension = "La dimension est requise"
    }

    if (!formData.adresse.trim()) {
      newErrors.adresse = "L'adresse est requise"
    }

    if (!formData.description.trim()) {
      newErrors.description = "La description est requise"
    } else if (formData.description.length < 20) {
      newErrors.description = "La description doit contenir au moins 20 caractères"
    }

    if (!formData.pays) {
      newErrors.pays = "Le pays est requis"
    }

    if (!formData.telephone.trim()) {
      newErrors.telephone = "Le numéro de téléphone est requis"
    } else if (formData.telephone.length < 8) {
      newErrors.telephone = "Le numéro de téléphone doit contenir au moins 8 chiffres"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert("Erreur", "Veuillez corriger les erreurs dans le formulaire")
      return
    }

    setLoading(true)
    try {
      // Simulation d'une requête API
      await new Promise((resolve) => setTimeout(resolve, 2000))

      Alert.alert("Succès", "Votre propriété a été ajoutée avec succès !", [
        {
          text: "OK",
          onPress: () => {
            // Reset form
            setFormData({
              typeProprietaire: null,
              prix: "",
              nombreChambres: "",
              nombreSalleBains: "",
              dimension: "",
              adresse: "",
              description: "",
              pays: null,
              telephone: "",
              statut: "En Vente",
            })
          },
        },
      ])
    } catch (error) {
      Alert.alert("Erreur", "Une erreur est survenue lors de l'ajout de la propriété")
    } finally {
      setLoading(false)
    }
  }

  const handleChargerImages = () => {
    Alert.alert("Charger les images", "Fonctionnalité à implémenter")
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Text style={styles.title}>Ajouter une propriété</Text>

        <Droplist
          label="Type de propriété"
          value={formData.typeProprietaire}
          onSelect={(item) => setFormData((prev) => ({ ...prev, typeProprietaire: item }))}
          placeholder="Sélectionner le type"
          options={typesProprietaire}
          error={errors.typeProprietaire}
        />

        <Input
          label="Prix: Vente ou Location"
          value={formData.prix}
          onChangeText={(text) => setFormData((prev) => ({ ...prev, prix: text }))}
          placeholder="Entrer le prix"
          keyboardType="numeric"
          error={errors.prix}
        />

        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <Input
              label="Nombre Chambres"
              value={formData.nombreChambres}
              onChangeText={(text) => setFormData((prev) => ({ ...prev, nombreChambres: text }))}
              placeholder="0"
              keyboardType="numeric"
              error={errors.nombreChambres}
            />
          </View>

          <View style={styles.halfWidth}>
            <Input
              label="Nombre salle de bains"
              value={formData.nombreSalleBains}
              onChangeText={(text) => setFormData((prev) => ({ ...prev, nombreSalleBains: text }))}
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
              onChangeText={(text) => setFormData((prev) => ({ ...prev, dimension: text }))}
              placeholder="Ex: 100m²"
              error={errors.dimension}
            />
          </View>

          <View style={styles.halfWidth}>
            <Input
              label="Adresse"
              value={formData.adresse}
              onChangeText={(text) => setFormData((prev) => ({ ...prev, adresse: text }))}
              placeholder="Adresse complète"
              error={errors.adresse}
            />
          </View>
        </View>

        <Input
          label="Description de la propriété"
          value={formData.description}
          onChangeText={(text) => setFormData((prev) => ({ ...prev, description: text }))}
          placeholder="Décrivez votre propriété en détail..."
          multiline={true}
          numberOfLines={4}
          style={styles.textArea}
          error={errors.description}
        />

        <PhoneInput
          label="Numéro de téléphone"
          value={formData.telephone}
          onChangeText={(text) => setFormData((prev) => ({ ...prev, telephone: text }))}
          selectedCountry={formData.pays}
          onCountrySelect={(country) => setFormData((prev) => ({ ...prev, pays: country }))}
          error={errors.telephone || errors.pays}
          placeholder="Votre numéro"
        />

        <TouchableOpacity style={styles.uploadButton} onPress={handleChargerImages} activeOpacity={0.8}>
          <Ionicons name="cloud-upload-outline" size={24} color={Couleurs.primary} />
          <Text style={styles.uploadText}>Charger les images de la propriété</Text>
        </TouchableOpacity>

        <View style={styles.statutContainer}>
          <Text style={styles.statutLabel}>Statut de la propriété</Text>
          <View style={styles.statutButtons}>
            <TouchableOpacity
              style={[styles.statutButton, formData.statut === "En Vente" && styles.statutButtonActive]}
              onPress={() => setFormData((prev) => ({ ...prev, statut: "En Vente" }))}
              activeOpacity={0.8}
            >
              <Text style={[styles.statutButtonText, formData.statut === "En Vente" && styles.statutButtonTextActive]}>
                En Vente
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.statutButton, formData.statut === "En Location" && styles.statutButtonActive]}
              onPress={() => setFormData((prev) => ({ ...prev, statut: "En Location" }))}
              activeOpacity={0.8}
            >
              <Text
                style={[styles.statutButtonText, formData.statut === "En Location" && styles.statutButtonTextActive]}
              >
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
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Couleurs.background,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: Couleurs.textPrimary,
    textAlign: "center",
    marginBottom: 30,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
    paddingTop: 12,
  },
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
    marginBottom: 24,
  },
  uploadText: {
    fontSize: 16,
    color: Couleurs.primary,
    fontWeight: "500",
    marginLeft: 8,
  },
  statutContainer: {
    marginBottom: 24,
  },
  statutLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: Couleurs.textPrimary,
    marginBottom: 12,
  },
  statutButtons: {
    flexDirection: "row",
    gap: 12,
  },
  statutButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Couleurs.border,
    backgroundColor: Couleurs.white,
    alignItems: "center",
  },
  statutButtonActive: {
    backgroundColor: Couleurs.primary,
    borderColor: Couleurs.primary,
  },
  statutButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: Couleurs.textPrimary,
  },
  statutButtonTextActive: {
    color: Couleurs.white,
  },
  submitButton: {
    marginTop: 20,
  },
})

export default InscriptionScreen
