const joi = require('joi');

function schema2joi(properties, forcePresence, filter, path = '') {
    return Object.entries(properties).reduce(
        (schema, [name, field]) => {
            if ('properties' in field) {
                return schema.append({[name]: schema2joi(field.properties, filter, path ? path + '.' + name : name)});
            } else {
                if (filter && !filter?.includes(path ? path + '.' + name : name)) return schema;
                const {title, validation = joi.string().min(0).allow('', null), required} = field;
                let fieldSchema = validation.label(title || name);
                if (forcePresence != null) fieldSchema = fieldSchema.presence(forcePresence);
                else if (required != null) fieldSchema = fieldSchema.presence(required ? 'required' : 'optional');
                return schema.append({[name]: fieldSchema});
            }
        },
        joi.object()
    );
};

module.exports = {
    capital: string => string.charAt(0).toUpperCase() + string.slice(1),
    schema2joi
};
