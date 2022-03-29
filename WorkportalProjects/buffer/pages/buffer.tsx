import React, { ChangeEvent, useEffect, useState } from 'react';
import { fetchMeta } from '../../lib/meta';
import Server from '../../lib/server';
import { GenericObject } from '../../types/Common';
import { bufferAttributes, bufferComponentType, bufferCompoundType, bufferInitialType, bufferLayoutRow, bufferNotesType, bufferPhType, bufferVariable_dataType } from '../../types/pages/webcontent/Buffer';
import { Routing } from '../../types/Routing';

//const s = new Server();

const bufferCategories = [
    { name: "" },
    { name: "Physiological Buffer" },
    { name: "pH Buffering" },
    { name: "Sample Preparation" },
    { name: "BioAssays" },
    { name: "Misc" },
    { name: "Cell/Culture/Growth Media" },
    { name: "Gel Electrophoresis" }
];

const notesSet: bufferNotesType = {
    final: "",
    special: null,
    additional: null
};

const phSet: bufferPhType = {
    amount: '',
    conjAmount: '',
    pH: ''
};

const singleComponentSet: bufferComponentType = {
    cID: '',
    amount: '',
    amount_type: 'g',
    concentration: '',
    concentration_type: 'M'
};

const variableComponentSet: bufferComponentType = {
    cID: '',
    amount_type: 'g',
    concentration_type: 'M'
};

const compoundSet: bufferCompoundType = {
    cID: '',
    mw: '',
    name: ''
};

const variable_dataSet: bufferVariable_dataType = {
    min_ph: '',
    max_ph: ''
};

const singleBufferAttr: bufferAttributes = {
    pH: '',
    molarity: '',
    base_solvent: '',
    source: '',
    description: '',
    type: '',
    notes: { ...notesSet },
};

const variableBufferAttr: bufferAttributes = {
    base_solvent: '',
    source: '',
    description: '',
    type: '',
    notes: { ...notesSet },
    variable_data: { ...variable_dataSet },
    phArr: []
};

const initial: bufferInitialType = {
    bufferType: 'single',
    formula_id: '',
    title: '',
    components: [{ ...singleComponentSet }],
    attributes: { ...singleBufferAttr },
    compounds: [{ ...compoundSet }]
};

//Function which pulls the molecular weight from the database for an entered compound cID
const pullCompoundsData = (ev: ChangeEvent<HTMLInputElement>, _data: React.Dispatch<React.SetStateAction<bufferInitialType>>): void => {
    const index = Number(ev.target.getAttribute('data-index'));
    const inputValue = ev.target.value;
    const compoundID = inputValue.toLowerCase()
        .replace(/[^a-z0-9]/gu, '-')
        .replace(/(?:-){2,}/gu, '-')
        .trim();
    const s = new Server<GenericObject, { mw: number; }[]>();
    s.ajax({
        url: '/webcontent/buffer/get-compounds-info',
        type: 'POST',
        data: { compoundID },
        dataType: 'application/json',
        success: (response) => {
            if (response.code === 200) {
                //console.log("The db return for pullCompoundsData is: " + JSON.stringify(response, null, 4));
                _data((old) => {
                    old.compounds[index].mw = response.data[0].mw;
                    return { ...old };
                });
            }
        }
    });
};

let timer: NodeJS.Timeout;
const debounce = (ev: ChangeEvent<HTMLInputElement>, _data: React.Dispatch<React.SetStateAction<bufferInitialType>>): void => {
    if (timer) { clearTimeout(timer); }
    timer = setTimeout(() => pullCompoundsData(ev, _data), 200);
};

//Function that clears out all input values and returns empty object with format determined by bufferType
const clearInputs = (bufferType: string, _data: React.Dispatch<React.SetStateAction<typeof initial>>): void => {
    if (bufferType === 'single') {
        const initialObj = {
            bufferType: 'single',
            formula_id: '',
            title: '',
            components: [],
            attributes: {},
            compounds: []
        };
        const initialCompArr: bufferComponentType[] = [];
        const componentSet = { ...singleComponentSet };
        initialCompArr.push(componentSet);
        const initialAttrObj = { ...singleBufferAttr };
        const initialNotes = { ...notesSet };
        const initialCompoundArr: bufferCompoundType[] = [];
        const compound = { ...compoundSet };
        initialCompoundArr.push(compound);
        _data((old) => {
            old.components = initialCompArr;
            old.attributes = initialAttrObj;
            old.attributes.notes = initialNotes;
            old.compounds = initialCompoundArr;
            return {
                ...initialObj,
                components: [...old.components],
                attributes: {
                    ...old.attributes,
                    notes: { ...old.attributes.notes }
                },
                compounds: [...old.compounds]
            };
        });
    }
    else if (bufferType === 'variable') {
        const initialObj = {
            bufferType: 'variable',
            formula_id: '',
            title: '',
            components: [],
            attributes: {},
            compounds: []
        };
        const initialCompArr: bufferComponentType[] = [];
        const compSet = { ...variableComponentSet };
        const compSet2 = { ...variableComponentSet };
        initialCompArr.push(compSet);
        initialCompArr.push(compSet2);
        const initialAttrObj = { ...variableBufferAttr };
        const initialNotes = { ...notesSet };
        const initialphArr: bufferPhType[] = [];
        const set = { ...phSet };
        initialphArr.push(set);
        const initialVarObj = { ...variable_dataSet };
        const initialCompoundArr: bufferCompoundType[] = [];
        const compound = { ...compoundSet };
        const compound2 = { ...compoundSet };
        initialCompoundArr.push(compound);
        initialCompoundArr.push(compound2);
        _data((old) => {
            old.components = initialCompArr;
            old.attributes = initialAttrObj;
            old.attributes.notes = initialNotes;
            old.attributes.phArr = initialphArr;
            old.compounds = initialCompoundArr;
            if (old.attributes.variable_data && !old.attributes.variable_data.m) {
                old.attributes.variable_data = initialVarObj;
            }
            return {
                ...initialObj,
                components: [...old.components],
                attributes: {
                    ...old.attributes,
                    phArr: [...old.attributes.phArr],
                    variable_data: { ...old.attributes.variable_data },
                    notes: { ...old.attributes.notes }
                },
                compounds: [...old.compounds]
            };
        });
    }
};

