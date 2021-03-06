import {Component, ViewChild, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import { Router} from '@angular/router';
import {ProcessUrls} from '../../../../services/process.service';
import {environment} from '../../../../../environments/environment';
import { MspAccountApp } from '../../models/account.model';
import { ContainerService, PageStateService } from 'moh-common-lib';
import { MspAccountMaintenanceDataService } from '../../services/msp-account-data.service';
import { MspPerson } from '../../../../components/msp/model/msp-person.model';
import { BaseForm } from '../../models/base-form';
import {ProcessService} from '../../../../services/process.service';

@Component({
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class AccountReviewComponent extends BaseForm implements OnInit {
  lang = require('./i18n');
  static ProcessStepNum = 4;
  mspAccountApp: MspAccountApp;
  captchaApiBaseUrl: string;
  @ViewChild(NgForm) form: NgForm;

  constructor(public dataService: MspAccountMaintenanceDataService,
          protected router: Router,
          protected containerService: ContainerService,
          protected pageStateService: PageStateService,
          protected _processService: ProcessService) {
    super(router, containerService, pageStateService, _processService);
    this.mspAccountApp = dataService.getMspAccountApp();
    this.captchaApiBaseUrl = environment.appConstants.captchaApiBaseUrl;
  }

  ngOnInit() {
    this.pageStateService.setPageIncomplete(this.router.url);
    this.initProcessMembers(AccountReviewComponent.ProcessStepNum, this._processService);
    this._processService.setStep(AccountReviewComponent.ProcessStepNum, false);
  }

  get hasSpouse() {
    return this.mspAccountApp.spouse ? true : false;
  }

  // unused.. logic changed
  get spousesForAuthorisation(): MspPerson[] {
    return [this.mspAccountApp.addedSpouse, this.mspAccountApp.updatedSpouse].filter(spouse => !!spouse);
  }

  get accountPIUrl() {
    return ProcessUrls.ACCOUNT_PERSONAL_INFO_URL;
  }

  get accountSpouseUrl() {
    return ProcessUrls.ACCOUNT_SPOUSE_INFO_URL;
  }

  get accountDependentUrl() {
    return ProcessUrls.ACCOUNT_DEPENDENTS_URL;
  }

  get accountChildInfoUrl() {
    return ProcessUrls.ACCOUNT_CHILD_INFO_URL;
  }

  get accountContactInfoUrl() {
    return ProcessUrls.ACCOUNT_CONTACT_INFO_URL;
  }

  get addChildTitle() {
    return 'Add Child Information #';
  }

  get removeChildTitle() {
    return 'Remove Child Information #';
  }

  get updateChildTitle() {
    return 'Update Child Information #';
  }

  get spouseForAuthorization(): MspPerson {
    if (this.mspAccountApp.accountChangeOptions.dependentChange && this.mspAccountApp.addedSpouse) {
      return this.mspAccountApp.addedSpouse;
    }
    if ((this.mspAccountApp.accountChangeOptions.personInfoUpdate || this.mspAccountApp.accountChangeOptions.statusUpdate ) && this.mspAccountApp.updatedSpouse) {
      return this.mspAccountApp.updatedSpouse;
    }
    return undefined;
  }

  get questionApplicant() {
    return this.lang('./en/index.js').doYouAgreeLabel.replace('{name}', this.applicantName);
  }

  get applicantName() {
    return this.mspAccountApp.applicant.firstName + ' ' + this.mspAccountApp.applicant.lastName;
  }

  applicantAuthorizeOnChange(event: boolean) {
    this.mspAccountApp.authorizedByApplicant = event;
    if (this.mspAccountApp.authorizedByApplicant) {
      this.mspAccountApp.authorizedByApplicantDate = new Date();
    }
    this.dataService.saveMspAccountApp();
  }

  spouseUpdateAuthorizeOnChange(event: boolean) {
    this.mspAccountApp.authorizedBySpouse = event;
    this.dataService.saveMspAccountApp();
  }

  questionSpouse() {
    return this.lang('./en/index.js').doYouAgreeLabel.replace('{name}', this.spouseName());
  }

  spouseName() {
    return this.spouseForAuthorization.firstName + ' ' + this.spouseForAuthorization.lastName;
  }

  keyPress(event){
    if (event.keyCode === 13){ // code for Enter key
      this.printPage();
    }
  }

  printPage() {
    window.print();
    return false;
  }

  canContinue(): boolean {
    const valid = super.canContinue();
    return valid;
  }

  continue(): void {
    if (!this.canContinue()) {
      console.log('Please fill in all required fields on the form.');
      this.markAllInputsTouched();
      this._processService.setStep(AccountReviewComponent.ProcessStepNum, false);
      return;
    }
    this._processService.setStep(AccountReviewComponent.ProcessStepNum, true);
    this.navigate('/deam/authorize');
  }
}
