import { Routes } from '@angular/router';
import { TtsConsentComponent } from './components/tts-consent/tts-consent.component';
import { WizardComponent } from './components/wizard/wizard.component';

export const routes: Routes = [
  { path: '', component: TtsConsentComponent },
  { path: 'wizard', component: WizardComponent },
  { path: '**', redirectTo: '' }
];
