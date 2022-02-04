import React, { ChangeEvent, useEffect, useState } from 'react';
import Server from '../../lib/Server';

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
    name: string | '',
    amount: number | '',
    molarity: number | '',
    mw: number | '';
};

const s_compSet: s_compType = {
    name: '',
    amount: '',
    molarity: '',
    mw: ''
};

type v_compType = {
    [key: string]: any,
    name: string | '',
    mw: number | '',
};

const v_compSet: v_compType = {
    name: '',
    mw: ''
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
    phMin: number | '',
    phMax: number | '',
    solvent: string | '',
    source: string | '',
    description: string | '',
    notes: string | '',
    phArr: Array<any>;
};

const vData: v_type = {
    phMin: '',
    phMax: '',
    solvent: '',
    source: '',
    description: '',
    notes: '',
    phArr: []
};

type initialType = {
    [key: string]: any,
    formulaId: string | '',
    title: string | '',
    type: string,
    components: Array<any>,
    attributes: any,
    accepted: number,
    update_date: string | '',
};

const initial: initialType = {
    formulaId: '',
    title: '',
    type: 'buffer',
    components: [],
    attributes: {},
    accepted: 0,
    update_date: ''
};

const BufferPage = () => {
    const [bufferType, _bufferType] = useState<string>('single');
    const [data, _data] = useState<initialType>(initial);

    //Clears the fields that are not currently selected by the radio button determining the bufferType
    useEffect(() => {
        if (bufferType === 'single') {
            const initialObj = { ...initial };
            const initialCompArr: any = [];
            const compSet = { ...s_compSet };
            initialCompArr.push(compSet);
            const initialAttrObj = { ...sData };
            _data((data) => {
                data = initialObj;
                data.components = initialCompArr;
                data.attributes = initialAttrObj;
                return { ...data, components: [...data.components], attributes: { ...data.attributes } };
            });
        }
        else if (bufferType === 'variable') {
            const initialObj = { ...initial };
            const initialCompArr: any = [];
            const compSet = { ...v_compSet };
            const compSet2 = { ...v_compSet };
            initialCompArr.push(compSet);
            initialCompArr.push(compSet2);
            const initialAttrObj = { ...vData };
            const initialphArr: any = [];
            const set = { ...phSet };
            initialphArr.push(set);
            _data((data) => {
                data = initialObj;
                data.components = initialCompArr;
                data.attributes = initialAttrObj;
                data.attributes.phArr = initialphArr;
                return { ...data, components: [...data.components], attributes: { ...data.attributes, phArr: [...data.attributes.phArr] } };
            });
        }
    }, [bufferType]);

    return (
        <>
            <RenderPageContent
                _bufferType={_bufferType}
                bufferType={bufferType}
                _data={_data}
                data={data}
            />
        </>
    );
};

const handleRadioInput = (ev: ChangeEvent<HTMLInputElement>, _bufferType: React.Dispatch<React.SetStateAction<string>>) => {
    const state = ev.target.value;
    _bufferType(state);
};

const handleInput = (ev: any, _data: React.Dispatch<React.SetStateAction<typeof initial>>) => {
    const value = ev.target.value;
    const id = ev.target.id;
    const key = ev.target.getAttribute('data-key');
    const index = ev.target.getAttribute('data-index');
    if (key === 'attributes') {
        _data((data) => {
            data.attributes[id] = value;
            return { ...data, attributes: { ...data.attributes } };
        });
    }
    else if (key === 'title') {
        _data((data) => {
            return { ...data, [id]: value };
        });
    }
    else if (key === 'components') {
        _data((data) => {
            data.components[index][id] = value;
            return { ...data, components: [...data.components] };
        });
    }
    else if (key === 'phArr') {
        _data((data) => {
            data.attributes.phArr[index][id] = value;
            return { ...data, attributes: { ...data.attributes, phArr: [...data.attributes.phArr] } };
        });
    }
};

