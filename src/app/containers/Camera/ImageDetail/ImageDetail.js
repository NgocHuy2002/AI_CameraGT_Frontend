import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';

// import BoundingList from './BoundingList';
// import ImageRelate from './ImageRelate';
import ViewAndDrawImage from './ViewAndDrawImage';
import CustomModal from '@components/CustomModal';
import Loading from '@components/Loading';

import { CONSTANTS } from '@constants';
import { formatCanvasData, formatCanvasItem, randomKey, toast } from '@app/common/functionCommons';
// import { deleteLabel, getDetailImage, createLabelImage } from '@app/services/Dataset';
import { Form } from 'antd';
import CustomSkeleton from '@components/CustomSkeleton';
import './ViewAndDrawImage/ViewAndDrawImage.scss';
import { createCamera, getAllCamera, updateCameraById, deleteCamera } from '../../../services/Camera';

function ImageDetail({ myInfo, stateImgDetail, filterSelected, imageData, cameraInfo, ...props }) {
  let { id, imageId } = props;
  const { t } = useTranslation();
  const [formDevice] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const boundingOriginal = useRef([]);
  const [isFirst, setFirst] = useState(true);
  const [boundingList, setBoundingList] = useState([]);
  const [drawType, setDrawType] = useState(null);
  const [allowEdit, setAllowEdit] = useState(false);
  const [whImg, setWhImg] = useState({ width: 0, height: 0 });

  useEffect(() => {
    formDevice.resetFields();
  }, []);

  useEffect(() => {
    if (!isFirst) {
      setFirst(true);
    }
    setBoundingList([]);
    if (imageId) (async () => await getImgDetail(imageId))();
  }, [imageId]);

  useEffect(() => {
    getImgDetail();
  }, [cameraInfo]);

  async function getImgDetail() {
    if (cameraInfo) {
      const boundingList = formatCanvasData([cameraInfo?.detectPointGeo]);
      boundingList.map((item, index) => {
        if (item?.coordinates?.length === 2) {
          revertPolygonToRectangle(item, index, boundingList);
        }
      });
      setBoundingList(boundingList);
      boundingOriginal.current = boundingList;
      setAllowEdit(true);
    }
    setFirst(false);
  }

  function formatData(data) {
    let dataFormat = [];
    data.forEach(item => {
      if (item?.labelId !== undefined) {
        dataFormat.push({ ...item, label: item?.labelId?.labelName });
      } else {
        dataFormat.push({ ...item });
      }
    });
    return dataFormat;
  }

  function handleDrawRectangle() {
    const deviceTemp = formatCanvasItem({
      key: randomKey(),
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      isNew: true,
    });
    setBoundingList([...boundingList, deviceTemp]);
    setDrawType(CONSTANTS.RECTANGLE);
  }

  function handleDrawPolygon() {
    const deviceTemp = formatCanvasItem({
      key: randomKey(),
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      isNew: true,
    });
    setBoundingList([...boundingList, deviceTemp]);
    setDrawType(CONSTANTS.POLYGON);
  }

  function cancelAddDevice() {
    setDrawType(null);
    setBoundingList(boundingOriginal.current);
  }

  function setCanvasDataset(dataset) {
    setBoundingList(dataset);
  }

  function checkLable(label) {
    if (label === undefined) {
      toast(CONSTANTS.ERROR, t('VUI_LONG_CHON_NHAN'));
      return false;
    } else {
      return true;
    }
  }

  function handleRedrawCanvas(typeSelected, itemRedraw) {
    const dataChange = JSON.parse(JSON.stringify(boundingList)).map((dataset) => {
      // if (dataset.key === itemRedraw.key) {
      dataset.type = typeSelected;
      dataset.height = 0;
      dataset.width = 0;
      dataset.x = 0;
      dataset.y = 0;
      dataset.position = {};
      dataset.coordinates = [];
      // }
      return dataset;
    });
    setCanvasDataset(dataChange);
    setDrawType(typeSelected);
  }

  async function handleCreate({ label }) {
    let labels = [];
    let detectPoint = {};
    for (let i = 0; i < boundingList.length; i++) {
      if (boundingList[i].type === 'RECTANGLE') {
        const lableItem = {
          'type': 'RECTANGLE',
          'coordinates': [{
            offsetX: boundingList[i].x,
            offsetY: boundingList[i].y,
            X: Math.round(boundingList[i].x * whImg.width),
            Y: Math.round(boundingList[i].y * whImg.height),
          }, {
            offsetX: boundingList[i].x + boundingList[i].width,
            offsetY: boundingList[i].y + boundingList[i].height,
            X: Math.round((boundingList[i].x + boundingList[i].width) * whImg.width),
            Y: Math.round((boundingList[i].y + boundingList[i].height) * whImg.height),
          }],
        };

        detectPoint = lableItem;
      } else {
        const lableItem = {
          'type': 'POLYGON',
          'coordinates': boundingList[i].coordinates.map(obj => {
            return { ...obj, X: Math.round(obj.offsetX * whImg.width), Y: Math.round(obj.offsetY * whImg.height) };
          }),
        };
        detectPoint = lableItem;
      }
    }

    const result = detectPoint?.coordinates?.map(item => [Math.round(item.X / whImg.width * cameraInfo?.camWidth || 1955), Math.round(item.Y / whImg.height * cameraInfo?.camHeight || 931)]);

    const apiResponse = await updateCameraById(id, { detect_point: result, detect_point_geo: detectPoint });

    if (apiResponse) {
      toast(CONSTANTS.SUCCESS, t('Chỉnh sửa vùng nhận dạng thành công'));
    }
  }

  async function handleReboot() {
  }

  function revertPolygonToRectangle(dataItem, index, data) {
    data[index].xmax = dataItem?.coordinates[1]?.offsetX;
    data[index].xmin = dataItem?.coordinates[0]?.offsetX;
    data[index].ymax = dataItem?.coordinates[1]?.offsetY;
    data[index].ymin = dataItem?.coordinates[0]?.offsetY;
    data[index].type = 'RECTANGLE';
    data[index].x = dataItem?.coordinates[0]?.offsetX;
    data[index].y = dataItem?.coordinates[0]?.offsetY;
    data[index].height = dataItem?.coordinates[1]?.offsetY - dataItem?.coordinates[0]?.offsetY;
    data[index].width = dataItem?.coordinates[1]?.offsetX - dataItem?.coordinates[0]?.offsetX;
    data[index].coordinates = [];
    data[index].position = {};
    return data;
  }

  // if (!stateImgDetail?.isShowModal) return null;
  return (
    <>
      <Loading active={loading} className="site-layout-background">
        <div className="change-label">
          <ViewAndDrawImage
            imageUrl={`${cameraInfo.domain}`}
            // imageUrl={'https://tcameradev.thinklabs.com.vn/api/file/previewWarningImage/cameraTanUyen_2023-11-07T07-30-55.860Z.png'}
            canvasDataset={boundingList}
            drawType={drawType}
            setDrawType={setDrawType}
            setCanvasDataset={setCanvasDataset}
            allowEdit={allowEdit}
            handleDrawRectangle={handleDrawRectangle}
            handleDrawPolygon={handleDrawPolygon}
            formDevice={formDevice}
            handleCreate={handleCreate}
            handleReboot={handleReboot}
            cancelAddDevice={cancelAddDevice}
            handleRedrawCanvas={handleRedrawCanvas}
            setWhImg={setWhImg}
            myInfo={myInfo}
          />

        </div>
      </Loading>
    </>
  );
}

function mapStateToProps(store) {
  const { myInfo } = store.user;
  return { myInfo };
}

export default connect(mapStateToProps, null)(ImageDetail);
