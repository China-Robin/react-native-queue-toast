/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,TouchableOpacity,
} from 'react-native';

import YXToast from 'react-native-queue-toast'

export default class App extends Component {

  _show(){
    this.toast.showSuccess("操作完成!");
    this.toast.showFailure("操作完成!");
    this.toast.showInfoMsg("操作完成!");
    this.toast.showMessage("操作完成!");
  }

  render() {
    return (
      <View style={styles.container}>
        <YXToast ref={(toast)=>{this.toast = toast;}} maskBackgroundColor="red"/>
        <TouchableOpacity style={styles.button} onPress={()=>{this._show();}}>
          <Text style={styles.text}>show</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  button:{
    backgroundColor:"#f10000",
    width:200,
    marginLeft:"auto",
    marginRight:"auto",
    marginTop:180,
    height:64,
    justifyContent:"center",
    alignItems:"center",
    borderRadius:15
  },
  text:{
    color:"white",
    fontSize:28
  }
});
