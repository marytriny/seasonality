// Import packages
import { useRef } from 'react';
import { EditControl } from 'react-leaflet-draw';
import { MapContainer, TileLayer, FeatureGroup } from 'react-leaflet';

// Map settings
const MAP_PROPS = {
  center: [0, 0],
  zoom: 2,
  minZoom: 2,
  maxZoom: 20 // Set max zoom as required by the map's tile layer
};

const Map = ({ setLocation }) => {
  const featureGroupRef = useRef(null);

  // Limit points to 1 - if another point exists, clear it before drawing the next.
  const onDrawStart = () => featureGroupRef.current?.clearLayers();

  // Save first (and only) layer
  const onEdited = ({ layers }) => saveLocation({ layer: Object.values(layers._layers)[0] });

  // Grab the layer's GeoJSON and save the points location
  // const saveLocation = ({ layer }) => console.log(layer.toGeoJSON().geometry.coordinates);
  const saveLocation = ({ layer }) => setLocation(layer.toGeoJSON().geometry.coordinates);

  return (
    <div style={{ margin: '10px' }}>
      <MapContainer style={{ width: '100%', height: '250px' }} {...MAP_PROPS}>
        <FeatureGroup ref={featureGroupRef}>
          <EditControl            
            position='topright'
            draw={{
              // disable all except circlemarker
              polygon: false,
              rectangle: false,
              polyline: false,
              circle: false,
              marker: false,
              circlemarker: true
            }}
            onDrawStart={onDrawStart}
            onEdited={onEdited}
            onCreated={saveLocation}
          />
        </FeatureGroup>;
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url='https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png'
          subdomains='abcd'
          maxZoom={MAP_PROPS.maxZoom}
        />
      </MapContainer>
    </div>
  )
}

export default Map;
