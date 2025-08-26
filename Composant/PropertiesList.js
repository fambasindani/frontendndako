import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PropertyList = () => {
  const properties = [
    {
      title: 'Maison',
      price: '45000$',
      description: 'Maison à vendre, 4 chambres salle de bain.',
      images: [
        require('../assets/maison.jpg'),
        require('../assets/maison2.jpg'),
      ],
      type: 'À vendre',
    },
    {
      title: 'Studio',
      price: '100$',
      description: 'Studio à louer, 2 chambres salle de bain.',
      images: [
        require('../assets/maison.jpg'),
        require('../assets/maison3.jpg'),
      ],
      type: 'À louer',
    },
    {
      title: 'Appartement',
      price: '30000$',
      description: 'Appartement à vendre, 3 chambres salle de bain.',
      images: [
        require('../assets/maison.jpg'),
      ],
      type: 'À vendre',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Propriétés ajoutées récemment</Text>
        <TouchableOpacity style={styles.seeMoreButton}>
          <Text style={styles.seeMoreText}>Voir +</Text>
        </TouchableOpacity>
      </View>
      <ScrollView>
        {properties.map((property, index) => (
          <PropertyCard key={index} property={property} />
        ))}
      </ScrollView>
    </View>
  );
};

const PropertyCard = ({ property }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % property.images.length);
    }, 2000); // Change d'image toutes les 2 secondes

    return () => clearInterval(interval);
  }, [property.images.length]);

  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image source={property.images[currentIndex]} style={styles.image} />
        <Text style={styles.type}>{property.type}</Text>
      </View>
      <Text style={styles.title}>{property.title}</Text>
      <Text style={styles.price}>{property.price}</Text>
      <Text style={styles.description}>{property.description}</Text>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Voir détails</Text>
        <Ionicons name="chevron-forward" size={16} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  seeMoreButton: {
    padding: 5,
  },
  seeMoreText: {
    color: '#224270',
    fontWeight:'bold',
     fontSize: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 3,
    marginBottom: 15,
    padding: 10,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%', // Largeur de l'image
    height: 200,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  type: {
    position: 'absolute',
    top: 10,
    left: 10,
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: '#E9C162', // Fond semi-transparent
    padding: 5,
    borderRadius: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  price: {
    fontSize: 16,
    color: 'green',
  },
  description: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#224270',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    marginRight: 5,
  },
});

export default PropertyList;