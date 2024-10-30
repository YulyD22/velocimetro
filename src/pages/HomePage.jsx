import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Image, Button } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { Picker } from "@react-native-picker/picker";

const vehicleIcons = {
  car: require("./assets/car.png"),
  motorcycle: require("./assets/motorbike.png"),
  bicycle: require("./assets/cycling.png"),
};

const HomePage = () => {
  const [speed, setSpeed] = useState(0);
  const [location, setLocation] = useState(null);
  const [vehicle, setVehicle] = useState("car");
  const [bgColor, setBgColor] = useState("#fff");
  const [textColor, setTextColor] = useState("#000");
  const mapRef = useRef(null);

  // Pedir permisos de ubicación y actualizar la velocidad y ubicación del usuario
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
          ]} // Color de texto en el picker
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
