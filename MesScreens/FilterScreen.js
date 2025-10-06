import React, { useState } from 'react';
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
} from 'react-native';

const MAX_PRICE = 100_000_000; // 100 millions

const FilterScreen = () => {
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState(['Tout']);
  const [selectedAdType, setSelectedAdType] = useState(['Tout']);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [selectedBathrooms, setSelectedBathrooms] = useState([]);

  // Controlled strings pour les inputs
  const [rawPriceMinStr, setRawPriceMinStr] = useState('0');
  const [rawPriceMaxStr, setRawPriceMaxStr] = useState(String(MAX_PRICE));

  const propertyTypes = [
    'Tout', 'Appartement', 'Studio', 'Maison',
    'Villa', 'Parcelle', 'Terrain', 'Commercial', 'Flat Hôtel'
  ];
  const adTypes = [ 'Location', 'Vente'];
  const roomNumbers = ['1+', '2+', '3+', '4+', '5+'];
  const bathroomNumbers = ['1', '2', '3', '4', '5'];

  const sanitizeNumberStr = (s = '') => {
    return s.toString().replace(/\D/g, '');
  };

  const formatNumber = (s = '') => {
    const num = Number(s === '' ? 0 : s);
    return num.toLocaleString();
  };

  const toggleSelection = (item, selectedItems, setSelectedItems) => {
    if (item === 'Location') {
      setSelectedItems(['Location']);
    } else {
      const newSelection = selectedItems.includes(item)
        ? selectedItems.filter(i => i !== item)
        : [...selectedItems.filter(i => i !== 'Location'), item];

      setSelectedItems(newSelection.length === 0 ? ['Location'] : newSelection);
    }
  };

  const FilterButton = ({ title, isSelected, onPress }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        isSelected ? styles.selectedButton : styles.unselectedButton
      ]}
      onPress={onPress}
    >
      <Text style={[
        styles.buttonText,
        isSelected ? styles.selectedText : styles.unselectedText
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const handleCancel = () => {
    setSelectedPropertyTypes(['Tout']);
    setSelectedAdType(['Tout']);
    setSelectedRooms([]);
    setSelectedBathrooms([]);
    setRawPriceMinStr('0');
    setRawPriceMaxStr(String(MAX_PRICE));
  };

  const handleApply = () => {
    const min = parseInt(sanitizeNumberStr(rawPriceMinStr) || '0', 10);
    const max = parseInt(sanitizeNumberStr(rawPriceMaxStr) || String(MAX_PRICE), 10);

    if (isNaN(min) || isNaN(max)) {
      Alert.alert('Erreur', 'Veuillez entrer des valeurs numériques valides.');
      return;
    }
    if (min < 0 || max < 0) {
      Alert.alert('Erreur', 'Les valeurs doivent être positives.');
      return;
    }
    if (min > max) {
      Alert.alert('Erreur', 'Le prix minimum ne peut pas être supérieur au prix maximum.');
      return;
    }

    const finalMax = Math.min(max, MAX_PRICE);

    console.log('Filtres appliqués:', {
      propertyTypes: selectedPropertyTypes,
      adType: selectedAdType,
      rooms: selectedRooms,
      bathrooms: selectedBathrooms,
      priceMin: min,
      priceMax: finalMax,
    });

    Alert.alert('Succès', `Filtre appliqué: ${min.toLocaleString()} - ${finalMax.toLocaleString()} USD`);
  };

  const onMinChange = (text) => {
    const digits = sanitizeNumberStr(text);
    setRawPriceMinStr(digits);
  };
  
  const onMaxChange = (text) => {
    const digits = sanitizeNumberStr(text);
    setRawPriceMaxStr(digits);
  };

  const onMinFocus = () => {
    setRawPriceMinStr(sanitizeNumberStr(rawPriceMinStr));
  };
  
  const onMaxFocus = () => {
    setRawPriceMaxStr(sanitizeNumberStr(rawPriceMaxStr));
  };

  const onMinBlur = () => {
    const val = sanitizeNumberStr(rawPriceMinStr) || '0';
    setRawPriceMinStr(formatNumber(val));
  };
  
  const onMaxBlur = () => {
    let val = sanitizeNumberStr(rawPriceMaxStr) || String(MAX_PRICE);
    const n = Math.min(Number(val), MAX_PRICE);
    setRawPriceMaxStr(formatNumber(String(n)));
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
          {/* Types d'immobilier */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Types d'immobilier</Text>
            <View style={styles.buttonContainer}>
              {propertyTypes.map((type) => (
                <FilterButton
                  key={type}
                  title={type}
                  isSelected={selectedPropertyTypes.includes(type)}
                  onPress={() => toggleSelection(type, selectedPropertyTypes, setSelectedPropertyTypes)}
                />
              ))}
            </View>
          </View>

          {/* Genre d'annonce */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Genre d'annonce</Text>
            <View style={styles.buttonContainer}>
              {adTypes.map((type) => (
                <FilterButton
                  key={type}
                  title={type}
                  isSelected={selectedAdType.includes(type)}
                  onPress={() => toggleSelection(type, selectedAdType, setSelectedAdType)}
                />
              ))}
            </View>
          </View>

          {/* Chambres */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Chambres</Text>
            <View style={styles.buttonContainer}>
              {roomNumbers.map((room) => (
                <FilterButton
                  key={room}
                  title={room}
                  isSelected={selectedRooms.includes(room)}
                  onPress={() => toggleSelection(room, selectedRooms, setSelectedRooms)}
                />
              ))}
            </View>
          </View>

          {/* Salles de bains */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Salles de bains</Text>
            <View style={styles.buttonContainer}>
              {bathroomNumbers.map((bathroom) => (
                <FilterButton
                  key={bathroom}
                  title={bathroom}
                  isSelected={selectedBathrooms.includes(bathroom)}
                  onPress={() => toggleSelection(bathroom, selectedBathrooms, setSelectedBathrooms)}
                />
              ))}
            </View>
          </View>

          {/* --- Inputs Min / Max Prix --- */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Échelle des prix</Text>

            <View style={styles.priceInputsRow}>
              <View style={styles.priceInputWrapper}>
                <Text style={styles.inputLabel}>Prix min</Text>
                <TextInput
                  value={rawPriceMinStr}
                  onChangeText={onMinChange}
                  onFocus={onMinFocus}
                  onBlur={onMinBlur}
                  keyboardType="numeric"
                  returnKeyType="done"
                  placeholder="0"
                  style={styles.priceInput}
                  maxLength={12}
                />
              </View>

              <View style={styles.priceInputWrapper}>
                <Text style={styles.inputLabel}>Prix max</Text>
                <TextInput
                  value={rawPriceMaxStr}
                  onChangeText={onMaxChange}
                  onFocus={onMaxFocus}
                  onBlur={onMaxBlur}
                  keyboardType="numeric"
                  returnKeyType="done"
                  placeholder={String(MAX_PRICE)}
                  style={styles.priceInput}
                  maxLength={12}
                />
              </View>
            </View>

            <View style={styles.priceHintRow}>
              <Text style={styles.hintText}>0</Text>
              <Text style={styles.hintText}>{MAX_PRICE.toLocaleString()}</Text>
            </View>
          </View>
        </ScrollView>

        {/* Boutons d'action */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>Annuler</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
            <Text style={styles.applyButtonText}>Appliquer</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' , marginBottom:30},
  scrollView: { flex: 1, paddingHorizontal: 20 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#2E5BBA', marginBottom: 12 },
  buttonContainer: { flexDirection: 'row', flexWrap: 'wrap' },
  filterButton: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, marginBottom: 8, marginRight: 8 },
  selectedButton: { backgroundColor: '#2E5BBA', borderColor: '#2E5BBA' },
  unselectedButton: { backgroundColor: '#FFFFFF', borderColor: '#E5E5E5' },
  buttonText: { fontSize: 14, fontWeight: '500' },
  selectedText: { color: '#FFFFFF' },
  unselectedText: { color: '#666666' },

  priceInputsRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  priceInputWrapper: { flex: 1 },
  inputLabel: { fontSize: 13, color: '#666666', marginBottom: 6 },
  priceInput: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  priceHintRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  hintText: { fontSize: 12, color: '#999999' },

  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#D4AF37',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginRight: 8,
  },
  cancelButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  applyButton: {
    flex: 1,
    backgroundColor: '#2E5BBA',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginLeft: 8,
  },
  applyButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});

export default FilterScreen;