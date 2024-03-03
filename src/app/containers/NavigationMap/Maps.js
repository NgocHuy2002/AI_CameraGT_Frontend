import React from "react";
import L from "leaflet";
import { URL } from "@url";
import { t } from "i18next";
import { Button, Row, Col } from "antd";
import { Link } from "react-router-dom";
import { withTranslation } from "react-i18next";
import icon from "leaflet/dist/images/marker-icon.png";
import FullscreenControl from "react-leaflet-fullscreen";
import { Map, Marker, TileLayer, Popup, Polyline } from "react-leaflet";
import iconPosition from "../../../assets/icons/icon-position.svg";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import iconRetina from "leaflet/dist/images/marker-icon-2x.png";
import { compose, withProps, withStateHandlers } from "recompose";
import "leaflet/dist/leaflet.css";
import "react-leaflet-fullscreen/dist/styles.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "./NavigationMap.scss";

const MapLeaflet = compose(
  withProps(),
  withStateHandlers(() => ({
    showInfoDrawDistance: true,
  }))
)((props) => {
  const { location } = props;
  const [zoom, setZoom] = React.useState(6);
  const [center, setCenter] = React.useState({ lat: 16.05084, lng: 108.028368 });
  const [mapLayer, setMapLayer] = React.useState("SATELLITE");
  const [routing, setRouting] = React.useState(null);
  const [pointsOld, setPointsOld] = React.useState(null);
  const mapRef = React.useRef(null);

  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: iconRetina,
    iconUrl: icon,
    shadowUrl: iconShadow,
  });

  function renderHybirdMap() {
    return (
      <>
        <TileLayer
          url={"https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <TileLayer
          url={
            "https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
          }
        />
      </>
    );
  }

  function renderBasicMap() {
    return (
      <TileLayer
        url={"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
    );
  }

  function handleDanDuong(item) {
    window.open(`http://maps.google.com/maps?q=${item?.latitude},${item?.longitude}`);
  }

  const createMarker = (i, wp, nWps) => {
    const customMarkerIcon = new L.Icon({
      iconUrl: iconPosition,
      iconSize: [32, 32],
      iconAnchor: [16, 24],
      popupAnchor: [0, -32],
    });
    const marker = L.marker(wp.latLng, { icon: customMarkerIcon, draggable: false })
      .bindPopup(
        `<div>
          <div>
            <b>
              Tên camera: 
            </b>
            <span>${location?.marker[i]?.nameCamera || ""}</span>
          </div>
          <div>
            <b>
            Đơn vị: 
            </b>
            <span>${location?.marker[i]?.unit || ""}</span>
          </div>
          <div>
            <b>
            Vị trí: 
            </b>
            <span>${location?.marker[i]?.position || ""}</span>
          </div>
        </div>`
      )
      .addTo(mapRef.current.leafletElement);
    return marker;
  };

  React.useEffect(() => {
    if (routing && pointsOld) {
      routing.spliceWaypoints(0, pointsOld.length);
    }

    // Đặt các điểm trên bản đồ
    const points = location?.marker || [];
    if (points.length > 0) {
      pointsOld?.map((marker) => {
        mapRef.current.leafletElement.removeLayer(marker);
      });

      const avgLatitude = points.reduce((sum, point) => sum + point.latitude, 0) / points.length;
      const avgLongitude = points.reduce((sum, point) => sum + point.longitude, 0) / points.length;

      // Tạo một đối tượng Routing Control và thêm vào bản đồ
      const routing = L.Routing.control({
        waypoints: points.map((point) => L.latLng(point.latitude, point.longitude)),
        routeWhileDragging: true,
        addWaypoints: false,
        removeWaypoints: false,
        show: false,
        routeControl: {
          alternativeRoutes: true,
        },
        control: {
          show: false,
        },
        createMarker: createMarker,
      }).addTo(mapRef.current.leafletElement);
      setRouting(routing);
      setPointsOld(points);

      mapRef.current.leafletElement.on("routeselected", (event) => {
        const selectedRoute = event.route;
        L.popup()
          .setLatLng(selectedRoute.coordinates[0])
          .setContent(`Selected Route: ${selectedRoute.name}`)
          .openOn(mapRef.current.leafletElement);
      });

      setCenter({ lat: avgLatitude, lng: avgLongitude });
    }
  }, [location]);

  return (
    <div>
      <Map
        ref={mapRef}
        style={{ height: "calc(100vh - 160px)" }}
        center={center}
        zoom={zoom}
        // maxZoom={17}
        scrollWheelZoom={true}
      >
        {mapLayer === "TERRAIN" ? renderBasicMap() : renderHybirdMap()}
        <FullscreenControl position="topright" />
        <div className="leaflet-bar leaflet-control btn-change-map" style={{ top: "8px", left: "8px" }}>
          <Button className={mapLayer === "TERRAIN" ? "active" : ""} onClick={() => setMapLayer("TERRAIN")}>
            {t("BAN_DO")}
          </Button>
          <Button className={mapLayer === "SATELLITE" ? "active" : ""} onClick={() => setMapLayer("SATELLITE")}>
            {t("VE_TINH")}
          </Button>
        </div>
      </Map>
    </div>
  );
});

export default withTranslation()(MapLeaflet);
