import React, { ChangeEventHandler, KeyboardEventHandler, MouseEventHandler, useState } from 'react';
import { RoundSigFig } from './Rounding';
import './RpmRcfConversionCalculator.css';

const RpmRcfConversionCalculator = (props: any) => {
    const [radius, _radius] = useState<number | "">("");
    const [rpm, _rpm] = useState<number | "">("");
    const [rcf, _rcf] = useState<number | "">("");

    const preventMinus = (event: any) => {
        if (event.code === 'Minus' || event.code === 'NumpadSubtract') {
            event.preventDefault();
        }
    }

    const handleInputRadius = (event: any) => {
        let value = event.target.value;
        _radius(value);
    }

    const handleInputRPM = (event: any) => {
        let value = event.target.value;
        _rpm(value);
    }

    const handleInputRCF = (event: any) => {
        let value = event.target.value;
        _rcf(value);
    }

    const handleCalculateButtonClick = (event: any) => {
        let counter = 0;
        if (radius !== "") { counter++; }
        if (rpm !== "") { counter++; }
        if (rcf !== "") { counter++; }

        if (counter === 2) {
            if (radius === "") {
                let value = RoundSigFig(calcRadius(rcf, rpm), 4);
                _radius(value);
            }
            else if (rpm === "") {
                let value = RoundSigFig(calcRPM(rcf, radius), 4);
                _rpm(value);
            }
            else if (rcf === "") {
                let value = RoundSigFig(calcRCF(radius, rpm), 4);
                _rcf(value);
            }
        }
        else {
            alert("Enter exactly two numbers to calculate the third.");
        }
    }

    return (
        <>
            <RenderPageContent
                radius={radius}
                rpm={rpm}
                rcf={rcf}
                preventMinus={preventMinus}
                handleInputRadius={handleInputRadius}
                handleInputRPM={handleInputRPM}
                handleInputRCF={handleInputRCF}
                handleCalculateButtonClick={handleCalculateButtonClick}
            />
        </>
    )
}

const calcRadius = (rcf: number | "", rpm: number | "") => {
    if (rcf !== "" && rpm !== "") {
        const radius = rcf / (1.12 * (Math.pow((rpm / 1000), 2)));
        return radius;
    }
    else { return 0; }
}

const calcRPM = (rcf: number | "", radius: number | "") => {
    if (rcf !== "" && radius !== "") {
        const RPM = 1000 * Math.sqrt(rcf / (1.12 * radius));
        return RPM;
    }
    else { return 0; }
}

const calcRCF = (radius: number | "", rpm: number | "") => {
    if (radius !== "" && rpm !== "") {
        const RCF = 1.12 * radius * ((rpm / 1000) ** 2);
        return RCF;
    }
    else { return 0; }
}

const RenderPageContent = (props: {
    radius: number | "",
    rpm: number | "",
    rcf: number | "",
    preventMinus: KeyboardEventHandler,
    handleInputRadius: ChangeEventHandler,
    handleInputRPM: ChangeEventHandler,
    handleInputRCF: ChangeEventHandler,
    handleCalculateButtonClick: MouseEventHandler
}) => {
    return (
        <>
            <h1 className="sp_pageHeader">RPM ⟺ RCF Conversion Calculator</h1>
            <br />
            <div className="tool_standard_container">
                <br /><br />
                <div className="pop_calc_formula" style={{ display: 'block' }}>
                    <table className="pop_calc_formula_table">
                        <tbody>
                            <tr>
                                <td></td>
                                <td>1.12</td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>×</td>
                                <td>Radius (mm)</td>
                                <td></td>
                                <td>
                                    <input
                                        value={props.radius}
                                        type="number"
                                        min="0"
                                        onKeyPress={props.preventMinus}
                                        onChange={props.handleInputRadius}
                                    />
                                </td>
                                <td></td>
                            </tr>
                            <tr>
                                <td style={{ borderBottom: "1px solid #afafaf" }}>×</td>
                                <td style={{ borderBottom: "1px solid #afafaf" }}>RPM</td>
                                <td style={{ borderBottom: "1px solid #afafaf" }}>(</td>
                                <td style={{ borderBottom: "1px solid #afafaf" }}>
                                    <input
                                        value={props.rpm}
                                        type="number"
                                        min="0"
                                        onKeyPress={props.preventMinus}
                                        onChange={props.handleInputRPM}
                                    />
                                </td>
                                <td style={{ borderBottom: "1px solid #afafaf" }}>/ 1000 )<sup>2</sup></td>
                            </tr>
                            <tr>
                                <td>=</td>
                                <td>RCF</td>
                                <td></td>
                                <td>
                                    <input
                                        value={props.rcf}
                                        type="number"
                                        min="0"
                                        onKeyPress={props.preventMinus}
                                        onChange={props.handleInputRCF} />
                                </td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                    <br /><br />
                    Enter in two values and press "Calculate" and the third value will be calculated.
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
                        <td>"Quest Calculate™ RPM ⟺ RCF Conversion Calculator."<i>AAT Bioquest, Inc</i>, 07 Jan. 2022, https://www.aatbio.com/tools/quick-calculator/rpmrcf-formula-calculator.</td>
                    </tr>
                    <tr>
                        <td className="ref_table_bold">APA</td>
                        <td>AAT Bioquest, Inc. (2022, January 07). <i>Quest Calculate™ RPM ⟺ RCF Conversion Calculator."</i>. Retrieved from https://www.aatbio.com/tools/quick-calculator/rpmrcf-formula-calculator</td>
                    </tr>
                </tbody>
            </table>
        </>
    )
}

export default RpmRcfConversionCalculator;