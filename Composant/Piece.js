import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';

const Piece = () => {
  const [chambres, setChambres] = useState(1);
  const [sallesDeBains, setSallesDeBains] = useState(1);
  const [prix, setPrix] = useState(50);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chambres</Text>
      <View style={styles.buttonContainer}>
        {[1, 2, 3, 4, 5].map((item) => (
          <TouchableOpacity 
            key={item} 
            style={[
              styles.button, 
              chambres === item ? styles.selectedButton : null
            ]}
            onPress={() => setChambres(item)}
          >
            <Text style={[
              styles.buttonText, 
              chambres === item ? styles.selectedButtonText : null // Changer la couleur du texte
            ]}>
              {item}+
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.title}>Salles de bains</Text>
      <View style={styles.buttonContainer}>
        {[1, 2, 3,4,5].map((item) => (
          <TouchableOpacity 
            key={item} 
            style={[
              styles.button, 
              sallesDeBains === item ? styles.selectedButton : null
            ]}
            onPress={() => setSallesDeBains(item)}
          >
            <Text style={[
              styles.buttonText, 
              sallesDeBains === item ? styles.selectedButtonText : null // Changer la couleur du texte
            ]}>
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.title}>Echelle des Prix</Text>
      <Text style={styles.priceText}>{prix} USD</Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={100}
        value={prix}
        onValueChange={setPrix}
        minimumTrackTintColor="#224270"
        maximumTrackTintColor="#d3d3d3"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  button: {
    backgroundColor: 'white',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#224270',
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginHorizontal: 5,
    flex: 1,
  },
  selectedButton: {
    backgroundColor: '#224270',
  },
  buttonText: {
    color: '#224270',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  selectedButtonText: {
    color: 'white', // Texte blanc pour le bouton sélectionné
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  slider: {
    width: '100%',
    height: 40,
  },
});

export default Piece;