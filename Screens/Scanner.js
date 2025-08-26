import React, { useState, useEffect } from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';
import { Camera } from 'expo-camera';

export default function Scanner() {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <Text>Vérification des permissions...</Text>;
  }
  if (hasPermission === false) {
    return <Text>Accès à la caméra refusé</Text>;
  }

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} ref={ref => setCameraRef(ref)}>
        <View style={styles.buttonContainer}>
          <Button title="Prendre une photo" onPress={() => console.log('Scan action')} />
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 0.1,
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
});