import React, { useState, ChangeEvent, useEffect } from 'react';

type s_type = {
    name: string | '',
    pH: number | '',
    molarity: number | '',
    solvent: string | '',
    source: string | '',
    description: string | '',
    notes: string | '',
    components: Array<s_compType>
}

type v_type = {
    name: string | '',
    pHmin: number | '',
    pHmax: number | '',
    solvent: string | '',
    source: string | '',
    description: string | '',
    notes: string | '',
    compName: string | '',
    compMW: number | '',
    compConjName: string | '',
    compConjMW: number | '',
    pHarray: Array<pHtype>
}

type pHtype = {
    [key: string]: number | '',
    amount: number | '',
    conjAmount: number | '',
    pH: number | ''
}

const pHset: pHtype = {
    amount: '',
    conjAmount: '',
    pH: ''
}

type s_compType = {
    [key: string]: string | number | '',
    name: string | '',
    units: number | '',
    initialMolarity: number | '',
    mw: number | ''
}

const s_comp: s_compType = {
    name: '',
    units: '',
    initialMolarity: '',
    mw: ''
}

const v_initial: v_type = {
    name: '',
    pHmin: '',
    pHmax: '',
    solvent: '',
    source: '',
    description: '',
    notes: '',
    compName: '',
    compMW: '',
    compConjName: '',
    compConjMW: '',
    pHarray: []
}

const s_initial: s_type = {
    name: '',
    pH: '',
    molarity: '',
    solvent: '',
    source: '',
    description: '',
    notes: '',
    components: []
}

/**
 * Main component creating page for entry to add a buffer
 * @param props 
 * @returns 
 */
const AddBufferToDatabase = (props: any) => {

    const [bufferType, _bufferType] = useState<string>('single');
    const [sData, _sData] = useState<s_type>(s_initial);
    const [vData, _vData] = useState<v_type>(v_initial);

    useEffect(() => {
        if (bufferType === 'single') {
            _sData((sData) => {
                const w: Array<s_compType> = [];
                const c = { ...s_comp };
                w.push(c);
                sData.components = w;
                return { ...sData };
            })
        }
        if (bufferType === 'variable') {
            _vData((vData) => {
                const x: Array<pHtype> = [];
                const d = { ...pHset };
                x.push(d);
                vData.pHarray = x;
                return { ...vData };
            })
        }
    }, [bufferType])

    return (
        <>
            <RenderPageContent
                _bufferType={_bufferType}
                bufferType={bufferType}
                _sData={_sData}
                sData={sData}
                _vData={_vData}
                vData={vData}
            />
        </>
    )
}
/**
 * Handles input for filling out buffer details
 * @param ev 
 * @param bufferType based off radio option. Either string or variable.
 * @param _sData 
 */
const handleInput = (ev: any, bufferType: string, _sData: React.Dispatch<React.SetStateAction<s_type>>, _vData: React.Dispatch<React.SetStateAction<v_type>>) => {
    const tag = ev.target.getAttribute('data-tag');
    const value = ev.target.value;
    if (bufferType === 'single') {
        _sData((sData) => {
            return { ...sData, [tag]: value }
        })
    }
    else if (bufferType === 'variable') {
        _vData((vData) => {
            return { ...vData, [tag]: value }
        })
    }
}

/**
 * 
 * @param ev Handles input for the components table.
 * @param bufferType based off radio option. Either string or variable.
 * @param _sData 
 * @param sData 
 */
const handleTableInput = (ev: any, bufferType: string, _sData: React.Dispatch<React.SetStateAction<s_type>>, sData: s_type, _vData: React.Dispatch<React.SetStateAction<v_type>>, vData: v_type) => {
    const tag = ev.target.getAttribute('data-tag');
    const value = ev.target.value;
    const index = ev.target.getAttribute('data-attribute');
    if (bufferType === 'single') {
        _sData((sData) => {
            sData.components[index][tag] = value;
            return { ...sData, components: [...sData.components] }
        })
    }
    else if (bufferType === 'variable') {
        _vData((vData) => {
            vData.pHarray[index][tag] = value;
            return { ...vData, pHarray: [...vData.pHarray] }
        })
    }
    console.log("The current value of " + (bufferType === 'single' ? "sData" : "vData") + ".components[" + index + "][" + tag + "] is: " + value);
}

/**
 * Function handling radio button input
 * @param ev radio button HTMLinput change event
 * @param _bufferType
 */
const handleRadioInput = (ev: ChangeEvent<HTMLInputElement>, _bufferType: React.Dispatch<React.SetStateAction<string>>) => {
    const state = ev.target.value;
    _bufferType(state);
}

