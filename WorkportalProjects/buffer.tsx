import React, { useEffect, useState } from 'react';
import { fetchMeta } from '../../lib/meta';
import Server from '../../lib/Server';
import { Routing } from '../../types/Routing';

const s = new Server();

type phType = {
    [key: string]: any,
    amount: number | '',
    conjAmount: number | '',
    pH: number | '';
};

const phSet: phType = {
    amount: '',
    conjAmount: '',
    pH: ''
};

type s_compType = {
    [key: string]: any,
    cID: string | '',
    amount: number | '',
    amount_type: string,
    concentration: number | '',
    concentration_type: string;
};

const s_compSet: s_compType = {
    cID: '',
    amount: '',
    amount_type: 'g',
    concentration: '',
    concentration_type: 'M'
};

type v_compType = {
    [key: string]: any,
    cID: string | '',
    amount_type: string,
    concentration_type: string;
};

const v_compSet: v_compType = {
    cID: '',
    amount_type: 'g',
    concentration_type: 'M'
};

type compType = {
    [key: string]: any,
    cID: string | '',
    mw: number | '',
    name: string | '';
};

const comp: compType = {
    cID: '',
    mw: '',
    name: ''
};

type variable_data_type = {
    [key: string]: any,
    phMin: number | '',
    phMax: number | '',
};

const variable_data_set: variable_data_type = {
    phMin: '',
    phMax: ''
};

type s_type = {
    pH: number | '',
    molarity: number | '',
    solvent: string | '',
    source: string | '',
    description: string | '',
    notes: string | '',
};

const sData: s_type = {
    pH: '',
    molarity: '',
    solvent: '',
    source: '',
    description: '',
    notes: '',
};

type v_type = {
    solvent: string | '',
    source: string | '',
    description: string | '',
    notes: string | '',
    variable_data: any;
    phArr: Array<any>;
};

const vData: v_type = {
    solvent: '',
    source: '',
    description: '',
    notes: '',
    variable_data: {},
    phArr: []
};

type initialType = {
    [key: string]: any,
    bufferType: string,
    formula_id: string | '',
    title: string | '',
    components: Array<any>,
    attributes: any,
    compounds: Array<any>;
};

const initial: initialType = {
    bufferType: 'single',
    formula_id: '',
    title: '',
    components: [{ ...s_compSet }],
    attributes: {},
    compounds: [{ ...comp }]
};

const pullCompoundsData = (ev: any, _data: React.Dispatch<React.SetStateAction<initialType>>) => {
    const index = ev.target.getAttribute('data-index');
    const inputValue = ev.target.value;
    const compoundID = inputValue.toLowerCase()
        .replace(/[^a-z0-9]/gu, '-')
        .replace(/(?:-){2,}/gu, '-')
        .trim();
    s.ajax({
        url: '/api/webcontent/buffer/get-compounds-info',
        type: 'POST',
        data: { compoundID },
        dataType: 'application/json',
        success: (response: any) => {
            if (response.code === 200) {
                _data((old) => {
                    old.compounds[index].mw = response.data[0].mw;
                    return { ...old };
                });
            }
        }
    });
};

let timer: NodeJS.Timeout;
const debounce = (ev: any, _data: React.Dispatch<React.SetStateAction<initialType>>) => {
    if (timer) { clearTimeout(timer); }
    timer = setTimeout(() => pullCompoundsData(ev, _data), 200);
};