const TitleInput = (props: { rowLabel: string, id: string, type: string, placeholder: string, _data: React.Dispatch<React.SetStateAction<typeof initial>>, data: typeof initial; }) => {
    const { rowLabel, id, type, placeholder, _data, data } = props;
    return (
        <>
            <td style={{ fontWeight: 'bold', verticalAlign: 'top' }}>{rowLabel}</td>
            <td><input
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
            <td style={{ fontWeight: 'bold', verticalAlign: 'top' }}>{rowLabel}</td>
            <td><input
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

const CustomTextArea = (props: { rowLabel: string, id: string, placeholder: string, _data: React.Dispatch<React.SetStateAction<typeof initial>>, data: typeof initial; }) => {
    const { id, placeholder, _data, data } = props;
    return (
        <>
            <td><textarea
                id={id}
                data-key='attributes'
                value={data.attributes[id]}
                placeholder={placeholder}
                style={{ width: '100%', minHeight: '200px', resize: 'none' }}
                onChange={(ev: any) => { handleInput(ev, _data); }} /></td>
        </>
    );
};

const rows = (ev: any, bufferType: string, data: typeof initial, _data: React.Dispatch<React.SetStateAction<typeof initial>>) => {
    const evId = ev.target.id;
    const index = ev.target.getAttribute('data-index');
    if (bufferType === 'single') {
        const newRows = [...data.components];
        if (evId === 'addRow') {
            const x = { ...s_compSet };
            newRows.push(x);
        }
        else if (evId === 'deleteRow') {
            newRows.splice(index, 1);
        }
        _data((data) => {
            data.components = newRows;
            return { ...data };
        });
    }
    else if (bufferType === 'variable') {
        const newRows = [...data.attributes.phArr];
        if (evId === 'addRow') {
            const x = { ...phSet };
            newRows.push(x);
        }
        else if (evId === 'deleteRow') {
            newRows.splice(index, 1);
        }
        _data((data) => {
            data.attributes.phArr = newRows;
            return { ...data, attributes: { ...data.attributes, phArr: [...data.attributes.phArr] } };
        });
    }
};

const CustomTableS = (props: {
    bufferType: string,
    data: typeof initial,
    _data: React.Dispatch<React.SetStateAction<typeof initial>>;
}) => {
    const { bufferType, data, _data } = props;
    return (
        <>
            <br />
            Components:
            <table>
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
                    {
                        data.components.map((props: any, index: any) => {
                            return (
                                <tr key={index}>
                                    <td><input
                                        type='text'
                                        placeholder='Acid/Base'
                                        value={props.name}
                                        id='name'
                                        data-key='components'
                                        data-index={index}
                                        onChange={(ev: any) => { handleInput(ev, _data); }}
                                    /></td>
                                    <td><input
                                        type='number'
                                        value={props.amount}
                                        id='amount'
                                        data-key='components'
                                        data-index={index}
                                        onChange={(ev: any) => { handleInput(ev, _data); }}
                                    /></td>
                                    <td><input
                                        type='number'
                                        value={props.molarity}
                                        id='molarity'
                                        data-key='components'
                                        data-index={index}
                                        onChange={(ev: any) => { handleInput(ev, _data); }}
                                    /></td>
                                    <td><input
                                        type='number'
                                        value={props.mw}
                                        id='mw'
                                        data-key='components'
                                        data-index={index}
                                        onChange={(ev: any) => { handleInput(ev, _data); }}
                                    /></td>
                                    <td><button
                                        data-index={index}
                                        id='deleteRow'
                                        onClick={(ev: any) => { rows(ev, bufferType, data, _data); }}>&times;</button></td>
                                </tr>
                            );
                        })
                    }
                </tbody>
            </table>
        </>
    );
};

const CustomTableV = (props: {
    bufferType: string,
    data: typeof initial,
    _data: React.Dispatch<React.SetStateAction<typeof initial>>;
}) => {
    const { bufferType, data, _data } = props;
    return (
        <>
            <br />
            Components:
            <table>
                <thead style={{ fontWeight: 'bold' }}>
                    <tr>
                        <td>Component Name</td>
                        <td>Molecular Weight</td>
                    </tr>
                </thead>
                <tbody>
                    {
                        data.components.map((props: any, index: any) => {
                            return (
                                <tr key={index}>
                                    <td><input
                                        type='text'
                                        placeholder='Acid/Base'
                                        data-key='components'
                                        data-index={index}
                                        value={props.name}
                                        id='name'
                                        onChange={(ev: any) => { handleInput(ev, _data); }}
                                    /></td>
                                    <td><input
                                        type='number'
                                        data-key='components'
                                        data-index={index}
                                        value={props.mw}
                                        id='mw'
                                        onChange={(ev: any) => { handleInput(ev, _data); }}
                                    /></td>
                                </tr>
                            );
                        })
                    }
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
                            data.components.map((props: any, index: any) => {
                                return (
                                    <td key={index}>
                                        <input
                                            type='text'
                                            value={props.name}
                                            disabled />
                                    </td>
                                );
                            })
                        }
                        <td>pH</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {(data.attributes.phArr) ?
                        data.attributes.phArr.map((props: any, index: any) => {
                            return (
                                <tr key={index}>
                                    <td><input
                                        type='number'
                                        value={props.amount}
                                        id='amount'
                                        data-index={index}
                                        data-key='phArr'
                                        onChange={(ev: any) => { handleInput(ev, _data); }}
                                    /></td>
                                    <td><input
                                        type='number'
                                        value={props.conjAmount}
                                        id='conjAmount'
                                        data-index={index}
                                        data-key='phArr'
                                        onChange={(ev: any) => { handleInput(ev, _data); }}
                                    /></td>
                                    <td><input
                                        type='number'
                                        value={props.pH}
                                        id='pH'
                                        data-index={index}
                                        data-key='phArr'
                                        onChange={(ev: any) => { handleInput(ev, _data); }}
                                    /></td>
                                    <td><button
                                        id='deleteRow'
                                        data-index={index}
                                        onClick={(ev: any) => { rows(ev, bufferType, data, _data); }}>&times;</button></td>
                                </tr>
                            );
                        })
                        : ""}
                </tbody>
            </table>
        </>
    );
};

const sendData = (data: typeof initial) => {

    //console.log(JSON.stringify(data, null, 4));

    s.ajax({
        url: '/api/webcontent/buffer',
        type: 'POST',
        data: data,
        dataType: 'application/json',
        success: function (response: any) {
            alert("The data has been received by the server");
            console.log(JSON.stringify(response.data, null, 4));
        }
    });
};

const submitBuffer = (data: typeof initial, _data: React.Dispatch<React.SetStateAction<typeof initial>>) => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    const hour = String(today.getHours()).padStart(2, '0');
    const min = String(today.getMinutes()).padStart(2, '0');
    const sec = String(today.getSeconds()).padStart(2, '0');

    const timestamp = yyyy + '-' + mm + '-' + dd + ' ' + hour + ':' + min + ':' + sec;

    const sanTitle = data.title.replace(/[&\/\\#,+()$~%'":*?<>{}]/g, '').replace(/[.\s+]/g, '-').toLowerCase();

    _data((data) => {
        data.update_date = timestamp;
        data.formulaId = sanTitle;
        return { ...data };
    });
    sendData(data);
    console.log("The buffer has been submitted!");
};

type row = {
    rowLabel?: string,
    id: string,
    type?: string,
    placeholder?: string,
    rowComponent: Function;
};

const layout: { single: Array<row>, variable: Array<row>; } = {
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
            id: 'description',
            placeholder: 'Description',
            rowComponent: CustomTextArea
        },
        {
            id: 'notes',
            placeholder: "Final notes (e.g. 'Adjust solution to desired pH (typicalling pH ≈ 7.0).')",
            rowComponent: CustomTextArea
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
            rowLabel: 'Buffer pH:',
            id: 'phMin',
            type: 'number',
            placeholder: 'min pH of buffer',
            rowComponent: CustomInput
        },
        {
            id: 'phMax',
            type: 'number',
            placeholder: 'max pH of buffer',
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
            id: 'description',
            placeholder: 'Description',
            rowComponent: CustomTextArea
        },
        {
            id: 'notes',
            placeholder: "Final notes (e.g. 'Adjust solution to desired pH (typicalling pH ≈ 7.0).')",
            rowComponent: CustomTextArea
        }
    ]
};

