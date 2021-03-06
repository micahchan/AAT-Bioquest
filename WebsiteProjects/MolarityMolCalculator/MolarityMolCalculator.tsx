import React, { useState, KeyboardEvent, KeyboardEventHandler, useEffect } from 'react';
import { RoundSigFig } from './Rounding';
import './MolarityMolCalculator.css';

type compoundsType = {
    [key: string]: string | number | boolean;
    name: string | "",
    molecularFormula: string | "",
    mw: number | "",
    mass: number | "",
    cid: number | "",
    valid: boolean | ""
}

type compoundCalcType = {
    [key: string]: string | number | boolean;
    moles: number | "",
    molarity: number | ""
}

const compounds: compoundsType = {
    name: "",
    molecularFormula: "",
    mw: "",
    mass: "",
    cid: "",
    valid: ""
}
const compoundCalc: compoundCalcType = {
    moles: "",
    molarity: ""
}

type MolarityMolDataType = {
    volume: number | "",
    unitVolume: number,
    unitMass: number,
    unitMolarity: number,
    compounds: Array<compoundsType>,
    compoundCalc: Array<compoundCalcType>
}

const initial: MolarityMolDataType = {
    volume: 1,
    unitVolume: 1,
    unitMass: 1,
    unitMolarity: 1,
    compounds: [],
    compoundCalc: []
}

const volDropMenu = [
    { name: "L", value: 1, tag: "unitVolume" },
    { name: "mL", value: .001, tag: "unitVolume" },
    { name: "µL", value: .000001, tag: "unitVolume" }
]
const massDropMenu = [
    { name: "g", value: 1, tag: "unitMass" },
    { name: "mg", value: .001, tag: "unitMass" },
    { name: "µg", value: .000001, tag: "unitMass" }
]

const molarityDropMenu = [
    { name: "M", value: 1, tag: "unitMolarity" },
    { name: "mM", value: .001, tag: "unitMolarity" },
    { name: "µM", value: .000001, tag: "unitMolarity" }
]

let timer: NodeJS.Timeout;

const MolarityMolCalculator = (props: any) => {

    const [data, _data] = useState<MolarityMolDataType>(initial);

    useEffect(() => {
        const w: Array<compoundsType> = [];
        const x: Array<compoundCalcType> = [];
        for (let i = 0; i < 3; i++) {
            const c = { ...compounds }
            const d = { ...compoundCalc }
            w.push(c);
            x.push(d);
        }
        _data((data) => {
            data.compounds = w;
            data.compoundCalc = x;
            return { ...data }
        })
    }, [])

    useEffect(() => {
        _data((data) => {
            for (let i = 0, imax = data.compounds.length; i < imax; i++) {
                let valueMoles: number | "";
                let valueMolarity: number | "";
                if (data.compounds[i].mw === "" || data.compounds[i].mass === "") {
                    valueMoles = "";
                }
                else {
                    valueMoles = calculateMoles(data.compounds[i].mass, data.unitMass, data.compounds[i].mw);
                }
                if (data.volume === "" || valueMoles === "") {
                    valueMolarity = "";
                }
                else {
                    valueMolarity = calculateMolarity(valueMoles, data.unitVolume, data.volume, data.unitMolarity);
                }
                data.compoundCalc[i].moles = valueMoles;
                data.compoundCalc[i].molarity = valueMolarity;
            }
            return { ...data, compoundCalc: [...data.compoundCalc] }
        })
    }, [data.unitMass, data.volume, data.unitVolume, data.unitMolarity, data.compounds])

    /*UseEffect for adding a row when last row has finished calculations.
    */
    useEffect(() => {
        const lastEntry = data.compoundCalc[data.compoundCalc.length - 1];
        if (lastEntry.moles !== "" || lastEntry.molarity !== "") {
            const w: Array<compoundsType> = [...data.compounds];
            const x: Array<compoundCalcType> = [...data.compoundCalc];
            const newCompoundW = { ...compounds }
            const newCompoundX = { ...compoundCalc }
            w.push(newCompoundW);
            x.push(newCompoundX);
            _data((data) => {
                data.compounds = w;
                data.compoundCalc = x;
                return { ...data }
            })
        }
    }, [data.compoundCalc, data.compounds])

    return (
        <>
            <RenderPageContent
                handleInput={handleInput}
                handleTableInput={handleTableInput}
                preventMinus={preventMinus}
                _data={_data}
                data={data}
            />
        </>
    )
}

