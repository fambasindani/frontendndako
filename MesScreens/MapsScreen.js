import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import { Couleurs } from '../Composant/Couleurs'; 
import Loader from '../Composant/Loader';

const { height, width } = Dimensions.get('window');

export default function AppartementCard({ route }) {
  const { item } = route.params;
  const [mapLoading, setMapLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(true);

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
          var map = L.map('map').setView([${item.latitude}, ${item.longitude}], 15);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' }).addTo(map);
          L.marker([${item.latitude}, ${item.longitude}]).addTo(map)
            .bindPopup('Appartement à ${item.statu}')
            .openPopup();
        </script>
      </body>
    </html>
  `;

  const formatNumber = (prix) => {
    if (!prix) return "N/A";
    if (prix < 1000) return prix.toString();
    const suffix = prix < 1000000 ? "k" : "M";
    return `${(prix / (suffix === "k" ? 1000 : 1000000)).toFixed(0)}${suffix}`;
  };

  return (
    <View style={styles.container}>
      {/* Carte interactive */}
      <View style={styles.mapContainer}>
        {mapLoading && <LoaderOverlay />}
        <WebView
          originWhitelist={['*']}
          source={{ html }}
          style={styles.webview}
          scrollEnabled={false}
          onLoadEnd={() => setMapLoading(false)}
        />
      </View>

      {/* Fiche de location */}
      <View style={styles.card}>
        <View style={{ position: 'relative' }}>
          {imageLoading && <LoaderOverlay />}
          <Image
            source={item.image}
            style={styles.image}
            onLoadEnd={() => setImageLoading(false)}
          />
        </View>
        <View style={styles.info}>
          <Text style={styles.title}>Appartement mis à {parseInt(item.statu) === 1 ? 'vendre' : 'louer'}</Text>
          <Text style={styles.subtitle}>Disponible maintenant</Text>
          <Text style={styles.location}>📍 {item.ville}, {item.nom_commune}</Text>
          <Text style={styles.details}>🛏️ {item.nombre_chambre} chambres | 🛁 {item.nombre_salle_de_bain} salles de bain</Text>
          <Text style={styles.price}>💰 {formatNumber(item.prix)} $</Text>
        </View>
      </View>
    </View>
  );
}

// Loader centré en overlay
const LoaderOverlay = () => (
  <View style={styles.loaderOverlay}>
    <Loader />
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Couleurs.background, marginBottom: 20 },
  mapContainer: { flex: 2, position: 'relative' },
  webview: { width: '100%', height: '100%' },
  loaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  card: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 10,
    backgroundColor: Couleurs.cardBackground,
    elevation: 5,
    shadowColor: Couleurs.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    margin: 16,
  },
  image: { width: 100, height: 100, borderRadius: 8, backgroundColor: Couleurs.cardBackground },
  info: { flex: 1, marginLeft: 12, justifyContent: 'space-between' },
  title: { fontWeight: 'bold', fontSize: 16, color: Couleurs.textPrimary },
  subtitle: { color: Couleurs.textSecondary },
  location: { fontSize: 14, color: Couleurs.textPrimary },
  details: { fontSize: 14, color: Couleurs.textMuted },
  price: { fontSize: 16, color: Couleurs.primary, fontWeight: 'bold' },
});
