import React, { useState, ChangeEvent, useEffect } from 'react';

type s_type = {
    [key: string]: any,
    name: string | '',
    pH: number | '',
    molarity: number | '',
    solvent: string | '',
    source: string | '',
    description: string | '',
    notes: string | '',
    compArr: Array<compType>
}

type v_type = {
    [key: string]: any,
    name: string | '',
    phMin: number | '',
    phMax: number | '',
    solvent: string | '',
    source: string | '',
    description: string | '',
    notes: string | '',
    compName: string | '',
    compMW: number | '',
    compConjName: string | '',
    compConjMW: number | '',
    phArr: Array<phType>
}

type phType = {
    [key: string]: any,
    amount: number | '',
    conjAmount: number | '',
    pH: number | ''
}

type compType = {
    [key: string]: any,
    name: string | '',
    units: number | '',
    initialMolarity: number | '',
    mw: number | ''
}

interface initialType {
    [key: string]: any,
    sData: s_type,
    vData: v_type
}

const phSet: phType = {
    amount: '',
    conjAmount: '',
    pH: ''
}

const compSet: compType = {
    name: '',
    units: '',
    initialMolarity: '',
    mw: ''
}

const v_initial: v_type = {
    name: '',
    phMin: '',
    phMax: '',
    solvent: '',
    source: '',
    description: '',
    notes: '',
    compName: '',
    compMW: '',
    compConjName: '',
    compConjMW: '',
    phArr: [{ ...phSet }]
}

const s_initial: s_type = {
    name: '',
    pH: '',
    molarity: '',
    solvent: '',
    source: '',
    description: '',
    notes: '',
    compArr: [{ ...compSet }]
}

const initial: initialType = {
    sData: {
        name: '',
        pH: '',
        molarity: '',
        solvent: '',
        source: '',
        description: '',
        notes: '',
        compArr: [{ ...compSet }]
    },
    vData: {
        name: '',
        phMin: '',
        phMax: '',
        solvent: '',
        source: '',
        description: '',
        notes: '',
        compName: '',
        compMW: '',
        compConjName: '',
        compConjMW: '',
        phArr: [{ ...phSet }]
    }

}

const BufferPage = () => {
    const [bufferType, _bufferType] = useState<string>('single');
    const [data, _data] = useState<typeof initial>(initial);

    //Clears the fields that are not currently selected by the radio button determinging bufferType
    useEffect(() => {
        if (bufferType === 'single') {
            const w = { ...v_initial };
            _data((data) => {
                data.vData = w;
                return { ...data }
            })
        }
        if (bufferType === 'variable') {
            const w = { ...s_initial }
            _data((data) => {
                data.sData = w;
                return { ...data };
            })
        }
    }, [bufferType])

    return (
        <>
            <RenderPageContent
                _bufferType={_bufferType}
                bufferType={bufferType}
                _data={_data}
                data={data}
            />
        </>
    )
}

/**
 * Function handling radio button input determining state of bufferType
 * @param ev
 * @param _bufferType
 */
const handleRadioInput = (ev: ChangeEvent<HTMLInputElement>, _bufferType: React.Dispatch<React.SetStateAction<string>>) => {
    const state = ev.target.value;
    _bufferType(state);
    //console.log("The bufferType is: " + state);
}

/**
 * Function handling any of the component table value changes
 * @param ev 
 * @param bufferType 
 * @param _data 
 */
const handleTableInput = (ev: any, bufferType: string, _data: React.Dispatch<React.SetStateAction<typeof initial>>) => {
    const id = ev.target.id;
    const value = ev.target.value;
    const index = ev.target.getAttribute('data-attribute');
    if (bufferType === 'single') {
        _data((data) => {
            data.sData.compArr[index][id] = value;
            return { ...data, compArr: [...data.sData.compArr] }
        })
    }
    else if (bufferType === 'variable') {
        _data((data) => {
            data.vData.phArr[index][id] = value;
            return { ...data, phArr: [...data.vData.phArr] }
        })
    }
    //console.log("data." + (bufferType === 'single' ? "sData" : "vData") + "array[" + index + "][" + id + "] is: " + value);
}

