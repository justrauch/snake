import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SolitaerComponent } from './solitaer.component';

const routes: Routes = [
  { path: '', component: SolitaerComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SolitaerRoutingModule {}