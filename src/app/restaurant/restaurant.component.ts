import { Component, OnInit } from '@angular/core';
import { Restaurant } from './restaurant';
import { RestaurantService } from './restaurant.service';

export interface Data {
  value: Array<Restaurant>;
  isPending: boolean;
}

@Component({
  selector: 'pmo-restaurant',
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.less']
})
export class RestaurantComponent implements OnInit {
  public restaurants: Data = {
    value: [],
    isPending: false
  };

  constructor(private restaurantService: RestaurantService) { }

  ngOnInit() {
    this.restaurants.isPending = true;

    this.restaurantService.getRestaurants().subscribe((_res) => {
      this.restaurants.value = _res.data;
      this.restaurants.isPending = false;
    })
  }

}