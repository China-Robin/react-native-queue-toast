## 1：安装方法
```
npm install react-native-queue-toast --save
```

## 2：使用方法
##### 1：引入头文件
```
import Toast from 'react-native-queue-toast'
```

##### 2：创建视图
```
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
```

##### 3：调用方法
```
_show(){
  this.toast.showSuccess("提交成功!");
  this.toast.showFailure("提交失败!");
  this.toast.showLoading("加载数据中...");
  this.toast.showInfoMsg("提示信息!");
  this.toast.showMessage("文本信息!");
  this.timer = setTimeout(() => {
    this.toast.hideLoading();
    this.toast.removeAllToast();// 移除后面所有toast
  },10000);
}
```

## 3：props参数配置
```
fadeInDuration // 显示动画时间，默认500ms
fadeOutDuration // 消失动画时间，默认500ms
maskBackgroundColor // 蒙板的颜色，默认为透明，只有在mask参数为true的时候才会显示
opacity // 提示框透明度，默认为1不透明
offsetY // Y轴的偏移值，默认为0

示例方法如下：
    <Toast
     ref={(toast)=>{this.toast = toast;}}
     fadeInDuration={1000}
     fadeOutDuration={1000}
     opacity={0.8}
     offsetY={50}
     maskBackgroundColor="red"/>
```

## 4：方法参数配置
```
mask // 是否显示蒙板，默认为false
showTime // 多少时间后消失，默认为2000ms，单位为ms，showLoading不接受该参数
callback // 消失后的回调方法

示例方法如下：
    this.toast.showSuccess("提交成功!",{
      mask: true,
      showTime: 3000,
      callback: () => {},
    });
```

## 5：演示图片
![](https://github.com/China-Robin/react-native-queue-toast/blob/master/toast.gif)