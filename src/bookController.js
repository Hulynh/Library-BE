const boom = require('boom')
var client = require('./elasticsearch')
// get all books
exports.getAllBooks = async (req, reply) => {
    try {
        const res = await client.search({
            index: 'library',
            type: 'book',
        });
        return reply.code(200)
            .send({ Message: "Success", data: res.hits.hits.map((value) => value._source) },)
    }
    catch (err) {
        throw boom.boomify(error)
    }
}
//get a single book by id
exports.getSingleBook = async (req, reply) => {
    try {
        const res = await client.get({
            index: 'library',
            type: "book",
            id: req.params.id
        })
        return reply.code(200)
            .send({ Message: "Success", data: res._source },)
    }
    catch (err) {
        throw boom.boomify(error)
    }
}
//add a new book
exports.addNewBook = async (req, reply) => {
    try {
        await client.index({
            index: 'library',
            id: req.body.id,
            type: 'book',
            body: {
                "id": req.body.id,
                "title": req.body.title,
                "author": req.body.author,
                "publishedDate": req.body.publishedDate,
                "description": req.body.description,
                "price": req.body.price
            }
        });
        return reply.code(200)
            .send({ Message: "New Book added successfully", data: req.body })
    }
    catch (err) {
        throw boom.boomify(error)
    }
}
//edit a book
exports.updateBook = async (req, reply) => {

    try {
        const { title, author, publishedDate, description, price } = req.query
        const query = {};
        if (title) {
            query.title = title
        }
        if (author) {
            query.author = author
        }
        if (publishedDate) {
            query.publishedDate = publishedDate
        }
        if (description) {
            query.description = description
        }
        if (price) {
            query.price = Number(price)
        }
        await client.bulk({
            index: 'library',
            type: 'book',
            body: [
                { update: { _id: req.params.id } },
                { doc: query }
            ],
        });
        const res = await client.get({
            index: 'library',
            type: "book",
            id: req.params.id
        })
        return reply.code(200)
            .send({ Message: "Book updated successfully", data: res });
    }
    catch (err) {
        throw boom.boomify(error)
    }
}
