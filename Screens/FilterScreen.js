import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import Slider from '@react-native-community/slider';

const FilterScreen = () => {
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState(['Tout']);
  const [selectedAdType, setSelectedAdType] = useState(['Tout']);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [selectedBathrooms, setSelectedBathrooms] = useState([]);
  const [priceRange, setPriceRange] = useState(50);

  const propertyTypes = [
    'Tout', 'Appartement', 'Studio', 'Maison', 
    'Villa', 'Parcelle', 'Terrain', 'Commercial', 'Flat Hôtel'
  ];

  const adTypes = ['Tout', 'Location', 'Vente', 'Journalier'];
  const roomNumbers = ['1+', '2+', '3+', '4+', '5+'];
  const bathroomNumbers = ['1', '2', '3', '4', '5'];

  const toggleSelection = (item, selectedItems, setSelectedItems) => {
    if (item === 'Tout') {
      setSelectedItems(['Tout']);
    } else {
      const newSelection = selectedItems.includes(item)
        ? selectedItems.filter(i => i !== item)
        : [...selectedItems.filter(i => i !== 'Tout'), item];
      
      setSelectedItems(newSelection.length === 0 ? ['Tout'] : newSelection);
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
    setPriceRange(50);
  };

  const handleApply = () => {
    // Logique pour appliquer les filtres
    console.log({
      propertyTypes: selectedPropertyTypes,
      adType: selectedAdType,
      rooms: selectedRooms,
      bathrooms: selectedBathrooms,
      priceRange
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
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

        {/* Echelle des Prix */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Echelle des Prix</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.priceText}>{priceRange} USD</Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={100}
              value={priceRange}
              onValueChange={setPriceRange}
              minimumTrackTintColor="#2E5BBA"
              maximumTrackTintColor="#E5E5E5"
              thumbStyle={styles.sliderThumb}
            />
            <View style={styles.priceLabels}>
              <Text style={styles.priceLabelText}>0</Text>
              <Text style={styles.priceLabelText}>100</Text>
            </View>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2E5BBA',
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 8,
  },
  selectedButton: {
    backgroundColor: '#2E5BBA',
    borderColor: '#2E5BBA',
  },
  unselectedButton: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E5E5',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  selectedText: {
    color: '#FFFFFF',
  },
  unselectedText: {
    color: '#666666',
  },
  priceContainer: {
    paddingHorizontal: 10,
  },
  priceText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E5BBA',
    marginBottom: 10,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderThumb: {
    backgroundColor: '#2E5BBA',
    width: 20,
    height: 20,
  },
  priceLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  priceLabelText: {
    fontSize: 12,
    color: '#666666',
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 15,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#D4AF37',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  applyButton: {
    flex: 1,
    backgroundColor: '#D4AF37',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FilterScreen;