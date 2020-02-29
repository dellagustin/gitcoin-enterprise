import { Component, Input, Output, EventEmitter } from '@angular/core'
import { BackendService } from '../backend.service'

@Component({
  selector: 'app-typeahead',
  templateUrl: './typeahead.component.html',
  styleUrls: ['./typeahead.component.css', '../app.component.css'],
})
export class TypeaheadComponent {

  @Input() public placeHolder
  @Input() public useCustomTemplate: boolean
  @Input() public items: string[]
  @Input() public selectedItem
  @Input() public maxNumberOfProposals
  @Input() public inputStyle

  @Output() public itemSelected = new EventEmitter<string>()

  public selectedItemBackup = this.selectedItem

  public formattedCities: string[] = []

  public onInputClicked() {
    this.selectedItemBackup = this.selectedItem
    this.selectedItem = ''
  }

  public onInputLeft() {
    if (this.selectedItem === '') {
      this.selectedItem = this.selectedItemBackup
      alert(`You can only select users who have registered at ${BackendService.backendURL}. Inform them to do so :)`)
    }
  }

  public onItemSelected(item: any) {
    let selectedString: string
    selectedString = item
    this.itemSelected.emit(selectedString)
  }

}
