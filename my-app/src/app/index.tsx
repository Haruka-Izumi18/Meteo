import * as Device from "expo-device";
import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import * as Location from "expo-location";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Dropdown } from 'react-native-element-dropdown';
import { useRouter } from 'expo-router';
import { CityPickerDropdown } from "@/components/CityPickerDropdown";

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const [temp, setTemp] = useState(null);
  const [weather, setWeather] = useState("");
  const [city, setCity] = useState("");
  const [error, setError] = useState("");
  const [weatherColor, setWeatherColor] = useState("#000");
  const [weatherIcon, setWeatherIcon] = useState<any>("");
  const [selectedCity, setSelectedCity] = useState("");
  const router = useRouter();

 const fetchWeather = async () => {
  setLoading(true);
  setError("");
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setError("Veuillez autoriser l'accèsà votre position");
          setLoading(false);
          return;
        }
      const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
      
      if (!location) {
        setError('Impossible de trouver la location');
        setLoading(false);
        return;
      }
        const { latitude, longitude } = location.coords;

        const geoRes = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
          {
            headers: {
              "User-Agent": "MyWeatherApp/1.0",
            },
          },
        );
        const geoData = await geoRes.json();
        const cityName =
          geoData.address?.city ||
          geoData.address?.town ||
          geoData.address?.village ||
          geoData.address?.county ||
          "Inconnu";
        setCity(cityName);

        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`,
        );
        const data = await res.json();
        setTemp(data.current_weather.temperature);
        const code = data.current_weather.weathercode;
        if (code === 0) {setWeather("Ensoleillé");
          setWeatherColor("#F54927");
          setWeatherIcon("weather-sunny");
        } else if (code <= 3) {setWeather("Nuageux");
          setWeatherColor("#B3C3D5");
          setWeatherIcon("weather-cloudy");
        } else if (code <= 48) {setWeather("brouillard");
          setWeatherColor("#CAD6D9");
          setWeatherIcon("weather-fog");
        } else if (code <= 67) {setWeather("Pluie");
          setWeatherColor("#1189D9");
          setWeatherIcon("weather-pouring");
        } else if (code <= 77) {setWeather("Neige");
          setWeatherColor("#27D7F2");
          setWeatherIcon("weather-snowy-heavy");
         } else {setWeather("Orage");
          setWeatherColor("#F2EF27");
          setWeatherIcon("weather-lightning");
      } 
    } catch (err) {
        setError("Erreur lors du chargement");
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      fetchWeather();
    }, []);

  return (
    <>
    <View style={styles.menu}>
      <Text style={{fontWeight: "bold", fontSize: 17}}>Choississez une ville</Text>
      <CityPickerDropdown />
      </View>
    <View style={styles.container}>
      <Text style={styles.title}>Météo à {city || "..."}</Text>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <View style={styles.info}>
        <MaterialCommunityIcons
        name={weatherIcon}
        size={50}
        color="black"
        />
          <Text style={[styles.meteo, { color: weatherColor }]}>{weather}</Text>
          <Text style={styles.meteo}>{temp}°C</Text>
        </View>
      )}
      <TouchableOpacity style={styles.button} onPress={fetchWeather} disabled={loading}>
        <MaterialCommunityIcons name="refresh" size={24} color="white" />
        <Text style={styles.buttonText}>Actualiser</Text>
      </TouchableOpacity>
    </View>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  menu:{
    margin: 30,
    position: "absolute",
    top: 50,
    right: 10,
    width: 180,
  },
  title: {
    textAlign: "center",
    fontSize: 40,
    fontWeight: "bold",
  },
  meteo: {
    textAlign: "center",
    fontSize: 30,
  },
  info: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#5B7CA4",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 30,
    marginTop: 40,
    gap: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  link:{
    color: 'blue', marginTop: 10
  }
});

