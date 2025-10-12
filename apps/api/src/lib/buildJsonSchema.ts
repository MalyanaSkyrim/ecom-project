import { BuildJsonSchemasOptions } from 'fastify-zod'
import z from 'zod'

/**
 *
 * This function recursively processes a JSON schema object to ensure that:
 * 1. `additionalProperties` is set to `false` for strict objects with defined properties.
 * 2. `additionalProperties` is set to `true` for empty objects or objects without defined properties.
 *
 * @param schema The JSON schema object to process
 *
 *
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleAdditionalProperties = (schema: any) => {
  if (schema?.type === 'object') {
    // If additionalProperties is not set, determine based on object type
    if (!('additionalProperties' in schema)) {
      // Empty objects or objects without defined properties should allow additional properties
      if (!schema.properties || Object.keys(schema.properties).length === 0) {
        schema.additionalProperties = true
      } else {
        // Strict objects with defined properties should disallow additional properties
        schema.additionalProperties = false
      }
    }
    // If additionalProperties is already set (true, false, or {}), leave it as is
  }

  // Handle nested objects in properties
  if (schema.properties && typeof schema.properties === 'object') {
    Object.values(schema.properties).forEach(handleAdditionalProperties)
  }

  // Handle anyOf arrays (for union types)
  if (Array.isArray(schema.anyOf)) {
    schema.anyOf.forEach(handleAdditionalProperties)
  }

  // Handle oneOf arrays
  if (Array.isArray(schema.oneOf)) {
    schema.oneOf.forEach(handleAdditionalProperties)
  }

  // Handle allOf arrays
  if (Array.isArray(schema.allOf)) {
    schema.allOf.forEach(handleAdditionalProperties)
  }

  // Handle array items
  if (schema.items) {
    handleAdditionalProperties(schema.items)
  }

  // Handle definitions (for referenced schemas)
  if (schema.definitions && typeof schema.definitions === 'object') {
    Object.values(schema.definitions).forEach(handleAdditionalProperties)
  }

  // Handle components.schemas (for OpenAPI schemas)
  if (
    schema.components &&
    schema.components.schemas &&
    typeof schema.components.schemas === 'object'
  ) {
    Object.values(schema.components.schemas).forEach(handleAdditionalProperties)
  }
}

type SchemaKey<M extends Models> =
  M extends Models<infer Key> ? Key & string : never
type SchemaKeyOrDescription<M extends Models> =
  | SchemaKey<M>
  | {
      readonly description: string
      readonly key: SchemaKey<M>
    }

type $Ref<M extends Models> = (key: SchemaKeyOrDescription<M>) => {
  readonly $ref: string
  readonly description?: string
}

export type JsonSchema = {
  readonly $id: string
  [key: string]: unknown
}

type Models<Key extends string = string> = {
  readonly [K in Key]: z.ZodType<unknown>
}

export type BuildJsonSchemasResult<M extends Models> = {
  readonly schemas: JsonSchema[]
  readonly $ref: $Ref<M>
}

export const findInvalidSchemas = (
  schema: z.ZodType | z.core.$ZodType,
  map: Record<string, 'version3' | 'invalid'> = {},
  path: string = 'root',
  visited = new Set<z.ZodType | z.core.$ZodType>(),
): Record<string, 'version3' | 'invalid'> => {
  if (visited.has(schema)) {
    return map
  }
  visited.add(schema)

  if (
    schema instanceof z.ZodTransform ||
    schema instanceof z.ZodDate ||
    schema instanceof z.ZodBigInt ||
    schema instanceof z.ZodBigIntFormat ||
    schema instanceof z.ZodSymbol ||
    schema instanceof z.ZodVoid ||
    schema instanceof z.ZodMap ||
    schema instanceof z.ZodNaN ||
    schema instanceof z.ZodCustom
  ) {
    return {
      ...map,
      [path]: 'invalid',
    }
  }

  if (schema instanceof z.ZodObject) {
    return Object.entries(schema.shape).reduce((prev, [key, value]) => {
      return findInvalidSchemas(value, prev, `${path}.${key}`, visited)
    }, map)
  }

  if (schema instanceof z.ZodUnion) {
    return schema.def.options.reduce((prev, option) => {
      return findInvalidSchemas(option, prev, path, visited)
    }, map)
  }

  if (schema instanceof z.ZodIntersection) {
    return {
      ...findInvalidSchemas(schema.def.left, map, path, visited),
      ...findInvalidSchemas(schema.def.right, map, path, visited),
    }
  }

  if (
    schema instanceof z.ZodOptional ||
    schema instanceof z.ZodNullable ||
    schema instanceof z.ZodDefault
  ) {
    return findInvalidSchemas(schema.def.innerType, map, path, visited)
  }

  if (schema instanceof z.ZodArray) {
    return findInvalidSchemas(schema.element, map, path, visited)
  }

  if (schema instanceof z.ZodRecord) {
    return findInvalidSchemas(schema.valueType, map, path, visited)
  }

  if (schema instanceof z.ZodPipe) {
    return {
      ...findInvalidSchemas(schema.def.in, map, path, visited),
      ...findInvalidSchemas(schema.def.out, map, path, visited),
    }
  }

  if (schema instanceof z.ZodLazy) {
    return findInvalidSchemas(schema._zod.def.getter(), map, path, visited)
  }

  return map
}

export const buildJsonSchemas = <M extends Models>(
  models: M,
  opts: BuildJsonSchemasOptions = {},
): BuildJsonSchemasResult<M> => {
  const $id = opts.$id ?? 'Schema'

  const zodSchema = z.object(models)

  const invalidSchemas = findInvalidSchemas(zodSchema, {}, opts.$id)

  const nestedV3SchemasList = Object.entries(invalidSchemas).filter(
    ([, value]) => value === 'version3',
  )

  const invalidSchemasList = Object.entries(invalidSchemas).filter(
    ([, value]) => value === 'invalid',
  )

  if (nestedV3SchemasList.length > 0)
    console.error(
      `❌ Found nested v3 schemas: `,
      nestedV3SchemasList.map(([key]) => key),
    )

  if (invalidSchemasList.length > 0)
    console.warn(
      `⚠️ Found unsupported schemas: `,
      invalidSchemasList.map(([key]) => key),
    )

  /**
   * Ajv does not support json schema draft-2020-12
   * @see https://github.com/fastify/fastify/issues/5448
   */
  const zodJsonSchema = z.toJSONSchema(zodSchema, {
    target: 'draft-7',
    // reused: 'ref', // this option is not working properly
    io: 'input',
    unrepresentable: 'any',
    override: ({ jsonSchema }) => {
      /**
       * When build a JSON schema from a Zod schema V4, we specify the target as draft-7.
       * However, for the nullable type, draft-7 will generate an `anyOf` array with `null` type.
       *
       *   ZodV4 schema:                Builded JSON schema with draft-7 target:
       ** ╭───────────────────────╮    ╭───────────────────────────────────────────────────╮
       ** │ z.string().nullable() │ -> │ { anyOf: [{ type: 'string' }, { type: 'null' }] } │
       ** ╰───────────────────────╯    ╰───────────────────────────────────────────────────╯
       *
       * We need to remove the `null` type from the `anyOf` array and set `nullable: true` on the other types.
       ** ╭───────────────────────────────────────────────────╮    ╭─────────────────────────────────────────────────╮
       ** │ { anyOf: [{ type: 'string' }, { type: 'null' }] } │ -> │ { anyOf: [{ type: 'string', nullable: true }] } │
       ** ╰───────────────────────────────────────────────────╯    ╰─────────────────────────────────────────────────╯
       *
       * This is done to ensure compatibility with Ajv, which does not support the `null` type in the `anyOf` array.
       * If we don't do this, null values will be coerced to empty strings, 0 to false, etc... chaos ensues.
       * @see https://ajv.js.org/coercion.html
       */
      if (
        jsonSchema.anyOf &&
        jsonSchema.anyOf.length > 1 &&
        jsonSchema.anyOf.some(({ type }) => type === 'null')
      ) {
        jsonSchema.anyOf.forEach((item) => {
          if (item.type !== 'null' && item.type) item.nullable = true
        })
        jsonSchema.anyOf = jsonSchema.anyOf.filter(
          (item) => item.type !== 'null',
        )
      }

      if ('pattern' in jsonSchema) {
        // Remove the pattern property from the JSON schema
        delete jsonSchema.pattern
      }

      if (
        'maximum' in jsonSchema &&
        jsonSchema.maximum === Number.MAX_SAFE_INTEGER
      ) {
        delete jsonSchema.maximum
      }

      handleAdditionalProperties(jsonSchema)
    },
  })

  const jsonSchema = {
    ...zodJsonSchema,
    $id,
  }

  const $ref: $Ref<M> = (key) => {
    const isKeyObject = typeof key === 'object' && key !== null && 'key' in key
    const refKey = isKeyObject ? key.key : key

    const $ref = `${$id}#/properties/${refKey}`

    return isKeyObject ? { $ref, description: key.description } : { $ref }
  }

  return {
    schemas: [jsonSchema],
    $ref,
  }
}