const handleRadioInput = (ev: ChangeEvent<HTMLInputElement>, _data: React.Dispatch<React.SetStateAction<typeof initial>>): void => {
    const state = ev.target.value;
    _data((old) => {
        old.bufferType = state;
        return { ...old };
    });
};

const handleInput = (ev: ChangeEvent<HTMLSelectElement> | ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>, _data: React.Dispatch<React.SetStateAction<typeof initial>>): void => {
    const inputValue = ev.target.value;
    const inputID = ev.target.id as keyof typeof singleBufferAttr | keyof typeof variableBufferAttr | keyof typeof compoundSet | keyof typeof singleComponentSet | keyof typeof variableComponentSet | keyof typeof initial;
    const key = ev.target.getAttribute('data-key');
    const index = Number(ev.target.getAttribute('data-index'));
    if (key === 'attributes') {
        if (inputID === 'notes') {
            _data((old) => {
                return {
                    ...old,
                    attributes: {
                        ...old.attributes,
                        notes: {
                            ...old.attributes.notes,
                            final: inputValue
                        }
                    }
                };
            });
        }
        else {
            _data((old) => {
                return {
                    ...old,
                    attributes: {
                        ...old.attributes,
                        [inputID]: inputValue
                    }
                };
            });
        }
    }
    else if (key === 'variable_data') {
        _data((old) => {
            return {
                ...old,
                attributes: {
                    ...old.attributes,
                    variable_data: {
                        ...old.attributes.variable_data,
                        [inputID]: inputValue
                    }
                }
            };
        });
    }
    else if (key === 'title') {
        const sanTitle = inputValue.toLowerCase()
            .replace(/[^a-z0-9]/gu, '-')
            .replace(/(?:-){2,}/gu, '-')
            .trim();
        _data((old) => {
            return {
                ...old,
                [inputID]: inputValue,
                formula_id: sanTitle
            };
        });
    }
    else if (key === 'compounds') {
        if (inputID === 'name') {
            const sanCompoundTitle = inputValue.toLowerCase()
                .replace(/[^a-z0-9]/gu, '-')
                .replace(/(?:-){2,}/gu, '-')
                .trim();
            _data((old) => {
                old.compounds[index][inputID] = inputValue;
                old.compounds[index].cID = sanCompoundTitle;
                old.components[index].cID = sanCompoundTitle;
                return {
                    ...old,
                    components: [...old.components],
                    compounds: [...old.compounds]
                };
            });
        }
        else {
            _data((old) => {
                old.compounds[index][inputID as 'cID' || 'mw'] = inputValue;
                return {
                    ...old,
                    compounds: [...old.compounds]
                };
            });
        }
    }

    else if (key === 'components') {
        _data((old) => {
            if (!old) { return old; }
            const temp = [...old.components];
            temp[index][inputID as 'cID' || 'amount' || 'amount_type' || 'concentration' || 'concentration_type'] = inputValue;
            //old.components = [...temp];
            return {
                ...old,
                components: temp
            };
        });
    }
    /*
    else if (key === 'components') {
        const inputID: keyof bufferComponentType = ev.target.id as keyof bufferComponentType;
        _data((old) => (
            {
                ...old,
                components: [
                    ...old.components,
                    [index]: {
                        ...old.components[index],
                        [inputID]: inputValue
                    }
                ]
            }
        ));
    }
    */
    else if (key === 'phArr') {
        _data((old) => {
            if (!old || typeof old.attributes.phArr === "undefined") { return old; }
            //const temp = [...old.attributes.phArr];
            //temp[index][inputID as 'amount' || 'conjAmount' || 'pH'] = inputValue;
            old.attributes.phArr[index][inputID as 'amount' || 'conjAmount || pH'] = inputValue;
            return {
                ...old,
                attributes: {
                    ...old.attributes,
                    phArr: [...old.attributes.phArr]
                }
            };
        });
    }
    else if (key === 'type') {
        _data((old) => {
            return {
                ...old,
                attributes: {
                    ...old.attributes,
                    [inputID]: inputValue
                }
            };
        });
    }
};

