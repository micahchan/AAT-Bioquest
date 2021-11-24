import React, { useState, useEffect } from 'react';
import { RoundSigFig } from './Rounding'

const ProteinConcentrationCalculator = (props: any) => {
  const [selectProtein, _selectProtein] = useState("IgG");
  const [sequence, _sequence] = useState("");
  const [mw, _mw] = useState(150000);
  const [ec, _ec] = useState(210000);
  const [absorbance, _absorbance] = useState(0);
  const [dilutionFactor, _dilutionFactor] = useState(1);
  const [pathlength, _pathlength] = useState(1);
  const [results, _results] = useState<Object | null>(null);

  const calculateResult = () => {
    const value = absorbance * mw * dilutionFactor / (ec * pathlength);
    return value;
  }

  const calculatePeptideValues = () => {
    const aa_3: string[] = new Array('ALA', 'ARG', 'ASN', 'ASP', 'CYS', 'GLU', 'GLN', 'GLY', 'HIS', 'ILE', 'LEU', 'LYS', 'MET', 'PHE', 'PRO', 'SER', 'THR', 'TRP', 'TYR', 'VAL');
    const aa_1: string[] = new Array('A', 'R', 'N', 'D', 'C', 'E', 'Q', 'G', 'H', 'I', 'L', 'K', 'M', 'F', 'P', 'S', 'T', 'W', 'Y', 'V');
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
    _mw(pMW);
    _ec(pEC);
  }

  useEffect(() => {
    calculatePeptideValues();
  }, [sequence])

  const handleKeyPress = (event: any) => {
    const string = event.target.value.replaceAll(/[^a-zA-z]/g, "");
    _sequence(string);
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
    const value = event.target.value;
    _absorbance(value);
  }

  const handleInputDilutionFactor = (event: any) => {
    const value = event.target.value;
    _dilutionFactor(value);
  }

  const handleInputPathlength = (event: any) => {
    const value = event.target.value;
    _pathlength(value);
  }

  const handleCalculateButtonClick = (event: any) => {
    const value = RoundSigFig(calculateResult(), 2);
    _results(value);
  }

  return (
    <>
      <table className="inputTable" style={{ width: "100%", display: "block" }}>
        <tbody>
          <tr>
            <td>Protein</td>
            <td><select className="selectProtein" onChange={handleDropDownMenu}>
              <option value="IgG" data-ex={280} data-ec={210000} data-mw={150000} data-ctype="equation">IgG - Immunoglobulin G</option>
              <option value="BSA" data-ex={280} data-ec={43824} data-mw={66463} data-ctype="equation">BSA - Bovine serum albumin</option>
              <option value="PE" data-ex={565} data-ec={1960000} data-mw={240000} data-ctype="equation">PE - Phycoerythrin</option>
              <option value="APC" data-ex={650} data-ec={700000} data-mw={105000} data-ctype="equation">APC - Allophycocyanin</option>
              <option value="Streptavidin" data-ex={280} data-ec={176000} data-mw={55000} data-ctype="equation">Streptavidin</option>
              <option className="customOption" value="custom" data-ex={280} data-ec={-99} data-mw={-99} data-ctype="equation">Custom sequence</option>
            </select></td>
          </tr>
          {/*Custom protein sequence layout only appears if option is chosen from drop down menu */}
          {(selectProtein === "custom") ?
            <>
              < tr className="customSeq" style={{ display: "table-row" }}>
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
              <tr className="customSeq" style={{ display: "table-row" }}>
                <td>Name</td>
                <td className="pName">Not identified</td>
              </tr>
              <tr className="customSeq" style={{ display: "table-row" }}>
                <td>MW</td>
                <td className="pMW">
                  {(mw > 0) ? <> {mw} DA </> : "Waiting for sequence"}</td>
              </tr>
              <tr className="customSeq" style={{ display: "table-row" }}>
                <td>Extinction coefficient</td>
                <td className="pEC">
                  {(ec > 0) ? <> {ec} M<sup>-1</sup> cm<sup>-1</sup></> : "Waiting for sequence"}</td>
              </tr>
            </>
            : ""}
          <tr>
            <td>Absorbance at λ<sub>max</sub></td>
            <td><input
              type="number"
              className="maxAbsorbance"
              onChange={handleInputAbsorbance}
              placeholder="at 280 nm"
            />
            </td>
          </tr>
          <tr>
            <td>Dilution factor (optional)</td>
            <td><input
              type="number"
              className="dilutionFactor"
              onChange={handleInputDilutionFactor}
              placeholder=""
            />
            </td>
          </tr>
          <tr>
            <td>Pathlength</td>
            <td><input
              type="number"
              className="pathlength"
              onChange={handleInputPathlength}
              placeholder="standard is 1 cm"
            /> cm
            </td>
          </tr>
          <tr>
            <input
              type="button"
              className="calculateButton"
              onClick={handleCalculateButtonClick}
              value="Calculate"
            />
          </tr>
          {(results === null) ? "" :
            <>
              <br />This is the result: {results}
            </>
          }
        </tbody>
      </table>
    </>
  )
}

export default ProteinConcentrationCalculator;