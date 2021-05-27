import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder } from '@angular/forms'
import {ApiservicesService} from '../apiservices.service';
import {MatSnackBar} from '@angular/material/snack-bar';

export class country {
  id: string;
  name: string;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}

@Component({
  selector: 'app-dynamic-forms',
  templateUrl: './dynamic-forms.component.html',
  styleUrls: ['./dynamic-forms.component.scss']
})
export class DynamicFormsComponent implements OnInit {

  title = 'Covid Vaccination Registration form';
  gender = ['Male','Female','Others'];
  vaccination = ['Covaxin','Covishield'];
  doses=['1','2'];
  empForm:FormGroup;
  durationInSeconds = 5;

  constructor(private fb:FormBuilder, private apiService:ApiservicesService, private _snackBar: MatSnackBar) {
    this.empForm=this.fb.group({
      user: this.fb.array([]) ,
    })
  }

  ngOnInit(): void {
    this.addEmployee();
  }

  employees(): FormArray {
    return this.empForm.get("user") as FormArray
  }


  newEmployee(): FormGroup {
    return this.fb.group({
      id: '',
      name: '',
      age: '',
      gender: '',
      dose: '',
      vaccine: '',
      location:'',
      dependents:this.fb.array([])
    })
  }


  addEmployee() {
    console.log("Adding a employee");
    this.employees().push(this.newEmployee());
  }


  removeEmployee(empIndex:number) {
    this.employees().removeAt(empIndex);
  }


  employeeSkills(empIndex:number) : FormArray {
    return this.employees().at(empIndex).get("dependents") as FormArray
  }

  newSkill(): FormGroup {
    return this.fb.group({
      name: '',
      age: '',
      gender: '',
      relationship: '',
      dose: '',
      vaccine: ''
    })
  }

  addEmployeeSkill(empIndex:number) {
    this.employeeSkills(empIndex).push(this.newSkill());
  }

  removeEmployeeSkill(empIndex:number,skillIndex:number) {
    this.employeeSkills(empIndex).removeAt(skillIndex);
  }

  onSubmit() {
    console.log(this.empForm.value['user'][0]);
    this.apiService.postData(this.empForm.value['user'][0]).subscribe(data=>{
      if(data){
        console.log(data);
        this._snackBar.open("User Registered Successful","Success", {
          duration: this.durationInSeconds * 1000,
        });
      }
    });
  }

}
