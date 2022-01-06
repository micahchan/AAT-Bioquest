import React, { useState, useEffect } from 'react';
import { RoundSigFig } from './Rounding';

const DnaRnaConcentrationCalculator = (props: { type: "DNA" | "RNA" }) => {
    const [select, _select] = useState((props.type === "DNA") ? "dsDNA" : "ssRNA");
    const [strandType, _strandType] = useState("dsDNA");
    const [sequence, _sequence] = useState("");
    const [mw, _mw] = useState(-99);
    const [ec, _ec] = useState(-99);
    const [absorbance, _absorbance] = useState(0);
    const [dilutionFactor, _dilutionFactor] = useState(1);
    const [pathlength, _pathlength] = useState(0);
    const [cf, _cf] = useState((props.type === "DNA") ? 50 : 40);
    const [validSeq, _validSeq] = useState<boolean | null>(null);
    const [resultsMW, _resultsMW] = useState(0);
    const [resultsEC, _resultsEC] = useState(0);
    const [resultsABS, _resultsABS] = useState(0);
    const [resultsDF, _resultsDF] = useState(0);
    const [resultsPL, _resultsPL] = useState(0);
    const [resultsCF, _resultsCF] = useState(0);
    const [results, _results] = useState<number | string | null>(null);

    useEffect(() => {
        const calculateNucleotideValues = () => {
            const dnaValuesObj: any = { 'A': 331.2, 'T': 322.2, 'G': 347.2, 'C': 307.2 };
            const rnaValuesObj: any = { 'A': 347.2, 'U': 324.2, 'G': 363.2, 'C': 323.2 };

            let mw = 0;
            let mw_comp = 0;
            let ec = 0;
            let ec_comp = 0;
            let base_count = 0;
            let at_count = 0;
            let gc_count = 0;
            let hypochromicity = 0;
            let sigma_D = 0;

            const formattedSeq = sequence.toUpperCase();
            const split = formattedSeq.split("");

            if (props.type === "DNA") {
                for (let i = 0; i < split.length; i++) {
                    const key = split[i];
                    mw += dnaValuesObj[key];

                    if (split[i] === "T") { mw_comp += 331.2; at_count++; }
                    else if (split[i] === "A") { mw_comp += 322.2; at_count++; }
                    else if (split[i] === "G") { mw_comp += 307.2; gc_count++; }
                    else if (split[i] === "C") { mw_comp += 347.2; gc_count++; }
                    base_count++;

                    if (i !== (split.length - 1)) {
                        if (split[i] === "T" && split[i + 1] === "A") { ec += 23400; ec_comp += 23400; }
                        else if (split[i] === "T" && split[i + 1] === "T") { ec += 16800; ec_comp += 27400; }
                        else if (split[i] === "T" && split[i + 1] === "G") { ec += 19000; ec_comp += 21200; }
                        else if (split[i] === "T" && split[i + 1] === "C") { ec += 16200; ec_comp += 25200; }
                        else if (split[i] === "A" && split[i + 1] === "A") { ec += 27400; ec_comp += 16800; }
                        else if (split[i] === "A" && split[i + 1] === "T") { ec += 22800; ec_comp += 22800; }
                        else if (split[i] === "A" && split[i + 1] === "G") { ec += 25000; ec_comp += 15200; }
                        else if (split[i] === "A" && split[i + 1] === "C") { ec += 21200; ec_comp += 20000; }
                        else if (split[i] === "C" && split[i + 1] === "A") { ec += 21200; ec_comp += 19000; }
                        else if (split[i] === "C" && split[i + 1] === "T") { ec += 15200; ec_comp += 25000; }
                        else if (split[i] === "C" && split[i + 1] === "G") { ec += 18000; ec_comp += 18000; }
                        else if (split[i] === "C" && split[i + 1] === "C") { ec += 14600; ec_comp += 21600; }
                        else if (split[i] === "G" && split[i + 1] === "A") { ec += 25200; ec_comp += 16200; }
                        else if (split[i] === "G" && split[i + 1] === "T") { ec += 20000; ec_comp += 21200; }
                        else if (split[i] === "G" && split[i + 1] === "G") { ec += 21600; ec_comp += 14600; }
                        else if (split[i] === "G" && split[i + 1] === "C") { ec += 17600; ec_comp += 17600; }
                    }

                    if (i !== 0 && i !== (split.length - 1)) {
                        if (split[i] === "T") { ec -= 8700; ec_comp -= 15400; }
                        else if (split[i] === "A") { ec -= 15400; ec_comp -= 8700; }
                        else if (split[i] === "G") { ec -= 11500; ec_comp -= 7400; }
                        else if (split[i] === "C") { ec -= 7400; ec_comp -= 11500; }
                    }

                    console.log("The current value of ec is: " + ec);
                }
            }
            else if (props.type === "RNA") {
                for (let i = 0; i < split.length; i++) {
                    const key = split[i];
                    mw += rnaValuesObj[key];

                    if (split[i] === "U") { mw_comp += 347.2 }
                    else if (split[i] === "A") { mw_comp += 324.2 }
                    else if (split[i] === "G") { mw_comp += 323.2 }
                    else if (split[i] === "C") { mw_comp += 363.2 }

                    if (i !== (split.length - 1)) {
                        if (split[i] === "U" && split[i + 1] === "A") { ec += 24600; ec_comp += 24600; }
                        else if (split[i] === "U" && split[i + 1] === "U") { ec += 19600; ec_comp += 27400; }
                        else if (split[i] === "U" && split[i + 1] === "G") { ec += 20000; ec_comp += 21000; }
                        else if (split[i] === "U" && split[i + 1] === "C") { ec += 17200; ec_comp += 25200; }
                        else if (split[i] === "A" && split[i + 1] === "A") { ec += 27400; ec_comp += 19600; }
                        else if (split[i] === "A" && split[i + 1] === "U") { ec += 24000; ec_comp += 24000; }
                        else if (split[i] === "A" && split[i + 1] === "G") { ec += 25000; ec_comp += 16200; }
                        else if (split[i] === "A" && split[i + 1] === "C") { ec += 21200; ec_comp += 21200; }
                        else if (split[i] === "C" && split[i + 1] === "A") { ec += 21000; ec_comp += 20000; }
                        else if (split[i] === "C" && split[i + 1] === "U") { ec += 16200; ec_comp += 25000; }
                        else if (split[i] === "C" && split[i + 1] === "G") { ec += 17800; ec_comp += 17800; }
                        else if (split[i] === "C" && split[i + 1] === "C") { ec += 14200; ec_comp += 21600; }
                        else if (split[i] === "G" && split[i + 1] === "A") { ec += 25200; ec_comp += 17200; }
                        else if (split[i] === "G" && split[i + 1] === "U") { ec += 21200; ec_comp += 21000; }
                        else if (split[i] === "G" && split[i + 1] === "G") { ec += 21600; ec_comp += 14200; }
                        else if (split[i] === "G" && split[i + 1] === "C") { ec += 17400; ec_comp += 17400; }
                    }

                    if (i !== 0 && i !== (split.length - 1)) {
                        if (split[i] === "U") { ec -= 9900; ec_comp -= 15400; }
                        else if (split[i] === "A") { ec -= 15400; ec_comp -= 9900; }
                        else if (split[i] === "G") { ec -= 11500; ec_comp -= 7200; }
                        else if (split[i] === "C") { ec -= 7200; ec_comp -= 11500; }
                    }
                }
            }
            hypochromicity = (0.287 * (at_count / base_count)) + (0.059 * (gc_count / base_count));
            sigma_D = RoundSigFig((1 - hypochromicity) * (ec + ec_comp), 5);
            mw = mw - ((split.length - 1) * 18.015);
            mw_comp = mw_comp - ((split.length - 1) * 18.015);

            console.log("The hypochromicity is: " + hypochromicity);
            console.log("The sigma_D is: " + sigma_D);
            console.log("The ec is: " + ec);

            if (props.type === "DNA" && strandType === "dsDNA") {
                _mw(mw + mw_comp);
                _ec(sigma_D);
            }
            else {
                _mw(mw);
                _ec(ec);
            }
            _validSeq(true);
        }

        if (select === "custom") {
            _mw(-99);
            _ec(-99);
        }

        if (select !== "custom" || sequence === "" || sequence === undefined || sequence === null) { return; }
        else { calculateNucleotideValues(); }
    }, [sequence, select, strandType])

    const handleKeyPress = (event: any) => {
        let string;
        if (props.type === "DNA") { string = event.target.value.replaceAll(/[^ATGC]/gi, "") }
        else if (props.type === "RNA") { string = event.target.value.replaceAll(/[^AUGC]/gi, "") }
        _sequence(string);
    }

    const calculateRatioResult = () => {
        const value = absorbance * cf * dilutionFactor / pathlength;
        return value;
    }

    const calculateEquationResults = () => {
        const value = absorbance * mw * dilutionFactor / (ec * pathlength);
        return value;
    }

    const handleDropDownMenu = (event: any) => {
        const state = event.target.value;
        _select(state);
        let valueCF = event.target[event.target.selectedIndex].getAttribute('data-CF');
        _cf(valueCF);
    }

    const handleInputAbsorbance = (event: any) => {
        let value = event.target.value;
        if (value === "") { value = 0; }
        _absorbance(value);
    }

    const handleInputDilutionFactor = (event: any) => {
        let value = event.target.value;
        if (value === "") { value = 1; }
        _dilutionFactor(value);
    }

    const handleInputPathlength = (event: any) => {
        let value = event.target.value;
        if (value === "") { value = 0; }
        _pathlength(value);
    }

    const handleMouseClick = (event: any) => {
        const state = "custom";
        _select(state);
    }

    const handleRadioButtonClick = (event: any) => {
        const state = event.target.value;
        _strandType(state);
    }

    const handleCalculateButtonClick = (event: any) => {
        _resultsABS(absorbance);
        _resultsDF(dilutionFactor);
        _resultsPL(pathlength);
        _resultsCF(cf);
        _resultsEC(ec);
        _resultsMW(mw);
        console.log(mw);
        console.log(ec);
        let value;
        if (select !== "custom") {
            value = RoundSigFig(calculateRatioResult(), 2);
        }
        else {
            value = RoundSigFig(calculateEquationResults(), 2);
        }
        //_results("missing") returns missing input error
        if (absorbance === 0 || pathlength === 0 || (select === "custom" && sequence === "")) { _results("missing") }
        //_results("invalid") returns invalid input error
        else if (absorbance < 0 || pathlength < 0 || dilutionFactor < 0 || ((ec < 0 || mw < 0) && cf < 0)) { _results("invalid") }
        //_results("errorEC") returns error for dividing by 0 because of extinction coefficient value = 0
        else if (value === Infinity && ec === 0) { _results("errorEC") }
        //_results("errorPL") returns error for dividing by 0 because of pathlength value = 0
        else if (value === Infinity) { _results("errorPL") }
        //_results("error") returns general error, unable to calculate
        else if (isNaN(value) === true) { _results("error") }
        else { _results(value) }
    }

    const renderPageContent = () => {
        return (
            <>
                <div style={{ minWidth: "900px" }}>
                    <h1>{props.type} Concentration Calculator</h1>
                    The concentration of {props.type} in solution can be determined by substituting the molecular weight, extinction coefficient and λ<sub>max</sub> into a derived form of the Beer-Lambert Law. A substance's λ<sub>max</sub> is the wavelength at which it experiences the strongest absorbance. For {props.type}, this wavelength is 260 nm.
                    <br /><br />
                    The absorbance at λ<sub>max</sub> can be measured using a spectrophotometer. There are some important things to keep in mind when measuring 260 absorbance:
                    <br /><br />
                    <ol>
                        <li>The {props.type} should be well-dissolved in solution. {props.type} precipitation will cause inaccuracies in concentration calculations.</li>
                        <br />
                        <li>The absorbance reading should not exceed the maximum detection limit of the instrumentation. This can be identified by a plateau in the absorbance spectrum. If the absorbance spectrum plateaus, dilute the sample and try again.</li>
                        <br />
                        <li>This calculator assumes a 1 cm pathlength for instrumentation. Standard cuvettes for spectrophotometers are typically 1 cm. If a different pathlength is used, value should be corrected during data entry.</li>
                    </ol>
                    <br /><br />
                </div>
                <div className="twoColumn">
                    <div className="twoColumnLeft"
                        style={{
                            display: "inline-block",
                            width: "50%",
                            verticalAlign: "top",
                            minWidth: "470px"
                        }}>
                        <h3> How to use this tool</h3>
                        <div>
                            <ol>
                                <li>Select the nucleotide. Or select <span style={{ color: "red", fontWeight: "bold", cursor: "pointer" }} onClick={handleMouseClick}>"custom sequence"</span> to enter the nucleic acid sequence.</li>
                                <br />
                                <li>Enter the absorbance at λ<sub>max</sub>. For a typical nucleotide, λ<sub>max</sub> is 260 nm. However, this value may change based on the nucleotide. Please use the maximum absorbance as indicated by the spectrophotometric reading (ie. highest peak).</li>
                                <br />
                                <li>If the absorbance is obtained with a diluted sample, enter the dilution factor in order to determine the concentration of the original sample.</li>
                                <br />
                                <li>If pathlength differs from 1 cm, enter corrected value into pathlength textbox.</li>
                                <br />
                                <li>Press calculate to display the concentration.</li>
                            </ol>
                        </div>
                    </div>
                    <div className="twoColumnRight"
                        style={{
                            display: "inline-block",
                            width: "50%",
                            verticalAlign: "top",
                            whiteSpace: "nowrap",
                            minWidth: "370px"
                        }}>
                        <br />
                        <table className="inputTable"
                            style={{
                                display: "inline-block",
                                marginLeft: "10px"
                            }}
                            cellPadding="5px">
                            <tbody>
                                <tr>
                                    <td>{props.type}</td>
                                    <td>{(props.type === "DNA") ?
                                        <><select className="dnaDropMenu" value={select} onChange={handleDropDownMenu}>
                                            <option value="dsDNA" data-EX={260} data-CF={50} data-MW={-99}>dsDNA</option>
                                            <option value="ssDNA" data-EX={260} data-CF={33} data-MW={-99}>ssDNA</option>
                                            <option value="custom" data-EX={-99} data-CF={-99} data-MW={-99}>Custom sequence</option>
                                        </select></> :
                                        <><select className="rnaDropMenu" value={select} onChange={handleDropDownMenu}>
                                            <option value="ssRNA" data-EX={260} data-CF={40} data-MW={-99}>ssRNA</option>
                                            <option value="custom" data-EX={-99} data-CF={-99} data-MW={-99}>Custom sequence</option>
                                        </select></>}
                                    </td>
                                </tr>
                                {(props.type === "DNA" && select === "custom") ? renderDnaCustomSec() :
                                    (props.type === "RNA" && select === "custom") ? renderRnaCustomSec() : ""}
                                <tr>
                                    <td>Absorbance at λ<sub>max</sub></td>
                                    <td><input
                                        type="number"
                                        onChange={handleInputAbsorbance}
                                        placeholder="at 260 nm"
                                    />
                                    </td>
                                </tr>
                                <tr>
                                    <td>Dilution factor (optional)</td>
                                    <td><input
                                        type="number"
                                        onChange={handleInputDilutionFactor}
                                        placeholder=""
                                    />
                                    </td>
                                </tr>
                                <tr>
                                    <td>Pathlength</td>
                                    <td><input
                                        type="number"
                                        onChange={handleInputPathlength}
                                        placeholder="standard is 1 cm"
                                    /> cm
                                    </td>
                                </tr>
                                <br /><br />
                                <tr>
                                    <input
                                        type="button"
                                        className="calculateButton"
                                        onClick={handleCalculateButtonClick}
                                        value="Calculate"
                                        style={{
                                            backgroundColor: "#FFC23A",
                                            border: "solid 1px #815900",
                                            padding: "5px 10px"
                                        }}
                                    />
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </>
        )
    }

    const renderGenericCustomSec = () => {
        return (
            <>
                <tr>
                    <td>Name</td>
                    <td>Not identified</td>
                </tr>
                <tr>
                    <td>MW</td>
                    <td>
                        {(mw > 0) ? <> {RoundSigFig((mw / 1000), 2)} kDA </> :
                            (validSeq === false) ? "Invalid or unrecognized sequence" :
                                "Waiting for sequence"}</td>
                </tr>
                <tr>
                    <td>Extinction coefficient</td>
                    <td>
                        {(ec > 0) ? <> {ec} M<sup>-1</sup> cm<sup>-1</sup></> :
                            (validSeq === false) ? "Invalid or unrecognized sequence" :
                                "Waiting for sequence"}</td>
                </tr>
            </>
        )
    }

    const renderDnaCustomSec = () => {
        return (
            <>
                <tr>
                    <td>Sequence</td>
                    <td><textarea
                        style={{ width: "100%", minHeight: "50px", resize: "none" }}
                        placeholder="Enter sense strand, anti-sense automatic for dsDNA (example: ATTCG)"
                        value={sequence}
                        onChange={handleKeyPress}
                    >
                    </textarea></td>
                </tr>
                <tr>
                    <td>Type</td>
                    <td>
                        <input type="radio" onClick={handleRadioButtonClick} value="dsDNA" name="strand" defaultChecked /> dsDNA
                        <input type="radio" onClick={handleRadioButtonClick} value="ssDNA" name="strand" /> ssDNA
                    </td>
                </tr>
                {renderGenericCustomSec()}
            </>
        )
    }

    const renderRnaCustomSec = () => {
        return (
            <>
                <tr>
                    <td>Sequence</td>
                    <td><textarea
                        style={{ width: "100%", minHeight: "50px", resize: "none" }}
                        placeholder="example: AAGCU"
                        value={sequence}
                        onChange={handleKeyPress}
                    >
                    </textarea></td>
                </tr>
                {renderGenericCustomSec()}
            </>
        )
    }

    const renderEquationResults = () => {
        return (
            <>
                <tr>
                    <td>Concentration</td>
                    <td>=</td>
                    <td>
                        <div style={{
                            paddingBottom: "3px",
                            marginBottom: "3px",
                            borderBottom: "solid 1px black"
                        }}>Absorbance at λ<sub>max</sub></div>
                        <div>Extinction coefficient&nbsp;&nbsp;&nbsp;×&nbsp;&nbsp;&nbsp;Pathlength</div>
                    </td>
                    <td>×</td>
                    <td>Molecular weight</td>
                    <td>×</td>
                    <td>Dilution Factor</td>
                </tr>
                <tr>
                    <td></td>
                    <td>=</td>
                    <td>
                        <div style={{
                            paddingBottom: "3px",
                            marginBottom: "3px",
                            borderBottom: "solid 1px black"
                        }}>{resultsABS}</div>
                        <div>{resultsEC} M<sup>-1</sup> cm<sup>-1</sup>&nbsp;&nbsp;&nbsp;×&nbsp;&nbsp;&nbsp;{resultsPL} cm</div>
                    </td>
                    <td>×</td>
                    <td>{(RoundSigFig((resultsMW / 1000), 2)) * 1000} g/mol</td>
                    <td>×</td>
                    <td>{resultsDF}</td>
                </tr>
                <tr>
                    <td></td>
                    <td>=</td>
                    <td style={{ color: "blue", textAlign: "left", fontWeight: "bold" }}>
                        {(results === "missing") ? "Error: Missing input" :
                            (results === "invalid") ? "Error: Invalid input" :
                                (results === "errorEC") ? "Error: Invalid extinction coefficient value" :
                                    (results === "errorPL") ? "Error: Invalid pathlength value" :
                                        (results === "error") ? "Error: Unable to calculate concentration" : results + " mg/mL"}
                    </td>
                </tr>
            </>
        )
    }

    const renderRatioResults = () => {
        return (
            <>
                <tr>
                    <td>Concentration</td>
                    <td>=</td>
                    <td>
                        <div style={{
                            paddingBottom: "3px",
                            marginBottom: "3px",
                            borderBottom: "solid 1px black"
                        }}>Absorbance at λ<sub>max</sub></div>
                        <div>Pathlength</div>
                    </td>
                    <td>×</td>
                    <td>Conversion Factor</td>
                    <td>×</td>
                    <td>Dilution Factor</td>
                </tr>
                <tr>
                    <td></td>
                    <td>=</td>
                    <td>
                        <div style={{
                            paddingBottom: "3px",
                            marginBottom: "3px",
                            borderBottom: "solid 1px black"
                        }}>{resultsABS}</div>
                        <div>{resultsPL} cm</div>
                    </td>
                    <td>×</td>
                    <td>{resultsCF} &micro;g/mol</td>
                    <td>×</td>
                    <td>{resultsDF}</td>
                </tr>
                <tr>
                    <td></td>
                    <td>=</td>
                    <td style={{ color: "blue", textAlign: "left", fontWeight: "bold" }}>
                        {(results === "missing") ? "Error: Missing input" :
                            (results === "invalid") ? "Error: Invalid input" :
                                (results === "errorEC") ? "Error: Invalid extinction coefficient value" :
                                    (results === "errorPL") ? "Error: Invalid pathlength value" :
                                        (results === "error") ? "Error: Unable to calculate concentration" : <>{results} &micro;g/mL</>}
                    </td>
                </tr>
            </>
        )
    }

    const renderResults = () => {
        return (
            <div className="displayResults">
                <h3>Results</h3>
                <table
                    cellPadding="5px"
                    style={{
                        marginLeft: "-5px",
                        textAlign: "center",
                        whiteSpace: "nowrap"
                    }}
                    className="resultsTable">
                    <tbody>
                        {(select === "custom") ? renderEquationResults() : renderRatioResults()}
                    </tbody>
                </table>
            </div>
        )
    }

    const renderReferences = () => {
        return (
            <div className="References">
                <br />
                <hr />
                <h3>References</h3>
                <table className="refTable" style={{ whiteSpace: "nowrap" }}>
                    <colgroup>
                        <col style={{ width: "5%" }}></col>
                        <col style={{ width: "95%" }}></col>
                    </colgroup>
                    <tbody>
                        <tr><td colSpan={2}>This online tool may be cited as follows</td></tr>
                        <tr>
                            <td style={{ fontWeight: "bold" }}>MLA</td>
                            <td>{(props.type === "DNA") ? <>"Quest Calculate&trade; DNA Concentration Calculator." <span style={{ fontStyle: "italic" }}>AAT Bioquest, Inc</span>, 08 Dec. 2021, https://www.aatbio.com/tools/calculate-DNA-concentration.</>
                                : <>"Quest Calculate&trade; RNA Concentration Calculator." <span style={{ fontStyle: "italic" }}>AAT Bioquest, Inc</span>, 09 Dec. 2021, https://www.aatbio.com/tools/calculate-RNA-concentration.</>}</td>
                        </tr>
                        <tr>
                            <td style={{ fontWeight: "bold" }}>APA</td>
                            <td>{(props.type === "DNA") ? <>AAT Bioquest, Inc. (2021, December 08). <span style={{ fontStyle: "italic" }}>Quest Calculate&trade; DNA Concentration Calculator</span>. Retrieved from https://www.aatbio.com/tools/calculate-DNA-concentration</>
                                : <>AAT Bioquest, Inc. (2021, December 09). <span style={{ fontStyle: "italic" }}>Quest Calculate&trade; RNA Concentration Calculator</span>. Retrieved from https://www.aatbio.com/tools/calculate-RNA-concentration</>}</td>
                        </tr>
                    </tbody>
                </table>
            </div >
        )
    }

    return (
        <>
            <div
                className="pageContent"
                style={{
                    fontSize: "14px",
                    font: "sans-serif",
                    width: "100%"
                }}>
                {renderPageContent()}
                {(results === null) ? "" : renderResults()}
                {renderReferences()}
            </div>
        </>
    )
}

export default DnaRnaConcentrationCalculator;