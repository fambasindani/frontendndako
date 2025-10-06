"use client"

import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import Droplist from "./Droplist.js"
import { Couleurs } from "./Couleurs.js"

// Liste des pays avec leurs codes et drapeaux
const COUNTRIES = [
  { value: "+243", label: "RD Congo",  "flag": "🇨🇩", code: "CD" },
  { value: "+33", label: "France", flag: "🇫🇷", code: "FR" },
  { value: "+1", label: "États-Unis", flag: "🇺🇸", code: "US" },
  { value: "+44", label: "Royaume-Uni", flag: "🇬🇧", code: "GB" },
  { value: "+49", label: "Allemagne", flag: "🇩🇪", code: "DE" },
  { value: "+39", label: "Italie", flag: "🇮🇹", code: "IT" },
  { value: "+34", label: "Espagne", flag: "🇪🇸", code: "ES" },
  { value: "+32", label: "Belgique", flag: "🇧🇪", code: "BE" },
  { value: "+41", label: "Suisse", flag: "🇨🇭", code: "CH" },
  { value: "+31", label: "Pays-Bas", flag: "🇳🇱", code: "NL" },
  { value: "+43", label: "Autriche", flag: "🇦🇹", code: "AT" },
  { value: "+351", label: "Portugal", flag: "🇵🇹", code: "PT" },
  { value: "+30", label: "Grèce", flag: "🇬🇷", code: "GR" },
  { value: "+46", label: "Suède", flag: "🇸🇪", code: "SE" },
  { value: "+47", label: "Norvège", flag: "🇳🇴", code: "NO" },
  { value: "+45", label: "Danemark", flag: "🇩🇰", code: "DK" },
  { value: "+358", label: "Finlande", flag: "🇫🇮", code: "FI" },
  { value: "+48", label: "Pologne", flag: "🇵🇱", code: "PL" },
  { value: "+420", label: "République tchèque", flag: "🇨🇿", code: "CZ" },
  { value: "+36", label: "Hongrie", flag: "🇭🇺", code: "HU" },
  { value: "+40", label: "Roumanie", flag: "🇷🇴", code: "RO" },
  { value: "+359", label: "Bulgarie", flag: "🇧🇬", code: "BG" },
  { value: "+385", label: "Croatie", flag: "🇭🇷", code: "HR" },
  { value: "+386", label: "Slovénie", flag: "🇸🇮", code: "SI" },
  { value: "+421", label: "Slovaquie", flag: "🇸🇰", code: "SK" },
  { value: "+370", label: "Lituanie", flag: "🇱🇹", code: "LT" },
  { value: "+371", label: "Lettonie", flag: "🇱🇻", code: "LV" },
  { value: "+372", label: "Estonie", flag: "🇪🇪", code: "EE" },
  { value: "+212", label: "Maroc", flag: "🇲🇦", code: "MA" },
  { value: "+213", label: "Algérie", flag: "🇩🇿", code: "DZ" },
  { value: "+216", label: "Tunisie", flag: "🇹🇳", code: "TN" },
  { value: "+20", label: "Égypte", flag: "🇪🇬", code: "EG" },
  { value: "+27", label: "Afrique du Sud", flag: "🇿🇦", code: "ZA" },
  { value: "+81", label: "Japon", flag: "🇯🇵", code: "JP" },
  { value: "+82", label: "Corée du Sud", flag: "🇰🇷", code: "KR" },
  { value: "+86", label: "Chine", flag: "🇨🇳", code: "CN" },
  { value: "+91", label: "Inde", flag: "🇮🇳", code: "IN" },
  { value: "+61", label: "Australie", flag: "🇦🇺", code: "AU" },
  { value: "+55", label: "Brésil", flag: "🇧🇷", code: "BR" },
  { value: "+52", label: "Mexique", flag: "🇲🇽", code: "MX" },
  { value: "+54", label: "Argentine", flag: "🇦🇷", code: "AR" },
  { value: "+56", label: "Chili", flag: "🇨🇱", code: "CL" },
  { value: "+57", label: "Colombie", flag: "🇨🇴", code: "CO" },
  { value: "+51", label: "Pérou", flag: "🇵🇪", code: "PE" },
  { value: "+58", label: "Venezuela", flag: "🇻🇪", code: "VE" },
]

const DroplistContact = ({
  label = "Code pays",
  value,
  onSelect,
  error,
  placeholder = "Sélectionner un pays",
  ...props
}) => {
  const renderCountryItem = ({ item }) => (
    <TouchableOpacity style={styles.countryItem} onPress={() => onSelect(item)} activeOpacity={0.7}>
      <View style={styles.countryContent}>
        <Text style={styles.flag}>{item.flag}</Text>
        <View style={styles.countryInfo}>
          <Text style={styles.countryName}>{item.label}</Text>
          <Text style={styles.countryCode}>{item.value}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )

  const getDisplayValue = () => {
    if (!value) return placeholder
    return `${value.flag} ${value.label} (${value.value})`
  }

  return (
    <View style={styles.container}>
      <Droplist
        label={label}
        value={value ? getDisplayValue() : null}
        onSelect={onSelect}
        placeholder={placeholder}
        options={COUNTRIES}
        error={error}
        renderItem={renderCountryItem}
        {...props}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  countryItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Couleurs.backgroundSecondary,
  },
  countryContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  flag: {
    fontSize: 24,
    marginRight: 12,
  },
  countryInfo: {
    flex: 1,
  },
  countryName: {
    fontSize: 16,
    fontWeight: "500",
    color: Couleurs.textPrimary,
    marginBottom: 2,
  },
  countryCode: {
    fontSize: 14,
    color: Couleurs.textSecondary,
  },
})

export default DroplistContact
