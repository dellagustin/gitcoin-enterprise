import { Injectable } from '@nestjs/common'
const neo4j = require('neo4j-driver')

@Injectable()
export class Neo4jService {

    // private readonly driver: any = neo4j.driver(
    //     'neo4j://localhost',
    //     neo4j.auth.basic('neo4j', 'test'),
    // )

    // private readonly session = this.driver.session()

    // public constructor() {
    //     this.session
    //         .run('MERGE (alice:Person {name : $nameParam}) RETURN alice.name AS name', {
    //             nameParam: 'Alice',
    //         })
    // }

}