//Function that clears out all input values and returns empty object with format determined by bufferType
const clearInputs = (bufferType: string, _data: React.Dispatch<React.SetStateAction<typeof initial>>) => {
    if (bufferType === 'single') {
        const initialObj = {
            bufferType: 'single',
            formula_id: '',
            title: '',
            components: [],
            attributes: {},
            compounds: []
        };
        const initialCompArr: any = [];
        const compSet = { ...s_compSet };
        initialCompArr.push(compSet);
        const initialAttrObj = { ...sData };
        const initialCompoundArr: any = [];
        const compoundSet = { ...comp };
        initialCompoundArr.push(compoundSet);
        _data((old) => {
            old.components = initialCompArr;
            old.attributes = initialAttrObj;
            old.compounds = initialCompoundArr;
            return {
                ...initialObj,
                components: [...old.components],
                attributes: { ...old.attributes },
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
        const initialCompArr: any = [];
        const compSet = { ...v_compSet };
        const compSet2 = { ...v_compSet };
        initialCompArr.push(compSet);
        initialCompArr.push(compSet2);
        const initialAttrObj = { ...vData };
        const initialphArr: any = [];
        const set = { ...phSet };
        initialphArr.push(set);
        const initialVarObj = { ...variable_data_set };
        const initialCompoundArr: any = [];
        const compoundSet = { ...comp };
        const compoundSet2 = { ...comp };
        initialCompoundArr.push(compoundSet);
        initialCompoundArr.push(compoundSet2);
        _data((old) => {
            old.components = initialCompArr;
            old.attributes = initialAttrObj;
            old.attributes.phArr = initialphArr;
            old.compounds = initialCompoundArr;
            old.attributes.variable_data = initialVarObj;
            return {
                ...initialObj,
                components: [...old.components],
                attributes: {
                    ...old.attributes,
                    phArr: [...old.attributes.phArr],
                    variable_data: { ...old.attributes.variable_data }
                },
                compounds: [...old.compounds]
            };
        });
    }
};

const handleRadioInput = (ev: any, _data: React.Dispatch<React.SetStateAction<typeof initial>>) => {
    const state = ev.target.value;
    _data((old) => {
        old.bufferType = state;
        return { ...old };
    });
};

const handleInput = (ev: any, _data: React.Dispatch<React.SetStateAction<typeof initial>>) => {
    const inputValue = ev.target.value;
    const inputId = ev.target.id;
    const key = ev.target.getAttribute('data-key');
    const index = ev.target.getAttribute('data-index');
    if (key === 'attributes') {
        _data((old) => {
            old.attributes[inputId] = inputValue;
            return {
                ...old,
                attributes: { ...old.attributes }
            };
        });
    }
    else if (key === 'variable_data') {
        _data((old) => {
            old.attributes.variable_data[inputId] = inputValue;
            return {
                ...old,
                attributes: {
                    ...old.attributes,
                    variable_data: { ...old.attributes.variable_data }
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
                [inputId]: inputValue,
                formula_id: sanTitle
            };
        });
    }
    else if (key === 'compounds') {
        if (inputId === 'name') {
            const sanCompoundTitle = inputValue.toLowerCase()
                .replace(/[^a-z0-9]/gu, '-')
                .replace(/(?:-){2,}/gu, '-')
                .trim();
            _data((old) => {
                old.compounds[index][inputId] = inputValue;
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
                old.compounds[index][inputId] = inputValue;
                return {
                    ...old,
                    compounds: [...old.compounds]
                };
            });
        }
    }
    else if (key === 'components') {
        _data((old) => {
            old.components[index][inputId] = inputValue;
            return {
                ...old,
                components: [...old.components]
            };
        });
    }
    else if (key === 'phArr') {
        _data((old) => {
            old.attributes.phArr[index][inputId] = inputValue;
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

//Display function for the title. Data entered for "Buffer name" section.
const TitleInput = (props: { rowLabel: string, id: string, type: string, placeholder: string, _data: React.Dispatch<React.SetStateAction<typeof initial>>, data: typeof initial; }) => {
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
                value={data[id]}
                placeholder={placeholder}
                onChange={(ev: any) => { handleInput(ev, _data); }}
            /></td>
        </>
    );
};

const CustomInput = (props: { rowLabel: string, id: string, type: string, placeholder: string, _data: React.Dispatch<React.SetStateAction<typeof initial>>, data: typeof initial; }) => {
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
                value={data.attributes[id]}
                placeholder={placeholder}
                onChange={(ev: any) => { handleInput(ev, _data); }}
            /></td>
        </>
    );
};

const InputPH = (props: { rowLabel: string, id: string, type: string, placeholder: string, _data: React.Dispatch<React.SetStateAction<typeof initial>>, data: typeof initial; }) => {
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
                value={data.attributes.variable_data?.[id]}
                placeholder={placeholder}
                onChange={(ev: any) => { handleInput(ev, _data); }}
            /></td>
        </>
    );
};

const CustomTextArea = (props: { rowLabel: string, id: string, placeholder: string, _data: React.Dispatch<React.SetStateAction<typeof initial>>, data: typeof initial; }) => {
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
                value={data.attributes[id]}
                placeholder={placeholder}
                style={{
                    width: '500px',
                    minHeight: '200px',
                    resize: 'none'
                }}
                onChange={(ev: any) => { handleInput(ev, _data); }} /></td>
        </>
    );
};

//Handles any manipulation (adding or deleting) of rows for the components table.
const rows = (ev: any, data: typeof initial, _data: React.Dispatch<React.SetStateAction<typeof initial>>) => {
    const inputId = ev.target.id;
    const index = ev.target.getAttribute('data-index');
    if (data.bufferType === 'single') {
        const newRows = [...data.components];
        const newCompRows = [...data.compounds];
        if (inputId === 'addRow') {
            const x = { ...s_compSet };
            newRows.push(x);
            const y = { ...comp };
            newCompRows.push(y);
        }
        else if (inputId === 'deleteRow') {
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
        const newRows = [...data.attributes.phArr];
        if (inputId === 'addRow') {
            const x = { ...phSet };
            newRows.push(x);
        }
        else if (inputId === 'deleteRow') {
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
}) => {
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
                        {data.components && data.compounds && data.compounds.map((param: any, index: any) => {
                            return (
                                <tr key={index}>
                                    <td><input
                                        type='text'
                                        placeholder='Acid/Base'
                                        value={param.name}
                                        id='name'
                                        data-key='compounds'
                                        data-index={index}
                                        onChange={(ev: any) => { handleInput(ev, _data); debounce(ev, _data); }}
                                    /></td>
                                    <td><input
                                        type='number'
                                        value={data.components[index].amount}
                                        id='amount'
                                        data-key='components'
                                        data-index={index}
                                        onChange={(ev: any) => { handleInput(ev, _data); }}
                                    /></td>
                                    <td><input
                                        type='number'
                                        value={data.components[index].concentration}
                                        id='concentration'
                                        data-key='components'
                                        data-index={index}
                                        onChange={(ev: any) => { handleInput(ev, _data); }}
                                    /></td>
                                    <td><input
                                        type='number'
                                        value={param.mw}
                                        id='mw'
                                        data-key='compounds'
                                        data-index={index}
                                        onChange={(ev: any) => { handleInput(ev, _data); }}
                                    /></td>
                                    <td><button
                                        data-index={index}
                                        id='deleteRow'
                                        onClick={(ev: any) => { rows(ev, data, _data); }}>&times;</button></td>
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
}) => {
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
                        {data.components && data.compounds && data.compounds.map((param: any, index: any) => {
                            return (
                                <tr key={index}>
                                    <td><input
                                        type='text'
                                        placeholder='Acid/Base'
                                        data-key='compounds'
                                        data-index={index}
                                        value={param.name}
                                        id='name'
                                        onChange={(ev: any) => { handleInput(ev, _data); debounce(ev, _data); }} /></td>
                                    <td><input
                                        type='number'
                                        data-key='compounds'
                                        data-index={index}
                                        value={param.mw}
                                        id='mw'
                                        onChange={(ev: any) => { handleInput(ev, _data); }} /></td>
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
                                data.compounds.map((param: any, index: any) => {
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
                        {data.attributes.phArr && data.attributes.phArr.map((param: any, index: any) => {
                            return (
                                <tr key={index}>
                                    <td><input
                                        type='number'
                                        value={param.amount}
                                        id='amount'
                                        data-index={index}
                                        data-key='phArr'
                                        onChange={(ev: any) => { handleInput(ev, _data); }}
                                    /></td>
                                    <td><input
                                        type='number'
                                        value={param.conjAmount}
                                        id='conjAmount'
                                        data-index={index}
                                        data-key='phArr'
                                        onChange={(ev: any) => { handleInput(ev, _data); }}
                                    /></td>
                                    <td><input
                                        type='number'
                                        value={param.pH}
                                        id='pH'
                                        data-index={index}
                                        data-key='phArr'
                                        onChange={(ev: any) => { handleInput(ev, _data); }}
                                    /></td>
                                    <td><button
                                        id='deleteRow'
                                        data-index={index}
                                        onClick={(ev: any) => { rows(ev, data, _data); }}>&times;</button></td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </td>
        </>
    );
};

//Recursive function that traverses an object checking for any value = ''. Returns true (and breaks) upon first value of '' it finds.
const containsEmptyValues = (data: any): boolean => {
    let status = false;
    if (typeof data === 'object' && data !== null) {
        for (const key of Object.keys(data)) {
            status = containsEmptyValues(data[key]);
            if (status === true) { break; }
        }
    }
    else if (data === '') {
        status = true;
    }
    return status;
};

const submitBuffer = (data: typeof initial) => {
    if (containsEmptyValues(data) === true || data.compounds.length === 0) { alert("Missing valid input in all fields"); }
    else if (containsEmptyValues(data) === false) {
        //Ajax request sends component information stored in new_component variable to node
        s.ajax({
            url: '/api/webcontent/buffer/submit-buffer',
            type: 'POST',
            data: data,
            dataType: 'application/json',
            success: (response: any) => {
                if (response.data.affectedRows === 1) { alert("The buffer data has been added to the server"); }
                else if (response.data.affectedRows === 2) { alert("The buffer data has been updated on the server"); }
                else { alert("There was an error sending the buffer data"); }
            }
        });
    }
};

const AddRowButton = (props: { data: typeof initial, _data: React.Dispatch<React.SetStateAction<typeof initial>>; }) => {
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
            onClick={(ev: any) => { rows(ev, data, _data); }}
        /></td>
    );
};

const SubmitButton = (props: { data: typeof initial; }) => {
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

type row = {
    rowLabel?: string,
    id: string,
    type?: string,
    placeholder?: string,
    rowComponent: CallableFunction;
};

const layout: { [key: string]: Array<row>; } = {
    single: [
        {
            rowLabel: 'Buffer name:',
            id: 'title',
            type: 'text',
            placeholder: 'Buffer Name',
            rowComponent: TitleInput
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
            id: 'solvent',
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
            rowComponent: CustomTextArea
        },
        {
            rowLabel: 'Notes:',
            id: 'notes',
            placeholder: "Final notes (e.g. 'Adjust solution to desired pH (typicalling pH ≈ 7.0).')",
            rowComponent: CustomTextArea
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
            rowLabel: 'Buffer pH min:',
            id: 'phMin',
            type: 'number',
            placeholder: 'min pH of buffer',
            rowComponent: InputPH
        },
        {
            rowLabel: 'Buffer pH max:',
            id: 'phMax',
            type: 'number',
            placeholder: 'max pH of buffer',
            rowComponent: InputPH
        },
        {
            rowLabel: 'Buffer solvent:',
            id: 'solvent',
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
            rowComponent: CustomTextArea
        },
        {
            rowLabel: 'Notes:',
            id: 'notes',
            placeholder: "Final notes (e.g. 'Adjust solution to desired pH (typicalling pH ≈ 7.0).')",
            rowComponent: CustomTextArea
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
const handleBufferListClick = (ev: any, _data: React.Dispatch<React.SetStateAction<typeof initial>>, _dbData: React.Dispatch<React.SetStateAction<typeof initial>>, _display: React.Dispatch<React.SetStateAction<boolean>>) => {
    const title = ev.target.getAttribute('data-title');
    const id = ev.target.getAttribute('data-id');
    _display(true);
    s.ajax({
        url: '/api/webcontent/buffer/get-buffer-info',
        type: 'POST',
        data: { id },
        dataType: 'application/json',
        success: (response: any) => {
            if (response.code === 200) {
                if (response.data[0].attributes.pH) {
                    _data((old) => {
                        old.bufferType = 'single';
                        return { ...old };
                    });
                }
                else if (!response.data[0].attributes.pH) {
                    _data((old) => {
                        old.bufferType = 'variable';
                        return { ...old };
                    });
                }
                if (response.data[0].attributes.pH) {
                    _dbData((old) => {
                        old.bufferType = 'single';
                        old.title = title;
                        old.formula_id = id;
                        old.components = response.data[0].components;
                        old.attributes = response.data[0].attributes;
                        old.compounds = response.data[0].compounds;
                        return {
                            ...old,
                            components: [...old.components],
                            attributes: { ...old.attributes },
                            compounds: [...old.compounds]
                        };
                    });
                }
                else if (!response.data[0].attributes.pH) {
                    _dbData((old) => {
                        old.bufferType = 'variable';
                        old.title = title;
                        old.formula_id = id;
                        old.components = response.data[0].components;
                        old.attributes = response.data[0].attributes;
                        old.attributes.phArr = response.data[0].attributes.phArr;
                        old.attributes.variable_data = response.data[0].attributes.variable_data;
                        old.compounds = response.data[0].compounds;
                        return {
                            ...old,
                            components: [...old.components],
                            attributes: {
                                ...old.attributes,
                                phArr: [...old.attributes.phArr],
                                variable_data: { ...old.attributes.variable_data }
                            },
                            compounds: [...old.compounds]
                        };
                    });
                }
            }
        }
    });
};

//Display format for each buffer in the databaseList.
const DisplayBufferList = (props: { index: number, title: string, id: string, filterTerm: any, _data: React.Dispatch<React.SetStateAction<typeof initial>>, _dbData: React.Dispatch<React.SetStateAction<typeof initial>>, _display: React.Dispatch<React.SetStateAction<boolean>>; }) => {
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
            onClick={(ev: any) => { handleBufferListClick(ev, _data, _dbData, _display); }}
        >
            {title}
        </div>
    );
};

//Gets the list of buffers from the database and displays in a dropdown menu format.
const BufferDropdown = (props: { _data: React.Dispatch<React.SetStateAction<typeof initial>>, _dbData: React.Dispatch<React.SetStateAction<typeof initial>>, _display: React.Dispatch<React.SetStateAction<boolean>>; }) => {
    const [databaseList, _databaseList] = useState<initialType>();
    const [filterTerm, _filterTerm] = useState<string>();
    const { _data, _dbData, _display } = props;
    useEffect(() => {
        s.ajax({
            url: '/api/webcontent/buffer/get-buffer-list',
            type: 'POST',
            data: {},
            dataType: 'application/json',
            success: (response: any) => {
                if (response.code === 200) {
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
                onChange={(ev: any) => { _filterTerm(ev.target.value); }}
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
                {(databaseList) && databaseList.map((param: any, index: number) => {
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
    InputLayout: any,
    _data: React.Dispatch<React.SetStateAction<typeof initial>>,
    data: typeof initial;
}) => {
    const { InputLayout, _data, data } = props;
    return (
        <>
            <table>
                <tbody>
                    {InputLayout.map((element: row, index: number) => {
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
}) => {
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
                        onChange={(ev: any) => { handleRadioInput(ev, _data); }}
                        value='single'
                        name='buffer'
                        checked={data.bufferType === 'single'}
                    />Single pH Buffer
                    <input
                        type='radio'
                        style={{ margin: "0 5px 0 15px" }}
                        onChange={(ev: any) => { handleRadioInput(ev, _data); }}
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

const BufferPage = () => {
    const [data, _data] = useState<initialType>(initial);
    const [dbData, _dbData] = useState<initialType>(initial);
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
                old.compounds = dbData.compounds;
                return {
                    ...old,
                    components: [...old.components],
                    attributes: { ...old.attributes },
                    compounds: [...old.compounds]
                };
            });
        }
        else if (dbData.bufferType === 'variable') {
            _data((old) => {
                old.title = dbData.title;
                old.formula_id = dbData.formula_id;
                old.components = dbData.components;
                old.attributes = dbData.attributes;
                old.attributes.phArr = dbData.attributes.phArr;
                old.attributes.variable_data = dbData.attributes.variable_data;
                old.compounds = dbData.compounds;
                return {
                    ...old,
                    components: [...old.components],
                    attributes: {
                        ...old.attributes,
                        phArr: [...old.attributes.phArr],
                        variable_data: { ...old.attributes.variable_data }
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