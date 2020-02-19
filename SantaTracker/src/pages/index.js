import React from 'react';
import Helmet from 'react-helmet';
import L from 'leaflet';



import Layout from 'components/Layout';
import Container from 'components/Container';
import Map from 'components/Map';


const LOCATION = {
  lat: 51.5074,
  lng: 0.1278
};
const CENTER = [LOCATION.lat, LOCATION.lng];
const DEFAULT_ZOOM = 2;


const IndexPage = () => {

  /**
   * mapEffect
   * @description Fires a callback once the page renders
   * @example Here this is and example of being used to zoom in and set a popup on load
   */

  async function mapEffect({ leafletElement } = {}) {
   if (!leafletElement) return;
   let route, routeJson;
   try {
     route = await fetch ('https://firebasestorage.googleapis.com/v0/b/santa-tracker-firebase.appspot.com/o/route%2Fsanta_en.json?alt=media&2018b');
     routeJson = await route.json();
   } catch(e) {
     console.log('Failed to find Santa!: ${e}');
   }
   console.log('routeJson', routeJson);
   const {destinations = []} = routeJson || {};
    const destinationVisited = destinations.filter(({arrival}) => arrival <Date.now());
    const destinationsWithPresents = destinationVisited.filter(({presentsDelivered}) => presentsDelivered > 0);

    if ( destinationsWithPresents.length === 0 ) {
      // Create a Leaflet Market instance using Santa's LatLng location
      const center = new L.LatLng( 0, 0 );
      const noSanta = L.marker( center, {
        icon: L.divIcon({
          className: 'icon',
          html: `<div class="icon-santa">🎅</div>`,
          iconSize: 50
        })
      });
      noSanta.addTo( leafletElement );
      noSanta.bindPopup( `Santa's still at the North Pole!` );
      noSanta.openPopup();
      return;
    }
   const lastKnownDestination = destinationsWithPresents[destinationsWithPresents.length - 1]
   const santaLocation = new L.LatLng( lastKnownDestination.location.lat, lastKnownDestination.location.lng);

   const santaMarker = L.marker(santaLocation, {
     icon: L.divIcon({
       className: 'icon',
       html: `<div class="icon-santa">🎅</div>`,
       iconSize: 50
     })
   });

   santaMarker.addTo(leafletElement);
  }

  const mapSettings = {
    center: CENTER,
    defaultBaseMap: 'OpenStreetMap',
    zoom: DEFAULT_ZOOM,
    mapEffect
  };

  return (
    <Layout pageName="home">
      <Helmet>
        <title>Home Page</title>
      </Helmet>

      <Map {...mapSettings}>
        
      </Map>

      <Container type="content" className="text-center home-start">
       <h1>Merry Christmas!</h1>
      </Container>
    </Layout>
  );
};

export default IndexPage;
