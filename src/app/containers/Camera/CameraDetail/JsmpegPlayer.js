import React, { Component } from 'react';
import JSMpeg from '@cycjimmy/jsmpeg-player';
import { Button } from 'antd';

import './Camera.scss';
import {
  InstagramOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  StopOutlined,
  CameraOutlined, ExpandOutlined, CompressOutlined,
} from '@ant-design/icons';
import Ratio from '@components/Ratio';

export default class JsmpegPlayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      marginNumber: 50,
      marginNumberFull: 105,
      scrollScreen: 0,
      isFullScreen: false,
    };
    this.els = {
      videoWrapper: null,
    };
  };

  // takePhoto = () => {
  //   let image = [];
  //   image = [...image, this.video.els.canvas.toDataURL()];
  //   this.props.takePhoto(image);
  // };

  // takeQuickPhoto = () => {
  //   let image = [];
  //   const tineInterval = setInterval(() => {
  //     image = [...image, this.video.els.canvas.toDataURL()];
  //     if (image.length === 10) {
  //       this.props.takePhoto(image);
  //       clearInterval(tineInterval);
  //     }
  //   }, 500);
  // };

  render() {
    return (
      <div>
        {!this.state.isFullScreen ? <div className="d-flex">
          <div className="camera-view">
            <Ratio type="16:9">
              <div
                className={this.props.wrapperClassName}
                ref={videoWrapper => this.els.videoWrapper = videoWrapper}
                onClick={() => {
                  const jsBreadcrumbCamera = document.getElementById('js-breadcrumb-camera');
                  const jsInfoCamera = document.getElementById('js-info-camera');
                  document.getElementById('content-container').scroll({ top: jsBreadcrumbCamera?.offsetHeight + jsInfoCamera?.offsetHeight + this.state.marginNumber });
                }}
              />
            </Ratio>
          </div>
        </div> : <div className="d-flex">
          <div className="camera-view-full-screen">
            <Ratio type="16:9">
              <div
                className={this.props.wrapperClassName}
                ref={videoWrapper => this.els.videoWrapper = videoWrapper}
                onClick={() => {
                  const jsBreadcrumbCamera = document.getElementById('js-breadcrumb-camera');
                  const jsInfoCamera = document.getElementById('js-info-camera');
                  document.getElementById('content-container').scroll({ top: jsBreadcrumbCamera?.offsetHeight + jsInfoCamera?.offsetHeight + this.state.marginNumberFull });
                }}/>
            </Ratio>
          </div>
        </div>
        }
        <div className="btn-center mt-2">
          <Button
            icon={<PlayCircleOutlined style={{ fontSize: 15 }}/>}
            type="primary" ghost
            onClick={() => this.video.play()}
            style={{ fontWeight: 'bold', marginRight: 10 }}
            disabled={false}>{'Phát'}</Button>
          <Button
            icon={<PauseCircleOutlined style={{ fontSize: 15 }} />}
            type="primary" ghost
            onClick={() => this.video.pause()}
            style={{ fontWeight: 'bold', marginRight: 10 }}
            disabled={false}>{'Tạm dừng'}</Button>
          <Button
            icon={<StopOutlined style={{ fontSize: 15 }}/>}
            type="primary" ghost danger
            onClick={() => this.video.stop()}
            style={{ fontWeight: 'bold', marginRight: 10 }}
            disabled={false}>{'Dừng'}
          </Button>
          {/* <Button
            icon={<CameraOutlined style={{ fontSize: 15 }}/>}
            type="primary" ghost
            onClick={this.takePhoto}
            style={{ fontWeight: 'bold', marginRight: 10 }}>{this.props.translation('CHUP_ANH')}</Button> */}
          {/* <Button
            icon={<InstagramOutlined style={{ fontSize: 15 }}/>}
            type="primary" ghost
            onClick={this.takeQuickPhoto}
            style={{ fontWeight: 'bold', marginRight: 10 }}>{this.props.translation('CHUP_NHANH')}</Button> */}
          {/* <Button
            icon={!this.state.isFullScreen ? <ExpandOutlined style={{ fontSize: 15 }}/> :
              <CompressOutlined style={{ fontSize: 15 }}/>}
            type="primary" ghost
            onClick={() => {
              const jsBreadcrumbCamera = document.getElementById('js-breadcrumb-camera');
              const jsInfoCamera = document.getElementById('js-info-camera');
              document.getElementById('content-container').scroll({ top: !this.state.isFullScreen ? jsBreadcrumbCamera?.offsetHeight + jsInfoCamera?.offsetHeight + this.state.marginNumberFull : jsBreadcrumbCamera?.offsetHeight + jsInfoCamera?.offsetHeight + this.state.marginNumber });
              this.setState({
                isFullScreen: !this.state.isFullScreen,
              });
            }}
            style={{ fontWeight: 'bold', marginRight: 10 }}>{!this.state.isFullScreen ? 'Mở rộng' : 'Thu nhỏ'}</Button> */}
        </div>
        <br/>
      </div>
    );
  };

  componentDidMount() {
    this.video = new JSMpeg.VideoElement(
      this.els.videoWrapper,
      this.props.videoUrl,
      this.props.options,
      this.props.overlayOptions,
    );

    if (this.props.onRef) {
      this.props.onRef(this);
      // this.props.takePhoto();
    }
  };
};

