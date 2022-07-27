const expect = require('chai').expect;
const request = require('request');
const sinon = require('sinon');
const index = require('./index');

describe('with mock: getUsers', () => {
    it('should getUsers', (done) => {
        let requestMock = sinon.mock(request);
        const myProfile = [
        // {
        //     "name":"karthik",
        //     "email":"karthik@gmail.com",
        //     "phone":8897412547,
        //     "address":"boyapalli"
        // },
        {
            "name":"vamshi",
            "email":"vamshi@gmail.com",
            "phone":9630212145,
            "address":"Achlapur"
        },{
            "name":"prathyusha",
            "email":"prathyusha@gmail.com",
            "phone":9987456321,
            "address":"Bode"
        },{
            "name":"pragathi",
            "email":"pragathi@gmail.com",
            "phone":8852147596,
            "location":"IB"
        },
    ];

        requestMock.expects("get")
            .once()
            .withArgs('http://localhost:3000/retrive')
            .yields(null, null, JSON.stringify(myProfile));

        index.getUsers().then((users) => {
            expect(users.length).to.equal(3);
            users.forEach((user) => {
                expect(user).to.have.property('name');
                expect(user).to.have.property('email');
                expect(user).to.have.property('address');
                expect(user).to.have.property('phone');
            });

            requestMock.verify();
            requestMock.restore();
            done();
        }).catch(done);
    });
});