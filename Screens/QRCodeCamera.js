import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Camera } from 'expo-camera';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';



export default function QRCodeCamera() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scannedData, setScannedData] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ data }) => {
    setScannedData(data);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>QR Code</Text>

      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Scannez un QR code"
          value={scannedData}
          onChangeText={setScannedData}
        />
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.iconButton}>
          <MaterialIcons name="qr-code-scanner" size={28} color="#007bff" />
        </TouchableOpacity>
      </View>

      <Modal visible={modalVisible} animationType="slide">
        <Camera
          style={{ flex: 1 }}
          onBarCodeScanned={handleBarCodeScanned}
          ref={cameraRef}
          barCodeScannerSettings={{
            barCodeTypes: ['qr'],
          }}
        >
          <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
            <MaterialIcons name="close" size={32} color="white" />
          </TouchableOpacity>
        </Camera>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 100,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ced4da',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: 'white',
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#212529',
  },
  iconButton: {
    padding: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 30,
    backgroundColor: '#00000080',
    padding: 10,
    borderRadius: 30,
  },
});
