import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import { Camera } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { Video, AVPlaybackStatus } from 'expo-av';

export default function CameraScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.front);
  const [vid, _vid] = useState();
  const [showVideo, _showVideo] = useState(false);
  const [showLoading, _showLoading] = useState(true);
  const videoRef = React.useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
      
    })();

    setTimeout(()=>{
      startRec();
    },1000)
  }, []);


  async function startRec(){
    if (this.camera) {
      _showLoading(false);
     const video = await this.camera.recordAsync({
      VideoQuality:['1080p'],
      maxDuration:5,
      mute:false,
      videoBitrate:5000000
    });
    
    _vid(video.uri);
    console.log("Video Done");
    console.log(video.uri);
        _showVideo(true);
 
 
    }
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={styles.container}>
      {showVideo != true ? (
        <>
    
      <Camera  ref={ref => {

            this.camera = ref;

  
  }} style={styles.camera} type={type}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}>

           <Ionicons  style={styles.text} icon={ Platform.OS === 'ios' ? "ios-reverse-camera" : 'md-reverse-camera'} size={40} color="white" />
           <Text style={styles.text}> Flip</Text>
          </TouchableOpacity>
          {showLoading ? (
          <Text>Loading</Text>
          ): null}
        </View>
      </Camera>
      </>
      ):(
        <>
        <Video
          ref={videoRef}
          style={styles.camera}
          source={{
            uri: vid,
          }}
          resizeMode="cover"
          isLooping
          shouldPlay
        />
   </>
      )}
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
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    margin: 20,
  },
  button: {
    flex: 0.1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
});
