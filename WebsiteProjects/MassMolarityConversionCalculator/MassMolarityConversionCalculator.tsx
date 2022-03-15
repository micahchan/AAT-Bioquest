import React, { KeyboardEventHandler, useState } from 'react';
import { RoundSigFig } from './Rounding';
import './MassMolarityConversionCalculator.css';

const concDropMenu = [
    { name: "M", value: "1", tag: "unitConcentration" },
    { name: "mM", value: "0.001", tag: "unitConcentration" },
    { name: "µM", value: "0.000001", tag: "unitConcentration" }
]

const volDropMenu = [
    { name: "L", value: "1", tag: "unitVolume" },
    { name: "mL", value: "0.001", tag: "unitVolume" },
    { name: "µL", value: "0.000001", tag: "unitVolume" }
]

const massDropMenu = [
    { name: "g", value: "1", tag: "unitMass" },
    { name: "mg", value: "0.001", tag: "unitMass" },
    { name: "µg", value: "0.000001", tag: "unitMass" }
]

const initial: any = {
    concentration: "",
    volume: "",
    mw: "",
    mass: "",
    unitConcentration: "1",
    unitVolume: "1",
    unitMass: "1"
}

type MassMolarityDataType = {
    concentration: number | "",
    volume: number | "",
    mw: number | "",
    mass: number | "",
    unitConcentration: string,
    unitVolume: string,
    unitMass: string
}

const MassMolarityConversionCalculator = (props: any) => {

    const [data, _data] = useState<MassMolarityDataType>(initial);

    return (
        <>
            <RenderPageContent
                data={data}
                _data={_data}
                preventMinus={preventMinus}
                handleInput={handleInput}
                handleDropDownMenu={handleDropDownMenu}
                handleCalculateButtonClick={handleCalculateButtonClick}
            />
        </>
    )
}

const preventMinus = (event: any) => {
    if (event.code === 'Minus' || event.code === 'NumpadSubtract') {
        event.preventDefault();
    }
}

const handleInput = (event: any, _data: Function) => {
    const value = event.target.value;
    const tag = event.target.getAttribute('data-tag');
    _data((data: MassMolarityDataType) => {
        return { ...data, [tag]: value }
    })
}

const handleDropDownMenu = (event: any, _data: Function) => {
    const value = event.target.value;
    const tag = event.target[event.target.selectedIndex].getAttribute('data-tag');
    _data((data: MassMolarityDataType) => {
        return { ...data, [tag]: value }
    })
}

const handleCalculateButtonClick = (event: any, _data: Function, data: MassMolarityDataType) => {
    let counter = 0;
    if (data.concentration !== "") { counter++; }
    if (data.volume !== "") { counter++; }
    if (data.mw !== "") { counter++; }
    if (data.mass !== "") { counter++; }

    if (counter === 3) {
        if (data.concentration === "") {
            const value = RoundSigFig(calcConcentration(data.volume, data.mw, data.mass, data.unitConcentration, data.unitVolume, data.unitMass), 4);
            _data((data: MassMolarityDataType) => {
                return { ...data, concentration: value }
            });
        }
        else if (data.volume === "") {
            const value = RoundSigFig(calcVolume(data.concentration, data.mw, data.mass, data.unitConcentration, data.unitVolume, data.unitMass), 4);
            _data((data: MassMolarityDataType) => {
                return { ...data, volume: value }
            });
        }
        else if (data.mw === "") {
            const value = RoundSigFig(calcMW(data.concentration, data.volume, data.mass, data.unitConcentration, data.unitVolume, data.unitMass), 4);
            _data((data: MassMolarityDataType) => {
                return { ...data, mw: value }
            });
        }
        else if (data.mass === "") {
            const value = RoundSigFig(calcMass(data.concentration, data.volume, data.mw, data.unitConcentration, data.unitVolume, data.unitMass), 4);
            _data((data: MassMolarityDataType) => {
                return { ...data, mass: value }
            });
        }
    }
    else {
        alert("Enter exactly three numbers to calculate the fourth.");
    }
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
    data: MassMolarityDataType,
    _data: Function,
    preventMinus: KeyboardEventHandler,
    handleInput: Function,
    handleDropDownMenu: Function,
    handleCalculateButtonClick: Function
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
                                        value={props.data.concentration}
                                        data-tag="concentration"
                                        type="number"
                                        min="0"
                                        onKeyPress={props.preventMinus}
                                        onChange={(event: any) => { handleInput(event, props._data) }}
                                    />
                                </td>
                                <td>
                                    <select
                                        value={props.data.unitConcentration}
                                        onChange={(event: any) => { handleDropDownMenu(event, props._data) }}
                                    >
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
                                        value={props.data.volume}
                                        data-tag="volume"
                                        type="number"
                                        min="0"
                                        onKeyPress={props.preventMinus}
                                        onChange={(event: any) => { handleInput(event, props._data) }}
                                    />
                                </td>
                                <td>
                                    <select
                                        value={props.data.unitVolume}
                                        onChange={(event: any) => { handleDropDownMenu(event, props._data) }}
                                    >
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
                                        value={props.data.mw}
                                        data-tag="mw"
                                        type="number"
                                        min="0"
                                        onKeyPress={props.preventMinus}
                                        onChange={(event: any) => { handleInput(event, props._data) }}
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
                                        value={props.data.mass}
                                        data-tag="mass"
                                        type="number"
                                        min="0"
                                        onKeyPress={props.preventMinus}
                                        onChange={(event: any) => { handleInput(event, props._data) }}
                                    />
                                </td>
                                <td>
                                    <select
                                        value={props.data.unitMass}
                                        onChange={(event: any) => { handleDropDownMenu(event, props._data) }}
                                    >
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
                        onClick={(event: any) => { handleCalculateButtonClick(event, props._data, props.data) }}
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