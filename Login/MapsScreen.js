import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import { Couleurs } from "./Couleurs.js"

const { height, width } = Dimensions.get('window');

export default function AppartementCard() {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <style>
          #map { height: 100%; width: 100%; margin: 0; padding: 0; }
          html, body { height: 100%; margin: 0; padding: 0; }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <script>
          var map = L.map('map').setView([-4.325, 15.27], 15);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap',
          }).addTo(map);
          L.marker([-4.325, 15.27]).addTo(map)
            .bindPopup('Appartement à louer')
            .openPopup();
        </script>
      </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      {/* Carte interactive */}
      <View style={styles.mapContainer}>
        <WebView
          originWhitelist={['*']}
          source={{ html }}
          style={styles.webview}
          scrollEnabled={false}
        />
      </View>

      {/* Fiche de location fixée en bas */}
      <View style={styles.card}>
        <Image source={require('../assets/maison2.jpg')} style={styles.image} />
        <View style={styles.info}>
          <Text style={styles.title}>Appartement mis à louer</Text>
          <Text style={styles.subtitle}>Disponible maintenant</Text>
          <Text style={styles.location}>📍 Ngaliema, Kinshasa</Text>
          <Text style={styles.details}>🛏️ 3 chambres | 🛁 3 salles de bain</Text>
          <Text style={styles.price}>💰 2.6K $/par mois</Text>
        </View>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Couleurs.background,
    marginBottom: 25,
  },
  mapContainer: {
    flex: 1,
  },
  webview: {
    width: '100%',
    height: '100%',
  },
  card: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    flexDirection: 'row',
    padding: 12,
    borderRadius: 10,
    backgroundColor: Couleurs.cardBackground,
    elevation: 5,
    shadowColor: Couleurs.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: Couleurs.cardBackground,
  },
  info: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    color: Couleurs.textPrimary,
  },
  subtitle: {
    color: Couleurs.textSecondary,
  },
  location: {
    fontSize: 14,
    color: Couleurs.textPrimary,
  },
  details: {
    fontSize: 14,
    color: Couleurs.textMuted,
  },
  price: {
    fontSize: 16,
    color: Couleurs.primary,
    fontWeight: 'bold',
  },
});