const handleInput = (ev: any, bufferType: string, _data: React.Dispatch<React.SetStateAction<typeof initial>>) => {
    const value = ev.target.value;
    const id = ev.target.id;
    if (bufferType === 'single') {
        _data((data) => {
            return { ...data, sData: { ...data.sData, [id]: value } }
        })
    }
    else if (bufferType === 'variable') {
        _data((data) => {
            return { ...data, vData: { ...data.vData, [id]: value } }
        })
    }
    //console.log("Value is: [" + id + "][" + value + "]");
}

const CustomInput = (props: { rowLabel: string, id: string, type: string, placeholder: string, bufferType: string, _data: React.Dispatch<React.SetStateAction<typeof initial>>, data: typeof initial }) => {
    const { rowLabel, id, type, placeholder, bufferType, _data, data } = props;
    return (
        <>
            <td style={{ fontWeight: 'bold', verticalAlign: 'top' }}>{rowLabel}</td>
            <td><input
                id={id}
                type={type}
                value={(bufferType === 'single') ? data.sData[id] : data.vData[id]}
                placeholder={placeholder}
                onChange={(ev: any) => { handleInput(ev, bufferType, _data) }}
            /></td>
        </>
    )
}

const CustomInputPH = (props: { rowLabel: string, id: string, type: string, placeholder: string, bufferType: string, _data: React.Dispatch<React.SetStateAction<typeof initial>>, data: typeof initial }) => {
    const { rowLabel, id, type, placeholder, bufferType, _data, data } = props;
    return (
        <>
            <td style={{ fontWeight: 'bold', verticalAlign: 'top' }}>{rowLabel}</td>
            <td><input
                id={id}
                type={type}
                value={data.vData[id]}
                placeholder={placeholder}
                onChange={(ev: any) => { handleInput(ev, bufferType, _data) }}
            /></td>
            <td><input
                id='phMax'
                type={type}
                value={data.vData.phMax}
                placeholder='max pH of buffer'
                onChange={(ev: any) => { handleInput(ev, bufferType, _data) }}
            /></td>
        </>
    )
}

const CustomTextArea = (props: { rowLabel: string, id: string, placeholder: string, bufferType: string, _data: React.Dispatch<React.SetStateAction<typeof initial>>, data: typeof initial }) => {
    const { id, placeholder, bufferType, _data, data } = props
    return (
        <>
            <td><textarea
                id={id}
                value={(bufferType === 'single') ? data.sData[id] : data.vData[id]}
                placeholder={placeholder}
                style={{ width: '100%', minHeight: '200px', resize: 'none' }}
                onChange={(ev: any) => { handleInput(ev, bufferType, _data) }} /></td>
            <td><textarea
                id='notes'
                value={(bufferType === 'single') ? data.sData.notes : data.vData.notes}
                placeholder="Final notes (e.g. 'Adjust solution to desired pH (typicalling pH ≈ 7.0).')"
                style={{ width: '100%', minHeight: '200px', resize: 'none' }}
                onChange={(ev: any) => { handleInput(ev, bufferType, _data) }} /></td>
        </>
    )
}

const rows = (ev: any, bufferType: string, data: typeof initial, _data: React.Dispatch<React.SetStateAction<typeof initial>>) => {
    const evId = ev.target.id;
    const index = ev.target.getAttribute('data-attribute');
    if (bufferType === 'single') {
        const newRows = [...data.sData.compArr];
        if (evId === 'addRow') {
            const x = { ...compSet };
            newRows.push(x);
        }
        else if (evId === 'deleteRow') {
            newRows.splice(index, 1);
        }
        _data((data) => {
            data.sData.compArr = newRows;
            return { ...data }
        })
    }
    else if (bufferType === 'variable') {
        const newRows = [...data.vData.phArr];
        if (evId === 'addRow') {
            const x = { ...phSet };
            newRows.push(x);
        }
        else if (evId === 'deleteRow') {
            newRows.splice(index, 1);
        }
        _data((data) => {
            data.vData.phArr = newRows;
            return { ...data }
        })
    }
}

