import { INavbarData, IMenuEntry } from './navbar.interfaces'

export class NavBarProvider {

  public static getNavBarData(): INavbarData {

    return {
      logoURL: '../assets/peer-2-peer.jpg',
      appTitle: 'GitCoin Enterprise',
      menuEntries: NavBarProvider.getMenuEntries(),
    }
  }

  private static getMenuEntries(): IMenuEntry[] {
    const menuEntries = []

    menuEntries.push({ isActive: true, text: 'Home', href: 'landing' })
    menuEntries.push({ isActive: false, text: 'Fund a Task', href: 'fund' })
    menuEntries.push({ isActive: false, text: 'Solve a Task', href: 'solve' })
    menuEntries.push({ isActive: false, text: 'Profile', href: 'profile' })
    menuEntries.push({ isActive: false, text: 'Ledger', href: 'downloadLedger' })
    menuEntries.push({ isActive: false, text: 'Use as App', href: 'useAsApp' })
    // menuEntries.push({ isActive: false, text: 'Invite Friends', href: 'inviteFriends' })
    menuEntries.push({ isActive: false, text: 'Open Source', href: 'openSource' })
    if (NavBarProvider.isImpressumNecessary()) {
      menuEntries.push({ isActive: false, text: 'About', href: 'about' })
      menuEntries.push({ isActive: false, text: 'Contact', href: 'contact' })
    }

    return menuEntries
  }

  private static isImpressumNecessary(): boolean {
    if (document.URL === 'https://gitcoin-enterprise.org/' || document.URL.indexOf('http://localhost') !== -1) {
      return true
    }

    return false
  }

}
