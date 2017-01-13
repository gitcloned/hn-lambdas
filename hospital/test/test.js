
var should = require('chai').should();
var assert = require('chai').assert;

describe('Form API', function (params) {
    
    var formAPI = require('../module/form/index');
    
    describe('#get() without ClientId', function (params) {
        
        it("should return error if ClientId is not specified", function (done) {
        
            formAPI.handle({ 
                name: "form",
            }, {}, function (err, resp) {
                
                should.not.exist(err);
                should.exist(resp);
                should.exist(resp.statusCode);
                resp.statusCode.should.equal('400');
                
                done();
            });
        })
    })
    
    describe('#get() without FormID', function (params) {
        
        it("should not return any error", function (done) {
        
            formAPI.handle({ 
                name: "form",
                "ClientId": "SPPC"
            }, {}, function (err, resp) {
        
                assert.equal(err, null);
                if (typeof resp === "object" && resp.statusCode) {
                    resp.statusCode.should.not.equal('400');
                }
                done();
            });
        })
        
        it("should return array of Forms", function (done) {
        
            formAPI.handle({ 
                name: "form",
                "ClientId": "SPPC"
            }, {}, function (err, resp) {
        
                resp.should.be.a('array');
                done();
            });
        })
    })
    
    describe('#get() with FormID', function (params) {
        
        it("should not return any error", function (done) {
        
            formAPI.handle({ 
                name: "form",
                "ClientId": "SPPC",
                "FormId": "F00001"
            }, {}, function (err, resp) {
        
                assert.equal(err, null);
                done();
            });
        })
        
        it("should return array of Questions", function (done) {
        
            formAPI.handle({ 
                name: "form",
                "ClientId": "SPPC",
                "FormId": "F00001"
            }, {}, function (err, resp) {
        
                resp.should.be.a('array');
                done();
            });
        })
    })
})

describe('Response API', function (params) {
    
    var responseAPI = require('../module/responses/index');
    
    describe('#get()', function () {
    
        describe('without ClientId', function (params) {
            
            it("should return error", function (done) {
            
                responseAPI.handle({ 
                    name: "responses",
                }, {}, function (err, resp) {
                    
                    should.not.exist(err);
                    should.exist(resp);
                    should.exist(resp.statusCode);
                    resp.statusCode.should.equal('400');
                    
                    done();
                });
            })
        })
        
        describe('without FormId', function (params) {
            
            it("should return error", function (done) {
            
                responseAPI.handle({ 
                    name: "responses",
                    ClientId: "SPPC"
                }, {}, function (err, resp) {
                    
                    should.not.exist(err);
                    should.exist(resp);
                    should.exist(resp.statusCode);
                    resp.statusCode.should.equal('400');
                    
                    done();
                });
            })
        })
    });
    
    describe('#post()', function () {
    
        describe('without ClientId', function (params) {
            
            it("should return error", function (done) {
            
                responseAPI.handle({ 
                    name: "responses",
                    httpMethod: 'POST'
                }, {}, function (err, resp) {
                    
                    should.not.exist(err);
                    should.exist(resp);
                    should.exist(resp.statusCode);
                    resp.statusCode.should.equal('400');
                    
                    done();
                });
            })
        })
        
        describe('without FormId', function (params) {
            
            it("should return error", function (done) {
            
                responseAPI.handle({ 
                    name: "responses",
                    ClientId: "SPPC",
                    httpMethod: 'POST'
                }, {}, function (err, resp) {
                    
                    should.not.exist(err);
                    should.exist(resp);
                    should.exist(resp.statusCode);
                    resp.statusCode.should.equal('400');
                    
                    done();
                });
            })
        })
        
        describe('without Answers, or PName, or PContact', function (params) {
            
            it("should return error", function (done) {
            
                responseAPI.handle({ 
                    name: "responses",
                    ClientId: "SPPC",
                    httpMethod: 'POST',
                    FormId: 'F00001'
                }, {}, function (err, resp) {
                    
                    should.not.exist(err);
                    should.exist(resp);
                    should.exist(resp.statusCode);
                    resp.statusCode.should.equal('400');
                    
                    responseAPI.handle({ 
                        name: "responses",
                        ClientId: "SPPC",
                        httpMethod: 'POST',
                        body: '{}'
                    }, {}, function (err, resp) {
                        
                        should.not.exist(err);
                        should.exist(resp);
                        should.exist(resp.statusCode);
                        resp.statusCode.should.equal('400');
                        
                        responseAPI.handle({ 
                            name: "responses",
                            ClientId: "SPPC",
                            httpMethod: 'POST',
                            body: '{}',
                            PName: 'Abc'
                        }, {}, function (err, resp) {
                            
                            should.not.exist(err);
                            should.exist(resp);
                            should.exist(resp.statusCode);
                            resp.statusCode.should.equal('400');
                            
                            done();
                        });
                    });
                });
            })
        })
        
        describe('with response', function (params) {
            
            it("should return missing config error", function (done) {
            
                responseAPI.handle({ 
                    name: "responses",
                    ClientId: "SPPC",
                    httpMethod: 'POST',
                    FormId: 'F00001',
                    body: '{}',
                    PatientName: 'Abc',
                    PatientContact: '1919191',
                }, {}, function (err, resp) {
                    
                    should.not.exist(err);
                    should.exist(resp);
                    should.exist(resp.statusCode);
                    resp.statusCode.should.equal('400');
                    resp.body.should.equal('Missing region in config');
                    
                    done();
                });
            })
        })
    });
})