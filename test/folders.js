const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const app = require('../server');

const { TEST_MONGODB_URI } = require('../config');

const Folder = require('../models/folder');

const { folders } = require('../db/seed/data');

const expect = chai.expect;
chai.use(chaiHttp);

describe('Folders api', function() {
    before(function () {
        return mongoose.connect(TEST_MONGODB_URI, { useNewUrlParser: true })
            .then(() => mongoose.connection.db.dropDatabase());
    });

    beforeEach(function () {
        return Folder.insertMany(folders);
    });

    afterEach(function () {
        return mongoose.connection.db.dropDatabase();
    });

    after(function () {
        return mongoose.disconnect();
    });

    describe('GET /api/folders', function() {
        it('should return all folders in db', function() {
            let data;
            return Folder.find()
            .then(_data => {
                data = _data;
                expect(data).to.have.lengthOf.at.least(1);
                expect(data).to.be.an('array');
                return chai.request(app).get('/api/folders');
            })
            .then((res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('array');
                expect(res.body).to.have.lengthOf.at.least(1);
                expect(res.body.count).to.equal(data.count);
            })
        });
    });

    describe('GET /api/folders/:id', function () {
        it('should return correct folder', function () {
            let data;
            // 1) First, call the database
            return Folder.findOne()
            .then(_data => {
                data = _data;
                // 2) then call the API with the ID
                return chai.request(app).get(`/api/folders/${data.id}`);
            })
            .then((res) => {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.keys('name', 'id', 'createdAt', 'updatedAt');

                // 3) then compare database results to API response
                expect(res.body.name).to.equal(data.name);
                expect(res.body.id).to.equal(data.id);
                expect(new Date(res.body.createdAt)).to.eql(data.createdAt);
                expect(new Date(res.body.updatedAt)).to.eql(data.updatedAt);
            });
        });
    })

    describe('POST /api/folders', function () {
        it('should create and return a new item when provided valid data', function () {
            const newItem = {
                'name': 'Some Folder'
            };

            let res;
            // 1) First, call the API
            return chai.request(app).post('/api/folders').send(newItem)
            .then(function (_res) {
                res = _res;
                expect(res).to.have.status(201);
                expect(res).to.have.header('location');
                expect(res).to.be.json;
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.keys('name' , 'id', 'createdAt', 'updatedAt');
                // 2) then call the database
                return Folder.findById(res.body.id);
            })
            // 3) then compare the API response to the database results
            .then(data => {
                console.log('FLAG', data)
                console.log(res.body.name, data.name)
                expect(res.body.name).to.equal(data.name);
                expect(new Date(res.body.createdAt)).to.eql(data.createdAt);
                expect(new Date(res.body.updatedAt)).to.eql(data.updatedAt);
            });
        });
    });

    describe('UPDATE /api/folders/:id', function() {
        it('should update and return an item when provided valid data', function () {
            const updateData = {
                'name': 'New Folder NAME'
            };
            let res;
            let data;
            return Folder.findOne()
            .then(_data => {
                data = _data;
                // 2) then call the API with the ID
                return chai.request(app).put(`/api/folders/${data.id}`).send(updateData)
                .then(function(_res) {
                    res = _res;
                    expect(res.body).to.be.a('object');
                    expect(res.body.name).to.equal(updateData.name);
                    return Folder.findByIdAndUpdate(data.id, {$set: updateData}, {new: true})
                })
                .then(function(_data) {
                    data = _data
                    expect(data.name).to.equal(updateData.name);
                    expect(data).to.be.a('object');
                })
            })
        });
    });

    describe('DELETE /api/folders/:id', function() {
        it('should delete a folder and return a 204 status', function() {
            let folder;
            return Folder.findOne()
            .then(res => {
                folder = res;
                return chai.request(app).delete(`/api/folders/${folder.id}`)
                .then(res => {
                    expect(res.status).to.equal(204);
                    return Folder.findByIdAndDelete(folder.id)
                })
            })
        });
    });

});