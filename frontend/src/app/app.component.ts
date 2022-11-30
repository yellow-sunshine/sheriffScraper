import { HttpClient } from '@angular/common/http';
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
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
                {data:"salesDate"},
                /*{data:"plaintiff"},
                {data:"defendant"},*/
                {data:"propertyAddress"},
                {data:"eventTypeId"},
                {data:"isDelayed"}
            ]
        });
    }

    ngOnInit(): void{
        //this.fetchProperties();
    }

    fetchProperties(){
        this.http.get<any>(`${this._backendUrl}/fetch-sherrif`).subscribe((ans) => {
            this.listings = ans;
            //$('#dTable').DataTable().ajax.reload(null, false);
        });
    }

}
