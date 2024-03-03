import React from "react";
import { t } from "i18next";
import MapLeaflet from "./Maps";
import { connect } from "react-redux";
import { CONSTANTS, VEHICLE_TYPE } from "@constants";
import { withTranslation } from "react-i18next";
import CustomSkeleton from "@components/CustomSkeleton";
import { getAllNavigationMap } from "../../services/Camera";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Col, Row, Button, Select, Input, DatePicker, Table, Pagination } from "antd";

import './NavigationMap.scss';
import { formatDateTime } from "../../common/functionCommons";

function NavigationMap({ myInfo, isLoading, roleList, ...props }) {
  const { RangePicker } = DatePicker;

  const [page, setPage] = React.useState(1);
  const [hide, setHide] = React.useState(false);
  const [location, setLocation] = React.useState([]);
  const [time, setTime] = React.useState(null);
  const [vehicleType, setVehicleType] = React.useState(null);
  const [licensePlates, setLicensePlates] = React.useState('');
  const [screenHeight, setScreenHeight] = React.useState(window.innerHeight);

  React.useEffect(() => {
    // Hàm xử lý sự kiện resize
    const handleResize = () => {
      setScreenHeight(window.innerHeight);
    };

    // Thêm sự kiện resize khi component được mount
    window.addEventListener("resize", handleResize);

    // Xóa sự kiện resize khi component unmount để tránh memory leaks
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const [dataSource, setDataSource] = React.useState({
    docs: [],
    pageSize: 10,
    totalDocs: 0,
  });

  React.useEffect(() => {
    getAllDate();
  }, []);

  async function getAllDate() {
    const dataQuery = {
      page: 1,
      limit: 0
    }

    if(licensePlates){
      dataQuery['licensePlates'] = licensePlates;
    }
    if(time){
      dataQuery['time'] = time;
    }
    if(vehicleType){
      dataQuery['vehicleType'] = vehicleType;
    }

    if(myInfo.unitId && !myInfo.isSystemAdmin){
      dataQuery['unitId'] = myInfo.unitId._id;
    }

    const apiResponse = await getAllNavigationMap(dataQuery);
    setDataSource({
      docs: apiResponse.docs,
      totalDocs: apiResponse.totalPages,
    })
  }

  const columns = [
    {
      title: "STT",
      width: 40,
      align: "center",
      fixed: 'left',
      render: (text, record, index) => {
        return (page - 1)*10 + (index + 1)  ;
      },
    },
    {
      title: "Thời gian",
      dataIndex: "created_at",
      width: 95,
      fixed: 'left',
      align: "center",
      render: value => {
        return <div style={{ fontWeight: "bolder" }}>
          {formatDateTime(value)}
        </div>
      }
    },
    // {
    //   title: "Camera",
    //   dataIndex: "unit",
    //   width: 100,
    // },
    {
      title: "Biển số xe",
      dataIndex: "license_plates",
      align: "center",
      width: 100,
    },
    {
      title: "Loại xe",
      dataIndex: "vehicle_type",
      render: value => VEHICLE_TYPE[value]?.label || '',
      width: 80,
    },
  ];

  const filterData = (values) => {
    getAllDate();
  }

  return (
    <Row>
      <Col flex={"auto"}>
        <MapLeaflet location={location} />
      </Col>
      <Col flex={hide ? "30px" : "350px"}>
        <div style={{ marginLeft: 10 }}>
          <Row>
            {/* <Col flex="30px">
              {hide ? (
                <Button type="dashed" size="small" onClick={() => setHide(false)}>
                  <LeftOutlined />
                </Button>
              ) : (
                <Button type="dashed" size="small" onClick={() => setHide(true)}>
                  <RightOutlined />
                </Button>
              )}
            </Col> */}
            {!hide && (
              <Col flex="auto" style={{ textAlign: "center", fontWeight: "bolder" }}>
                Tìm kiếm
              </Col>
            )}
          </Row>
          {!hide && (
            <div>
              <div style={{ marginTop: 10 }}>
                <CustomSkeleton size="default" label={t("VEHICLE_TYPE")} layoutCol={{ xs: 24 }} labelCol={{ xs: 8 }}>
                  <Select
                    defaultValue="ALL"
                    style={{ width: "100%" }}
                    onChange={(e) => setVehicleType(e)}
                    options={Object.values(VEHICLE_TYPE)}
                  />
                </CustomSkeleton>
              </div>
              <div style={{ marginTop: 10 }}>
                <CustomSkeleton size="default" label={t("LICENSE_PLATES")} layoutCol={{ xs: 24 }} labelCol={{ xs: 8 }}>
                  <Input onChange={(e) => setLicensePlates(e.target.value)} />
                </CustomSkeleton>
              </div>
              <div style={{ marginTop: 10 }}>
                <CustomSkeleton size="default" label={t("TIME")} layoutCol={{ xs: 24 }} labelCol={{ xs: 8 }}>
                  <RangePicker onChange={(e) => setTime(e)}/>
                </CustomSkeleton>
              </div>

              <div style={{ marginTop: 10 }}>
                <Button type="primary" size="small" block onClick={filterData}>
                  Lọc
                </Button>
              </div>

              <div style={{ marginTop: 10, width: 350 }}>
                <CustomSkeleton size="default" label={t("LIST_OF_CAR")} layoutCol={{ xs: 24 }} labelCol={{ xs: 24 }}>
                  <Table
                    className="table-list-of-car"
                    dataSource={dataSource.docs}
                    columns={columns}
                    pagination={false}
                    size="small"
                    onRow={(record, rowIndex) => {
                      return { onClick: (event) => setLocation(record) };
                    }}
                    scroll={
                      {  
                        x: 350,
                        y: screenHeight - 397 - 65 + 40,
                      }
                    }
                  />
                  {/* <div style={{ marginTop: 10, textAlign: 'center' }}>
                    {console.log(dataSource, "dataSource")}
                    <Pagination
                      size="small"
                      total={dataSource.totalDocs}
                      pageSize={10}
                      current={page}
                      showLessItems={true}
                      showSizeChanger={false}
                      showQuickJumper={false}
                      onChange={(page) => setPage(page)}
                    />
                  </div> */}
                </CustomSkeleton>
              </div>
            </div>
          )}
        </div>
      </Col>
    </Row>
  );
}

function mapStateToProps(store) {
  const { myInfo } = store.user;
  const { isLoading } = store.app;
  return { isLoading, myInfo };
}

export default withTranslation()(connect(mapStateToProps)(NavigationMap));
