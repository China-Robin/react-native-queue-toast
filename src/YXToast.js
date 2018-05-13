/**
 * 提示插件
 */

import React, {Component} from 'react';
import {
  StyleSheet,
  Animated,
  Dimensions,
  Text,
  Image,
  ActivityIndicator,
} from 'react-native'

const {height, width} = Dimensions.get('window');

/**
 * 状态枚举
 * @type {{Success: string, Failure: string, Info: string, Wait: string, Text: string}}
 */
const YXToastStatus = {
  Success: "Success",
  Failure: "Failure",
  Info: "Info",
  Wait: "Wait",
  Text: "Text"
};

/**
 * 单个Toast对象
 */
class YXItemToast{
  constructor(status, text, callback, showTime, mask){
    this.status = status;
    this.text = text;
    this.callback = callback;
    this.showTime = showTime;
    this.mask = mask;
  }
}

export default class YXToast extends Component {

  constructor(props) {
    super(props);
    this.state = {
      // 文本
      text: '',
      // 回调函数
      callback: function(){},
      // 当前状态
      status: YXToastStatus.Success,
      // 初始化透明度
      opacityValue: new Animated.Value(0),
      // 是否显示view
      isShow: false,
      // 动画偏移
      marginTopValue: new Animated.Value(50 + this.props.offsetY),
      // 初始化蒙版透明度
      maskOpacityValue: new Animated.Value(0),
      // 是否有蒙版
      mask:false,

      // 下列属性用于居中显示
      width: width,
      height: height,
      top: 0,
      left: 0
    };
    // 当前view是否正在显示
    this.viewISShow = false;
    // 队列
    this.queue = [];
    // 是否在等待动画执行完之后消失（该属性为Wait模式专用）
    this.isWaitHide = false;
  }

