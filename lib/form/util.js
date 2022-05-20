export function toArray(candidate) {
    if (candidate === undefined || candidate === false) return [];

    return Array.isArray(candidate) ? candidate : [candidate];
}

export function getFieldId(namePath, formName) {
    if (!namePath.length) return undefined;

    const mergedId = namePath.join('_');
    return formName ? `${formName}_${mergedId}` : mergedId;
}