const CustomTableS = (props: {
    bufferType: string,
    data: typeof initial,
    _data: React.Dispatch<React.SetStateAction<typeof initial>>
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
                        data.sData.compArr.map((props: any, index: any) => {
                            return (
                                <tr key={index}>
                                    <td><input
                                        type='text'
                                        placeholder='Acid/Base'
                                        value={props.name}
                                        id='name'
                                        data-attribute={index}
                                        onChange={(ev: any) => { handleTableInput(ev, bufferType, _data) }}
                                    /></td>
                                    <td><input
                                        type='number'
                                        value={props.units}
                                        id='units'
                                        data-attribute={index}
                                        onChange={(ev: any) => { handleTableInput(ev, bufferType, _data) }}
                                    /></td>
                                    <td><input
                                        type='number'
                                        value={props.initialMolarity}
                                        id='initialMolarity'
                                        data-attribute={index}
                                        onChange={(ev: any) => { handleTableInput(ev, bufferType, _data) }}
                                    /></td>
                                    <td><input
                                        type='number'
                                        value={props.mw}
                                        id='mw'
                                        data-attribute={index}
                                        onChange={(ev: any) => { handleTableInput(ev, bufferType, _data) }}
                                    /></td>
                                    <td><button
                                        data-attribute={index}
                                        id='deleteRow'
                                        onClick={(ev: any) => { rows(ev, bufferType, data, _data) }}>&times;</button></td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </>
    )
}

const CustomTableV = (props: {
    bufferType: string,
    data: typeof initial,
    _data: React.Dispatch<React.SetStateAction<typeof initial>>
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
                    <tr>
                        <td><input
                            type='text'
                            placeholder='Acid/Base'
                            value={data.vData.compName}
                            id='compName'
                            onChange={(ev: any) => { handleInput(ev, bufferType, _data) }}
                        /></td>
                        <td><input
                            type='number'
                            value={data.vData.compMW}
                            id='compMW'
                            onChange={(ev: any) => { handleInput(ev, bufferType, _data) }}
                        /></td>
                    </tr>
                    <tr>
                        <td><input
                            type='text'
                            placeholder='Acid/Base'
                            value={data.vData.compConjName}
                            id='compConjName'
                            onChange={(ev: any) => { handleInput(ev, bufferType, _data) }}
                        /></td>
                        <td><input
                            type='number'
                            value={data.vData.compConjMW}
                            id='compConjMW'
                            onChange={(ev: any) => { handleInput(ev, bufferType, _data) }}
                        /></td>
                    </tr>
                </tbody>
            </table>
            <br />
            <table>
                <thead>
                    <tr>
                        <td colSpan={2}>mL or mols needed for pH value (to the right)</td>
                    </tr>
                    <tr style={{ fontWeight: 'bold' }}>
                        <td><input
                            type='text'
                            value={data.vData.compName}
                            disabled
                        /></td>
                        <td><input
                            type='text'
                            value={data.vData.compConjName}
                            disabled
                        /></td>
                        <td>pH</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {
                        data.vData.phArr.map((props: any, index: any) => {
                            return (
                                <tr key={index}>
                                    <td><input
                                        type='number'
                                        value={props.amount}
                                        id='amount'
                                        data-attribute={index}
                                        onChange={(ev: any) => { handleTableInput(ev, bufferType, _data) }}
                                    /></td>
                                    <td><input
                                        type='number'
                                        value={props.conjAmount}
                                        id='conjAmount'
                                        data-attribute={index}
                                        onChange={(ev: any) => { handleTableInput(ev, bufferType, _data) }}
                                    /></td>
                                    <td><input
                                        type='number'
                                        value={props.pH}
                                        id='pH'
                                        data-attribute={index}
                                        onChange={(ev: any) => { handleTableInput(ev, bufferType, _data) }}
                                    /></td>
                                    <td><button
                                        id='deleteRow'
                                        data-attribute={index}
                                        onClick={(ev: any) => { rows(ev, bufferType, data, _data) }}>&times;</button></td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </>
    )
}

const submitBuffer = (bufferType: string, data: typeof initial) => {

    //Ajax request sends component information stored in new_component variable to node

    /*
s.ajax({
url: '/nodeserver',
type: 'POST',
data: { type: 'getList' },
dataType: 'application/json',
success: function (response: any) {
    updateList(response.data);
}
});
*/
    /*
        console.log("The buffer has been submitted!");
        if (bufferType === 'single') {
            console.log("data.sData.name is: " + data.sData.name);
            console.log("data.sData.pH is: " + data.sData.pH);
            console.log("data.sData.molarity is: " + data.sData.molarity);
            console.log("data.sData.solvent is: " + data.sData.solvent);
            console.log("data.sData.source is: " + data.sData.source);
            console.log("data.sData.description is: " + data.sData.description);
            console.log("data.sData.notes is: " + data.sData.notes);
            for (let i = 0, imax = data.sData.compArr.length; i < imax; i++) {
                console.log("data.sData.compArr[" + i + "].name is: " + data.sData.compArr[i].name);
                console.log("data.sData.compArr[" + i + "].units is: " + data.sData.compArr[i].units);
                console.log("data.sData.compArr[" + i + "].initialMolarity is: " + data.sData.compArr[i].initialMolarity);
                console.log("data.sData.compArr[" + i + "].mw is: " + data.sData.compArr[i].mw);
            }
        }
        else if (bufferType === 'variable') {
            console.log("data.vData.name is: " + data.vData.name);
            console.log("data.vData.phMin is: " + data.vData.phMin);
            console.log("data.vData.phMax is: " + data.vData.phMax);
            console.log("data.vData.solvent is: " + data.vData.solvent);
            console.log("data.vData.source is: " + data.vData.source);
            console.log("data.vData.description is: " + data.vData.description);
            console.log("data.vData.notes is: " + data.vData.notes);
            console.log("data.vData.compName is: " + data.vData.compName);
            console.log("data.vData.compMW is: " + data.vData.compMW);
            console.log("data.vData.compConjName is: " + data.vData.compConjName);
            console.log("data.vData.compConjMW is: " + data.vData.compConjMW);
            for (let i = 0, imax = data.vData.phArr.length; i < imax; i++) {
                console.log("data.vData.phArr[" + i + "].amount is: " + data.vData.phArr[i].amount);
                console.log("data.vData.phArr[" + i + "].conjAmount is: " + data.vData.phArr[i].conjAmount);
                console.log("data.vData.phArr[" + i + "].pH is: " + data.vData.phArr[i].pH);
            }
        }
        */
}

type row = {
    rowLabel?: string,
    id: string,
    type?: string,
    placeholder?: string,
    rowComponent: Function
}

const layout: { single: Array<row>, variable: Array<row> } = {
    single: [
        {
            rowLabel: 'Buffer name:',
            id: 'name',
            type: 'text',
            placeholder: 'Buffer Name',
            rowComponent: CustomInput
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
        }
    ],

    variable: [
        {
            rowLabel: 'Buffer name:',
            id: 'name',
            type: 'text',
            placeholder: 'Buffer name',
            rowComponent: CustomInput
        },
        {
            rowLabel: 'Buffer pH:',
            id: 'phMin',
            type: 'number',
            placeholder: 'min pH of buffer',
            rowComponent: CustomInputPH
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
        }
    ]
}
const RenderPageContent = (props: {
    _bufferType: React.Dispatch<React.SetStateAction<string>>,
    bufferType: string,
    _data: React.Dispatch<React.SetStateAction<typeof initial>>,
    data: typeof initial
}) => {
    const { _bufferType, bufferType, _data, data } = props;
    return (
        <>
            <div>
                <input
                    type='radio'
                    style={{ margin: "0 5px 0 15px" }}
                    onClick={(ev: any) => { handleRadioInput(ev, _bufferType) }}
                    value='single'
                    name='buffer'
                    defaultChecked />Single pH Buffer
                <input
                    type='radio'
                    style={{ margin: "0 5px 0 15px" }}
                    onClick={(ev: any) => { handleRadioInput(ev, _bufferType) }}
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
    )
}

const RenderInputs = (props: {
    layout: any,
    bufferType: string,
    _data: React.Dispatch<React.SetStateAction<typeof initial>>,
    data: typeof initial
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
                        )
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
                onClick={(ev: any) => { rows(ev, bufferType, data, _data) }}
            />
            <br />
            <input
                type='button'
                value='SUBMIT BUFFER'
                onClick={() => submitBuffer(bufferType, data)}
            />
        </>
    )
}

export default BufferPage;