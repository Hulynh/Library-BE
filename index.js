const fastify = require('fastify')({
  logger: true
})
const cors = require('@fastify/cors')
const routes = require("./src/bookEndpoints")
const PORT = 3001

routes.forEach((route, index) => {
  fastify.route(route)
});

fastify.register(cors, {
  origin: true
})

fastify.get('/api', async () => {
  return {
    Test: 'WORKING'
  }
})

const serve = async () => {
  try {
    await fastify.listen(PORT)
    fastify.log.info(`Server listening to PORT ${fastify.server.address().port}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
serve()