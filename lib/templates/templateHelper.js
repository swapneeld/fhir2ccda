"use strict";

exports.section = function (topTemplate) {
    return {
        content: {
            name: 'component',
            children: {
                arrayContent: [
                    topTemplate
                ]
            }
        },
        existsWhen: topTemplate.existsWhen
    };
};

exports.constAttrChild = function (name, attr) {
    return {
        content: {
            name: name,
            attr: {
                constant: attr
            }
        }
    };
};
