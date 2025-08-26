import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AntDesign, MaterialIcons, FontAwesome } from '@expo/vector-icons';

const ContactButtons = () => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button}>
        <AntDesign name="phone" size={15} color="white" />
        <Text style={styles.buttonText}>Appel</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}>
        <FontAwesome name="whatsapp" size={15} color="white" />
        <Text style={styles.buttonText}>WhatsApp</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}>
        <MaterialIcons name="email" size={15} color="white" />
        <Text style={styles.buttonText}>Email</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
   // padding: 10,
   paddingBottom:50

  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#224270', // Couleur de fond
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    color: 'white', // Couleur du texte
    marginLeft: 5,
   // fontWeight: 'bold',
  },
});

export default ContactButtons;