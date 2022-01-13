import React, { useState, KeyboardEvent, KeyboardEventHandler } from 'react';
import { RoundSigFig } from './Rounding';
import './MolarityMolCalculator.css';

type MolarityMolDataType = {
    volume: number | "",
    unitVolume: string
    unitMass: string,
    unitMolarity: string,
    compounds: {
        name: string | "",
        mw: number | "",
        mass: number | "",
        moles: number | "",
        molarity: number | ""
    }
}

const initial: MolarityMolDataType = {
    volume: 1,
    unitVolume: "1",
    unitMass: "1",
    unitMolarity: "1",
    compounds: {
        name: "",
        mw: "",
        mass: "",
        moles: "",
        molarity: ""
    }
}

const volDropMenu = [
    { name: "L", value: "1", tag: "unitVolume" },
    { name: "mL", value: "1000", tag: "unitVolume" },
    { name: "µL", value: "1000000", tag: "unitVolume" }
]
const massDropMenu = [
    { name: "g", value: "1", tag: "unitMass" },
    { name: "mg", value: "1000", tag: "unitMass" },
    { name: "µg", value: "1000000", tag: "unitMass" }
]

const molarityDropMenu = [
    { name: "M", value: "1", tag: "unitMolarity" },
    { name: "mM", value: "1000", tag: "unitMolarity" },
    { name: "µM", value: "1000000", tag: "unitMolarity" }
]

const MolarityMolCalculator = (props: any) => {

    const [data, _data] = useState<MolarityMolDataType>(initial);

    return (
        <>
            <RenderPageContent
                handleInput={handleInput}
                preventMinus={preventMinus}
                _data={_data}
                data={data}
            />
            {console.log("The volume is: " + data.volume)}
            {console.log("The unitVolume is: " + data.unitVolume)}
            {console.log("The unitMass is: " + data.unitMass)}
            {console.log("The unitMolarity is: " + data.unitMolarity)}
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

const handleInput = (ev: any, _data: React.Dispatch<React.SetStateAction<MolarityMolDataType>>
    , data: MolarityMolDataType) => {
    const tag = ev.target.getAttribute('data-tag');
    const value = ev.target.value;
    _data((data) => {
        return { ...data, [tag]: value }
    })
}

const handleDropDownMenu = (event: any, _data: React.Dispatch<React.SetStateAction<MolarityMolDataType>>) => {
    const value = event.target.value;
    const tag = event.target[event.target.selectedIndex].getAttribute('data-tag');
    _data((data) => {
        return { ...data, [tag]: value }
    })
}

const recalculateAll = (event: any) => {
    //code for calculating new molarity based on new input of volume solution
}

const RenderPageContent = (props: {
    handleInput: Function,
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

                            }
                        </tbody>
                    </table>
                </div>
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