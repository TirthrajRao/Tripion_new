import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HomePage } from './home.page';
import { ExploreDealsComponent } from '../explore-deals/explore-deals.component';
import { PaymentComponent } from '../payment/payment.component';
import { AllPlanComponent } from '../trip-plans/all-plan/all-plan.component';
import { PlanOptionComponent } from '../trip-plans/plan-option/plan-option.component';
import { HomePageComponent } from '../home-page/home-page.component';
import { PlanOptionDetailComponent } from '../trip-plans/plan-option-detail/plan-option-detail.component';
import { DocumentComponent } from '../document/document.component';
import { ProfileComponent } from '../profile/profile.component';
import { BenefitsComponent } from '../benefits/benefits.component';
import { SafeToTravelComponent } from '../Safe-to-travel/safe-to-travel/safe-to-travel.component';
import { SafeTravelComponent } from '../Safe-to-travel/safe-travel/safe-travel.component';
import { SafeTravelDetailComponent } from '../Safe-to-travel/safe-travel-detail/safe-travel-detail.component';
import { BriefcaseComponent } from '../briefcase/briefcase.component';
import { FolderDetailComponent } from '../folder-data/folder-detail/folder-detail.component';
import { OtherDocsComponent } from '../other-docs/other-docs.component';
import { PassportsComponent } from '../passport/passports/passports.component';
import { PicturesComponent } from '../folder-data/pictures/pictures.component';
import { UserPassportDetailComponent } from '../passport/user-passport-detail/user-passport-detail.component';
import { VisaDetailComponent } from '../visa-detail/visa-detail.component';
import { EditUserPassportDetailComponent } from '../passport/edit-user-passport-detail/edit-user-passport-detail.component';
import { FrequentFlyerComponent } from '../frequent-flyer/frequent-flyer/frequent-flyer.component';
import { FrequentFlyerDetailComponent } from '../frequent-flyer/frequent-flyer-detail/frequent-flyer-detail.component';
import { ServiceInquiryComponent } from '../service-inquiry/service-inquiry.component';
import { VisaInquiryComponent } from '../general-inquiry/visa-inquiry/visa-inquiry.component';
import { GeneralDetailComponent } from '../general-inquiry/general-detail/general-detail.component';
import { PassportInquiryComponent } from '../general-inquiry/passport-inquiry/passport-inquiry.component';
import { AirTicketsInquiryComponent } from '../general-inquiry/air-tickets-inquiry/air-tickets-inquiry.component';
import { AccomodationInquiryComponent } from '../trip-inquiry/accomodation-inquiry/accomodation-inquiry.component';
import { ToursInquiryComponent } from '../trip-inquiry/tours-inquiry/tours-inquiry.component';
import { TransferInquiryComponent } from '../trip-inquiry/transfer-inquiry/transfer-inquiry.component';
import { OtherDetailsInquiryComponent } from '../trip-inquiry/other-details-inquiry/other-details-inquiry.component';
import { InformationPackComponent } from '../trip-inquiry/information-pack/information-pack.component';
import { AmendmentsComponent } from '../amendments/amendments.component';
import { PremiumAccountPaymentComponent } from '../premium-account-payment/premium-account-payment.component'
import { TripPlaningComponent } from '../timeline/trip-planing/trip-planing.component';
import { TripPlaningDetailComponent } from '../timeline/trip-planing-detail/trip-planing-detail.component';
import { PastTripsComponent } from '../past-trips/past-trips.component';
import { NotificationComponent } from '../notification/notification.component';
import { UploadDocumentComponent } from '../upload-document/upload-document.component';
import { DocumentReqDocumentComponent } from '../document-req-document/document-req-document.component';
import { QuotationsComponent } from '../quotations/quotations.component';
import { FolderImagesComponent } from '../folder-data/folder-images/folder-images.component';
import { HeaderComponent } from '../header/header.component';
import { ImageModalComponent } from '../image-modal/image-modal.component';
import { DestinationRequestComponent } from '../destination-finder/destination-request/destination-request.component';
import { OccasionVacationComponent } from '../destination-finder/occasion-vacation/occasion-vacation.component';
import { TravellingZonesComponent } from '../destination-finder/travelling-zones/travelling-zones.component';
import { DestinationDetailComponent } from '../destination-finder/destination-detail/destination-detail.component';
import { DestinationOtherDetailComponent } from '../destination-finder/destination-other-detail/destination-other-detail.component';
import { ClimateComponent } from '../destination-finder/climate/climate.component';
import { PopularityOfDestinationComponent } from '../destination-finder/popularity-of-destination/popularity-of-destination.component';

