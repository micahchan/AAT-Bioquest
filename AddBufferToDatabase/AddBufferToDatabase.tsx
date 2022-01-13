import React, { useState, ChangeEvent } from 'react';
import './AddBufferToDatabase.css';

type s_type = {
    name: string | "",
    pH: number | "",
    molarity: number | "",
    solvent: string | "",
    source: string | "",
    description: string | "",
    notes: string | "",
    components: {
        name: string | "",
        units: number | "",
        initialMolarity: number | "",
        mw: number | ""
    }
}

const s_initial: s_type = {
    name: "",
    pH: "",
    molarity: "",
    solvent: "",
    source: "",
    description: "",
    notes: "",
    components: {
        name: "",
        units: "",
        initialMolarity: "",
        mw: ""
    }
}

/**
 * Main component creating page for entry to add a buffer
 * @param props 
 * @returns 
 */
const AddBufferToDatabase = (props: any) => {

    const [bufferType, _bufferType] = useState<string>("single");
    const [sData, _sData] = useState<s_type>(s_initial);

    return (
        <>
            <RenderPageContent
                handleRadioInput={handleRadioInput}
                handleInput={handleInput}
                _bufferType={_bufferType}
                bufferType={bufferType}
                _sData={_sData}
                sData={sData}
            />
            {console.log("Name: " + sData.name)}
            {console.log("pH: " + sData.pH)}
            {console.log("molarity: " + sData.molarity)}
            {console.log("solvent: " + sData.solvent)}
            {console.log("source: " + sData.source)}
            {console.log("description: " + sData.description)}
            {console.log("notes: " + sData.notes)}
        </>
    )
}

const handleInput = (ev: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>, bufferType: string, _sData: React.Dispatch<React.SetStateAction<s_type>>) => {
    const tag: string = (ev.target.getAttribute('data-tag') !== null) ? ev.target.getAttribute('data-tag') : "";
    const value = ev.target.value;
    if (bufferType === "single") {
        _sData((sData) => {
            return { ...sData, [tag]: value }
        })
    }
}

/**
 * Function handling radio button input
 * @param ev radio button input change event
 * @param _bufferType updater function for the type of buffer string
 */
const handleRadioInput = (ev: ChangeEvent<HTMLInputElement>, _bufferType: React.Dispatch<React.SetStateAction<string>>) => {
    const state = ev.target.value;
    _bufferType(state);
    console.log("The current state is: " + state);
}

const RenderPageContent = (props: {
    handleRadioInput: (ev: ChangeEvent<HTMLInputElement>, _bufferType: React.Dispatch<React.SetStateAction<string>>) => void,
    handleInput: Function,
    _bufferType: React.Dispatch<React.SetStateAction<string>>,
    bufferType: string,
    sData: s_type
    _sData: Function
}) => {
    const { handleRadioInput, handleInput, _bufferType, bufferType, sData, _sData } = props;
    return (
        <>
            <div>
                <input
                    type="radio"
                    onClick={(event: any) => { handleRadioInput(event, _bufferType) }}
                    value="single"
                    name="buffer"
                    defaultChecked />Single pH Buffer
                <input
                    type="radio"
                    onClick={(event: any) => { handleRadioInput(event, _bufferType) }}
                    value="variable"
                    name="buffer" />Variable pH Buffer

                <br /><br />
            </div>
            <div>
                {(props.bufferType === "single") ? <RenderSinglePHBufferSection
                    sData={sData}
                    _sData={_sData}
                    bufferType={bufferType}
                    handleInput={handleInput}
                /> :
                    (props.bufferType === "variable") ? <RenderVariablePHBufferSection /> : ""}
            </div>
        </>
    )
}

const RenderSinglePHBufferSection = (props: {
    sData: s_type,
    _sData: Function,
    bufferType: string,
    handleInput: Function
}) => {
    const { sData, _sData, bufferType, handleInput } = props;
    return (
        <>

            <div>
                <table>
                    <tbody>
                        <tr>
                            <td>Buffer name:</td>
                            <td>
                                <input
                                    data-tag="name"
                                    type="string"
                                    value={sData.name}
                                    placeholder="Buffer name"
                                    onChange={(event: any) => { handleInput(event, bufferType, _sData) }}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>Buffer pH:</td>
                            <td>
                                <input
                                    data-tag="pH"
                                    type="number"
                                    value={sData.pH}
                                    placeholder="pH of buffer"
                                    onChange={(event: any) => { handleInput(event, bufferType, _sData) }}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>Molarity of final solution:</td>
                            <td>
                                <input
                                    data-tag="molarity"
                                    type="number"
                                    value={sData.molarity}
                                    placeholder="Molarity of buffer"
                                    onChange={(event: any) => { handleInput(event, bufferType, _sData) }}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>Buffer solvent:</td>
                            <td>
                                <input
                                    data-tag="solvent"
                                    type="string"
                                    value={sData.solvent}
                                    placeholder="Solvent"
                                    onChange={(event: any) => { handleInput(event, bufferType, _sData) }}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>Information source:</td>
                            <td>
                                <input
                                    data-tag="source"
                                    type="string"
                                    value={sData.source}
                                    placeholder="Source"
                                    onChange={(event: any) => { handleInput(event, bufferType, _sData) }}
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div>
                    <textarea
                        data-tag="description"
                        value={sData.description}
                        placeholder="Description"
                        onChange={(event: any) => { handleInput(event, bufferType, _sData) }}
                    />
                    <textarea
                        data-tag="notes"
                        value={sData.notes}
                        placeholder="Final notes (e.g. 'Adjust solution to desired pH (typicalling pH ≈ 7.0).')"
                        onChange={(event: any) => { handleInput(event, bufferType, _sData) }}
                    />
                </div>
                <br />Components:
                <table>

                </table>
            </div>
        </>
    )
}

const RenderVariablePHBufferSection = () => {
    return (
        <>
            <div>Variable PH buffer is showing</div>
        </>
    )
}

export default AddBufferToDatabase;