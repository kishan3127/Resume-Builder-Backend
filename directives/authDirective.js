const { defaultFieldResolver } = require('graphql');
const { ApolloError } = require('apollo-server-express');
const { mapSchema, getDirective, MapperKind } = require('@graphql-tools/utils');


function isAuthDirectiveTransformer(schema, directiveName) {
  return mapSchema(schema, {
      [MapperKind.OBJECT_FIELD]: (fieldConfig) => {


      // Check whether this field has the specified directive
        // const upperDirective = getDirective(schema, fieldConfig, directiveName)?.[0];
             const isAuthDirective = getDirective(schema, fieldConfig, directiveName)?.[0];
        if (isAuthDirective) {

        // Get this field's original resolver
        const { resolve = defaultFieldResolver } = fieldConfig;

        // Replace the original resolver with a function that *first* calls
          fieldConfig.resolve = async function (source, args, context, info) {

            if (!context.isAuth) { 
              throw new Error("Not authorized for these values  " + info.fieldName)
                  }

          const result = await resolve(source, args, context, info);
          if (typeof result === 'string') {
            return result.toUpperCase();
          }
          return result;
        }
        return fieldConfig;
      }
    }
  });
}

module.exports = isAuthDirectiveTransformer