const RenderPageContent = (props: {
    _bufferType: React.Dispatch<React.SetStateAction<string>>,
    bufferType: string,
    _data: React.Dispatch<React.SetStateAction<typeof initial>>,
    data: typeof initial;
}) => {
    const { _bufferType, bufferType, _data, data } = props;
    return (
        <>
            <div>
                <input
                    type='radio'
                    style={{ margin: "0 5px 0 15px" }}
                    onClick={(ev: any) => { handleRadioInput(ev, _bufferType); }}
                    value='single'
                    name='buffer'
                    defaultChecked />Single pH Buffer
                <input
                    type='radio'
                    style={{ margin: "0 5px 0 15px" }}
                    onClick={(ev: any) => { handleRadioInput(ev, _bufferType); }}
                    value='variable'
                    name='buffer' />Variable pH Buffer
                <br /><br />
            </div>
            <div>
                <RenderInputs
                    layout={layout[bufferType as 'single' | 'variable']}
                    bufferType={bufferType}
                    _data={_data}
                    data={data}
                />
            </div>
        </>
    );
};

const RenderInputs = (props: {
    layout: any,
    bufferType: string,
    _data: React.Dispatch<React.SetStateAction<typeof initial>>,
    data: typeof initial;
}) => {
    const { layout, bufferType, _data, data } = props;
    return (
        <>
            <table>
                <tbody>
                    {layout.map((element: row, index: number) => {
                        return (
                            <tr key={index}>
                                {
                                    <element.rowComponent
                                        id={element.id}
                                        rowLabel={element?.rowLabel}
                                        type={element?.type}
                                        placeholder={element?.placeholder}
                                        bufferType={bufferType}
                                        _data={_data}
                                        data={data}
                                    />
                                }
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            {(bufferType === 'single') ?
                <CustomTableS bufferType={bufferType} data={data} _data={_data} /> :
                <CustomTableV bufferType={bufferType} data={data} _data={_data} />}
            <input
                type='button'
                value='ADD ROW'
                id='addRow'
                onClick={(ev: any) => { rows(ev, bufferType, data, _data); }}
            />
            <br />
            <input
                type='button'
                value='SUBMIT BUFFER'
                onClick={() => submitBuffer(data, _data)}
            />
        </>
    );
};

export default BufferPage;