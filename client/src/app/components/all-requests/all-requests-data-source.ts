import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {RequestDetailsDao} from '../../model/request/request-details-dao';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {RequestService} from '../../services/request/request.service';
import {catchError} from 'rxjs/operators';

export class AllRequestsDataSource implements DataSource<RequestDetailsDao> {

  private requestsSubject = new BehaviorSubject<RequestDetailsDao[]>([]);

  public constructor(private service: RequestService) {
  }

  connect(collectionViewer: CollectionViewer): Observable<RequestDetailsDao[] | ReadonlyArray<RequestDetailsDao>> {
    return this.requestsSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.requestsSubject.complete();
  }

  public loadRequests(pageIndex: number = 0,
                      pageSize: number = 10,
                      args: any = {}) {

    this.service.find(pageIndex, pageSize, args)
      .pipe(
        catchError(() => of([]))
      )
      .subscribe(requests => {
        console.log('load requests ->', requests);
        this.requestsSubject.next(requests);
      });
  }

  count(args: any = {}, callback: (count: number) => void) {
    this.service.count(args).toPromise().then(
      res => {
        callback(res.count);
      }
    );
  }

}
