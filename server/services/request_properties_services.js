'use strict';

module.exports = (db, domain) => {

    return {
        getProperties : getProperties,
        postProperty : postProperty,
    }

    function getProperties(propertyTable) {
        if (!propertyTable)
            return Promise.reject('Parameter not valid.')

        const propertyValid = domain.isPropertyValid(propertyTable);

        if (!propertyValid)
            return Promise.reject(`Property '${propertyTable}' not valid.`);

        return db.getProperties(propertyValid.redirectTo.table);
    }

    function postProperty(propertyTable, property_to_add) {
        if (!propertyTable)
            return Promise.reject('Parameter not valid.')
        if (!property_to_add)
            return Promise.reject(`Attribute 'property_to_add' in body not found.`)

        const propertyValid = domain.isPropertyValid(propertyTable);

        if (!propertyValid)
            return Promise.reject(`Property '${propertyTable}' not valid.`);

        const db_model = propertyValid.redirectTo;

        return db.findPropertyByKey(db_model.table, property_to_add, db_model.key)
            .then(exists => {
                if (exists) return Promise.reject(`${property_to_add} of ${propertyTable} type already exists.`)
                return db.postProperty(propertyValid.redirectTo.table, property_to_add);
            })
    }

}