const handleAddrowClick = (bufferType: string, _sData: React.Dispatch<React.SetStateAction<s_type>>, sData: s_type, _vData: React.Dispatch<React.SetStateAction<v_type>>, vData: v_type) => {
    if (bufferType === 'single') {
        const w: Array<s_compType> = [...sData.components];
        const c = { ...s_comp };
        w.push(c);
        _sData((sData) => {
            sData.components = w;
            return { ...sData }
        })
    }
    else if (bufferType === 'variable') {
        const w: Array<pHtype> = [...vData.pHarray];
        const c = { ...pHset };
        w.push(c);
        _vData((vData) => {
            vData.pHarray = w;
            return { ...vData }
        })
    }
}

const handleDeleteClick = (ev: any, bufferType: string, _sData: React.Dispatch<React.SetStateAction<s_type>>, sData: s_type, _vData: React.Dispatch<React.SetStateAction<v_type>>, vData: v_type) => {
    const index = ev.target.getAttribute('data-attribute');
    if (bufferType === 'single') {
        const w: Array<s_compType> = [...sData.components];
        w.splice(index, 1);
        _sData((sData) => {
            sData.components = w;
            return { ...sData }
        })
    }
    else if (bufferType === 'variable') {
        const w: Array<pHtype> = [...vData.pHarray];
        w.splice(index, 1);
        _vData((vData) => {
            vData.pHarray = w;
            return { ...vData }
        })
    }
}

/**Testing function to make sure data is correct*/
const testValueCheck = (sData: s_type, vData: v_type, bufferType: string) => {
    if (bufferType === 'single') {
        console.log("The current value of sData.name is: " + sData.name);
        console.log("The current value of sData.pH is: " + sData.pH);
        console.log("The current value of sData.molarity is: " + sData.molarity);
        console.log("The current value of sData.solvent is: " + sData.solvent);
        console.log("The current value of sData.source is: " + sData.source);
        console.log("The current value of sData.description is: " + sData.description);
        console.log("The current value of sData.notes is: " + sData.notes);
        for (let i = 0, imax = sData.components.length; i < imax; i++) {
            console.log("The current value of sData.components[" + i + "].name is: " + sData.components[i].name);
            console.log("The current value of sData.components[" + i + "].units is: " + sData.components[i].units);
            console.log("The current value of sData.components[" + i + "].initialMolarity is: " + sData.components[i].initialMolarity);
            console.log("The current value of sData.components[" + i + "].mw is: " + sData.components[i].mw);
        }
    }
    else if (bufferType === 'variable') {
        console.log("The current value of vData.name is: " + vData.name);
        console.log("The current value of vData.pHmin is: " + vData.pHmin);
        console.log("The current value of vData.pHmax is: " + vData.pHmax);
        console.log("The current value of vData.solvent is: " + vData.solvent);
        console.log("The current value of vData.source is: " + vData.source);
        console.log("The current value of vData.description is: " + vData.description);
        console.log("The current value of vData.notes is: " + vData.notes);
        console.log("The current value of vData.compName is: " + vData.compName);
        console.log("The current value of vData.compMW is: " + vData.compMW);
        console.log("The current value of vData.compConjName is: " + vData.compConjName);
        console.log("The current value of vData.compConjMW is: " + vData.compConjMW);
        for (let i = 0, imax = vData.pHarray.length; i < imax; i++) {
            console.log("The current value of vData.pHarray[" + i + "].amount is: " + vData.pHarray[i].amount);
            console.log("The current value of vData.pHarray[" + i + "].conjAmount is: " + vData.pHarray[i].conjAmount);
            console.log("The current value of vData.pHarray[" + i + "].pH is: " + vData.pHarray[i].pH);
        }
    }
}


const submitBuffer = (bufferType: string, sData: s_type, vData: v_type) => {
    //Insert code to to send buffer information. Data received is dependent on bufferType, either single or variable
    console.log("The buffer has been submitted!");
    testValueCheck(sData, vData, bufferType);
}

const RenderPageContent = (props: {
    _bufferType: React.Dispatch<React.SetStateAction<string>>,
    bufferType: string,
    _sData: React.Dispatch<React.SetStateAction<s_type>>,
    sData: s_type,
    _vData: React.Dispatch<React.SetStateAction<v_type>>,
    vData: v_type
}) => {
    const { _bufferType, bufferType, _sData, sData, _vData, vData } = props;
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
                {(bufferType === 'single') ? <RenderSinglePHBufferSection
                    sData={sData}
                    _sData={_sData}
                    bufferType={bufferType}
                    _vData={_vData}
                    vData={vData}
                /> :
                    (bufferType === 'variable') ? <RenderVariablePHBufferSection
                        vData={vData}
                        _vData={_vData}
                        bufferType={bufferType}
                        _sData={_sData}
                        sData={sData}
                    /> : ''}
            </div>
        </>
    )
}

