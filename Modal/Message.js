import React from "react"
import { View, Text, StyleSheet, Modal, TouchableWithoutFeedback, StatusBar, Platform } from "react-native"
import { Couleurs } from "../Login/Couleurs"

const ModalPop = ({ visible, message, type = "success", onClose }) => {
    const colors = {
        success: Couleurs.textPrimary,
        error: Couleurs.mapMarker,
    }

    return (
        <Modal
            transparent
            animationType="fade"
            visible={visible}
            onRequestClose={onClose}
            statusBarTranslucent={true} // ✅ important pour que le fond couvre toute la StatusBar sur Android
        >
            {/* StatusBar sombre pour le modal */}
            {/* {Platform.OS === "android" && (
                <StatusBar backgroundColor= "#0d2c6b" barStyle="light-content" />
            )} */}

            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.modalOverlay}>
                    <TouchableWithoutFeedback>
                        <View style={styles.modalContainer}>
                            <Text style={[styles.modalTitle, { color: colors[type] }]}>
                                {type === "success" ? "✅ Succès" : "❌ Erreur"}
                            </Text>
                            <Text style={styles.modalMessage}>{message}</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0, // ✅ pour éviter l’espace blanc en haut sur Android
    },
    modalContainer: {
        width: "80%",
        backgroundColor: Couleurs.white,
        borderRadius: 12,
        padding: 20,
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    modalMessage: {
        fontSize: 16,
        textAlign: "center",
    },
})

export default ModalPop
