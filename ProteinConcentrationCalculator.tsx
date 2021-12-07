import React, { useState, useEffect } from 'react';
import { RoundSigFig } from './Rounding'

const ProteinConcentrationCalculator = (props: any) => {
  const [selectProtein, _selectProtein] = useState("IgG");
  const [sequence, _sequence] = useState("");
  const [mw, _mw] = useState(150000);
  const [ec, _ec] = useState(210000);
  const [absorbance, _absorbance] = useState(0);
  const [dilutionFactor, _dilutionFactor] = useState(1);
  const [pathlength, _pathlength] = useState(0);
  const [validSeq, _validSeq] = useState<boolean | null>(null);
  const [resultsMW, _resultsMW] = useState(0);
  const [resultsEC, _resultsEC] = useState(0);
  const [resultsABS, _resultsABS] = useState(0);
  const [resultsDF, _resultsDF] = useState(0);
  const [resultsPL, _resultsPL] = useState(0);
  const [results, _results] = useState<number | string | null>(null);

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

  const handleKeyPress = (event: any) => {
    const string = event.target.value.replaceAll(/[^a-zA-z]/g, "");
    _sequence(string);
  }

  const calculateResult = () => {
    const value = absorbance * mw * dilutionFactor / (ec * pathlength);
    return value;
  }

  const handleDropDownMenu = (event: any) => {
    const state = event.target.value;
    _selectProtein(state);
    let valueEC = event.target[event.target.selectedIndex].getAttribute('data-ec');
    _ec(valueEC);
    let valueMW = event.target[event.target.selectedIndex].getAttribute('data-mw');
    _mw(valueMW);
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
    _selectProtein(state);
  }

  const handleCalculateButtonClick = (event: any) => {
    _resultsABS(absorbance);
    _resultsDF(dilutionFactor);
    _resultsEC(ec);
    _resultsMW(mw);
    _resultsPL(pathlength);
    const value = RoundSigFig(calculateResult(), 2);
    //_results("missing") returns missing input error
    if (absorbance === 0 || pathlength === 0 || (selectProtein === "custom" && sequence === "")) { _results("missing") }
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
          <h1>Protein Concentration Calculator</h1>
          The concentration of Protein in solution can be determined by substituting the molecular weight, extinction coefficient and λ<sub>max</sub> into a derived form of the Beer-Lambert Law. A substance's λ<sub>max</sub> is the wavelength at which it experiences the strongest absorbance. For Protein, this wavelength is 280 nm.
          <br /><br />
          The absorbance at λ<sub>max</sub> can be measured using a spectrophotometer. There are some important things to keep in mind when measuring 280 absorbance:
          <br /><br />
          <ol>
            <li>The Protein should be well-dissolved in solution. Protein precipitation will cause inaccuracies in concentration calculations.</li>
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
                <li>Select the protein. Or select <span style={{ color: "red", fontWeight: "bold", cursor: "pointer" }} onClick={handleMouseClick}>"custom sequence"</span> to enter the amino acid sequence or the UniProt ID.</li>
                <br />
                <li>Enter the absorbance at λ<sub>max</sub>. For a typical protein, λ<sub>max</sub> is 280 nm. However, this value may change based on the protein. Please use the maximum absorbance as indicated by the spectrophotometric reading (ie. highest peak).</li>
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
                  <td>Protein</td>
                  <td><select className="proteinDropMenu" value={selectProtein} onChange={handleDropDownMenu}>
                    <option value="IgG" data-ex={280} data-ec={210000} data-mw={150000} data-ctype="equation">IgG - Immunoglobulin G</option>
                    <option value="BSA" data-ex={280} data-ec={43824} data-mw={66463} data-ctype="equation">BSA - Bovine serum albumin</option>
                    <option value="PE" data-ex={565} data-ec={1960000} data-mw={240000} data-ctype="equation">PE - Phycoerythrin</option>
                    <option value="APC" data-ex={650} data-ec={700000} data-mw={105000} data-ctype="equation">APC - Allophycocyanin</option>
                    <option value="Streptavidin" data-ex={280} data-ec={176000} data-mw={55000} data-ctype="equation">Streptavidin</option>
                    <option className="customOption" value="custom" data-ex={280} data-ec={-99} data-mw={-99} data-ctype="equation">Custom sequence</option>
                  </select></td>
                </tr>
                {(selectProtein === "custom") ? renderCustomSequenceSection() : ""}
                <tr>
                  <td>Absorbance at λ<sub>max</sub></td>
                  <td><input
                    type="number"
                    onChange={handleInputAbsorbance}
                    placeholder="at 280 nm"
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

  const renderCustomSequenceSection = () => {
    return (
      <>
        < tr>
          <td>Sequence</td>
          <td><textarea
            className="sequenceArea"
            style={{ width: "100%", minHeight: "50px", resize: "none" }}
            placeholder="example: AlaLysVal or AKV or UniProt ID (eg. P02769 for BSA)"
            value={sequence}
            onChange={handleKeyPress}
          >
          </textarea></td>
        </tr>
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
              <td>{(selectProtein === "custom") ? (RoundSigFig((resultsMW / 1000), 2)) * 1000 : resultsMW} g/mol</td>
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
              <td >"Quest Calculate&trade; Protein Concentration Calculator." <span style={{ fontStyle: "italic" }}>AAT Bioquest, Inc</span>, 30 Nov.2021, https://www.aatbio.com/tools/calculate-protein-concentration.</td>
            </tr>
            <tr>
              <td style={{ fontWeight: "bold" }}>APA</td>
              <td >AAT Bioquest, Inc.(2021, November 30).<span style={{ fontStyle: "italic" }}>Quest Calculate™ Protein Concentration Calculator</span>. Retrieved from https://www.aatbio.com/tools/calculate-protein-concentration</td>
            </tr>
            <br />
            <tr><td colSpan={2}>This online tool has been cited in the following publications</td></tr>
            <tr><td colSpan={2}><a href="https://bsppjournals.onlinelibrary.wiley.com/doi/full/10.1111/mpp.13045" target="_blank" rel="noopener noreferrer" style={{ color: "blue", textDecoration: "none" }}>A haustorial-expressed lytic polysaccharide monooxygenase from the cucurbit powdery mildew pathogen <span style={{ fontStyle: "italic" }}>Podosphaera xanthii</span> contributes to the suppression of chitin-triggered immunity</a></td></tr>
            <tr><td colSpan={2}><span style={{ fontWeight: "bold" }}>Authors</span>: &Aacute;lvaro Polonio, Dolores Fern&aacute;ndez-Ortu&ntilde;o, Antonio de Vicente, Alejandro P&eacute;rez-Garc&iacute;a</td></tr>
            <tr><td colSpan={2}><span style={{ fontWeight: "bold" }}>Journal</span>: Molecular Plant Pathology (2021)</td></tr>
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

export default ProteinConcentrationCalculator;