/**
 * Prevents input from being negative by stopping both keyboard inputs for negative.
 * @param ev
 */
const preventMinus = (ev: KeyboardEvent) => {
    if (ev.code === 'Minus' || ev.code === 'NumpadSubtract') {
        ev.preventDefault();
    }
}

const handleInput = (ev: any, _data: React.Dispatch<React.SetStateAction<MolarityMolDataType>>) => {
    const tag = ev.target.getAttribute('data-tag');
    const value = ev.target.value;
    _data((data) => {
        return { ...data, [tag]: value }
    })
}

const handleName = (ev: any, _data: React.Dispatch<React.SetStateAction<MolarityMolDataType>>, data: MolarityMolDataType) => {
    let index = ev.target.getAttribute('data-attribute');
    let value = ev.target.value;
    fetch(`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${value}/property/MolecularWeight,MolecularFormula,IUPACName/json`)
        .then(response => {
            if (!response.ok) {
                _data((data) => {
                    data.compounds[index].valid = false;
                    data.compounds[index].mw = "";
                    data.compounds[index].mf = "";
                    return { ...data, compounds: [...data.compounds] }
                })
                throw response;
            }
            return response.json();
        })
        .then(users => {
            const cid = users['PropertyTable']['Properties'][0]['CID'];
            const mw = users['PropertyTable']['Properties'][0]['MolecularWeight'];
            const mf = users['PropertyTable']['Properties'][0]['MolecularFormula'];

            _data((data) => {
                data.compounds[index].valid = true;
                data.compounds[index].mw = mw;
                data.compounds[index].molecularFormula = mf;
                data.compounds[index].cid = cid;
                return { ...data, compounds: [...data.compounds] }
            })
        })
    /**
     * would need some sort of error catching added here
     * .then(throw error).catch(e => {} )
     */
}

const debounce = (ev: any, _data: React.Dispatch<React.SetStateAction<MolarityMolDataType>>, data: MolarityMolDataType) => {
    if (timer) { clearTimeout(timer); }
    timer = setTimeout(() => handleName(ev, _data, data), 500);
}


const handleTableInput = (ev: any, _data: React.Dispatch<React.SetStateAction<MolarityMolDataType>>, data: MolarityMolDataType) => {
    const tag = ev.target.getAttribute('data-tag');
    const value = ev.target.value;
    const index = ev.target.getAttribute('data-attribute')

    _data((data) => {
        data.compounds[index][tag] = value;
        return { ...data, compounds: [...data.compounds] }
    })
    console.log("The current value of data.compounds[" + index + "][" + tag + "] is: " + value);
    if (tag === "name") {
        debounce(ev, _data, data);
    }
}

const handleDropDownMenu = (ev: any, _data: React.Dispatch<React.SetStateAction<MolarityMolDataType>>) => {
    const value = ev.target.value;
    const tag = ev.target[ev.target.selectedIndex].getAttribute('data-tag');
    _data((data) => {
        return { ...data, [tag]: value }
    })
}

const calculateMoles = (mass: number | "", unitMass: number, mw: number | "") => {
    if (mass !== "" && mw !== "") {
        const moles = RoundSigFig(((mass * unitMass) / mw), 3);
        return moles;
    }
    else { return 0; }
}

const calculateMolarity = (valueMoles: number | "", volume: number | "", unitVolume: number, unitMolarity: number) => {
    if (valueMoles !== "" && volume !== "") {
        const molarity = RoundSigFig((valueMoles / (volume * unitVolume * unitMolarity)), 3);
        return molarity;
    }
    else { return 0; }
}

