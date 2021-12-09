import React, { useState, useEffect } from 'react';
import { RoundSigFig } from './Rounding';

const DnaRnaConcentrationCalculator = (props: { type: "DNA" | "RNA" }) => {
    const [type, _type] = useState(props.type);
    const [selectDNA, _selectDNA] = useState("dsDNA");
    const [selectRNA, _selectRNA] = useState("ssRNA");
    const [strandType, _strandType] = useState("dsDNA");
    const [sequence, _sequence] = useState("");
    const [mw, _mw] = useState(-99);
    const [ec, _ec] = useState(-99);
    const [absorbance, _absorbance] = useState(0);
    const [dilutionFactor, _dilutionFactor] = useState(1);
    const [pathlength, _pathlength] = useState(0);
    const [cf, _cf] = useState(0);
    const [validSeq, _validSeq] = useState<boolean | null>(null);
    const [resultsMW, _resultsMW] = useState(0);
    const [resultsEC, _resultsEC] = useState(0);
    const [resultsABS, _resultsABS] = useState(0);
    const [resultsDF, _resultsDF] = useState(0);
    const [resultsPL, _resultsPL] = useState(0);
    const [resultsCF, _resultsCF] = useState(0);
    const [results, _results] = useState<number | string | null>(null);
    /*
        useEffect(() => {
            const calculatePeptideValues = () => {
                const aa_3: string[] = ['ALA', 'ARG', 'ASN', 'ASP', 'CYS', 'GLU', 'GLN', 'GLY', 'HIS', 'ILE', 'LEU', 'LYS', 'MET', 'PHE', 'PRO', 'SER', 'THR', 'TRP', 'TYR', 'VAL'];
                const aa_1: string[] = ['A', 'R', 'N', 'D', 'C', 'E', 'Q', 'G', 'H', 'I', 'L', 'K', 'M', 'F', 'P', 'S', 'T', 'W', 'Y', 'V'];
                const aaValuesObj: any = {
                    'ALA': 89.094, 'A': 89.094,
                    'ARG': 174.203, 'R': 174.203,
                    'ASN': 132.119, 'N': 132.119,
                    'ASP': 133.104, 'D': 133.104,
                    'CYS': 121.154, 'C': 121.154,
                    'GLU': 147.131, 'E': 147.131,
                    'GLN': 146.146, 'Q': 146.146,
                    'GLY': 75.067, 'G': 75.067,
                    'HIS': 155.156, 'H': 155.156,
                    'ILE': 131.175, 'I': 131.175,
                    'LEU': 131.175, 'L': 131.175,
                    'LYS': 146.189, 'K': 146.189,
                    'MET': 149.208, 'M': 149.208,
                    'PHE': 165.192, 'F': 165.192,
                    'PRO': 115.132, 'P': 115.132,
                    'SER': 105.093, 'S': 105.093,
                    'THR': 119.119, 'T': 119.119,
                    'TRP': 204.228, 'W': 204.228,
                    'TYR': 181.191, 'Y': 181.191,
                    'VAL': 117.148, 'V': 117.148
                };
                let aaType;
                let pMW = 0;
                let pEC = 0;
    
                const formattedSeq = sequence.toUpperCase();
                const splitCheck = formattedSeq.split("");
                const splitCheckThree = formattedSeq.match(/.{1,3}/g) || [];
    
                //checks to see if each part of the sequence fits within a value in the array of amino acids
                if (splitCheck.length % 3 === 0 && (splitCheckThree.every(r => aa_3.indexOf(r) >= 0) === true)) {
                    aaType = 't';
                }
                else if (splitCheck.every(r => aa_1.indexOf(r) >= 0) === true) {
                    aaType = 's';
                }
    
                if (aaType === 't') {
                    const splitCheckThree = formattedSeq.match(/.{1,3}/g) || [];
                    for (let i = 0; i < splitCheckThree.length; i++) {
                        const key = splitCheckThree[i];
                        if (splitCheckThree[i] === 'TRP') { pEC += 5690; }
                        if (splitCheckThree[i] === 'TYR') { pEC += 1280; }
                        if (splitCheckThree[i] === 'CYS') { pEC += 120; }
    
                        pMW += aaValuesObj[key];
                        if (splitCheckThree.length > 1 && i !== splitCheckThree.length - 1) { pMW -= 18.015; }
                    }
                }
                else if (aaType === 's') {
                    for (let i = 0; i < splitCheck.length; i++) {
                        const key = splitCheck[i];
                        if (splitCheck[i] === 'W') { pEC += 5690; }
                        if (splitCheck[i] === 'Y') { pEC += 1280; }
                        if (splitCheck[i] === 'C') { pEC += 120; }
    
                        pMW += aaValuesObj[key];
                        if (splitCheck.length > 1 && i !== splitCheck.length - 1) { pMW -= 18.015; }
                    }
                }
                if (aaType !== 's' && aaType !== 't') {
                    _mw(-99);
                    _ec(-99);
                    _validSeq(false);
                }
                else {
                    _mw(pMW);
                    _ec(pEC);
                    _validSeq(true);
                }
            }
    
            if (selectProtein === "custom") {
                _mw(-99);
                _ec(-99);
            }
    
            if (selectProtein !== "custom" || sequence === "" || sequence === undefined || sequence === null) { return; }
            else { calculatePeptideValues(); }
        }, [sequence, selectProtein])
    */
    const handleKeyPress = (event: any) => {
        const string = event.target.value.replaceAll(/[^a-zA-z]/g, "");
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
        if (props.type === "DNA") { _selectDNA(state) }
        else if (props.type === "RNA") { _selectRNA(state) }
        let valueCF = event.target[event.target.selectedIndex].getAttribute('data-ec');
        _ec(valueCF);
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
        if (props.type === "DNA") { _selectDNA(state) }
        else if (props.type === "RNA") { _selectRNA(state) }
    }

    const handleRadioButtonClick = (event: any) => {
        const state = event.target.value;
        _strandType(state);
    }

    const handleCalculateButtonClick = (event: any) => {
        _resultsABS(absorbance);
        _resultsDF(dilutionFactor);
        _resultsPL(pathlength);
        if (selectDNA !== "custom" || selectRNA !== "custom")
            //_resultsEC(ec);
            //_resultsMW(mw);
            _resultsCF(cf);
        const value = RoundSigFig(calculateRatioResult(), 2);
        //_results("missing") returns missing input error
        if (absorbance === 0 || pathlength === 0 || (selectDNA === "custom" && sequence === "") || (selectRNA === "custom" && sequence === "")) { _results("missing") }
        //_results("invalid") returns invalid input error
        else if (absorbance < 0 || pathlength < 0 || dilutionFactor < 0 || ec < 0 || mw < 0) { _results("invalid") }
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
                    <h1>{type} Concentration Calculator</h1>
                    The concentration of {type} in solution can be determined by substituting the molecular weight, extinction coefficient and λ<sub>max</sub> into a derived form of the Beer-Lambert Law. A substance's λ<sub>max</sub> is the wavelength at which it experiences the strongest absorbance. For {type}, this wavelength is 260 nm.
                    <br /><br />
                    The absorbance at λ<sub>max</sub> can be measured using a spectrophotometer. There are some important things to keep in mind when measuring 260 absorbance:
                    <br /><br />
                    <ol>
                        <li>The {type} should be well-dissolved in solution. {type} precipitation will cause inaccuracies in concentration calculations.</li>
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
                                    <td>{type}</td>
                                    <td>{(type === "DNA") ?
                                        <><select className="dnaDropMenu" value={selectDNA} onChange={handleDropDownMenu}>
                                            <option value="dsDNA" data-EX={260} data-EC={50} data-MW={-99}>dsDNA</option>
                                            <option value="ssDNA" data-EX={260} data-EC={33} data-MW={-99}>ssDNA</option>
                                            <option value="custom" data-EX={-99} data-EC={-99} data-MW={-99}>Custom sequence</option>
                                        </select></> :
                                        <><select className="rnaDropMenu" value={selectRNA} onChange={handleDropDownMenu}>
                                            <option value="ssRNA" data-EX={260} data-EC={40} data-MW={-99}>ssRNA</option>
                                            <option value="custom" data-EX={-99} data-EC={-99} data-MW={-99}>Custom sequence</option>
                                        </select></>}
                                    </td>
                                </tr>
                                {(type === "DNA" && selectDNA === "custom") ? renderDnaCustomSeq() :
                                    (type === "RNA" && selectRNA === "custom") ? renderRnaCustomSeq() : ""}
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

    const renderGenericCustomSeq = () => {
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
    }

    const renderDnaCustomSeq = () => {
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
                {renderGenericCustomSeq()}
            </>
        )
    }

    const renderRnaCustomSeq = () => {
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
                {renderGenericCustomSeq()}
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
                        <tr>{(selectRNA === "custom" || selectDNA === "custom") ?
                            <><
                        </>
                            : <><td>Concentration</td>
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
                                <td>Dilution Factor</td></>}
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
                            <td>{(selectDNA === "custom") ? (RoundSigFig((resultsMW / 1000), 2)) * 1000 : resultsMW} g/mol</td>
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
                            <td>{(type === "DNA") ? <>"Quest Calculate&trade; DNA Concentration Calculator." <span style={{ fontStyle: "italic" }}>AAT Bioquest, Inc</span>, 08 Dec. 2021, https://www.aatbio.com/tools/calculate-DNA-concentration.</>
                                : <>"Quest Calculate&trade; RNA Concentration Calculator." <span style={{ fontStyle: "italic" }}>AAT Bioquest, Inc</span>, 09 Dec. 2021, https://www.aatbio.com/tools/calculate-RNA-concentration.</>}</td>

                        </tr>
                        <tr>
                            <td style={{ fontWeight: "bold" }}>APA</td>
                            <td>{(type === "DNA") ? <>AAT Bioquest, Inc. (2021, December 08). <span style={{ fontStyle: "italic" }}>Quest Calculate&trade; DNA Concentration Calculator</span>. Retrieved from https://www.aatbio.com/tools/calculate-DNA-concentration</>
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