import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { DatePipe } from '@angular/common';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { PreviewAnyFile } from '@ionic-native/preview-any-file/ngx';
import { Network } from '@ionic-native/network/ngx';
import { GoogleMaps } from '@ionic-native/google-maps';
import { SelectLocationComponent } from '../select-location/select-location.component';
import { AgmCoreModule } from '@agm/core';
import { Camera } from '@ionic-native/camera/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { DocumentViewer, DocumentViewerOptions } from '@ionic-native/document-viewer/ngx';
import { LongPressModule } from 'ionic-long-press';
import { Base64 } from '@ionic-native/base64/ngx';
import * as Hammer from 'hammerjs';
import { HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { InnerFolderComponent } from '../folder-data/inner-folder/inner-folder.component';
import { SelectCityComponent } from '../select-city/select-city.component';

import { MediaCapture } from '@ionic-native/media-capture/ngx';
import { Media } from '@ionic-native/media/ngx';
import { SafePipe } from '.././safe.pipe';
import { NgxDocViewerModule } from 'ngx-doc-viewer';

export class IonicGestureConfig extends HammerGestureConfig {
  buildHammer(element: HTMLElement) {
    const mc = new (<any>window).Hammer(element);

    for (const eventName in this.overrides) {
      if (eventName) {
        mc.get(eventName).set(this.overrides[eventName]);
      }
    }

    return mc;
  }
}


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    LongPressModule,
    NgxDocViewerModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage,
        children: [
          {
            path: '',
            redirectTo: 'home-page',
            pathMatch: 'full'
          },
          {
            path: 'home-page',
            component: HomePageComponent
          },
          {
            path: 'plan-option/:tripId',
            component: PlanOptionComponent
          },
          {
            path: 'document',
            component: DocumentComponent
          },
          {
            path: 'profile',
            component: ProfileComponent
          },
          {
            path: 'benefits',
            component: BenefitsComponent
          },
          {
            path: 'safe-travel',
            component: SafeTravelComponent
          },
          {
            path: 'safe-to-travel',
            component: SafeToTravelComponent
          },
          {
            path: 'safe-travel-detail',
            component: SafeTravelDetailComponent
          },
          {
            path: 'briefcase',
            component: BriefcaseComponent
          },
          {
            path: 'folder-detail/:foldername',
            component: FolderDetailComponent
          },
          {
            path: 'passports',
            component: PassportsComponent
          },
          {
            path: 'other-docs',
            component: OtherDocsComponent
          },
          {
            path: 'pictures/:foldername',
            component: PicturesComponent
          },
          {
            path: 'user-passport-detail',
            component: UserPassportDetailComponent
          },
          {
            path: 'visa-detail/:visaId',
            component: VisaDetailComponent
          },
          {
            path: 'edit-user-passport-detail/:passportId',
            component: EditUserPassportDetailComponent
          },
          {
            path: 'frequent-flyer',
            component: FrequentFlyerComponent
          },
          {
            path: 'frequent-flyer-detail/:index',
            component: FrequentFlyerDetailComponent
          },
          {
            path: 'service-inquiry',
            component: ServiceInquiryComponent
          },
          {
            path: 'visa',
            component: VisaInquiryComponent
          },
          {
            path: 'passport',
            component: PassportInquiryComponent
          },
          {
            path: 'general-detail',
            component: GeneralDetailComponent
          },
          {
            path: 'air-tickets',
            component: AirTicketsInquiryComponent
          },
          {
            path: 'accomodation',
            component: AccomodationInquiryComponent
          },
          {
            path: 'tours',
            component: ToursInquiryComponent
          },
          {
            path: 'transfers',
            component: TransferInquiryComponent
          },
          {
            path: 'other-details',
            component: OtherDetailsInquiryComponent
          },
          {
            path: 'information-pack',
            component: InformationPackComponent
          },
          {
            path: 'amendments',
            component: AmendmentsComponent
          },
          {
            path: 'premium-account',
            component: PremiumAccountPaymentComponent
          },
          {
            path: 'plan-option-detail/:id',
            component: PlanOptionDetailComponent
          },
          {
            path: 'explore-deals',
            component: ExploreDealsComponent
          },
          {
            path: 'payment',
            component: PaymentComponent
          },
          {
            path: 'all-plan/:inquiryId',
            component: AllPlanComponent
          },
          {
            path: 'trip-planing/:inquiryId',
            component: TripPlaningComponent
          },
          {
            path: 'trip-planing-detail/:inquiryId/:day',
            component: TripPlaningDetailComponent
          },
          {
            path: 'past-trips',
            component: PastTripsComponent
          },
          {
            path: 'notification',
            component: NotificationComponent
          },
          {
            path: 'upload-document',
            component: UploadDocumentComponent
          },
          {
            path: 'view-document-req/:tripId',
            component: DocumentReqDocumentComponent
          },
          {
            path: 'quotations/:tripId',
            component: QuotationsComponent
          },
          {
            path: 'location',
            component: SelectLocationComponent
          },
          {
            path: 'inner-folder/:foldername/:subfoldername',
            component: InnerFolderComponent
          },
          {
            path: 'select-city/:type',
            component: SelectCityComponent
          },
          {
            path: 'destination-finder',
            component: DestinationRequestComponent
          },
          {
            path: 'occian-vacation',
            component: OccasionVacationComponent
          },
          {
            path: 'travelling-zone',
            component: TravellingZonesComponent
          },
          {
            path: 'destination-detail/:id',
            component: DestinationDetailComponent
          },
          {
            path: 'destination-other-detail/:id',
            component: DestinationOtherDetailComponent
          },
          {
            path: 'climate',
            component: ClimateComponent
          },
          {
            path: 'popularity-of-destination',
            component: PopularityOfDestinationComponent
          },
        ]
      },

    ]),
    AgmCoreModule.forRoot({
      // apiKey: 'AIzaSyBFY9Gup1etoF1bt3MKmZ5xryBRE7p_ETA'
      apiKey: 'AIzaSyAHyK08CHb5PEfGHwUc34x-Lnp86YsODGg'
    })
  ],
  declarations: [
    HomePage,
    ExploreDealsComponent,
    PaymentComponent,
    AllPlanComponent,
    PlanOptionComponent,
    HomePageComponent,
    PlanOptionDetailComponent,
    DocumentComponent,
    ProfileComponent,
    BenefitsComponent,
    SafeTravelDetailComponent,
    SafeTravelComponent,
    SafeToTravelComponent,
    BriefcaseComponent,
    FolderDetailComponent,
    OtherDocsComponent,
    PassportsComponent,
    PicturesComponent,
    UserPassportDetailComponent,
    VisaDetailComponent,
    EditUserPassportDetailComponent,
    FrequentFlyerComponent,
    FrequentFlyerDetailComponent,
    ServiceInquiryComponent,
    VisaInquiryComponent,
    PassportInquiryComponent,
    GeneralDetailComponent,
    AirTicketsInquiryComponent,
    AccomodationInquiryComponent,
    ToursInquiryComponent,
    TransferInquiryComponent,
    OtherDetailsInquiryComponent,
    InformationPackComponent,
    AmendmentsComponent,
    PremiumAccountPaymentComponent,
    TripPlaningComponent,
    TripPlaningDetailComponent,
    PastTripsComponent,
    NotificationComponent,
    UploadDocumentComponent,
    DocumentReqDocumentComponent,
    QuotationsComponent,
    FolderImagesComponent,
    HeaderComponent,
    SelectLocationComponent,
    ImageModalComponent,
    SafePipe,
    InnerFolderComponent,
    SelectCityComponent,
    DestinationRequestComponent,
    OccasionVacationComponent,
    TravellingZonesComponent,
    DestinationDetailComponent,
    DestinationOtherDetailComponent,
    ClimateComponent,
    PopularityOfDestinationComponent
  ],
  providers: [
    FileTransfer,
    FileTransferObject,
    File,
    FileOpener,
    Geolocation,
    NativeGeocoder,
    DatePipe,
    PhotoViewer,
    PreviewAnyFile,
    Network,
    GoogleMaps,
    Camera,
    FilePath,
    DocumentViewer,
    Base64,
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: IonicGestureConfig
    },
    MediaCapture,
    Media
  ],
  entryComponents: [
    ImageModalComponent
  ]

})
export class HomePageModule { }
