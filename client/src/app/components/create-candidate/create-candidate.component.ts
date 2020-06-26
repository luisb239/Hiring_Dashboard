import {Component, OnInit} from '@angular/core';
import {CandidateService} from '../../services/candidate/candidate.service';

@Component({
  selector: 'app-create-candidate',
  templateUrl: './create-candidate.component.html',
  styleUrls: ['./create-candidate.component.css']
})
export class CreateCandidateComponent implements OnInit {

  fileToUpload: File = null;
  candidateName = '';

  constructor(private candidateService: CandidateService) {
  }

  ngOnInit(): void {
  }

  handleFileInput(files: FileList) {
    // Check if filesList size == 1
    this.fileToUpload = files.item(0);
  }

  onSubmit() {
    this.candidateService.addCandidate(this.candidateName, this.fileToUpload)
      .subscribe(data => {
        alert('Candidate added to the system');
      }, error => {
        console.log(error);
      });
  }
}
