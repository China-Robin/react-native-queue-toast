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

import Toast from 'react-native-queue-toast'

export default class App extends Component {

  _show(){
    this.toast.showSuccess("提交成功!");
    this.toast.showFailure("提交失败!");
    this.toast.showLoading("加载数据中...");
    this.toast.showInfoMsg("提示信息!");
    this.toast.showMessage("文本信息!");
    this.timer = setTimeout(() => {
      this.toast.hideLoading();
      this.toast.removeAllToast();// 移除后面所有toast
    }, 10000);
  }

  componentWillUnmount() {
    this.timer && clearTimeout(this.timer);
  }

  render() {
    return (
      <View style={styles.container}>
        <Toast ref={(toast)=>{this.toast = toast;}} maskBackgroundColor="red"/>
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
