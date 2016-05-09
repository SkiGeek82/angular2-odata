"use strict";
const rx_1 = require('rxjs/rx');
const odataquery_1 = require("./odataquery");
class ODataService {
    constructor(_typeName, http, config) {
        this._typeName = _typeName;
        this.http = http;
        this.config = config;
    }
    get TypeName() {
        return this._typeName;
    }
    Get(key) {
        return this.handleResponse(this.http.get(this.getEntityUri(key)));
    }
    Post(entity, key) {
        let body = JSON.stringify(entity);
        return this.handleResponse(this.http.post(this.getEntityUri(key), body));
    }
    PostAction(key, actionName, postdata) {
        let body = JSON.stringify(postdata);
        return this.handleResponse(this.http.post(this.getEntityUri(key) + "/" + actionName, body));
    }
    Patch(entity, key) {
        let body = JSON.stringify(entity);
        return this.handleResponse(this.http.patch(this.getEntityUri(key), body));
    }
    Put(entity) {
        let body = JSON.stringify(entity);
        return this.handleResponse(this.http.put(this.config.baseUrl + "/" + this.TypeName, body));
    }
    Delete(key) {
        return this.handleResponse(this.http.delete(this.getEntityUri(key)));
    }
    Query() {
        return new odataquery_1.ODataQuery(this.TypeName, this.config, this.http);
    }
    handleResponse(entity) {
        return entity.map(this.extractData)
            .catch((err, caught) => {
            this.config.handleError && this.config.handleError(err, caught);
            return rx_1.Observable.throw(err);
        });
    }
    extractData(res) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        let body = res.json();
        let entity = body;
        return entity || {};
    }
    getEntityUri(entityKey) {
        return this.config.baseUrl + "/" + this.TypeName + "('" + entityKey + "')";
    }
}
exports.ODataService = ODataService;
//# sourceMappingURL=odata.js.map