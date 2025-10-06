import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { getApi , getImageUrl } from '../Api/getApi';
import { useNavigation } from '@react-navigation/native';
//import { useNavigation } from '@react-navigation/native';

const PropertyList = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) return Alert.alert("Erreur", "Token introuvable");

  

        const api=getApi();
     
        const res = await api.get("/api/proprieteall");
        const data = res.data.map(item => ({
          id: item.id,
          title: item.typepropriete?.nom_propriete ?? "Nom inconnu",
          price: formatPrice(item.prix),  // Utiliser la fonction de formatage ici
          description: item.description,
          image: { uri: getImageUrl(item.image_principale) },
          type: item.statut ? "À vendre" : "À louer",
          nombre_chambre: item.nombre_chambre,
          nombre_salle_de_bain: item.nombre_salle_de_bain,
        }));

        setProperties(data);
      } catch (err) {
        console.error(err);
        Alert.alert("Erreur", "Impossible de récupérer les propriétés");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Fonction pour formater le prix
  const formatPrice = (price) => {
    if (price >= 1000) {
      return `${(price / 1000).toFixed(0)}k`; // Formate en k sans décimale
    }
    return `${price}$`; // Retourne le prix en dollars
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#224270" />
        <Text>Chargement des propriétés...</Text>
      </View>
    );
  }




  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Propriétés ajoutées récemment</Text>
        <TouchableOpacity style={styles.seeMoreButton}>
          {/* <Text style={styles.seeMoreText}>Voir +</Text> */}
        </TouchableOpacity>
      </View>
      <ScrollView>
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </ScrollView>
    </View>
  );
};

// const navigation = useNavigation(); 

const PropertyCard = ({ property}) => {

   const navigation = useNavigation();

  const ActionDetails=(id)=>{
    navigation.navigate('Details',  {id});

    //Alert.alert("Message", "felicitation")
  }

  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image source={property.image} style={styles.image} />
        <Text style={styles.type}>{property.type}</Text>
      </View>
      <Text style={styles.title}>{property.title}</Text>
      <View style={styles.detailsContainer}>
        <View style={styles.detailItem}>
          <Ionicons name="bed-outline" size={16} color="gray" />
          <Text style={styles.detailText}>{property.nombre_chambre} Chambres</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="water-outline" size={16} color="gray" />
          <Text style={styles.detailText}>{property.nombre_salle_de_bain} Salles de bain</Text>
        </View>
      </View>
      <Text style={styles.price}>${property.price}</Text>
      <Text style={styles.description}>{property.description}</Text>
      <TouchableOpacity style={styles.button}   onPress={() => ActionDetails(property.id)}>
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
    marginBottom: 10,
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
    fontWeight: 'bold',
    fontSize: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 3,
    marginBottom: 20,
    padding: 10,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
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
    backgroundColor: '#E9C162',
    padding: 5,
    borderRadius: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  detailsContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  detailText: {
    marginLeft: 5,
    color: 'gray',
  },
  price: {
    fontSize: 16,
    color: 'green',
    marginBottom: 7,
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
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PropertyList;