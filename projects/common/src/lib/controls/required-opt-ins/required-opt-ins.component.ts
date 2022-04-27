import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'lcu-required-opt-ins',
  templateUrl: './required-opt-ins.component.html',
  styleUrls: ['./required-opt-ins.component.scss']
})
export class RequiredOptInsComponent implements OnInit {

  @Output('req-opt-ins-changed')
  public ReqOptInsChanged: EventEmitter<any>;

  constructor() {

    this.ReqOptInsChanged = new EventEmitter<any>();
   }

  ngOnInit(): void {
  }

  public ReqOptsChanged(event: any){
    this.ReqOptInsChanged.emit(event);

  }

}
