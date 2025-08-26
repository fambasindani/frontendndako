import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const { width } = Dimensions.get("window");

const properties = [
  {
    id: 1,
    title: "Maison",
    price: "45000$",
    status: "A vendre",
    image: require("../assets/maison2.jpg"),
    location: "2eme rue Limete, Kinshasa",
    rooms: 2,
    baths: 3,
    description: "Maison à vendre , 4 chambres salle de bain,...",
  },
  {
    id: 2,
    title: "Studio",
    price: "100$",
    status: "A louer",
    image: require("../assets/maison.jpg"),
    location: "2eme rue Limete, Kinshasa",
    rooms: 2,
    baths: 3,
    description: "Studio à louer , moderne et bien situé,...",
  },
  {
    id: 3,
    title: "Villa",
    price: "30000$",
    status: "A vendre",
    image: require("../assets/maison3.jpg"),
    location: "1er rue Gombe, Kinshasa",
    rooms: 4,
    baths: 2,
    description: "Villa luxueuse avec piscine et jardin,...",
  },
];

export default function Accueil1() {
  return (
    <View style={styles.container}>
      {/* Titre */}
      <View style={styles.header}>
        <Text style={styles.title}>Propriétés ajouter récemment</Text>
        <TouchableOpacity>
          <Text style={styles.seeMore}>Voir +</Text>
        </TouchableOpacity>
      </View>

      {/* Liste horizontale */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 10 }}
      >
        {properties.map((item) => (
          <View key={item.id} style={styles.card}>
            {/* Image */}
            <Image source={item.image} style={styles.image} />

            {/* Statut */}
            <View style={styles.status}>
              <Text style={styles.statusText}>{item.status}</Text>
            </View>

            {/* Infos */}
            <View style={styles.cardBody}>
              <View style={styles.rowBetween}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.price}>{item.price}</Text>
              </View>

              <View style={styles.row}>
                <Icon name="map-marker" size={14} color="#0d6efd" />
                <Text style={styles.location}>{item.location}</Text>
              </View>

              <View style={styles.row}>
                <Icon name="bed" size={14} color="#444" />
                <Text style={styles.detailText}> {item.rooms} </Text>
                <Icon name="bath" size={14} color="#444" />
                <Text style={styles.detailText}> {item.baths} </Text>
              </View>

              <Text numberOfLines={1} style={styles.description}>
                {item.description}
              </Text>

              {/* Bouton */}
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Voir détails</Text>
                <Icon name="arrow-circle-right" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0d2c6b",
  },
  seeMore: {
    fontSize: 14,
    color: "#0d6efd",
    fontWeight: "600",
  },
  card: {
    width: width * 0.65,
    marginRight: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 150,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  status: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#FFD580",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  cardBody: {
    padding: 10,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
  },
  price: {
    fontSize: 15,
    color: "red",
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 2,
  },
  location: {
    fontSize: 12,
    marginLeft: 4,
    color: "#444",
  },
  detailText: {
    fontSize: 12,
    marginHorizontal: 4,
    color: "#444",
  },
  description: {
    fontSize: 12,
    color: "#666",
    marginVertical: 4,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0d2c6b",
    paddingVertical: 6,
    borderRadius: 20,
    justifyContent: "center",
    marginTop: 6,
    gap: 6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
    marginRight: 6,
  },
});
