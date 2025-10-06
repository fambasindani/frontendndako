"use client"

import { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { Couleurs } from "../Composant/Couleurs.js"

const Droplist = ({
  label,
  value,
  onSelect,
  placeholder = "Sélectionner...",
  options = [],
  error,
  disabled = false,
  renderItem,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  const getBorderColor = () => {
    if (error) return Couleurs.borderError
    if (isFocused || isOpen) return Couleurs.borderFocus
    return Couleurs.border
  }

  const handleSelect = (item) => {
    onSelect(item)
    setIsOpen(false)
  }

  const getDisplayValue = () => {
    if (!value) return placeholder
    return typeof value === "object" ? value.label : value
  }

  const defaultRenderItem = ({ item }) => (
    <TouchableOpacity style={styles.optionItem} onPress={() => handleSelect(item)} activeOpacity={0.7}>
      <Text style={styles.optionText}>{typeof item === "object" ? item.label : item}</Text>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      {label && <Text style={[styles.label, error && styles.labelError]}>{label}</Text>}

      <TouchableOpacity
        style={[
          styles.droplistContainer,
          { borderColor: getBorderColor() },
          error && styles.droplistContainerError,
          disabled && styles.droplistDisabled,
        ]}
        onPress={() => !disabled && setIsOpen(true)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        activeOpacity={0.8}
        disabled={disabled}
        {...props}
      >
        <Text style={[styles.droplistText, !value && styles.placeholderText, disabled && styles.disabledText]}>
          {getDisplayValue()}
        </Text>

        <Ionicons
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={20}
          color={error ? Couleurs.error : disabled ? Couleurs.disabled : Couleurs.textSecondary}
        />
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <Modal visible={isOpen} transparent={true} animationType="fade" onRequestClose={() => setIsOpen(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setIsOpen(false)}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label || "Sélectionner une option"}</Text>
              <TouchableOpacity onPress={() => setIsOpen(false)}>
                <Ionicons name="close" size={24} color={Couleurs.textPrimary} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={options}
              keyExtractor={(item, index) =>
                typeof item === "object" ? item.value?.toString() || index.toString() : item.toString()
              }
              renderItem={renderItem || defaultRenderItem}
              style={styles.optionsList}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </TouchableOpacity>
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
  labelError: {
    color: Couleurs.error,
  },
  droplistContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Couleurs.inputBackground,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
  },
  droplistContainerError: {
    borderColor: Couleurs.borderError,
  },
  droplistDisabled: {
    backgroundColor: Couleurs.backgroundSecondary,
    opacity: 0.6,
  },
  droplistText: {
    flex: 1,
    fontSize: 16,
    color: Couleurs.textPrimary,
  },
  placeholderText: {
    color: Couleurs.inputPlaceholder,
  },
  disabledText: {
    color: Couleurs.textSecondary,
  },
  errorText: {
    fontSize: 12,
    color: Couleurs.error,
    marginTop: 4,
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: Couleurs.white,
    borderRadius: 12,
    width: "90%",
    maxHeight: "70%",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Couleurs.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Couleurs.textPrimary,
  },
  optionsList: {
    maxHeight: 300,
  },
  optionItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Couleurs.backgroundSecondary,
  },
  optionText: {
    fontSize: 16,
    color: Couleurs.textPrimary,
  },
})

export default Droplist
