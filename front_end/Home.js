import React from 'react';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { StyleSheet, Text, View, Button, Image } from 'react-native';
import { Actions } from 'react-native-router-flux';

export default class Home extends React.Component {

state = {
    allUsers: []
}

componentDidMount(){
    fetch('http://10.0.2.2:3000/users')
        .then(resp => resp.json())
        .then(allUsers => this.setState({allUsers}))
}

render() {
    console.log(this.props.latitude, this.props.longitude)
    return (
        <View style={styles.container}>

            <MapView style={styles.mapStyle} showsCompass={true}
                region={{
                    latitude: 40.863042,
                    longitude: -73.853909,
                    latitudeDelta: 0.003,
                    longitudeDelta: 0.0003
                }}>

            {this.state.allUsers.slice(2).map(user =>
                <MapView.Marker key={user.id} image={user.avatar} coordinate={{"latitude":user.latitude, "longitude":user.longitude}} title={user.userName} />
            )}
            </MapView>

        <View style={styles.menuContainer}>
            <Text style={styles.text}>{console.log(this.props.currentUser)}</Text>
        </View>

        <View style={styles.menuContainer}>
            <View style={styles.buttonContainer}>
                <Button title={"Open Chats"} style={styles.buttonStyle} onPress={() => Actions.chat()} color="red"/>
            </View>
            <View style={styles.buttonContainer}>
                <Button title={"Login"} onPress={() => Actions.login()} color="gold"/>
            </View>
            <View style={styles.buttonContainer}>
                <Button title={"Find Me"} onPress={this.props.getLocation} color="green"/>
            </View>
            <View style={styles.buttonContainer}>
                <Button title={"Log Out"} onPress={this.props.logout} color="blue"/>
            </View>
        </View>

        </View>
    );
}

}
  
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        alignItems: 'center',
        paddingTop: 5
    },
    mapStyle: {
        width: '99%',
        height: '85%'
    },
    markerImage:{
        height: 50,
        width: 50,
        alignItems: 'center'
    },
    text: {
        color: '#888',
        padding: 10
    },
    menuContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonContainer: {
        flex: 1,
    },
    findImage: {
        height: 34,
        width: 34
    }
});