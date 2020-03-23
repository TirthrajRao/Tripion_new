// import { Injectable } from "@angular/core";
// import { tap, map, catchError } from "rxjs/operators";
// // import {ToastService} from './services/toast.service';
// import {
//     HttpRequest,
//     HttpHandler,
//     HttpEvent,
//     HttpInterceptor,
//     HttpResponse,
//     HttpErrorResponse,
// } from "@angular/common/http";
// import { Observable, throwError } from "rxjs";
// import { Router } from '@angular/router';
// // import * as CryptoJS from 'crypto-js';

// @Injectable()
// export class MyInterceptor implements HttpInterceptor {
//     accessToken;
//     key = "tripion@raoinfor";

//     constructor(public route: Router) {
//         this.accessToken = localStorage.getItem('accessToken')
//     }
//     //function which will be called for all http calls
//     intercept(
//         request: HttpRequest<any>,
//         next: HttpHandler
//     ): Observable<HttpEvent<any>> {
//         console.log("token=================>", this.accessToken)
//         //how to update the request Parameters
//         if (this.accessToken) {
//             const cloned = request.clone({
//                 headers: request.headers.set("token",
//                     'this.accessToken')
//             });
//             //logging the updated Parameters to browser's console
//             console.log("Before making api call : ", cloned);
//             return next.handle(cloned).pipe(
//                 map((event: HttpResponse<any>) => {
//                     console.log("in response= with token==========>", event);
//                     return event;
//                 }),
//                 catchError((error: HttpErrorResponse) => {
//                     console.log("interceptorsssssssss error by meeeeeeeeeee", error);
//                     const errorMessage = error.error;
//                     console.log("error in interceptor", errorMessage);
//                     if (error.status === 401) {
//                         localStorage.removeItem('curruntUserToken');
//                         this.route.navigate(['/login']);
//                     }
//                     return throwError(error);
//                 })
//             );
//         } else {
//             return next.handle(request).pipe(
//                 map((event: HttpResponse<any>) => {
//                     console.log("in response===========>", event);
//                     return event;
//                 }),
//                 catchError((error: HttpErrorResponse) => {
//                     console.log("interceptorsssssssss without token error by meeeeeeeeeee", error);
//                     const errorMessage = error.error;
//                     console.log("error in interceptor", errorMessage);
//                     if (error.status === 401) {
//                         // localStorage.removeItem('curruntUserToken');
//                         //   Swal.fire({
//                         //     type: 'error',
//                         //     title: "sorry" + errorMessage,
//                         //     showConfirmButton: false,
//                         //     timer: 2000
//                         //   })
//                         this.route.navigate(['/login']);
//                     }
//                     return throwError(error);
//                 })
//             );
//         }
//     }
// }