const TitleInput = (props: { rowLabel: string, id: string, type: string, placeholder: string, _data: React.Dispatch<React.SetStateAction<typeof initial>>, data: typeof initial; }): JSX.Element => {
    const { rowLabel, id, type, placeholder, _data, data } = props;
    return (
        <>
            <td style={{
                fontWeight: 'bold',
                width: '250px',
                verticalAlign: 'top'
            }}>{rowLabel}</td>
            <td><input
                style={{ width: '250px' }}
                id={id}
                type={type}
                data-key='title'
                value={data.title}
                placeholder={placeholder}
                onChange={(ev: ChangeEvent<HTMLInputElement>) => { handleInput(ev, _data); }}
            /></td>
        </>
    );
};

const CustomInput = (props: { rowLabel: string, id: string, type: string, placeholder: string, _data: React.Dispatch<React.SetStateAction<typeof initial>>, data: typeof initial; }): JSX.Element => {
    const { rowLabel, id, type, placeholder, _data, data } = props;
    return (
        <>
            <td style={{
                fontWeight: 'bold',
                width: '250px',
                verticalAlign: 'top'
            }}>{rowLabel}</td>
            <td><input
                style={{ width: '250px' }}
                id={id}
                type={type}
                data-key='attributes'
                value={data.attributes[id as keyof typeof singleBufferAttr | keyof typeof variableBufferAttr] as string | number}
                placeholder={placeholder}
                onChange={(ev: ChangeEvent<HTMLInputElement>) => { handleInput(ev, _data); }}
            /></td>
        </>
    );
};

const CustomSelect = (props: { id: string, data: typeof initial, _data: React.Dispatch<React.SetStateAction<typeof initial>>; }): JSX.Element => {
    const { id, data, _data } = props;
    return (
        <>
            <td></td>
            <td><select
                id={id}
                value={data.attributes.type}
                style={{ width: '250px' }}
                data-key='type'
                onChange={(ev: ChangeEvent<HTMLSelectElement>) => { handleInput(ev, _data); }}
            >
                {
                    bufferCategories.map((option, index: number) => {
                        return <option
                            key={index}
                            value={option.name}>{option.name}</option>;
                    })
                }
            </select></td>
        </>
    );
};

const InputPH = (props: { rowLabel: string, id: string, type: string, placeholder: string, _data: React.Dispatch<React.SetStateAction<typeof initial>>, data: typeof initial; }): JSX.Element => {
    const { rowLabel, id, type, placeholder, _data, data } = props;
    return (
        <>
            <td style={{
                fontWeight: 'bold',
                width: '250px',
                verticalAlign: 'top'
            }}>{rowLabel}</td>
            <td><input
                style={{ width: '250px' }}
                id={id}
                type={type}
                data-key='variable_data'
                value={data.attributes.variable_data?.[id as 'min_ph' || 'max_ph']}
                placeholder={placeholder}
                onChange={(ev: ChangeEvent<HTMLInputElement>) => { handleInput(ev, _data); }}
            /></td>
        </>
    );
};

const TextAreaDescription = (props: { rowLabel: string, id: string, placeholder: string, _data: React.Dispatch<React.SetStateAction<typeof initial>>, data: typeof initial; }): JSX.Element => {
    const { rowLabel, id, placeholder, _data, data } = props;
    return (
        <>
            <td style={{
                fontWeight: 'bold',
                width: '250px',
                verticalAlign: 'top'
            }}>{rowLabel}</td>
            <td colSpan={2}><textarea
                id={id}
                data-key='attributes'
                value={data.attributes.description}
                placeholder={placeholder}
                style={{
                    width: '500px',
                    minHeight: '200px',
                    resize: 'none'
                }}
                onChange={(ev: ChangeEvent<HTMLTextAreaElement>) => { handleInput(ev, _data); }} /></td>
        </>
    );
};

const TextAreaNotes = (props: { rowLabel: string, id: string, placeholder: string, _data: React.Dispatch<React.SetStateAction<typeof initial>>, data: typeof initial; }): JSX.Element => {
    const { rowLabel, id, placeholder, _data, data } = props;
    return (
        <>
            <td style={{
                fontWeight: 'bold',
                width: '250px',
                verticalAlign: 'top'
            }}>{rowLabel}</td>
            <td colSpan={2}><textarea
                id={id}
                data-key='attributes'
                value={data.attributes.notes.final}
                placeholder={placeholder}
                style={{
                    width: '500px',
                    minHeight: '200px',
                    resize: 'none'
                }}
                onChange={(ev: ChangeEvent<HTMLTextAreaElement>) => { handleInput(ev, _data); }} /></td>
        </>
    );
};

