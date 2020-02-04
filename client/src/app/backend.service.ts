import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IUser } from './profile/profile.component';
import { ETaskType, ETaskStatus, ITask } from './solve/solve.component';

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  public constructor(private readonly http: HttpClient) { }

  public static backendBaseURL = 'http://localhost:3000';


  public static getInitialTask(): ITask {
    return {
      taskType: ETaskType.GitHubIssue,
      name: '',
      description: '',
      funding: 0,
      currency: 'EIC',
      status: ETaskStatus.created,
      funderRatedWith: 5,
      solutionProviderRatedWith: 5
    };
  }

  public static getInitialUser() {
    const user: IUser = {
      companyId: '',
      firstName: '',
      balance: 0,
    };

    return user;
  }

  public get(url: any): any {
    console.log(`calling to get ${url}`);
    return this.http.get<any>(url);
  }

  public post(url: string, body: any) {
    // const urlWithClient = `${url}?client=${document.URL}`;
    const urlWithClient = url;
    console.log(`calling to post to ${urlWithClient}`);

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    console.log(JSON.stringify(body));
    return this.http.post<any>(urlWithClient, JSON.stringify(body), httpOptions);
  }

  public getUser(companyId: string) {
    return this.getUsers().filter((entry: IUser) => entry.companyId === companyId)[0];
  }

  public getDefaultTaskForDemo() {
    return {
      taskType: ETaskType.GitHubIssue,
      name: 'Just a Demo Task',
      description: 'Just a Demo Description',
      funding: 0,
      currency: 'EIC',
      status: ETaskStatus.created,
      funderRatedWith: 5,
      solutionProviderRatedWith: 5
    };

  }

  public getUsers() {
    const users: IUser[] = [];

    const lisa: IUser = {
      balance: 1000,
      companyId: 'd123',
      firstName: 'Lisa',
    };
    users.push(lisa);

    const laura: IUser = {
      balance: 2000,
      companyId: 'd124',
      firstName: 'Laura',
    };
    users.push(laura);


    const luisa: IUser = {
      balance: 3000,
      companyId: 'd125',
      firstName: 'Luisa',
    };

    users.push(luisa);

    return users;
  }

}
