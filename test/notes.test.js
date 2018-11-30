const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const app = require('../server');

const { TEST_MONGODB_URI } = require('../config');

const Note = require('../models/note');
const Folder = require('../models/folder');

const { notes, folders } = require('../db/seed/data');

const expect = chai.expect;
chai.use(chaiHttp);

describe('Notes api', function() {
    before(function () {
        return mongoose.connect(TEST_MONGODB_URI, { useNewUrlParser: true })
            .then(() => mongoose.connection.db.dropDatabase());
    });

    beforeEach(function () {
        return Folder.insertMany(folders);
    });

    beforeEach(function () {
        return Note.insertMany(notes);
    });

    afterEach(function () {
        return mongoose.connection.db.dropDatabase();
    });

    after(function () {
        return mongoose.disconnect();
    });

    describe('GET /api/notes', function() {
        it('should return all notes in db', function() {
            let data;
            return Note.find()
            .then(_data => {
                data = _data;
                expect(data).to.have.lengthOf.at.least(1);
                expect(data).to.be.an('array');
                return chai.request(app).get('/api/notes');
            })
            .then((res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('array');
                expect(res.body).to.have.lengthOf.at.least(1);
                expect(res.body.count).to.equal(data.count);
            })
        });
    });
    
    describe('GET /api/notes/:id', function () {
        it('should return correct note', function () {
            let data;
            // 1) First, call the database
            return Note.findOne()
            .then(_data => {
                data = _data;
                // 2) then call the API with the ID
                return chai.request(app).get(`/api/notes/${data.id}`);
            })
            .then((res) => {
                expect(res).to.have.status(200);
                expect(res).to.be.json;

                expect(res.body).to.be.an('object');
                expect(res.body).to.have.keys('id', 'title', 'content', 'folderId', 'createdAt', 'updatedAt');
                console.log('FLAG', data.folderId, res.body.folderId)
                // 3) then compare database results to API response
                expect(res.body.id).to.equal(data.id);
                expect(res.body.title).to.equal(data.title);
                expect(res.body.content).to.equal(data.content);
                expect(res.body.folderId).to.equal(data.folderId.toString());
                expect(new Date(res.body.createdAt)).to.eql(data.createdAt);
                expect(new Date(res.body.updatedAt)).to.eql(data.updatedAt);
            });
        });
    })

    describe('POST /api/notes', function () {
        it('should create and return a new item when provided valid data', function () {
            const newItem = {
            'title': 'The best article about cats ever!',
            'content': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor...',
            'folderId': '111111111111111111111103'
            };

            let res;
            // 1) First, call the API
            return chai.request(app).post('/api/notes').send(newItem)
            .then(function (_res) {
                res = _res;
                expect(res).to.have.status(201);
                expect(res).to.have.header('location');
                expect(res).to.be.json;
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.keys('id', 'title', 'folderId', 'content', 'createdAt', 'updatedAt');
                // 2) then call the database
                return Note.findById(res.body.id);
            })
            // 3) then compare the API response to the database results
            .then(data => {
                expect(res.body.id).to.equal(data.id);
                expect(res.body.title).to.equal(data.title);
                expect(res.body.content).to.equal(data.content);
                expect(res.body.folderId).to.equal(data.folderId.toString());
                expect(new Date(res.body.createdAt)).to.eql(data.createdAt);
                expect(new Date(res.body.updatedAt)).to.eql(data.updatedAt);
            });
        });
    });

    describe('UPDATE /api/notes/:id', function() {
        it('should update and return an item when provided valid data', function () {
            const updateData = {
            'title': 'The best cats ever!',
            'content': 'Lorem ipsum dolor sit amet cats.',
            'folderId': '111111111111111111111100'
            };
            let res;
            let data;
            return Note.findOne()
            .then(_data => {
                data = _data;
                // 2) then call the API with the ID
                return chai.request(app).put(`/api/notes/${data.id}`).send(updateData)
                .then(function(_res) {
                    res = _res;
                    expect(res.body).to.be.a('object');
                    expect(res.body.title).to.equal(updateData.title);
                    expect(res.body.content).to.equal(updateData.content);
                    expect(res.body.folderId).to.equal(data.folderId.toString());
                    return Note.findByIdAndUpdate(data.id, {$set: updateData}, {new: true})
                })
                .then(function(_data) {
                    data = _data
                    expect(data.title).to.equal(updateData.title);
                    expect(data.content).to.equal(updateData.content);
                    expect(data).to.be.a('object');
                })
            })
        });
    });

    describe('DELETE /api/notes/:id', function() {
        it('should delete an item and return a 204 status', function() {
            let note;
            return Note.findOne()
            .then(res => {
                note = res;
                return chai.request(app).delete(`/api/notes/${note.id}`)
                .then(res => {
                    expect(res.status).to.equal(204);
                    return Note.findByIdAndDelete(note.id)
                })
            })
        });
    });
});