
import { YouTubeSearchService } from './../you-tube-search/you-tube-search-service';
import { Component, OnInit, Output, EventEmitter, ElementRef } from '@angular/core';
import { SearchResult } from '../you-tube-search/search-result.model';


import { fromEvent } from 'rxjs';
import { map, filter, debounceTime, tap, switchAll } from 'rxjs/operators';


@Component({
  selector: 'app-search-box',
  template:  `<input type="text" class="form-control" placeholder="Search" autofocus>`
})
export class SearchBoxComponent implements OnInit {

  @Output() loading: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() results: EventEmitter<SearchResult[]> = new EventEmitter<SearchResult[]>();

  constructor(private youtube: YouTubeSearchService, private el: ElementRef) {
   }

  ngOnInit(): void {
    const obs = fromEvent(this.el.nativeElement, 'keyup')
    .pipe (
      map((e: any) => e.target.value), // obtener valor input
      filter((text: string) => text.length > 1), // filtrar segun la longitud
      debounceTime(250),// ejecutar evento cada 250ms
      // tslint:disable-next-line: curly
      tap(() => this.loading.emit(true)), // emitir el evento carga

      map((query: string) => this.youtube.search(query)), // realizar la busq
      switchAll(), // obtener busqueda mas reciente


    )
    .subscribe(
      (results: SearchResult[]) => { // exito
        this.loading.emit(false);
        this.results.emit(results);
      },
      (err: any) => { // error
        console.log(err);
        this.loading.emit(false);
      },
      () => {
        this.loading.emit(false);
      }
    );
  }
}
