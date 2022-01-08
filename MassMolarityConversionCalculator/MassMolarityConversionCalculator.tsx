import React, { ChangeEventHandler, KeyboardEventHandler, MouseEventHandler, useState } from 'react';
import { RoundSigFig } from './Rounding';
import './MassMolarityConversionCalculator.css';

const concDropMenu = [
    { name: "M", value: "1", tag: "conc" },
    { name: "mM", value: "0.001", tag: "conc" },
    { name: "µM", value: "0.000001", tag: "conc" }
]

const volDropMenu = [
    { name: "L", value: "1", tag: "vol" },
    { name: "mL", value: "0.001", tag: "vol" },
    { name: "µL", value: "0.000001", tag: "vol" }
]

const massDropMenu = [
    { name: "g", value: "1", tag: "mass" },
    { name: "mg", value: "0.001", tag: "mass" },
    { name: "µg", value: "0.000001", tag: "mass" }
]

const MassMolarityConversionCalculator = (props: any) => {
    const [concentration, _concentration] = useState<number | "">("");
    const [volume, _volume] = useState<number | "">("");
    const [mw, _mw] = useState<number | "">("");
    const [mass, _mass] = useState<number | "">("");
    const [unitConcentration, _unitConcentration] = useState<string>("1");
    const [unitVolume, _unitVolume] = useState<string>("1");
    const [unitMass, _unitMass] = useState<string>("1");

    const preventMinus = (event: any) => {
        if (event.code === 'Minus' || event.code === 'NumpadSubtract') {
            event.preventDefault();
        }
    }

    const handleInput = (event: any) => {
        const value = event.target.value;
        const tag = event.target.getAttribute('data-key');
        if (tag === "conc") { _concentration(value); }
        else if (tag === "vol") { _volume(value); }
        else if (tag === "mw") { _mw(value); }
        else if (tag === "mass") { _mass(value); }
    }

    const handleDropDownMenu = (event: any) => {
        const state = event.target.value;
        const tag = event.target[event.target.selectedIndex].getAttribute('data-tag');
        if (tag === "conc") { _unitConcentration(state); }
        else if (tag === "vol") { _unitVolume(state); }
        else if (tag === "mass") { _unitMass(state); }
    }

    const handleCalculateButtonClick = (event: any) => {
        let counter = 0;
        if (concentration !== "") { counter++; }
        if (volume !== "") { counter++; }
        if (mw !== "") { counter++; }
        if (mass !== "") { counter++; }

        if (counter === 3) {
            if (concentration === "") {
                const value = RoundSigFig(calcConcentration(volume, mw, mass, unitConcentration, unitVolume, unitMass), 4);
                _concentration(value);
            }
            else if (volume === "") {
                const value = RoundSigFig(calcVolume(concentration, mw, mass, unitConcentration, unitVolume, unitMass), 4);
                _volume(value);
            }
            else if (mw === "") {
                const value = RoundSigFig(calcMW(concentration, volume, mass, unitConcentration, unitVolume, unitMass), 4);
                _mw(value);
            }
            else if (mass === "") {
                const value = RoundSigFig(calcMass(concentration, volume, mw, unitConcentration, unitVolume, unitMass), 4);
                _mass(value);
            }
        }
        else {
            alert("Enter exactly three numbers to calculate the fourth.");
        }
    }

    return (
        <>
            <RenderPageContent
                concentration={concentration}
                volume={volume}
                mw={mw}
                mass={mass}
                unitConcentration={unitConcentration}
                unitVolume={unitVolume}
                unitMass={unitMass}
                preventMinus={preventMinus}
                handleInput={handleInput}
                handleDropDownMenu={handleDropDownMenu}
                handleCalculateButtonClick={handleCalculateButtonClick}
            />
        </>
    )
}

const calcConcentration = (volume: number | "", mw: number | "", mass: number | "",
    unitConcentration: string, unitVolume: string, unitMass: string) => {
    if (volume !== "" && mw !== "" && mass !== "") {
        const concentration = (mass * Number(unitMass)) / ((volume * Number(unitVolume)) * mw * Number(unitConcentration));
        return concentration;
    }
    else { return 0; }
}

const calcVolume = (concentration: number | "", mw: number | "", mass: number | "",
    unitConcentration: string, unitVolume: string, unitMass: string) => {
    if (concentration !== "" && mw !== "" && mass !== "") {
        const volume = (mass * Number(unitMass)) / ((concentration * Number(unitConcentration)) * mw * Number(unitVolume));
        return volume;
    }
    else { return 0; }
}

const calcMW = (concentration: number | "", volume: number | "", mass: number | "",
    unitConcentration: string, unitVolume: string, unitMass: string) => {
    if (concentration !== "" && volume !== "" && mass !== "") {
        const mw = (mass * Number(unitMass)) / ((concentration * Number(unitConcentration)) * (volume * Number(unitVolume)));
        return mw;
    }
    else { return 0; }
}

