import { HttpClient } from '@angular/common/http';
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';


declare const $: any;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit, AfterViewInit{
    private _backendUrl: string | undefined;
    @ViewChild('dTable', {static: false}) dataTable: any;
    pubVar: string | undefined;
    errorMsg: string | undefined;
    listings: any | undefined;


    constructor(private http: HttpClient) {
        this._backendUrl = "http://localhost:3000";
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

        $(this.dataTable.nativeElement).DataTable({
            responsive: true,
            paging: true,
            fixedHeader: false,
            searching: true,
            bLengthChange: false,
            bAutoWidth: false,
            info: false,
            ajax: {
                    type: 'GET',
                    url: `${this._backendUrl}/fetch-sherrif`,
                    dataSrc: ''
                },
                columns: [
                    {
                        data: 'propertyId',
                        render: function (data:any, type:any, row:any, meta:any) {
                            return `<a href='https://sheriffsaleviewer.polkcountyiowa.gov/Home/Detail/${data}' target='_blank'>${data}</a>`
                        }
                    },
                    {data:"referenceNumber"},
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
                    // {data:"plaintiff"},
                    // {data:"defendant"},
                    {data:"propertyAddress"},
                    // {data:"eventTypeId"},
                    {
                        data:"isDelayed",
                        render: function (data:any) {
                            if(data){
                                return 'Yes';
                            }
                            return 'No';
                        }
                    }
            ]
        });
    }



    ngOnInit(): void{
        //this.fetchProperties();
    }


    // Google Map Declarations
    display: any;
    @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow | undefined;
    center: google.maps.LatLngLiteral = {
        lat: 41.61,
        lng: -93.6242
    };
    markerPositions: google.maps.LatLngLiteral[] = [];
    zoom = 10;
    addMarker(lat:number, lon:number) {
        var myLatlng = new google.maps.LatLng(lat,lon);
        this.markerPositions.push(myLatlng.toJSON())
    }
    openInfoWindow(marker: MapMarker) {
        if (this.infoWindow != undefined) this.infoWindow.open(marker);
    }


    fetchProperties(){
        this.http.get<any>(`${this._backendUrl}/fetch-sherrif`).subscribe((ans) => {
            this.listings = ans;
            //$('#dTable').DataTable().ajax.reload(null, false);
        });
    }

}
