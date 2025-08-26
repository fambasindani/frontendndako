import React, { useEffect, useRef, useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import { Camera, CameraType } from "expo-camera";
import * as MediaLibrary from "expo-media-library";

export default function AppScreen() {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [hasMediaPermission, setHasMediaPermission] = useState<boolean | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const cameraRef = useRef<Camera | null>(null);

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === "granted");

      const mediaStatus = await MediaLibrary.requestPermissionsAsync();
      setHasMediaPermission(mediaStatus.status === "granted");
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      const data = await cameraRef.current.takePictureAsync();
      setPhoto(data.uri);
    }
  };

  const savePicture = async () => {
    if (photo && hasMediaPermission) {
      try {
        await MediaLibrary.saveToLibraryAsync(photo);
        alert("✅ Photo enregistrée dans la galerie !");
        setPhoto(null);
      } catch (error) {
        console.error("Erreur lors de l'enregistrement :", error);
      }
    }
  };

  if (hasCameraPermission === null) {
    return <View><Text>⏳ Demande de permission...</Text></View>;
  }
  if (hasCameraPermission === false) {
    return <View><Text>❌ Accès caméra refusé</Text></View>;
  }

  return (
    <View style={styles.container}>
      {!photo ? (
        <>
          <Camera
            style={styles.camera}
            type={CameraType.back}
            ref={(ref) => (cameraRef.current = ref)}
          >
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={takePicture}>
                <Text style={styles.text}>📸 Prendre une photo</Text>
              </TouchableOpacity>
            </View>
          </Camera>
        </>
      ) : (
        <>
          <Image source={{ uri: photo }} style={styles.preview} />
          <View style={styles.actions}>
            <Button title="💾 Enregistrer" onPress={savePicture} />
            <Button title="↩️ Reprendre" onPress={() => setPhoto(null)} />
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
  },
  camera: {
    flex: 1,
    justifyContent: "flex-end",
  },
  buttonContainer: {
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 20,
    alignItems: "center",
  },
  button: {
    padding: 10,
    backgroundColor: "#1E90FF",
    borderRadius: 10,
  },
  text: {
    color: "#fff",
    fontSize: 18,
  },
  preview: {
    flex: 1,
    resizeMode: "contain",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 20,
  },
});
