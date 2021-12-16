import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedCoreModule } from 'moh-common-lib';
import { FormsModule } from '@angular/forms';
import { LocalStorageModule } from 'angular-2-local-storage';
import { RemoveChildComponent } from './remove-child.component';
import { AccountPersonalInformationComponent } from '../../../components/personal-information/personal-information.component';
import { MspAccountMaintenanceDataService } from '../../../services/msp-account-data.service';
import { MspPerson } from '../../../../../components/msp/model/msp-person.model';
import { Relationship } from '../../../../../models/relationship.enum';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MspLogService } from '../../../../../services/log.service';

describe('RemoveChildComponent', () => {
  let component: RemoveChildComponent;
  let fixture: ComponentFixture<RemoveChildComponent>;

  beforeEach(async(() => {
    const mspLogServiceStub = () => ({ log: () => {} });
    TestBed.configureTestingModule({
      declarations: [
        AccountPersonalInformationComponent,
        RemoveChildComponent
      ],
      imports: [
        FormsModule,
        SharedCoreModule,
        LocalStorageModule.withConfig({
          prefix: 'ca.bc.gov.msp',
          storageType: 'sessionStorage'
        }),
        HttpClientTestingModule
      ],
      providers: [
        MspAccountMaintenanceDataService,
        { provide: MspLogService, useFactory: mspLogServiceStub }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveChildComponent);
    component = fixture.componentInstance;
    component.child = new MspPerson(Relationship.Child19To24);
    component.phns = [''];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
