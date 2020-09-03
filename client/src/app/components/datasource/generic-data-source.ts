import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Injectable} from '@angular/core';

@Injectable()
export abstract class PaginationService {
  abstract find(pageNumber: number, pageSize: number, args: any);
  abstract count(args: any);
}

export class GenericDataSource implements DataSource<any> {
  private dataSubject = new BehaviorSubject<any[]>([]);

  public constructor(private service: PaginationService) {
  }

  connect(collectionViewer: CollectionViewer): Observable<any[] | ReadonlyArray<any>> {
    return this.dataSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.dataSubject.complete();
  }

  public loadInfo(pageIndex: number = 0, pageSize: number = 10, args: any = {}) {
    this.service.find(pageIndex, pageSize, args)
      .pipe(catchError(() => of([])))
      .subscribe(data => this.dataSubject.next(data));
  }

  public count(args: any = {}, callback: (count: number) => void) {
    this.service.count(args).toPromise().then(res => callback(res.count));
  }

}
