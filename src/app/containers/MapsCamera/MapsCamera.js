import React, { useState, useEffect, useRef } from "react";
import { Form, Row } from "antd";
import moment from "moment";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { cloneObj } from "@app/common/functionCommons";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import { compose, withProps, withStateHandlers } from 'recompose';
import { getAllMarkerMapsCamera } from "../../services/MapsCamera";
import MapLeaflet from "./Maps";

function MapsCamera({ myInfo, isLoading, roleList, ...props }){
  const [marker, setMarker] = useState([]);

  useEffect(() => {
    getAllDate();
  }, []);

  async function getAllDate() {
    let unit = '';
    if(!myInfo.isSystemAdmin && myInfo.unitId){
      unit = myInfo.unitId._id
    }
    const data = await getAllMarkerMapsCamera({ unit: unit });
    if (data && data.length > 0) {
      setMarker(data);
    }
  }

  return (
    <div>
      <MapLeaflet marker={marker}/>
    </div>
  );
};

function mapStateToProps(store) {
  const { myInfo } = store.user;
  const { isLoading } = store.app;
  return { isLoading, myInfo };
}

export default withTranslation()(connect(mapStateToProps)(MapsCamera));
