import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { filter, switchMap, tap } from 'rxjs';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';


@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: [
  ]
})
export class NewPageComponent implements OnInit {

  constructor( private heroesService: HeroesService, private activatedRoute: ActivatedRoute, private router: Router
              ,private snackbar: MatSnackBar, private dialog: MatDialog ){}

  get currentHero():Hero{
    const hero = this.heroForm.value  as Hero;
    return hero
  }
  
  ngOnInit(): void {
    if( !this.router.url.includes('edit')) return;

    this.activatedRoute.params
    .pipe(
      switchMap(({id}) => this.heroesService.getHeroById(id)),
    ).subscribe( hero => {
      if( !hero ) return this.router.navigate(['/']);

      this.heroForm.reset(hero);
      return
    })
  }

  public heroForm = new FormGroup({
      id: new FormControl<string>('', { nonNullable: true }),
      superhero: new FormControl<string>(''),
      publisher: new FormControl<Publisher>(Publisher.DCComics),
      alter_ego: new FormControl<string>(''),
      first_appearance:new FormControl<string>(''),
      characters:new FormControl<string>(''),
      alt_img: new FormControl<string>(''), 
  })

  public publishers = [
    { id: 'DC Comics', desc: 'DC - Comics' },
    { id: 'Marvel Comics', desc: 'Marvel - Comics' },
  ];

  onSubmit():void{
    /*console.log({
      formIsValid: this.heroForm.valid,
      value: this.heroForm.value

      });*/
     if(this.currentHero.id){
      this.heroesService.updateHero(this.currentHero)
      .subscribe(hero => {
        //TODO: mostrar snackbar
        this.showSnackbar(`${ hero.superhero } updated!`);
      })
      return;
     }

     this.heroesService.addHero(this.currentHero)
     .subscribe(hero => {
       //TODO: mostrar snackbar y navear a /heroes/edit/hero.id
       this.showSnackbar(`${ hero.superhero } created!`);
       this.router.navigate(['/heroes/edit', hero.id]);
     })

}

onDeleteConfirm(){
  if( !this.currentHero.id ) throw Error('Hero id is required');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: this.heroForm.value
    });


    //con RxJS
    dialogRef.afterClosed()
    .pipe(
      filter( (result: boolean) => result ),
      switchMap( () => this.heroesService.deleteHeroById(this.currentHero.id)),
      tap( wasDeleted =>  console.log( {wasDeleted}) ),
      filter( (wasDeleted: boolean) => wasDeleted )
        
      )
      .subscribe( () => {
        this.router.navigate(['/heroes']);
      })
    
      
    /*dialogRef.afterClosed().subscribe(result => {
      if( !result ) return;

      this.heroesService.deleteHeroById(this.currentHero.id)
      .subscribe( result => {

        if( result ) this.router.navigate(['/heroes']);
      })
    });*/


  }

showSnackbar( message: string): void{
  this.snackbar.open (message , 'done', {
    duration: 2500
  })
 }

}
