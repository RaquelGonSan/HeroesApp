import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanMatch, Route, Router, RouterStateSnapshot, UrlSegment } from '@angular/router';
import { map, Observable, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PublicGuard implements CanActivate, CanMatch {

  constructor(private authService: AuthService, private router: Router) {}

    private checkAuthStatus(): boolean | Observable<boolean> {
      
      return this.authService.checkAuthentication()
      .pipe(
        tap( isAutenticated => {
          if( isAutenticated ) {
            this.router.navigate(['./']);
          }
          
        }),
        map ( isAutenthicated => !isAutenthicated)
      )
    }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean  {
    return this.checkAuthStatus();
  }
  canMatch(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean  {
    return this.checkAuthStatus();
  }
}
