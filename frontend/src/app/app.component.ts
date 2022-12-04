import { HttpClient } from '@angular/common/http';
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';
import { GeocoderResponse } from './models/geocoder-response.model';
import { GeocodingService } from './services/geocoding.service';

declare const $: any;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit, AfterViewInit{
    @ViewChild('dTable', {static: false}) dataTable: any;
    listings: object = {};

    // Google Map Declarations
    display: any;
    @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow | undefined;
    center: google.maps.LatLngLiteral = {
        lat: 41.64,
        lng: -93.6242
    };
    options: google.maps.MapOptions = {
        mapTypeId: 'terrain',
        // zoomControl: false,
        // scrollwheel: false,
        // disableDoubleClickZoom: true,
        maxZoom: 15,
        minZoom: 8,
    };
    markerPositions: google.maps.LatLngLiteral[] = [];
    markerOptions: google.maps.MarkerOptions = {draggable: false};
    zoom = 11;
    geocoderWorking = false;
    geolocationWorking = false;
    address: string | undefined;
    formattedAddress?: string | null = null;
    locationCoords?: google.maps.LatLng | null = null;
    static listingsData: string[] = [];
    loaded: number = 1;

    constructor(private http: HttpClient, private geocodingService: GeocodingService) {

    }

    ngOnInit(): void{

    }

    ngAfterViewChecked(): void{
        if(this.loaded < 2){
            this.fetchProperties();
        }
    }

    ngAfterViewInit(): void{
        function nth(d: number) {
            if (d > 3 && d < 21) return 'th'
            switch (d % 10) {
                case 1:
                    return 'st';
                case 2:
                    return 'nd';
                case 3:
                    return 'rd';
                default:
                    return 'th';
            }
        }
        
        $('#dTable').DataTable({
            responsive: true,
            paging: true,
            fixedHeader: false,
            searching: true,
            bLengthChange: false,
            bAutoWidth: false,
            info: false,
            ajax:{
                    type: 'GET',
                    url: `http://localhost:3000/fetch-sherrif`,
                    dataSrc: ''
                },
            drawCallback: function (responseData: any) { 
                if(responseData.json){
                    for (var key in responseData.json) {
                        // const data = {
                        //     "propertyId": responseData.json[key]['propertyId'],
                        //     "referenceNumber": responseData.json[key]['referenceNumber'],
                        //     "salesDate": responseData.json[key]['salesDate'],
                        //     "propertyAddress": responseData.json[key]['propertyAddress'],
                        //     "isDelayed": responseData.json[key]['isDelayed']   ,
                        //     "lng": "",
                        //     "lat": ""                   
                        // }
                        AppComponent.listingsData.push(
                            responseData.json[key]['propertyAddress']
                        );
                    } 
                }
            },
            columns:[
                {
                    data: 'propertyId',
                    render: function (data:any, type:any, row:any, meta:any) {
                        return `<a href='https://sheriffsaleviewer.polkcountyiowa.gov/Home/Detail/${data}' target='_blank'>${data}</a>`
                    }
                },
                {
                    data:"referenceNumber"
                },
                {
                    data:"salesDate",
                    render: function (data:any, type:any, row:any, meta:any) {
                        // 2022-12-13T00:00:00	
                        const [year, month, daytime] = data.split('-');
                        const [day, time] = daytime.split('T');
                        const monthAbr: string[] = ["Invalid", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                        return monthAbr[month.replace(/^0+/, '')]+' '+day.replace(/^0+/, '')+nth(day);
                    }
                },
                {
                    data:"propertyAddress"
                },
                {
                    data:"isDelayed",
                    render: function (data:any) {
                        if(data){
                            return 'Yes';
                        }
                        return 'No';
                    }
                }
            ],
            fnInitComplete: function(oSettings: any, json: any) {
                
            }
        });
    }


    addMarker(lat:number, lon:number) {
        var myLatlng = new google.maps.LatLng(lat,lon).toJSON();
        this.markerPositions.push(myLatlng)
    }

    openInfoWindow(marker: MapMarker) {
        if (this.infoWindow != undefined){
            this.infoWindow.open(marker)
            console.log(marker);
        };
    }
    
    fetchProperties(){
        if(AppComponent.listingsData.length > 0){
            console.log(AppComponent.listingsData.length);
            for (var key in AppComponent.listingsData) {
                this.findAddress(AppComponent.listingsData[key]);
            }
            this.loaded = 10;
        }
    }

    findAddress(address: string) {
        console.log(address);
        if(!address || address.length === 0) {
            console.log('Address was not passed');
            return;
        }
        this.geocoderWorking = true;
        this.geocodingService.getLocation(address).subscribe( (response: GeocoderResponse) => {
            if(response.status === 'OK' && response.results?.length) {
                const location = response.results[0];
                const loc: any = location.geometry.location;
                this.locationCoords = new google.maps.LatLng(loc.lat, loc.lng);
                this.addMarker(loc.lat, loc.lng);
                this.address = location.formatted_address;
                this.formattedAddress = location.formatted_address;
            }else{
                console.log(response.error_message, response.status);
                console.log('im inside else and response is:' + response.status);
            }
        }).add(() => {
            this.geocoderWorking = false;
        });
    }

}
