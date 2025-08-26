import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Image,
} from 'react-native';

const agencies = [
  {
    id: 1,
    name: "Agences Immo",
    description: "Sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus pronin sapien turpis cursus ligula."
  },
  {
    id: 2,
    name: "Global Group Service",
    description: "Sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus pronin sapien turpis cursus ligula."
  },
  {
    id: 3,
    name: "HNL Solution",
    description: "Sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus pronin sapien turpis cursus ligula."
  },
  {
    id: 4,
    name: "Chrissza",
    description: "Sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus pronin sapien turpis cursus ligula."
  }
];

const AgencyCard = ({ agency }) => (
  <View style={styles.card}>
    <View style={styles.imageContainer}>
      <View style={styles.placeholderImage}>
        <View style={styles.imageIcon}>
          <View style={styles.mountain1} />
          <View style={styles.mountain2} />
          <View style={styles.sun} />
        </View>
      </View>
    </View>
    <View style={styles.content}>
      <Text style={styles.agencyName}>{agency.name}</Text>
      <Text style={styles.description}>{agency.description}</Text>
    </View>
  </View>
);

const AgenceScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {agencies.map((agency) => (
          <AgencyCard key={agency.id} agency={agency} />
        ))}
      </ScrollView>
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
    paddingTop: 20,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  imageContainer: {
    marginRight: 16,
  },
  placeholderImage: {
    width: 80,
    height: 80,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageIcon: {
    width: 40,
    height: 30,
    position: 'relative',
  },
  mountain1: {
    position: 'absolute',
    bottom: 0,
    left: 5,
    width: 15,
    height: 15,
    backgroundColor: '#D1D5DB',
    transform: [{ rotate: '45deg' }],
  },
  mountain2: {
    position: 'absolute',
    bottom: 0,
    right: 5,
    width: 12,
    height: 12,
    backgroundColor: '#D1D5DB',
    transform: [{ rotate: '45deg' }],
  },
  sun: {
    position: 'absolute',
    top: 2,
    right: 8,
    width: 8,
    height: 8,
    backgroundColor: '#D1D5DB',
    borderRadius: 4,
  },
  content: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  agencyName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E40AF',
    marginBottom: 8,
    lineHeight: 24,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    textAlign: 'justify',
  },
});

export default AgenceScreen;