  /**
   * 根据不同的状态显示不同的信息
   * @param status
   * @param text
   * @param options
   * @private
   */
  _show(status, text, options) {
    options = options === undefined ? {} : options;
    if (this.viewISShow) {
      this.queue.push(new YXItemToast(status, text, options.callback, options.showTime, options.mask));
      return false;
    }
    this.viewISShow = true;
    this.setState({
      isShow: true,
      text: text,
      status: status,
      callback: options.callback,
      mask: options.mask === undefined ? false : options.mask,
    });

    // 开始执行动画
    Animated.parallel([
      Animated.timing(
        this.state.opacityValue,
        {
          toValue: this.props.opacity,
          duration: this.props.fadeInDuration,
        }
      ),
      Animated.timing(
        this.state.maskOpacityValue,
        {
          toValue: 1,
          duration: 0,
        }
      ),
      Animated.timing(
        this.state.marginTopValue,
        {
          toValue: 0 + this.props.offsetY,
          duration: this.props.fadeInDuration,
        }
      ),
    ]).start(() => {
      if(this.isWaitHide && this.state.status === YXToastStatus.Wait){
        this._hide();
      }
      this.isWaitHide = false;
    });
    // 判断是否是等待，如果不是等待，就在显示时间结束之后自动隐藏
    if (status !== YXToastStatus.Wait) {
      this.timer && clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this._hide();
      }, options.showTime === undefined ? 2000 : options.showTime);
    }
  }

  /**
   * 隐藏
   * @private
   */
  _hide(){
    Animated.parallel([
      Animated.timing(
        this.state.opacityValue,
        {
          toValue: 0,
          duration: this.props.fadeOutDuration,
        }
      ),
      Animated.timing(
        this.state.maskOpacityValue,
        {
          toValue: 0,
          duration: this.props.fadeInDuration,
        }
      ),
      Animated.timing(
        this.state.marginTopValue,
        {
          toValue: 50 + this.props.offsetY,
          duration: this.props.fadeInDuration,
        }
      ),
    ]).start(() => {
      this.setState({
        isShow: false,
      });
      this.viewISShow = false;
      if(typeof this.state.callback === 'function') {
        this.state.callback();
      }
      this._showNextToast();
    });
  }

  /**
   * 显示下一条
   * @private
   */
  _showNextToast(){
    if(this.queue.length !== 0){
      let item = this.queue[0];
      this.queue.splice(0, 1);
      this._show(item.status, item.text, {callback:item.callback, showTime:item.showTime, mask: item.mask});
    }
  }

  /**
   * 显示文本信息
   * @param text
   * @param options
   */
  showMessage(text, options){
    this._show(YXToastStatus.Text, text, options);
  }

  /**
   * 显示提示信息
   * @param text
   * @param options
   */
  showInfoMsg(text, options){
    this._show(YXToastStatus.Info, text, options);
  }

  /**
   * 显示错误信息
   * @param text
   * @param options
   */
  showFailure(text, options){
    this._show(YXToastStatus.Failure, text, options);
  }

  /**
   * 显示操作成功信息
   * @param text
   * @param options
   */
  showSuccess(text, options){
    this._show(YXToastStatus.Success, text, options);
  }

  /**
   * 显示等待
   * @param text
   * @param options
   */
  showLoading(text, options){
    this._show(YXToastStatus.Wait, text, options);
  }

  /**
   * 隐藏等待
   */
  hideLoading(){
    // 判断当前显示的是否为等待
    if(this.state.status === YXToastStatus.Wait){
      // 判断等待动画是否已经结束
      if(JSON.stringify(this.state.opacityValue) >= 1){
        this._hide();
      }else{
        this.isWaitHide = true;
      }
    }else{
      // 不是等待，查找队列是否存在等待，如果有，直接移除
      for(let i = 0; i < this.queue.length; i++){
        if(this.queue[i].status === YXToastStatus.Wait){
          this.queue.splice(i, 1);
        }
      }
    }
  }

  /**
   * 移除后面所有提示
   */
  removeAllToast(){
    this.queue = [];
  }

  componentDidMount(){
    // 监听屏幕是否发生了转屏事件
    this.listenerScreen = setTimeout(() => {
      if(this.state.width !== Dimensions.get('window').width || this.state.height !== Dimensions.get('window').height){
        this.setState({
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height,
        });
      }
    }, 50);
  }

  componentWillUnmount() {
    // 卸载组件，清除定时器
    this.timer && clearTimeout(this.timer);
    this.listenerScreen && clearTimeout(this.listenerScreen);
  }

  // 该方法目的是为了在最顶层的时候，一样可以点击
  _resetLocation(e){
    if(!this.state.mask){
      this.refs.contentView.setNativeProps({
        style: {
          top:(height-e.layout.height) / 2,
          left:(width-e.layout.width) / 2
        }
      });
    }else{
      this.refs.contentView.setNativeProps({
        style: {
          top:0,
          left:0
        }
      });
    }
  }

  render() {
    let icon;
    let iconStyle = {};
    let loadingStyle = {};
    let textStyle = {};
    let contentStyle = {};
    if(this.state.text.length !== 0){
      // 有文字就加入间距
      iconStyle = {marginBottom: 8};
      if(this.state.status === YXToastStatus.Wait){
        textStyle = {marginTop: 43};
      }
      if(this.state.status === YXToastStatus.Text){
        contentStyle = {minHeight: 0};
      }
      loadingStyle = {position: 'absolute', top: 32,};
    }else{
      // 用于保证垂直居中
      iconStyle = {marginTop: 9};
      loadingStyle = {position: 'absolute', top: 40,};
    }
    switch (this.state.status) {
      case YXToastStatus.Success:
        icon = require('./assest/toast_success.png');
        break;
      case YXToastStatus.Failure:
        icon = require('./assest/toast_error.png');
        break;
      case YXToastStatus.Info:
        icon = require('./assest/toast_info.png');
        break;
      default:
        icon = null;
        break;
    }
    let maskBGColor = this.state.mask?this.props.maskBackgroundColor:"transparent";
    let rootWH = this.state.mask ? {width:this.state.width, height:this.state.height} : {};
    const view = this.state.isShow ?
      <Animated.View
        ref="contentView"
        style={[styles.root, rootWH,
          {
            opacity: this.state.maskOpacityValue,
            backgroundColor:maskBGColor,
            marginTop: this.state.marginTopValue
          }
        ]}>
        <Animated.View onLayout={({nativeEvent:e})=>this._resetLocation(e)}
                       style={[styles.content, {opacity: this.state.opacityValue, }, contentStyle]}>
          {this.state.status !== YXToastStatus.Wait ? null :
            <ActivityIndicator
              style={[styles.loading, loadingStyle]}
              size="large"
              color="white"/>}
          {icon === null ? null :
            <Image
              style={[styles.icon, iconStyle]}
              source={icon}/>}
          {this.state.text.length === 0 ? null : <Text style={[styles.text, textStyle]}>{this.state.text}</Text>}
        </Animated.View>
      </Animated.View>: null;
    return view;
  }

}

const styles = StyleSheet.create({
  root:{
    position:"absolute",
    zIndex:10000,
    justifyContent:"center",
    alignItems: 'center',
    top:0,
    left:0,
  },
  content: {
    backgroundColor: 'rgba(22, 22, 22, 0.8)',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    maxWidth: width / 2 + 60,
    minWidth: 80,
    minHeight: 80,
  },
  text: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign:"center"
  },
  icon: {
    width: 32,
    height: 32,
  },
  loading: {
    width: 0,
    height: 0,
  }
});

YXToast.defaultProps = {
  fadeInDuration: 500,
  fadeOutDuration: 500,
  maskBackgroundColor: "transparent",
  opacity: 1,
  offsetY: 0,
};