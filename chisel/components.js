import Edit from './Edit';
import subjectObjectBrowse from './subject.object.browse';
import subjectObjectOpen from './subject.object.open';
import subjectObjectNew from './subject.object.new';
import subjectObjectReport from './subject.object.report';

export default ({
    editor,
    subject,
    object,
    objectTitle,
    keyField,
    properties,
    cards,
    layouts,
    addMethod,
    getMethod,
    editMethod,
    browser,
    fetchMethod,
    deleteMethod,
    report,
    reports,
    nameField,
    tenantField
}) => [
    Edit({
        ...editor,
        subject,
        object,
        objectTitle,
        keyField,
        properties,
        cards,
        layouts,
        addMethod,
        getMethod,
        editMethod
    }),
    subjectObjectBrowse({
        ...browser,
        fetchMethod,
        deleteMethod,
        subject,
        object,
        objectTitle,
        keyField,
        nameField,
        tenantField,
        properties,
        cards,
        layouts
    }),
    subjectObjectOpen({
        subject,
        object
    }),
    subjectObjectNew({
        subject,
        object
    }),
    subjectObjectReport({
        ...report,
        subject,
        object,
        reports,
        properties,
        cards
    })
];
