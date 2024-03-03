import React, { useEffect, useState } from "react";
import { connect } from "react-redux";

import Loading from "@components/Loading";

import { withTranslation } from "react-i18next";
import { TableOutlined } from "@ant-design/icons";

import * as unit from "@app/store/ducks/unit.duck";
import * as position from "@app/store/ducks/position.duck";
import * as camera from "@app/store/ducks/camera.duck";
import {
  CaretDownOutlined,
  CaretUpOutlined,
  CameraOutlined,
  SyncOutlined,
  MenuFoldOutlined,
  CloseOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import Layout1 from "@assets/icons/layout1x1.svg";
import Layout2 from "@assets/icons/layout2x2.svg";
import Layout3 from "@assets/icons/layout3x3.svg";
import Layout4 from "@assets/icons/layout4x4.svg";
import Layout2x4 from "@assets/icons/layout2x4.svg";
import { t } from "i18next";
import { Affix, Drawer, Button, Col, Collapse, Divider, Dropdown, Menu, Row, Space, Tag, Image } from "antd";
import IframeCustom from "../../../components/Video/iframe";
import "./style.css";
import { getAllCamera } from "../../../services/Camera";

import { convertQueryToObject, handleReplaceUrlSearch } from "@app/common/functionCommons";
import Hls from "hls.js";
import { createRtspLive, stopRtspLive } from "../../../services/RTSP";
import { API } from "../../../../constants/API";

function LiveCam({ positionList, unitList, permission, isLoading, myInfo, ...props }) {
  const { SubMenu } = Menu;
  const [size, setSize] = useState({ row: 1, column: 1, special: false });
  const [span, setSpan] = useState(24);
  const [open, setOpen] = useState(false);
  const [isCollapse, setCollapse] = useState(true);
  let [uniqueArray, setUniqueArray] = useState([]);
  const ViewportHeight = "100vh";
  const [bottom, setBottom] = useState(10);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectIndex, setSelectIndex] = useState({ row: 0, column: 0 });

  const [cameraData, setCameraData] = useState([]);
  const [rtspLink, setRtspLink] = useState();
  const [nameCamera, setNameCamera] = useState();
  const [loading, setLoading] = useState(true);
  const [streamLoaded, setStreamLoaded] = useState(false);

  const [data, setData] = useState({
    rows: Array.from({ length: size["row"] }, (_, rowIndex) =>
      Array.from({ length: size["column"] }, (_, colIndex) => null)
    ),
  });

  const layouts = [
    {
      row: 1,
      column: 1,
      special: false,
      icon: Layout1,
    },
    {
      row: 2,
      column: 2,
      special: false,
      icon: Layout2,
    },
    {
      row: 3,
      column: 3,
      special: false,
      icon: Layout3,
    },
    {
      row: 4,
      column: 4,
      special: false,
      icon: Layout4,
    },
    {
      row: 2,
      column: 4,
      special: true,
      icon: Layout2x4,
    },
  ];
  const menu = () => {
    let index = 0;
    return (
      <>
        {layouts.map((key) => {
          index += 6;
          return (
            <Affix
              key={key["row"] + "x" + key["column"]}
              offsetBottom={bottom}
              style={{ position: "absolute", right: `${index}%` }}
            >
              <Button
                type="primary"
                key={key["row"] + "x" + key["column"]}
                onClick={() => changeView(key["row"], key["column"], key["special"])}
              >
                <img src={key["icon"]} />
              </Button>
            </Affix>
          );
        })}
      </>
    );
  };

  const rowStyle = {
    height: `calc(${ViewportHeight} / ${size["row"]})`,
    borderWidth: 1,
  };
  // ------- useEffect --------------
  useEffect(() => {
    const currentData = data?.rows?.flat();
    setData({
      rows: Array.from({ length: size.row }, (_, rowIndex) =>
        Array.from({ length: size.column }, (_, colIndex) => {
          const dataIndex = rowIndex * size.column + colIndex;
          return dataIndex < currentData.length ? currentData[dataIndex] : null;
        })
      ),
    });
    setSelectIndex({ row: 0, column: 0 });
  }, [size]);

  useEffect(() => {
    convertToArray();
  }, [data]);

  useEffect(() => {
    (async () => {
      const { page, limit, ...queryObj } = convertQueryToObject(props.history.location.search);
      await getDataCamera(page, limit, queryObj);
    })();
  }, []);

  useEffect(() => {
    const video = document.getElementById("video");
    let intervalId;

    const loadStream = async () => {
      try {
        if (streamLoaded || nameCamera == null) {
          clearInterval(intervalId); // Stop calling the API if stream is loaded
          return;
        }
        const response = await fetch(API.GET_LIVE.format(nameCamera, "stream.m3u8"));
        if (!response.ok) {
          if (!loading) {
            setLoading(true);
          }
          throw new Error("Stream not found");
        }
        setLoading(false);
        if (Hls.isSupported()) {
          const hls = new Hls();
          hls.loadSource(API.GET_LIVE.format(nameCamera, "stream.m3u8"));
          hls.attachMedia(video);
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = API.GET_LIVE.format(nameCamera, "stream.m3u8");
        }
        setLoading(false); // Set loading to false when stream is loaded
        setStreamLoaded(true); // Set streamLoaded to true
      } catch (error) {
        console.error("Error loading stream:", error.message);
      }
    };

    // Call the loadStream function initially and then every second
    loadStream();
    intervalId = setInterval(loadStream, 1000);

    return () => {
      clearInterval(intervalId); // Cleanup the interval on component unmount
    };
  }, [nameCamera, streamLoaded]);

  // ---------- Action -----------------

  async function getDataCamera(
    currentPage = cameraData.currentPage,
    pageSize = cameraData.pageSize,
    query = cameraData.query
  ) {
    handleReplaceUrlSearch(props.history, currentPage, pageSize, query);
    const apiResponse = await getAllCamera(currentPage, pageSize, query);
    if (apiResponse) {
      const groupedData = apiResponse.reduce((acc, e) => {
        const unitName = e.unitId.name;
        const parentName = e.unitId.parentId.name;
        if (!acc[parentName]) {
          acc[parentName] = { name: parentName, children: [] };
        }

        let foundDonVi = false;

        for (const donVi of acc[parentName].children) {
          if (donVi.name === unitName) {
            foundDonVi = true;

            let foundChild = false;

            for (const child of donVi.children) {
              if (child.name === e.name) {
                foundChild = true;
                break;
              }
            }

            if (!foundChild) {
              donVi.children.push({ name: e.name, value: e.domain });
            }

            break;
          }
        }

        if (!foundDonVi) {
          acc[parentName].children.push({ name: unitName, children: [{ name: e.name, value: e.domain }] });
        }
        return acc;
      }, {});

      const newData = Object.values(groupedData);

      setCameraData(newData);
    }
  }
  const changeView = (row, column, special) => {
    setSize({ row: row, column: column, special: special });
    setSelectedTags([]);
  };

  const SelectItem = (rowIndex, colIndex) => {
    setSelectIndex({ row: rowIndex, column: colIndex });
  };

  function getElementAt(rowIndex, colIndex) {
    if (
      data.rows &&
      rowIndex >= 0 &&
      rowIndex < data.rows.length &&
      data.rows[rowIndex] &&
      colIndex >= 0 &&
      colIndex < data.rows[rowIndex].length
    ) {
      return data.rows[rowIndex][colIndex];
    } else {
      return "Element not found";
    }
  }
  const convertToArray = async () => {
    setUniqueArray(Array.from(new Set(data.rows.flat())));
  };
  const handleChange = async (name, checked, domain) => {
    const rtsp = "rtsp://admin:Cahh@12345@cahh49.smartddns.tv:37779/cam/realmonitor?channel=1&subtype=0";

    // Stop the current RTSP live stream if the name changes
    if (name !== rtspLink) {
      await stopRtspLive();
    }

    // Create a new RTSP live stream with the new name and RTSP link
    await createRtspLive({ rtsp_link: rtsp, domain: domain });

    // Set the new name and RTSP link
    setNameCamera(name);
    setRtspLink(rtsp);
    setStreamLoaded(false);
  };

  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  const generateGrid = () => {
    return (
      <>
        <Row>
          <Col
            span={span - span / size["column"]}
            style={{
              maxHeight: "100%",
              height: `calc(${ViewportHeight} - (${ViewportHeight} / ${size["column"]}))`,
              border: selectIndex.row === 0 && selectIndex.column === 0 ? "2px solid red" : "1px solid black",
            }}
            onClick={() => {
              SelectItem(0, 0), setOpen(true);
            }}
          >
            {getElementAt(0, 0) === null ? (
              ""
            ) : (
              <IframeCustom width={"100%"} height={"100%"} src={getElementAt(0, 0)} />
            )}
          </Col>
          <Col span={span / size["column"]}>
            {Array.from({ length: size["column"] - 1 }, (_, colIndex) => (
              <Row
                onClick={() => {
                  SelectItem(0, colIndex + 1), setOpen(true);
                }}
                style={{
                  maxHeight: "100%",
                  border:
                    selectIndex.row === 0 && selectIndex.column === colIndex + 1 ? "2px solid red" : "1px solid black",
                  height: `calc(${ViewportHeight} / ${size["column"]})`,
                }}
              >
                {getElementAt(0, colIndex + 1) === null ? (
                  ""
                ) : (
                  <IframeCustom width={"100%"} height={"100%"} src={getElementAt(0, colIndex + 1)} />
                )}
              </Row>
            ))}
          </Col>
        </Row>
        <Row style={{ height: `calc(${ViewportHeight} / ${size["column"]})` }}>
          {Array.from({ length: size["column"] }, (_, colIndex) => (
            <Col
              onClick={() => {
                SelectItem(1, colIndex), setOpen(true);
              }}
              span={span / size["column"]}
              style={{
                height: `calc(${ViewportHeight} / ${size["column"]})`,
                maxHeight: "100%",
                border: selectIndex.row === 1 && selectIndex.column === colIndex ? "2px solid red" : "1px solid black",
              }}
            >
              {getElementAt(1, colIndex) === null ? (
                ""
              ) : (
                <IframeCustom width={"100%"} height={"100%"} src={getElementAt(1, colIndex)} />
              )}
            </Col>
          ))}
        </Row>
      </>
    );
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
        <Row>
          <Space align="start">
            {layouts.map((key) => {
              return (
                <Button
                  className="mt-2"
                  size="small"
                  type="primary"
                  key={key["row"] + "x" + key["column"]}
                  onClick={() => changeView(key["row"], key["column"], key["special"])}
                >
                  <img src={key["icon"]} />
                </Button>
              );
            })}
            <Button className="mt-2" type="primary" size="small" onClick={showDrawer} icon={<MenuFoldOutlined />}>
              Danh sách camera
            </Button>
          </Space>
        </Row>
      </div>
      <Drawer
        visible={open}
        onClose={onClose}
        closable={true}
        size="small"
        bodyStyle={{ padding: 0 }}
        width={300}
        maskClosable={true}
      >
        <div style={{ padding: "16px", background: "#fff", borderBottom: "1px solid #f0f0f0" }}>
          <p style={{ fontSize: 18, marginBottom: 0, fontWeight: "bold", color: "#00199f" }}>Danh sách camera</p>
        </div>
        <Divider style={{ padding: 0, margin: 0 }} />
        <Menu multiple selectedKeys={uniqueArray} mode="inline" style={{ borderColor: "transparent" }}>
          {cameraData?.map((tag) => (
            <SubMenu key={tag.name} title={tag.name}>
              {tag?.children?.map((x) => (
                <SubMenu key={x.name} title={x.name}>
                  {x?.children?.map((y) => (
                    <Menu.Item
                      key={y.value}
                      onClick={() => handleChange(y.name, true, y.value)}
                      icon={uniqueArray.indexOf(y.value) > -1 ? <SyncOutlined spin /> : <CameraOutlined />}
                    >
                      {y.name}
                    </Menu.Item>
                  ))}
                </SubMenu>
              ))}
            </SubMenu>
          ))}
        </Menu>
      </Drawer>
      <Loading active={isLoading}>
        {size["special"] === true ? (
          <div>{generateGrid()}</div>
        ) : (
          Array.from({ length: size["row"] }, (_, rowIndex) => (
            <Row key={"row_" + rowIndex} style={rowStyle} gutter={[16, 16]}>
              {Array.from({ length: size["column"] }, (_, colIndex) => (
                <Col
                  key={"col_" + colIndex}
                  span={span / size["column"]}
                  style={{
                    maxHeight: "100%",
                    border:
                      selectIndex.row === rowIndex && selectIndex.column === colIndex
                        ? "2px solid red"
                        : "1px solid black",
                  }}
                  onClick={() => {
                    SelectItem(rowIndex, colIndex), setOpen(true);
                  }}
                >
                  {/* <IframeCustom width={"100%"} height={"100%"} src={getElementAt(rowIndex, colIndex)} /> */}
                  {/* {loading && nameCamera != null ? (
                    <div className="loading">
                      <LoadingOutlined style={{fontSize: '30px'}}/>
                    </div>
                  ) : (
                    <video id="video" style={{ width: "100%", height: "100%" }} autoPlay></video>
                  )} */}
                  <video id="video" style={{ width: "100%", height: "100%" }} autoPlay></video>
                </Col>
              ))}
            </Row>
          ))
        )}
      </Loading>
    </div>
  );
}

function mapStateToProps(store) {
  const permission = store.user.permissions?.camera;
  const { isLoading } = store.app;
  const { unitList } = store.unit;
  const { positionList } = store.position;
  const { myInfo } = store.user;
  return { permission, isLoading, unitList, positionList, myInfo };
}

const mapDispatchToProps = {
  ...unit.actions,
  ...position.actions,
  ...camera.actions,
};

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(LiveCam));
