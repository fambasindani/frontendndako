import React from 'react';
import { View, TextInput, Button, StyleSheet, TouchableOpacity, Text } from 'react-native';

const SearchComponent = () => {
  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher..."
          placeholderTextColor="#999"
        />
        <TouchableOpacity style={styles.searchButton}>
          <Text style={styles.searchButtonText}>🔍</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.buttonActive}>
          <Text style={styles.buttonText}>Accueil</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Vente</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Location</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Filtres</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {

    flex: 1,
    marginVertical:30,
   // justifyContent:'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
  },
  searchButton: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonActive: {
    backgroundColor: '#0066cc',
    padding: 10,
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
    marginRight: 5,
  },
  button: {
    backgroundColor: '#f0ad4e',
    padding: 10,
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
    marginLeft: 5,
  },
  buttonText: {
    color: '#fff',
  },
});

export default SearchComponent;