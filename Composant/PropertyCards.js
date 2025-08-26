// PropertyCard.tsx
import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, ImageSourcePropType } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

interface PropertyCardProps {
  type: "A vendre" | "A louer";
  title: string;
  price: string;
  location: string;
  beds: number;
  baths: number;
  image: ImageSourcePropType; // <- accepte require() ou {uri:""}
  onPress: () => void;
}

export default function PropertyCards({
  type,
  title,
  price,
  location,
  beds,
  baths,
  image="../assets/maison.jpg",
  onPress,
}: PropertyCardProps) {
  return (
    <View style={styles.card}>
      {/* Image */}
      <Image source={image} style={styles.image} />

      {/* Badge */}
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{type}</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.rowBetween}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.price}>{price}</Text>
        </View>

        <View style={styles.locationRow}>
          <Icon name="map-marker" size={16} color="#f39c12" />
          <Text style={styles.location}>{location}</Text>
        </View>

        <View style={styles.iconsRow}>
          <Icon name="bed" size={16} color="#2c3e50" />
          <Text style={styles.text}>{beds}</Text>
          <Icon name="bath" size={16} color="#2c3e50" style={{ marginLeft: 10 }} />
          <Text style={styles.text}>{baths}</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={onPress}>
          <Text style={styles.buttonText}>Voir détails</Text>
          <Icon name="arrow-circle-right" size={18} color="#fff" style={{ marginLeft: 5 }} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 250,
    borderRadius: 10,
    backgroundColor: "#fff",
    margin: 10,
    overflow: "hidden",
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 150,
  },
  badge: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "#f1c40f",
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  badgeText: {
    color: "#2c3e50",
    fontWeight: "bold",
    fontSize: 12,
  },
  content: {
    padding: 10,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#2c3e50",
  },
  price: {
    color: "red",
    fontWeight: "bold",
    fontSize: 16,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  location: {
    marginLeft: 5,
    color: "#34495e",
    fontSize: 12,
  },
  iconsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  text: {
    marginLeft: 5,
    color: "#2c3e50",
  },
  button: {
    flexDirection: "row",
    backgroundColor: "#2c3e50",
    paddingVertical: 8,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
