import { Component, Input, Output, EventEmitter } from '@angular/core'

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

  // public getImageUrl(item: string): string {
  //   if (item.indexOf(ModuleService.delimiter) !== -1) {
  //     const imgUrl = item.split(ModuleService.delimiter)[1]

  //     return imgUrl
  //   }

  //   return 'https://fance-stiftung.de/api/app/app-images/logo.png'
  // }

  // public getThePureString(item: string): string {
  //   if (item.indexOf(ModuleService.delimiter) !== -1) {
  //     return item.split(ModuleService.delimiter)[0]
  //   }

  //   return item
  // }

  public onInputClicked() {
    this.selectedItemBackup = this.selectedItem
    this.selectedItem = ''
  }

  public onInputLeft() {
    if (this.selectedItem === '') {
      this.selectedItem = this.selectedItemBackup
    }
  }

  public onItemSelected(item: any) {
    let selectedString: string
    selectedString = item
    this.itemSelected.emit(selectedString)
  }

}
