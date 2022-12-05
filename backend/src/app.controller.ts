import { Body, Controller, Get, Post, Param, Query } from '@nestjs/common';
import { response } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get("fetch-sherrif")
  fetchSherrif(): any {
    return this.appService.fetchSherrif();
  }


  @Get("sheriff-details/:propertyId")
  sheriffDetails(@Param('propertyId') propertyId: string) {
    return this.appService.sheriffDetails(propertyId);
  }



}
