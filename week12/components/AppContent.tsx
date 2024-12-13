import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Button, Image, Platform, Alert } from 'react-native';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as Notifications from 'expo-notifications';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { incrementSuccess, incrementFailure } from '../redux/counter.slice';
import firebaseConfig from '../firebaseConfig';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();
const storage = firebase.storage();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const AppContent = () => {
  const dispatch = useAppDispatch();
  const [image, setImage] = useState<string | null>(null);
  const [location, setLocation] = useState<any>(null);
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<any>(false);
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();
  const [successCount, setSuccessCount] = useState<number>(0);
  const [failureCount, setFailureCount] = useState<number>(0);

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);
    })();
  }, []);

  useEffect(() => {
    const unsubscribe = db.collection('counts').doc('globalCounts').onSnapshot(doc => {
      if (doc.exists) {
        const data = doc.data();
        setSuccessCount(data?.success || 0);
        setFailureCount(data?.failure || 0);
      }
    });
    return () => unsubscribe();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const takePicture = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setImage(uri);
      saveImage(uri);
    }
  };

  const saveImage = async (uri: string) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const fileName = uri.substring(uri.lastIndexOf('/') + 1);
    const storageRef = storage.ref().child(`images/${fileName}`);
    await storageRef.put(blob);
    const downloadURL = await storageRef.getDownloadURL();
    await saveDataToFirestore(downloadURL);
    saveToFileSystem(uri, location);
  };

  const saveDataToFirestore = async (photoUrl: string) => {
    try {
      await db.collection("photos").add({
        photoUrl,
        location,
        timestamp: new Date().toISOString()
      });
      await incrementSuccessCount();
      await sendNotification("Success", `Data added to Firestore. Successes: ${successCount + 1}, Failures: ${failureCount}`);
      dispatch(incrementSuccess());
    } catch (e) {
      console.error("Error adding document: ", e);
      await incrementFailureCount();
      await sendNotification("Error", `Failed to add data to Firestore. Successes: ${successCount}, Failures: ${failureCount + 1}`);
      dispatch(incrementFailure());
    }
  };

  const incrementSuccessCount = async () => {
    const countsRef = db.collection('counts').doc('globalCounts');
    await db.runTransaction(async (transaction) => {
      const doc = await transaction.get(countsRef);
      const newSuccessCount = (doc.data()?.success || 0) + 1;
      transaction.update(countsRef, { success: newSuccessCount });
      setSuccessCount(newSuccessCount);
    });
  };

  const incrementFailureCount = async () => {
    const countsRef = db.collection('counts').doc('globalCounts');
    await db.runTransaction(async (transaction) => {
      const doc = await transaction.get(countsRef);
      const newFailureCount = (doc.data()?.failure || 0) + 1;
      transaction.update(countsRef, { failure: newFailureCount });
      setFailureCount(newFailureCount);
    });
  };

  const saveToFileSystem = async (uri: string, location: any) => {
    const fileName = uri.substring(uri.lastIndexOf('/') + 1);
    const localUri = `${FileSystem.documentDirectory}${fileName}`;
    await FileSystem.copyAsync({
      from: uri,
      to: localUri,
    });
    const locationData = JSON.stringify(location);
    const locationFileUri = `${FileSystem.documentDirectory}${fileName}_location.json`;
    await FileSystem.writeAsStringAsync(locationFileUri, locationData);
    Alert.alert("Image and location saved to internal storage");
  };

  const sendNotification = async (title: string, body: string) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: title,
        body: body,
      },
      trigger: null,
    });
  };

  const handleObtainGeolocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocation(location.coords);
    Alert.alert('Location obtained', `Latitude: ${location.coords.latitude}, Longitude: ${location.coords.longitude}`);
  };

  const handleUploadToFirebase = async () => {
    if (image && location) {
      await saveImage(image);
    } else {
      Alert.alert('No image or location to upload');
    }
  };

  return (
    <View style={styles.container}>
      <Text>Moch.Bima - 00000045997</Text>
      <Button title="Take a Picture" onPress={takePicture} />
      <Button title="Pick an Image from Gallery" onPress={pickImage} />
      <Button title="Obtain Geolocation" onPress={handleObtainGeolocation} />
      <Button title="Upload to Firebase" onPress={handleUploadToFirebase} />
      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
      <Text>Success Count: {useAppSelector((state) => state.counter.successCount)}</Text>
      <Text>Failure Count: {useAppSelector((state) => state.counter.failureCount)}</Text>
      <Text>Total Success Count from Firestore: {successCount}</Text>
      <Text>Total Failure Count from Firestore: {failureCount}</Text>
    </View>
  );
};

const registerForPushNotificationsAsync = async (): Promise<string | null> => {
  let token: string | null = null;
  if (Constants.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return null;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
});

export default AppContent;
