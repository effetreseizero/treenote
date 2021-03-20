//https://medium.com/runic-software/a-simple-guide-to-openlayers-in-angular-b10f6feb3df1


import {Component, NgZone, AfterViewInit, Output, Input, EventEmitter, ChangeDetectorRef } from '@angular/core';


import {Map,View, Feature} from "ol";
import {Tile,WebGLPoints,Layer, Vector as VectorLayer} from "ol/layer";
import {Vector as VectorSource ,OSM,Cluster} from "ol/source";
import {GeoJSON} from "ol/format";
import { fromLonLat } from "ol/proj";


// https://medium.com/javascript-in-plain-english/how-to-improve-responsiveness-when-displaying-large-data-sets-in-openlayers-maps-dd6d0ad9abdf
import {Point} from "ol/geom";

import {Coordinate} from 'ol/coordinate';
import { ScaleLine, defaults as DefaultControls} from 'ol/control';
import * as proj4 from 'proj4';
import Projection from 'ol/proj/Projection';
import {register}  from 'ol/proj/proj4';
import {get as GetProjection} from 'ol/proj'
import {Extent} from 'ol/extent';

import {Style,Icon,Fill,Circle,Stroke, Text as TextStyle, RegularShape} from 'ol/style';
import {createEmpty, extend, getHeight, getWidth} from 'ol/extent';

@Component({
  selector: 'app-ol-map',
  templateUrl: './ol-map.component.html',
  styleUrls: ['./ol-map.component.scss'],
})

export class OlMapComponent implements AfterViewInit {

  @Input() center: Coordinate;
  @Input() zoom: number;

  view: View;
  //projection: Projection;
  extent: Extent = [-20026376.39, -20048966.10,20026376.39, 20048966.10];

  Map: Map;
  gpsPositionFeature: Feature;
  surveysFeatureSource: VectorSource;

  @Output() mapReady = new EventEmitter<Map>();

  constructor(private zone: NgZone, private cd: ChangeDetectorRef) {
   }


  ngAfterViewInit():void {
    if (! this.Map) {
      //https://medium.com/runic-software/a-simple-guide-to-openlayers-in-angular-b10f6feb3df1
      this.zone.runOutsideAngular(() => this.initMap())
    } 
    setTimeout(()=>{
      //https://forum.ionicframework.com/t/generating-a-openlayers-map-as-a-component/161373/4
      this.Map.updateSize();
      this.mapReady.emit(this.Map);
    },500);
  }

  


  private initMap(): void{
    //proj4.defs("EPSG:3857","+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs");
    //register(proj4)
    //this.projection = GetProjection('EPSG:3857');
    //this.projection.setExtent(this.extent);

    this.view = new View({
      center: fromLonLat(this.center),
      zoom: this.zoom,
      //projection: this.projection,
    });

    this.gpsPositionFeature = new Feature();
    let gpsPositionLayer = new VectorLayer({
      source: new VectorSource({
        features: [this.gpsPositionFeature]
      })
    });

    
    /*var iconStyle = new Style({
      image: new Icon({ 
        anchor: [0.5, 46],
        src: 'https://webgis.provincia.belluno.it/assets/js/OpenLayers-2.13/img/marker-green.png'
        // src: '../../assets/img/marker/marker-blue.png'
      })
    });
    this.surveyPositionFeature.setStyle(iconStyle);*/

    

    this.Map = new Map({
      layers: [
        new Tile({
          source: new OSM({})
        }),
        gpsPositionLayer
      ],
      target: document.getElementById('map'),
      view: this.view,
      controls: DefaultControls().extend([
        new ScaleLine({}),
      ]),
    });

    this.Map.on('singleclick', event => {
      // get the feature you clicked
      const feature = this.Map.forEachFeatureAtPixel(event.pixel, (feature) => {
       return feature
      })
      if(feature instanceof Feature){
        // Fit the feature geometry or extent based on the given map
        let features = feature.getProperties().features;
        var extent = features[0].getGeometry().getExtent().slice(0);
        features.forEach(function(feature){ extend(extent,feature.getGeometry().getExtent())});

        this.Map.getView().fit(extent);
        this.Map.getView().setZoom(this.Map.getView().getZoom()-1);
        // map.getView().fit(feature.getGeometry().getExtent())

        
      }
     })
  }


  setGPSPosition(longitude,latitude) {
    
    /*
    this.Map.removeLayer(this.gpsPositionLayer);
    let gpsPoint = new Point([coords.longitude, coords.latitude]).transform('EPSG:4326', this.Map.getView().getProjection());
    let accuracyFeature = new Feature();
    accuracyFeature.setGeometry(gpsPoint);
    
    let positionFeature = new Feature();
    positionFeature.setStyle(new Style({
      image: new Circle({
        radius: 4,
        fill: new Fill({
          color: '#3399CC'
        }),
        stroke: new Stroke({
          color: '#fff',
          width: 1
        })
      })
    }));
    
    positionFeature.setGeometry(gpsPoint);
    
    this.gpsPositionLayer = new VectorLayer({
      source: new Vector({
        features: [accuracyFeature, positionFeature]
      })
    });
    */
    //this.Map.addLayer(vectorSource);
    //this.Map.addLayer(this.gpsPositionLayer);

    this.gpsPositionFeature.setGeometry(longitude&&latitude ? new Point(fromLonLat([longitude, latitude])) : null);
   
    setTimeout(()=>{
      //https://forum.ionicframework.com/t/generating-a-openlayers-map-as-a-component/161373/4
      this.Map.updateSize();
    },500);
  };  

  centerOn(longitude,latitude) {
    this.Map.getView().animate({zoom: 13, center: fromLonLat([longitude,latitude])});
    setTimeout(()=>{
      //https://forum.ionicframework.com/t/generating-a-openlayers-map-as-a-component/161373/4
      this.Map.updateSize();
    },500);
  }
  

}


