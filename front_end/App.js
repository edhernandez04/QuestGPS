import React, { Component } from 'react';
import { AppRegistry, View, AsyncStorage, PermissionsAndroid } from 'react-native';
import Routes from './Routes.js';
import { Actions } from 'react-native-router-flux';

class App extends Component {

state = {
    currentUser: null,
    latitude: 0,
    longitude: 0
}

componentDidMount(){
    const token = AsyncStorage.token

    if(token){
        fetch("http://10.0.2.2:3000/auto_login", {
            headers: {
                "Authorization": token
            }
        })
            .then(res => res.json())
            .then(response => {
                if (response.errors){
                    alert(response.errors)
                    Actions.login()
                } else {
                    this.setState({ currentUser: response })
                }
            })
    } else {
        Actions.login()
    }
    const granted = PermissionsAndroid.check( PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION );
        if (granted) {
            console.log( "TRACKER ACTIVATED" )
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    let latitude = JSON.stringify(position.coords.latitude)
                    let longitude = JSON.stringify(position.coords.longitude)
                    this.setState({ latitude: parseFloat(latitude), longitude: parseFloat(longitude) })
                }, { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
            )
        } else {
            console.log( "ACCESS_FINE_LOCATION permission denied" )
        }
}

_getLocation = async () => {
    navigator.geolocation.getCurrentPosition(position => {
        const region = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.003,
            longitudeDelta: 0.0003
            };
    this.map.animateToRegion(region, 500);
    });
};

setUser = response => {
    this.setState({ currentUser: response.user },
        () => {
            AsyncStorage.token = response.token
            Actions.home()
        }
    )
}

setEditUser = response => {
    this.setState({
        currentUser: response
    }, () => {
        Actions.home()
    })
}

logout = () => {
    this.setState({
        currentUser: null
    }, () => {
        AsyncStorage.removeItem("token")
        Actions.login()
    })
}

   render() {
      return (
         <Routes
             latitude={this.state.latitude}
             longitude={this.state.longitude}
             currentUser={this.state.currentUser}
             setUser={this.setUser}
             setEditUser={this.setEditUser}
             logout={this.logout}
         />
      )
   }
}
export default App
AppRegistry.registerComponent('App', () => App)