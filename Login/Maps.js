import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity } from "react-native"
import { Couleurs } from "../Composant/Couleurs"

const { width, height } = Dimensions.get("window")

const Maps = ({
  properties = [],
  region = {
    latitude: -4.4419,
    longitude: 15.2663,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  },
  onMarkerPress = () => {},
  selectedProperty = null,
  showPropertyCard = true,
}) => {
  const defaultProperties =
    properties.length > 0
      ? properties
      : [
          {
            id: 1,
            title: "Appartement mis à louer",
            status: "Disponible Maintenant",
            location: "Ngaliema, Kinshasa",
            bedrooms: 3,
            bathrooms: 1,
            price: "2.6K $/par mois",
            latitude: -4.4419,
            longitude: 15.2663,
            image: require("../assets/maison2.jpg"),
          },
        ]

  const currentProperty = selectedProperty || defaultProperties[0]

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <Image
          source={{ uri: "https://via.placeholder.com/400x600/E5E5E5/999999?text=KINSHASA+MAP" }}
          style={styles.mapBackground}
        />

        <View style={styles.markersContainer}>
          {defaultProperties.map((property, index) => (
            <TouchableOpacity
              key={property.id}
              style={[
                styles.customMarker,
                {
                  top: height * 0.4 + index * 20,
                  left: width * 0.5 + index * 30 - 10,
                },
              ]}
              onPress={() => onMarkerPress(property)}
            >
              <View style={styles.markerPin} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.mapOverlay}>
          <Text style={styles.streetName}>Rue de Matadi</Text>
          <Text style={[styles.streetName, { top: 100, left: 50 }]}>Ave Ngaliema</Text>
          <Text style={[styles.streetName, { top: 200, right: 30 }]}>Blvd Mbanza</Text>
        </View>
      </View>

      {showPropertyCard && (
        <View style={styles.propertyCard}>
          <Image source={currentProperty.image} style={styles.propertyImage} />
          <View style={styles.propertyInfo}>
            <Text style={styles.propertyTitle}>{currentProperty.title}</Text>
            <Text style={styles.propertyStatus}>{currentProperty.status}</Text>
            <View style={styles.locationContainer}>
              <Text style={styles.locationIcon}>📍</Text>
              <Text style={styles.locationText}>{currentProperty.location}</Text>
            </View>
            <View style={styles.detailsRow}>
              <View style={styles.roomDetails}>
                <Text style={styles.roomIcon}>🛏️</Text>
                <Text style={styles.roomText}>{currentProperty.bedrooms}</Text>
                <Text style={styles.roomIcon}>🚿</Text>
                <Text style={styles.roomText}>{currentProperty.bathrooms}</Text>
              </View>
              <Text style={styles.priceText}>{currentProperty.price}</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    flex: 1,
    position: "relative",
  },
  mapBackground: {
    width: width,
    height: height,
    backgroundColor: Couleurs.cardBackground,
  },
  markersContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  mapOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  streetName: {
    position: "absolute",
    top: 50,
    left: 20,
    fontSize: 10,
    color: Couleurs.textSecondary,
    backgroundColor: Couleurs.white,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 2,
  },
  propertyCard: {
    position: "absolute",
    bottom: 30,
    left: 16,
    right: 16,
    backgroundColor: Couleurs.white,
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    shadowColor: Couleurs.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  propertyImage: {
    width: 70,
    height: 70,
    borderRadius: 6,
    backgroundColor: Couleurs.cardBackground,
  },
  propertyInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "space-between",
  },
  propertyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Couleurs.textPrimary,
    marginBottom: 2,
  },
  propertyStatus: {
    fontSize: 12,
    color: Couleurs.textSecondary,
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  locationIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  locationText: {
    fontSize: 12,
    color: Couleurs.textSecondary,
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  roomDetails: {
    flexDirection: "row",
    alignItems: "center",
  },
  roomIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  roomText: {
    fontSize: 12,
    color: Couleurs.textSecondary,
    marginRight: 8,
  },
  priceText: {
    fontSize: 14,
    fontWeight: "bold",
    color: Couleurs.primary,
  },
  customMarker: {
    position: "absolute",
    alignItems: "center",
  },
  markerPin: {
    width: 20,
    height: 20,
    backgroundColor: Couleurs.mapMarker,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: Couleurs.white,
    shadowColor: Couleurs.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
})

export default Maps