//Handles manipulation (adding or deleting) of rows for the components table.
const rows = (ev: React.MouseEvent<HTMLElement>, data: typeof initial, _data: React.Dispatch<React.SetStateAction<typeof initial>>): void => {
    const inputID = ev.currentTarget.id;
    const index = Number(ev.currentTarget.getAttribute('data-index'));
    if (data.bufferType === 'single') {
        const newRows = [...data.components];
        const newCompRows = [...data.compounds];
        if (inputID === 'addRow') {
            const x = { ...singleComponentSet };
            newRows.push(x);
            const y = { ...compoundSet };
            newCompRows.push(y);
        }
        else if (inputID === 'deleteRow') {
            newRows.splice(index, 1);
            newCompRows.splice(index, 1);
        }
        _data((old) => {
            old.components = newRows;
            old.compounds = newCompRows;
            return { ...old };
        });
    }
    else if (data.bufferType === 'variable') {
        if (typeof data.attributes.phArr === "undefined") { return; }
        const newRows = [...data.attributes.phArr];
        if (inputID === 'addRow') {
            const x = { ...phSet };
            newRows.push(x);
        }
        else if (inputID === 'deleteRow') {
            newRows.splice(index, 1);
        }
        _data((old) => {
            old.attributes.phArr = newRows;
            return {
                ...old,
                attributes: {
                    ...old.attributes,
                    phArr: [...old.attributes.phArr]
                }
            };
        });
    }
};

//Table display for components of single buffer.
const CustomTableS = (props: {
    data: typeof initial,
    _data: React.Dispatch<React.SetStateAction<typeof initial>>;
}): JSX.Element => {
    const { data, _data } = props;
    return (
        <>
            <td colSpan={2}>
                Components:
                <table style={{
                    tableLayout: 'auto',
                    width: '250px',
                    textAlign: 'center'
                }}>
                    <thead style={{ fontWeight: 'bold' }}>
                        <tr>
                            <td>Component Name</td>
                            <td>grams/Liter</td>
                            <td>Initial molarity of component stock</td>
                            <td>Molecular weight</td>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        {data.components && data.compounds && data.compounds.map((param: bufferCompoundType, index: number) => {
                            return (
                                <tr key={index}>
                                    <td><input
                                        type='text'
                                        placeholder='Acid/Base'
                                        value={param.name}
                                        id='name'
                                        data-key='compounds'
                                        data-index={index}
                                        onChange={(ev: ChangeEvent<HTMLInputElement>) => { handleInput(ev, _data); debounce(ev, _data); }}
                                    /></td>
                                    <td><input
                                        type='number'
                                        value={data.components[index].amount}
                                        id='amount'
                                        data-key='components'
                                        data-index={index}
                                        onChange={(ev: ChangeEvent<HTMLInputElement>) => { handleInput(ev, _data); }}
                                    /></td>
                                    <td><input
                                        type='number'
                                        value={data.components[index].concentration}
                                        id='concentration'
                                        data-key='components'
                                        data-index={index}
                                        onChange={(ev: ChangeEvent<HTMLInputElement>) => { handleInput(ev, _data); }}
                                    /></td>
                                    <td><input
                                        type='number'
                                        value={param.mw}
                                        id='mw'
                                        data-key='compounds'
                                        data-index={index}
                                        onChange={(ev: ChangeEvent<HTMLInputElement>) => { handleInput(ev, _data); }}
                                    /></td>
                                    <td><button
                                        data-index={index}
                                        id='deleteRow'
                                        onClick={(ev: React.MouseEvent<HTMLElement>) => { rows(ev, data, _data); }}>&times;</button></td>
                                </tr>
                            );
                        })
                        }
                    </tbody>
                </table>
            </td>
        </>
    );
};