const calcMass = (concentration: number | "", volume: number | "", mw: number | "",
    unitConcentration: string, unitVolume: string, unitMass: string) => {
    if (concentration !== "" && volume !== "" && mw !== "") {
        const mass = ((concentration * Number(unitConcentration)) * (volume * Number(unitVolume)) * mw) / (Number(unitMass));
        return mass;
    }
    else { return 0; }
}

const RenderPageContent = (props: {
    concentration: number | "",
    volume: number | "",
    mw: number | "",
    mass: number | ""
    unitConcentration: string,
    unitVolume: string,
    unitMass: string,
    preventMinus: KeyboardEventHandler,
    handleInput: ChangeEventHandler,
    handleDropDownMenu: ChangeEventHandler,
    handleCalculateButtonClick: MouseEventHandler
}) => {
    return (
        <>
            <h1 className="sp_pageHeader">Mass ⟺ Molarity Conversion Calculator</h1>
            <br />
            <div className="tool_standard_container">
                <br /><br />
                <div className="pop_calc_formula" style={{ display: 'block' }}>
                    <table className="pop_calc_formula_table" style={{ textAlign: 'center' }}>
                        <tbody>
                            <tr>
                                <td></td>
                                <td>Concentration</td>
                                <td>
                                    <input
                                        style={{ width: '70%' }}
                                        value={props.concentration}
                                        data-key="conc"
                                        type="number"
                                        min="0"
                                        onKeyPress={props.preventMinus}
                                        onChange={props.handleInput}
                                    />
                                </td>
                                <td>
                                    <select value={props.unitConcentration} onChange={props.handleDropDownMenu}>
                                        {
                                            concDropMenu.map((option, index) => {
                                                return <option value={option.value} data-tag={option.tag}>{option.name}</option>
                                            })
                                        }
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <td>×</td>
                                <td>Volume</td>
                                <td>
                                    <input
                                        style={{ width: '70%' }}
                                        value={props.volume}
                                        data-key="vol"
                                        type="number"
                                        min="0"
                                        onKeyPress={props.preventMinus}
                                        onChange={props.handleInput}
                                    />
                                </td>
                                <td>
                                    <select value={props.unitVolume} onChange={props.handleDropDownMenu}>
                                        {
                                            volDropMenu.map((option, index) => {
                                                return <option value={option.value} data-tag={option.tag}>{option.name}</option>
                                            })
                                        }
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <td style={{ borderBottom: "1px solid #AFAFAF" }}>×</td>
                                <td style={{ borderBottom: "1px solid #AFAFAF" }}>MW (g/mol)</td>
                                <td style={{ borderBottom: "1px solid #AFAFAF" }}>
                                    <input
                                        style={{ width: '70%' }}
                                        value={props.mw}
                                        data-key="mw"
                                        type="number"
                                        min="0"
                                        onKeyPress={props.preventMinus}
                                        onChange={props.handleInput}
                                    />
                                </td>
                                <td style={{ borderBottom: "1px solid #AFAFAF" }}></td>
                            </tr>
                            <tr>
                                <td>=</td>
                                <td>Mass</td>
                                <td>
                                    <input
                                        style={{ width: '70%' }}
                                        value={props.mass}
                                        data-key="mass"
                                        type="number"
                                        min="0"
                                        onKeyPress={props.preventMinus}
                                        onChange={props.handleInput}
                                    />
                                </td>
                                <td>
                                    <select value={props.unitMass} onChange={props.handleDropDownMenu}>
                                        {
                                            massDropMenu.map((option, index) => {
                                                return <option value={option.value} data-tag={option.tag}>{option.name}</option>
                                            })
                                        }
                                    </select>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <br /><br />
                    Enter in three values and press "Calculate" and the fourth value will be calculated.
                    <br /><br />
                    <input
                        type="button"
                        className="cButton"
                        onClick={props.handleCalculateButtonClick}
                        value="Calculate"
                    />
                </div>
                <br /><br />
                <hr />
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
                        <td>"Quest Calculate™ Mass ⟺ Molarity Conversion Calculator." <i>AAT Bioquest, Inc</i>, 07 Jan. 2022, https://www.aatbio.com/tools/quick-calculator/mass-molarity-formula-calculator.</td>
                    </tr>
                    <tr>
                        <td className="ref_table_bold">APA</td>
                        <td>AAT Bioquest, Inc. (2022, January 07). <i>Quest Calculate™ Mass ⟺ Molarity Conversion Calculator."</i>. Retrieved from https://www.aatbio.com/tools/quick-calculator/mass-molarity-formula-calculator</td>
                    </tr>
                </tbody>
            </table>
        </>
    )
}

export default MassMolarityConversionCalculator;