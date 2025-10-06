"use client"

import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, FlatList } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { Couleurs } from "../Composant/Couleurs.js"

const countries = [
  { name: "France", code: "+33", flag: "🇫🇷", iso: "FR" },
  { name: "Côte d'Ivoire", code: "+225", flag: "🇨🇮", iso: "CI" },
  { name: "Sénégal", code: "+221", flag: "🇸🇳", iso: "SN" },
  { name: "Mali", code: "+223", flag: "🇲🇱", iso: "ML" },
  { name: "Burkina Faso", code: "+226", flag: "🇧🇫", iso: "BF" },
  { name: "Niger", code: "+227", flag: "🇳🇪", iso: "NE" },
  { name: "Guinée", code: "+224", flag: "🇬🇳", iso: "GN" },
  { name: "Bénin", code: "+229", flag: "🇧🇯", iso: "BJ" },
  { name: "Togo", code: "+228", flag: "🇹🇬", iso: "TG" },
  { name: "Ghana", code: "+233", flag: "🇬🇭", iso: "GH" },
  { name: "Nigeria", code: "+234", flag: "🇳🇬", iso: "NG" },
  { name: "Cameroun", code: "+237", flag: "🇨🇲", iso: "CM" },
  { name: "Gabon", code: "+241", flag: "🇬🇦", iso: "GA" },
  { name: "Congo", code: "+242", flag: "🇨🇬", iso: "CG" },
  { name: "RD Congo", code: "+243", flag: "🇨🇩", iso: "CD" },
  { name: "Maroc", code: "+212", flag: "🇲🇦", iso: "MA" },
  { name: "Algérie", code: "+213", flag: "🇩🇿", iso: "DZ" },
  { name: "Tunisie", code: "+216", flag: "🇹🇳", iso: "TN" },
  { name: "Égypte", code: "+20", flag: "🇪🇬", iso: "EG" },
]

const PhoneInput = ({
  label,
  value = "",
  onChangeText,
  selectedCountry,
  onCountrySelect,
  error,
  placeholder = "Numéro de téléphone",
}) => {
  const [modalVisible, setModalVisible] = useState(false)
  const [focused, setFocused] = useState(false)

  const defaultCountry = countries.find((c) => c.iso === "CI") || countries[0]
  const currentCountry = selectedCountry || defaultCountry

  const handleCountrySelect = (country) => {
    onCountrySelect(country)
    setModalVisible(false)
  }

  const renderCountryItem = ({ item }) => (
    <TouchableOpacity style={styles.countryItem} onPress={() => handleCountrySelect(item)} activeOpacity={0.7}>
      <Text style={styles.countryFlag}>{item.flag}</Text>
      <Text style={styles.countryName}>{item.name}</Text>
      <Text style={styles.countryCode}>{item.code}</Text>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View
        style={[styles.inputContainer, focused && styles.inputContainerFocused, error && styles.inputContainerError]}
      >
        {/* Country Selector */}
        <TouchableOpacity style={styles.countrySelector} onPress={() => setModalVisible(true)} activeOpacity={0.7}>
          <Text style={styles.flagText}>{currentCountry.flag}</Text>
          <Text style={styles.codeText}>{currentCountry.code}</Text>
          <Ionicons name="chevron-down" size={16} color={Couleurs.textSecondary} />
        </TouchableOpacity>

        {/* Separator */}
        <View style={styles.separator} />

        {/* Phone Input */}
        <TextInput
          style={styles.phoneInput}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Couleurs.textSecondary}
          keyboardType="phone-pad"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}

      {/* Full Phone Preview */}
      {value && (
        <View style={styles.previewContainer}>
          <Text style={styles.previewText}>
            Numéro complet:{" "}
            <Text style={styles.previewNumber}>
              {currentCountry.code}
              {value}
            </Text>
          </Text>
        </View>
      )}

      {/* Country Selection Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Sélectionner un pays</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                <Ionicons name="close" size={24} color={Couleurs.textPrimary} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={countries}
              renderItem={renderCountryItem}
              keyExtractor={(item) => item.iso}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: Couleurs.textPrimary,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Couleurs.white,
    borderWidth: 1,
    borderColor: Couleurs.border,
    borderRadius: 8,
    overflow: "hidden",
  },
  inputContainerFocused: {
    borderColor: Couleurs.primary,
    shadowColor: Couleurs.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputContainerError: {
    borderColor: Couleurs.error,
  },
  countrySelector: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 16,
    backgroundColor: Couleurs.lightGray,
  },
  flagText: {
    fontSize: 18,
    marginRight: 8,
  },
  codeText: {
    fontSize: 16,
    fontWeight: "500",
    color: Couleurs.textPrimary,
    marginRight: 4,
  },
  separator: {
    width: 1,
    height: 24,
    backgroundColor: Couleurs.border,
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 16,
    fontSize: 16,
    color: Couleurs.textPrimary,
  },
  errorText: {
    fontSize: 12,
    color: Couleurs.error,
    marginTop: 4,
  },
  previewContainer: {
    marginTop: 8,
    padding: 8,
    backgroundColor: Couleurs.lightGray,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: Couleurs.primary,
  },
  previewText: {
    fontSize: 12,
    color: Couleurs.textSecondary,
  },
  previewNumber: {
    fontWeight: "600",
    color: Couleurs.primary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: Couleurs.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Couleurs.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Couleurs.textPrimary,
  },
  closeButton: {
    padding: 4,
  },
  countryItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Couleurs.lightGray,
  },
  countryFlag: {
    fontSize: 20,
    marginRight: 12,
  },
  countryName: {
    flex: 1,
    fontSize: 16,
    color: Couleurs.textPrimary,
  },
  countryCode: {
    fontSize: 14,
    color: Couleurs.textSecondary,
    fontWeight: "500",
  },
})

export default PhoneInput
