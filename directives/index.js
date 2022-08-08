const isAuthDirectiveTransformer = require("./authDirective")
const upperDirectiveTransformer = require("./upper")

const schemaDirectives = [isAuthDirectiveTransformer,upperDirectiveTransformer]

module.exports =  schemaDirectives