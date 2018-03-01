import {Component, OnDestroy, OnInit} from '@angular/core';
import { DataService } from '../services/data.service';
import { Subscription } from 'rxjs/Subscription';
import { MetaData } from '../services/data.model';

@Component({
  selector: 'app-scene',
  templateUrl: './scene.component.html',
  styleUrls: ['./scene.component.css']
})
export class SceneComponent implements OnInit, OnDestroy {
  private data: Object[];
  private nodeSubscription: Subscription;

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.nodeSubscription = this.dataService.getJson().subscribe( res => {
      this.data = res;
    });
  }

  ngOnDestroy() {
    this.nodeSubscription.unsubscribe();
  }

}
