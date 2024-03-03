import React from 'react';
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow, Polygon,
  Polyline,
} from 'react-google-maps';
import { compose, withProps, withStateHandlers } from 'recompose';
import MarkerClusterer from 'react-google-maps/lib/components/addons/MarkerClusterer';
import { OUTSIDE, VIETNAM_BOUNDS } from './polygon';

const defaultMapOptions = {
  restriction: {
    latLngBounds: VIETNAM_BOUNDS,
  },
  streetViewControl: false,
  fullscreenControl: false,
  mapTypeControl: false,
  minZoom: 6,
  gestureHandling: 'greedy',
};
const MapWithMarkerClusterer = compose(
  withProps({
    googleMapURL: `https://maps.googleapis.com/maps/api/js?key=AIzaSyBc79YjDmyKtgnxZ6HBcgxZwZnpn4TBw_8&libraries=geometry,drawing,places&language=vi&region=VI`,
    loadingElement: (
      <div style={{
        height: `100%`,
        float: `left`,
        width: `100%`,
        backgroundColor: `#FFFFFF`,
        display: `flex`,
        flex: 1,
        justifyContent: `center`,
        alignItems: `center`,
      }}>
      </div>
    ),
    containerElement: (
      <div style={{ height: `100%`, float: `left`, width: `100%`, backgroundColor: `#FFFFFF` }}/>
    ),
    mapElement: <div style={{ height: `100%`, backgroundColor: `#FFFFFF` }}/>,
  }),
  withStateHandlers(() => ({
    isOpen: null,
  }), {
    onToggleOpen: ({ open }) => (value) => ({
      isOpen: value,
    }),
  }),
  withScriptjs,
  withGoogleMap,
)(props => (
  <GoogleMap defaultZoom={ props.defaultZoom ? props.defaultZoom : 4}
             defaultOptions={defaultMapOptions}
             defaultCenter={{ lat : props.lat ? parseFloat(props.lat):  16.05084,  lng: props.lng? parseFloat(props.lng) : 108.028368 }}
             onClick={props.handleClickedMap}>

    <MarkerClusterer gridSize={60} averageCenter enableRetinaIcons>
      <Marker noRedraw={true}
              position={{ lat: parseFloat(props.lat), lng: parseFloat(props.lng) }}
      >
      </Marker>

    </MarkerClusterer>
  </GoogleMap>
));

export default MapWithMarkerClusterer;