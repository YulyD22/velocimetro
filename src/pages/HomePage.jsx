import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Image, Button } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { Picker } from "@react-native-picker/picker";
import { auth, db } from '../services/FirebaseConfig';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const vehicleIcons = {
  car: require("../../assets/car.png"),
  motorcycle: require("../../assets/motorbike.png"),
  bicycle: require("../../assets/cycling.png"),
};

const HomePage = () => {
  const [speed, setSpeed] = useState(0);
  const [location, setLocation] = useState(null);
  const [vehicle, setVehicle] = useState("car");
  const [bgColor, setBgColor] = useState("#fff");
  const [textColor, setTextColor] = useState("#000");
  const mapRef = useRef(null);

  // Lógica para guardar la velocidad máxima por día
  const saveMaxSpeedForUser = async (currentSpeed) => {
    if (!auth.currentUser) return; // Verifica si el usuario está autenticado

    const userId = auth.currentUser.email;
    const today = new Date().toISOString().split('T')[0]; // Formato de fecha YYYY-MM-DD
    const docRef = doc(db, "userSpeeds", userId); // Referencia al documento del usuario en la colección 'userSpeeds'

    try {
      const docSnap = await getDoc(docRef); // Intenta obtener el documento del usuario

      if (docSnap.exists()) {
        const data = docSnap.data();
        const maxSpeed = data[today] || 0; // Obtiene la velocidad máxima del día si existe, si no, usa 0

        if (currentSpeed > maxSpeed) {
          await setDoc(docRef, { [today]: currentSpeed }, { merge: true }); // Guarda la nueva velocidad si es mayor
          console.log("Nueva velocidad máxima registrada:", currentSpeed);
        }
      } else {
        // Si el documento no existe, lo crea con la velocidad actual
        await setDoc(docRef, { [today]: currentSpeed });
        console.log("Documento creado y velocidad máxima guardada:", currentSpeed);
      }
    } catch (error) {
      console.error("Error al guardar la velocidad:", error.message);
    }
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permiso de ubicación denegado");
        return;
      }

      const subscribe = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Highest,
          timeInterval: 1000,
          distanceInterval: 1,
        },
        (loc) => {
          const currentSpeed = loc.coords.speed * 3.6;
          setSpeed(Math.max(0, currentSpeed));
          setLocation(loc.coords);

          // Guarda la velocidad máxima del usuario en Firestore si es mayor que la guardada
          if (currentSpeed > 0) {
            saveMaxSpeedForUser(currentSpeed); 
          }

          // Cambia el color de fondo y texto según la velocidad
          if (currentSpeed === 0) {
            setBgColor("#fff");
            setTextColor("#000");
          } else if (currentSpeed > 0 && currentSpeed <= 50) {
            setBgColor("#00ff00");
            setTextColor("#fff");
          } else if (currentSpeed > 50 && currentSpeed <= 89) {
            setBgColor("#ffff00");
            setTextColor("#000");
          } else if (currentSpeed >= 90) {
            setBgColor("#ff0000");
            setTextColor("#fff");
          }
        }
      );
      return () => subscribe.remove();
    })();
  }, []);

  // Recentrar el mapa a la ubicación actual del usuario
  const recenterMap = () => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.002,
        longitudeDelta: 0.002,
      });
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <View style={styles.speedometerContainer}>
        <Text style={[styles.speedText, { color: textColor }]}>
          {Math.round(speed)} km/h
        </Text>
      </View>

      {location && (
        <MapView
          ref={mapRef}
          style={styles.map}
          region={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.002,
            longitudeDelta: 0.002,
          }}
        >
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
          >
            <Image
              source={vehicleIcons[vehicle]}
              style={{ width: 50, height: 50 }}
            />
          </Marker>
        </MapView>
      )}

      <View style={styles.buttonContainer}>
        <Button title="Recentrar" onPress={recenterMap} />
      </View>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={vehicle}
          style={[
            styles.picker,
            { color: textColor === "#fff" ? "#fff" : "#000" },
          ]}
          onValueChange={(itemValue) => setVehicle(itemValue)}
        >
          <Picker.Item label="Carro" value="car" />
          <Picker.Item label="Moto" value="motorcycle" />
          <Picker.Item label="Bicicleta" value="bicycle" />
        </Picker>
      </View>
    </View>
  );
};

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  speedometerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    top: 50,
  },
  speedText: {
    fontSize: 72,
    fontWeight: "bold",
  },
  map: {
    width: "100%",
    height: 300,
  },
  pickerContainer: {
    position: "absolute",
    top: 20,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  picker: {
    height: 50,
    width: 200,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default HomePage;
