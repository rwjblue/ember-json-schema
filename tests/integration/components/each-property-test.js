import { moduleForComponent, test } from 'ember-qunit';
import Schema from 'ember-json-schema/models/schema';
import hbs from 'htmlbars-inline-precompile';

Error.stackTraceLimit = 100;

let flatSchema = {
  '$schema': 'http://json-schema.org/draft-04/schema#',
  'id': 'http://jsonschema.net',
  'type': 'object',
  'properties': {
    'primaryLocation': {
      'id': 'http://jsonschema.net/0/primary',
      'title': 'Primary location',
      'type': 'boolean',
      'default': false
    },
    'description': {
      'id': 'http://jsonschema.net/description',
      'title': 'Description',
      'default': 'Headquarters',
      'type': 'string'
    },
    'city': {
      'id': 'http://jsonschema.net/city',
      'title': 'City',
      'type': 'string'
    },
    'state': {
      'id': 'http://jsonschema.net/state',
      'title': 'State',
      'type': 'string',
      'enum': ['RI', 'NY', 'IN', 'CA', 'UT', 'CO']
    },
    'zip': {
      'id': 'http://jsonschema.net/state',
      'title': 'Zip',
      'type': 'string'
    }
  },
  'required': [
    'description'
  ]
};

let nestedSchema = {
  '$schema': 'http://json-schema.org/draft-04/schema#',
  'id': 'http://jsonschema.net',
  'type': 'object',
  'properties': {
    'primaryLocation': {
      'id': 'http://jsonschema.net/0/primary',
      'title': 'Primary location',
      'type': 'boolean',
      'default': false
    },
    'description': {
      'id': 'http://jsonschema.net/description',
      'type': 'string',
      'default': 'Headquarters',
      'title': 'Description'
    },
    'address': {
      'id': 'http://jsonschema.net/address',
      'type': 'object',
      'properties': {
        'streetAddress': {
          'id': 'http://jsonschema.net/address/streetAddress',
          'type': 'string'
        },
        'city': {
          'id': 'http://jsonschema.net/address/city',
          'type': 'string'
        },
        'state': {
          'id': 'http://jsonschema.net/address/state',
          'type': 'string',
          'enum': [ 'RI', 'NY', 'IN', 'CA', 'UT', 'CO']
        },
        'zip': {
          'id': 'http://jsonschema.net/address/zip',
          'type': 'string'
        }
      },
      'required': [
        'streetAddress',
        'city'
      ]
    }
  },
  'required': [
    'description',
    'address'
  ]
};

moduleForComponent('each-property', {
  integration: true
});

test('can render flat schema document properties', function(assert) {
  let schema = new Schema(flatSchema);
  let { properties } = schema;
  let document = schema.buildDocument();

  this.setProperties({ document, properties });

  this.render(hbs`
    {{#each-property properties=properties as |key property type|}}
      {{component (concat 'schema-field-' type) key=key property=property document=document}}
    {{/each-property}}
  `);

  assert.equal(this.$('input[type="radio"][name="primaryLocation"]').length, 2, 'has two radios');
  assert.equal(this.$('input[type="text"][name="description"]').length, 1, 'has a description text field');
  assert.equal(this.$('input[type="text"][name="description"]').val(), 'Headquarters', 'description has default value');
  assert.equal(this.$('input[type="text"][name="city"]').length, 1, 'has a city text field');
  assert.equal(this.$('select[name="state"]').length, 1, 'has a state select');
  assert.equal(this.$('select[name="state"] option').length, 6, 'has 6 choices');
  assert.equal(this.$('input[type="text"][name="zip"]').length, 1, 'has a zip text field');
});

test('can render nested schema document properties', function(assert) {
  let schema = new Schema(nestedSchema);
  let { properties } = schema;
  let document = schema.buildDocument();

  this.setProperties({ document, properties });

  this.render(hbs`
    {{#each-property properties=properties as |key property type|}}
      {{component (concat 'schema-field-' type) key=key property=property document=document}}
    {{/each-property}}
  `);

  assert.equal(this.$('input[type="radio"][name="primaryLocation"]').length, 2, 'has two radios');
  assert.equal(this.$('input[type="text"][name="description"]').length, 1, 'has a description text field');
  assert.equal(this.$('input[type="text"][name="description"]').val(), 'Headquarters', 'description has default value');
  assert.equal(this.$('input[type="text"][name="address.city"]').length, 1, 'has a city text field');
  assert.equal(this.$('select[name="address.state"]').length, 1, 'has a state select');
  assert.equal(this.$('select[name="address.state"] option').length, 6, 'has 6 choices');
  assert.equal(this.$('input[type="text"][name="address.zip"]').length, 1, 'has a zip text field');
});