const RenderPageContent = (props: {
    handleInput: Function,
    handleTableInput: Function,
    preventMinus: KeyboardEventHandler,
    _data: React.Dispatch<React.SetStateAction<MolarityMolDataType>>,
    data: MolarityMolDataType
}) => {
    const { handleInput, preventMinus, _data, data } = props;
    return (
        <>
            <h1 className="sp_pageHeader">Molarity Calculator</h1>
            <br />
            <div className="tool_standard_container">
                <span className="sub_desc">This calculator provides the moles and molarity for a given set of compounds when provided the mass and molecular weight. Molecular weight can be automatically computed if a chemical compound name is provided. Completing one calculation will automatically extend the table for further computation.</span>
                <br />
                <div className="molarity">
                    <div className="solution_description">
                        Calculating molarity based on&nbsp;
                        <input
                            type="number"
                            min="0"
                            value={data.volume}
                            onKeyPress={preventMinus}
                            data-tag="volume"
                            onChange={(event: any) => { handleInput(event, _data) }}
                        />
                        <select
                            value={data.unitVolume}
                            onChange={(event: any) => { handleDropDownMenu(event, _data) }}
                        >
                            {
                                volDropMenu.map((option) => {
                                    return <option value={option.value} data-tag={option.tag}>{option.name}</option>
                                })
                            }
                        </select>
                        &nbsp;of solution
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <td>Compound</td>
                                <td>Pubmed Entry</td>
                                <td>Molecular Weight</td>
                                <td>
                                    Mass&nbsp;
                                    <select
                                        value={data.unitMass}
                                        onChange={(event: any) => { handleDropDownMenu(event, _data) }}
                                    >
                                        {
                                            massDropMenu.map((option) => {
                                                return <option value={option.value} data-tag={option.tag}>{option.name}</option>
                                            })
                                        }
                                    </select>
                                </td>
                                <td>Moles</td>
                                <td>
                                    Molarity&nbsp;
                                    <select
                                        value={data.unitMolarity}
                                        onChange={(event: any) => { handleDropDownMenu(event, _data) }}
                                    >
                                        {
                                            molarityDropMenu.map((option) => {
                                                return <option value={option.value} data-tag={option.tag}>{option.name}</option>
                                            })
                                        }
                                    </select>
                                </td>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data.compounds.map((props, index) => {
                                    return (
                                        <tr>
                                            <td><input
                                                type="text"
                                                value={props.name}
                                                data-tag="name"
                                                data-attribute={index}
                                                onChange={(event: any) => {
                                                    handleTableInput(event, _data, data)
                                                }} /></td >
                                            <td>
                                                {(data.compounds[index].name === "") ? "-" :
                                                    (data.compounds[index].valid === false) ? "No matching compounds" :
                                                        <a style={{ textDecoration: "none" }} href={"https://pubchem.ncbi.nlm.nih.gov/compound/" + data.compounds[index].cid}>{data.compounds[index].molecularFormula}</a>}
                                            </td>
                                            <td><input
                                                type="number"
                                                value={props.mw}
                                                data-tag="mw"
                                                data-attribute={index}
                                                onChange={(event: any) => { handleTableInput(event, _data, data) }}
                                            /></td>
                                            <td><input
                                                type="number"
                                                value={props.mass}
                                                data-tag="mass"
                                                data-attribute={index}
                                                onChange={(event: any) => { handleTableInput(event, _data, data) }}
                                            /></td>
                                            <td><input
                                                type="number"
                                                value={data.compoundCalc[index].moles}
                                                data-tag="moles"
                                                data-attribute={index}
                                                disabled
                                            /></td>
                                            <td><input
                                                type="number"
                                                value={data.compoundCalc[index].molarity}
                                                data-tag="molarity"
                                                data-attribute={index}
                                                disabled
                                            /></td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
                <br /><br /><hr />
                <RenderReferences />
            </div>
        </>
    )
}

const RenderReferences = () => {
    return (
        <>
            <span className="subSectionHeader">References</span>
            <table className="ref_table">
                <tbody>
                    <tr><td colSpan={2} className="ref_table_bold">This online tool may be cited as follows</td></tr>
                    <tr>
                        <td className="ref_table_bold">MLA</td>
                        <td>"Quest Calculate™ Molarity Calculator." <i>AAT Bioquest, Inc</i>, 12 Jan. 2022, https://www.aatbio.com/tools/free-online-molarity-concentration-mols-calculator.</td>
                    </tr>
                    <tr>
                        <td className="ref_table_bold">APA</td>
                        <td>AAT Bioquest, Inc. (2022, January 12). <i>Quest Calculate™ Molarity Calculator."</i>. Retrieved from https://www.aatbio.com/tools/free-online-molarity-concentration-mols-calculator</td>
                    </tr>
                </tbody>
            </table>
        </>
    )
}

export default MolarityMolCalculator;