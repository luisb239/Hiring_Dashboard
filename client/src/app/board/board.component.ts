import {Component, OnInit, TemplateRef} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {Board} from 'src/app/model/board';
import {Column} from 'src/app/model/column';
import {Candidate} from '../model/candidate';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  closeResult = '';

  constructor(private modalService: NgbModal) {
  }

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

  onClick(content: TemplateRef<any>) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed`;
    });
  }

}
