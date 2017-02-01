
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
        
                // should.not.exist(err);
                // should.exist(resp);
                // should.exist(resp.statusCode);
                // resp.statusCode.should.equal('400');
                // resp.body.should.equal('Missing region in config');
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
                            UserName: 'Abc'
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
        
        describe('with proper response', function (params) {
            
            it("should return missing config error", function (done) {
            
                responseAPI.handle({ 
                    name: "responses",
                    ClientId: "SPPC",
                    httpMethod: 'POST',
                    FormId: 'F00001',
                    body: '{}',
                    UserName: 'Abc',
                    UserContact: '1919191',
                }, {}, function (err, resp) {
                    
                    console.log(err);
                    
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

describe('User API', function (params) {
    
    var userAPI = require('../module/users/index');
    
    describe('#get()', function () {
    
        describe('without ClientId', function (params) {
            
            it("should return error", function (done) {
            
                userAPI.handle({ 
                    name: "users",
                }, {}, function (err, resp) {
                    
                    should.not.exist(err);
                    should.exist(resp);
                    should.exist(resp.statusCode);
                    resp.statusCode.should.equal('400');
                    
                    done();
                });
            })
        })
        
        describe('with proper request', function (params) {
            
            it("should return missing config error", function (done) {
            
                userAPI.handle({ 
                    name: "users",
                    ClientId: "SPPC"
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
    
    describe('#post()', function () {
    
        describe('without ClientId', function (params) {
            
            it("should return error", function (done) {
            
                userAPI.handle({ 
                    name: "users",
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
        
        describe('with invalid User', function (params) {
            
            it("should return error", function (done) {
            
                userAPI.handle({ 
                    name: "users",
                    ClientId: "SPPC",
                    httpMethod: 'POST'
                }, {}, function (err, resp) {
                    
                    should.not.exist(err);
                    should.exist(resp);
                    should.exist(resp.statusCode);
                    resp.statusCode.should.equal('400');
                    
                    userAPI.handle({ 
                        name: "users",
                        ClientId: "SPPC",
                        httpMethod: 'POST',
                        FirstName: 'Andrew'
                    }, {}, function (err, resp) {
                        
                        should.not.exist(err);
                        should.exist(resp);
                        should.exist(resp.statusCode);
                        resp.statusCode.should.equal('400');
                        
                        userAPI.handle({ 
                            name: "users",
                            ClientId: "SPPC",
                            httpMethod: 'POST',
                            FirstName: 'Andrew',
                            Contact: 'ABC'
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
        
        describe('with valid user', function (params) {
            
            it("should return missing config error", function (done) {
            
                userAPI.handle({ 
                    "httpMethod": "POST",
                    "FirstName": "Suresh",
                    "Contact": "98979898989",
                    "LastName": "Jain",
                    "Type": "Patient",
                    "name": "users",
                    "ClientId": "SPPC"
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

describe('Forms API', function (params) {
    
    var formsAPI = require('../module/forms/index');
    
    describe('#get()', function () {
    
        describe('without ClientId', function (params) {
            
            it("should return error", function (done) {
            
                formsAPI.handle({ 
                    name: "forms",
                }, {}, function (err, resp) {
                    
                    should.not.exist(err);
                    should.exist(resp);
                    should.exist(resp.statusCode);
                    resp.statusCode.should.equal('400');
                    
                    done();
                });
            })
        })
        
        describe('with proper request', function (params) {
            
            it("should return missing config error", function (done) {
            
                formsAPI.handle({ 
                    name: "forms",
                    ClientId: "SPPC"
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
    
    describe('#post()', function () {
    
        describe('without ClientId', function (params) {
            
            it("should return error", function (done) {
            
                formsAPI.handle({ 
                    name: "forms",
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
        
        describe('with invalid Form', function (params) {
            
            it("should return error", function (done) {
            
                formsAPI.handle({ 
                    name: "forms",
                    ClientId: "SPPC",
                    httpMethod: 'POST'
                }, {}, function (err, resp) {
                    
                    should.not.exist(err);
                    should.exist(resp);
                    should.exist(resp.statusCode);
                    resp.statusCode.should.equal('400');
                    
                    formsAPI.handle({ 
                        name: "forms",
                        ClientId: "SPPC",
                        httpMethod: 'POST',
                        Name: "Sample"
                    }, {}, function (err, resp) {
                        
                        should.not.exist(err);
                        should.exist(resp);
                        should.exist(resp.statusCode);
                        resp.statusCode.should.equal('400');
                        
                        resp.body.should.not.equal('Missing region in config');
                            
                        done();
                    });
                });
            })
        })
        
        describe('with valid form', function (params) {
            
            it("should return missing config error", function (done) {
            
                formsAPI.handle({ 
                    name: "forms",
                    ClientId: "SPPC",
                    httpMethod: 'POST',
                    Name: "Sample",
                    form: "{}"
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
    
   
    describe('#delete() with FormID, ClientId', function (params) {
        
        it("should not return any error", function (done) {
        
            formsAPI.handle({ 
                name: "form",
                "httpMethod": "DELETE",
                "ClientId": "SPPC",
                "FormId": "F00001"
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
   
    describe('#put() with FormID, ClientId and some attribute', function (params) {
        
        it("should not return any error", function (done) {
        
            formsAPI.handle({ 
                name: "form",
                "httpMethod": "PUT",
                "ClientId": "SPPC",
                "FormId": "F00001",
		"Desc": "Desc"
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
})
