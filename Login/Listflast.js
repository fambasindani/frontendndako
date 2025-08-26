"use client"

import { useState, useMemo } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import _ from "lodash"
import { Couleurs } from "./Couleurs.js"
import Button from "./Button.js"

const Listflast = ({ properties = [], onPropertyPress, onEditPress, onDeletePress, itemsPerPage = 10 }) => {
  const [displayedCount, setDisplayedCount] = useState(itemsPerPage)
  const [isLoading, setIsLoading] = useState(false)

  const displayedProperties = useMemo(() => {
    return _.take(properties, displayedCount)
  }, [properties, displayedCount])

  const hasMoreData = displayedCount < properties.length

  const loadMoreData = () => {
    if (isLoading || !hasMoreData) return

    setIsLoading(true)

    // Simulate loading delay
    setTimeout(() => {
      setDisplayedCount((prev) => Math.min(prev + itemsPerPage, properties.length))
      setIsLoading(false)
    }, 1000)
  }

  const getStatusColor = (status) => {
    if (status === "En vente" || status === "Vente") return Couleurs.secondary
    if (status === "Location") return Couleurs.primary
    return Couleurs.textSecondary
  }

  const renderProperty = ({ item }) => (
    <TouchableOpacity style={styles.propertyCard} onPress={() => onPropertyPress?.(item)} activeOpacity={0.7}>
      <View style={styles.propertyContent}>
        <Image source={item.image} style={styles.propertyImage} />

        <View style={styles.propertyInfo}>
          <View style={styles.propertyHeader}>
            <Text style={styles.propertyTitle}>{item.title}</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
              <Text style={styles.statusText}>{item.status}</Text>
            </View>
          </View>

          <View style={styles.propertyDetails}>
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={14} color={Couleurs.textSecondary} />
              <Text style={styles.locationText}>{item.location}</Text>
            </View>

            <Text style={styles.priceText}>{item.price}</Text>

            <View style={styles.timeRow}>
              <Ionicons name="time-outline" size={14} color={Couleurs.textMuted} />
              <Text style={styles.timeText}>{item.timeAgo}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.actionButtons}>
        <Button
          title="Détails"
          variant="outline"
          size="small"
          onPress={() => onPropertyPress?.(item)}
          style={styles.detailButton}
        />

        <TouchableOpacity style={styles.iconButton} onPress={() => onEditPress?.(item)}>
          <Ionicons name="create-outline" size={20} color={Couleurs.primary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton} onPress={() => onDeletePress?.(item)}>
          <Ionicons name="trash-outline" size={20} color={Couleurs.error} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  )

  const renderFooter = () => {
    if (!hasMoreData) return null

    return (
      <View style={styles.loadingContainer}>
        {isLoading ? (
          <ActivityIndicator size="large" color={Couleurs.primary} />
        ) : (
          <TouchableOpacity style={styles.loadMoreButton} onPress={loadMoreData}>
            <Text style={styles.loadMoreText}>Charger plus</Text>
            <Ionicons name="chevron-down" size={20} color={Couleurs.primary} />
          </TouchableOpacity>
        )}
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={displayedProperties}
        renderItem={renderProperty}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Aucune propriété trouvée</Text>
          </View>
        }
        ListFooterComponent={renderFooter}
        onEndReached={loadMoreData}
        onEndReachedThreshold={0.1}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  propertyCard: {
    backgroundColor: Couleurs.white,
    borderRadius: 8,
    marginBottom: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  propertyContent: {
    flexDirection: "row",
    marginBottom: 12,
  },
  propertyImage: {
    width: 80,
    height: 80,
    borderRadius: 6,
    marginRight: 12,
  },
  propertyInfo: {
    flex: 1,
  },
  propertyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  propertyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Couleurs.textPrimary,
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    color: Couleurs.white,
    fontWeight: "500",
  },
  propertyDetails: {
    gap: 4,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    marginLeft: 4,
    fontSize: 14,
    color: Couleurs.textSecondary,
  },
  priceText: {
    fontSize: 16,
    fontWeight: "600",
    color: Couleurs.primary,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeText: {
    marginLeft: 4,
    fontSize: 12,
    color: Couleurs.textMuted,
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  detailButton: {
    flex: 1,
  },
  iconButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: Couleurs.background,
  },
  loadingContainer: {
    paddingVertical: 20,
    alignItems: "center",
  },
  loadMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: Couleurs.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Couleurs.primary,
    gap: 8,
  },
  loadMoreText: {
    fontSize: 14,
    color: Couleurs.primary,
    fontWeight: "500",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: Couleurs.textSecondary,
  },
})

export default Listflast
