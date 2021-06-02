import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
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

  title = 'Covid Vaccine Registration form (Drive Location: Bangalore)';
  gender = ['Male', 'Female', 'Others'];
  vaccination = ['Covaxin', 'Covishield'];
  relationShips = ['Mother', 'Father', 'Mother in-law', 'Father in-law', 'Spouse'];
  doses = ['1', '2'];
  empForm: FormGroup;
  durationInSeconds = 5;
  submitted = false;

  constructor(private fb: FormBuilder, private apiService: ApiservicesService, private _snackBar: MatSnackBar) {
    this.empForm = this.fb.group({
      user: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.addEmployee();
  }

  employees(): FormArray {
    return this.empForm.get('user') as FormArray;
  }


  newEmployee(): FormGroup {
    return this.fb.group({
      id: ['', [Validators.required]],
      name: ['', [Validators.required]],
      age: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      dose: ['', [Validators.required]],
      vaccine: ['', [Validators.required]],
      location: ['', [Validators.required]],
      dependents: this.fb.array([])
    });
  }


  addEmployee() {
    console.log('Adding a employee');
    this.employees().push(this.newEmployee());
  }


  removeEmployee(empIndex: number) {
    this.employees().removeAt(empIndex);
  }


  employeeSkills(empIndex: number): FormArray {
    return this.employees().at(empIndex).get('dependents') as FormArray;
  }

  newSkill(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required ]],
      age: ['', [Validators.required ]],
      gender: ['', [Validators.required ]],
      relationship: ['', [Validators.required]],
      dose: ['', [Validators.required]],
      vaccine: ['', [Validators.required]]
    });
  }

  addEmployeeSkill(empIndex: number) {
    this.employeeSkills(empIndex).push(this.newSkill());
  }

  removeEmployeeSkill(empIndex: number, skillIndex: number) {
    this.employeeSkills(empIndex).removeAt(skillIndex);
  }

  onSubmit() {
    this.submitted = true;
    if (this.empForm.valid){
      this.apiService.postData(this.empForm.value.user[0]).subscribe(data => {
        if (data) {
          if (data['status'] === 'AlreadyExist'){
            this._snackBar.open(' Already Registered, please contact Admin if you need changes', 'Error', {
              duration: this.durationInSeconds * 1000,
            });
          }
          else if (data['status'] === 'Success'){
            this._snackBar.open('Registration Successful, thanks', 'Success', {
              duration: this.durationInSeconds * 1000,
            });
            this.empForm.reset();
            this.submitted = false;
          }
        }
      }, error => {
        this._snackBar.open(error.message + ' Please contact the Admin', 'Error', {
          duration: this.durationInSeconds * 1000,
        });
      });
    }else{
      this._snackBar.open('Please enter valid details!', 'error', {

        duration: this.durationInSeconds * 1000,
      });
    }
  }

}
