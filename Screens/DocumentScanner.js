import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';

export default function DocumentScanner() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scannedUri, setScannedUri] = useState(null);
  const [loading, setLoading] = useState(false);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const scanDocument = async () => {
    if (cameraRef.current) {
      setLoading(true);
      const photo = await cameraRef.current.takePictureAsync({ quality: 1, skipProcessing: true });

      // Amélioration de la qualité et redimensionnement
      const enhanced = await ImageManipulator.manipulateAsync(photo.uri, [
        { resize: { width: 2480, height: 3508 } }, // Format A4 à 300 DPI
        { sharpen: 1.0 }
      ], { compress: 1, format: ImageManipulator.SaveFormat.JPEG });

      setScannedUri(enhanced.uri);
      setLoading(false);
    }
  };

  const uploadDocument = async () => {
    if (!scannedUri) return;

    const formData = new FormData();
    formData.append('document', {
      uri: scannedUri,
      name: 'archive.jpg',
      type: 'image/jpeg'
    });

    try {
      const response = await fetch('https://ton-api.com/api/archives', {
        method: 'POST',
        headers: {
          'Authorization': "Bearer VOTRE_TOKEN_ICI",
          'Content-Type': 'multipart/form-data'
        },
        body: formData
      });

      const result = await response.json();
      alert('Document envoyé avec succès');
    } catch (error) {
      alert('Erreur lors de l’envoi');
    }
  };

  if (hasPermission === null) return <Text>Demande de permission...</Text>;
  if (hasPermission === false) return <Text>Accès à la caméra refusé</Text>;

  return (
    <View style={styles.container}>
      {!scannedUri ? (
        <Camera style={styles.camera} ref={cameraRef} />
      ) : (
        <Image source={{ uri: scannedUri }} style={styles.preview} />
      )}

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <View style={styles.buttons}>
          {!scannedUri ? (
            <TouchableOpacity onPress={scanDocument} style={styles.button}>
              <Text style={styles.buttonText}>📸 Scanner</Text>
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity onPress={uploadDocument} style={styles.button}>
                <Text style={styles.buttonText}>📤 Envoyer</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setScannedUri(null)} style={styles.button}>
                <Text style={styles.buttonText}>🔄 Recommencer</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  camera: { flex: 1 },
  preview: { flex: 1, resizeMode: 'contain' },
  buttons: { flexDirection: 'row', justifyContent: 'space-around', padding: 20 },
  button: { backgroundColor: '#007bff', padding: 15, borderRadius: 8 },
  buttonText: { color: '#fff', fontWeight: 'bold' }
});