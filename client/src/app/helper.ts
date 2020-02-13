export class Helper {

  public static getENUMValueAsString(yourENUM: any, value: any): string {
    for (const o in yourENUM) {
      if (yourENUM.hasOwnProperty(o)) {
        if (Number(o) === value) {
          return yourENUM[o]
        }
      }
    }
    return 'entry not found in your ENUM'
  }

  public static getId(link: string): string {
    const myArray = link.split('/')
    return `${myArray[myArray.length - 3]}/${myArray[myArray.length - 1]}`
  }

}