//Table display for components of variable buffer.
const CustomTableV = (props: {
    data: typeof initial,
    _data: React.Dispatch<React.SetStateAction<typeof initial>>;
}): JSX.Element => {
    const { data, _data } = props;
    return (
        <>
            <td colSpan={2}>
                Components:
                <table style={{
                    tableLayout: 'auto',
                    width: '250px',
                    textAlign: 'center'
                }}>
                    <thead style={{ fontWeight: 'bold' }}>
                        <tr>
                            <td>Component Name</td>
                            <td>Molecular Weight</td>
                        </tr>
                    </thead>
                    <tbody>
                        {data.components && data.compounds && data.compounds.map((param: bufferCompoundType, index: number) => {
                            return (
                                <tr key={index}>
                                    <td><input
                                        type='text'
                                        placeholder='Acid/Base'
                                        data-key='compounds'
                                        data-index={index}
                                        value={param.name}
                                        id='name'
                                        onChange={(ev: ChangeEvent<HTMLInputElement>) => { handleInput(ev, _data); debounce(ev, _data); }} /></td>
                                    <td><input
                                        type='number'
                                        data-key='compounds'
                                        data-index={index}
                                        value={param.mw}
                                        id='mw'
                                        onChange={(ev: ChangeEvent<HTMLInputElement>) => { handleInput(ev, _data); }} /></td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                <br />
                <table>
                    <thead>
                        <tr>
                            <td colSpan={2}>mL or mols needed for pH value (to the right)</td>
                        </tr>
                        <tr style={{ fontWeight: 'bold' }}>
                            {
                                data.compounds.map((param: bufferCompoundType, index: number) => {
                                    return (
                                        <td key={index}>
                                            <input
                                                type='text'
                                                value={param.name}
                                                disabled />
                                        </td>
                                    );
                                })
                            }
                            <td style={{ textAlign: 'center' }}>pH</td>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        {data.attributes.phArr && data.attributes.phArr.map((param: bufferPhType, index: number) => {
                            return (
                                <tr key={index}>
                                    <td><input
                                        type='number'
                                        value={param.amount}
                                        id='amount'
                                        data-index={index}
                                        data-key='phArr'
                                        onChange={(ev: ChangeEvent<HTMLInputElement>) => { handleInput(ev, _data); }}
                                    /></td>
                                    <td><input
                                        type='number'
                                        value={param.conjAmount}
                                        id='conjAmount'
                                        data-index={index}
                                        data-key='phArr'
                                        onChange={(ev: ChangeEvent<HTMLInputElement>) => { handleInput(ev, _data); }}
                                    /></td>
                                    <td><input
                                        type='number'
                                        value={param.pH}
                                        id='pH'
                                        data-index={index}
                                        data-key='phArr'
                                        onChange={(ev: ChangeEvent<HTMLInputElement>) => { handleInput(ev, _data); }}
                                    /></td>
                                    <td><button
                                        id='deleteRow'
                                        data-index={index}
                                        onClick={(ev: React.MouseEvent<HTMLElement>) => { rows(ev, data, _data); }}>&times;</button></td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </td>
        </>
    );
};

/**
 * Recursive function that traverses an object checking for value = "".
 * Returns true (and breaks) upon first value of "" it finds. Else returns false.
 * param: data which is an object/array that contains values or other nested objects/arrays
 * returns: status as true or false.
 */
/*
const containsEmptyValues = (data: any): boolean => {
    let status = false;
    if (typeof data === 'object' && data !== null) {
        for (const key of Object.keys(data)) {
            status = containsEmptyValues(data[key]);
            if (status === true) { break; }
        }
    }
    else if (data === "") {
        status = true;
    }
    return status;
};
*/

const containsEmptyValues = (data: bufferInitialType): boolean => {
    let status = false;
    for (const key of Object.keys(data)) {
        if (data[key as keyof bufferInitialType] === "") {
            status = true;
            break;
        }
    }
    for (const key of Object.keys(data.attributes)) {
        if (data.attributes[key as keyof bufferAttributes] === "") {
            status = true;
            break;
        }
    }
    for (const key of Object.keys(data.attributes.notes)) {
        if (data.attributes.notes[key as keyof bufferNotesType] === "") {
            status = true;
            break;
        }
    }
    for (let i = 0; i < data.components.length; i++) {
        for (const key of Object.keys(data.components[i])) {
            if (data.components[i][key as keyof bufferComponentType] === "") {
                status = true;
                break;
            }
        }
    }
    for (let i = 0; i < data.compounds.length; i++) {
        for (const key of Object.keys(data.compounds[i])) {
            if (data.compounds[i][key as keyof bufferCompoundType] === "") {
                status = true;
                break;
            }
        }
    }
    if (data.bufferType === 'variable' && data.attributes.variable_data) {
        for (const key of Object.keys(data.attributes.variable_data)) {
            if (data.attributes.variable_data[key as keyof bufferVariable_dataType] === "") {
                status = true;
                break;
            }
        }
    }
    if (data.bufferType === 'variable' && data.attributes.phArr) {
        for (let i = 0; i < data.attributes.phArr.length; i++) {
            for (const key of Object.keys(data.attributes.phArr[i])) {
                if (data.attributes.phArr[i][key as keyof bufferPhType] === "") {
                    status = true;
                    break;
                }
            }
        }
    }
    console.log("The status is:" + status);
    return status;
};

const submitBuffer = (data: typeof initial): void => {
    console.log(JSON.stringify(data, null, 4));
    if (containsEmptyValues(data) === true || data.compounds.length === 0 || data.attributes.phArr && data.attributes.phArr.length === 0) { alert("Missing valid input in all fields"); }
    else if (containsEmptyValues(data) === false) {
        alert("Buffer was submitted to ajax call");
        /*
        //Ajax request sends component information stored in new_component variable to node
        const s = new Server<GenericObject, { fieldCount: number, affectedRows: number, insertId: number, info: string, serverStatus: number, warningStatus: number; }>();
        s.ajax({
            url: '/webcontent/buffer/submit-buffer',
            type: 'POST',
            data: data,
            dataType: 'application/json',
            success: (response) => {
                //console.log("The db return is: " + JSON.stringify(response, null, 4));
                if (response.data.affectedRows === 1) { alert("The buffer data has been added to the server"); }
                else if (response.data.affectedRows === 2) { alert("The buffer data has been updated on the server"); }
                else { alert("There was an error sending the buffer data"); }
            }
        });
        */
    }
};

const AddRowButton = (props: { data: typeof initial, _data: React.Dispatch<React.SetStateAction<typeof initial>>; }): JSX.Element => {
    const { data, _data } = props;
    return (
        <td><input
            type='button'
            value='Add Row'
            id='addRow'
            style={{
                alignContent: 'center',
                width: '150px'
            }}
            onClick={(ev: React.MouseEvent<HTMLElement>) => { rows(ev, data, _data); }}
        /></td>
    );
};

const SubmitButton = (props: { data: typeof initial; }): JSX.Element => {
    const { data } = props;
    return (
        <td><input
            type='button'
            value='Submit Buffer'
            style={{
                alignContent: 'center',
                width: '150px'
            }}
            onClick={() => submitBuffer(data)}
        />
        </td>
    );
};

const layout: { [key: string]: Array<bufferLayoutRow>; } = {
    single: [
        {
            rowLabel: 'Buffer name:',
            id: 'title',
            type: 'text',
            placeholder: 'Buffer Name',
            rowComponent: TitleInput
        },
        {
            id: 'type',
            rowComponent: CustomSelect
        },
        {
            rowLabel: 'Buffer pH:',
            id: 'pH',
            type: 'number',
            placeholder: 'pH of buffer',
            rowComponent: CustomInput
        },
        {
            rowLabel: 'Molarity of final solution:',
            id: 'molarity',
            type: 'number',
            placeholder: 'Molarity of buffer',
            rowComponent: CustomInput
        },
        {
            rowLabel: 'Buffer solvent:',
            id: 'base_solvent',
            type: 'text',
            placeholder: 'Solvent',
            rowComponent: CustomInput
        },
        {
            rowLabel: 'Information source:',
            id: 'source',
            type: 'text',
            placeholder: 'Source',
            rowComponent: CustomInput
        },
        {
            rowLabel: 'Description:',
            id: 'description',
            placeholder: 'Description',
            rowComponent: TextAreaDescription
        },
        {
            rowLabel: 'Notes:',
            id: 'notes',
            placeholder: "Final notes (e.g. 'Adjust solution to desired pH (typicalling pH ≈ 7.0).')",
            rowComponent: TextAreaNotes
        },
        {
            id: 'componentTable',
            type: 'table',
            rowComponent: CustomTableS
        },
        {
            id: 'addRow',
            rowComponent: AddRowButton
        },
        {
            id: 'submitBuffer',
            rowComponent: SubmitButton
        }
    ],

    variable: [
        {
            rowLabel: 'Buffer name:',
            id: 'title',
            type: 'text',
            placeholder: 'Buffer name',
            rowComponent: TitleInput
        },
        {
            id: 'type',
            rowComponent: CustomSelect
        },
        {
            rowLabel: 'Buffer pH min:',
            id: 'min_ph',
            type: 'number',
            placeholder: 'min pH of buffer',
            rowComponent: InputPH
        },
        {
            rowLabel: 'Buffer pH max:',
            id: 'max_ph',
            type: 'number',
            placeholder: 'max pH of buffer',
            rowComponent: InputPH
        },
        {
            rowLabel: 'Buffer solvent:',
            id: 'base_solvent',
            type: 'text',
            placeholder: 'Solvent',
            rowComponent: CustomInput
        },
        {
            rowLabel: 'Information source:',
            id: 'source',
            type: 'text',
            placeholder: 'Source',
            rowComponent: CustomInput
        },
        {
            rowLabel: 'Description:',
            id: 'description',
            placeholder: 'Description',
            rowComponent: TextAreaDescription
        },
        {
            rowLabel: 'Notes:',
            id: 'notes',
            placeholder: "Final notes (e.g. 'Adjust solution to desired pH (typicalling pH ≈ 7.0).')",
            rowComponent: TextAreaNotes
        },
        {
            id: 'componentTable',
            type: 'table',
            rowComponent: CustomTableV
        },
        {
            id: 'addRow',
            rowComponent: AddRowButton
        },
        {
            id: 'submitBuffer',
            rowComponent: SubmitButton
        }
    ]
};

//Handles selection of buffer from the buffer dropdown list. Pulls data from server for selected title and sets values into dbData state.
const handleBufferListClick = (ev: React.MouseEvent<HTMLElement>, _data: React.Dispatch<React.SetStateAction<typeof initial>>, _dbData: React.Dispatch<React.SetStateAction<typeof initial>>, _display: React.Dispatch<React.SetStateAction<boolean>>): void => {
    const title = ev.currentTarget.getAttribute('data-title') as string;
    const id = ev.currentTarget.getAttribute('data-id') as string;
    _display(true);
    const s = new Server<GenericObject, bufferInitialType[]>();
    s.ajax({
        url: '/webcontent/buffer/get-buffer-info',
        type: 'POST',
        data: { id },
        dataType: 'application/json',
        success: (response) => {
            if (response.code === 200) {
                //console.log("The db return is: " + JSON.stringify(response, null, 4));
                if (!response.data[0].attributes.variable_data) {
                    _data((old) => {
                        old.bufferType = 'single';
                        return { ...old };
                    });
                }
                else if (response.data[0].attributes.variable_data) {
                    _data((old) => {
                        old.bufferType = 'variable';
                        return { ...old };
                    });
                }
                if (!response.data[0].attributes.variable_data) {
                    _dbData((old) => {
                        old.bufferType = 'single';
                        old.title = title;
                        old.formula_id = id;
                        old.components = response.data[0].components;
                        old.attributes = response.data[0].attributes;
                        old.attributes.notes = response.data[0].attributes.notes;
                        old.compounds = response.data[0].compounds;
                        return {
                            ...old,
                            components: [...old.components],
                            attributes: {
                                ...old.attributes,
                                notes: { ...old.attributes.notes }
                            },
                            compounds: [...old.compounds]
                        };
                    });
                }
                else if (response.data[0].attributes.variable_data) {
                    _dbData((old) => {
                        old.bufferType = 'variable';
                        old.title = title;
                        old.formula_id = id;
                        old.components = response.data[0].components;
                        old.attributes = response.data[0].attributes;
                        old.attributes.notes = response.data[0].attributes.notes;
                        old.attributes.variable_data = response.data[0].attributes.variable_data;
                        old.compounds = response.data[0].compounds;
                        if (response.data[0].attributes.phArr) {
                            old.attributes.phArr = response.data[0].attributes.phArr;
                        }
                        else {
                            old.attributes.phArr = [
                                {
                                    amount: '',
                                    conjAmount: '',
                                    pH: ''
                                }
                            ];
                        }
                        if (typeof old.attributes.phArr === "undefined") { return old; }
                        return {
                            ...old,
                            components: [...old.components],
                            attributes: {
                                ...old.attributes,
                                phArr: [...old.attributes.phArr],
                                variable_data: { ...old.attributes.variable_data },
                                notes: { ...old.attributes.notes }
                            },
                            compounds: [...old.compounds]
                        };
                    });
                }
            }
        }
    });
};

const DisplayBufferList = (props: { index: number, title: string, id: string, filterTerm: string, _data: React.Dispatch<React.SetStateAction<typeof initial>>, _dbData: React.Dispatch<React.SetStateAction<typeof initial>>, _display: React.Dispatch<React.SetStateAction<boolean>>; }): JSX.Element => {
    const { index, title, id, filterTerm, _data, _dbData, _display } = props;
    //Filter which returns blank if there is no matches to the entered filterTerm.
    if (filterTerm && title.toLowerCase().indexOf(filterTerm.toLowerCase()) === -1) {
        return (
            <>
            </>
        );
    }
    return (
        <div
            data-index={index}
            data-title={title}
            data-id={id}
            style={{
                display: 'block',
                padding: '5px',
                width: '100%',
                boxSizing: 'border-box',
                cursor: 'pointer'
            }}
            onClick={(ev: React.MouseEvent<HTMLElement>) => { handleBufferListClick(ev, _data, _dbData, _display); }}
        >
            {title}
        </div>
    );
};

const BufferDropdown = (props: { _data: React.Dispatch<React.SetStateAction<typeof initial>>, _dbData: React.Dispatch<React.SetStateAction<typeof initial>>, _display: React.Dispatch<React.SetStateAction<boolean>>; }): JSX.Element => {
    const [databaseList, _databaseList] = useState([]);
    const [filterTerm, _filterTerm] = useState<string>("");
    const { _data, _dbData, _display } = props;
    useEffect(() => {
        const s = new Server();
        s.ajax({
            url: '/webcontent/buffer/get-buffer-list',
            type: 'POST',
            data: {},
            dataType: 'application/json',
            success: (response: any) => {
                if (response.code === 200) {
                    //console.log("The db dropwdown return is: " + JSON.stringify(response, null, 4));
                    _databaseList(response.data);
                }
            }
        });
    }, []);
    return (
        <>
            <input
                value={filterTerm}
                type='text'
                onChange={(ev: ChangeEvent<HTMLInputElement>) => { _filterTerm(ev.target.value); }}
                placeholder='Filter buffers...'
                style={{
                    display: 'block',
                    width: '100%',
                    boxSizing: 'border-box'
                }}
            />
            <div
                style={{
                    border: '1px solid #AFAFAF',
                    height: '150px',
                    overflowY: 'auto'
                }}>
                {(databaseList) && databaseList.map((param: bufferInitialType, index: number) => {
                    return (
                        <>
                            <DisplayBufferList
                                index={index}
                                title={param.title}
                                id={param.formula_id}
                                filterTerm={filterTerm}
                                _data={_data}
                                _dbData={_dbData}
                                _display={_display}
                            />
                        </>
                    );
                })}
            </div>
        </>
    );
};

const RenderInputs = (props: {
    InputLayout: bufferLayoutRow[],
    _data: React.Dispatch<React.SetStateAction<typeof initial>>,
    data: typeof initial;
}): JSX.Element => {
    const { InputLayout, _data, data } = props;
    return (
        <>
            <table>
                <tbody>
                    {InputLayout.map((element: bufferLayoutRow, index: number) => {
                        return (
                            <tr key={index}>
                                {
                                    <element.rowComponent
                                        id={element.id}
                                        rowLabel={element?.rowLabel}
                                        type={element?.type}
                                        placeholder={element?.placeholder}
                                        data={data}
                                        _data={_data}
                                    />
                                }
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </>
    );
};

const RenderPageContent = (props: {
    display: boolean,
    _display: React.Dispatch<React.SetStateAction<boolean>>,
    _data: React.Dispatch<React.SetStateAction<typeof initial>>,
    data: typeof initial,
    _dbData: React.Dispatch<React.SetStateAction<typeof initial>>;
}): JSX.Element => {
    const { display, _display, _data, data, _dbData } = props;
    return (
        <>
            <input
                type='button'
                value='New Buffer'
                style={{
                    alignContent: 'center',
                    width: '150px'
                }}
                onClick={() => { clearInputs(data.bufferType, _data); _display(true); }}
            />
            <br /><br />
            <div>
                <BufferDropdown
                    _data={_data}
                    _dbData={_dbData}
                    _display={_display}
                />
            </div>
            <br />
            {(display === true) ? <>
                <div>
                    <input
                        type='radio'
                        style={{ margin: "0 5px 0 15px" }}
                        onChange={(ev: ChangeEvent<HTMLInputElement>) => { handleRadioInput(ev, _data); }}
                        value='single'
                        name='buffer'
                        checked={data.bufferType === 'single'}
                    />Single pH Buffer
                    <input
                        type='radio'
                        style={{ margin: "0 5px 0 15px" }}
                        onChange={(ev: ChangeEvent<HTMLInputElement>) => { handleRadioInput(ev, _data); }}
                        value='variable'
                        name='buffer'
                        checked={data.bufferType === 'variable'}
                    />Variable pH Buffer
                    <br /><br />
                </div>
                <div>
                    <RenderInputs
                        InputLayout={layout[data.bufferType]}
                        _data={_data}
                        data={data}
                    />
                </div>
            </> : <></>}
        </>
    );
};

const BufferPage = (): JSX.Element => {
    const [data, _data] = useState<bufferInitialType>(initial);
    const [dbData, _dbData] = useState<bufferInitialType>(initial);
    const [display, _display] = useState<boolean>(false);

    useEffect(() => {
        clearInputs(data.bufferType, _data);
    }, [data.bufferType]);

    useEffect(() => {
        if (dbData.bufferType === 'single') {
            _data((old) => {
                old.title = dbData.title;
                old.formula_id = dbData.formula_id;
                old.components = dbData.components;
                old.attributes = dbData.attributes;
                old.attributes.notes = dbData.attributes.notes;
                old.compounds = dbData.compounds;
                return {
                    ...old,
                    components: [...old.components],
                    attributes: {
                        ...old.attributes,
                        notes: { ...old.attributes.notes }
                    },
                    compounds: [...old.compounds]
                };
            });
        }
        else if (dbData.bufferType === 'variable') {
            //console.log("The pull from database is " + JSON.stringify(dbData, null, 4));
            _data((old) => {
                old.title = dbData.title;
                old.formula_id = dbData.formula_id;
                old.components = dbData.components;
                old.attributes = dbData.attributes;
                old.attributes.phArr = dbData.attributes.phArr;
                old.attributes.variable_data = dbData.attributes.variable_data;
                old.attributes.notes = dbData.attributes.notes;
                old.compounds = dbData.compounds;
                if (typeof old.attributes.phArr === "undefined") { return old; }
                return {
                    ...old,
                    components: [...old.components],
                    attributes: {
                        ...old.attributes,
                        phArr: [...old.attributes.phArr],
                        variable_data: { ...old.attributes.variable_data },
                        notes: { ...old.attributes.notes }
                    },
                    compounds: [...old.compounds]
                };
            });
        }
    }, [dbData]);

    return (
        <>
            <RenderPageContent
                display={display}
                _display={_display}
                _data={_data}
                data={data}
                _dbData={_dbData}
            />
        </>
    );
};

export default BufferPage;

export const getStaticProps = async (context: Routing.Context) => {
    const meta = await fetchMeta(__filename, context);
    return ({ props: { meta: meta } });
};