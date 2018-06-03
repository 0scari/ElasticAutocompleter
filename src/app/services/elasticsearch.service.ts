import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';



@Injectable()
export class ElasticSearchService {
    query: object = {};
    data = new Subject<any>();
    constructor(private http: HttpClient,
                private elasticClient: elasticsearch) {}

    autocompleteSearch(searchCriteria): Observable<any> {
        const autocompleteQuery = {
            'size': 5,
            'query': {
                'bool': {
                    'must': []
                }
            }
        };
        if (searchCriteria['name'] !== null && searchCriteria['name'] !== '') {
            autocompleteQuery.query.bool.must.push(
                this.formatAsQuery('name', searchCriteria['name']));
        }
        if (searchCriteria['age'] !== null && searchCriteria['age'] !== '') {
            autocompleteQuery.query.bool.must.push(
                this.formatAsQuery('age', searchCriteria['age']));
        }
        if (searchCriteria['address'] !== null && searchCriteria['address'] !== '') {
            autocompleteQuery.query.bool.must.push(
                this.formatAsQuery('address', searchCriteria['address']));
        }
        if (searchCriteria['phone'] !== null && searchCriteria['phone'] !== '') {
            autocompleteQuery.query.bool.must.push(
                this.formatAsQuery('phone', searchCriteria['phone']));
        }
        if (searchCriteria['email'] !== null && searchCriteria['email'] !== '') {
            autocompleteQuery.query.bool.must.push(
                this.formatAsQuery('email', searchCriteria['email']));
        }
        this.query = autocompleteQuery;
        return this.http.post('http://localhost:9200/mock-index5/person/_search',
            autocompleteQuery);
    }
    dataDisplaySearch(fetchSize = 10, fetchFrom = 0) {
        this.query['from'] = fetchFrom;
        this.query['size'] = fetchSize;
        this.http.post('http://localhost:9200/mock-index5/person/_search', this.query).subscribe(
            response => {
                console.log(response);
                this.data.next(response);
            }
        );
    }
    formatAsQuery(name, criterion) {
        const output = {'match': {}};
        output.match[name] = {
            'query': criterion,
            'operator': 'and'};
        return output;
    }
}