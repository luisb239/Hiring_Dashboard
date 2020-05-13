import {Component, OnInit} from '@angular/core';
import {Request} from '../../model/request';
import {RequestService} from '../../services/request/request.service';

interface Country {
  name: string;
  flag: string;
  area: number;
  population: number;
}

const COUNTRIES: Country[] = [
  {
    name: 'Russia',
    flag: 'f/f3/Flag_of_Russia.svg',
    area: 17075200,
    population: 146989754
  },
  {
    name: 'Canada',
    flag: 'c/cf/Flag_of_Canada.svg',
    area: 9976140,
    population: 36624199
  },
  {
    name: 'United States',
    flag: 'a/a4/Flag_of_the_United_States.svg',
    area: 9629091,
    population: 324459463
  },
  {
    name: 'China',
    flag: 'f/fa/Flag_of_the_People%27s_Republic_of_China.svg',
    area: 9596960,
    population: 1409517397
  }
];

@Component({
  selector: 'app-all-requests',
  templateUrl: './all-requests.component.html',
  styleUrls: ['./all-requests.component.css']
})
export class AllRequestsComponent implements OnInit {

  countries = COUNTRIES;
  requests: Request[];

  constructor(private requestService: RequestService) {
  }

  ngOnInit(): void {
    this.requestService.getAllRequests().subscribe(requestDaos =>
        this.requests = requestDaos.map(r => new Request(r.id,
          r.workflow,
          r.progress,
          r.state,
          r.description,
          [],
          r.dateToSendProfile,
          r.project,
          r.quantity,
          r.requestDate,
          r.skill,
          r.state_csl,
          r.targetDate,
          r.profile
        )), error => {
      }
    );
  }
}
