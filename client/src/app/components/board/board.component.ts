import {Component, OnInit} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {Candidate} from '../../model/candidate';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {PopupComponent} from '../popup/popup.component';
import {RequestService} from '../../services/request/request.service';
import {Board} from '../../model/board';
import {Column} from '../../model/column';
import {Request} from '../../model/request';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  closeResult = '';

  constructor(private modalService: NgbModal, private requestService: RequestService) {
  }
  workflows: string[] = [...new Set([].map(r => r.workflow))];
  hidden = false;
  requests: Request[] = [];
  // board: Board = new Board('Test', []);
  board: Board = new Board('Test Board', [
    new Column('Ideas', [
      new Candidate('Some random idea'),
      new Candidate('This is another random idea'),
      new Candidate('build an awesome application')
    ]),
    new Column('Research', [
      new Candidate('Lorem ipsum'),
      new Candidate('foo'),
      new Candidate('This was in the \'Research\' column')
    ]),
    new Column('Todo', [
      new Candidate('Get to work'),
      new Candidate('Pick up groceries'),
      new Candidate('Go home'),
      new Candidate('Fall asleep')
    ]),
    new Column('Done', [
      new Candidate('Get up'),
      new Candidate('Brush teeth'),
      new Candidate('Take a shower'),
      new Candidate('Check e-mail'),
      new Candidate('Walk dog')
    ])
  ]);

  ngOnInit(): void {
    this.requestService.getRequestsByUser()
      .subscribe(
        requests => {
          this.requests = requests.map(r => new Request(r.workflow, r.progress, r.state));
        },
        error => {
          console.log(error);
        });
  }

  drop(event: CdkDragDrop<Candidate[], any>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  onClick(candidate: Candidate) {
    const modalRef = this.modalService.open(PopupComponent);
    candidate.available = false;
    modalRef.componentInstance.candidate = candidate;
  }

  toggleRow(idx: number) {
    this.board.columns[idx].hidden = !this.board.columns[idx].hidden;
  }

  hide() {
    this.hidden = !this.hidden;
  }

}
