import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { RestaurantService, ResponseData, State, City } from './restaurant.service';
import { Restaurant } from './restaurant';
import { Subscription } from 'rxjs';

export interface Data<dataType> {
  value: dataType[];
  isPending: boolean;
}

@Component({
  selector: 'pmo-restaurant',
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.less']
})
export class RestaurantComponent implements OnInit {
  form: FormGroup;

  public restaurants: Data<Restaurant> = {
    value: [],
    isPending: false
  }

  public states: Data<State> = {
    isPending: false,
    value: []
  };

  public cities: Data<City> = {
    isPending: false,
    value: []
  }

  subscription: Subscription;
  activeState: string;

  constructor(private restaurantService: RestaurantService, private fb: FormBuilder) {
  }

  ngOnInit() {
    this.createForm();

    this.onChanges();

    this.getStates();
  }

  onChanges() {
    const stateSub = this.form.get('state').valueChanges.subscribe(_val => {
      console.log(_val);
      this.restaurants.value = []; //reset restaurants

      if(_val) {
        //if there is a value selected- enable city dropdown
        this.form.get('city').enable({
          onlySelf: true,
          emitEvent: false
        })
        //clear prev city value if new state selected
        if(this.activeState !== _val) {
          this.form.get('city').patchValue(''); //reset list of cities
        }

        this.activeState = _val;
        this.getCities(_val);
      } else {
        //disable city if no value selected
        this.form.get('city').disable({
          onlySelf: true,
          emitEvent: false
        });
        this.activeState = ''; //reset the state to an empty string
      }
    })
    this.subscription = stateSub;

    const citySub = this.form.get('city').valueChanges.subscribe(val => {
      if(val) {
        this.getRestaurants(val, this.activeState);
      }
    });
    this.subscription.add(citySub);
  }

  getStates() {
    this.restaurantService.getStates().subscribe((res: ResponseData<State>) => {
      console.log('get states: ', res);
      this.states.value = res.data;
      this.states.isPending = false;
      this.form.get('state').enable({
        onlySelf: true,
        emitEvent: false
      });
    });
  }

  getCities(_state: string) {
    this.cities.isPending = true; //need to set cities to pending until fetched
    this.restaurantService.getCities(_state).subscribe((_res: ResponseData<City>) => {
      this.cities.value = _res.data;
      this.cities.isPending = false;
      this.form.get('city').enable({
        onlySelf: true,
        emitEvent: false
      });
    });
  }

  getRestaurants(_city: string, _state: string) {
    //todo get restaurants by city
    this.restaurantService.getRestaurants(_state, _city).subscribe((_res: ResponseData<Restaurant>) => {
      this.restaurants.value = _res.data;
      this.restaurants.isPending = false;
    })
  }

  createForm() {
    this.form = this.fb.group({
      city: {value: '', disabled: true},
      state: {value: '', disabled: true}
    })
  }

  ngOnDestroy() {
    this.subscription && this.subscription.unsubscribe && this.subscription.unsubscribe();
  }

}