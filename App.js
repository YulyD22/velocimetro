import React, { useEffect, useState } from "react";
import { auth } from "./src/services/FirebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomePage from "./src/pages/HomePage";
import IngresoPage from "./src/pages/IngresoPage";
import Register from "./src/pages/Register";

const Stack = createStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          // Si el usuario está autenticado, muestra solo la pantalla de inicio
          <Stack.Screen name="HomePage" component={HomePage} />
        ) : (
          // Si el usuario no está autenticado, muestra las pantallas de login y registro
          <>
            <Stack.Screen name="Login" component={IngresoPage} />
            <Stack.Screen name="Register" component={Register} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