const RenderSinglePHBufferSection = (props: {
    sData: s_type,
    _sData: React.Dispatch<React.SetStateAction<s_type>>,
    bufferType: string,
    _vData: React.Dispatch<React.SetStateAction<v_type>>,
    vData: v_type
}) => {
    const { sData, _sData, bufferType, _vData, vData } = props;
    return (
        <>

            <div>
                <table>
                    <tbody>
                        <tr>
                            <td>Buffer name:</td>
                            <td>
                                <input
                                    data-tag='name'
                                    type='string'
                                    value={sData.name}
                                    placeholder='Buffer name'
                                    onChange={(ev: any) => { handleInput(ev, bufferType, _sData, _vData) }}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>Buffer pH:</td>
                            <td>
                                <input
                                    data-tag='pH'
                                    type='number'
                                    value={sData.pH}
                                    placeholder='pH of buffer'
                                    onChange={(ev: any) => { handleInput(ev, bufferType, _sData, _vData) }}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>Molarity of final solution:</td>
                            <td>
                                <input
                                    data-tag='molarity'
                                    type='number'
                                    value={sData.molarity}
                                    placeholder='Molarity of buffer'
                                    onChange={(ev: any) => { handleInput(ev, bufferType, _sData, _vData) }}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>Buffer solvent:</td>
                            <td>
                                <input
                                    data-tag='solvent'
                                    type='string'
                                    value={sData.solvent}
                                    placeholder='Solvent'
                                    onChange={(ev: any) => { handleInput(ev, bufferType, _sData, _vData) }}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>Information source:</td>
                            <td>
                                <input
                                    data-tag='source'
                                    type='string'
                                    value={sData.source}
                                    placeholder='Source'
                                    onChange={(ev: any) => { handleInput(ev, bufferType, _sData, _vData) }}
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div>
                    <textarea
                        data-tag='description'
                        value={sData.description}
                        placeholder='Description'
                        onChange={(ev: any) => { handleInput(ev, bufferType, _sData, _vData) }}
                    />
                    <textarea
                        data-tag='notes'
                        value={sData.notes}
                        placeholder="Final notes (e.g. 'Adjust solution to desired pH (typicalling pH ≈ 7.0).')"
                        onChange={(ev: any) => { handleInput(ev, bufferType, _sData, _vData) }}
                    />
                </div>
                <br />
                Components:
                <table>
                    <thead>
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
                            sData.components.map((props, index) => {
                                return (
                                    <tr key={index}>
                                        <td><input
                                            type='text'
                                            placeholder='Acid/Base'
                                            value={props.name}
                                            data-tag='name'
                                            data-attribute={index}
                                            onChange={(ev: any) => { handleTableInput(ev, bufferType, _sData, sData, _vData, vData) }}
                                        /></td>
                                        <td><input
                                            type='number'
                                            value={props.units}
                                            data-tag='units'
                                            data-attribute={index}
                                            onChange={(ev: any) => { handleTableInput(ev, bufferType, _sData, sData, _vData, vData) }}
                                        /></td>
                                        <td><input
                                            type='number'
                                            value={props.initialMolarity}
                                            data-tag='initialMolarity'
                                            data-attribute={index}
                                            onChange={(ev: any) => { handleTableInput(ev, bufferType, _sData, sData, _vData, vData) }}
                                        /></td>
                                        <td><input
                                            type='number'
                                            value={props.mw}
                                            data-tag='mw'
                                            data-attribute={index}
                                            onChange={(ev: any) => { handleTableInput(ev, bufferType, _sData, sData, _vData, vData) }}
                                        /></td>
                                        <td><button
                                            data-attribute={index}
                                            onClick={(ev: any) => { handleDeleteClick(ev, bufferType, _sData, sData, _vData, vData) }}>&times;</button></td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
                <br />
                <input
                    type='button'
                    value='ADD ROW'
                    onClick={() => { handleAddrowClick(bufferType, _sData, sData, _vData, vData) }}
                />
                <br /><br />
                <input
                    type='button'
                    value='SUBMIT BUFFER'
                    onClick={() => submitBuffer(bufferType, sData, vData)}
                />
            </div>
        </>
    )
}

const RenderVariablePHBufferSection = (props: {
    vData: v_type;
    _vData: React.Dispatch<React.SetStateAction<v_type>>,
    bufferType: string,
    _sData: React.Dispatch<React.SetStateAction<s_type>>,
    sData: s_type
}) => {
    const { vData, _vData, bufferType, _sData, sData } = props;
    return (
        <>
            <div>
                <table>
                    <tbody>
                        <tr>
                            <td>Buffer name:</td>
                            <td><input
                                data-tag='name'
                                type='string'
                                value={vData.name}
                                placeholder='Buffer name'
                                onChange={(ev: any) => { handleInput(ev, bufferType, _sData, _vData) }}
                            /></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>Buffer pH:</td>
                            <td><input
                                data-tag='pHmin'
                                type='number'
                                value={vData.pHmin}
                                placeholder='min pH of buffer'
                                onChange={(ev: any) => { handleInput(ev, bufferType, _sData, _vData) }}
                            /></td>
                            <td><input
                                data-tag='pHmax'
                                type='number'
                                value={vData.pHmax}
                                placeholder='max pH of buffer'
                                onChange={(ev: any) => { handleInput(ev, bufferType, _sData, _vData) }}
                            /></td>
                        </tr>
                        <tr>
                            <td>Buffer solvent:</td>
                            <td><input
                                data-tag='solvent'
                                type='string'
                                value={vData.solvent}
                                placeholder='Solvent'
                                onChange={(ev: any) => { handleInput(ev, bufferType, _sData, _vData) }}
                            /></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>Information source:</td>
                            <td><input
                                data-tag='source'
                                type='string'
                                value={vData.source}
                                placeholder='Source'
                                onChange={(ev: any) => { handleInput(ev, bufferType, _sData, _vData) }}
                            /></td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
                <div>
                    <textarea
                        data-tag='description'
                        value={vData.description}
                        placeholder='Description'
                        onChange={(ev: any) => { handleInput(ev, bufferType, _sData, _vData) }}
                    />
                    <textarea
                        data-tag='notes'
                        value={vData.notes}
                        placeholder="Final notes (e.g. 'Adjust solution to desired pH (typicalling pH ≈ 7.0).')"
                        onChange={(ev: any) => { handleInput(ev, bufferType, _sData, _vData) }}
                    />
                </div>
                <br />
                Components:
                <table>
                    <thead>
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
                                value={vData.compName}
                                data-tag='compName'
                                onChange={(ev: any) => { handleInput(ev, bufferType, _sData, _vData) }}
                            /></td>
                            <td><input
                                type='number'
                                value={vData.compMW}
                                data-tag='compMW'
                                onChange={(ev: any) => { handleInput(ev, bufferType, _sData, _vData) }}
                            /></td>
                        </tr>
                        <tr>
                            <td><input
                                type='text'
                                placeholder='Acid/Base'
                                value={vData.compConjName}
                                data-tag='compConjName'
                                onChange={(ev: any) => { handleInput(ev, bufferType, _sData, _vData) }}
                            /></td>
                            <td><input
                                type='number'
                                value={vData.compConjMW}
                                data-tag='compConjMW'
                                onChange={(ev: any) => { handleInput(ev, bufferType, _sData, _vData) }}
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
                        <tr>
                            <td><input
                                type='text'
                                value={vData.compName}
                                disabled
                            /></td>
                            <td><input
                                type='text'
                                value={vData.compConjName}
                                disabled
                            /></td>
                            <td>pH</td>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            vData.pHarray.map((props, index) => {
                                return (
                                    <tr key={index}>
                                        <td><input
                                            type='number'
                                            value={props.amount}
                                            data-tag='amount'
                                            data-attribute={index}
                                            onChange={(ev: any) => { handleTableInput(ev, bufferType, _sData, sData, _vData, vData) }}
                                        /></td>
                                        <td><input
                                            type='number'
                                            value={props.conjAmount}
                                            data-tag='conjAmount'
                                            data-attribute={index}
                                            onChange={(ev: any) => { handleTableInput(ev, bufferType, _sData, sData, _vData, vData) }}
                                        /></td>
                                        <td><input
                                            type='number'
                                            value={props.pH}
                                            data-tag='pH'
                                            data-attribute={index}
                                            onChange={(ev: any) => { handleTableInput(ev, bufferType, _sData, sData, _vData, vData) }}
                                        /></td>
                                        <td><button
                                            data-attribute={index}
                                            onClick={(ev: any) => { handleDeleteClick(ev, bufferType, _sData, sData, _vData, vData) }}>&times;</button></td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
                <br />
                <input
                    type='button'
                    value='ADD ROW'
                    onClick={() => { handleAddrowClick(bufferType, _sData, sData, _vData, vData) }}
                />
                <br /><br />
                <input
                    type='button'
                    value='SUBMIT BUFFER'
                    onClick={() => submitBuffer(bufferType, sData, vData)}
                />
            </div>
        </>
    )
}

export default AddBufferToDatabase;