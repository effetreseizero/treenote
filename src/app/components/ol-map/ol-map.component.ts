//https://medium.com/runic-software/a-simple-guide-to-openlayers-in-angular-b10f6feb3df1


import {Component, NgZone, AfterViewInit, Output, Input, EventEmitter, ChangeDetectorRef } from '@angular/core';


import {Map,View, Feature} from "ol";
import {Tile,WebGLPoints,Layer, Vector as VectorLayer, Group} from "ol/layer";
import {Vector as VectorSource ,XYZ,OSM,BingMaps,Cluster} from "ol/source";
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
import { OlMapComponentSurvey } from '../ol-map-survey/ol-map-survey.component';
import { FormGroupName } from '@angular/forms';

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

  layersWSM: Group;
  layersWI: Group;

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

    var attributions =
  '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> ' +
  '<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>';

 
    var urlTemplate = 'http://services.arcgisonline.com/arcgis/rest/services/' + 'World_Street_Map/MapServer/tile/{z}/{y}/{x}';


    this.layersWSM = new Group({
      layers: [
          new Tile({
            source: new XYZ({
              attributions: 'Tiles © <a href="https://services.arcgisonline.com/ArcGIS/' + 'rest/services/World_Street_Map/MapServer">ArcGIS</a>',
              url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
              crossOrigin: "Anonymous",
            })
          })
        ]
    });
    
    this.layersWI = new Group({
      layers: [
          new Tile({
            source: new XYZ({
              attributions: 'Tiles © <a href="https://services.arcgisonline.com/ArcGIS/' + 'rest/services/World_Imagery/MapServer">ArcGIS</a>',
              url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
              crossOrigin: "Anonymous",
            })
          })
        ]
    });

    this.Map = new Map({
      
      layers: [
        this.layersWSM,
        this.layersWI
      ],
      target: document.getElementById('map'),
      view: this.view,
      controls: DefaultControls({ attribution: false }).extend([
        new ScaleLine({}),
      ]),
    });
    
  } 

  centerOn(longitude,latitude) {
    this.Map.getView().animate({zoom: 13, center: fromLonLat([longitude,latitude])});
    setTimeout(()=>{
      //https://forum.ionicframework.com/t/generating-a-openlayers-map-as-a-component/161373/4
      this.Map.updateSize();
    },500);
  }
  
  //https://stackoverflow.com/questions/27658280/layer-switching-in-openlayers-3
  setMapType(newType) {
    if(newType == 'WSM') {
        this.Map.setLayerGroup(this.layersWSM);
    } else if (newType == 'WI') {
        this.Map.setLayerGroup(this.layersWI);
    }
  }


}


