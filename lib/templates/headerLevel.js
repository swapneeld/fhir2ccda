"use strict";

var _ = require('lodash');
var jsonave = require('jsonave');

var fieldLevel = require('./fieldLevel');
var leafLevel = require('./leafLevel');

var jp = jsonave.instance;

exports.guardian = {
    content: {
        name: 'guardian',
        children: {
            arrayContent: [{
                    content: {
                        name: 'code',
                        attr: leafLevel.code
                    },
                    dataKey: 'relationship[0].coding[0]'
                }, {
                    value: fieldLevel.usRealmAddress,
                    dataKey: 'address'
                },
                fieldLevel.telecom, {
                    content: {
                        name: 'guardianPerson',
                        children: {
                            arrayContent: [{
                                value: fieldLevel.usRealmName,
                                dataKey: 'name'
                            }]
                        }
                    }
                }
            ]
        }
    }
};

exports.patient = {
    content: {
        name: 'patient',
        children: {
            arrayContent: [{
                value: fieldLevel.usRealmName,
                dataKey: 'name[0]'
            }, {
                content: {
                    name: 'administrativeGenderCode',
                    attr: {
                        content: {
                            code: {
                                value: leafLevel.codeToValueSet('genderCode')
                            },
                            displayName: {
                                value: leafLevel.codeToValueSet('genderDisplay')
                            },
                            codeSystem: '2.16.840.1.113883.5.1',
                        }
                    }
                },
                dataKey: 'gender'
            }, {
                content: {
                    name: 'birthTime',
                    'attr.value': {
                        value: leafLevel.date
                    }
                },
                dataKey: 'birthDate'
            }, {
                content: {
                    name: 'maritalStatusCode',
                    attr: {
                        content: {
                            code: function (input) {
                                return input.substring(0, 1);
                            },
                            displayName: _.identity,
                            codeSystem: '2.16.840.1.113883.5.2'
                        }
                    }
                },
                dataKey: 'maritalStatus.coding[0].display'
            }, {
                content: {
                    name: 'religiousAffiliationCode',
                    attr: {
                        value: leafLevel.directConcept,
                        dataKey: jp('extension[?(@.url==="http://hl7.org/fhir/StructureDefinition/us-core-religion")].valueCodeableConcept.coding[0]'),
                        single: true
                    }
                }
            }, {
                content: {
                    name: 'raceCode',
                    attr: {
                        value: leafLevel.directConcept,
                        dataKey: jp('extension[?(@.url==="http://hl7.org/fhir/StructureDefinition/us-core-race")].valueCodeableConcept.coding[0]'),
                        single: true
                    }
                }
            }, {
                content: {
                    name: 'ethnicGroupCode',
                    attr: {
                        value: leafLevel.directConcept,
                        dataKey: jp('extension[?(@.url==="http://hl7.org/fhir/StructureDefinition/us-core-ethnicity")].valueCodeableConcept.coding[0]'),
                        single: true
                    }
                }
            }, {
                value: exports.guardian,
                dataKey: jp('contact[*].relationship[*].coding[?(@.code==="PRN")].^.^.^.^')
            }, {
                content: {
                    name: 'birthplace',
                    children: {
                        arrayContent: [{
                            content: {
                                name: 'place',
                                children: {
                                    arrayContent: [
                                        fieldLevel.usRealmAddress,
                                    ]
                                }
                            }
                        }]
                    }
                },
                dataKey: jp('extension[?(@.url==="http://hl7.org/fhir/StructureDefinition/birthPlace")].valueAddress')
            }, {
                content: {
                    name: 'languageCommunication',
                    children: {
                        arrayContent: [{
                            content: {
                                name: 'languageCode',
                                'attr.code': _.identity
                            },
                            dataKey: 'language.coding[0].code'
                        }, {
                            content: {
                                name: 'preferenceInd',
                                'attr.value': _.identity
                            },
                            dataKey: 'preferred'
                        }]
                    }
                },
                dataKey: 'communication'
            }]
        }
    }
};

exports.providerOrganization = {
    content: {
        name: 'providerOrganization',
        children: {
            arrayContent: [{
                    content: {
                        name: 'name',
                        text: _.identity
                    },
                    dataKey: 'name'
                },
                fieldLevel.telecom, {
                    value: fieldLevel.usRealmAddress,
                    dataKey: 'address'
                }
            ]
        }
    },
    dataKey: jp('managingOrganization.reference.getById()')
};

exports.recordTarget = {
    content: {
        name: 'recordTarget',
        children: {
            content: {
                name: 'patientRole',
                children: {
                    arrayContent: [
                        fieldLevel.id, {
                            value: fieldLevel.usRealmAddress,
                            dataKey: 'address'
                        },
                        fieldLevel.telecom,
                        exports.patient,
                        exports.providerOrganization
                    ]
                }
            },
            multiple: true
        }
    },
    dataKey: 'byType.patient'
};
